import { EmbedBuilder, Colors, MessageFlags, InteractionReplyOptions, GuildMember, User } from 'discord.js'
import type { Event } from '../types/event'
import { logger } from '../utils/logger'

export default {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return
    const command = client.commands.get(interaction.commandName)
    if (!command) return
    if (command.needRole && (!(interaction.member instanceof GuildMember) || !interaction.member.roles || !command.needRole.some(role => (interaction.member as GuildMember).roles.cache.has(role)))) {
      await interaction.reply({ embeds: [new EmbedBuilder().setDescription('You do not have permission to use this command!').setColor(Colors.Red)], flags: [MessageFlags.Ephemeral] })
      return
    }
    if (command.cooldown) {
      const now = Date.now()
      const timestamps = client.cooldowns.get(command.data.name) ?? new WeakMap<User, number>()
      const cooldownAmount = command.cooldown * 1000
      const user = interaction.user
      const last = timestamps.get(user)
      if (last && now < last + cooldownAmount) {
        const remaining = ((last + cooldownAmount - now) / 1000).toFixed(1)
        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Please wait ${remaining} more second(s) before reusing this command again.`).setColor(Colors.Orange)], flags: [MessageFlags.Ephemeral] })
        return
      }
      timestamps.set(user, now)
      client.cooldowns.set(command.data.name, timestamps)
    }
    try {
      await command.execute(client, interaction)
    } catch (error: any) {
      logger.error(error)
      const payload: InteractionReplyOptions = { embeds: [new EmbedBuilder().setDescription('There was an error while executing this command!').setColor(Colors.Red)], flags: [MessageFlags.Ephemeral] }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload)
      } else {
        await interaction.reply(payload)
      }
    }
  }
} satisfies Event