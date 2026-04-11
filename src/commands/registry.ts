import type { CommandDefinition, CommandOutput, TerminalContext } from '@/types'
import { parseInput, parsePipeline } from './parser'

const commands = new Map<string, CommandDefinition>()

export function registerCommand(def: CommandDefinition): void {
  commands.set(def.name, def)
}

export function executeCommand(input: string, context: TerminalContext): CommandOutput {
  // Check for pipes
  if (input.includes('|')) {
    return executePipeline(input, context)
  }

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

function executePipeline(input: string, context: TerminalContext): CommandOutput {
  const { commands: pipeline } = parsePipeline(input)

  if (pipeline.length === 0) {
    return { lines: [] }
  }

  // Execute first command
  const first = pipeline[0]!
  const firstDef = commands.get(first.command)

  if (!firstDef) {
    return {
      lines: [{ text: `command not found: ${first.command}. Type "help" for available commands.`, type: 'error' }],
    }
  }

  let result = firstDef.handler(first.args, context)

  // Pipe through remaining commands, passing previous output as __piped_input in args
  for (let i = 1; i < pipeline.length; i++) {
    const cmd = pipeline[i]!
    const def = commands.get(cmd.command)

    if (!def) {
      return {
        lines: [{ text: `command not found: ${cmd.command}. Type "help" for available commands.`, type: 'error' }],
      }
    }

    // Pass piped text as special first arg __pipe__ followed by the raw text
    const pipedText = result.lines.map((l) => l.text).join('\n')
    const pipeArgs = ['__pipe__', pipedText, ...cmd.args]
    result = def.handler(pipeArgs, context)
  }

  return result
}

export function getCommands(): CommandDefinition[] {
  return Array.from(commands.values())
}

export function getCommandNames(): string[] {
  return Array.from(commands.keys())
}

// Commands are registered via src/commands/init.ts (imported in main.ts)
