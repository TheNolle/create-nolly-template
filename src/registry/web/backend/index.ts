import type { SubCategory } from '@/registry/types.js'
import { fastify } from './fastify/base.js'

export const backend: SubCategory = {
  key: 'backend',
  name: 'Backend',
  description: 'Backend related tools and frameworks',
  templates: [
    fastify
  ],
}