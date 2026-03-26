import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import type { Client } from '../client'
import type { Command } from '../types/command'
import { getFiles } from './utils'
import { logger } from '../utils/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function loadCommands(client: Client) {
  const path = join(__dirname, '..', 'commands')
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  const files = (await getFiles(path)).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

  const table: { name: string, file: string }[] = []

  for (const file of files) {
    const module = await import(pathToFileURL(file).href)
    const command: Command = module.default

    if (!command.data || !command.execute) throw new Error(`Invalid command structure in file: ${file}`)

    if (client.commands.has(command.data.name)) throw new Error(`Duplicate command name: ${command.data.name}`)
    client.commands.set(command.data.name, command)

    table.push({ name: command.data.name, file })
  }

  logger.info(`Loaded ${table.length} commands.`)
  logger.table(table)
}