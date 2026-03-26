import { Colors, EmbedBuilder, MessageFlags } from 'discord.js'
import type { Event } from '../types/event'
import { logger } from '../utils/logger'

export default {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return
    const [customId, ...args] = interaction.customId.split(':')
    const modal = client.modals.get(customId)
    if (!modal) return
    try {
      await modal.execute(client, interaction, ...args)
    } catch (error: any) {
      logger.error(error)
      await interaction.reply({ embeds: [new EmbedBuilder().setDescription('There was an error while executing this modal!').setColor(Colors.Red)], flags: MessageFlags.Ephemeral })
    }
  }
} satisfies Event