import type { SubCategory } from '@/registry/types.js'
import { p1_21_11 } from './1.21.11/base.js'

export const plugins: SubCategory = {
  key: 'plugins',
  name: 'Plugins',
  description: 'A collection of Minecraft plugin templates for various platforms and frameworks.',
  templates: [
    p1_21_11
  ]
}