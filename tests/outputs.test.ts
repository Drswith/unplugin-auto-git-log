import { existsSync, readFileSync, rmdirSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  generateJson,
  generateJsonContent,
  generateOutputs,
} from '../src/core/outputs'

const testDir = resolve(process.cwd(), 'test-output')

describe('outputs', () => {
  beforeEach(() => {
    // 清理测试目录
    if (existsSync(testDir)) {
      try {
        rmdirSync(testDir, { recursive: true })
      }
      catch {
        // 忽略错误
      }
    }
  })

  afterEach(() => {
    // 清理测试文件
    if (existsSync(testDir)) {
      try {
        rmdirSync(testDir, { recursive: true })
      }
      catch {
        // 忽略错误
      }
    }
  })

  const mockGitInfo = {
    repo: 'test-repo',
    branch: 'main',
    commit: 'abc123',
    isDirty: false,
  }

  describe('generateJsonContent', () => {
    it('should generate valid JSON content', () => {
      const content = generateJsonContent(mockGitInfo)
      expect(() => JSON.parse(content)).not.toThrow()
      const parsed = JSON.parse(content)
      expect(parsed).toEqual(mockGitInfo)
    })
  })

  describe('generateJson', () => {
    it('should generate JSON file', () => {
      const filePath = resolve(testDir, 'git-info.json')
      generateJson(mockGitInfo, { fileName: filePath })

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(content)
      expect(parsed).toEqual(mockGitInfo)
    })
  })

  describe('outputs integration', () => {
    it('should handle only json output', () => {
      const jsonPath = resolve(testDir, 'git-info.json')

      generateOutputs(mockGitInfo, { json: {} }, testDir)

      expect(existsSync(jsonPath)).toBe(true)
    })

    it('should handle json output', () => {
      const jsonPath = resolve(testDir, 'git-info.json')

      generateOutputs(
        mockGitInfo,
        { json: {} },
        testDir,
      )

      expect(existsSync(jsonPath)).toBe(true)
    })
  })
})
