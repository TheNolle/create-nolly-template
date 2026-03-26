import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import type { Client } from '../client'
import type { Event } from '../types/event'
import { getFiles } from './utils'
import { logger } from '../utils/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function loadEvents(client: Client) {
  const path = join(__dirname, '..', 'events')
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  const files = (await getFiles(path)).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

  const table: { name: string, once: boolean, file: string }[] = []

  for (const file of files) {
    const module = await import(pathToFileURL(file).href)
    const event: Event = module.default

    if (!event.name || !event.execute) throw new Error(`Invalid event structure in file: ${file}`)
    const execute = bindEventExecute(event, client)

    if (event.once) client.once(event.name, execute)
    else client.on(event.name, execute)

    if (!client.events.has(event.name)) client.events.set(event.name, [])
    client.events.get(event.name)?.push(event)
    table.push({ name: event.name, once: !!event.once, file })
  }

  logger.info(`Loaded ${table.length} events.`)
  logger.table(table)
}

function bindEventExecute(event: Event, client: Client) {
  return (...args: unknown[]) => (event.execute as (...args: any[]) => unknown)(client, ...args)
}