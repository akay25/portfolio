<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKeyboard } from '@/composables/useKeyboard'
import { tabComplete, getSuggestion } from '@/composables/useTabComplete'
import { useTerminalStore } from '@/stores/terminal'

const terminal = useTerminalStore()
const currentInput = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const tabCandidates = ref<string[]>([])

const { onKeyDown, resetIndex } = useKeyboard(() => terminal.commandHistory)

// oh-my-zsh style ghost suggestion (from history or command names)
const ghost = computed(() => {
  const suggestion = getSuggestion(currentInput.value, terminal.commandHistory)
  if (!suggestion) return ''
  // Show only the part after what the user has already typed
  return suggestion.slice(currentInput.value.length)
})

function handleKeyDown(event: KeyboardEvent) {
  // Enter: submit command
  if (event.key === 'Enter') {
    event.preventDefault()
    tabCandidates.value = []
    terminal.executeCommand(currentInput.value)
    currentInput.value = ''
    resetIndex()
    return
  }

  // Tab: complete
  if (event.key === 'Tab') {
    event.preventDefault()
    const result = tabComplete(currentInput.value, terminal.currentPath)
    currentInput.value = result.value

    if (result.candidates.length > 1) {
      // Show candidates in terminal output (like real bash)
      tabCandidates.value = result.candidates
      terminal.pushOutput([
        { text: `${terminal.prompt} ${currentInput.value}`, type: 'default' },
        { text: result.candidates.join('  '), type: 'info' },
      ])
    } else {
      tabCandidates.value = []
    }
    return
  }

  // Right arrow: accept ghost suggestion
  if (event.key === 'ArrowRight' && ghost.value && inputEl.value) {
    const cursorAtEnd = inputEl.value.selectionStart === currentInput.value.length
    if (cursorAtEnd) {
      event.preventDefault()
      currentInput.value = currentInput.value + ghost.value
      tabCandidates.value = []
      return
    }
  }

  // Any other key clears tab candidates
  tabCandidates.value = []

  // History navigation (up/down)
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

function setInput(val: string) {
  currentInput.value = val
  focusInput()
}

defineExpose({ focusInput, setInput })
</script>

<template>
  <div class="terminal-input-line" @click="focusInput">
    <span class="prompt">{{ terminal.prompt }}&nbsp;</span>
    <div class="input-wrapper">
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
      <!-- Ghost suggestion overlay (oh-my-zsh style) -->
      <span v-if="ghost" class="ghost-suggestion" aria-hidden="true">
        <span class="ghost-hidden">{{ currentInput }}</span>
        <span class="ghost-text">{{ ghost }}</span>
      </span>
    </div>
    <span v-if="ghost" class="hint-badge" aria-hidden="true">→</span>
  </div>
</template>

<style scoped>
.terminal-input-line {
  display: flex;
  align-items: center;
  padding: 4px var(--terminal-padding) var(--terminal-padding);
  cursor: text;
  flex-shrink: 0;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.prompt {
  color: var(--terminal-prompt);
  font-family: var(--terminal-font);
  font-size: var(--terminal-prompt-size, var(--terminal-font-size));
  line-height: 1.5;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .prompt {
    max-width: 35%;
  }
}

.input-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
}

.terminal-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--terminal-fg);
  font-family: var(--terminal-font);
  font-size: var(--terminal-font-size);
  line-height: 1.5;
  letter-spacing: 0;
  caret-color: var(--terminal-fg);
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
}

/*
 * Ghost suggestion sits behind the real input.
 * Every font property must exactly mirror .terminal-input
 * so the invisible prefix and the ghost tail align pixel-perfectly.
 */
.ghost-suggestion {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  font-family: var(--terminal-font);
  font-size: var(--terminal-font-size);
  line-height: 1.5;
  letter-spacing: 0;
  white-space: pre;
  z-index: 0;
}

/* Invisible text matching user input to push the ghost to the right offset */
.ghost-hidden {
  visibility: hidden;
  display: inline;
}

.ghost-text {
  color: var(--terminal-muted);
  opacity: 0.6;
}

.hint-badge {
  color: var(--terminal-muted);
  font-family: var(--terminal-font);
  font-size: calc(var(--terminal-font-size) - 2px);
  margin-left: 8px;
  opacity: 0.5;
  flex-shrink: 0;
}
</style>
