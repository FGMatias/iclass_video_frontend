export const CONFIG_TYPE = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  PATH: 'PATH',
  JSON: 'JSON',
} as const

export type ConfigType = (typeof CONFIG_TYPE)[keyof typeof CONFIG_TYPE]
