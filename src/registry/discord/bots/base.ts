import type { BaseTemplate } from '@/registry/types.js'

export const bots: BaseTemplate = {
  key: 'bots',
  name: 'Discord Bots',
  description: 'A template for building Discord bots with TypeScript.',
  prompts: [
    { type: 'text', name: 'name', message: 'Project name', initial: 'my-discord-bot' }
  ],
  templateRoot: 'discord/bots/base',
  features: [
  ]
}