/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { AutoGitInfo } from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import AutoGitInfo from 'unplugin-auto-git-info/vite'
 *
 * export default defineConfig({
 *   plugins: [AutoGitInfo()],
 * })
 * ```
 */
const vite = AutoGitInfo.vite as typeof AutoGitInfo.vite
export default vite
export { vite as 'module.exports' }
