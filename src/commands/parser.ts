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
  const segments = raw.split('|').map((s) => s.trim()).filter(Boolean)
  return {
    commands: segments.map(parseInput),
  }
}
