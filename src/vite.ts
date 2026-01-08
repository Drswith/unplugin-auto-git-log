/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { AutoGitLog } from './index'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import AutoGitLog from 'unplugin-auto-git-log/vite'
 *
 * export default defineConfig({
 *   plugins: [AutoGitLog()],
 * })
 * ```
 */
const vite = AutoGitLog.vite as typeof AutoGitLog.vite
export default vite
export { vite as 'module.exports' }
