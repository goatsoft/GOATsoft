# 0005. WebGPU aurora background with WebGL2 and CSS fallbacks

- Status: accepted
- Date: 2026-09-18

## Context

The GOAT brand has a signature aurora glow, implemented on goatapp.dev as a domain-warped
fbm shader. The organisation site wants the same motion without the product site's worker
architecture, and must not stutter on low-power devices or cost battery in background tabs.

## Decision

Port the shader (WGSL and GLSL ES 3.0, same 80-byte uniform block) into
`src/infrastructure/graphics`. `createAuroraRenderer` tries WebGPU on the main thread, then
WebGL2, and reports `css` so the component paints radial gradients instead. It draws at
half device resolution capped at 1280 px wide, at most 30 fps, only while the canvas
intersects the viewport and the tab is visible, and draws a single still frame under
reduced motion. `AuroraCanvas.vue` wraps it and picks a palette per appearance. The canvas composites
normally: `mix-blend-mode` on a GPU canvas layer renders as a solid wash in Chrome's
software compositor, so the light palette is deepened instead of blended.

The worker + OffscreenCanvas path from GOAT/web is deliberately not ported; this site has
few surfaces and the extra lifetime management is not worth it yet.

## Consequences

GPU work is isolated in infrastructure and testable at the uniform-packing level. If the
number of aurora surfaces grows, revisit the shared-worker design from GOAT ADR 0079.
