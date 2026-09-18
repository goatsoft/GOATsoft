<script setup lang="ts">
/**
 * Appearance control. Collapsed to a circle showing the current mode; on hover or
 * click the circle grows leftward into a pill and the other options spring out to be
 * picked. Absolutely positioned so it never shifts the layout. `labels` renders the
 * always-open segmented control for the mobile menu. @see ADR 0003
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
// The alternatives grow out to the left; the current mode stays as the anchor circle.
const others = computed(() => options.filter(o => o.value !== preference.value))

const open = ref(false)
const shownOthers = computed(() => (open.value ? others.value : []))
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
const grow = (i: number) => ({
  initial: reduced.value ? { opacity: 0 } : { width: 0, opacity: 0, scale: 0.5 },
  animate: reduced.value ? { opacity: 1 } : { width: 32, opacity: 1, scale: 1 },
  exit: reduced.value ? { opacity: 0 } : { width: 0, opacity: 0, scale: 0.5 },
  transition: { type: 'spring', stiffness: 520, damping: 34, delay: reduced.value ? 0 : i * 0.05 },
})
</script>

<template>
  <!-- Mobile: always-open segmented control with labels. -->
  <div
    v-if="labels" role="radiogroup" :aria-label="`Appearance, currently ${appearance}`"
    class="glass inline-flex h-10 items-center gap-0.5 rounded-full p-1" @keydown="onKeydown"
  >
    <button
      v-for="o in options" :key="o.value" type="button" role="radio"
      :aria-checked="preference === o.value" :aria-label="o.label" :title="o.hint"
      class="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"
      :class="preference === o.value ? 'text-foreground bg-primary/15 ring-hair' : 'text-muted-foreground hover:text-foreground'"
      @click="choose(o.value)"
    >
      <Icon name="hugeicons:computer" v-if="o.value === 'system'" aria-hidden="true" />
      <Icon name="hugeicons:sun-03" v-else-if="o.value === 'light'" aria-hidden="true" />
      <Icon name="hugeicons:moon-02" v-else aria-hidden="true" />
      <span class="relative">{{ o.label }}</span>
    </button>
  </div>

  <!-- Header: circle that grows out into the selector. -->
  <div
    v-else ref="root" class="relative inline-flex size-10"
  >
    <motion.div
      class="glass absolute right-0 top-0 z-20 flex h-10 items-center gap-0.5 rounded-full p-1"
      @mouseenter="open = true" @mouseleave="close" @keydown.esc="close" @keydown="onKeydown"
      :animate="{ boxShadow: open ? '0 12px 30px -12px var(--shadow-ink)' : '0 0px 0px 0px transparent' }"
    >
      <AnimatePresence>
        <motion.button
          v-for="(o, i) in shownOthers" :key="o.value" type="button"
          :aria-label="`Switch to ${o.label}`" :title="o.hint"
          class="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-5"
          v-bind="grow(i)"
          @click="choose(o.value)"
        >
          <Icon name="hugeicons:computer" v-if="o.value === 'system'" aria-hidden="true" />
          <Icon name="hugeicons:sun-03" v-else-if="o.value === 'light'" aria-hidden="true" />
          <Icon name="hugeicons:moon-02" v-else aria-hidden="true" />
        </motion.button>
      </AnimatePresence>

      <button
        type="button"
        class="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-5"
        :class="open ? 'bg-primary/15 ring-hair' : ''"
        :aria-label="`Appearance: ${current.label}. Change appearance`" aria-haspopup="true" :aria-expanded="open"
        @click.stop="open = !open"
      >
        <Icon name="hugeicons:computer" v-if="current.value === 'system'" aria-hidden="true" />
        <Icon name="hugeicons:sun-03" v-else-if="current.value === 'light'" aria-hidden="true" />
        <Icon name="hugeicons:moon-02" v-else aria-hidden="true" />
      </button>
    </motion.div>
  </div>
</template>
