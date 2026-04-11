import { registerCommand } from './registry'
import { removeNode, removeDir, nukeAll, getNode, removedPaths } from '@/data/filesystem'
import type { CommandHandler, OutputLine } from '@/types'

const handler: CommandHandler = (args, context) => {
  if (args.length === 0) {
    return { lines: [{ text: 'Usage: rm <file>', type: 'info' }] }
  }

  const raw = args.join(' ')

  // rm -rf / — the classic
  if (raw === '-rf /' || raw === '-rf ~' || raw === '-rf ~/' || raw === '-rf /*') {
    removedPaths.add('*')
    nukeAll()
    const lines: OutputLine[] = [
      { text: '', type: 'default' },
      { text: '  Deleting entire filesystem...', type: 'error' },
      { text: '  ████████████████████████████ 100%', type: 'error' },
      { text: '', type: 'default' },
      { text: '  Just kidding. Well, sort of.', type: 'heading' },
      { text: '  All files have been removed for this session.', type: 'info' },
      { text: '  Refresh the page to restore everything.', type: 'info' },
      { text: '', type: 'default' },
      { text: '  "With great power comes great responsibility."', type: 'default' },
      { text: '  — Every sysadmin ever', type: 'default' },
    ]
    return { lines, updatePath: '~' }
  }

  const isRecursive = args.includes('-rf') || args.includes('-r') || args.includes('-Rf')
  const fileArgs = args.filter((a) => !a.startsWith('-'))
  const target = fileArgs[0]

  if (!target) {
    return { lines: [{ text: 'rm: missing operand', type: 'error' }] }
  }

  // Resolve full path for tracking
  const clean = target.replace(/^\.\//, '').replace(/^~\//, '')
  const fullPath = clean.includes('/')
    ? clean
    : (context.currentPath === '~' ? clean : `${context.currentPath.replace(/^~\/?/, '')}/${clean}`)

  // Try removing as file
  const result = removeNode(target, context.currentPath)

  if (result === 'ok') {
    removedPaths.add(fullPath)
    return {
      lines: [{ text: `removed '${target}'`, type: 'success' }],
    }
  }

  if (result === 'is-directory') {
    if (!isRecursive) {
      return {
        lines: [{ text: `rm: cannot remove '${target}': Is a directory (use rm -rf)`, type: 'error' }],
      }
    }
    return nukeDirRecursive(target, context.currentPath)
  }

  return {
    lines: [{ text: `rm: cannot remove '${target}': No such file or directory`, type: 'error' }],
  }
}

function nukeDirRecursive(target: string, cwd: string): { lines: OutputLine[], updatePath?: string } {
  const clean = target.replace(/^\.\//, '').replace(/^~\//, '')
  const fullPath = clean.includes('/') ? clean : (cwd === '~' ? clean : `${cwd.replace(/^~\/?/, '')}/${clean}`)

  const node = getNode(fullPath)
  if (!node || node.type !== 'directory') {
    return { lines: [{ text: `rm: '${target}': No such directory`, type: 'error' }] }
  }

  const count = countNodes(node)

  // Mark all children as removed
  markRemoved(node, fullPath)
  removedPaths.add(fullPath)

  // Clear children then remove the dir itself
  if (node.children) node.children.length = 0
  removeDir(target, cwd)

  return {
    lines: [
      { text: `removed directory '${target}' (${count} items)`, type: 'success' },
      { text: 'Refresh the page to restore.', type: 'info' },
    ],
  }
}

function markRemoved(node: { name: string, children?: { name: string, children?: unknown[] }[] }, parentPath: string): void {
  for (const child of node.children ?? []) {
    const childPath = `${parentPath}/${child.name}`
    removedPaths.add(childPath)
    if (child.children) markRemoved(child as typeof node, childPath)
  }
}

function countNodes(node: { children?: { children?: unknown[] }[] }): number {
  let count = 0
  for (const child of node.children ?? []) {
    count++
    if (child.children) count += countNodes(child as typeof node)
  }
  return count
}

registerCommand({
  name: 'rm',
  description: 'Remove files (session only)',
  usage: '<file>',
  category: 'utility',
  handler,
})
