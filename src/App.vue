<script setup lang="ts">
import { onMounted } from 'vue'
import TerminalWindow from '@/components/terminal/TerminalWindow.vue'
import { useTerminalStore } from '@/stores/terminal'
import { getTheme, applyTheme } from '@/themes'
import '@/assets/terminal.css'

const terminal = useTerminalStore()

onMounted(() => {
  const theme = getTheme(terminal.themeName)
  if (theme) applyTheme(theme)
})
</script>

<template>
  <TerminalWindow />
</template>

<style>
/* Global reset handled by terminal.css */
</style>
