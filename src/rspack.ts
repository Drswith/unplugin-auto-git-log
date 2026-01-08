/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```js
 * // rspack.config.js
 * import AutoGitLog from 'unplugin-auto-git-log/rspack'
 *
 * export default {
 *   plugins: [AutoGitLog()],
 * }
 * ```
 */
const rspack = AutoGitLog.rspack as typeof AutoGitLog.rspack
export default rspack
export { rspack as 'module.exports' }
