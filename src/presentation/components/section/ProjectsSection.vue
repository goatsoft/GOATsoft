<script setup lang="ts">
import { motion } from 'motion-v'
const { featured, others, status, source, projects } = useProjects()
const { organisation } = useBrand()
const { reveal } = useMotionPresets()
</script>

<template>
  <section id="projects" class="relative scroll-mt-24 py-24 sm:py-32">
    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow="Projects"
        title="Software we are proud to put our name on."
        lead="Everything GOATsoft ships is public on GitHub. Here is what we are building right now."
      />

      <div v-if="status === 'loading' && projects.length === 0" class="mt-14 grid gap-6 md:grid-cols-2" aria-busy="true" aria-label="Loading projects">
        <div v-for="i in 2" :key="i" class="h-64 rounded-2xl glass" :class="i === 1 ? 'md:col-span-2' : ''">
          <div class="size-full animate-shimmer rounded-2xl bg-[linear-gradient(110deg,transparent_30%,var(--glass-hover)_50%,transparent_70%)] bg-[length:200%_100%]" />
        </div>
      </div>

      <div v-else class="mt-14 grid gap-6 md:grid-cols-2">
        <ProjectCard v-for="(p, i) in featured" :key="p.slug" :project="p" :index="i" featured />
        <ProjectCard v-for="(p, i) in others" :key="p.slug" :project="p" :index="featured.length + i" />
      </div>

      <motion.p class="mt-8 text-center font-mono text-xs text-muted-foreground/70" v-bind="reveal(0.2)">
        <template v-if="source === 'github'">Live from GitHub.</template>
        <template v-else>Snapshot; GitHub was unreachable.</template>
        <a :href="organisation.githubUrl" target="_blank" rel="noopener" class="ml-1 text-primary hover:underline">Browse all repositories</a>
      </motion.p>
    </div>
  </section>
</template>
