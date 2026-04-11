import { registerCommand } from './registry'
import { about } from '@/data/about'
import { contact } from '@/data/contact'
import type { CommandHandler, OutputLine } from '@/types'

const handler: CommandHandler = (args) => {
  const filename = args[0]

  if (!filename) {
    return {
      lines: [{ text: 'Usage: cat <filename>', type: 'info' }],
    }
  }

  switch (filename) {
    case 'about.md':
      return formatAbout()
    case 'contact.md':
      return formatContact()
    default:
      return {
        lines: [
          {
            text: `cat: ${filename}: No such file or directory`,
            type: 'error',
          },
        ],
      }
  }
}

function formatAbout(): { lines: OutputLine[] } {
  const lines: OutputLine[] = [
    { text: '# about.md', type: 'heading' },
    { text: '', type: 'default' },
  ]

  for (const line of about.split('\n')) {
    lines.push({ text: line, type: 'default' })
  }

  return { lines }
}

function formatContact(): { lines: OutputLine[] } {
  const lines: OutputLine[] = [
    { text: '# contact.md', type: 'heading' },
    { text: '', type: 'default' },
  ]

  const entries: Array<[string, string | undefined]> = [
    ['Email', contact.email],
    ['GitHub', contact.github],
    ['LinkedIn', contact.linkedin],
    ['Twitter', contact.twitter],
    ['Website', contact.website],
  ]

  for (const [label, value] of entries) {
    if (value) {
      lines.push({
        text: `  ${label.padEnd(12)} ${value}`,
        type: 'info',
      })
    }
  }

  return { lines }
}

registerCommand({
  name: 'cat',
  description: 'Display file contents',
  usage: '<filename>',
  category: 'navigation',
  handler,
})
