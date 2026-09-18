# AGENTS.md

> Monorepo: this repo is a pnpm + Turborepo workspace. The website lives in `apps/goatsoft.io` (all paths below are relative to it). Run tasks from the root with pnpm/turbo, or per package with `pnpm --filter goatsoft.io <task>`.

Rules for AI agents and developers working in this repo. This file is RULES ONLY: the
what-and-why narrative lives in [`README.md`](./README.md) and the reasoning behind each rule
lives in [`docs/adr/`](./docs/adr/README.md). Read the README first.

## Architecture (DDD)

The site is a single-page Vue app organised in four layers under `src/`. Dependencies point
inward only: presentation -> application -> domain, with infrastructure plugged in behind
domain ports. [ADR 0002]

| Layer | Directory | Contains | May import |
| --- | --- | --- | --- |
| Domain | `src/domain/` | Entities, value objects, ports (interfaces), pure domain services, editorial copy (`Organisation`) | Nothing outside `src/domain` |
| Application | `src/application/` | Use cases as composables (`useX.ts`): orchestrate domain + adapters, own reactive state | domain, infrastructure |
| Infrastructure | `src/infrastructure/` | Adapters implementing domain ports (GitHub REST, static catalogue), graphics renderers, `import.meta.env` config | domain only |
| Presentation | `src/presentation/` | `App.vue`, components, `assets/css`. Renders what composables expose; owns no business rules | application (auto-imported), domain types |

- **Domain is framework-free.** No Vue, no DOM, no `import.meta.env`, no `fetch` in
  `src/domain`. If it needs a browser API it is an adapter, not a domain object.
- **Ports live in the domain, adapters in infrastructure.** Add a new data source by
  implementing the port (e.g. `ProjectRepository`), never by calling `fetch` from a component.
- **Composables are the application layer.** A composable may construct adapters and apply
  domain services; a component may not. Components receive refs and functions.
- **Copy is data.** Visitor-facing text (headline, mission, pillars, curation) lives in
  `src/domain/organisation/Organisation.ts` and `src/infrastructure/catalogue/`. Components
  render it; they do not hard-code sentences beyond labels.
- **Bounded contexts:** `project` (showcase), `brand` (appearance and assets),
  `organisation` (identity and copy), `contact` (contact form input and validation). Keep
  them in their folders; cross-context imports go through types only.
- **`src/lib/`** is reserved for shadcn-vue's `cn()` helper and nothing else.

## Coding conventions

- **Vue:** SFCs with `<script setup lang="ts">`; keep components presentational. Nuxt-style
  auto-imports are the convention: use `ref`/`computed`/`watch` etc. bare; do NOT write
  `import { ref } from 'vue'`. `src/application/**` is the ONLY auto-import dir;
  `src/domain` and `src/infrastructure` are imported explicitly with `@/`. `import type`
  stays explicit. A new composable missing from the running dev server's `.d.ts` means
  restart the dev server, not add an import. Export only functions from `src/application`
  modules: the auto-import scanner stops at an exported array or object literal, so return
  constants from the composable instead. [ADR 0001]
- **Types:** strict TypeScript, `noUncheckedIndexedAccess`, no `any`. Co-locate types with
  the module that owns them. Domain types are the source of truth; adapters map into them.
- **Styling:** Tailwind v4 only; no `<style>` blocks unless a media-query-only fallback
  cannot be expressed as a class. Use the brand tokens (`goat-*`, `background`, `foreground`,
  `muted`, `border`, `primary`) and the `@utility` roles in `src/presentation/assets/css/main.css`
  (`text-eyebrow`, `text-display`, `text-section-heading`, `glass`, `ring-hair`,
  `shadow-ink`). Add an `@utility` when a token recurs. Dark mode is class-driven
  (`.dark` on `<html>`); use the `dark:` variant, never `prefers-color-scheme` in
  components. Every colour must read in both appearances. The palette is monochrome: grayscale accent
  tokens (near-white on dark, ink on light) and a white mist on dark, grayscale clouds on light. [ADR 0003, ADR 0010]
- **Icons:** unplugin-icons over `@iconify-json/hugeicons` and `@iconify-json/simple-icons`.
  Templates use the resolved components bare (`<i-hugeicons-mountain class="size-4" />`).
  No `Icon` wrapper component and no `@iconify/vue`.
- **Animation:** motion-v, imported explicitly (`import { motion } from 'motion-v'`), never
  via component auto-import; shared presets live in `src/application/useMotionPresets.ts`;
  gate on `useReducedMotion()` and on touch input for scroll-linked effects. CSS keyframes
  are registered in `@theme` and stop under `prefers-reduced-motion`. [ADR 0007]
- **Graphics:** the aurora background is WebGPU first, WebGL2 second, CSS last, drawn only
  while visible and at most 30 fps. New GPU work goes in `src/infrastructure/graphics` and is
  wrapped by a presentational component in `src/presentation/components/fx`. [ADR 0005]
- **Forms:** validation rules are Zod schemas in the domain (`src/domain/<context>`), bound in
  the application layer with Regle (`useRegleSchema` from `@regle/schemas`). Components render
  `r$.<field>.$errors`, gate display on `$error`, and set `novalidate` so the schema is the
  single source of truth. [ADR 0011]
- **Brand assets:** bundled by Vite under `src/presentation/assets` and resolved in the
  presentation layer, not the domain. The logo (`assets/svg/GOATsoft.svg`) is inlined via
  `?raw` so its `currentColor` takes the theme; the hero video (`assets/video/*`, webm then
  mp4) is imported with `?url` in `assets/media.ts`. `public/` holds only the favicon and
  social image. [ADR 0004, ADR 0010]
- **Naming:** composables `useX.ts`; adapters `XRepository.ts`; components `PascalCase.vue`
  grouped by role (`site`, `section`, `project`, `fx`, `ui`); ids and anchors `kebab-case`.
- **Comments:** purposeful only: inform usage and purpose, with a short `@see ADR NNNN` when
  the why lives there. No decision-history narration, no person attribution.
- **Prose:** no em dashes anywhere (code, comments, copy, docs): use `-`, `:` or `(...)`.
  `npm run lint:prose` fails the build on one; run it before finishing any change.
- **Imports:** use the `@/` alias for `src`.

## Decisions

- Every architectural or product-shaping decision gets an ADR in `docs/adr/` using
  `docs/adr/template.md`, numbered sequentially. Supersede rather than edit accepted ADRs.
- Reference the ADR from code comments and from this file where a rule follows from it.

## Testing

- **Vitest** (`vitest.config.ts`, standalone from `vite.config.ts`). Tests live next to code
  as `*.test.ts`. The domain and infrastructure layers are tested directly; presentation is
  verified by `vue-tsc` and a manual pass in both appearances.
- `npm run check` (typecheck, tests, prose) must pass before a commit. CI runs it on push.

## Assets and publishing

- Never add external scripts, fonts, analytics or embeds. The only runtime network call is
  the anonymous GitHub API request for the showcase, with a static fallback. [ADR 0006]
- The tracked `.env` holds public values only. Never put secrets in `VITE_*` variables.
- The site source lives in this monorepo; `.github/workflows/pages.yml` builds it and publishes
  the built output to the `goatsoft/goatsoft.io` repo, which serves it via Pages at the custom
  domain (so the base path is always `/`). [ADR 0012]
