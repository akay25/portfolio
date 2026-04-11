# PROJECT_STRUCTURE.md

DevOps Terminal Portfolio -- Architecture and Folder Structure

---

## Folder Tree

```
portfolio-website/
├── public/
│   ├── favicon.ico
│   ├── og-image.png                    # Open Graph preview image
│   └── resume.pdf                      # Downloadable resume file
│
├── src/
│   ├── main.ts                         # App entry: createApp, install plugins, mount
│   ├── App.vue                         # Root component: renders TerminalView, applies theme class
│   │
│   ├── router/
│   │   └── index.ts                    # Vue Router (hash mode), route-to-command mapping
│   │
│   ├── stores/
│   │   └── terminal.ts                 # Pinia store: terminal state, command execution, history
│   │
│   ├── types/
│   │   └── index.ts                    # All TypeScript interfaces (OutputLine, CommandHandler, etc.)
│   │
│   ├── commands/
│   │   ├── registry.ts                 # Command registry: Map<string, CommandHandler>, register/lookup
│   │   ├── parser.ts                   # Input parser: splits raw input into command + args
│   │   ├── help.ts                     # help command handler
│   │   ├── ls.ts                       # ls command handler
│   │   ├── cat.ts                      # cat command handler
│   │   ├── clear.ts                    # clear command handler
│   │   ├── whoami.ts                   # whoami command handler
│   │   ├── history.ts                  # history command handler
│   │   ├── neofetch.ts                 # neofetch command handler (Phase 2)
│   │   ├── kubectl.ts                  # kubectl command handler (Phase 2)
│   │   ├── ssh.ts                      # ssh contact command handler (Phase 2)
│   │   ├── download.ts                 # download resume command handler (Phase 2)
│   │   ├── cd.ts                       # cd/pwd command handler (Phase 3)
│   │   ├── grep.ts                     # grep command handler (Phase 3)
│   │   ├── docker.ts                   # docker command handler (Phase 3)
│   │   ├── theme.ts                    # theme command handler (Phase 3)
│   │   ├── man.ts                      # man command handler (Phase 3)
│   │   └── easter-eggs.ts             # All easter egg commands in one file (Phase 3)
│   │
│   ├── data/
│   │   ├── about.ts                    # Bio/about content (exported string)
│   │   ├── projects.ts                 # Project[] array
│   │   ├── skills.ts                   # Skill[] array
│   │   ├── experience.ts              # Experience[] array
│   │   ├── contact.ts                  # Contact object
│   │   ├── resume.ts                   # Resume text content (for cat resume.pdf)
│   │   ├── banner.ts                   # ASCII art banner + welcome message lines
│   │   └── filesystem.ts              # Virtual filesystem tree for ls/cd navigation
│   │
│   ├── components/
│   │   └── terminal/
│   │       ├── TerminalWindow.vue      # Outer frame: title bar, window chrome, layout
│   │       ├── TerminalOutput.vue      # Scrollable output area, renders OutputLine[]
│   │       ├── TerminalInput.vue       # Input field: prompt, cursor, key handlers
│   │       ├── CommandChips.vue        # Mobile command shortcut buttons
│   │       ├── AsciiArt.vue            # Pre-formatted ASCII block renderer
│   │       ├── TableRenderer.vue       # kubectl/docker-style table renderer
│   │       └── ProgressBar.vue         # ASCII loading/progress bar
│   │
│   ├── composables/
│   │   ├── useTabComplete.ts           # Tab completion logic (Phase 2)
│   │   └── useKeyboard.ts             # Keyboard event handling (arrow keys, Enter, Tab)
│   │
│   ├── themes/
│   │   └── index.ts                    # Theme definitions: CSS variable maps, theme list
│   │
│   └── assets/
│       └── terminal.css                # Base terminal styles, font, reset, CSS custom properties
│
├── index.html                          # HTML shell with meta tags, noscript fallback
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── PRD.md
├── PROJECT_STRUCTURE.md
└── CLAUDE.md
```

### Design Decisions

**Why flat `commands/` instead of nested folders?**
Each command handler is a single file with one export. There are roughly 15 commands total. Nesting them into subcategories (navigation/, devops/, easter-eggs/) adds indirection without value at this scale. One flat folder with descriptive filenames is simpler to navigate and import.

**Why a single `types/index.ts` instead of per-domain type files?**
The entire type surface is small (under 15 interfaces). A single file avoids import chains and lets any file do `import type { X } from '@/types'`.

**Why `composables/` is separate from `commands/`?**
Composables manage UI behavior (keyboard events, tab completion). Commands manage data logic (parsing input, returning output). Different concerns, different consumers.

**Why `easter-eggs.ts` is one file?**
Easter egg commands are trivial (1-5 line responses). Giving each its own file is over-engineering. They share a pattern: static string output. One file registers them all.

---

## Vue Router Configuration

### Hash Mode Setup

```typescript
// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Route-to-command mapping: each hash route triggers a terminal command on load.
// The actual UI is always the same TerminalView -- routes just auto-execute commands.
export const routeCommandMap: Record<string, string> = {
  '/':          '',                           // Home: show welcome banner only
  '/about':     'cat about.md',
  '/projects':  'kubectl get projects',
  '/skills':    'docker images',
  '/experience':'cat experience.md',
  '/contact':   'ssh contact',
  '/resume':    'cat resume.pdf',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/:section(.*)*',    // Catch-all: every path renders the same terminal view
    name: 'terminal',
    component: () => import('@/App.vue'),  // Or a dedicated TerminalView.vue if App.vue wraps more
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```

### How Route-to-Command Works

1. User navigates to `/#/projects` (via link, bookmark, or shared URL).
2. Router matches the catch-all route, renders the terminal view.
3. On mount (or on route change via `router.afterEach`), the terminal store checks `routeCommandMap[route.path]`.
4. If a command exists for that path, it is auto-executed via `terminalStore.executeCommand(cmd)`.
5. When a user manually types a command that maps to a section (e.g., `cat about.md`), the router hash updates silently via `router.replace({ path: '/about' })`.

This is a one-way sync: route changes trigger commands, and certain commands update the route. The terminal view component is always the same -- the router exists solely for deep linking, not for rendering different pages.

### Route Guard for Auto-Execution

```typescript
// In App.vue or TerminalView setup:
import { useRouter, useRoute } from 'vue-router'
import { routeCommandMap } from '@/router'
import { useTerminalStore } from '@/stores/terminal'

const route = useRoute()
const terminal = useTerminalStore()

// On initial load and route changes, auto-execute mapped command
watch(() => route.path, (path) => {
  const cmd = routeCommandMap[path]
  if (cmd) {
    terminal.executeCommand(cmd)
  }
}, { immediate: true })
```

---

## Command Registry Architecture

### Pattern: Simple Function Map

Each command handler is a pure function. The registry is a `Map<string, CommandDefinition>`. No classes, no inheritance, no plugin system.

```typescript
// src/types/index.ts (relevant excerpt)
export interface CommandDefinition {
  name: string
  description: string                           // Short description for help output
  usage?: string                                // Usage pattern, e.g., "cat <filename>"
  category: 'navigation' | 'info' | 'devops' | 'utility' | 'easter-egg'
  handler: CommandHandler
}

export type CommandHandler = (args: string[], context: TerminalContext) => CommandOutput

export interface TerminalContext {
  currentPath: string                           // Virtual cwd, e.g., "~" or "~/projects"
  commandHistory: string[]                      // Previous commands for history command
}

export interface CommandOutput {
  lines: OutputLine[]                           // Lines to render in terminal
  updatePath?: string                           // If command changes cwd (cd)
  updateRoute?: string                          // If command should update URL hash
}
```

### Registry Implementation

```typescript
// src/commands/registry.ts
import type { CommandDefinition, CommandHandler, CommandOutput, TerminalContext } from '@/types'

const commands = new Map<string, CommandDefinition>()

export function registerCommand(def: CommandDefinition): void {
  commands.set(def.name, def)
}

export function executeCommand(input: string, context: TerminalContext): CommandOutput {
  const { command, args } = parseInput(input)
  const def = commands.get(command)

  if (!def) {
    return {
      lines: [{ text: `command not found: ${command}`, type: 'error' }],
    }
  }

  return def.handler(args, context)
}

export function getCommands(): CommandDefinition[] {
  return Array.from(commands.values())
}

export function getCommandNames(): string[] {
  return Array.from(commands.keys())
}
```

### Command Registration

Each command file calls `registerCommand` at module level. All commands are imported once in an init file.

```typescript
// src/commands/help.ts
import { registerCommand } from './registry'
import type { CommandHandler } from '@/types'
import { getCommands } from './registry'

const handler: CommandHandler = (args, context) => {
  const commands = getCommands()
  const grouped = Object.groupBy(commands, (c) => c.category)

  const lines = [
    { text: 'Available commands:', type: 'heading' as const },
    { text: '', type: 'default' as const },
  ]

  for (const [category, cmds] of Object.entries(grouped)) {
    lines.push({ text: `  ${category.toUpperCase()}`, type: 'info' as const })
    for (const cmd of cmds ?? []) {
      lines.push({
        text: `    ${cmd.name.padEnd(24)} ${cmd.description}`,
        type: 'default' as const,
      })
    }
    lines.push({ text: '', type: 'default' as const })
  }

  return { lines }
}

registerCommand({
  name: 'help',
  description: 'Show available commands',
  category: 'navigation',
  handler,
})
```

### Command Initialization

```typescript
// src/commands/registry.ts (bottom of file, or a separate init.ts)
// Import all command modules to trigger their registerCommand calls.
// Order does not matter.

import './help'
import './ls'
import './cat'
import './clear'
import './whoami'
import './history'
// Phase 2:
// import './neofetch'
// import './kubectl'
// import './ssh'
// import './download'
// Phase 3:
// import './cd'
// import './grep'
// import './docker'
// import './theme'
// import './man'
// import './easter-eggs'
```

### Multi-Word Commands (kubectl, docker, ssh)

Commands like `kubectl get projects` are registered under the base command name (`kubectl`). The handler receives `['get', 'projects']` as args and dispatches internally via a simple switch or if-chain. No sub-command registry needed -- there are only 3-4 subcommands per tool.

```typescript
// src/commands/kubectl.ts (sketch)
const handler: CommandHandler = (args, context) => {
  const subcommand = args[0]

  if (subcommand === 'get' && args[1] === 'projects') {
    return renderProjectsTable(args)
  }
  if (subcommand === 'describe' && args[1] === 'project') {
    return renderProjectDetail(args[2])
  }
  if (subcommand === 'get' && args[1] === 'namespaces') {
    return renderNamespaces()
  }

  return { lines: [{ text: `kubectl: unknown command "${args.join(' ')}"`, type: 'error' }] }
}
```

---

## Input Parser

```typescript
// src/commands/parser.ts
export interface ParsedInput {
  command: string       // First token, lowercased
  args: string[]        // Remaining tokens
  raw: string           // Original input string
}

export function parseInput(raw: string): ParsedInput {
  const trimmed = raw.trim()
  const tokens = trimmed.split(/\s+/)
  const command = (tokens[0] ?? '').toLowerCase()
  const args = tokens.slice(1)
  return { command, args, raw: trimmed }
}
```

Simple whitespace split. No quoted string handling needed -- all arguments are simple identifiers (filenames, project names). If quoted strings become necessary later, this is the single place to enhance.

---

## Pinia Store Design

```typescript
// src/stores/terminal.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { executeCommand as execCmd } from '@/commands/registry'
import type { OutputLine } from '@/types'

export const useTerminalStore = defineStore('terminal', () => {
  // --- State ---
  const outputLines = ref<OutputLine[]>([])
  const commandHistory = ref<string[]>(loadHistory())
  const currentPath = ref('~')
  const themeName = ref(localStorage.getItem('theme') ?? 'matrix')
  const isProcessing = ref(false)

  // --- Getters ---
  const prompt = computed(() => `visitor@ajay-portfolio:${currentPath.value}$`)

  // --- Actions ---
  function executeCommand(input: string): void {
    if (!input.trim()) return

    // Add prompt + command echo to output
    pushOutput([{ text: `${prompt.value} ${input}`, type: 'default' }])

    // Execute via registry
    const context = { currentPath: currentPath.value, commandHistory: commandHistory.value }
    const result = execCmd(input, context)

    // Append result lines
    pushOutput(result.lines)

    // Update path if command changed it (cd)
    if (result.updatePath) {
      currentPath.value = result.updatePath
    }

    // Save to history
    addToHistory(input)
  }

  function pushOutput(lines: OutputLine[]): void {
    outputLines.value.push(...lines)
    // Trim to 500 lines max
    if (outputLines.value.length > 500) {
      outputLines.value = outputLines.value.slice(-500)
    }
  }

  function clearOutput(): void {
    outputLines.value = []
  }

  function setTheme(name: string): void {
    themeName.value = name
    localStorage.setItem('theme', name)
  }

  function addToHistory(cmd: string): void {
    commandHistory.value.push(cmd)
    if (commandHistory.value.length > 50) {
      commandHistory.value = commandHistory.value.slice(-50)
    }
    localStorage.setItem('history', JSON.stringify(commandHistory.value))
  }

  function loadHistory(): string[] {
    try {
      return JSON.parse(localStorage.getItem('history') ?? '[]')
    } catch {
      return []
    }
  }

  return {
    outputLines,
    commandHistory,
    currentPath,
    themeName,
    isProcessing,
    prompt,
    executeCommand,
    pushOutput,
    clearOutput,
    setTheme,
  }
})
```

### Store Shape Summary

| Property | Type | Purpose |
|---|---|---|
| `outputLines` | `OutputLine[]` | All visible terminal output (max 500 lines) |
| `commandHistory` | `string[]` | Last 50 commands, persisted to localStorage |
| `currentPath` | `string` | Virtual cwd (e.g., `~`, `~/projects`) |
| `themeName` | `string` | Active theme name, persisted to localStorage |
| `isProcessing` | `boolean` | True during animated commands (fake delays) |
| `prompt` | `string` (computed) | Full prompt string |

---

## Type System

All types live in `src/types/index.ts`.

```typescript
// src/types/index.ts

// --- Terminal Output ---

export type OutputLineType = 'default' | 'error' | 'success' | 'info' | 'heading' | 'table'

export interface OutputLine {
  text: string
  type: OutputLineType
  ariaLabel?: string          // Accessible description override
}

// --- Command System ---

export type CommandCategory = 'navigation' | 'info' | 'devops' | 'utility' | 'easter-egg'

export interface CommandDefinition {
  name: string
  description: string
  usage?: string              // e.g., "cat <filename>"
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
  updatePath?: string         // Set by cd command
  updateRoute?: string        // Set by commands that map to URL sections
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
  startDate: string           // YYYY-MM
  namespace: string           // Category: "devops", "frontend", "backend"
}

export interface Skill {
  name: string
  category: string            // e.g., "orchestration", "languages", "cloud"
  proficiency: 1 | 2 | 3 | 4 | 5
  years: number
}

export interface Experience {
  company: string
  role: string
  period: string              // e.g., "2020-01 - 2023-06"
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
  label: string               // Display name, e.g., "Matrix Green"
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
  children?: FileNode[]       // Only for directories
  content?: string            // Command to execute when cat'd, or display text
}
```

---

## Data Layer

All portfolio content is authored as TypeScript files exporting typed data. No JSON files -- TS gives type safety and allows template literals for multi-line content.

```typescript
// src/data/about.ts
export const about = `
  Hi, I'm Ajay -- a DevOps Engineer passionate about ...
  ...
`

// src/data/projects.ts
import type { Project } from '@/types'

export const projects: Project[] = [
  {
    name: 'infra-automation',
    status: 'Running',
    techStack: ['Terraform', 'AWS', 'GitHub Actions'],
    description: '...',
    links: { github: 'https://github.com/...' },
    startDate: '2023-01',
    namespace: 'devops',
  },
  // ...
]

// src/data/skills.ts
import type { Skill } from '@/types'

export const skills: Skill[] = [
  { name: 'Kubernetes', category: 'orchestration', proficiency: 5, years: 4 },
  { name: 'TypeScript', category: 'languages', proficiency: 4, years: 3 },
  // ...
]

// src/data/filesystem.ts
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
      children: [
        { name: 'infra-automation', type: 'file' },
        // ...populated from projects.ts at runtime
      ],
    },
    {
      name: 'experience',
      type: 'directory',
      children: [
        // ...populated from experience.ts at runtime
      ],
    },
  ],
}
```

### Data Access Pattern

Commands import data directly. No data store, no service layer, no abstraction.

```
cat.ts      → imports about, contact, resume from '@/data/*'
kubectl.ts  → imports projects from '@/data/projects'
docker.ts   → imports skills from '@/data/skills'
ls.ts       → imports filesystem from '@/data/filesystem'
```

Static imports. Tree-shakeable. Zero overhead.

---

## Component Hierarchy

```
App.vue
└── TerminalWindow.vue                 # Window chrome, layout, theme class
    ├── TerminalOutput.vue             # Scrollable output area
    │   ├── (renders OutputLine[] as styled divs)
    │   ├── AsciiArt.vue              # Used inline for banner, neofetch
    │   ├── TableRenderer.vue         # Used inline for kubectl/docker tables
    │   └── ProgressBar.vue           # Used inline for docker stats bars
    ├── CommandChips.vue               # Mobile-only, sticky above input
    └── TerminalInput.vue              # Input field with prompt
```

### Component Responsibilities

| Component | Props | Emits | Purpose |
|---|---|---|---|
| `TerminalWindow` | -- | -- | Layout shell: title bar, wraps output + input |
| `TerminalOutput` | `lines: OutputLine[]` | -- | Renders output, auto-scrolls, trims old lines |
| `TerminalInput` | `prompt: string`, `disabled: boolean` | `submit(input)` | Text input, key handling, history navigation |
| `CommandChips` | `commands: string[]` | `execute(cmd)` | Tappable shortcuts for mobile users |
| `AsciiArt` | `art: string`, `altText: string` | -- | Renders `<pre>` block with aria-label |
| `TableRenderer` | `headers: string[]`, `rows: string[][]` | -- | Monospaced table with column alignment |
| `ProgressBar` | `value: number`, `max: number`, `label: string` | -- | ASCII bar: `[========  ] 80%` |

### Data Flow

```
User types command
  → TerminalInput emits "submit"
  → TerminalWindow (or App.vue) calls terminalStore.executeCommand(input)
  → Store calls registry.executeCommand(input, context)
  → Command handler returns CommandOutput
  → Store appends lines to outputLines
  → TerminalOutput reactively renders new lines
  → TerminalOutput auto-scrolls to bottom
```

No event bus. No provide/inject chains. The Pinia store is the single source of truth. Components read from store and dispatch to store.

---

## Theme System

### Structure

Themes are CSS custom property maps. Switching themes changes CSS variables on a root element.

```typescript
// src/themes/index.ts
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
]

export function getTheme(name: string): Theme | undefined {
  return themes.find((t) => t.name === name)
}
```

### Application

```css
/* src/assets/terminal.css */
:root {
  --terminal-bg: #0a0a0a;
  --terminal-fg: #00ff41;
  --terminal-prompt: #00ff41;
  --terminal-error: #ff3333;
  --terminal-success: #00ff41;
  --terminal-info: #00aaff;
  --terminal-heading: #ffcc00;
  --terminal-muted: #555555;
}
```

Theme switching sets CSS variables on `document.documentElement.style` via the store's `setTheme` action. Components use `var(--terminal-fg)` etc. No scoped style overrides, no class-based theming, no CSS-in-JS.

---

## Accessibility Architecture

- `TerminalOutput` wraps its content in a `<div role="log" aria-live="polite" aria-label="Terminal output">`.
- `TerminalInput` uses `<input aria-label="Terminal command input" role="textbox">`.
- `AsciiArt` renders `<pre aria-label="[altText]" role="img">` -- screen readers get the alt text, not the raw ASCII.
- `CommandChips` uses `<button aria-label="Execute [command]">` for each chip.
- An `accessibility on` command (Phase 3) renders all portfolio content as semantic HTML in the output area.

---

## Phase Mapping to Files

### Phase 1 (MVP Core Shell)
Files to create:
- `src/types/index.ts`
- `src/stores/terminal.ts`
- `src/router/index.ts` (rewrite to hash mode)
- `src/commands/registry.ts`, `parser.ts`
- `src/commands/help.ts`, `ls.ts`, `cat.ts`, `clear.ts`, `whoami.ts`
- `src/data/about.ts`, `contact.ts`, `banner.ts`, `filesystem.ts`
- `src/components/terminal/TerminalWindow.vue`, `TerminalOutput.vue`, `TerminalInput.vue`, `CommandChips.vue`, `AsciiArt.vue`
- `src/composables/useKeyboard.ts`
- `src/themes/index.ts` (matrix theme only)
- `src/assets/terminal.css`
- Update `src/App.vue`, `src/main.ts`

### Phase 2 (Content and kubectl)
Files to add:
- `src/commands/neofetch.ts`, `kubectl.ts`, `ssh.ts`, `download.ts`, `history.ts`
- `src/data/projects.ts`, `skills.ts`, `experience.ts`, `resume.ts`
- `src/components/terminal/TableRenderer.vue`, `ProgressBar.vue`
- `src/composables/useTabComplete.ts`
- Router: route-to-command mapping wired up

### Phase 3 (Polish and Delight)
Files to add:
- `src/commands/cd.ts`, `grep.ts`, `docker.ts`, `theme.ts`, `man.ts`, `easter-eggs.ts`
- `src/themes/index.ts` updated with amber, dracula, nord, solarized
- `public/og-image.png`, SEO meta tags in `index.html`
- Noscript fallback content in `index.html`
