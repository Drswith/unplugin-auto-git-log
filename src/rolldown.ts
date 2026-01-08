/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import AutoGitLog from 'unplugin-auto-git-log/rolldown'
 *
 * export default {
 *   plugins: [AutoGitLog()],
 * }
 * ```
 */
const rolldown = AutoGitLog.rolldown as typeof AutoGitLog.rolldown
export default rolldown
export { rolldown as 'module.exports' }
