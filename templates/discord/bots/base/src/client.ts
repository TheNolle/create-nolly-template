import { Client as DiscordClient, Collection, GatewayIntentBits, Partials, ClientEvents, User } from 'discord.js'
import type { Command } from './types/command'
import type { Event } from './types/event'
import { loadCommands } from './loader/commands'
import { loadEvents } from './loader/events'
import { registerCommands } from './loader/registerCommands'

type CooldownMap = WeakMap<User, number>

export class Client extends DiscordClient {
  public cooldowns: Collection<string, CooldownMap> = new Collection()
  public commands: Collection<string, Command> = new Collection()
  public events: Collection<keyof ClientEvents, Event[]> = new Collection()

  constructor() {
    const intents = Object.values(GatewayIntentBits).filter((intent) => typeof intent === 'number') as number[]
    const partials = Object.values(Partials).filter((partial) => typeof partial === 'number') as number[]
    super({ intents, partials })
  }

  async init() {
    await loadCommands(this)
    await loadEvents(this)

    await registerCommands(this)
  }
}