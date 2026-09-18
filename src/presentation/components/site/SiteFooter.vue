<script setup lang="ts">
const { organisation, year } = useBrand()
</script>

<template>
  <footer class="relative mt-24 border-t border-border/60 sm:mt-32">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:gap-10 sm:py-14 md:grid-cols-[1.6fr_1fr_1fr]">
      <div>
        <BrandMark size="sm" />
        <p class="mt-3 max-w-xs text-pretty text-sm text-muted-foreground">{{ organisation.tagline }}</p>
        <p class="mt-4 font-mono text-xs text-muted-foreground/70">{{ organisation.location }}</p>
      </div>

      <div>
        <h4 class="text-sm font-semibold">Company</h4>
        <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
          <li><a href="#projects" class="hover:text-foreground">Projects</a></li>
          <li><a href="#about" class="hover:text-foreground">About</a></li>
          <li><a href="#open-source" class="hover:text-foreground">Open source</a></li>
          <li><a :href="`mailto:${organisation.contactEmail}`" class="hover:text-foreground">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold">Elsewhere</h4>
        <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
          <li v-for="l in organisation.links" :key="l.href">
            <a :href="l.href" :target="l.external ? '_blank' : undefined" :rel="l.external ? 'noopener' : undefined" class="hover:text-foreground">{{ l.label }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-border/60 px-6 py-6 text-xs text-muted-foreground/70 md:flex-row md:items-center">
      <span>&copy; {{ year }} {{ organisation.name }}. Code is released under the licence in each repository.</span>
      <span>Not affiliated with Apple. macOS is a trademark of Apple Inc.</span>
    </div>
  </footer>
</template>
