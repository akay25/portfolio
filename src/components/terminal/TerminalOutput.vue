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

// Regex to match URLs and email addresses
const linkPattern = /(https?:\/\/[^\s<>]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

interface TextSegment {
  text: string
  href?: string
}

function parseSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(linkPattern)) {
    const matchText = match[0] ?? ''
    const index = match.index ?? 0

    // Text before the match
    if (index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, index) })
    }

    // The link itself
    const isEmail = !matchText.startsWith('http')
    segments.push({
      text: matchText,
      href: isEmail ? `mailto:${matchText}` : matchText,
    })

    lastIndex = index + matchText.length
  }

  // Remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ text }]
}

function hasLinks(text: string): boolean {
  linkPattern.lastIndex = 0
  return linkPattern.test(text)
}
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
      <span v-else-if="hasLinks(line.text)">
        <template v-for="(seg, si) in parseSegments(line.text)" :key="si">
          <a
            v-if="seg.href"
            :href="seg.href"
            class="terminal-link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ seg.text }}</a>
          <span v-else>{{ seg.text }}</span>
        </template>
      </span>
      <span v-else>{{ line.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.terminal-output {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--terminal-padding);
  font-family: var(--terminal-font);
  font-size: var(--terminal-font-size);
  line-height: 1.5;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

.output-line {
  min-height: 1.5em;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
  max-width: 100%;
}

.output-line pre {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
  max-width: 100%;
}

.terminal-link {
  word-break: break-all;
}

.line-default { color: var(--terminal-fg); }
.line-error { color: var(--terminal-error); }
.line-success { color: var(--terminal-success); }
.line-info { color: var(--terminal-info); }
.line-heading { color: var(--terminal-heading); font-weight: bold; }
.line-table { color: var(--terminal-fg); font-family: var(--terminal-font); }

.terminal-link {
  color: var(--terminal-info);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.terminal-link:hover {
  color: var(--terminal-heading);
}
</style>
