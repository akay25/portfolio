import { registerCommand } from './registry'
import type { CommandHandler } from '@/types'

const handler: CommandHandler = () => {
  return { lines: [] }
}

registerCommand({
  name: 'clear',
  description: 'Clear terminal screen',
  category: 'utility',
  handler,
})
