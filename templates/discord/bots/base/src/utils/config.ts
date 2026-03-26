import 'dotenv/config'
import { logger } from './logger'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function optional(name: string): string | undefined {
  const value = process.env[name]
  if (!value) logger.warn(`Missing optional environment variable: ${name}`)
  return value
}

export const config = {
  token: required('DISCORD_TOKEN'),
  clientId: required('CLIENT_ID'),
  guildId: optional('GUILD_ID'),
}