import { existsSync, readFileSync, rmdirSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  generateEnvVars,
  generateEnvVarsContent,
  generateJson,
  generateJsonContent,
  generateOutputs,
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

  const mockGitLog = {
    repo: 'test-repo',
    branch: 'main',
    commit: 'abc123',
    isDirty: false,
  }

  describe('generateJsonContent', () => {
    it('should generate valid JSON content', () => {
      const content = generateJsonContent(mockGitLog)
      expect(() => JSON.parse(content)).not.toThrow()
      const parsed = JSON.parse(content)
      expect(parsed).toEqual(mockGitLog)
    })
  })

  describe('generateWindowVarContent', () => {
    it('should generate window variable code with default name', () => {
      const content = generateWindowVarContent(mockGitLog)
      expect(content).toContain('window.__GIT_LOG__')
      expect(content).toContain('test-repo')
    })

    it('should generate window variable code with custom name', () => {
      const content = generateWindowVarContent(mockGitLog, {
        varName: '__CUSTOM__',
      })
      expect(content).toContain('window.__CUSTOM__')
      expect(content).not.toContain('__GIT_LOG__')
    })
  })

  describe('generateEnvVarsContent', () => {
    it('should generate env vars content with default prefix', () => {
      const content = generateEnvVarsContent(mockGitLog)
      expect(content).toContain('__GIT_REPO=')
      expect(content).toContain('__GIT_BRANCH=')
      expect(content).toContain('__GIT_COMMIT=')
    })

    it('should generate env vars content with custom prefix', () => {
      const content = generateEnvVarsContent(mockGitLog, { prefix: 'CUSTOM_' })
      expect(content).toContain('CUSTOM_REPO=')
      expect(content).not.toContain('GIT_REPO=')
    })

    it('should handle boolean values', () => {
      const content = generateEnvVarsContent(mockGitLog)
      expect(content).toContain('__GIT_ISDIRTY=')
    })
  })

  describe('generateTypeDefinitionsContent', () => {
    it('should generate TypeScript type definitions', () => {
      const content = generateTypeDefinitionsContent(mockGitLog)
      expect(content).toContain('export interface GitLog')
      expect(content).toContain('repo: string')
      expect(content).toContain('isDirty: boolean')
    })
  })

  describe('generateJson', () => {
    it('should generate JSON file', () => {
      const filePath = resolve(testDir, 'git-log.json')
      generateJson(mockGitLog, { fileName: filePath })

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(content)
      expect(parsed).toEqual(mockGitLog)
    })
  })

  describe('generateWindowVar', () => {
    it('should generate window variable file', () => {
      const outputPath = testDir
      generateWindowVar(mockGitLog, { varName: '__TEST__' }, outputPath)

      const filePath = resolve(outputPath, '__TEST__.js')
      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('window.__TEST__')
    })
  })

  describe('generateEnvVars', () => {
    it('should generate env vars file', () => {
      const filePath = resolve(testDir, '.env.git')
      generateEnvVars(mockGitLog, {}, testDir)

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('__GIT_REPO=')
    })
  })

  describe('generateTypeDefinitions', () => {
    it('should generate TypeScript definitions file', () => {
      const filePath = resolve(testDir, 'git-log.d.ts')
      generateTypeDefinitions(mockGitLog, { fileName: filePath })

      expect(existsSync(filePath)).toBe(true)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('export interface GitLog')
    })
  })

  describe('outputs integration', () => {
    it('should handle only json output', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const typesPath = resolve(testDir, 'git-log.d.ts')

      generateOutputs(mockGitLog, { json: {} }, testDir)

      expect(existsSync(jsonPath)).toBe(true)
      expect(existsSync(typesPath)).toBe(false)
    })

    it('should handle only types output', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const typesPath = resolve(testDir, 'git-log.d.ts')

      generateOutputs(mockGitLog, { types: {} }, testDir)

      expect(existsSync(jsonPath)).toBe(false)
      expect(existsSync(typesPath)).toBe(true)
    })

    it('should handle only window output', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const windowPath = resolve(testDir, '__GIT_LOG__.js')

      generateOutputs(mockGitLog, { window: {} }, testDir)

      expect(existsSync(jsonPath)).toBe(false)
      expect(existsSync(windowPath)).toBe(true)
    })

    it('should handle only env output', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const envPath = resolve(testDir, '.env.git')

      generateOutputs(mockGitLog, { env: {} }, testDir)

      expect(existsSync(jsonPath)).toBe(false)
      expect(existsSync(envPath)).toBe(true)
    })

    it('should handle json + types outputs', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const typesPath = resolve(testDir, 'git-log.d.ts')
      const windowPath = resolve(testDir, '__GIT_LOG__.js')
      const envPath = resolve(testDir, '.env.git')

      generateOutputs(
        mockGitLog,
        { json: {}, types: {} },
        testDir,
      )

      expect(existsSync(jsonPath)).toBe(true)
      expect(existsSync(typesPath)).toBe(true)
      expect(existsSync(windowPath)).toBe(false)
      expect(existsSync(envPath)).toBe(false)
    })

    it('should handle all outputs', () => {
      const jsonPath = resolve(testDir, 'git-log.json')
      const typesPath = resolve(testDir, 'git-log.d.ts')
      const windowPath = resolve(testDir, '__GIT_LOG__.js')
      const envPath = resolve(testDir, '.env.git')

      generateOutputs(
        mockGitLog,
        { json: {}, types: {}, window: {}, env: {} },
        testDir,
      )

      expect(existsSync(jsonPath)).toBe(true)
      expect(existsSync(typesPath)).toBe(true)
      expect(existsSync(windowPath)).toBe(true)
      expect(existsSync(envPath)).toBe(true)
    })
  })
})
