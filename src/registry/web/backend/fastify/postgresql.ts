import type { Feature } from '@/registry/types.js'

export const postgresql: Feature = {
  key: 'postgresql',
  name: 'PostgreSQL support',
  description: 'Adds PostgreSQL support via prisma directly to your Fastify application.',
  templateRoot: 'web/backend/fastify/postgresql',
  dependencies: {
    '@prisma/adapter-pg': '^7.4.2',
    '@prisma/client': '^7.4.2',
    'pg': '^8.20.0'
  },
  devDependencies: {
    '@types/node': '^18.0.0',
    '@types/pg': '^8.18.0',
    'prisma': '^7.4.2'
  },
  group: 'database',
  exclusive: true,
  additionalMessages: [
    'This feature will set up Prisma with PostgreSQL as the database provider.',
    'It comes with a premade test model in the prisma schema as well as a plugin for Fastify',
    'Run `pnpx prisma generate` and `pnpx prisma db push` to set up your database after adding this feature.'
  ],
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