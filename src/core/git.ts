import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'

export type GitField
  = | 'repo'
    | 'branch'
    | 'commit'
    | 'commitShort'
    | 'author'
    | 'authorEmail'
    | 'commitTime'
    | 'commitMessage'
    | 'tag'
    | 'isDirty'
    | 'remoteUrl'
    | 'root'

export type GitLog = Record<string, string | boolean>

/**
 * 检查当前目录是否是 Git 仓库
 */
function isGitRepository(cwd?: string): boolean {
  try {
    const gitDir = cwd ? resolve(cwd, '.git') : '.git'
    return (
      existsSync(gitDir)
      || execSync('git rev-parse --git-dir', {
        cwd,
        encoding: 'utf8',
        stdio: 'pipe',
      }).trim() !== ''
    )
  }
  catch {
    return false
  }
}

/**
 * 安全执行 Git 命令
 */
function execGitCommand(command: string, cwd?: string): string {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim()
  }
  catch {
    return ''
  }
}

/**
 * 获取 Git 仓库根目录
 */
function getGitRoot(cwd?: string): string {
  return execGitCommand('git rev-parse --show-toplevel', cwd)
}

/**
 * 获取 Git 日志
 */
export function getGitLog(fields: string[] = [], cwd?: string): GitLog {
  const result: GitLog = {}

  if (!isGitRepository(cwd)) {
    return result
  }

  const gitRoot = getGitRoot(cwd)

  for (const field of fields) {
    switch (field) {
      case 'repo': {
        const remoteUrl = execGitCommand(
          'git config --get remote.origin.url',
          cwd,
        )
        if (remoteUrl) {
          // 提取仓库名称
          const match = remoteUrl.match(
            /(?:git@|https?:\/\/)(?:.*\/)?([^/]+?)(?:\.git)?$/,
          )
          result.repo = match ? match[1] : remoteUrl
        }
        else {
          result.repo = gitRoot ? basename(gitRoot) : ''
        }
        break
      }

      case 'branch': {
        const branch = execGitCommand('git rev-parse --abbrev-ref HEAD', cwd)
        result.branch = branch || ''
        break
      }

      case 'commit': {
        const commit = execGitCommand('git rev-parse HEAD', cwd)
        result.commit = commit || ''
        break
      }

      case 'commitShort': {
        const commitShort = execGitCommand('git rev-parse --short HEAD', cwd)
        result.commitShort = commitShort || ''
        break
      }

      case 'author': {
        const author = execGitCommand('git log -1 --pretty=format:"%an"', cwd)
        result.author = author || ''
        break
      }

      case 'authorEmail': {
        const authorEmail = execGitCommand(
          'git log -1 --pretty=format:"%ae"',
          cwd,
        )
        result.authorEmail = authorEmail || ''
        break
      }

      case 'commitTime': {
        const commitTime = execGitCommand(
          'git log -1 --pretty=format:"%ci"',
          cwd,
        )
        result.commitTime = commitTime || ''
        break
      }

      case 'commitMessage': {
        const commitMessage = execGitCommand(
          'git log -1 --pretty=format:"%s"',
          cwd,
        )
        result.commitMessage = commitMessage || ''
        break
      }

      case 'tag': {
        const tag = execGitCommand(
          'git describe --tags --exact-match HEAD 2>/dev/null',
          cwd,
        )
        result.tag = tag || ''
        break
      }

      case 'isDirty': {
        const status = execGitCommand('git status --porcelain', cwd)
        result.isDirty = status.length > 0
        break
      }

      case 'remoteUrl': {
        const remoteUrl = execGitCommand(
          'git config --get remote.origin.url',
          cwd,
        )
        result.remoteUrl = remoteUrl || ''
        break
      }

      case 'root': {
        result.root = gitRoot || ''
        break
      }

      default:
        // 未知字段，尝试作为自定义 git 命令执行
        // 格式: custom:git-command 或 custom:git-command:format
        if (field.startsWith('custom:')) {
          const command = field.replace(/^custom:/, '')
          const value = execGitCommand(command, cwd)
          result[field] = value || ''
        }
        break
    }
  }

  return result
}

/**
 * 获取所有可用的 Git 字段
 */
export function getAvailableFields(): GitField[] {
  return [
    'repo',
    'branch',
    'commit',
    'commitShort',
    'author',
    'authorEmail',
    'commitTime',
    'commitMessage',
    'tag',
    'isDirty',
    'remoteUrl',
    'root',
  ]
}
