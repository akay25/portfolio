import type { Theme } from '@/types'

export const themes: Theme[] = [
  {
    name: 'matrix',
    label: 'Matrix Green',
    colors: {
      bg: '#0a0a0a',
      fg: '#00ff41',
      prompt: '#00ff41',
      error: '#ff3333',
      success: '#00ff41',
      info: '#00aaff',
      heading: '#ffcc00',
      muted: '#555555',
    },
  },
  {
    name: 'amber',
    label: 'Retro Amber',
    colors: {
      bg: '#1a1200',
      fg: '#ffb000',
      prompt: '#ffb000',
      error: '#ff4444',
      success: '#ffb000',
      info: '#ffd866',
      heading: '#ffffff',
      muted: '#665500',
    },
  },
  {
    name: 'dracula',
    label: 'Dracula',
    colors: {
      bg: '#282a36',
      fg: '#f8f8f2',
      prompt: '#50fa7b',
      error: '#ff5555',
      success: '#50fa7b',
      info: '#8be9fd',
      heading: '#bd93f9',
      muted: '#6272a4',
    },
  },
  {
    name: 'nord',
    label: 'Nord',
    colors: {
      bg: '#2e3440',
      fg: '#d8dee9',
      prompt: '#a3be8c',
      error: '#bf616a',
      success: '#a3be8c',
      info: '#88c0d0',
      heading: '#ebcb8b',
      muted: '#4c566a',
    },
  },
  {
    name: 'solarized',
    label: 'Solarized Dark',
    colors: {
      bg: '#002b36',
      fg: '#839496',
      prompt: '#859900',
      error: '#dc322f',
      success: '#859900',
      info: '#268bd2',
      heading: '#b58900',
      muted: '#586e75',
    },
  },
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    colors: {
      bg: '#0d0221',
      fg: '#ff00ff',
      prompt: '#00ffff',
      error: '#ff2a6d',
      success: '#05d9e8',
      info: '#d1f7ff',
      heading: '#ff00ff',
      muted: '#4a1942',
    },
  },
]

export const fontFamilies = [
  { name: 'default', label: 'System Mono', value: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', 'Consolas', 'Monaco', monospace" },
  { name: 'jetbrains', label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { name: 'firacode', label: 'Fira Code', value: "'Fira Code', monospace" },
  { name: 'cascadia', label: 'Cascadia Code', value: "'Cascadia Code', monospace" },
  { name: 'courier', label: 'Courier New', value: "'Courier New', monospace" },
  { name: 'consolas', label: 'Consolas', value: "'Consolas', monospace" },
]

export const fontSizes = [14, 16, 18, 20]

export function getTheme(name: string): Theme | undefined {
  return themes.find((t) => t.name === name)
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--terminal-${key}`, value)
  }
}

export function applyFont(family: string): void {
  document.documentElement.style.setProperty('--terminal-font', family)
}

export function applyFontSize(size: number): void {
  document.documentElement.style.setProperty('--terminal-font-size', `${size}px`)
}
