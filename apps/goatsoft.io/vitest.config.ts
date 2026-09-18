import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

/** Standalone from vite.config.ts so tests never load the Vue/Tailwind plugin chain. */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
