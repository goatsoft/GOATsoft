<script setup lang="ts">
import { motion } from 'motion-v'
const { organisation } = useBrand()
const { reveal } = useMotionPresets()
</script>

<template>
  <section id="about" class="relative scroll-mt-24 py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[70vh] -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]" aria-hidden="true">
      <AuroraCanvas hue="indigo" fade :intensity="0.22" :scale="0.9" :speed="0.05" :seed="11" :stretch="0.5" />
    </div>

    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow="About" title="Software that moves with you, wherever you climb." :lead="organisation.mission" />

      <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          v-for="(pillar, i) in organisation.pillars" :key="pillar.title"
          class="glass relative overflow-hidden rounded-2xl p-6 shadow-ink"
          v-bind="reveal(0.08 * i)"
        >
          <span class="inline-flex size-11 items-center justify-center rounded-xl bg-foreground/10 text-foreground ring-hair [&_svg]:size-5">
            <i-hugeicons-shield-01 v-if="pillar.icon === 'shield'" aria-hidden="true" />
            <i-hugeicons-cpu v-else-if="pillar.icon === 'cpu'" aria-hidden="true" />
            <i-hugeicons-source-code v-else-if="pillar.icon === 'code'" aria-hidden="true" />
            <i-hugeicons-mountain v-else aria-hidden="true" />
          </span>
          <h3 class="mt-5 text-lg font-semibold tracking-tight">{{ pillar.title }}</h3>
          <p class="mt-2 text-pretty text-sm text-muted-foreground">{{ pillar.summary }}</p>
        </motion.div>
      </div>
    </div>
  </section>
</template>
