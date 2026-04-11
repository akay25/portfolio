import { registerCommand } from './registry'
import type { CommandHandler } from '@/types'

const shutdownHandler: CommandHandler = () => {
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s'
    document.body.style.opacity = '0'
    setTimeout(() => window.location.reload(), 600)
  }, 100)

  return {
    lines: [
      { text: '', type: 'default' },
      { text: 'Broadcast message from visitor@ajay:', type: 'heading' },
      { text: '', type: 'default' },
      { text: '  The system is going down for poweroff NOW!', type: 'error' },
    ],
  }
}

const rebootHandler: CommandHandler = () => {
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s'
    document.body.style.opacity = '0'
    setTimeout(() => window.location.reload(), 400)
  }, 100)

  return {
    lines: [
      { text: '', type: 'default' },
      { text: 'Broadcast message from visitor@ajay:', type: 'heading' },
      { text: '', type: 'default' },
      { text: '  The system is going down for reboot NOW!', type: 'info' },
    ],
  }
}

registerCommand({
  name: 'shutdown',
  description: 'Shutdown the terminal',
  category: 'utility',
  handler: shutdownHandler,
})

registerCommand({
  name: 'reboot',
  description: 'Reboot the terminal',
  category: 'utility',
  handler: rebootHandler,
})
