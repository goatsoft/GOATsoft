<script setup lang="ts">
import { motion } from 'motion-v'
const { organisation } = useBrand()
const { reveal } = useMotionPresets()

const points = [
  {
    title: 'No accounts or tracking',
    body: 'No accounts, no cookies, no analytics and no ad networks. We do not profile you, and nothing you do on this page is logged by us.',
    icon: 'shield',
  },
  {
    title: 'One request, to GitHub',
    body: 'The showcase loads public repository data from the GitHub REST API when the page opens. That request goes to GitHub under its own privacy policy; if it is unavailable, a bundled snapshot is shown instead.',
    icon: 'git',
  },
  {
    title: 'Served from one origin',
    body: 'Fonts, video and images are served from this site itself, so the page makes no other third-party requests. Your light or dark choice is kept in your browser and never leaves your device.',
    icon: 'check',
  },
  {
    title: 'Hosting',
    body: 'The site runs on GitHub Pages, which as the web server may keep standard request logs such as your IP address and browser. We only ever see what GitHub reports.',
    icon: 'host',
  },
] as const
</script>

<template>
  <section id="privacy" class="relative scroll-mt-24 py-24 sm:py-32">
    <div class="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow="Privacy"
        title="Your visit stays yours."
        lead="We built this page the way we build our software: it asks for nothing and keeps nothing about you."
      />

      <div class="mt-16 grid gap-5 sm:grid-cols-2">
        <motion.div
          v-for="(p, i) in points" :key="p.title"
          class="glass rounded-2xl p-6 shadow-ink"
          v-bind="reveal(0.08 * i)"
        >
          <span class="inline-flex size-11 items-center justify-center rounded-xl bg-foreground/10 text-foreground ring-hair [&_svg]:size-5">
            <i-hugeicons-shield-01 v-if="p.icon === 'shield'" aria-hidden="true" />
            <i-hugeicons-git-fork v-else-if="p.icon === 'git'" aria-hidden="true" />
            <i-hugeicons-security-check v-else-if="p.icon === 'check'" aria-hidden="true" />
            <i-hugeicons-computer v-else aria-hidden="true" />
          </span>
          <h3 class="mt-5 text-lg font-semibold tracking-tight">{{ p.title }}</h3>
          <p class="mt-2 text-pretty text-sm text-muted-foreground">{{ p.body }}</p>
        </motion.div>
      </div>

      <motion.p class="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground" v-bind="reveal(0.3)">
        Questions about privacy? Email
        <a :href="`mailto:${organisation.contactEmail}`" class="text-foreground underline underline-offset-4 hover:no-underline">{{ organisation.contactEmail }}</a>.
      </motion.p>
    </div>
  </section>
</template>
