<script setup lang="ts">
import { motion } from 'motion-v'
defineProps<{ eyebrow: string; title: string; lead?: string }>()
const { reveal } = useMotionPresets()
</script>

<template>
  <div class="mx-auto max-w-3xl text-center">
    <motion.p class="text-eyebrow" v-bind="reveal()">{{ eyebrow }}</motion.p>
    <motion.h2 class="text-section-heading mt-4" v-bind="reveal(0.08)">{{ title }}</motion.h2>
    <motion.p v-if="lead" class="mt-5 text-pretty text-lg text-muted-foreground" v-bind="reveal(0.16)">{{ lead }}</motion.p>
  </div>
</template>
