import { projectUpdatedAt, type Project, type ProjectCuration } from './Project.ts'

/**
 * Domain service: merges curated hints onto projects from any source and orders
 * them for the showcase. The curation list is the organisation's editorial voice;
 * live data supplies the numbers. @see ADR 0006
 */
export function curateProjects(projects: readonly Project[], curation: readonly ProjectCuration[]): Project[] {
  const bySlug = new Map(curation.map(c => [c.slug.toLowerCase(), c] as const))
  const merged = projects
    .map((project) => {
      const c = bySlug.get(project.slug.toLowerCase())
      if (!c) return project
      return {
        ...project,
        description: project.description || c.description || '',
        tagline: c.tagline ?? project.tagline,
        accent: c.accent ?? project.accent,
        featured: c.featured ?? project.featured,
      } satisfies Project
    })
    .filter(project => !bySlug.get(project.slug.toLowerCase())?.hidden)

  const orderOf = (p: Project) => bySlug.get(p.slug.toLowerCase())?.order ?? Number.POSITIVE_INFINITY
  return merged.sort((a, b) => {
    const oa = orderOf(a)
    const ob = orderOf(b)
    if (oa !== ob) return oa - ob
    if (a.stars !== b.stars) return b.stars - a.stars
    return projectUpdatedAt(b) - projectUpdatedAt(a)
  })
}
