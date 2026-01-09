import type { UnpluginInstance } from 'unplugin'
import type { Options } from './core/options'
import { resolve } from 'node:path'
import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { getGitLog } from './core/git'
import { resolveOptions } from './core/options'
import { generateOutputs } from './core/outputs'

/**
 * 从构建工具配置中获取输出目录
 * 支持 Vite、Webpack、Rollup/Rolldown 等构建工具
 */
function getOutputDir(config: any, cwd?: string): string {
  const projectRoot = cwd || process.cwd()

  // Vite
  if ('vite' in config || config.vite) {
    const viteConfig = config.vite || config
    const outDir = viteConfig.build?.outDir
    if (outDir) {
      return resolve(projectRoot, outDir)
    }
  }

  // Webpack
  if ('webpack' in config || config.output?.path) {
    const webpackConfig = config
    const outputPath = webpackConfig.output?.path
    if (outputPath) {
      return resolve(projectRoot, outputPath)
    }
  }

  // Rollup/Rolldown
  if (config.output?.dir) {
    const outputDir = config.output.dir
    return resolve(projectRoot, outputDir)
  }

  // 默认值
  return resolve(projectRoot, 'dist')
}

/**
 * 根据配置生成 Git 日志输出文件
 * 目前支持 JSON 文件输出
 */
function generateGitLogFiles(
  options: ReturnType<typeof resolveOptions>,
  outputDir: string,
): void {
  if (!options.enable) {
    return
  }

  // 获取 Git 日志
  const gitLog = getGitLog(options.fields, options.cwd)

  // 如果没有配置任何输出，默认生成 JSON
  const hasOutputs
    = options.outputs
      && (options.outputs.json
        || options.outputs.window)

  if (hasOutputs) {
    // 根据配置生成输出
    generateOutputs(gitLog, options.outputs, outputDir)
  }
  else {
    // 默认只生成 JSON
    generateOutputs(gitLog, { json: {} }, outputDir)
  }
}

export const AutoGitLog: UnpluginInstance<Options | undefined, false>
  = createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    let outputDir: string | undefined
    let gitLog: ReturnType<typeof getGitLog> | null = null
    const varName = options.outputs?.window?.varName || '__GIT_LOG__'
    const shouldConsole = options.enable && options.outputs?.window?.console === true

    const name = 'unplugin-auto-git-log'

    // 在插件初始化时获取 Git 日志，用于 define 替换和 HTML 注入
    if (options.enable && options.outputs?.window) {
      gitLog = getGitLog(options.fields, options.cwd)
    }

    return {
      name,
      enforce: 'post',

      /**
       * Define 配置：用于编译时替换
       * 对于非 Vite 构建工具，代码中的 window.__GIT_LOG__ 会被替换为实际的 Git 日志对象
       * 这样可以在编译时内联，无需额外的运行时文件
       */
      define: options.enable && options.outputs?.window && gitLog
        ? {
            [`window.${varName}`]: JSON.stringify(gitLog),
          }
        : {},

      /**
       * Vite 特定的 HTML 注入
       * 在 HTML 的 </head> 之前注入 script 标签，设置全局变量
       * 这种方式比 define 替换更可靠，因为不依赖代码中的引用
       */
      vite: {
        transformIndexHtml(html) {
          if (!options.enable || !options.outputs?.window || !gitLog) {
            return html
          }

          // 生成注入的 script 代码
          const gitLogJson = JSON.stringify(gitLog)
          const consoleLog = shouldConsole
            ? `\n  console.log('[Git Log]', window.${varName});`
            : ''

          const scriptCode = `<script>
  if (typeof window !== 'undefined') {
    window.${varName} = ${gitLogJson};${consoleLog}
  }
</script>`

          // 在 </head> 之前注入，确保在所有代码执行前设置全局变量
          return html.replace('</head>', `  ${scriptCode}\n</head>`)
        },
      },

      /**
       * 配置解析完成时，获取输出目录
       */
      configResolved(config: any) {
        outputDir = getOutputDir(config, options.cwd)
      },

      /**
       * 构建结束时生成 Git 日志文件
       * 每次构建都会重新生成，确保信息是最新的
       */
      buildEnd() {
        if (!options.enable) {
          return
        }

        generateGitLogFiles(options, outputDir || 'dist')
      },

      /**
       * Rollup/Vite 的 writeBundle hook
       * 确保在文件写入后生成 Git 日志文件
       */
      writeBundle() {
        if (!options.enable) {
          return
        }

        generateGitLogFiles(options, outputDir || 'dist')
      },
    }
  })
