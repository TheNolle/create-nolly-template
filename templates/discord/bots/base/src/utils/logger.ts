type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success'

type LoggerConfig = {
  prefix?: string
  enabledLevels?: LogLevel[]
  showTimestamp?: boolean
  useColors?: boolean
}

type LogMethod = (message: string, data?: unknown) => void

const DEFAULT_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error', 'success']

const COLORS = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m',
}

const LEVEL_STYLES: Record<LogLevel, string> = {
  debug: COLORS.gray,
  info: COLORS.blue,
  warn: COLORS.yellow,
  error: COLORS.red,
  success: COLORS.green,
}

const formatTime = () => new Date().toISOString()

const stringify = (data: unknown): string => {
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return '[Unserializable Data]'
  }
}

function createLogger(config: LoggerConfig = {}) {
  const { prefix, enabledLevels = DEFAULT_LEVELS, showTimestamp = true, useColors = true } = config
  const timers = new Map<string, number>()
  const baseLog = (level: LogLevel, message: string, data?: unknown) => {
    if (!enabledLevels.includes(level)) return
    const color = useColors ? LEVEL_STYLES[level] : ''
    const reset = useColors ? COLORS.reset : ''
    const time = showTimestamp ? `[${formatTime()}]` : ''
    const pref = prefix ? `[${prefix}]` : ''
    const line = `${color}${time}${pref} ${message}${reset}`
    if (data !== undefined) {
      console.log(line)
      console.log(stringify(data))
    } else {
      console.log(line)
    }
  }

  const table = (rows: Record<string, any>[]) => {
    if (!Array.isArray(rows)) rows = []
    let columns = Array.from(
      rows.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k))
        return set
      }, new Set<string>()) as string[]
    )
    if (columns.length === 0) {
      columns = ['(empty)']
      rows = rows.length === 0 ? [{}] : rows
    }
    const colWidths = columns.map((col) => Math.max(col.length, ...rows.map((row) => String(row[col] ?? '').length)))
    const pad = (str: string, len: number) => str + ' '.repeat(len - str.length)
    const makeRow = (cells: string[]) => '│ ' + cells.map((c, i) => pad(c, colWidths[i])).join(' │ ') + ' │'
    const top = '┌─' + colWidths.map((w) => '─'.repeat(w)).join('─┬─') + '─┐'
    const middle = '├─' + colWidths.map((w) => '─'.repeat(w)).join('─┼─') + '─┤'
    const bottom = '└─' + colWidths.map((w) => '─'.repeat(w)).join('─┴─') + '─┘'
    console.log(top)
    console.log(makeRow(columns))
    console.log(middle)
    rows.forEach((row) => {
      const values = columns.map((col) => row[col] !== undefined ? String(row[col]) : '')
      console.log(makeRow(values))
    })
    console.log(bottom)
  }

  const time = (label: string) => {
    timers.set(label, performance.now())
    baseLog('debug', `Timer started: ${label}`)
  }

  const timeEnd = (label: string) => {
    const start = timers.get(label)
    if (!start) {
      baseLog('warn', `No timer found for: ${label}`)
      return
    }
    const duration = performance.now() - start
    timers.delete(label)
    baseLog('info', `Timer '${label}' finished in ${duration.toFixed(2)}ms`)
  }

  const logger: Record<LogLevel, LogMethod> & { table: typeof table, time: typeof time, timeEnd: typeof timeEnd } = {
    debug: (msg, data) => baseLog('debug', msg, data),
    info: (msg, data) => baseLog('info', msg, data),
    warn: (msg, data) => baseLog('warn', msg, data),
    error: (msg, data) => baseLog('error', msg, data),
    success: (msg, data) => baseLog('success', msg, data),
    table,
    time,
    timeEnd,
  }
  return logger
}

export const logger = createLogger({
  enabledLevels: process.env.NODE_ENV === 'development' ? DEFAULT_LEVELS : ['info', 'warn', 'error', 'success'],
  showTimestamp: process.env.NODE_ENV === 'development'
})