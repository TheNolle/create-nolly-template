import { Client as DiscordClient, Collection, GatewayIntentBits, Partials, ClientEvents, User } from 'discord.js'
import type { Command } from './types/command'
import type { Event } from './types/event'
import { loadCommands } from './loader/commands'
import { loadEvents } from './loader/events'
import { loadModals } from './loader/modals'
import { registerCommands } from './loader/registerCommands'
import { Modal } from './types/modal'
import { logger } from './utils/logger'

type CooldownMap = WeakMap<User, number>

export class Client extends DiscordClient {
  public cooldowns = new Collection<string, CooldownMap>()
  public commands = new Collection<string, Command>()
  public events = new Collection<keyof ClientEvents, Event[]>()
  public modals = new Collection<string, Modal>()

  constructor() {
    super({
      intents: Object.values(GatewayIntentBits).filter(i => typeof i === 'number') as number[],
      partials: Object.values(Partials).filter(p => typeof p === 'number') as number[]
    })

    logger.info('[INIT] Client initialized')
  }

  async init() {
    await loadCommands(this)
    await loadEvents(this)
    await loadModals(this)
    await registerCommands(this)
    logger.info('[INIT] Client ready')
  }
}