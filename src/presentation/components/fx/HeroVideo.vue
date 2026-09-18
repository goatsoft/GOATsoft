<script setup lang="ts">
/**
 * Full-bleed hero video, bundled per appearance (webm first, mp4 fallback). Autoplay
 * is muted and inline; the poster covers the first frame and any browser that refuses
 * autoplay. Reduced motion shows the poster only. Emits `ready` once the footage is
 * actually playing (or immediately under reduced motion, with a timeout safety net) so
 * the hero copy can sequence in after it. @see ADR 0004, ADR 0010
 */
import { heroVideoFor } from '@/presentation/assets/media.ts'

const emit = defineEmits<{ ready: [] }>()
const { appearance } = useBrand()
const { reduced } = useMotionPresets()
const sources = computed(() => heroVideoFor(appearance.value))
const isLight = computed(() => appearance.value === 'light')
// Light footage is bright, so the copy needs a stronger, wider ground on light to stay legible.
const copyScrim = computed(() => isLight.value
  ? 'linear-gradient(to right, color-mix(in oklab, var(--goat-bg) 97%, transparent), color-mix(in oklab, var(--goat-bg) 78%, transparent) 44%, color-mix(in oklab, var(--goat-bg) 34%, transparent) 66%, transparent 86%)'
  : 'linear-gradient(to right, color-mix(in oklab, var(--goat-bg) 88%, transparent), color-mix(in oklab, var(--goat-bg) 45%, transparent) 42%, transparent 72%)')
const video = ref<HTMLVideoElement | null>(null)
const ready = ref(false)

// A new key remounts the element so the browser reloads the sources for the new appearance.
const key = computed(() => `hero-${appearance.value}`)

let fired = false
function fireReady() {
  if (fired) return
  fired = true
  emit('ready')
}
function onCanPlay() {
  ready.value = true
  video.value?.play().catch(() => fireReady()) // Autoplay refused: reveal the copy over the poster.
}
watch(appearance, () => (ready.value = false))
onMounted(() => {
  if (reduced.value) fireReady()
  // Safety net: never leave the copy hidden if the video stalls or is blocked.
  window.setTimeout(fireReady, 2500)
})
</script>

<template>
  <div class="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
    <img
      :src="sources.poster" alt="" fetchpriority="high" decoding="async" :style="{ filter: 'var(--hero-video-filter)' }"
      class="absolute inset-0 size-full object-cover transition-opacity duration-1000"
      :class="ready ? 'opacity-0' : 'opacity-100'"
    />
    <video
      v-if="!reduced"
      :key="key" ref="video"
      class="absolute inset-0 size-full object-cover transition-opacity duration-1000"
      :class="ready ? 'opacity-100' : 'opacity-0'"
      :poster="sources.poster" :style="{ filter: 'var(--hero-video-filter)' }"
      autoplay muted playsinline disablepictureinpicture preload="metadata"
      @canplay="onCanPlay" @playing="fireReady"
    >
      <source :src="sources.webm" type="video/webm" />
      <source :src="sources.mp4" type="video/mp4" />
    </video>
    <!-- Copy-side scrim: the theme ground, strong on the left so the copy reads, clearing to the footage on the right. Stronger and wider on light because the footage is brighter. -->
    <div class="absolute inset-0" :style="{ backgroundImage: copyScrim }" />
    <!-- Gentle overall veil to unify the tone. -->
    <div class="absolute inset-0 bg-[var(--hero-veil)]" />
    <!-- Bottom fade into the page (also backs the mobile copy). -->
    <div class="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_bottom,transparent,var(--goat-bg))]" />
  </div>
</template>
