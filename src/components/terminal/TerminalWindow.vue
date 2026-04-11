<script setup lang="ts">
import { useTerminalStore } from '@/stores/terminal'
import TerminalOutput from './TerminalOutput.vue'
import TerminalInput from './TerminalInput.vue'
import CommandChips from './CommandChips.vue'

const terminal = useTerminalStore()
const mobileCommands = ['help', 'ls', 'whoami', 'clear']

function handleChipExecute(cmd: string) {
  terminal.executeCommand(cmd)
}

function handleWindowClick(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.terminal-input')) {
    const input = document.querySelector<HTMLInputElement>('.terminal-input')
    input?.focus()
  }
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
      <div class="title-bar-spacer"></div>
    </div>
    <TerminalOutput :lines="terminal.outputLines" />
    <CommandChips :commands="mobileCommands" @execute="handleChipExecute" />
    <TerminalInput />
  </div>
</template>

<style scoped>
.terminal-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--terminal-bg);
  overflow: hidden;
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

.dot-red {
  background: #ff5f56;
}
.dot-yellow {
  background: #ffbd2e;
}
.dot-green {
  background: #27c93f;
}

.title-bar-text {
  color: var(--terminal-muted);
  font-family: var(--terminal-font);
  font-size: 13px;
  flex: 1;
  text-align: center;
}

.title-bar-spacer {
  width: 54px;
}
</style>
