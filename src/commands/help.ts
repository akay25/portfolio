import { registerCommand, getCommands } from './registry'
import type { CommandHandler, OutputLine } from '@/types'

const handler: CommandHandler = () => {
  const allCommands = getCommands()
  const lines: OutputLine[] = [
    { text: 'Available Commands:', type: 'heading' },
    { text: '', type: 'default' },
  ]

  // Group commands by category
  const categories = new Map<string, typeof allCommands>()
  for (const cmd of allCommands) {
    const existing = categories.get(cmd.category) ?? []
    existing.push(cmd)
    categories.set(cmd.category, existing)
  }

  // Display in a defined order so output is predictable
  const categoryOrder = ['navigation', 'info', 'devops', 'utility', 'easter-egg'] as const
  for (const cat of categoryOrder) {
    const cmds = categories.get(cat)
    if (!cmds?.length) continue

    lines.push({ text: `  ${cat.toUpperCase()}`, type: 'info' })

    for (const cmd of cmds) {
      const nameWithUsage = cmd.usage ? `${cmd.name} ${cmd.usage}` : cmd.name
      lines.push({
        text: `    ${nameWithUsage.padEnd(28)} ${cmd.description}`,
        type: 'default',
      })
    }

    lines.push({ text: '', type: 'default' })
  }

  lines.push({
    text: 'Tip: Use ↑/↓ arrows to navigate command history.',
    type: 'info',
  })

  return { lines }
}

registerCommand({
  name: 'help',
  description: 'Show available commands',
  category: 'navigation',
  handler,
})
