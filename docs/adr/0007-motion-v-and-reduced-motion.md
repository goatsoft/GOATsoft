# 0007. motion-v for animation, gated on reduced motion and touch

- Status: accepted
- Date: 2026-09-18

## Context

The brief asks for a slick site: entrances, scroll-linked parallax, hover physics. The same
site must be comfortable for people who ask their OS for less motion and must not fight
touch scrolling on phones.

## Decision

Use motion-v (`motion.*` components, `useScroll`, `useTransform`) for orchestrated motion
and CSS keyframes registered in `@theme` for ambient loops. Shared presets live in
`useMotionPresets()` (`enter` for the hero, `reveal` for in-view sections). `MotionConfig
reduced-motion="user"` plus a global CSS rule disable animation under
`prefers-reduced-motion`; scroll-linked transforms are skipped on touch input.

motion-v is imported explicitly in each component, never auto-registered, so its presence
is visible in the file.

## Consequences

One vocabulary for entrances across sections. Adding a new section means spreading a preset
rather than tuning durations by hand.
