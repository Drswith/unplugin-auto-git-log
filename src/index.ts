import type { UnpluginInstance } from 'unplugin'
import type { Options } from './core/options'
import { createUnplugin } from 'unplugin'
import { getGitInfo } from './core/git'
import { resolveOptions } from './core/options'
import { generateOutputs } from './core/outputs'

export const AutoGitLog: UnpluginInstance<Options | undefined, false>
  = createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)

    const name = 'unplugin-auto-git-log'
    return {
      name,
      enforce: options.enforce,

      buildEnd() {
        // 获取 Git 信息
        const gitInfo = getGitInfo(options.fields, options.cwd)

        // 如果没有配置任何输出，默认生成 JSON
        const hasOutputs
          = options.outputs
            && (options.outputs.json
              || options.outputs.window
              || options.outputs.env
              || options.outputs.types)

        if (hasOutputs) {
          // 根据配置生成输出
          generateOutputs(gitInfo, options.outputs, options.cwd)
        }
        else {
          // 默认只生成 JSON
          generateOutputs(gitInfo, { json: {} }, options.cwd)
        }
      },
    }
  })
