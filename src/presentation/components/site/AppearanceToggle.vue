<script setup lang="ts">
/**
 * Segmented appearance switcher: System / Light / Dark. System is the default and
 * follows the OS; the other two pin an appearance and survive reloads. @see ADR 0003
 */
import { motion } from 'motion-v'
import type { AppearancePreference } from '@/domain/brand/Appearance.ts'

withDefaults(defineProps<{ labels?: boolean }>(), { labels: false })
const { preference, appearance, setPreference } = useAppearance()
const { reduced } = useMotionPresets()

const options: readonly { value: AppearancePreference; label: string; hint: string }[] = [
  { value: 'system', label: 'System', hint: 'Follow the system appearance' },
  { value: 'light', label: 'Light', hint: 'Always light' },
  { value: 'dark', label: 'Dark', hint: 'Always dark' },
]

function onKeydown(e: KeyboardEvent) {
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
  if (!delta) return
  e.preventDefault()
  const i = options.findIndex(o => o.value === preference.value)
  setPreference(options[(i + delta + options.length) % options.length]!.value)
}
</script>

<template>
  <div
    role="radiogroup" :aria-label="`Appearance, currently ${appearance}`"
    class="glass inline-flex h-10 items-center gap-0.5 rounded-full p-1"
    @keydown="onKeydown"
  >
    <button
      v-for="o in options" :key="o.value" type="button" role="radio"
      :aria-checked="preference === o.value" :aria-label="o.label" :title="o.hint"
      :tabindex="preference === o.value ? 0 : -1"
      class="relative inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:relative [&_svg]:size-4"
      :class="preference === o.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
      @click="setPreference(o.value)"
    >
      <!-- One indicator slides between options; layoutId keeps it a single element. -->
      <motion.span
        v-if="preference === o.value" layout-id="appearance-indicator" aria-hidden="true"
        class="absolute inset-0 rounded-full bg-primary/15 ring-hair"
        :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }"
      />
      <i-hugeicons-computer v-if="o.value === 'system'" aria-hidden="true" />
      <i-hugeicons-sun-03 v-else-if="o.value === 'light'" aria-hidden="true" />
      <i-hugeicons-moon-02 v-else aria-hidden="true" />
      <span :class="labels ? 'relative' : 'sr-only'">{{ o.label }}</span>
    </button>
  </div>
</template>
