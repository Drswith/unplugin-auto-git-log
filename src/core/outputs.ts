import type { GitLog } from './git'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'

export interface JsonOutputOptions {
  fileName?: string
}

export interface WindowOutputOptions {
  varName?: string
  console?: boolean
}

export interface EnvOutputOptions {
  prefix?: string
  file?: string
}

export interface TypesOutputOptions {
  fileName?: string
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
export function generateJsonContent(gitLog: GitLog): string {
  return JSON.stringify(gitLog, null, 2)
}

/**
 * 生成 JSON 文件
 */
export function generateJson(
  gitLog: GitLog,
  options: JsonOutputOptions = {},
  outputDir?: string,
): void {
  const defaultFileName = 'git-log.json'
  const fileName = options.fileName || defaultFileName
  // 如果是绝对路径，直接使用；否则相对于 outputDir
  const fullPath = outputDir && !isAbsolute(fileName) ? resolve(outputDir, fileName) : fileName

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateJsonContent(gitLog)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 生成 window 全局变量代码
 */
export function generateWindowVarContent(
  gitLog: GitLog,
  options: WindowOutputOptions = {},
): string {
  const varName = options.varName || '__GIT_LOG__'
  const jsonStr = JSON.stringify(gitLog, null, 2)
  const consoleLog = options.console
    ? `console.log('[Git Log]', window.${varName});`
    : ''

  return `(function() {
  if (typeof window !== 'undefined') {
    window.${varName} = ${jsonStr};
    ${consoleLog}
  }
})();`
}

/**
 * 生成 window 全局变量文件
 */
export function generateWindowVar(
  gitLog: GitLog,
  options: WindowOutputOptions = {},
  outputDir?: string,
): string {
  const varName = options.varName || '__GIT_LOG__'
  const fileName = `${varName}.js`
  const fullPath = outputDir ? resolve(outputDir, fileName) : fileName

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateWindowVarContent(gitLog, options)
  writeFileSync(fullPath, content, 'utf8')

  // 返回相对路径，用于在 HTML 中引用
  return fileName
}

/**
 * 生成环境变量文件内容
 */
export function generateEnvVarsContent(
  gitLog: GitLog,
  options: EnvOutputOptions = {},
): string {
  const prefix = options.prefix || '__GIT_'
  const lines: string[] = []

  for (const [key, value] of Object.entries(gitLog)) {
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
  gitLog: GitLog,
  options: EnvOutputOptions = {},
  outputDir?: string,
): void {
  const defaultFile = '.env.git'
  const filePath = options.file || defaultFile
  const fullPath = outputDir ? resolve(outputDir, filePath) : filePath

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateEnvVarsContent(gitLog, options)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 生成 TypeScript 类型定义文件内容
 */
export function generateTypeDefinitionsContent(gitLog: GitLog): string {
  const typeEntries = Object.entries(gitLog)
    .map(([key, value]) => {
      const type = typeof value === 'boolean' ? 'boolean' : 'string'
      return `  ${key}: ${type}`
    })
    .join('\n')

  return `export interface GitLog {
${typeEntries}
}
`
}

/**
 * 生成 TypeScript 类型定义文件
 */
export function generateTypeDefinitions(
  gitLog: GitLog,
  options: TypesOutputOptions = {},
  outputDir?: string,
): void {
  const defaultFileName = 'git-log.d.ts'
  const fileName = options.fileName || defaultFileName
  // 如果是绝对路径，直接使用；否则相对于 outputDir
  const fullPath = outputDir && !isAbsolute(fileName) ? resolve(outputDir, fileName) : fileName

  // 确保目录存在
  const dir = dirname(fullPath)
  mkdirSync(dir, { recursive: true })

  const content = generateTypeDefinitionsContent(gitLog)
  writeFileSync(fullPath, content, 'utf8')
}

/**
 * 根据配置生成所有输出
 */
export function generateOutputs(
  gitLog: GitLog,
  outputOptions: OutputOptions,
  outputDir?: string,
): string | undefined {
  let windowVarFileName: string | undefined

  if (outputOptions.json) {
    generateJson(gitLog, outputOptions.json, outputDir)
  }

  if (outputOptions.window) {
    windowVarFileName = generateWindowVar(gitLog, outputOptions.window, outputDir)
  }

  if (outputOptions.env) {
    generateEnvVars(gitLog, outputOptions.env, outputDir)
  }

  if (outputOptions.types) {
    generateTypeDefinitions(gitLog, outputOptions.types, outputDir)
  }

  return windowVarFileName
}
