import { registerCommand } from './registry'
import { getChildren } from '@/data/filesystem'
import type { CommandHandler, OutputLine } from '@/types'

const handler: CommandHandler = (_args, context) => {
  const entries = getChildren(context.currentPath)

  if (entries.length === 0) {
    return { lines: [] }
  }

  const lines: OutputLine[] = []

  // Sort: directories first, then files, each group alphabetical
  const sorted = [...entries].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  for (const entry of sorted) {
    const isDir = entry.type === 'directory'
    lines.push({
      text: isDir ? `${entry.name}/` : entry.name,
      type: isDir ? 'info' : 'default',
    })
  }

  return { lines }
}

registerCommand({
  name: 'ls',
  description: 'List directory contents',
  category: 'navigation',
  handler,
})
