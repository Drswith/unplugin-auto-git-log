# unplugin-auto-git-log

[![Unit Test][unit-test-src]][unit-test-href]

Unplugin for automatically generating Git information (repo, branch, commit, etc.) in multiple output formats.

## Features

- 📦 Automatically extract Git repository information
- 🎯 Support multiple output formats:
  - JSON file
  - Window global variable
  - Environment variables (.env)
  - TypeScript type definitions
- 🔧 Works with all major build tools (Vite, Webpack, Rollup, esbuild, Rspack, etc.)
- ⚙️ Configurable fields and output options

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
- Run after build (`enforce: 'post'`)

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

    // Generate window global variable file (default: '__GIT_INFO__')
    window: {
      varName: '__GIT_INFO__',
    },

    // Generate environment variables file (default: '.env.git')
    env: {
      prefix: '__GIT_',
      file: '.env.git',
    },

    // Generate TypeScript type definitions (default: 'git-log.d.ts' in output directory)
    types: {
      fileName: 'git-log.d.ts', // Relative to build output directory
    },
  },

  // Working directory (optional, defaults to process.cwd())
  // cwd: './custom-path',

  // Plugin execution timing
  enforce: 'post', // 'pre' | 'post'
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

- `repo` - Repository URL
- `branch` - Current branch name
- `commit` - Full commit hash
- `commitShort` - Short commit hash (7 characters)
- `author` - Author name
- `authorEmail` - Author email
- `commitTime` - Commit timestamp
- `commitMessage` - Commit message
- `isDirty` - Whether the working directory has uncommitted changes

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

### Window Variable Output (`__GIT_INFO__.js`)

```js
;(function() {
  if (typeof window !== 'undefined') {
    window.__GIT_INFO__ = { /* git info */ }
  }
})()
```

### Environment Variables (`.env.git`)

```bash
__GIT_REPO=https://github.com/user/repo.git
__GIT_BRANCH=main
__GIT_COMMIT=abc123def456...
__GIT_COMMIT_SHORT=abc123d
__GIT_AUTHOR=John Doe
__GIT_AUTHOR_EMAIL=john@example.com
__GIT_COMMIT_TIME=2025-01-08T12:00:00.000Z
__GIT_COMMIT_MESSAGE=feat: add new feature
__GIT_IS_DIRTY=false
```

## License

[MIT](./LICENSE) License © 2025-PRESENT [Drswith](https://github.com/Drswith)

<!-- Badges -->

[unit-test-src]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml
