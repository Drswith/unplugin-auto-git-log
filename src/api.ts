export { getAvailableFields, getGitInfo } from './core/git'
export type { GitField, GitInfo } from './core/git'
export type { Options, OptionsResolved } from './core/options'
export {
  generateEnvVars,
  generateJson,
  generateOutputs,
  generateTypeDefinitions,
  generateWindowVar,
} from './core/outputs'
export type {
  EnvOutputOptions,
  JsonOutputOptions,
  OutputOptions,
  TypesOutputOptions,
  WindowOutputOptions,
} from './core/outputs'
