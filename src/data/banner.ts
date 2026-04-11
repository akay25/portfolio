import type { OutputLine } from '@/types'

export const bannerArt = `
    ___       _   ___  __   __
   /   |     | | /   | \\ \\ / /
  / /| |     | |/ /| |  \\ V /
 / /_| | _   | / /_| |   | |
/  __  || |__| /  __  |  _/ |
\\_/  |_| \\____/\\_/  |_| |__/
$ ~/devops-portfolio --init
`

export const welcomeLines: OutputLine[] = [
  { text: bannerArt, type: 'success' },
  { text: '', type: 'default' },
  { text: "Welcome to Ajay's DevOps Terminal Portfolio", type: 'heading' },
  { text: 'Type "help" to see available commands.', type: 'info' },
  { text: '', type: 'default' },
]
