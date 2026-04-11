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
]

export function getTheme(name: string): Theme | undefined {
  return themes.find((t) => t.name === name)
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--terminal-${key}`, value)
  }
}
