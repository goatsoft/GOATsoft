<script setup lang="ts">
/**
 * Appearance control. Collapsed to the current mode; clicking opens the full
 * System / Light / Dark selector as a popover so it never shifts the layout.
 * `labels` renders the always-open segmented control for the mobile menu. @see ADR 0003
 */
import { AnimatePresence, motion } from 'motion-v'
import type { AppearancePreference } from '@/domain/brand/Appearance.ts'

withDefaults(defineProps<{ labels?: boolean }>(), { labels: false })
const { preference, appearance, setPreference } = useAppearance()
const { reduced } = useMotionPresets()

const options: readonly { value: AppearancePreference; label: string; hint: string }[] = [
  { value: 'system', label: 'System', hint: 'Follow the system appearance' },
  { value: 'light', label: 'Light', hint: 'Always light' },
  { value: 'dark', label: 'Dark', hint: 'Always dark' },
]
const current = computed(() => options.find(o => o.value === preference.value) ?? options[0]!)

const open = ref(false)
const root = ref<HTMLElement | null>(null)
function close() { open.value = false }
function choose(v: AppearancePreference) { setPreference(v); close() }
function onDocPointer(e: MouseEvent) { if (root.value && !root.value.contains(e.target as Node)) close() }
watch(open, (v) => {
  if (v) document.addEventListener('click', onDocPointer)
  else document.removeEventListener('click', onDocPointer)
})
onUnmounted(() => document.removeEventListener('click', onDocPointer))

function cycle(delta: number) {
  const i = options.findIndex(o => o.value === preference.value)
  setPreference(options[(i + delta + options.length) % options.length]!.value)
}
function onKeydown(e: KeyboardEvent) {
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
  if (!delta) return
  e.preventDefault()
  cycle(delta)
}
</script>

<template>
  <div
    ref="root"
    :class="labels ? 'glass inline-flex h-10 items-center gap-0.5 rounded-full p-1' : 'relative inline-flex'"
    :role="labels ? 'radiogroup' : undefined"
    :aria-label="labels ? `Appearance, currently ${appearance}` : undefined"
    @keydown="labels ? onKeydown($event) : undefined"
    @keydown.esc="close"
  >
    <!-- Mobile: always-open segmented control with labels. -->
    <template v-if="labels">
      <button
        v-for="o in options" :key="o.value" type="button" role="radio"
        :aria-checked="preference === o.value" :aria-label="o.label" :title="o.hint"
        :tabindex="preference === o.value ? 0 : -1"
        class="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"
        :class="preference === o.value ? 'text-foreground bg-primary/15 ring-hair' : 'text-muted-foreground hover:text-foreground'"
        @click="choose(o.value)"
      >
        <i-hugeicons-computer v-if="o.value === 'system'" aria-hidden="true" />
        <i-hugeicons-sun-03 v-else-if="o.value === 'light'" aria-hidden="true" />
        <i-hugeicons-moon-02 v-else aria-hidden="true" />
        <span class="relative">{{ o.label }}</span>
      </button>
    </template>

    <!-- Header: collapsed trigger + popover selector. -->
    <template v-else>
      <button
        type="button"
        class="glass inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-5"
        :aria-label="`Appearance: ${current.label}. Change appearance`" aria-haspopup="true" :aria-expanded="open"
        @click.stop="open = !open"
      >
        <i-hugeicons-computer v-if="current.value === 'system'" aria-hidden="true" />
        <i-hugeicons-sun-03 v-else-if="current.value === 'light'" aria-hidden="true" />
        <i-hugeicons-moon-02 v-else aria-hidden="true" />
      </button>

      <AnimatePresence>
        <motion.div
          v-if="open" role="radiogroup" aria-label="Appearance"
          class="glass absolute right-0 top-full z-20 mt-2 inline-flex h-10 items-center gap-0.5 rounded-full p-1 shadow-ink"
          :initial="reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -6 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -6 }"
          :transition="{ type: 'spring', stiffness: 460, damping: 32 }"
          style="transform-origin: top right"
          @keydown="onKeydown"
        >
          <button
            v-for="o in options" :key="o.value" type="button" role="radio"
            :aria-checked="preference === o.value" :aria-label="o.label" :title="o.hint"
            class="inline-flex size-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"
            :class="preference === o.value ? 'text-foreground bg-primary/15 ring-hair' : 'text-muted-foreground hover:text-foreground'"
            @click="choose(o.value)"
          >
            <i-hugeicons-computer v-if="o.value === 'system'" aria-hidden="true" />
            <i-hugeicons-sun-03 v-else-if="o.value === 'light'" aria-hidden="true" />
            <i-hugeicons-moon-02 v-else aria-hidden="true" />
          </button>
        </motion.div>
      </AnimatePresence>
    </template>
  </div>
</template>
