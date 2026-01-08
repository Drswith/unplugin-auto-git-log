import type { GitInfo } from './git'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

export interface JsonOutputOptions {
  path?: string
}

export interface WindowOutputOptions {
  varName?: string
}

export interface EnvOutputOptions {
  prefix?: string
  file?: string
}

export interface TypesOutputOptions {
  path?: string
}

export interface OutputOptions {
  json?: JsonOutputOptions
  window?: WindowOutputOptions
  env?: EnvOutputOptions
  types?: TypesOutputOptions
}

/**
 * 生成 JSON 文件内容
 */
export function generateJsonContent(gitInfo: GitInfo): string {
  return JSON.stringify(gitInfo, null, 2)
}

/**
 * 生成 JSON 文件
 */
export function generateJson(
  gitInfo: GitInfo,
  options: JsonOutputOptions = {},
  outputDir?: string,
): void {
  const defaultPath = 'dist/git-info.json'
  const filePath = options.path || defaultPath
  const fullPath = outputDir ? resolve(outputDir, filePath) : filePath

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateJsonContent(gitInfo)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 生成 window 全局变量代码
 */
export function generateWindowVarContent(
  gitInfo: GitInfo,
  options: WindowOutputOptions = {},
): string {
  const varName = options.varName || '__GIT_INFO__'
  const jsonStr = JSON.stringify(gitInfo, null, 2)
  return `(function() {
  if (typeof window !== 'undefined') {
    window.${varName} = ${jsonStr};
  }
})();`
}

/**
 * 生成 window 全局变量文件
 */
export function generateWindowVar(
  gitInfo: GitInfo,
  options: WindowOutputOptions = {},
  outputDir?: string,
): void {
  const varName = options.varName || '__GIT_INFO__'
  const fileName = `${varName}.js`
  const fullPath = outputDir ? resolve(outputDir, fileName) : fileName

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateWindowVarContent(gitInfo, options)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 生成环境变量文件内容
 */
export function generateEnvVarsContent(
  gitInfo: GitInfo,
  options: EnvOutputOptions = {},
): string {
  const prefix = options.prefix || 'GIT_'
  const lines: string[] = []

  for (const [key, value] of Object.entries(gitInfo)) {
    const envKey = `${prefix}${key.toUpperCase()}`
    const envValue = typeof value === 'string' ? value : String(value)
    // 转义特殊字符
    const escapedValue = envValue.replaceAll('"', String.raw`\"`)
    lines.push(`${envKey}="${escapedValue}"`)
  }

  return lines.join('\n')
}

/**
 * 生成环境变量文件
 */
export function generateEnvVars(
  gitInfo: GitInfo,
  options: EnvOutputOptions = {},
  outputDir?: string,
): void {
  const defaultFile = '.env.git'
  const filePath = options.file || defaultFile
  const fullPath = outputDir ? resolve(outputDir, filePath) : filePath

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateEnvVarsContent(gitInfo, options)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 生成 TypeScript 类型定义文件内容
 */
export function generateTypeDefinitionsContent(gitInfo: GitInfo): string {
  const typeEntries = Object.entries(gitInfo)
    .map(([key, value]) => {
      const type = typeof value === 'boolean' ? 'boolean' : 'string'
      return `  ${key}: ${type}`
    })
    .join('\n')

  return `export interface GitInfo {
${typeEntries}
}

declare const gitInfo: GitInfo;
export default gitInfo;

export const gitInfoValue: GitInfo = ${JSON.stringify(gitInfo, null, 2)};
`
}

/**
 * 生成 TypeScript 类型定义文件
 */
export function generateTypeDefinitions(
  gitInfo: GitInfo,
  options: TypesOutputOptions = {},
  outputDir?: string,
): void {
  const defaultPath = 'dist/git-info.d.ts'
  const filePath = options.path || defaultPath
  const fullPath = outputDir ? resolve(outputDir, filePath) : filePath

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateTypeDefinitionsContent(gitInfo)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 根据配置生成所有输出
 */
export function generateOutputs(
  gitInfo: GitInfo,
  outputOptions: OutputOptions,
  outputDir?: string,
): void {
  if (outputOptions.json) {
    generateJson(gitInfo, outputOptions.json, outputDir)
  }

  if (outputOptions.window) {
    generateWindowVar(gitInfo, outputOptions.window, outputDir)
  }

  if (outputOptions.env) {
    generateEnvVars(gitInfo, outputOptions.env, outputDir)
  }

  if (outputOptions.types) {
    generateTypeDefinitions(gitInfo, outputOptions.types, outputDir)
  }
}
