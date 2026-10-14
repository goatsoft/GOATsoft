# 0014. Backgrounds on @goatsoft/aurora

- Status: accepted
- Date: 2026-10-14

## Context

ADR 0005 gave the site its own aurora renderer: one fbm shader written twice (WGSL and GLSL),
a canvas per placement and a hand-written CSS fallback. GOATsoft now publishes that work as
`@goatsoft/aurora` (aurora.goatsoft.io), which does the same job with more: layered
generators and blend modes, one shared GPU device and frame budget for every background on
the page, a worker renderer, shader warm-up before the app mounts, CSS fallbacks compiled
from each background at build time, and a Studio to edit them. Keeping a second copy means
fixing the same problems twice, and the site cannot show what the library can do.

## Decision

Every background on the site is an Aurora `.aurora` file, drawn by `@goatsoft/aurora-vue`.

- The files live in `src/infrastructure/graphics/backgrounds/`, one per place and appearance
  (`ambient`, `hero`, `about`, `open-source`, each `-dark` and `-light`, plus `hero-touch`).
  `backgrounds.ts` maps a place and appearance to its file. They use the monochrome ramps of
  ADR 0010 and the `srgb` mix, so the original mist reads the same; the extra layers stay
  in those ramps (a faint starfield on dark, soft clouds on light, curtains behind About,
  grain on the light Open source panel, a second, slower fog in the hero).
- `AuroraBackdrop.vue` (in `fx`) is the only component that renders one. It swaps the file
  when the appearance changes; Aurora handles visibility, hidden tabs, reduced motion, the
  30 fps budget and the fallback chain (WebGPU in a worker, WebGPU on the main thread, CSS).
- `@goatsoft/aurora-unplugin` validates the files and inlines their CSS fallback at build
  time. `main.ts` calls `prepareAurora` with the first screen's backgrounds before Vue
  mounts, so the GPU and shaders are ready by the first frame.
- The WebGL2 path is dropped. Browsers without WebGPU get each file's compiled CSS fallback,
  as ADR 0005 already did when WebGL2 was missing.
- The footer carries the "Powered by Aurora" badge (`AuroraBadge`, themed to the page's
  appearance), and Aurora is in the showcase.

## Consequences

The site's own renderer, shaders and their test are gone; background changes are edits to
`.aurora` files, which open in Aurora Studio. Aurora upgrades arrive with the package, and
new generators can be used here without touching site code. Devices without WebGPU see the
CSS approximation instead of a WebGL2 animation. The page background no longer scrolls with
a hand-rolled uniform; `canvas.parallax` in the file does it. The badge image loads from
aurora.goatsoft.io unless it is self-hosted later. Supersedes ADR 0005.
