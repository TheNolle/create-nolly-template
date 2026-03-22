import { Client } from './client'
import { config } from './config'
import { logger } from './logger'

process.on('unhandledRejection', logger.error)
process.on('uncaughtException', logger.error)

const client = new Client()

const start = Date.now()

await client.init()
await client.login(config.token)

logger.info(`Startup completed in ${Date.now() - start}ms`)