<script setup lang="ts">
/**
 * A decorative Aurora background for one place on the page, in the current appearance.
 * Aurora draws it with WebGPU, shows its CSS fallback everywhere else, pauses it off-screen
 * and in hidden tabs, and honours reduced motion. Fills its positioned parent. @see ADR 0014
 */
import { AuroraBackground } from '@goatsoft/aurora-vue'
import { backgroundFor, type BackgroundName } from '@/infrastructure/graphics/backgrounds.ts'

const props = defineProps<{ name: BackgroundName }>()

const { appearance } = useAppearance()
const { touch } = useMotionPresets()
const src = computed(() => backgroundFor(props.name, appearance.value, touch))
</script>

<template>
  <AuroraBackground :src="src" class="pointer-events-none" />
</template>
