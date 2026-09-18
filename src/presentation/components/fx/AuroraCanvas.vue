<script setup lang="ts">
/**
 * GPU aurora decoration. WebGPU when available, WebGL2 otherwise, CSS gradients as
 * the last resort. Pauses off-screen and in hidden tabs, never intercepts input,
 * and draws one still frame under reduced motion. @see ADR 0005
 */
import { PALETTES, type AuroraPalette } from '@/infrastructure/graphics/aurora-shaders.ts'
import { createAuroraRenderer, type AuroraMode } from '@/infrastructure/graphics/aurora-renderer.ts'

const props = withDefaults(defineProps<{
  hue?: keyof typeof PALETTES.dark
  intensity?: number
  scale?: number
  speed?: number
  fade?: boolean
  fixed?: boolean
  parallax?: number
  seed?: number
  stretch?: number
  sweep?: number
  colors?: AuroraPalette
}>(), { hue: 'aurora', intensity: 1, scale: 1.6, speed: 0.06, fade: false, fixed: false, parallax: 0.25, seed: 0, stretch: 0.55, sweep: 0 })

const { appearance } = useAppearance()
const canvas = ref<HTMLCanvasElement | null>(null)
const mode = ref<AuroraMode>('css')
const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const palette = computed<AuroraPalette>(() => props.colors ?? PALETTES[appearance.value][props.hue])
/** Light palettes are deeper, so they need a little less alpha to read as a tint. No blend
 *  modes: Chrome composites blended GPU canvases unreliably (@see ADR 0005). */
const lightIntensity = computed(() => (appearance.value === 'light' ? props.intensity * 0.55 : props.intensity))

const cssFallback = computed(() => {
  const [a, b, c] = palette.value.map(v => `rgb(${v.map(x => Math.round(x * 255)).join(' ')} / ${0.28 * lightIntensity.value})`)
  return `radial-gradient(60% 40% at 20% 30%, ${a}, transparent 70%), radial-gradient(50% 45% at 75% 60%, ${b}, transparent 70%), radial-gradient(70% 35% at 50% 90%, ${c}, transparent 70%)`
})

const renderer = createAuroraRenderer(() => ({
  colors: palette.value,
  fixed: props.fixed,
  parallax: props.parallax,
  intensity: lightIntensity.value,
  scale: props.scale,
  speed: props.speed,
  fade: props.fade,
  seed: props.seed,
  stretch: props.stretch,
  sweep: props.sweep,
}), reduced)

watch([palette, () => ({ ...props })], () => renderer.refresh(), { deep: true })

let observer: IntersectionObserver | null = null
let disposed = false
onMounted(async () => {
  const el = canvas.value
  if (!el) return
  observer = new IntersectionObserver(([entry]) => renderer.setVisible(!!entry?.isIntersecting), { rootMargin: '20% 0px' })
  observer.observe(el)
  const result = await renderer.start(el)
  if (!disposed) mode.value = result
})
onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  renderer.dispose()
})
</script>

<template>
  <div
    class="pointer-events-none overflow-hidden transition-opacity duration-700"
    :class="fixed ? 'fixed inset-0' : 'absolute inset-0'"
    aria-hidden="true"
    :data-aurora="mode"
  >
    <div v-if="mode === 'css'" class="absolute inset-0" :style="{ backgroundImage: cssFallback }" />
    <canvas ref="canvas" class="block size-full" :class="mode === 'css' ? 'invisible' : ''" />
  </div>
</template>
