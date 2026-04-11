import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { executeCommand as execCmd } from '@/commands/registry'
import { welcomeLines } from '@/data/banner'
import type { OutputLine } from '@/types'

export const useTerminalStore = defineStore('terminal', () => {
  const outputLines = ref<OutputLine[]>([...welcomeLines])
  const commandHistory = ref<string[]>(loadHistory())
  const currentPath = ref('~')
  const themeName = ref(localStorage.getItem('theme') ?? 'matrix')
  const fontFamily = ref(localStorage.getItem('fontFamily') ?? "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', 'Consolas', 'Monaco', monospace")
  const fontSize = ref(Number(localStorage.getItem('fontSize')) || 14)
  const isProcessing = ref(false)

  const prompt = computed(() => `visitor@ajay:${currentPath.value}$`)

  function executeCommand(input: string): void {
    const trimmed = input.trim()
    if (!trimmed) return

    // Echo the command line
    pushOutput([{ text: `${prompt.value} ${trimmed}`, type: 'default' }])

    // Special case: clear
    if (trimmed.toLowerCase() === 'clear') {
      outputLines.value = []
      addToHistory(trimmed)
      return
    }

    const context = { currentPath: currentPath.value, commandHistory: commandHistory.value }
    const result = execCmd(trimmed, context)

    pushOutput(result.lines)

    if (result.updatePath) {
      currentPath.value = result.updatePath
    }

    addToHistory(trimmed)
  }

  function pushOutput(lines: OutputLine[]): void {
    outputLines.value.push(...lines)
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

  function setFontFamily(family: string): void {
    fontFamily.value = family
    localStorage.setItem('fontFamily', family)
  }

  function setFontSize(size: number): void {
    fontSize.value = size
    localStorage.setItem('fontSize', String(size))
  }

  function addToHistory(cmd: string): void {
    commandHistory.value.push(cmd)
    if (commandHistory.value.length > 50) {
      commandHistory.value = commandHistory.value.slice(-50)
    }
    try {
      localStorage.setItem('history', JSON.stringify(commandHistory.value))
    } catch {
      // localStorage may be full or unavailable
    }
  }

  return {
    outputLines,
    commandHistory,
    currentPath,
    themeName,
    fontFamily,
    fontSize,
    isProcessing,
    prompt,
    executeCommand,
    pushOutput,
    clearOutput,
    setTheme,
    setFontFamily,
    setFontSize,
  }
})

function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem('history') ?? '[]')
  } catch {
    return []
  }
}
