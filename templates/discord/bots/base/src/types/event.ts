import type { ClientEvents } from 'discord.js'
import type { Client } from '../client'

export type Event = {
  [K in keyof ClientEvents]: {
    name: K
    once?: boolean
    execute: (client: Client, ...args: ClientEvents[K]) => Promise<void> | void
  }
}[keyof ClientEvents]