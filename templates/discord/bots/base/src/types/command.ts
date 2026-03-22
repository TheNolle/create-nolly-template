import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import type { Client } from '../client'

export interface Command {
  category?: string
  data: SlashCommandBuilder
  cooldown?: number
  needRole?: string[]
  execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>
}