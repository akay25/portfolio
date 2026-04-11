import { registerCommand } from './registry'
import { about } from '@/data/about'
import { contact } from '@/data/contact'
import { skills } from '@/data/skills'
import { projects } from '@/data/projects'
import { experience } from '@/data/experience'
import { slugify, removedPaths } from '@/data/filesystem'
import type { CommandHandler, OutputLine, Project, Experience } from '@/types'

const handler: CommandHandler = (args, context) => {
  const filename = args[0]

  if (!filename) {
    return {
      lines: [{ text: 'Usage: cat <filename>', type: 'info' }],
    }
  }

  // Resolve the file — could be an absolute path or relative to cwd
  const resolved = resolveFile(filename, context.currentPath)
  return resolved
}

function resolveFile(filename: string, cwd: string): { lines: OutputLine[] } {
  // Normalize: strip leading ./ and ~/
  const clean = filename.replace(/^\.\//, '').replace(/^~\//, '')

  // Check if it's a full path like projects/k8s-cluster-setup.md
  const fullPath = clean.includes('/') ? clean : resolveToCwd(clean, cwd)

  // Check if file was removed this session
  if (removedPaths.has('*') || removedPaths.has(fullPath)) {
    return {
      lines: [{ text: `cat: ${filename}: No such file or directory`, type: 'error' }],
    }
  }

  // Root-level files
  switch (fullPath) {
    case 'about.md': return formatAbout()
    case 'contact.md': return formatContact()
    case 'skills.json': return formatSkillsRaw()
    case 'resume.pdf': return openResume()
  }

  // Projects directory
  if (fullPath.startsWith('projects/')) {
    const slug = fullPath.replace('projects/', '').replace(/\.md$/, '')
    const project = projects.find((p) => slugify(p.name) === slug)
    if (project) return formatProject(project)
  }

  // Experience directory
  if (fullPath.startsWith('experience/')) {
    const slug = fullPath.replace('experience/', '').replace(/\.md$/, '')
    const exp = experience.find((e) => slugify(e.company) === slug)
    if (exp) return formatExperience(exp)
  }

  return {
    lines: [{ text: `cat: ${filename}: No such file or directory`, type: 'error' }],
  }
}

/** If user is inside a dir (e.g. ~/projects) and types cat foo.md, resolve to projects/foo.md */
function resolveToCwd(filename: string, cwd: string): string {
  if (cwd === '~') return filename
  const dir = cwd.replace(/^~\/?/, '')
  return dir ? `${dir}/${filename}` : filename
}

// --- Formatters ---

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
      lines.push({ text: `  ${label.padEnd(12)} ${value}`, type: 'info' })
    }
  }
  return { lines }
}

function formatSkillsRaw(): { lines: OutputLine[] } {
  return { lines: [{ text: JSON.stringify(skills), type: 'default' }] }
}

function openResume(): { lines: OutputLine[] } {
  window.open('/resume.pdf', '_blank')
  return {
    lines: [
      { text: '# resume.pdf', type: 'heading' },
      { text: '', type: 'default' },
      { text: 'Opening resume in a new tab...', type: 'success' },
      { text: 'To download, run: wget /resume.pdf', type: 'info' },
    ],
  }
}

function formatProject(p: Project): { lines: OutputLine[] } {
  const lines: OutputLine[] = [
    { text: `# ${p.name}`, type: 'heading' },
    { text: '', type: 'default' },
    { text: `  Status:      ${p.status}`, type: p.status === 'Running' ? 'success' : 'info' },
    { text: `  Started:     ${p.startDate}`, type: 'default' },
    { text: `  Category:    ${p.namespace}`, type: 'default' },
    { text: `  Tech Stack:  ${p.techStack.join(', ')}`, type: 'info' },
    { text: '', type: 'default' },
    { text: '  Description:', type: 'heading' },
  ]
  for (const line of wrapText(p.description, 70)) {
    lines.push({ text: `    ${line}`, type: 'default' })
  }
  lines.push({ text: '', type: 'default' })
  if (p.links.github) {
    lines.push({ text: `  GitHub:  ${p.links.github}`, type: 'info' })
  }
  if (p.links.live) {
    lines.push({ text: `  Live:    ${p.links.live}`, type: 'info' })
  }
  if (p.links.docs) {
    lines.push({ text: `  Docs:    ${p.links.docs}`, type: 'info' })
  }
  return { lines }
}

function formatExperience(e: Experience): { lines: OutputLine[] } {
  const lines: OutputLine[] = [
    { text: `# ${e.company}`, type: 'heading' },
    { text: '', type: 'default' },
    { text: `  Role:    ${e.role}`, type: 'success' },
    { text: `  Period:  ${e.period}`, type: 'default' },
    { text: '', type: 'default' },
    { text: '  Description:', type: 'heading' },
  ]
  for (const line of wrapText(e.description, 70)) {
    lines.push({ text: `    ${line}`, type: 'default' })
  }
  lines.push({ text: '', type: 'default' })
  lines.push({ text: `  Tech Used:  ${e.techUsed.join(', ')}`, type: 'info' })
  return { lines }
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth && current.length > 0) {
      lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

registerCommand({
  name: 'cat',
  description: 'Display file contents',
  usage: '<filename>',
  category: 'navigation',
  handler,
})
