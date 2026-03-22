import { SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags } from 'discord.js'
import type { Command } from '../types/command'

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(client, interaction) {
    await interaction.reply({ embeds: [new EmbedBuilder().setDescription('Pinging...').setColor(Colors.Yellow)], flags: [MessageFlags.Ephemeral] })
    const latency = Date.now() - interaction.createdTimestamp
    const apiLatency = Math.round(client.ws.ping)
    await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Pong! Latency: ${latency}ms. API Latency: ${apiLatency}ms.`).setColor(Colors.Green)] })
  }
} satisfies Command