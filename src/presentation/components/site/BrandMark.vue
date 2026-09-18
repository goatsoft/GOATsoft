<script setup lang="ts">
/** Logo plus wordmark, swapping assets with the appearance. */
const { assets, organisation } = useBrand()
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
const sizes = { sm: 'size-7', md: 'size-9', lg: 'size-12' } as const
</script>

<template>
  <a href="#top" class="flex items-center gap-2.5 font-semibold tracking-tight" :aria-label="`${organisation.name} home`">
    <img :src="assets.logo" alt="" :class="sizes[size]" class="drop-shadow-[0_4px_14px_color-mix(in_oklab,var(--goat-glow)_55%,transparent)]" />
    <span class="text-brand font-bold tracking-tight" :class="size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'">{{ organisation.name }}</span>
  </a>
</template>
