/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Webpack plugin
 *
 * @example
 * ```js
 * // webpack.config.js
 * import AutoGitLog from 'unplugin-auto-git-log/webpack'
 *
 * export default {
 *   plugins: [AutoGitLog()],
 * }
 * ```
 */
const webpack = AutoGitLog.webpack as typeof AutoGitLog.webpack
export default webpack
export { webpack as 'module.exports' }
