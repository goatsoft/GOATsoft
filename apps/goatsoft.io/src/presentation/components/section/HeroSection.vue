<script setup lang="ts">
import { motion } from 'motion-v'
const { organisation, appearance } = useBrand()
const { touch, ease, reduced } = useMotionPresets()

// The lower mist sits lower and fainter on light so the top of the hero stays clean.
const isLight = computed(() => appearance.value === 'light')
const mistIntensity = computed(() => (isLight.value ? 0.2 : touch ? 0.5 : 0.36))

// The video plays first; once it is actually playing we hold for a beat (PRE_ROLL) so the
// footage establishes, then the copy sequences in slowly. @see ADR 0010
const PRE_ROLL = 1100
const started = ref(false)
let timer = 0
function onHeroReady() {
  if (started.value) return
  timer = window.setTimeout(() => (started.value = true), reduced.value ? 0 : PRE_ROLL)
}
onUnmounted(() => window.clearTimeout(timer))

// Parallax: the copy rises and fades a little faster than the footage behind it.
const scrollY = touch ? useMotionValue(0) : useScroll().scrollY
const copyY = useTransform(scrollY, [0, 700], [0, -80])
const copyOpacity = useTransform(scrollY, [0, 520], [1, 0])
const videoY = useTransform(scrollY, [0, 900], [0, 140])

const words = organisation.headline.split(' ')

// Hidden until the video has played its pre-roll, then each element eases in on its delay.
const hidden = { opacity: 0, y: 28, filter: 'blur(8px)' }
function step(delay: number, duration = 1) {
  return {
    initial: reduced.value ? false : hidden,
    animate: started.value
      ? { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration, delay, ease } }
      : hidden,
  }
}
</script>

<template>
  <section class="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-32 sm:justify-center sm:pb-24">
    <motion.div class="absolute inset-0 -z-20" :style="touch ? undefined : { y: videoY }">
      <HeroVideo @ready="onHeroReady" />
    </motion.div>

    <!-- Mist drifting across the lower half. On light it sits lower and fainter so the top stays clean. -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
      :class="isLight ? 'h-[30vh] [mask-image:linear-gradient(to_bottom,transparent,#000_78%)]' : 'h-[46vh] [mask-image:linear-gradient(to_bottom,transparent,#000_60%)]'"
      aria-hidden="true"
    >
      <AuroraCanvas hue="aurora" fade :intensity="mistIntensity" :scale="1.1" :speed="0.09" :seed="3" :stretch="0.45" />
    </div>

    <motion.div class="mx-auto w-full max-w-6xl px-6" :style="touch ? undefined : { y: copyY, opacity: copyOpacity }">
      <motion.p class="text-eyebrow" v-bind="step(0, 0.7)">
        {{ organisation.tagline }}
      </motion.p>

      <h1 class="text-display mt-6 max-w-4xl text-5xl sm:text-7xl md:text-8xl [text-shadow:0_2px_30px_var(--shadow-ink)]">
        <motion.span
          v-for="(word, i) in words" :key="word"
          class="mr-[0.22em] inline-block"
          :class="i === words.length - 1 ? 'text-aurora mr-0' : ''"
          :initial="reduced ? false : { opacity: 0, y: 44, rotateX: -35, filter: 'blur(12px)' }"
          :animate="started ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 1.05, delay: 0.35 + i * 0.16, ease } } : { opacity: 0, y: 44, rotateX: -35, filter: 'blur(12px)' }"
        >{{ word }}</motion.span>
      </h1>

      <motion.p class="mt-7 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl" v-bind="step(1.35, 0.9)">
        {{ organisation.mission }}
      </motion.p>

      <motion.div class="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center" v-bind="step(1.75, 0.8)">
        <Button variant="default" size="xl" as="a" href="#projects">
          <Icon name="hugeicons:mountain" /> See our work
        </Button>
        <Button variant="glass" size="xl" as="a" :href="organisation.githubUrl" target="_blank" rel="noopener" class="border-0">
          <Icon name="simple-icons:github" class="size-5" /> GitHub
        </Button>
      </motion.div>
    </motion.div>

    <motion.a
      href="#projects" aria-label="Scroll to projects"
      class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground sm:flex"
      :initial="reduced ? false : { opacity: 0 }" :animate="started ? { opacity: 1, transition: { delay: 2.2, duration: 0.9 } } : { opacity: 0 }"
    >
      <span class="text-eyebrow">Scroll</span>
      <span class="relative block h-10 w-6 rounded-full ring-hair">
        <span class="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 animate-scroll-cue rounded-full bg-current" />
      </span>
    </motion.a>
  </section>
</template>
