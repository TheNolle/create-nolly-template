import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import type { Client } from '../client'
import type { Modal } from '../types/modal'
import { getFiles } from './utils'
import { logger } from '../utils/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function loadModals(client: Client) {
  const path = join(__dirname, '..', 'modals')
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  const files = (await getFiles(path)).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

  const table: { customId: string, file: string }[] = []

  for (const file of files) {
    const module = await import(pathToFileURL(file).href)
    const modal: Modal = module.default

    if (!modal.customId || !modal.execute) throw new Error(`Invalid modal structure in file: ${file}`)

    if (client.modals.has(modal.customId)) throw new Error(`Duplicate modal customId: ${modal.customId}`)
    client.modals.set(modal.customId, modal)

    table.push({ customId: modal.customId, file })
  }

  logger.info(`Loaded ${table.length} modals.`)
  logger.table(table)
}