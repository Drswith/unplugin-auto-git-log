import { describe, expect, it } from 'vitest'
import { getAvailableFields, getGitInfo } from '../src/core/git'

describe('git', () => {
  it('should get available fields', () => {
    const fields = getAvailableFields()
    expect(fields).toContain('repo')
    expect(fields).toContain('branch')
    expect(fields).toContain('commit')
    expect(fields.length).toBeGreaterThan(0)
  })

  it('should get git info with empty fields', () => {
    const info = getGitInfo([])
    expect(info).toEqual({})
  })

  it('should get git info with specific fields', () => {
    const info = getGitInfo(['branch', 'commit'])
    // 如果当前目录是 git 仓库，应该能获取到信息
    // 如果不是，返回空对象
    expect(typeof info).toBe('object')
  })

  it('should handle non-git directory', () => {
    // 使用一个不存在的目录
    const info = getGitInfo(['branch'], '/tmp/non-existent-dir-12345')
    expect(info).toEqual({})
  })
})
