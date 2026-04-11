# PRD: DevOps Terminal Portfolio Website

**PRD_META**

- Name: DevOps Terminal Portfolio
- Owner: Ajay (Developer/Owner)
- Date: 2026-04-11
- Version: v0.1
- Repo/Context: /projects/portfolio-website (Vue 3 + TypeScript + Vite + Pinia)

---

**OVERVIEW**

- Problem: Traditional portfolio websites look generic and fail to demonstrate DevOps personality and technical depth.
- Target Users: Recruiters, hiring managers, fellow engineers, and open-source collaborators visiting the portfolio.
- Jobs-To-Be-Done:
  - Showcase projects, skills, and experience in a memorable, on-brand way.
  - Let visitors explore content through a familiar DevOps/Linux terminal metaphor.
  - Demonstrate front-end and DevOps competence through the portfolio itself.
- Value Hypothesis: A terminal-themed portfolio creates a strong first impression, signals deep DevOps familiarity, and is inherently more engaging than a static resume page.
- Business Context: Personal branding site; must be fast, deployable as a static site (Netlify/Vercel/GitHub Pages), and low-maintenance.

---

**SCOPE**

- In-Scope:
  - Fully interactive terminal UI (input, output, scrollback, prompt)
  - Command-based navigation (ls, cat, kubectl, help, etc.)
  - Sections: About, Projects, Skills, Experience, Contact, Resume/CV
  - ASCII art banner and welcome message
  - Command history (up/down arrow)
  - Tab completion for commands and arguments
  - Help system
  - Mobile-friendly terminal experience
  - Accessible fallback/screen-reader support
  - Dark terminal theme with optional color schemes
  - Static site build (SPA with Vue Router in hash mode)
  - Easter eggs and fun terminal interactions
- Non-Goals:
  - Backend server or database (all content is static/bundled)
  - User authentication or login
  - Blog/CMS functionality (v1)
  - Real shell execution or sandboxed code runner
  - Multi-language i18n support (v1)
  - Analytics dashboard (use external service if needed)

---

**USER_STORIES**

- US-1: As a visitor, I want to see a terminal-like interface on load so I immediately understand the DevOps theme.
- US-2: As a visitor, I want to type `help` to learn all available commands so I can navigate without guessing.
- US-3: As a visitor, I want to type `ls` to see available sections so I can discover content.
- US-4: As a visitor, I want to use `kubectl get projects` to list all projects in a table format.
- US-5: As a visitor, I want to use `kubectl describe project <name>` to see detailed project info.
- US-6: As a visitor, I want to use `cat about.md` to read the about section.
- US-7: As a visitor, I want command history via up/down arrows so I can re-run commands quickly.
- US-8: As a visitor, I want tab completion so I don't have to memorize exact command syntax.
- US-9: As a recruiter on mobile, I want to browse the site without a physical keyboard, so I can still view content.
- US-10: As a screen-reader user, I want content announced properly so I can access all portfolio information.

---

**REQUIREMENTS_FUNCTIONAL**

- FR-1: Terminal Shell UI
  - Priority: P0
  - Acceptance: Given the site loads, When the page renders, Then a full-screen terminal appears with a blinking cursor, prompt line (e.g., `visitor@ajay-portfolio:~$`), and scrollable output area.
  - Notes: Terminal fills viewport. Prompt format: `user@hostname:path$`. Output area scrolls; input stays pinned at bottom.

- FR-2: Command Parser and Router
  - Priority: P0
  - Acceptance: Given the terminal is active, When the user types a command and presses Enter, Then the command is parsed, matched to a handler, and output is rendered below the prompt.
  - Notes: Unknown commands display `command not found: <cmd>`. Commands are case-insensitive. Support piping display (e.g., `ls | grep projects` as an easter egg) is P2.

- FR-3: `help` Command
  - Priority: P0
  - Acceptance: Given the terminal is active, When the user types `help`, Then a formatted list of all available commands with descriptions is displayed.
  - Notes: Group commands by category (navigation, info, fun). Include `man <command>` for detailed help per command.

- FR-4: `ls` Command (Section Listing)
  - Priority: P0
  - Acceptance: Given the terminal is active, When the user types `ls`, Then available sections are listed in a directory-style format (e.g., `about.md  projects/  skills.json  experience/  contact.md  resume.pdf`).
  - Notes: Color-code directories vs files (blue for dirs, white for files). Support `ls -la` for detailed view with dates and sizes.

- FR-5: `cat` Command (Content Display)
  - Priority: P0
  - Acceptance: Given the user types `cat about.md`, When the command executes, Then the about section content renders as formatted terminal text.
  - Notes: Support `cat skills.json` (renders JSON-formatted skills), `cat contact.md`, `cat resume.pdf` (renders resume as text). If file not found, show standard error.

- FR-6: `kubectl` Commands (Project Navigation)
  - Priority: P0
  - Acceptance: Given the user types `kubectl get projects`, When the command executes, Then a kubectl-style table is displayed with columns: NAME, STATUS, TECH-STACK, AGE.
  - Notes: `kubectl get projects -o wide` adds DESCRIPTION and LINKS columns. `kubectl describe project <name>` shows full detail block in kubectl describe format (Name, Namespace, Labels, Description, Links, etc.). `kubectl get namespaces` lists skill categories.

- FR-7: `cd` Command (Directory Navigation)
  - Priority: P1
  - Acceptance: Given the user types `cd projects`, When the command executes, Then the prompt path updates to `~/projects` and `ls` shows project entries. `cd ..` returns to home.
  - Notes: Maintain a virtual filesystem tree. Only predefined paths are valid. `pwd` prints current path.

- FR-8: Command History
  - Priority: P0
  - Acceptance: Given the user has entered commands, When pressing Up/Down arrow keys, Then previous/next commands cycle in the input field.
  - Notes: Store last 50 commands in session. Persist to localStorage across visits. `history` command prints the list.

- FR-9: Tab Completion
  - Priority: P1
  - Acceptance: Given the user types a partial command or argument and presses Tab, Then the input auto-completes to the nearest match or shows options if ambiguous.
  - Notes: Complete command names first, then arguments (file names, project names). Double-tab shows all options.

- FR-10: Welcome Banner
  - Priority: P0
  - Acceptance: Given the site loads, When the terminal initializes, Then an ASCII art banner with the owner's name/handle is displayed, followed by a short welcome message and hint to type `help`.
  - Notes: ASCII art should be compact (max 8 lines). Include a fake "boot sequence" animation (optional, P1): kernel version, loading modules, etc. Keep it under 2 seconds.

- FR-11: `grep` Command (Search)
  - Priority: P1
  - Acceptance: Given the user types `grep <term>`, When the command executes, Then all sections containing the term are listed with matching snippets highlighted.
  - Notes: Search across all content (about, projects, skills, experience). Case-insensitive by default. Highlight matches in green.

- FR-12: `ssh contact` Command (Contact Section)
  - Priority: P1
  - Acceptance: Given the user types `ssh contact`, When the command executes, Then a "connecting..." animation plays followed by contact info (email, LinkedIn, GitHub, etc.) displayed in a formatted block.
  - Notes: Show fake SSH handshake output for flavor.

- FR-13: `docker` Commands (Skills/Tech Stack)
  - Priority: P1
  - Acceptance: Given the user types `docker images`, When the command executes, Then skills/technologies are listed as Docker images in a table: REPOSITORY, TAG (proficiency), SIZE (years of experience).
  - Notes: `docker ps` shows "currently running" (active/recent) technologies. `docker stats` shows skill proficiency bars rendered as ASCII bar charts.

- FR-14: `whoami` / `neofetch` Commands
  - Priority: P1
  - Acceptance: Given the user types `whoami`, Then the owner's name is printed. Given the user types `neofetch`, Then a system-info style block displays with ASCII art on the left and key-value pairs (Name, Role, Location, OS, Uptime as years of experience, Packages as number of skills, etc.) on the right.
  - Notes: `neofetch` is a high-impact first-impression command; mention it in help output prominently.

- FR-15: `cat resume.pdf` / `download resume` Command
  - Priority: P1
  - Acceptance: Given the user types `cat resume.pdf` or `download resume`, When the command executes, Then the resume content is displayed in the terminal and a download link/prompt is offered.
  - Notes: Actual PDF download via browser download dialog. `cat resume.pdf` shows a text summary; `download resume` triggers the file download.

- FR-16: Mobile Experience
  - Priority: P0
  - Acceptance: Given a mobile user visits the site, When the page loads, Then a virtual keyboard-friendly input is available, common commands are accessible via clickable suggestion chips above the input, and the terminal is scrollable.
  - Notes: Show persistent command chips for: help, ls, neofetch, kubectl get projects. Chips do not replace typing; they supplement it. Input field uses `inputmode="text"` and auto-focuses.

- FR-17: Accessibility Layer
  - Priority: P0
  - Acceptance: Given a screen reader is active, When content is rendered, Then all output is wrapped in ARIA live regions so new content is announced. The input has proper labels. A skip link or `accessibility` command provides a traditional HTML view of all content.
  - Notes: Command output should use `aria-live="polite"`. Provide `accessibility on` command that switches to a simplified, link-based HTML view. Ensure all ASCII art has alt-text equivalents.

- FR-18: Theme Switcher
  - Priority: P2
  - Acceptance: Given the user types `theme <name>`, When a valid theme is provided, Then terminal colors update immediately. `theme list` shows options.
  - Notes: Default theme: green-on-black (Matrix). Additional: amber-on-black (retro), light (solarized light), dracula, nord. Persist choice in localStorage.

- FR-19: Easter Eggs
  - Priority: P2
  - Acceptance: Given the user types a known easter egg command, Then a fun response is displayed.
  - Notes: Supported easter eggs:
    - `sudo hire me` -> "Permission granted. Sending offer letter..."
    - `rm -rf /` -> "Nice try. Permission denied. This portfolio is immutable."
    - `vim` or `nano` -> "Error: this portfolio is read-only. But I appreciate the effort."
    - `exit` -> "Logout? There's no escape from this portfolio. Type `help` instead."
    - `curl https://api.github.com/users/<handle>` -> Display real or mock GitHub stats.
    - `ping ajay` -> Fake ping output with decreasing latency: "Reply from ajay: time=<Xms>"
    - `uptime` -> Years/months since career start.
    - `top` -> Animated "process list" of current projects/activities.
    - `matrix` -> Brief Matrix rain animation (3-5 seconds).
    - `clear` -> Clears terminal output (functional, not really an easter egg).

- FR-20: URL Routing / Deep Linking
  - Priority: P1
  - Acceptance: Given the user navigates to `/#/projects` or `/#/about`, When the page loads, Then the terminal auto-executes the relevant command and displays that section's content.
  - Notes: Use Vue Router hash mode. Map routes to commands: `/` -> welcome, `/#/about` -> `cat about.md`, `/#/projects` -> `kubectl get projects`, `/#/contact` -> `ssh contact`. Update URL hash as commands are executed.

---

**REQUIREMENTS_NON_FUNCTIONAL**

- NFR-1 Performance: Initial page load under 1.5s on 3G. Total bundle under 200KB gzipped. Time-to-interactive under 2s. No layout shifts after initial render.
- NFR-2 Reliability: All commands respond within 100ms (no network calls). Site works fully offline after first load (service worker optional, P2). No runtime errors for any input string.
- NFR-3 Security: No eval() or dynamic code execution on user input. Sanitize all rendered output (XSS prevention). CSP headers configured for static host.
- NFR-4 Accessibility: WCAG 2.1 AA compliance. All content reachable via screen reader. Keyboard-only navigation fully supported. Sufficient color contrast in all themes (minimum 4.5:1).
- NFR-5 SEO/Discoverability: Server-rendered or prerendered meta tags (title, description, og:image). Structured data (JSON-LD Person schema). Sitemap.xml for crawlers. Meaningful content in noscript fallback.
- NFR-6 Browser Support: Latest 2 versions of Chrome, Firefox, Safari, Edge. iOS Safari and Chrome for Android.

---

**USER_FLOWS**

- Flow-1: First Visit
  - Step 1: Page loads, ASCII banner animates in.
  - Step 2: Welcome message displays with "Type `help` to get started."
  - Step 3: Cursor blinks in input field, ready for command.
  - Step 4: User types `help`, sees command list.
  - Step 5: User types `neofetch`, gets a quick overview of the owner.
  - Step 6: User types `kubectl get projects`, browses project list.
  - Step 7: User types `kubectl describe project <name>`, reads project details.

- Flow-2: Recruiter Quick Browse (Mobile)
  - Step 1: Page loads on mobile, banner appears.
  - Step 2: Command chips are visible: help, neofetch, projects, contact.
  - Step 3: Recruiter taps "neofetch" chip, sees profile summary.
  - Step 4: Recruiter taps "projects" chip, sees project table.
  - Step 5: Recruiter taps a suggested `describe` chip, reads project detail.
  - Step 6: Recruiter types or taps `ssh contact` to get contact info.

- Flow-3: Deep Link Sharing
  - Step 1: Owner shares `https://site.com/#/projects` on LinkedIn.
  - Step 2: Visitor opens link, terminal loads and auto-runs `kubectl get projects`.
  - Step 3: Visitor sees projects immediately; can continue typing commands.

---

**DATA_MODEL**

- Entity: PortfolioContent (static JSON/TS files, no database)
  - `about`: string (markdown-formatted bio)
  - `projects`: Project[] -- name, status, techStack, description, links, startDate
  - `skills`: Skill[] -- name, category, proficiency (1-5), yearsOfExperience
  - `experience`: Experience[] -- company, role, period, description, techUsed
  - `contact`: Contact -- email, github, linkedin, twitter, website
  - `resume`: string (text version) + static PDF file in `/public`

- Entity: Project
  - name: string
  - status: "Running" | "Completed" | "In Progress"
  - techStack: string[]
  - description: string
  - links: { github?: string, live?: string, docs?: string }
  - startDate: string (YYYY-MM)
  - namespace: string (category, e.g., "devops", "frontend", "backend")

- Entity: Skill
  - name: string (e.g., "kubernetes")
  - category: string (e.g., "orchestration")
  - proficiency: 1 | 2 | 3 | 4 | 5
  - years: number

- State:
  - Pinia store: `useTerminalStore` -- commandHistory, currentPath, outputLines, theme, isProcessing
  - localStorage: commandHistory (last 50), selectedTheme
  - No server state; all content compiled into the bundle

---

**INTERFACES_APIS_EVENTS**

- No external APIs. All content is static and bundled.
- Internal:
  - CommandRegistry: Map<string, CommandHandler> -- each command registers a handler function
  - CommandHandler signature: `(args: string[], context: TerminalContext) => CommandOutput`
  - CommandOutput: `{ lines: OutputLine[], updatePath?: string, updateUrl?: string }`
  - OutputLine: `{ text: string, type: "default" | "error" | "success" | "info" | "heading" | "table", ariaLabel?: string }`
- Event Bus (Pinia actions):
  - `executeCommand(input: string)` -- parse, route, render
  - `pushOutput(lines: OutputLine[])` -- append to terminal
  - `clearOutput()` -- clear screen
  - `setTheme(themeName: string)` -- switch color scheme

---

**UI_SURFACES**

- Screen: TerminalView (single page)
  - Purpose: The entire application is one full-screen terminal.
  - Components:
    - `TerminalWindow` -- outer frame with optional title bar (hostname, minimize/maximize/close dots for aesthetics)
    - `TerminalOutput` -- scrollable output area rendering OutputLine[] as styled divs
    - `TerminalInput` -- single-line input with prompt prefix, cursor, and key event handling
    - `CommandChips` -- mobile-only row of tappable command shortcuts (sticky above input)
    - `AsciiArt` -- reusable component for rendering pre-formatted ASCII blocks
    - `TableRenderer` -- renders kubectl-style and docker-style tables from structured data
    - `ProgressBar` -- ASCII progress/loading bars for animations

- Component: TerminalOutput
  - Props: lines (OutputLine[]), maxLines (number, default 500)
  - Behavior: Auto-scroll to bottom on new output. Trim oldest lines when exceeding maxLines.

- Component: TerminalInput
  - Props: prompt (string), disabled (boolean)
  - State: currentInput, historyIndex
  - Events: onSubmit, onTabComplete, onHistoryNav

---

**INTEGRATIONS**

- None required. Fully static site.
- Optional: Google Analytics or Plausible script tag for visit tracking (add via env variable, not bundled by default).

---

**SUCCESS_METRICS**

- User: Average session duration > 90 seconds (indicates exploration/engagement).
- User: > 60% of visitors execute at least 3 commands.
- Business: Portfolio generates inbound contact/recruiter messages (qualitative).
- Guardrails: Lighthouse performance score >= 90. Lighthouse accessibility score >= 90. Zero console errors in production.

---

**IMPLEMENTATION_PHASES**

- Phase 1 (MVP Core Shell):
  - Terminal UI: TerminalWindow, TerminalOutput, TerminalInput components
  - Command parser and registry system
  - Core commands: help, ls, cat (about, contact), clear, whoami
  - Welcome banner with ASCII art
  - Command history (up/down arrows)
  - Mobile input with basic command chips
  - ARIA live region for output
  - Green-on-black default theme
  - Exit: User can load site, type commands, and read about/contact content.

- Phase 2 (Content and kubectl):
  - kubectl commands: get projects, describe project, get namespaces
  - Project data model and content population
  - cat resume.pdf / download resume
  - neofetch command with styled output
  - ssh contact with animation
  - URL deep linking (hash routing)
  - Tab completion for commands and arguments
  - Exit: All portfolio content is browsable via commands. Deep links work.

- Phase 3 (Polish and Delight):
  - docker commands: images, ps, stats
  - grep search across all content
  - cd / pwd virtual filesystem navigation
  - Theme switcher with 3+ themes
  - Easter eggs (sudo hire me, rm -rf, vim, matrix, ping, uptime, top)
  - Boot sequence animation on first visit
  - Accessibility command for traditional HTML view
  - SEO: meta tags, JSON-LD, og:image, noscript fallback
  - Service worker for offline support
  - Exit: Lighthouse performance >= 90, accessibility >= 90. All easter eggs functional.

---

**PLANNER_HOOKS_OPTIONAL**

- Runtime:
  - `yarn dev` -- local dev server (Vite)
  - `yarn build` -- production build
  - `yarn preview` -- preview production build
  - `yarn lint` -- lint with oxlint + eslint
  - `yarn type-check` -- TypeScript checking
- Routes/Entry Points:
  - `src/main.ts` -- app entry
  - `src/App.vue` -- root component (will host TerminalView)
  - `src/router/index.ts` -- Vue Router config (hash mode for deep links)
- Integration Points:
  - `src/components/terminal/` -- all terminal UI components (new)
  - `src/commands/` -- command handler modules (new)
  - `src/data/` -- static portfolio content as TS/JSON files (new)
  - `src/stores/terminal.ts` -- Pinia terminal state (replace counter.ts)
  - `src/types/` -- TypeScript interfaces for commands, output, content (new)
  - `src/themes/` -- theme definitions (new)
  - `public/resume.pdf` -- downloadable resume file
  - `public/og-image.png` -- Open Graph preview image
- Testing:
  - No test framework scaffolded yet. Recommend Vitest (already compatible with Vite).
  - `src/commands/__tests__/` -- unit tests for each command handler
  - `src/components/__tests__/` -- component tests with Vue Test Utils

---

**RISKS_ASSUMPTIONS**

- Risks:
  - Visitors unfamiliar with terminals may bounce -> Mitigation: prominent `help` hint on load; mobile command chips; accessibility fallback view.
  - Terminal metaphor hurts SEO (content in JS, not crawlable) -> Mitigation: prerender meta tags, noscript fallback with full content, JSON-LD structured data.
  - Scope creep from endless "cool commands" -> Mitigation: strict phase gates; P0/P1 commands first; easter eggs are P2 only.
  - Mobile keyboard covers terminal output -> Mitigation: auto-scroll on focus; test on iOS Safari and Chrome Android; command chips reduce typing.
  - ASCII art breaks on narrow screens -> Mitigation: responsive ASCII art (short version for < 600px width); monospace font that scales.
- Assumptions:
  - Vue 3 + Vite + Pinia stack is confirmed (already scaffolded).
  - Content (projects, bio, skills) will be provided by the owner as static data.
  - Site will be deployed as a static SPA (no SSR needed).
  - Target audience has basic familiarity with terminals (but fallbacks exist for those who don't).
- Open Questions:
  - What is the owner's GitHub handle and professional details for content?
  - Should the boot animation be shown on every visit or only the first?
  - Is there a preferred deployment target (Vercel, Netlify, GitHub Pages)?
  - Maximum number of projects to display?
  - Should `curl` to real GitHub API be supported, or only mock data?

---

**RELEASE_ROLLOUT**

- Flags: None needed (personal site, no gradual rollout).
- Migration: No existing site to migrate from.
- Telemetry (optional):
  - Page view count
  - Commands executed (anonymized, no PII): command name frequency
  - Session duration
  - Device type (mobile vs desktop ratio)

---

**APPENDIX**

- Glossary:
  - Terminal -- The command-line interface UI that the entire website mimics.
  - Command Handler -- A function registered to process a specific command string.
  - OutputLine -- A single line of rendered terminal output with type metadata.
  - Command Chips -- Tappable mobile UI buttons that insert and execute common commands.
  - kubectl -- Kubernetes CLI tool; used as a metaphor for browsing project resources.
  - neofetch -- A Linux tool that displays system info; used here to show a profile summary.
- References:
  - Vue 3 docs: https://vuejs.org/
  - Vite docs: https://vite.dev/
  - Pinia docs: https://pinia.vuejs.org/
  - WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
  - xterm.js (reference, not dependency): https://xtermjs.org/
- Command Reference Table:

| Command | Section | Output Style | Phase |
|---|---|---|---|
| `help` | Navigation | Categorized list | 1 |
| `ls` | Navigation | Directory listing | 1 |
| `cat <file>` | Content | Formatted text | 1 |
| `clear` | Utility | Clears screen | 1 |
| `whoami` | About | Single line | 1 |
| `neofetch` | About | ASCII art + key-value | 2 |
| `kubectl get projects` | Projects | Table | 2 |
| `kubectl describe project <n>` | Projects | Detail block | 2 |
| `kubectl get namespaces` | Skills | Namespace list | 2 |
| `ssh contact` | Contact | Animated block | 2 |
| `cat resume.pdf` | Resume | Text + download | 2 |
| `download resume` | Resume | File download | 2 |
| `history` | Utility | Command list | 2 |
| `cd <path>` / `pwd` | Navigation | Path update | 3 |
| `grep <term>` | Search | Highlighted results | 3 |
| `docker images` | Skills | Image table | 3 |
| `docker ps` | Skills | Running container table | 3 |
| `docker stats` | Skills | ASCII bar chart | 3 |
| `theme <name>` | Utility | Color change | 3 |
| `man <command>` | Help | Detailed help | 3 |
| `sudo hire me` | Easter egg | Fun response | 3 |
| `rm -rf /` | Easter egg | Fun response | 3 |
| `matrix` | Easter egg | Rain animation | 3 |
| `ping ajay` | Easter egg | Fake ping output | 3 |
| `uptime` | Easter egg | Career duration | 3 |
| `top` | Easter egg | Animated process list | 3 |
| `exit` | Easter egg | Fun response | 3 |
| `vim` / `nano` | Easter egg | Fun response | 3 |
