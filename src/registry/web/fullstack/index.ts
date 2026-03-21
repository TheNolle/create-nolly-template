import type { SubCategory } from '@/registry/types.js'
import { nextJs } from './next.js/base.js'

export const fullstack: SubCategory = {
  key: 'fullstack',
  name: 'Fullstack',
  description: 'Fullstack related tools and frameworks',
  templates: [
    nextJs,
  ],
}