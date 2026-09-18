<script setup lang="ts">
import { MotionConfig } from 'motion-v'
// Establish the appearance early so every child sees the resolved class.
useAppearance()
</script>

<template>
  <!-- reduced-motion="user": motion-v drops transforms and blur for people who asked the OS for less motion. -->
  <MotionConfig reduced-motion="user">
    <div class="relative isolate min-h-dvh overflow-x-clip bg-background text-foreground">
      <AmbientGlow />
      <SiteNav />
      <main>
        <HeroSection />
        <div class="relative">
          <ProjectsSection />
          <AboutSection />
          <OpenSourceSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  </MotionConfig>
</template>
