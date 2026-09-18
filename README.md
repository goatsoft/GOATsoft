# GOATsoft

Monorepo for GOATsoft, managed with pnpm workspaces and Turborepo.

## Packages

| Path | What |
| --- | --- |
| `apps/goatsoft.io` | The public website (Vue 3 + Vite), deployed to https://goatsoft.io/ |
| `packages/*` | Shared packages (none yet) |

## Getting started

Requires Node.js 22+ and pnpm.

```sh
pnpm install         # install every workspace
pnpm dev             # run all dev servers (goatsoft.io on :5173)
pnpm build           # build every package
pnpm check           # build + typecheck + test + prose, what CI runs
```

Turborepo caches task output, so re-running `build`/`check` only rebuilds what changed.
Run a single package with a filter, e.g. `pnpm --filter goatsoft.io dev`.

The website's own README, docs and ADRs live in `apps/goatsoft.io`.
