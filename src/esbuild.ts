/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import AutoGitLog from 'unplugin-auto-git-log/esbuild'
 *
 * build({ plugins: [AutoGitLog()] })
```
 */
const esbuild = AutoGitLog.esbuild as typeof AutoGitLog.esbuild
export default esbuild
export { esbuild as 'module.exports' }
