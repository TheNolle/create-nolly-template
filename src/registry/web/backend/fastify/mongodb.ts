import type { Feature } from '@/registry/types.js'

export const mongodb: Feature = {
  key: 'mongodb',
  name: 'MongoDB support',
  description: 'Adds MongoDB support',
  templateRoot: 'web/backend/fastify/mongodb',
  dependencies: {
    'fastify-plugin': '^5.1.0',
    'mongodb': '^7.1.0'
  },
  patches: [
    {
      targetPath: 'src/utils/env.ts',
      operations: [
        {
          type: 'insertAfter',
          pattern: "NODE_ENV: z.enum\\(\\['development', 'production', 'test'\\]\\)\\.default\\('development'\\)",
          insert: ",\tMONGO_URI: z.string().default('mongodb://localhost:27017/myapp'),\n\tMONGO_DB: z.string().default('myapp')"
        }
      ]
    }
  ]
}