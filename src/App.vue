<script setup lang="ts">
import { onMounted } from 'vue'
import TerminalWindow from '@/components/terminal/TerminalWindow.vue'
import { useTerminalStore } from '@/stores/terminal'
import { getTheme, applyTheme, applyFont, applyFontSize } from '@/themes'
import '@/assets/terminal.css'

const terminal = useTerminalStore()

onMounted(() => {
  const theme = getTheme(terminal.themeName)
  if (theme) applyTheme(theme)
  applyFont(terminal.fontFamily)
  applyFontSize(terminal.fontSize)
})
</script>

<template>
  <TerminalWindow />
</template>

<style>
/* Global reset handled by terminal.css */
</style>
