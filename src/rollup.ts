/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import AutoGitInfo from 'unplugin-auto-git-info/rollup'
 *
 * export default {
 *   plugins: [AutoGitInfo()],
 * }
 * ```
 */
const rollup = AutoGitInfo.rollup as typeof AutoGitInfo.rollup
export default rollup
export { rollup as 'module.exports' }
