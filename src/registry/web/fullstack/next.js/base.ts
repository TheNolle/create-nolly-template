import type { BaseTemplate } from '@/registry/types.js'

export const nextJs: BaseTemplate = {
  key: 'nextjs',
  name: 'Next.js',
  description: 'Next.js with TypeScript, React, Tailwind CSS, and Shasdcn UI pre-configured',
  prompts: [
    { type: 'text', name: 'name', message: 'Project name', initial: 'my-nextjs-app' }
  ],
  templateRoot: 'web/fullstack/nextjs/base',
  features: [
  ]
}