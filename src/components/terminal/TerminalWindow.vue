<script setup lang="ts">
import { ref } from 'vue'
import { useTerminalStore } from '@/stores/terminal'
import TerminalOutput from './TerminalOutput.vue'
import TerminalInput from './TerminalInput.vue'
import CommandChips from './CommandChips.vue'
import SettingsPanel from './SettingsPanel.vue'

const terminal = useTerminalStore()
const mobileCommands = ['help', 'ls', 'whoami', 'clear']
const showSettings = ref(false)
const terminalInput = ref<InstanceType<typeof TerminalInput> | null>(null)

function handleChipFill(cmd: string) {
  terminalInput.value?.setInput(cmd)
}

function handleWindowClick(event: Event) {
  const target = event.target as HTMLElement

  // Close settings when clicking outside
  if (showSettings.value && !target.closest('.settings-panel') && !target.closest('.settings-btn')) {
    showSettings.value = false
  }

  // Focus input when clicking on terminal area
  if (!target.closest('.terminal-input') && !target.closest('.settings-panel') && !target.closest('.settings-btn')) {
    const input = document.querySelector<HTMLInputElement>('.terminal-input')
    input?.focus()
  }
}

function toggleSettings() {
  showSettings.value = !showSettings.value
}
</script>

<template>
  <div class="terminal-window" @click="handleWindowClick">
    <div class="title-bar">
      <div class="title-bar-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span class="title-bar-text">visitor@ajay: ~</span>
      <button
        class="settings-btn"
        :class="{ active: showSettings }"
        aria-label="Toggle settings"
        @click.stop="toggleSettings"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 1L6.2 2.6C5.8 2.8 5.4 3 5.1 3.3L3.5 2.7L2 5.3L3.3 6.4C3.3 6.6 3.2 6.8 3.2 7C3.2 7.2 3.2 7.4 3.3 7.6L2 8.7L3.5 11.3L5.1 10.7C5.4 11 5.8 11.2 6.2 11.4L6.5 13H9.5L9.8 11.4C10.2 11.2 10.6 11 10.9 10.7L12.5 11.3L14 8.7L12.7 7.6C12.7 7.4 12.8 7.2 12.8 7C12.8 6.8 12.8 6.6 12.7 6.4L14 5.3L12.5 2.7L10.9 3.3C10.6 3 10.2 2.8 9.8 2.6L9.5 1H6.5ZM8 5C9.1 5 10 5.9 10 7C10 8.1 9.1 9 8 9C6.9 9 6 8.1 6 7C6 5.9 6.9 5 8 5Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <SettingsPanel v-if="showSettings" />
    </div>
    <TerminalOutput :lines="terminal.outputLines" />
    <CommandChips :commands="mobileCommands" @fill="handleChipFill" />
    <TerminalInput ref="terminalInput" />
  </div>
</template>

<style scoped>
.terminal-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  max-width: 100vw;
  background: var(--terminal-bg);
  overflow: hidden;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .title-bar-dots {
    display: none;
  }

  .title-bar {
    height: 32px;
    padding: 0 8px;
  }

  .title-bar-text {
    font-size: 11px;
    text-align: left;
  }
}

.title-bar {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  user-select: none;
  -webkit-app-region: drag;
  position: relative;
}

.title-bar-dots {
  display: flex;
  gap: 6px;
  margin-right: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.title-bar-text {
  color: var(--terminal-muted);
  font-family: var(--terminal-font);
  font-size: 13px;
  flex: 1;
  text-align: center;
}

.settings-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--terminal-muted);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, transform 0.3s;
  flex-shrink: 0;
}

.settings-btn:hover {
  color: var(--terminal-fg);
  border-color: #444;
}

.settings-btn.active {
  color: var(--terminal-prompt);
  border-color: var(--terminal-prompt);
  transform: rotate(45deg);
}
</style>
