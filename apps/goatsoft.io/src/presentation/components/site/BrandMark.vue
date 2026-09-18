<script setup lang="ts">
/**
 * Masthead: the combined horns-and-wordmark logo, inlined so its currentColor
 * stroke and fill take the theme text colour. @see GOATsoft-logo.svg
 */
import logoMarkup from '@/presentation/assets/svg/GOATsoft-logo.svg?raw'
const { organisation } = useBrand()
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
const heights = { sm: '[&_svg]:h-3.5', md: '[&_svg]:h-[1.125rem]', lg: '[&_svg]:h-7' } as const
</script>

<template>
  <a
    href="#top" :aria-label="`${organisation.name} home`"
    class="inline-flex items-center text-foreground [&_svg]:block [&_svg]:w-auto drop-shadow-[0_4px_14px_color-mix(in_oklab,var(--goat-glow)_30%,transparent)]"
    :class="heights[size]"
    v-html="logoMarkup"
  />
</template>
