<script setup lang="ts">
import { motion } from 'motion-v'
const { organisation } = useBrand()
const { enter, touch, ease } = useMotionPresets()

// Parallax: the copy rises and fades a little faster than the footage behind it.
const scrollY = touch ? useMotionValue(0) : useScroll().scrollY
const copyY = useTransform(scrollY, [0, 700], [0, -80])
const copyOpacity = useTransform(scrollY, [0, 520], [1, 0])
const videoY = useTransform(scrollY, [0, 900], [0, 140])

const words = organisation.headline.split(' ')
</script>

<template>
  <section class="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-32 sm:justify-center sm:pb-24">
    <motion.div class="absolute inset-0 -z-20" :style="touch ? undefined : { y: videoY }">
      <HeroVideo />
    </motion.div>

    <!-- Aurora ribbons across the lower half so the footage blends into the page's glow. -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60vh] [mask-image:linear-gradient(to_bottom,transparent,#000_40%)]" aria-hidden="true">
      <AuroraCanvas hue="aurora" fade :intensity="touch ? 0.5 : 0.36" :scale="1.1" :speed="0.09" :seed="3" :stretch="0.45" />
    </div>

    <motion.div class="mx-auto w-full max-w-6xl px-6" :style="touch ? undefined : { y: copyY, opacity: copyOpacity }">
      <motion.p class="text-eyebrow" v-bind="enter(0.1, 12)">
        {{ organisation.name }} &middot; {{ organisation.tagline }}
      </motion.p>

      <h1 class="text-display mt-6 max-w-4xl text-5xl sm:text-7xl md:text-8xl [text-shadow:0_2px_30px_var(--shadow-ink)]">
        <motion.span
          v-for="(word, i) in words" :key="word"
          class="mr-[0.22em] inline-block"
          :class="i === words.length - 1 ? 'text-aurora mr-0' : ''"
          :initial="{ opacity: 0, y: 40, rotateX: -30, filter: 'blur(10px)' }"
          :animate="{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }"
          :transition="{ duration: 0.9, delay: 0.25 + i * 0.09, ease }"
        >{{ word }}</motion.span>
      </h1>

      <motion.p class="mt-7 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl" v-bind="enter(0.7, 16)">
        {{ organisation.mission }}
      </motion.p>

      <motion.div class="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center" v-bind="enter(0.85, 16)">
        <Button variant="aurora" size="xl" as="a" href="#projects">
          <i-hugeicons-mountain /> See our work
        </Button>
        <Button variant="glass" size="xl" as="a" :href="organisation.githubUrl" target="_blank" rel="noopener" class="border-0">
          <i-simple-icons-github class="size-5" /> GitHub
        </Button>
      </motion.div>
    </motion.div>

    <motion.a
      href="#projects" aria-label="Scroll to projects"
      class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground sm:flex"
      :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 1.6, duration: 0.8 }"
    >
      <span class="text-eyebrow">Scroll</span>
      <span class="relative block h-10 w-6 rounded-full ring-hair">
        <span class="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 animate-scroll-cue rounded-full bg-current" />
      </span>
    </motion.a>
  </section>
</template>
