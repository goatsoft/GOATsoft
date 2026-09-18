# 0004. Video hero with one edit per appearance

- Status: accepted
- Date: 2026-09-18

## Context

The hero is a full-bleed video of a goat climbing, then looking over a mountain vista, with
the headline "Climb to new heights". A single grade cannot sit well under both a pale and a
dark page, and the logo must match too.

## Decision

Brand assets are declared as a pair in `src/domain/brand/BrandAssets.ts`: for each
appearance a logo, a wordmark, and a hero video with `mp4` (H.264), `webm` (VP9) and a
poster still. `HeroVideo.vue` remounts the `<video>` when the appearance changes so the
browser reloads the sources, autoplays muted and inline, and shows the poster until
`canplay` or whenever autoplay is refused. Under `prefers-reduced-motion` only the poster is
shown. A veil and a bottom gradient blend the footage into the page.

The repository ships generated placeholder videos and posters so the site builds; the final
edits replace them under the same paths.

Alternatives: CSS filters on one video (fragile, off-brand), a static image hero (less of
the "slick" the brief asks for).

## Consequences

Two videos double the media weight; `preload="metadata"` and a poster keep the first paint
fast. Replacing assets never touches code.
