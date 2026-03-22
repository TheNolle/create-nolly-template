import { readdir } from 'fs/promises'
import { join } from 'path'

export async function getFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name)
      return entry.isDirectory() ? getFiles(fullPath) : fullPath
    })
  )
  return files.flat()
}