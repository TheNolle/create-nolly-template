import { logger } from '../utils/logger'
import type { Event } from '../types/event'

export default {
  name: 'clientReady',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user?.username} ({{name}})`)
  }
} satisfies Event