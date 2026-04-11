import { registerCommand } from './registry'
import { isValidDir } from '@/data/filesystem'
import type { CommandHandler } from '@/types'

const handler: CommandHandler = (args, context) => {
  const target = args[0]

  // cd with no args or cd ~ → go home
  if (!target || target === '~') {
    return { lines: [], updatePath: '~' }
  }

  // cd .. → go up one level
  if (target === '..') {
    if (context.currentPath === '~') {
      return { lines: [{ text: 'Already at home directory', type: 'info' }] }
    }
    const parts = context.currentPath.split('/')
    parts.pop()
    const newPath = parts.length <= 1 ? '~' : parts.join('/')
    return { lines: [], updatePath: newPath }
  }

  // cd ../.. or ../../ → go up multiple levels
  if (target.startsWith('..')) {
    const ups = target.split('/').filter((s) => s === '..').length
    const parts = context.currentPath.split('/')
    for (let i = 0; i < ups; i++) {
      if (parts.length > 1 || (parts.length === 1 && parts[0] !== '~')) {
        parts.pop()
      }
    }
    const newPath = parts.length === 0 || (parts.length === 1 && parts[0] === '') ? '~' : parts.join('/')
    return { lines: [], updatePath: newPath }
  }

  // Resolve absolute (~/projects) or relative (projects) path
  let resolvedPath: string
  if (target.startsWith('~/')) {
    resolvedPath = target
  } else if (target.startsWith('/')) {
    resolvedPath = '~' + target
  } else {
    resolvedPath = context.currentPath === '~' ? `~/${target}` : `${context.currentPath}/${target}`
  }

  // Strip trailing slash
  resolvedPath = resolvedPath.replace(/\/+$/, '')

  if (isValidDir(resolvedPath)) {
    return { lines: [], updatePath: resolvedPath }
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
