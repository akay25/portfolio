import { registerCommand } from './registry'
import { isValidDir } from '@/data/filesystem'
import type { CommandHandler } from '@/types'

const handler: CommandHandler = (args, context) => {
  const target = args[0]

  // cd with no args or cd ~ → go home
  if (!target || target === '~') {
    return { lines: [], updatePath: '~' }
  }

  // Determine starting segments based on path type
  let segments: string[]
  if (target.startsWith('~/') || target === '~') {
    segments = [] // absolute from home
  } else if (target.startsWith('/')) {
    segments = [] // absolute from home
  } else {
    // relative: start from cwd
    segments = context.currentPath === '~' ? [] : context.currentPath.replace(/^~\/?/, '').split('/').filter(Boolean)
  }

  // Parse target path segments
  const targetParts = target.replace(/^~\/?/, '').replace(/^\//, '').split('/').filter(Boolean)

  for (const part of targetParts) {
    if (part === '..') {
      if (segments.length > 0) segments.pop()
      // at home, can't go higher — just stay
    } else if (part === '.') {
      continue
    } else {
      segments.push(part)
    }
  }

  const newPath = segments.length === 0 ? '~' : `~/${segments.join('/')}`

  if (isValidDir(newPath)) {
    return { lines: [], updatePath: newPath }
  }

  return {
    lines: [{ text: `cd: ${target}: No such directory`, type: 'error' }],
  }
}

registerCommand({
  name: 'cd',
  description: 'Change directory',
  usage: '<dir>',
  category: 'navigation',
  handler,
})

// pwd command — registered alongside cd
const pwdHandler: CommandHandler = (_args, context) => {
  return {
    lines: [{ text: context.currentPath, type: 'default' }],
  }
}

registerCommand({
  name: 'pwd',
  description: 'Print working directory',
  category: 'navigation',
  handler: pwdHandler,
})
