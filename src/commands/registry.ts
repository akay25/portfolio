import type { CommandDefinition, CommandOutput, TerminalContext } from '@/types'
import { parseInput } from './parser'

const commands = new Map<string, CommandDefinition>()

export function registerCommand(def: CommandDefinition): void {
  commands.set(def.name, def)
}

export function executeCommand(input: string, context: TerminalContext): CommandOutput {
  const { command, args } = parseInput(input)

  if (command === '') {
    return { lines: [] }
  }

  const def = commands.get(command)

  if (!def) {
    return {
      lines: [
        {
          text: `command not found: ${command}. Type "help" for available commands.`,
          type: 'error',
        },
      ],
    }
  }

  return def.handler(args, context)
}

export function getCommands(): CommandDefinition[] {
  return Array.from(commands.values())
}

export function getCommandNames(): string[] {
  return Array.from(commands.keys())
}

// Commands are registered via src/commands/init.ts (imported in main.ts)
