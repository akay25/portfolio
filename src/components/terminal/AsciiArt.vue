<script setup lang="ts">
defineProps<{
  art: string
  altText?: string
}>()
</script>

<template>
  <pre class="ascii-art" role="img" :aria-label="altText ?? 'ASCII art'">{{ art }}</pre>
</template>

<style scoped>
.ascii-art {
  color: var(--terminal-success);
  font-family: var(--terminal-font);
  font-size: var(--terminal-font-size);
  line-height: 1.2;
  margin: 0;
  overflow-x: auto;
}
</style>
