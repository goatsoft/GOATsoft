# 0010. Monochrome theme, bundled brand assets, and a sequenced hero

- Status: accepted
- Date: 2026-09-18
- Amends: [0003](./0003-system-appearance-with-override.md) (palette), [0004](./0004-video-hero-per-appearance.md) (asset delivery), [0007](./0007-motion-v-and-reduced-motion.md) (hero timing)

## Context

The brand moved to a black-and-white aesthetic, and the real hero footage (an ibex
cresting a ridge) is itself near-monochrome. The first pass kept accent colour in the
tokens and served brand assets as string paths from `public/`. Two things changed: the
palette should be grayscale, and binary brand assets (logo, hero video) now live under
`src/presentation/assets/` so Vite hashes and cache-busts them.

## Decision

- **Monochrome palette.** The accent tokens (`--goat-accent`, `--goat-accent2`,
  `--goat-glow`) resolve to grayscale: near-white on the dark ground, ink on the light one.
  Everything downstream (primary buttons, the `text-aurora` headline, card accents, focus
  rings) is token-driven, so it turns monochrome without per-component edits. The GPU
  aurora palettes are grayscale too: white mist on dark, dark clouds on light. The `hue`
  prop stays for call-site clarity but every hue resolves to the same ramp.
- **Bundled brand assets.** The combined logo (`assets/svg/GOATsoft.svg`) is inlined via
  `?raw` so its `currentColor` stroke and fill take the theme colour. The hero video
  (`assets/video/*.{webm,mp4}` plus a poster) is imported with `?url` and resolved in the
  presentation layer (`assets/media.ts`), webm first with mp4 as the fallback. The domain
  `BrandAssets` port and the `public/brand` logo and `public/media` video placeholders are
  removed; `public/` now holds only the favicon and the social image.
- **Sequenced hero.** `HeroVideo` emits `ready` once playback starts (immediately under
  reduced motion, with a timeout safety net). `HeroSection` gates its copy on that event so
  the video plays first, then the headline eases up word by word, then the sub-text, then
  the buttons.

## Consequences

The domain no longer models brand assets; asset resolution is a presentation concern, which
is where the Vite imports must live anyway. Adding a light-graded hero video is one entry in
`media.ts`. The palette is one place (tokens + shader palettes) to retune. A visitor never
sees the hero copy before the footage, and reduced-motion users get the poster and immediate
copy. Colour, if it ever returns, is a token change, not a component sweep.
