# unplugin-auto-git-log

[![Unit Test][unit-test-src]][unit-test-href]

Unplugin for automatically generating Git information (repo, branch, commit, etc.) in multiple output formats.

## Features

- 📦 Automatically extract Git repository information
- 🎯 Support multiple output formats:
  - JSON file
  - Window global variable (via define replacement and HTML injection)
- 🔧 Works with all major build tools (Vite, Webpack, Rollup, esbuild, Rspack, etc.)
- ⚙️ Configurable fields and output options
- 🚀 Compile-time injection for optimal performance

## Installation

```bash
npm i -D unplugin-auto-git-log
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import AutoGitLog from 'unplugin-auto-git-log/vite'

export default defineConfig({
  plugins: [AutoGitLog()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import AutoGitLog from 'unplugin-auto-git-log/rollup'

export default {
  plugins: [AutoGitLog()],
}
```

<br></details>

<details>
<summary>Rolldown / tsdown</summary><br>

```ts
// rolldown.config.ts / tsdown.config.ts
import AutoGitLog from 'unplugin-auto-git-log/rolldown'

export default {
  plugins: [AutoGitLog()],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import { build } from 'esbuild'
import AutoGitLog from 'unplugin-auto-git-log/esbuild'

build({
  plugins: [AutoGitLog()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```js
// webpack.config.js
import AutoGitLog from 'unplugin-auto-git-log/webpack'

export default {
  /* ... */
  plugins: [AutoGitLog()],
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// rspack.config.js
import AutoGitLog from 'unplugin-auto-git-log/rspack'

export default {
  /* ... */
  plugins: [AutoGitLog()],
}
```

<br></details>

## Configuration

### Default Behavior

By default, the plugin will:

- **Be enabled** (`enable: true`)
- Extract all available Git fields (repo, branch, commit, commitShort, author, authorEmail, commitTime, commitMessage, isDirty)
- Generate a JSON file at your build output directory (e.g., `dist/git-log.json` for Vite)
- Automatically detect the output directory from your build tool configuration
- Run after build completion

You can use the plugin without any configuration:

```ts
// vite.config.ts
import AutoGitLog from 'unplugin-auto-git-log/vite'

export default defineConfig({
  plugins: [AutoGitLog()], // That's it!
})
```

### Advanced Configuration

```ts
AutoGitLog({
  // Enable/disable the plugin (default: true)
  enable: true,

  // Git fields to include (default: all)
  fields: ['repo', 'branch', 'commit', 'commitShort', 'author', 'authorEmail', 'commitTime', 'commitMessage', 'isDirty'],

  // Output options
  outputs: {
    // Generate JSON file (default: 'git-log.json' in output directory)
    json: {
      fileName: 'git-log.json', // Relative to build output directory
    },

    // Generate window global variable (default: '__GIT_LOG__')
    // Uses define replacement for compile-time injection
    window: {
      varName: '__GIT_LOG__', // Global variable name
      console: true, // Log Git log to browser console (default: false)
    },
  },

  // Working directory (optional, defaults to process.cwd())
  // cwd: './custom-path',
})
```

### Disable the Plugin

You can conditionally disable the plugin based on environment:

```ts
import AutoGitLog from 'unplugin-auto-git-log/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoGitLog({
      enable: process.env.NODE_ENV === 'production', // Only enable in production
    }),
  ],
})
```

Or completely disable it:

```ts
AutoGitLog({
  enable: false, // Plugin will not generate any files
})
```

## Git Fields

The following Git information can be extracted:

- `repo` - Repository name (extracted from remote URL or directory name)
- `branch` - Current branch name (handles detached HEAD state)
- `commit` - Full commit hash
- `commitShort` - Short commit hash (7 characters)
- `author` - Author name
- `authorEmail` - Author email
- `commitTime` - Commit timestamp (ISO 8601 format)
- `commitMessage` - Commit message (first line, newlines removed)
- `tag` - Current tag if HEAD points to a tag
- `isDirty` - Whether the working directory has uncommitted changes
- `remoteUrl` - Remote repository URL (e.g., `https://github.com/user/repo.git`)
- `root` - Git repository root directory path

## Output Examples

### JSON Output

By default, the JSON file is generated at your build output directory (e.g., `dist/git-log.json`):

```json
{
  "repo": "https://github.com/user/repo.git",
  "branch": "main",
  "commit": "abc123def456...",
  "commitShort": "abc123d",
  "author": "John Doe",
  "authorEmail": "john@example.com",
  "commitTime": "2025-01-08T12:00:00.000Z",
  "commitMessage": "feat: add new feature",
  "isDirty": false
}
```

### Window Variable Output

When window output is enabled, the plugin will:

1. **For Vite**: Automatically inject a `<script>` tag into your HTML `<head>` section
2. **For other build tools**: Use define replacement to inject the variable at compile time
3. Optionally log Git log to browser console (with `console: true`)

You can then access the Git log anywhere in your code:

```typescript
// In your browser code
console.log(window.__GIT_LOG__)
console.log(window.__GIT_LOG__.branch)
console.log(window.__GIT_LOG__.commit)
```

**How it works:**

- **Vite**: The plugin injects a `<script>` tag in the HTML that sets `window.__GIT_LOG__` before your code runs
- **Other build tools**: Uses define replacement - code references to `window.__GIT_LOG__` are replaced with the actual Git log object at compile time

**Example HTML injection (Vite):**

```html
<script>
  if (typeof window !== 'undefined') {
    window.__GIT_LOG__ = {"repo":"...","branch":"main",...};
    // console.log('[Git Log]', window.__GIT_LOG__); // if console: true
  }
</script>
```

**Note**: For non-Vite build tools, you need to reference `window.__GIT_LOG__` in your code for the define replacement to work.

## License

[MIT](./LICENSE) License © 2025-PRESENT [Drswith](https://github.com/Drswith)

<!-- Badges -->

[unit-test-src]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml
