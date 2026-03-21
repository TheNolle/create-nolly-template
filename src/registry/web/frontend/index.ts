import type { SubCategory } from '@/registry/types.js'
import { vite } from './vite/base.js'

export const frontend: SubCategory = {
  key: 'frontend',
  name: 'Frontend',
  description: 'Frontend related tools and frameworks',
  templates: [
    vite
  ],
}