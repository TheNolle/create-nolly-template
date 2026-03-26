import { ModalSubmitInteraction } from 'discord.js'
import type {Client} from '../client'

export interface Modal {
  customId: string
  execute: (client: Client, interaction: ModalSubmitInteraction, ...args: string[]) => Promise<void> | void
}