# Branding

The site inherits the GOAT brand from goatapp.dev and adds a light appearance.

## Palettes

| Token | Midnight (dark) | Summit (light) |
| --- | --- | --- |
| `--goat-bg` | `#0A0B14` | `#F6F7FB` |
| `--goat-surface` | `#151726` | `#FFFFFF` |
| `--goat-ink` | `#E9ECF5` | `#0E1020` |
| `--goat-muted` | `#8E95A8` | `#5D6478` |
| `--goat-accent` | `#3AA0FF` | `#2F8FFF` |
| `--goat-accent2` | `#B44BFF` | `#A63CFF` |
| `--goat-glow` | `#7A5CFF` | `#6F55FF` |

The accent pair (blue to violet) is constant across appearances; only the ground and ink
change. Light accents are nudged darker so they hold contrast on white. All tokens are
defined once in `src/presentation/styles/main.css` and exposed to Tailwind through
`@theme inline`.

## Appearance

`.dark` on `<html>` selects Midnight. The inline script in `index.html` sets it before first
paint from `localStorage['goatsoft.appearance']` or `prefers-color-scheme`; `useAppearance()`
owns it afterwards and keeps it in sync with the system. See ADR 0003.

## Surfaces and motion

- `glass`: translucent surface with saturate + blur, hairline border. Nav, cards, callouts.
- `ring-hair`: inset hairline for quiet containers.
- `shadow-ink`: soft shadow whose ink adapts to the appearance.
- `text-aurora`: ink -> accent -> accent2 gradient text for the last word of a headline.
- `text-brand`: cycling wordmark gradient.
- Aurora canvases (`AuroraCanvas`) composite normally in both appearances; the light
  palette is deeper so the same shader reads as a tint on white. No `mix-blend-mode`.

## Assets

Assets are paired per appearance and listed in `src/domain/brand/BrandAssets.ts`. The
placeholders in `public/brand` and `public/media` are generated; replace them in place. The
hero brief: a goat climbing, then looking out over a mountain vista. Two edits, one graded
for each appearance, each loopable and muted.

## Type

System UI stack (SF Pro on Apple platforms, Inter or Segoe elsewhere). Type roles are
`@utility` rules: `text-eyebrow`, `text-display`, `text-section-heading`. No web fonts are
loaded (privacy and performance; see AGENTS.md).
