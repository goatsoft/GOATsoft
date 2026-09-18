<script setup lang="ts">
import { motion } from 'motion-v'
const { organisation } = useBrand()
const { reveal } = useMotionPresets()

const doors = [
  { label: 'Repositories', detail: 'Read the source, fork it, build it.', href: organisation.githubUrl, icon: 'repo' },
  { label: 'Issues', detail: 'Report a bug or request a feature on any project.', href: `${organisation.githubUrl}/GOAT/issues`, icon: 'issue' },
  { label: 'Discussions', detail: 'Ask questions and share what you are building.', href: `${organisation.githubUrl}/GOAT/discussions`, icon: 'talk' },
  { label: 'Documentation', detail: 'Guides and reference for every release.', href: 'https://goatherd.dev', icon: 'book' },
] as const
</script>

<template>
  <section id="open-source" class="relative scroll-mt-24 py-24 sm:py-32">
    <div class="mx-auto max-w-6xl px-6">
      <motion.div class="glass relative overflow-hidden rounded-3xl p-8 shadow-ink sm:p-14" v-bind="reveal()">
        <div class="pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden="true">
          <AuroraCanvas hue="violet" :intensity="0.22" :scale="1.4" :speed="0.07" :seed="7" :stretch="0.6" :sweep="0.6" />
        </div>

        <div class="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p class="text-eyebrow">Open source</p>
            <h2 class="text-section-heading mt-4">Everything is on GitHub.</h2>
            <p class="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              Code, decisions and roadmaps live in public repositories under the {{ organisation.name }} organisation. Star a project, open an issue, or send a pull request: that is how things get built here.
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="default" size="lg" as="a" :href="organisation.githubUrl" target="_blank" rel="noopener">
                <i-simple-icons-github class="size-5" /> github.com/{{ organisation.githubHandle }}
              </Button>
              <Button variant="glass" size="lg" as="a" href="#contact" class="border-0">
                <i-hugeicons-mail-01 /> Contact us
              </Button>
            </div>
          </div>

          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <motion.li v-for="(door, i) in doors" :key="door.label" v-bind="reveal(0.1 + i * 0.06)">
              <a
                :href="door.href" target="_blank" rel="noopener"
                class="group flex items-center gap-4 rounded-2xl p-4 ring-hair transition-colors hover:glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <span class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
                  <i-hugeicons-git-fork v-if="door.icon === 'repo'" aria-hidden="true" />
                  <i-hugeicons-security-check v-else-if="door.icon === 'issue'" aria-hidden="true" />
                  <i-hugeicons-sparkles v-else-if="door.icon === 'talk'" aria-hidden="true" />
                  <i-hugeicons-book-open-01 v-else aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block font-semibold">{{ door.label }}</span>
                  <span class="block text-sm text-muted-foreground">{{ door.detail }}</span>
                </span>
                <i-hugeicons-arrow-up-right-01 class="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
              </a>
            </motion.li>
          </ul>
        </div>
      </motion.div>
    </div>
  </section>
</template>
