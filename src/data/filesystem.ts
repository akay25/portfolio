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
        name: `${p.name}.md`,
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

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
