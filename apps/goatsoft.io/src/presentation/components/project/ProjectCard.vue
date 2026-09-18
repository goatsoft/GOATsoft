<script setup lang="ts">
import { motion } from 'motion-v'
import type { Project } from '@/domain/project/Project.ts'

const props = defineProps<{ project: Project; index: number; featured?: boolean }>()
const { reveal, touch } = useMotionPresets()

const accent = computed(() => {
  switch (props.project.accent) {
    case 'violet': return { from: 'var(--goat-accent2)', to: 'var(--goat-glow)' }
    case 'indigo': return { from: 'var(--goat-glow)', to: 'var(--goat-accent)' }
    case 'green': return { from: 'var(--goat-accent2)', to: 'var(--goat-accent)' }
    default: return { from: 'var(--goat-accent)', to: 'var(--goat-glow)' }
  }
})

// Pointer-tracked highlight: a soft spot follows the cursor across the glass.
const spot = ref({ x: 50, y: 50 })
function onMove(e: MouseEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  spot.value = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
}

const updated = computed(() => {
  if (!props.project.updatedAt) return ''
  return new Intl.DateTimeFormat('en-AU', { month: 'short', year: 'numeric' }).format(new Date(props.project.updatedAt))
})

// The latest-release page; GitHub redirects it to the newest tag.
const downloadUrl = computed(() => (props.project.download ? `${props.project.repoUrl}/releases/latest` : undefined))
</script>

<template>
  <motion.article
    class="group relative flex flex-col overflow-hidden rounded-2xl glass shadow-ink transition-shadow duration-500"
    :class="featured ? 'md:col-span-2 md:flex-row' : ''"
    v-bind="reveal(0.06 * index)"
    :while-hover="touch ? undefined : { y: -6 }"
    :transition="{ type: 'spring', stiffness: 260, damping: 24 }"
    :style="{ '--sx': `${spot.x}%`, '--sy': `${spot.y}%`, '--from': accent.from, '--to': accent.to }"
    @mousemove="onMove"
  >
    <!-- Accent wash and cursor spotlight -->
    <div class="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
      <div class="absolute -inset-px bg-[radial-gradient(60%_60%_at_var(--sx)_var(--sy),color-mix(in_oklab,var(--from)_22%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--from),var(--to),transparent)] opacity-70" />
    </div>

    <div class="relative flex flex-1 flex-col p-6 sm:p-8" :class="featured ? 'md:p-10' : ''">
      <div class="flex items-center gap-3">
        <span
          v-if="project.slug === 'GOAT'"
          class="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground/5 ring-hair [&_svg]:size-8"
        >
          <Icon name="gs:goat" aria-hidden="true" />
        </span>
        <span
          v-else
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground/10 text-foreground ring-hair [&_svg]:size-5"
        >
          <Icon name="hugeicons:source-code" aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <h3 class="truncate text-lg font-semibold tracking-tight" :class="featured ? 'sm:text-2xl' : ''">{{ project.name }}</h3>
          <p v-if="project.tagline" class="truncate text-sm text-muted-foreground">{{ project.tagline }}</p>
        </div>
      </div>

      <p class="mt-5 text-pretty text-muted-foreground" :class="featured ? 'text-base sm:text-lg' : 'text-sm'">{{ project.description }}</p>

      <ul v-if="project.topics.length" class="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
        <li v-for="t in project.topics.slice(0, 6)" :key="t" class="rounded-full px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground ring-hair">{{ t }}</li>
      </ul>

      <div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 font-mono text-xs text-muted-foreground/80">
        <span v-if="project.language" class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-[linear-gradient(135deg,var(--from),var(--to))]" />{{ project.language }}</span>
        <span v-if="updated">Updated {{ updated }}</span>
      </div>
    </div>

    <div class="relative flex flex-wrap gap-2 border-t border-border/60 p-4" :class="featured ? 'md:w-64 md:flex-col md:flex-nowrap md:justify-center md:gap-3 md:border-l md:border-t-0 md:p-8' : ''">
      <Button v-if="downloadUrl" as="a" :href="downloadUrl" target="_blank" rel="noopener" size="sm" class="flex-1 md:flex-none">
        <Icon name="hugeicons:download-04" /> Download
      </Button>
      <Button v-else-if="project.homepageUrl" as="a" :href="project.homepageUrl" target="_blank" rel="noopener" size="sm" class="flex-1 md:flex-none">
        <Icon name="hugeicons:arrow-up-right-01" /> Visit
      </Button>
      <Button v-else as="a" :href="project.repoUrl" target="_blank" rel="noopener" size="sm" class="flex-1 md:flex-none">
        <Icon name="simple-icons:github" /> Source
      </Button>
      <Button as="a" :href="project.repoUrl" target="_blank" rel="noopener" variant="outline" size="sm" class="flex-1 md:flex-none" aria-label="Star this repository on GitHub">
        <Icon name="hugeicons:star" /> {{ project.stars }} <span class="hidden sm:inline">Star</span>
      </Button>
    </div>
  </motion.article>
</template>
