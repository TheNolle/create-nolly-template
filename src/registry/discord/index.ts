import type { Category } from '@/registry/types.js'
import { bots } from './bots/base.js'

export const discord: Category = {
  key: 'discord',
  name: 'Discord',
  description: 'Templates for building Discord related projects, such as bots, applications, and libraries.',
  templates: [
    bots
  ]
}