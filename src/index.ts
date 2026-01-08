import type { UnpluginInstance } from 'unplugin'
import type { Options } from './core/options'
import { createUnplugin } from 'unplugin'
import { getGitLog } from './core/git'
import { resolveOptions } from './core/options'
import { generateOutputs } from './core/outputs'

export const AutoGitLog: UnpluginInstance<Options | undefined, false>
  = createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    let outputDir: string | undefined
    let windowVarFileName: string | undefined

    const name = 'unplugin-auto-git-log'
    return {
      name,
      enforce: options.enforce,

      configResolved(config: any) {
        // 从配置中获取输出目录
        if ('vite' in config) {
          // Vite
          const viteConfig = config as any
          outputDir = viteConfig.build?.outDir || viteConfig.vite?.config?.build?.outDir
        }
        else if ('webpack' in config) {
          // Webpack
          const webpackConfig = config as any
          outputDir = webpackConfig.output?.path
        }
        else if ('output' in config && typeof (config as any).output === 'object') {
          // Rollup/Rolldown
          const rollupConfig = config as any
          outputDir = rollupConfig.output?.dir
        }

        // 如果没有获取到输出目录，使用默认值 'dist'
        if (!outputDir) {
          outputDir = 'dist'
        }
      },

      buildEnd() {
        // 检查插件是否启用
        if (!options.enable) {
          return
        }

        // 获取 Git 日志
        const gitLog = getGitLog(options.fields, options.cwd)

        // 如果没有配置任何输出，默认生成 JSON
        const hasOutputs
          = options.outputs
            && (options.outputs.json
              || options.outputs.window
              || options.outputs.env
              || options.outputs.types)

        if (hasOutputs) {
          // 根据配置生成输出，并获取 window 变量文件名
          windowVarFileName = generateOutputs(gitLog, options.outputs, outputDir)
        }
        else {
          // 默认只生成 JSON
          generateOutputs(gitLog, { json: {} }, outputDir)
        }
      },

      vite: {
        transformIndexHtml(html) {
          // 如果配置了 window 输出，在 HTML 中注入 script 标签
          if (options.outputs?.window && windowVarFileName) {
            return {
              html,
              tags: [
                {
                  tag: 'script',
                  attrs: {
                    src: `/${windowVarFileName}`,
                  },
                  injectTo: 'head',
                },
              ],
            }
          }
        },
      },
    }
  })
