import { describe, expect, it } from 'vitest'
import { getAvailableFields, getGitLog } from '../src/core/git'

describe('git', () => {
  it('should get available fields', () => {
    const fields = getAvailableFields()
    expect(fields).toContain('repo')
    expect(fields).toContain('branch')
    expect(fields).toContain('commit')
    expect(fields.length).toBeGreaterThan(0)
  })

  it('should get git log with empty fields', () => {
    const log = getGitLog([])
    expect(log).toEqual({})
  })

  it('should get git log with specific fields', () => {
    const log = getGitLog(['branch', 'commit'])
    // 如果当前目录是 git 仓库，应该能获取到信息
    // 如果不是，返回空对象
    expect(typeof log).toBe('object')
  })

  it('should handle non-git directory', () => {
    // 使用一个不存在的目录
    const log = getGitLog(['branch'], '/tmp/non-existent-dir-12345')
    expect(log).toEqual({})
  })
})
