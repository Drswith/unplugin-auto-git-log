/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```js
 * // rspack.config.js
 * import AutoGitInfo from 'unplugin-auto-git-info/rspack'
 *
 * export default {
 *   plugins: [AutoGitInfo()],
 * }
 * ```
 */
const rspack = AutoGitInfo.rspack as typeof AutoGitInfo.rspack
export default rspack
export { rspack as 'module.exports' }
