import type { Feature } from '@/registry/types.js'

export const swagger: Feature = {
  key: 'swagger',
  name: 'Swagger / OpenAPI docs',
  description: 'Adds automatic API documentation with Swagger / OpenAPI',
  dependencies: {
    '@fastify/swagger': '^9.7.0',
    '@fastify/swagger-ui': '^5.2.5'
  },
  patches: [
    {
      targetPath: 'src/app.ts',
      operations: [
        {
          type: 'insertBefore',
          pattern: "import path from 'path'",
          insert: "import swagger from '@fastify/swagger'\nimport swaggerUi from '@fastify/swagger-ui'"
        },
        {
          type: 'insertAfter',
          pattern: "app\\.register\\(helmet\\)",
          insert: "\tapp.register(swagger, { openapi: { info: { title: '{{name}} API', version: '1.0.0' } } })\n\tawait app.register(swaggerUi, { routePrefix: '/docs' })"
        }
      ]
    }
  ]
}