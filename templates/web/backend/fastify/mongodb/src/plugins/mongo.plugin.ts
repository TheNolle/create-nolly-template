import fastifyPlugin from 'fastify-plugin'
import { MongoClient, Db } from 'mongodb'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fastGlob from 'fast-glob'
import { env } from '../utils/env'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type ModelFactory = (db: Db, app: FastifyInstance) => any

declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient
      db: Db
    }
    models: Record<string, any>
  }
}

async function autoLoadModels(app: FastifyInstance, db: Db) {
  const pattern = path.join(__dirname, '../models/**/*.model.{ts,js}').replace(/\\/g, '/')
  const files = fastGlob.sync(pattern)
  const models: Record<string, any> = {}
  for (const file of files) {
    const module = await import(pathToFileURL(file).href)
    const factory: ModelFactory = module.default || module[Object.keys(module)[0]]
    if (typeof factory !== 'function') continue
    const model = factory(db, app)
    if (!model?.name) throw new Error(`Model in ${file} must return { name: string }`)
    models[model.name] = model
  }
  return models
}

export default fastifyPlugin(async function mongoPlugin(app) {
  const client = new MongoClient(env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  try {
    await client.connect()
  } catch (error: any) {
    app.log.error('Mongo connection failed:', error)
    throw error
  }
  const db = client.db(env.MONGO_DB)
  app.decorate('mongo', { client, db })
  const models = await autoLoadModels(app, db)
  app.decorate('models', models)
  app.addHook('onClose', async () => { await client.close() })
  app.log.info(`📦 Mongo connected: ${env.MONGO_DB}`)
}, { name: 'mongoPlugin' })