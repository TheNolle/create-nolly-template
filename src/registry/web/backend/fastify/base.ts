import type { BaseTemplate } from '@/registry/types.js'
import { swagger } from './swagger.js'
import { websocket } from './websocket.js'
import { mongodb } from './mongodb.js'
import { postgresql } from './postgresql.js'

export const fastify: BaseTemplate = {
  key: 'fastify',
  name: 'Fastify TypeScript',
  description: 'Fastify with TypeScript, auto-registration, health check',
  prompts: [
    { type: 'text', name: 'name', message: 'Project name', initial: 'my-fastify-app' }
  ],
  templateRoot: 'web/backend/fastify/base',
  features: [
    swagger,
    websocket,
    mongodb,
    postgresql
  ]
}