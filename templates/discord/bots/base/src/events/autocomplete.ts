import type { Event } from '../types/event'
import { logger } from '../utils/logger'

export default {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isAutocomplete()) return
    const command = client.commands.get(interaction.commandName)
    if (!command || !command.autocomplete) return
    try {
      await command.autocomplete(client, interaction)
    } catch (error: any) {
      logger.error(`Autocomplete error for command ${interaction.commandName}`, error)
    }
  }
} satisfies Event