/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import AutoGitInfo from 'unplugin-auto-git-info/esbuild'
 *
 * build({ plugins: [AutoGitInfo()] })
```
 */
const esbuild = AutoGitInfo.esbuild as typeof AutoGitInfo.esbuild
export default esbuild
export { esbuild as 'module.exports' }
