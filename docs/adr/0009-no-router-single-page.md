# 0009. Single page with anchors, no client router

- Status: accepted
- Date: 2026-09-18

## Context

The site has one page with four sections. goatapp.dev carries vue-router for legal
dialogs and docs redirects, which this site does not have.

## Decision

No client router. Navigation uses in-page anchors (`#projects`, `#about`, `#open-source`)
with `scroll-margin` on the targets and native smooth scrolling (disabled on touch and
under reduced motion). Sections are composed directly in `App.vue`.

## Consequences

Less code and no 404 handling for Pages. When a second page is needed (a case study, a
blog), add vue-router with file-based routes as GOAT/web does and supersede this record.
