# 0006. Showcase from the GitHub API with a curated static fallback

- Status: accepted
- Date: 2026-09-18

## Context

The showcase should stay current without a deploy for every new repository, yet the site
must render correctly offline, under the anonymous GitHub rate limit (60 requests per hour
per IP) and when a repository has no description.

## Decision

`ProjectRepository` is a domain port. Two adapters implement it: `GitHubProjectRepository`
(anonymous `GET /orgs/{org}/repos`, public only, forks and archived excluded, cached in
`sessionStorage` for ten minutes) and `StaticProjectRepository` (a snapshot mirroring
public repos). `CompositeProjectRepository` tries GitHub and falls back to the snapshot on
any failure or empty result, reporting which source answered.

Either way the domain service `curateProjects` applies `CURATION`: taglines, accents,
featured flags, explicit order, hidden repos, and descriptions for repos that lack one.
Editorial control stays in the repo; numbers come live.

Alternatives: build-time fetch (stale between deploys, and the Actions token adds a
secret), a hand-written list only (rots quickly).

## Consequences

The only runtime network call on the site is this one; it is unauthenticated and disclosed
in AGENTS.md. Keep `SNAPSHOT` honest and small.
