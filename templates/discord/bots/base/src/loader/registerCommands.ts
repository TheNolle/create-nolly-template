import { REST, Routes } from 'discord.js'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { Client } from '../client'
import { config } from '../utils/config'
import { logger } from '../utils/logger'

const HASH_FILE = join(process.cwd(), '.commands.hash')

export async function registerCommands(client: Client) {
  const commands = client.commands.map((command) => command.data.toJSON())
  const hash = createHash('sha256').update(JSON.stringify(commands)).digest('hex')
  const previousHash = existsSync(HASH_FILE) ? readFileSync(HASH_FILE, 'utf-8') : null
  if (hash === previousHash) {
    logger.info('\nCommands have not changed, skipping registration.')
    return
  }
  const rest = new REST({ version: '10' }).setToken(config.token)
  await rest.put(
    config.guildId ? Routes.applicationGuildCommands(config.clientId, config.guildId) : Routes.applicationCommands(config.clientId),
    { body: commands }
  )
  writeFileSync(HASH_FILE, hash)
  logger.info(`✔ Registered ${commands.length} ${config.guildId ? 'guild' : 'global'} command(s)`)
}