/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Webpack plugin
 *
 * @example
 * ```js
 * // webpack.config.js
 * import AutoGitInfo from 'unplugin-auto-git-info/webpack'
 *
 * export default {
 *   plugins: [AutoGitInfo()],
 * }
 * ```
 */
const webpack = AutoGitInfo.webpack as typeof AutoGitInfo.webpack
export default webpack
export { webpack as 'module.exports' }
