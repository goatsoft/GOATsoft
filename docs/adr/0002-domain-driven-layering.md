# 0002. Domain-driven layering in a static site

- Status: accepted
- Date: 2026-09-18

## Context

The site is small today (one page, two repositories to show) but is the organisation's
front door and will grow: more projects, possibly release feeds, case studies and a blog.
The product site grew organically and its copy, data fetching and rendering are entangled
in components.

## Decision

Organise `src/` into four layers with dependencies pointing inward:

- `domain/`: entities (`Project`), value rules (`Appearance`), ports (`ProjectRepository`),
  domain services (`curateProjects`) and editorial copy (`Organisation`). Pure TypeScript,
  no framework, no DOM, no environment access.
- `application/`: use cases as Vue composables (`useProjects`, `useAppearance`, `useBrand`,
  `useMotionPresets`). They construct adapters, call domain services and expose reactive
  state. This is the only auto-import directory.
- `infrastructure/`: adapters implementing domain ports (GitHub REST, static catalogue,
  composite fallback), the GPU renderer, and the single reader of `import.meta.env`.
- `presentation/`: `App.vue`, components and styles. Renders what composables expose.

Three bounded contexts: `project` (showcase), `brand` (appearance and assets),
`organisation` (identity and copy). Copy is data in the domain, not strings in templates.

Alternatives: a flat `components/composables/lib` layout as in GOAT/web (fast to start,
hard to keep honest), or full hexagonal folders per feature (too heavy for the size).

## Consequences

Adding a data source means implementing a port and wiring it in one composable. Domain and
infrastructure are unit-tested without a DOM. The cost is more folders and explicit imports
for domain types; `AGENTS.md` states the rules so agents keep the boundaries.
