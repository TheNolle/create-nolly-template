import type { BaseTemplate } from '@/registry/types.js'
import { react } from './react.js'
import { seo } from './seo.js'

export const vite: BaseTemplate = {
  key: 'vite',
  name: 'Vite TypeScript',
  description: 'Vite with TypeScript, React, auto-registration',
  prompts: [
    { type: 'text', name: 'name', message: 'Project name', initial: 'my-vite-app' }
  ],
  templateRoot: 'web/frontend/vite/base',
  features: [
    react,
    seo
  ]
}