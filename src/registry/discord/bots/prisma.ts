import type { Feature } from '@/registry/types.js'

export const prisma: Feature = {
  key: 'prisma',
  name: 'Prisma (PostgreSQL)',
  description: 'Adds Prisma to your Discord bot project.',
  templateRoot: 'discord/bots/prisma',
  dependencies: {
    '@prisma/adapter-pg': '^7.5.0',
    '@prisma/client': '^7.5.0',
    'pg': '^8.20.0'
  },
  devDependencies: {
    '@types/pg': '^8.20.0',
    'prisma': '^7.5.0'
  },
  commands: {
    'db:generate': 'prisma generate',
    'db:push': 'prisma db push',
    'db:reset': 'prisma db push --force-reset'
  },
  additionalMessages: [
    'After adding Prisma, you will need to set up your database and run the `db:generate` command to generate the client.',
    'To set up your database, you can edit the `schema.prisma` file in the `prisma` directory to define your data models. Then, run `db:push` to apply the schema to your database.',
    'Make sure to configure your database connection string in the .env file.'
  ],
  group: 'database',
  exclusive: true,
  patches: [
    {
      targetPath: '.env',
      operations: [
        {
          type: 'insertAfter',
          pattern: /GUILD_ID=YOUR_GUILD_ID # Optional: Only needed if you want to register commands to a specific guild for testing\. Remove if you want to register globally\./,
          insert: 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public" # Update this with your actual database connection string'
        }
      ]
    },
    {
      targetPath: 'src/client.ts',
      operations: [
        {
          type: 'insertAfter',
          pattern: /import { registerCommands } from '\.\/loader\/registerCommands'(\r?\n)/,
          insert: "import { PrismaClient } from './prisma/client'\nimport { PrismaPg } from '@prisma/adapter-pg'\nimport { config } from './utils/config'\n"
        },
        {
          type: 'insertAfter',
          pattern: "public modals = new Collection\<string\, Modal\>()",
          insert: '\n\tpublic prisma: PrismaClient'
        },
        {
          type: 'insertBefore',
          pattern: /logger\.info\('\[INIT\] Client initialized'\)/,
          insert: '\tconst adapter = new PrismaPg({ connectionString: config.databaseUrl })\n\t\tthis.prisma = new PrismaClient({ adapter })\n\t'
        }
      ]
    },
    {
      targetPath: 'src/utils/config.ts',
      operations: [
        {
          type: 'insertAfter',
          pattern: /guildId: optional\('GUILD_ID'\),(\r?\n)/,
          insert: "databaseUrl: required('DATABASE_URL'),"
        }
      ]
    },
    {
      targetPath: 'src/events/clientReady.ts',
      operations: [
        {
          type: 'insertBefore',
          pattern: /logger\.info\(`Logged[\s\S]*?\)`\)/,
          insert: "\t\ttry { await client.prisma.$connect() } catch (error: any) { logger.error('Failed to connect to the database:', error) }\n"
        }
      ]
    }
  ]
}