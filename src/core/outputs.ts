import type { GitLog } from './git'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'

export interface JsonOutputOptions {
  fileName?: string
}

/**
 * Window 全局变量输出选项
 * 通过 define 替换（编译时）和 HTML 注入（Vite）实现
 */
export interface WindowOutputOptions {
  /** 全局变量名称，默认为 '__GIT_LOG__' */
  varName?: string
  /** 是否在浏览器控制台打印 Git 日志，默认：false */
  console?: boolean
}

export interface OutputOptions {
  json?: JsonOutputOptions
  window?: WindowOutputOptions
}

/**
 * 生成 JSON 文件内容
 * @param gitLog Git 日志对象
 * @returns 格式化的 JSON 字符串
 */
export function generateJsonContent(gitLog: GitLog): string {
  return JSON.stringify(gitLog, null, 2)
}

/**
 * 生成 JSON 文件到输出目录
 * @param gitLog Git 日志对象
 * @param options JSON 输出选项
 * @param outputDir 输出目录路径
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
 * 根据配置生成所有输出文件
 * 目前支持 JSON 文件输出
 * Window 全局变量通过 define 替换和 HTML 注入实现，不生成文件
 *
 * @param gitLog Git 日志对象
 * @param outputOptions 输出选项配置
 * @param outputDir 输出目录路径
 */
export function generateOutputs(
  gitLog: GitLog,
  outputOptions: OutputOptions,
  outputDir?: string,
): void {
  if (outputOptions.json) {
    generateJson(gitLog, outputOptions.json, outputDir)
  }
}
