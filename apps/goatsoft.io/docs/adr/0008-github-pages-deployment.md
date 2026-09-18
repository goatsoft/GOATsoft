# 0008. GitHub Pages deployment from Actions

- Status: superseded by [0012](./0012-publish-to-dedicated-pages-repo.md)
- Date: 2026-09-18

## Context

The site is static and belongs to a GitHub organisation. It should publish with no extra
hosting account and work whether it lives in `goatsoft.github.io` (organisation site, served
at `/`) or another repository (project site, served at `/<repo>/`).

## Decision

`.github/workflows/pages.yml` runs `npm run check` and `npm run build` on every push to
`main` and on manual dispatch, then deploys `dist/` with `actions/deploy-pages`. The base
path is derived from the repository name and passed as `VITE_BASE`; `asset()` in
`src/infrastructure/config/site.ts` prefixes every public path with it. Unlike goatapp.dev,
publication is not gated behind a variable: the organisation site has no release artefacts
to coordinate.

## Consequences

A merge to `main` is a deploy. Add a `CNAME` under `public/` and set `VITE_SITE_URL` when a
custom domain is chosen.
