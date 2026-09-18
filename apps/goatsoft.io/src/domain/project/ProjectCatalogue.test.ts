import { describe, expect, it } from 'vitest'
import { curateProjects } from './ProjectCatalogue.ts'
import type { Project } from './Project.ts'

const base = (slug: string, stars = 0, updatedAt?: string): Project => ({
  slug, name: slug, description: `${slug} description`, repoUrl: `https://github.com/goatsoft/${slug}`, stars, topics: [], updatedAt,
})

describe('curateProjects', () => {
  it('applies curated hints on top of live data', () => {
    const [goat] = curateProjects([base('GOAT')], [{ slug: 'goat', tagline: 'Private AI workspace', accent: 'violet', featured: true }])
    expect(goat?.tagline).toBe('Private AI workspace')
    expect(goat?.accent).toBe('violet')
    expect(goat?.featured).toBe(true)
    expect(goat?.description).toBe('GOAT description')
  })

  it('fills an empty description from curation only', () => {
    const [p] = curateProjects([{ ...base('x'), description: '' }], [{ slug: 'x', description: 'Curated' }])
    expect(p?.description).toBe('Curated')
  })

  it('hides projects marked hidden', () => {
    const list = curateProjects([base('GOAT'), base('goatsoft.github.io')], [{ slug: 'goatsoft.github.io', hidden: true }])
    expect(list.map(p => p.slug)).toEqual(['GOAT'])
  })

  it('orders curated projects first, then by stars, then by recency', () => {
    const list = curateProjects(
      [base('a', 5, '2026-01-01'), base('b', 5, '2026-02-01'), base('c', 50), base('d', 1)],
      [{ slug: 'd', order: 1 }, { slug: 'c', order: 2 }],
    )
    expect(list.map(p => p.slug)).toEqual(['d', 'c', 'b', 'a'])
  })

  it('shows only allowlisted slugs when a shown list is given', () => {
    const list = curateProjects([base('GOAT'), base('SwiftHosts'), base('goatherd.dev'), base('goatsoft.io')], [], ['GOAT', 'SwiftHosts'])
    expect([...list.map(p => p.slug)].sort()).toEqual(['GOAT', 'SwiftHosts'].sort())
  })
})
