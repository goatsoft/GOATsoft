# 0001. Vite, Vue 3 and Tailwind v4 with auto-imports

- Status: accepted
- Date: 2026-09-18

## Context

goatapp.dev (the GOAT product site, `GOAT/web`) is a Vite + Vue 3 + Tailwind v4 app with
motion-v, unplugin auto-imports and unplugin-icons. The organisation site must share its
look, and the same people maintain both.

## Decision

Use the same stack: Vue 3.5 SFCs with `<script setup lang="ts">`, Vite 8, Tailwind v4 via
`@tailwindcss/vite`, motion-v, `unplugin-auto-import` for Vue APIs and the application
layer, `unplugin-vue-components` for the presentation components, `unplugin-icons` with
Hugeicons and Simple Icons. TypeScript is strict with `noUncheckedIndexedAccess`.

Auto-import directories are limited to `src/application/**` so the layer boundary in
ADR 0002 is visible in the import statements: anything from `src/domain` or
`src/infrastructure` is imported explicitly.

Alternatives: Nuxt (adds SSR machinery a static site does not need), Astro (a second
component model next to the product site), plain HTML (no shared components with GOAT/web).

## Consequences

Components and utilities can be lifted between the two sites with few edits. Generated
`.d.ts` files (`auto-imports.d.ts`, `components.d.ts`) are git-ignored and require one dev
server start after cloning.
