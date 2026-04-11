export interface ParsedInput {
  command: string
  args: string[]
  raw: string
}

export function parseInput(raw: string): ParsedInput {
  const trimmed = raw.trim()
  const tokens = trimmed.split(/\s+/)
  const command = (tokens[0] ?? '').toLowerCase()
  const args = tokens.slice(1)
  return { command, args, raw: trimmed }
}
