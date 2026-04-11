<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { OutputLine } from '@/types'

const props = defineProps<{
  lines: OutputLine[]
}>()

const outputEl = ref<HTMLElement | null>(null)

watch(
  () => props.lines.length,
  async () => {
    await nextTick()
    if (outputEl.value) {
      outputEl.value.scrollTop = outputEl.value.scrollHeight
    }
  },
)
</script>

<template>
  <div
    ref="outputEl"
    class="terminal-output"
    role="log"
    aria-live="polite"
    aria-label="Terminal output"
  >
    <div
      v-for="(line, index) in lines"
      :key="index"
      class="output-line"
      :class="`line-${line.type}`"
      :aria-label="line.ariaLabel"
    >
      <pre v-if="line.type === 'heading' || line.text.includes('\n')">{{ line.text }}</pre>
      <span v-else>{{ line.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  font-family: var(--terminal-font);
  font-size: 14px;
  line-height: 1.5;
}

.output-line {
  min-height: 1.5em;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-line pre {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  white-space: pre;
}

.line-default {
  color: var(--terminal-fg);
}
.line-error {
  color: var(--terminal-error);
}
.line-success {
  color: var(--terminal-success);
}
.line-info {
  color: var(--terminal-info);
}
.line-heading {
  color: var(--terminal-heading);
  font-weight: bold;
}
.line-table {
  color: var(--terminal-fg);
  font-family: var(--terminal-font);
}
</style>
