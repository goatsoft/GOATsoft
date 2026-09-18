# Content

Copy is data, owned by the domain and infrastructure layers; components render it.

| Content | File |
| --- | --- |
| Name, tagline, headline ("Climb to new heights"), mission, location, contact | `src/domain/organisation/Organisation.ts` |
| About pillars (title, summary, icon) | same file, `pillars` |
| Footer "Elsewhere" links | same file, `links` |
| Showcase curation: featured, taglines, accent, order, hidden repos | `CURATION` in `src/infrastructure/catalogue/StaticProjectRepository.ts` |
| Offline snapshot of public repos | `SNAPSHOT` in the same file |
| Section eyebrows and headings | The section component that owns them |

## Showcase rules

1. The list comes from the GitHub REST API (`/orgs/goatsoft/repos`, public only, forks and
   archived repos excluded), cached in `sessionStorage` for ten minutes.
2. `curateProjects()` applies `CURATION` on top: taglines and accents, an explicit order for
   curated repos, then the rest by stars and recency. Repos marked `hidden` never show.
3. If GitHub fails or returns nothing, `SNAPSHOT` is used and the section footnote says so.

Keep `SNAPSHOT` honest: it mirrors repositories that exist publicly. It is a fallback, not a
place to announce unreleased work.
