import { existsSync, readFileSync, rmdirSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  generateEnvVars,
  generateEnvVarsContent,
  generateJson,
  generateJsonContent,
  generateTypeDefinitions,
  generateTypeDefinitionsContent,
  generateWindowVar,
  generateWindowVarContent,
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

  describe('generateWindowVarContent', () => {
    it('should generate window variable code with default name', () => {
      const content = generateWindowVarContent(mockGitInfo)
      expect(content).toContain('window.__GIT_INFO__')
      expect(content).toContain('test-repo')
    })

    it('should generate window variable code with custom name', () => {
      const content = generateWindowVarContent(mockGitInfo, {
        varName: '__CUSTOM__',
      })
      expect(content).toContain('window.__CUSTOM__')
      expect(content).not.toContain('__GIT_INFO__')
    })
  })

  describe('generateEnvVarsContent', () => {
    it('should generate env vars content with default prefix', () => {
      const content = generateEnvVarsContent(mockGitInfo)
      expect(content).toContain('__GIT_REPO=')
      expect(content).toContain('__GIT_BRANCH=')
      expect(content).toContain('__GIT_COMMIT=')
    })

    it('should generate env vars content with custom prefix', () => {
      const content = generateEnvVarsContent(mockGitInfo, { prefix: 'CUSTOM_' })
      expect(content).toContain('CUSTOM_REPO=')
      expect(content).not.toContain('GIT_REPO=')
    })

    it('should handle boolean values', () => {
      const content = generateEnvVarsContent(mockGitInfo)
      expect(content).toContain('__GIT_ISDIRTY=')
    })
  })

  describe('generateTypeDefinitionsContent', () => {
    it('should generate TypeScript type definitions', () => {
      const content = generateTypeDefinitionsContent(mockGitInfo)
      expect(content).toContain('export interface GitInfo')
      expect(content).toContain('repo: string')
      expect(content).toContain('isDirty: boolean')
      expect(content).toContain('export default gitInfo')
    })
  })

  describe('generateJson', () => {
    it('should generate JSON file', () => {
      const filePath = resolve(testDir, 'git-log.json')
      generateJson(mockGitInfo, { path: filePath })

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(content)
      expect(parsed).toEqual(mockGitInfo)
    })
  })

  describe('generateWindowVar', () => {
    it('should generate window variable file', () => {
      const outputPath = testDir
      generateWindowVar(mockGitInfo, { varName: '__TEST__' }, outputPath)

      const filePath = resolve(outputPath, '__TEST__.js')
      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('window.__TEST__')
    })
  })

  describe('generateEnvVars', () => {
    it('should generate env vars file', () => {
      const filePath = resolve(testDir, '.env.git')
      generateEnvVars(mockGitInfo, {}, testDir)

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('__GIT_REPO=')
    })
  })

  describe('generateTypeDefinitions', () => {
    it('should generate TypeScript definitions file', () => {
      const filePath = resolve(testDir, 'git-log.d.ts')
      generateTypeDefinitions(mockGitInfo, { path: filePath })

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('export interface GitInfo')
    })
  })
})
