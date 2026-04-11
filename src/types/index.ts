// --- Terminal Output ---
export type OutputLineType = 'default' | 'error' | 'success' | 'info' | 'heading' | 'table'

export interface OutputLine {
  text: string
  type: OutputLineType
  ariaLabel?: string
}

// --- Command System ---
export type CommandCategory = 'navigation' | 'info' | 'devops' | 'utility' | 'easter-egg'

export interface CommandDefinition {
  name: string
  description: string
  usage?: string
  category: CommandCategory
  handler: CommandHandler
}

export type CommandHandler = (args: string[], context: TerminalContext) => CommandOutput

export interface TerminalContext {
  currentPath: string
  commandHistory: string[]
}

export interface CommandOutput {
  lines: OutputLine[]
  updatePath?: string
  updateRoute?: string
}

// --- Portfolio Data ---
export interface Project {
  name: string
  status: 'Running' | 'Completed' | 'In Progress'
  techStack: string[]
  description: string
  links: {
    github?: string
    live?: string
    docs?: string
  }
  startDate: string
  namespace: string
}

export interface Skill {
  name: string
  category: string
  proficiency: 1 | 2 | 3 | 4 | 5
  years: number
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
  techUsed: string[]
}

export interface Contact {
  email: string
  github: string
  linkedin: string
  twitter?: string
  website?: string
}

// --- Theme ---
export interface Theme {
  name: string
  label: string
  colors: {
    bg: string
    fg: string
    prompt: string
    error: string
    success: string
    info: string
    heading: string
    muted: string
  }
}

// --- Virtual Filesystem ---
export interface FileNode {
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
}
