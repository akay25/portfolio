<script setup lang="ts">
import { useTerminalStore } from '@/stores/terminal'
import { themes, fontFamilies, fontSizes, getTheme, applyTheme, applyFont, applyFontSize } from '@/themes'

const terminal = useTerminalStore()

function selectTheme(name: string) {
  const theme = getTheme(name)
  if (theme) {
    terminal.setTheme(name)
    applyTheme(theme)
  }
}

function selectFont(family: string) {
  terminal.setFontFamily(family)
  applyFont(family)
}

function selectFontSize(size: number) {
  terminal.setFontSize(size)
  applyFontSize(size)
}
</script>

<template>
  <div class="settings-panel" @click.stop>
    <!-- Theme -->
    <div class="settings-section">
      <div class="settings-label">Theme</div>
      <div class="theme-grid">
        <button
          v-for="theme in themes"
          :key="theme.name"
          class="theme-swatch"
          :class="{ active: terminal.themeName === theme.name }"
          :title="theme.label"
          :aria-label="`Select ${theme.label} theme`"
          @click="selectTheme(theme.name)"
        >
          <span class="swatch-preview" :style="{ background: theme.colors.bg, color: theme.colors.fg, borderColor: theme.colors.prompt }">
            <span class="swatch-cursor" :style="{ background: theme.colors.prompt }"></span>
          </span>
          <span class="swatch-name">{{ theme.label }}</span>
        </button>
      </div>
    </div>

    <!-- Font Family -->
    <div class="settings-section">
      <div class="settings-label">Font</div>
      <div class="font-list">
        <button
          v-for="font in fontFamilies"
          :key="font.name"
          class="font-option"
          :class="{ active: terminal.fontFamily === font.value }"
          :style="{ fontFamily: font.value }"
          @click="selectFont(font.value)"
        >
          {{ font.label }}
        </button>
      </div>
    </div>

    <!-- Font Size -->
    <div class="settings-section">
      <div class="settings-label">Size</div>
      <div class="size-row">
        <button
          v-for="size in fontSizes"
          :key="size"
          class="size-option"
          :class="{ active: terminal.fontSize === size }"
          @click="selectFontSize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  position: absolute;
  top: 40px;
  right: 8px;
  width: 260px;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-label {
  font-family: var(--terminal-font);
  font-size: 11px;
  color: var(--terminal-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* --- Theme swatches --- */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.theme-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: 2px solid transparent;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.theme-swatch:hover {
  border-color: #555;
}

.theme-swatch.active {
  border-color: var(--terminal-prompt);
}

.swatch-preview {
  width: 100%;
  height: 28px;
  border-radius: 4px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch-cursor {
  width: 8px;
  height: 14px;
  border-radius: 1px;
}

.swatch-name {
  font-family: var(--terminal-font);
  font-size: 9px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* --- Font options --- */
.font-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.font-option {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 4px 8px;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}

.font-option:hover {
  background: #2a2a2a;
}

.font-option.active {
  border-color: var(--terminal-prompt);
  color: var(--terminal-prompt);
}

/* --- Font size options --- */
.size-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.size-option {
  background: #2a2a2a;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 3px 8px;
  color: #ccc;
  font-family: var(--terminal-font);
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  min-width: 32px;
  text-align: center;
}

.size-option:hover {
  background: #333;
}

.size-option.active {
  border-color: var(--terminal-prompt);
  color: var(--terminal-prompt);
}
</style>
