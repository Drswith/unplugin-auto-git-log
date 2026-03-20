/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.js
 * import AutoGitInfo from 'unplugin-auto-git-info/farm'
 *
 * export default {
 *   plugins: [AutoGitInfo()],
 * }
 * ```
 */
const farm = AutoGitInfo.farm as typeof AutoGitInfo.farm
export default farm
export { farm as 'module.exports' }
