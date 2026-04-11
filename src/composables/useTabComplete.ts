import { getCommandNames } from '@/commands/registry'
import { getChildren } from '@/data/filesystem'

/** Known arguments per command for context-aware completion */
const commandArgs: Record<string, string[]> = {
  cd: ['..'],
  theme: ['matrix', 'amber', 'dracula', 'nord', 'solarized', 'cyberpunk'],
  kubectl: ['get', 'describe'],
  docker: ['images', 'ps', 'stats'],
  ssh: ['contact'],
  wget: ['/resume.pdf'],
  man: [], // filled dynamically
}

export interface TabCompleteResult {
  /** Completed input string (replaces the current input) */
  value: string
  /** All candidates shown when ambiguous (for inline display) */
  candidates: string[]
}

/**
 * Tab-complete the current input.
 * - First token: complete command names
 * - Subsequent tokens: complete known arguments or filesystem entries
 */
export function tabComplete(input: string, currentPath: string): TabCompleteResult {
  const trimmed = input.trimStart()
  const tokens = trimmed.split(/\s+/)
  const commandNames = getCommandNames()

  // Completing first token (command name)
  if (tokens.length <= 1) {
    const partial = (tokens[0] ?? '').toLowerCase()
    const matches = commandNames.filter((n) => n.startsWith(partial))

    if (matches.length === 1) {
      return { value: matches[0] + ' ', candidates: [] }
    }
    return { value: input, candidates: matches }
  }

  // Completing arguments
  const command = (tokens[0] ?? '').toLowerCase()
  const partialArg = (tokens[tokens.length - 1] ?? '').toLowerCase()
  const prefix = tokens.slice(0, -1).join(' ') + ' '

  // Gather candidates from known args + filesystem
  const candidates = buildArgCandidates(command, tokens, currentPath)
  const matches = candidates.filter((c) => c.toLowerCase().startsWith(partialArg))

  if (matches.length === 1) {
    return { value: prefix + matches[0] + ' ', candidates: [] }
  }

  if (matches.length > 1) {
    // Complete to longest common prefix
    const common = longestCommonPrefix(matches)
    if (common.length > partialArg.length) {
      return { value: prefix + common, candidates: matches }
    }
    return { value: input, candidates: matches }
  }

  return { value: input, candidates: [] }
}

/**
 * Get the best ghost suggestion for oh-my-zsh-style autosuggestion.
 * Searches command history first (most recent match), then command names.
 */
export function getSuggestion(input: string, history: string[]): string {
  if (!input.trim()) return ''

  const lower = input.toLowerCase()

  // Search history from most recent
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i]
    if (entry && entry.toLowerCase().startsWith(lower) && entry.toLowerCase() !== lower) {
      return entry
    }
  }

  // Fallback: match command names
  const commandNames = getCommandNames()
  const match = commandNames.find((n) => n.startsWith(lower))
  if (match && match !== lower) {
    return match
  }

  return ''
}

function buildArgCandidates(command: string, tokens: string[], currentPath: string): string[] {
  const known = commandArgs[command]

  // For 'man', complete with all command names
  if (command === 'man') {
    return getCommandNames()
  }

  // kubectl subcommand completion
  if (command === 'kubectl') {
    if (tokens.length === 2) return ['get', 'describe']
    if (tokens.length === 3 && tokens[1] === 'get') return ['projects', 'namespaces']
    if (tokens.length === 3 && tokens[1] === 'describe') return ['project']
    return []
  }

  // cat / cd: mix known args with filesystem entries
  if (command === 'cat' || command === 'cd') {
    const fsEntries = getChildren(currentPath).map((e) =>
      e.type === 'directory' ? e.name + '/' : e.name,
    )
    const all = new Set([...(known ?? []), ...fsEntries])
    return Array.from(all)
  }

  return known ?? []
}

/**
 * Get contextual suggestions for mobile command chips.
 * Returns full command strings the user can tap to fill.
 */
export function getMobileSuggestions(input: string, currentPath: string): string[] {
  const trimmed = input.trimStart()
  const max = 6

  // Empty input: show default commands
  if (!trimmed) {
    return ['help', 'ls', 'cat about.md', 'whoami', 'clear']
  }

  const tokens = trimmed.split(/\s+/)
  const commandNames = getCommandNames()

  // Typing first token: suggest matching command names
  if (tokens.length === 1) {
    const partial = (tokens[0] ?? '').toLowerCase()
    const matches = commandNames
      .filter((n) => n.startsWith(partial) && n !== partial)
      .slice(0, max)

    // If exact match, suggest that command's arguments
    if (commandNames.includes(partial)) {
      return buildFullSuggestions(partial, [], currentPath).slice(0, max)
    }

    return matches.length > 0 ? matches : ['help', 'ls', 'clear']
  }

  // Typing arguments: suggest full commands
  const command = (tokens[0] ?? '').toLowerCase()
  const partialArg = (tokens[tokens.length - 1] ?? '').toLowerCase()
  const prefix = tokens.slice(0, -1).join(' ')

  const candidates = buildArgCandidates(command, tokens, currentPath)
  const matches = candidates
    .filter((c) => c.toLowerCase().startsWith(partialArg))
    .slice(0, max)
    .map((c) => `${prefix} ${c}`.trim())

  return matches.length > 0 ? matches : [`${command} `]
}

/** Build full command suggestions for a known command */
function buildFullSuggestions(command: string, tokens: string[], currentPath: string): string[] {
  const args = buildArgCandidates(command, [command, ''], currentPath)
  return args.map((a) => `${command} ${a}`)
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  let prefix = strings[0] ?? ''
  for (let i = 1; i < strings.length; i++) {
    const s = strings[i] ?? ''
    while (!s.startsWith(prefix)) {
      prefix = prefix.slice(0, -1)
    }
  }
  return prefix
}
