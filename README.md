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

```ts
AutoGitLog({
  // Git fields to include (default: all)
  fields: ['repo', 'branch', 'commit', 'commitShort', 'author', 'authorEmail', 'commitTime', 'commitMessage', 'isDirty'],

  // Output options
  outputs: {
    // Generate JSON file (default: 'dist/git-info.json')
    json: {
      path: 'dist/git-info.json',
    },

    // Generate window global variable file (default: '__GIT_INFO__')
    window: {
      varName: '__GIT_INFO__',
    },

    // Generate environment variables file (default: '.env.git')
    env: {
      prefix: 'GIT_',
      file: '.env.git',
    },

    // Generate TypeScript type definitions (default: 'dist/git-info.d.ts')
    types: {
      path: 'dist/git-info.d.ts',
    },
  },

  // Working directory (default: process.cwd())
  cwd: undefined,

  // Plugin execution timing
  enforce: 'post', // 'pre' | 'post'
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

### JSON Output (`dist/git-info.json`)

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
GIT_REPO=https://github.com/user/repo.git
GIT_BRANCH=main
GIT_COMMIT=abc123def456...
GIT_COMMIT_SHORT=abc123d
GIT_AUTHOR=John Doe
GIT_AUTHOR_EMAIL=john@example.com
GIT_COMMIT_TIME=2025-01-08T12:00:00.000Z
GIT_COMMIT_MESSAGE=feat: add new feature
GIT_IS_DIRTY=false
```

## License

[MIT](./LICENSE) License © 2025-PRESENT [Drswith](https://github.com/Drswith)

<!-- Badges -->

[unit-test-src]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/Drswith/unplugin-auto-git-log/actions/workflows/unit-test.yml
