/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import AutoGitLog from 'unplugin-auto-git-log/rollup'
 *
 * export default {
 *   plugins: [AutoGitLog()],
 * }
 * ```
 */
const rollup = AutoGitLog.rollup as typeof AutoGitLog.rollup
export default rollup
export { rollup as 'module.exports' }
