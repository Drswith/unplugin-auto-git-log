import type { FilterPattern } from 'unplugin'
import type { GitField } from './git'
import type { OutputOptions } from './outputs'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  enforce?: 'pre' | 'post' | undefined
  fields?: GitField[] | string[]
  outputs?: OutputOptions
  cwd?: string
}

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type OptionsResolved = Overwrite<
  Required<Pick<Options, 'include' | 'exclude'>>,
  Omit<Pick<Options, 'enforce' | 'fields' | 'outputs' | 'cwd'>, 'outputs'> & {
    outputs: OutputOptions
  }
>

const DEFAULT_FIELDS: GitField[] = [
  'repo',
  'branch',
  'commit',
  'commitShort',
  'author',
  'authorEmail',
  'commitTime',
  'commitMessage',
  'isDirty',
]

export function resolveOptions(options: Options = {}): OptionsResolved {
  return {
    include: options.include || [/\.[cm]?[jt]sx?$/],
    exclude: options.exclude || [/node_modules/],
    enforce: 'enforce' in options ? options.enforce : 'post',
    fields: options.fields || DEFAULT_FIELDS,
    outputs: options.outputs || {},
    cwd: options.cwd,
  }
}
