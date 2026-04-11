import { ref } from 'vue'

export function useKeyboard(history: () => string[]) {
  const historyIndex = ref(-1)

  function onKeyDown(
    event: KeyboardEvent,
    currentInput: string,
    setInput: (val: string) => void,
  ): void {
    const cmds = history()

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (cmds.length === 0) return
      if (historyIndex.value === -1) {
        historyIndex.value = cmds.length - 1
      } else if (historyIndex.value > 0) {
        historyIndex.value--
      }
      const cmd = cmds[historyIndex.value]
      if (cmd !== undefined) setInput(cmd)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex.value === -1) return
      if (historyIndex.value < cmds.length - 1) {
        historyIndex.value++
        const cmd = cmds[historyIndex.value]
        if (cmd !== undefined) setInput(cmd)
      } else {
        historyIndex.value = -1
        setInput('')
      }
    }
  }

  function resetIndex(): void {
    historyIndex.value = -1
  }

  return { onKeyDown, resetIndex }
}
