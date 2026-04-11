<script setup lang="ts">
defineProps<{
  commands: string[]
}>()

const emit = defineEmits<{
  execute: [command: string]
}>()
</script>

<template>
  <div class="command-chips">
    <button
      v-for="cmd in commands"
      :key="cmd"
      class="chip"
      :aria-label="`Execute ${cmd}`"
      @click="emit('execute', cmd)"
    >
      {{ cmd }}
    </button>
  </div>
</template>

<style scoped>
.command-chips {
  display: none;
  gap: 6px;
  padding: 8px var(--terminal-padding);
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .command-chips {
    display: flex;
  }
}

.chip {
  background: var(--terminal-muted);
  color: var(--terminal-fg);
  border: 1px solid var(--terminal-fg);
  border-radius: 4px;
  padding: 4px 12px;
  font-family: var(--terminal-font);
  font-size: 12px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.15s;
}

.chip:hover,
.chip:focus {
  opacity: 1;
}
</style>
