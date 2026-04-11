import type { FileNode } from '@/types'

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
      children: [],
    },
    {
      name: 'experience',
      type: 'directory',
      children: [],
    },
  ],
}

export function getChildren(path: string): FileNode[] {
  if (path === '~' || path === '') {
    return filesystem.children ?? []
  }

  const parts = path.replace('~/', '').split('/')
  let current = filesystem

  for (const part of parts) {
    const child = current.children?.find((c) => c.name === part)
    if (!child || child.type !== 'directory') return []
    current = child
  }

  return current.children ?? []
}
