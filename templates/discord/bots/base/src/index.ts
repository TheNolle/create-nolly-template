import { Client } from './client'
import { config } from './utils/config'
import { logger } from './utils/logger'

process.on('unhandledRejection', logger.error)
process.on('uncaughtException', logger.error)

logger.time('Startup')
const client = new Client()
await client.init()
await client.login(config.token)
logger.timeEnd('Startup')