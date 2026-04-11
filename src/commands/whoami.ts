import { registerCommand } from './registry'
import type { CommandHandler } from '@/types'

const handler: CommandHandler = () => {
  return {
    lines: [{ text: 'ajay — DevOps Engineer', type: 'success' }],
  }
}

registerCommand({
  name: 'whoami',
  description: 'Display current user info',
  category: 'info',
  handler,
})
