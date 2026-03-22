import { logger } from '../logger'
import type { Event } from '../types/event'

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user?.username} (${client.user?.id})`)
  }
} satisfies Event