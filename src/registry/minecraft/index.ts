import type { Category } from '@/registry/types.js'
import { plugins } from './plugins/index.js'

export const minecraft: Category = {
  key: 'minecraft',
  name: 'Minecraft',
  description: 'A collection of Minecraft-related templates, including plugins, mods, datapacks, and more.',
  subCategories: [
    plugins
  ],
}