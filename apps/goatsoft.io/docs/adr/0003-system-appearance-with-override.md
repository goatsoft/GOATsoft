# 0003. Light and dark appearances follow the system, with a stored override

- Status: accepted
- Date: 2026-09-18

## Context

goatapp.dev is dark only. The organisation site addresses a more corporate audience and
needs a light appearance. Visitors expect the site to match their OS and to be able to pin a
choice.

## Decision

Two appearances, "Summit" (light) and "Midnight" (dark), selected by a `.dark` class on
`<html>` (`@custom-variant dark (&:where(.dark, .dark *))`). Resolution order: a stored
preference in `localStorage['goatsoft.appearance']` (`light` or `dark`), else
`prefers-color-scheme`. An inline script in `index.html` applies the rule before first
paint; `useAppearance()` owns it at runtime, listens to the media query and exposes a
three-state toggle (system, light, dark). The rule itself (`resolveAppearance`) lives in the
domain and is unit-tested.

Both palettes share the accent pair; only ground and ink change. Every component must read
in both appearances, and brand assets are paired per appearance (ADR 0004).

Alternative: `prefers-color-scheme` media queries only (no override, and Tailwind's `dark:`
variant then cannot be forced for previews).

## Consequences

One class controls everything, including the aurora blend mode and the hero video source.
The stored override is per browser; there is no account to sync it.
