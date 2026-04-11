import type { FileNode } from '@/types'
import { projects } from './projects'
import { experience } from './experience'

// Build filesystem dynamically from data — add a project or experience
// to its respective data file and it appears here automatically.
export const filesystem: FileNode = {
  name: '~',
  type: 'directory',
  children: [
    { name: 'about.md', type: 'file' },
    { name: 'contact.md', type: 'file' },
    { name: 'resume.pdf', type: 'file' },
    { name: 'skills.json', type: 'file' },
    {
      name: 'projects',
      type: 'directory',
      children: projects.map((p) => ({
        name: `${slugify(p.name)}.md`,
        type: 'file' as const,
      })),
    },
    {
      name: 'experience',
      type: 'directory',
      children: experience.map((e) => ({
        name: `${slugify(e.company)}.md`,
        type: 'file' as const,
      })),
    },
  ],
}

/** Set of removed file paths (e.g. "about.md", "projects/k8s-cluster-setup.md") — session only */
export const removedPaths = new Set<string>()

export function getNode(path: string): FileNode | undefined {
  if (path === '~' || path === '') {
    return filesystem
  }

  const parts = path.replace(/^~\/?/, '').split('/').filter(Boolean)
  let current: FileNode = filesystem

  for (const part of parts) {
    const child = current.children?.find((c) => c.name === part)
    if (!child) return undefined
    current = child
  }

  return current
}

export function getChildren(path: string): FileNode[] {
  const node = getNode(path)
  if (!node || node.type !== 'directory') return []
  return node.children ?? []
}

export function isValidDir(path: string): boolean {
  const node = getNode(path)
  return node?.type === 'directory'
}

export function removeNode(path: string, cwd: string): 'ok' | 'not-found' | 'is-directory' {
  // Resolve relative to cwd
  const clean = path.replace(/^\.\//, '').replace(/^~\//, '')
  const fullPath = clean.includes('/') ? clean : (cwd === '~' ? clean : `${cwd.replace(/^~\/?/, '')}/${clean}`)

  const parts = fullPath.split('/').filter(Boolean)
  const fileName = parts.pop()
  if (!fileName) return 'not-found'

  // Find parent
  let parent = filesystem
  for (const part of parts) {
    const child = parent.children?.find((c) => c.name === part && c.type === 'directory')
    if (!child) return 'not-found'
    parent = child
  }

  const idx = parent.children?.findIndex((c) => c.name === fileName)
  if (idx === undefined || idx === -1) return 'not-found'

  const node = parent.children![idx]!
  if (node.type === 'directory') return 'is-directory'

  parent.children!.splice(idx, 1)
  return 'ok'
}

export function removeDir(path: string, cwd: string): 'ok' | 'not-found' | 'not-empty' {
  const clean = path.replace(/^\.\//, '').replace(/^~\//, '')
  const fullPath = clean.includes('/') ? clean : (cwd === '~' ? clean : `${cwd.replace(/^~\/?/, '')}/${clean}`)

  const parts = fullPath.split('/').filter(Boolean)
  const dirName = parts.pop()
  if (!dirName) return 'not-found'

  let parent = filesystem
  for (const part of parts) {
    const child = parent.children?.find((c) => c.name === part && c.type === 'directory')
    if (!child) return 'not-found'
    parent = child
  }

  const idx = parent.children?.findIndex((c) => c.name === dirName && c.type === 'directory')
  if (idx === undefined || idx === -1) return 'not-found'

  const node = parent.children![idx]!
  if (node.children && node.children.length > 0) return 'not-empty'

  parent.children!.splice(idx, 1)
  return 'ok'
}

export function nukeAll(): void {
  if (filesystem.children) {
    filesystem.children.length = 0
  }
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
