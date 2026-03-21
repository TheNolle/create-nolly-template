import type { Category } from '@/registry/types.js'
import { frontend } from './frontend/index.js'
import { backend } from './backend/index.js'
import { fullstack } from './fullstack/index.js'

export const web: Category = {
  key: 'web',
  name: 'Web',
  description: 'A collection of web templates for frontend, backend, and fullstack development',
  subCategories: [
    frontend,
    backend,
    fullstack,
  ],
}