<script setup lang="ts">
const { organisation } = useBrand()
const scrolled = ref(false)
const open = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)

const onScroll = () => (scrolled.value = window.scrollY > 24)
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function closeMenu() {
  open.value = false
  menuButton.value?.focus()
}

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Open source', href: '#open-source' },
]
</script>

<template>
  <header
    id="top"
    class="fixed inset-x-0 top-0 z-50 py-3 md:transition-[padding] md:duration-500"
    :class="scrolled ? 'md:py-2' : 'md:py-4'"
  >
    <div class="relative mx-auto max-w-6xl px-4" @keydown.esc="closeMenu">
      <nav
        class="flex items-center justify-between rounded-full px-4 py-2 md:transition-all md:duration-500"
        :class="scrolled ? 'glass shadow-ink' : 'border border-transparent'"
        aria-label="Primary"
      >
        <BrandMark />

        <div class="hidden items-center gap-7 text-sm md:flex" :class="scrolled ? 'text-muted-foreground' : 'text-foreground'">
          <a v-for="l in links" :key="l.href" :href="l.href" class="transition-colors hover:text-foreground">{{ l.label }}</a>
        </div>

        <div class="flex items-center gap-1.5">
          <AppearanceToggle class="hidden sm:inline-flex" />
          <Button variant="ghost" size="icon" as="a" :href="organisation.githubUrl" target="_blank" rel="noopener" aria-label="GOATsoft on GitHub" class="hidden md:inline-flex">
            <i-simple-icons-github />
          </Button>
          <Button size="sm" as="a" href="#projects" class="hidden sm:inline-flex">
            <i-hugeicons-arrow-up-right-01 /> See our work
          </Button>
          <button
            ref="menuButton" type="button"
            class="inline-flex size-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-border bg-background/80 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden [&_svg]:pointer-events-none [&_svg]:size-5"
            :aria-label="open ? 'Close menu' : 'Open menu'" :aria-expanded="open" aria-controls="mobile-navigation"
            @click="open = !open"
          >
            <i-hugeicons-menu-01 v-if="!open" aria-hidden="true" /><i-hugeicons-cancel-01 v-else aria-hidden="true" />
          </button>
        </div>
      </nav>

      <nav
        v-if="open" id="mobile-navigation" aria-label="Mobile navigation"
        class="glass absolute inset-x-4 top-full mt-2 flex flex-col gap-1 rounded-2xl p-2 shadow-ink md:hidden"
      >
        <a
          v-for="l in [...links, { label: 'GitHub', href: organisation.githubUrl }]" :key="l.href" :href="l.href"
          class="flex min-h-12 touch-manipulation items-center rounded-xl px-4 py-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring active:glass-hover"
          @click="open = false"
        >{{ l.label }}</a>
        <div class="flex items-center justify-between px-4 py-3">
          <span class="text-sm text-muted-foreground">Appearance</span>
          <AppearanceToggle labels />
        </div>
      </nav>
    </div>
  </header>
</template>
