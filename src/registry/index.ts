import type { Category } from './types.js'
import { web } from './web/index.js'
import { discord } from './discord/index.js'
import { minecraft } from './minecraft/index.js'

export const registry: Category[] = [
  web,
  discord,
  minecraft
]