import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import type { Client } from '../client'

export interface Command {
  category?: string
  needRole?: string[]
  cooldown?: number
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder
  autocomplete?: (client: Client, interaction: AutocompleteInteraction) => Promise<void> | void
  execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void
}