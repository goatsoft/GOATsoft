# 0012. Publish the built site to a dedicated Pages repo

- Status: accepted
- Date: 2026-09-18

## Context

The monorepo (goatsoft/GOATsoft) will hold more than one site over time. A GitHub repository
can serve only one Pages site, so the monorepo cannot host several sites each on its own
domain. ADR 0008 deployed this site from the monorepo's own Pages, which does not scale to
that.

## Decision

Source lives in goatsoft/GOATsoft. The workflow builds `apps/goatsoft.io` and publishes the
built `dist` to a dedicated publish repo, goatsoft/goatsoft.io, with `peaceiris/actions-gh-pages`
over an SSH deploy key (`external_repository`, `force_orphan`, `cname: goatsoft.io`). The
publish repo holds only the built output on `main` and serves it via Pages (deploy from
branch, `main` root) at the goatsoft.io custom domain, so `VITE_BASE` is always `/`. Each
future site gets its own publish repo the same way. This supersedes ADR 0008.

## Consequences

A push to `main` builds and republishes the site. Cross-repo publishing needs a write deploy
key on the publish repo and its private half as the `ACTIONS_DEPLOY_KEY` secret in GOATsoft.
The publish repo's history is disposable (`force_orphan`). Adding a site means a new publish
repo, a deploy key, and one more publish step.
