# 0013. Showcase shows an explicit repository allowlist

- Status: accepted
- Date: 2026-09-19

## Context

The organisation has repositories that should not appear in the public showcase (the
monorepo, the publish repo, the `.github` repo, docs). ADR 0006 curated a show-everything
feed and hid individuals with `hidden: true`, which does not scale and leaks new repos by
default.

## Decision

`curateProjects` takes an optional `shown` allowlist of slugs; when given, only those
repositories appear. The list lives in `infrastructure/catalogue/StaticProjectRepository.ts`
as `SHOWN` (currently `['GOAT', 'SwiftHosts']`) and is passed from `useProjects`. Curation
(`CURATION`) still supplies tagline, accent, order and download hints for the shown repos,
and `hidden` stays as a second guard. A new repository is invisible until added to `SHOWN`.

## Consequences

The showcase is opt-in: predictable, and a new org repo never appears by accident. Editing
`SHOWN` is the one place that controls visibility. Covered by a `ProjectCatalogue` test.
This refines ADR 0006.
