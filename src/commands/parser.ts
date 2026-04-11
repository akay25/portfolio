export interface ParsedInput {
  command: string
  args: string[]
  raw: string
}

export interface ParsedPipeline {
  commands: ParsedInput[]
}

export function parseInput(raw: string): ParsedInput {
  const trimmed = raw.trim()
  const tokens = trimmed.split(/\s+/)
  const command = (tokens[0] ?? '').toLowerCase()
  const args = tokens.slice(1)
  return { command, args, raw: trimmed }
}

export function parsePipeline(raw: string): ParsedPipeline {
  const segments: string[] = []
  let current = ''
  let inSingle = false
  let inDouble = false

  for (const ch of raw) {
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle
      current += ch
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble
      current += ch
    } else if (ch === '|' && !inSingle && !inDouble) {
      segments.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) segments.push(current.trim())

  return {
    commands: segments.filter(Boolean).map(parseInput),
  }
}

export function hasPipe(raw: string): boolean {
  let inSingle = false
  let inDouble = false
  for (const ch of raw) {
    if (ch === "'" && !inDouble) inSingle = !inSingle
    else if (ch === '"' && !inSingle) inDouble = !inDouble
    else if (ch === '|' && !inSingle && !inDouble) return true
  }
  return false
}
