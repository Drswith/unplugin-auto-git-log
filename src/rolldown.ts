/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import AutoGitInfo from 'unplugin-auto-git-info/rolldown'
 *
 * export default {
 *   plugins: [AutoGitInfo()],
 * }
 * ```
 */
const rolldown = AutoGitInfo.rolldown as typeof AutoGitInfo.rolldown
export default rolldown
export { rolldown as 'module.exports' }
