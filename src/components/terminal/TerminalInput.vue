<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKeyboard } from '@/composables/useKeyboard'
import { useTerminalStore } from '@/stores/terminal'

const terminal = useTerminalStore()
const currentInput = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const { onKeyDown, resetIndex } = useKeyboard(() => terminal.commandHistory)

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    const input = currentInput.value
    terminal.executeCommand(input)
    currentInput.value = ''
    resetIndex()
    return
  }
  onKeyDown(event, currentInput.value, (val) => {
    currentInput.value = val
  })
}

function focusInput() {
  inputEl.value?.focus()
}

onMounted(() => {
  focusInput()
})

defineExpose({ focusInput })
</script>

<template>
  <div class="terminal-input-line" @click="focusInput">
    <span class="prompt">{{ terminal.prompt }}&nbsp;</span>
    <input
      ref="inputEl"
      v-model="currentInput"
      class="terminal-input"
      type="text"
      inputmode="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      aria-label="Terminal command input"
      @keydown="handleKeyDown"
    />
  </div>
</template>

<style scoped>
.terminal-input-line {
  display: flex;
  align-items: center;
  padding: 4px 16px 16px;
  cursor: text;
  flex-shrink: 0;
}

.prompt {
  color: var(--terminal-prompt);
  font-family: var(--terminal-font);
  font-size: 14px;
  white-space: nowrap;
  user-select: none;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--terminal-fg);
  font-family: var(--terminal-font);
  font-size: 14px;
  caret-color: var(--terminal-fg);
  padding: 0;
  margin: 0;
}
</style>
