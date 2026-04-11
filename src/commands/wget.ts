import { registerCommand } from './registry'
import type { CommandHandler } from '@/types'

const handler: CommandHandler = (args) => {
  const target = args[0]

  if (!target) {
    return {
      lines: [{ text: 'Usage: wget <file>', type: 'info' }],
    }
  }

  if (target === '/resume.pdf' || target === 'resume.pdf') {
    const a = document.createElement('a')
    a.href = '/resume.pdf'
    a.download = 'resume.pdf'
    a.click()

    return {
      lines: [
        { text: `--2026-04-11 12:00:00--  https://ajay.dev/resume.pdf`, type: 'default' },
        { text: 'Resolving ajay.dev... connected.', type: 'default' },
        { text: 'HTTP request sent, awaiting response... 200 OK', type: 'success' },
        { text: `Saving to: 'resume.pdf'`, type: 'success' },
        { text: '', type: 'default' },
        { text: 'resume.pdf      100%[===================>]  downloaded', type: 'info' },
      ],
    }
  }

  return {
    lines: [{ text: `wget: unable to resolve host '${target}': Name or service not known`, type: 'error' }],
  }
}

registerCommand({
  name: 'wget',
  description: 'Download a file',
  usage: '<file>',
  category: 'utility',
  handler,
})
