import type { Feature } from '@/registry/types.js'

export const websocket: Feature = {
  key: 'websocket',
  name: 'WebSocket support',
  description: 'Adds WebSocket support',
  templateRoot: 'web/backend/fastify/websocket',
  dependencies: {
    '@fastify/websocket': '^11.2.0',
  },
  patches: [
    {
      targetPath: 'src/app.ts',
      operations: [
        {
          type: 'insertBefore',
          pattern: "import path from 'path'",
          insert: "import websocket from '@fastify/websocket'"
        },
        {
          type: 'insertAfter',
          pattern: `app\\.register\\(helmet\\)`,
          insert: `  app.register(websocket)`
        },
        {
          type: 'insertAfter',
          pattern: `await autoRegister\\(app, 'routes/\\*\\*/\\.routes\\.{ts,js}\\)`,
          insert: `  await autoRegister(app, 'routes/**/*.ws.{ts,js}', '/ws')`
        }
      ]
    }
  ]
}