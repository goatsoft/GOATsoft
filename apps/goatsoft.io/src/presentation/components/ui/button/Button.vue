<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils.ts'
import { buttonVariants, type ButtonVariants } from './index.ts'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  as?: string
  class?: HTMLAttributes['class']
}>(), { as: 'button' })
</script>

<template>
  <component :is="props.as" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </component>
</template>
