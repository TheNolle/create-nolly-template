import type { Feature } from '@/registry/types.js'

export const mongodb: Feature = {
  key: 'mongodb',
  name: 'MongoDB support',
  description: 'Adds MongoDB support via prisma directly to your Fastify application.',
  templateRoot: 'web/backend/fastify/mongodb',
  dependencies: {
    '@prisma/client': '6.19'
  },
  devDependencies: {
    '@types/node': '^18.0.0',
    'prisma': '6.19'
  },
  patches: [
    {
      targetPath: 'tsconfig.json',
      operations: [
        {
          type: 'insertAfter',
          pattern: "\"skipLibCheck\": true",
          insert: ",\n\t\"types\": [\"node\"]"
        },
        {
          type: 'insertAfter',
          pattern: "\"src\"",
          insert: ", \"prisma.config.ts\""
        }
      ]
    }
  ]
}