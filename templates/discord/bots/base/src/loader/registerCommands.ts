import { REST, Routes } from 'discord.js'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { Client } from '../client'
import { config } from '../config'
import { logger } from '../logger'

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
  const isDev = process.env.NODE_ENV !== 'production'
  logger.info(`\nRegistering ${commands.length} ${isDev ? 'development' : 'global'} commands...`)
  await rest.put(
    isDev ? Routes.applicationGuildCommands(config.clientId, config.guildId) : Routes.applicationCommands(config.clientId),
    { body: commands }
  )
  writeFileSync(HASH_FILE, hash)
  logger.info(`✔ Registered ${commands.length} ${isDev ? 'development' : 'global'} command(s)`)
}