/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import AutoGitLog from 'unplugin-auto-git-log/farm'
 *
 * export default {
 *   plugins: [AutoGitLog()],
 * }
 * ```
 */
const farm = AutoGitLog.farm as typeof AutoGitLog.farm
export default farm
export { farm as 'module.exports' }
