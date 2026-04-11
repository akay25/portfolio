import { registerCommand } from './registry'
import type { CommandHandler, OutputLine } from '@/types'

const handler: CommandHandler = (args) => {
  // Check if piped input exists
  const isPiped = args[0] === '__pipe__'

  if (!isPiped) {
    return {
      lines: [{ text: 'Usage: cat <file.json> | jq .', type: 'info' }],
    }
  }

  const pipedText = args[1] ?? ''
  // Remaining args after __pipe__ and the text are jq filter args
  // e.g. jq . or jq '.[] | .name'
  // For now we support: "." (pretty print), "keys", ".field"

  let parsed: unknown
  try {
    parsed = JSON.parse(pipedText)
  } catch {
    return {
      lines: [{ text: 'jq: error: invalid JSON input', type: 'error' }],
    }
  }

  const filter = args.slice(2).join(' ') || '.'
  const result = applyFilter(parsed, filter)

  return { lines: result }
}

function applyFilter(data: unknown, filter: string): OutputLine[] {
  // "." — pretty print with syntax highlighting
  if (filter === '.') {
    return colorizeJson(data, 0)
  }

  // ".field" — access a top-level field
  if (filter.startsWith('.') && filter.length > 1 && !filter.includes('[')) {
    const key = filter.slice(1)
    if (typeof data === 'object' && data !== null && key in data) {
      return colorizeJson((data as Record<string, unknown>)[key], 0)
    }
    return [{ text: `jq: error: field '${key}' not found`, type: 'error' }]
  }

  // ".[]" — iterate array elements
  if (filter === '.[]') {
    if (Array.isArray(data)) {
      const lines: OutputLine[] = []
      for (const item of data) {
        lines.push(...colorizeJson(item, 0))
      }
      return lines
    }
    return [{ text: 'jq: error: cannot iterate over non-array', type: 'error' }]
  }

  // "keys" — list keys
  if (filter === 'keys') {
    if (Array.isArray(data)) {
      return colorizeJson(data.map((_, i) => i), 0)
    }
    if (typeof data === 'object' && data !== null) {
      return colorizeJson(Object.keys(data), 0)
    }
    return [{ text: 'jq: error: cannot get keys of non-object', type: 'error' }]
  }

  // "length"
  if (filter === 'length') {
    if (Array.isArray(data)) {
      return [{ text: String(data.length), type: 'info' }]
    }
    if (typeof data === 'object' && data !== null) {
      return [{ text: String(Object.keys(data).length), type: 'info' }]
    }
    return [{ text: String(String(data).length), type: 'info' }]
  }

  return [{ text: `jq: error: unsupported filter '${filter}'`, type: 'error' }]
}

function colorizeJson(data: unknown, indent: number): OutputLine[] {
  const pad = '  '.repeat(indent)
  const lines: OutputLine[] = []

  if (data === null) {
    lines.push({ text: `${pad}null`, type: 'info' })
  } else if (typeof data === 'boolean') {
    lines.push({ text: `${pad}${data}`, type: 'info' })
  } else if (typeof data === 'number') {
    lines.push({ text: `${pad}${data}`, type: 'success' })
  } else if (typeof data === 'string') {
    lines.push({ text: `${pad}"${data}"`, type: 'heading' })
  } else if (Array.isArray(data)) {
    if (data.length === 0) {
      lines.push({ text: `${pad}[]`, type: 'default' })
    } else {
      lines.push({ text: `${pad}[`, type: 'default' })
      for (let i = 0; i < data.length; i++) {
        const itemLines = colorizeJson(data[i], indent + 1)
        const isLast = i === data.length - 1

        if (isScalar(data[i])) {
          const text = itemLines[0]?.text ?? ''
          lines.push({ text: text + (isLast ? '' : ','), type: itemLines[0]?.type ?? 'default' })
        } else {
          lines.push(...itemLines.slice(0, -1))
          const lastLine = itemLines[itemLines.length - 1]
          if (lastLine) {
            lines.push({ text: lastLine.text + (isLast ? '' : ','), type: lastLine.type })
          }
        }
      }
      lines.push({ text: `${pad}]`, type: 'default' })
    }
  } else if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) {
      lines.push({ text: `${pad}{}`, type: 'default' })
    } else {
      lines.push({ text: `${pad}{`, type: 'default' })
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i]!
        const isLast = i === entries.length - 1

        if (isScalar(value)) {
          const valLines = colorizeJson(value, 0)
          const valText = valLines[0]?.text?.trim() ?? ''
          const valType = valLines[0]?.type ?? 'default'
          // Key in info color, value in its own color
          lines.push({
            text: `${'  '.repeat(indent + 1)}"${key}": ${valText}${isLast ? '' : ','}`,
            type: valType,
          })
        } else {
          lines.push({ text: `${'  '.repeat(indent + 1)}"${key}":`, type: 'info' })
          const valLines = colorizeJson(value, indent + 2)
          lines.push(...valLines.slice(0, -1))
          const lastLine = valLines[valLines.length - 1]
          if (lastLine) {
            lines.push({ text: lastLine.text + (isLast ? '' : ','), type: lastLine.type })
          }
        }
      }
      lines.push({ text: `${pad}}`, type: 'default' })
    }
  }

  return lines
}

function isScalar(value: unknown): boolean {
  return value === null || typeof value !== 'object'
}

registerCommand({
  name: 'jq',
  description: 'Format and filter JSON',
  usage: '<filter>',
  category: 'utility',
  handler,
})
