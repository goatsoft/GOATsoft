<script setup lang="ts">
/**
 * Full-bleed hero video, bundled per appearance (webm first, mp4 fallback). Autoplay
 * is muted and inline; the poster covers the first frame and any browser that refuses
 * autoplay. Reduced motion shows the poster only. Emits `ready` once playback has
 * started (or immediately under reduced motion, with a timeout safety net) so the
 * hero copy can animate in after the footage. @see ADR 0004, ADR 0010
 */
import { heroVideoFor } from '@/presentation/assets/media.ts'

const emit = defineEmits<{ ready: [] }>()
const { appearance } = useBrand()
const { reduced } = useMotionPresets()
const sources = computed(() => heroVideoFor(appearance.value))
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
  video.value?.play().catch(() => { /* Autoplay refused: the poster stays. */ })
  fireReady()
}
watch(appearance, () => (ready.value = false))
onMounted(() => {
  if (reduced.value) fireReady()
  // Safety net: never leave the copy hidden if the video stalls or is blocked.
  window.setTimeout(fireReady, 1600)
})
</script>

<template>
  <div class="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
    <img
      :src="sources.poster" alt="" fetchpriority="high" decoding="async"
      class="absolute inset-0 size-full object-cover transition-opacity duration-1000"
      :class="ready ? 'opacity-0' : 'opacity-100'"
    />
    <video
      v-if="!reduced"
      :key="key" ref="video"
      class="absolute inset-0 size-full object-cover transition-opacity duration-1000"
      :class="ready ? 'opacity-100' : 'opacity-0'"
      :poster="sources.poster"
      autoplay muted loop playsinline disablepictureinpicture preload="metadata"
      @canplay="onCanPlay"
    >
      <source :src="sources.webm" type="video/webm" />
      <source :src="sources.mp4" type="video/mp4" />
    </video>
    <!-- Veil: lifts the copy off the footage and blends the bottom edge into the page. -->
    <div class="absolute inset-0 bg-[var(--hero-veil)]" />
    <div class="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_bottom,transparent,var(--goat-bg))]" />
  </div>
</template>
