import { describe, expect, it, vi } from 'vitest'
import { CompositeProjectRepository } from './CompositeProjectRepository.ts'
import { StaticProjectRepository, SNAPSHOT } from './StaticProjectRepository.ts'

describe('CompositeProjectRepository', () => {
  it('prefers the live source', async () => {
    const live = { list: vi.fn(async () => SNAPSHOT) }
    const repo = new CompositeProjectRepository(live, new StaticProjectRepository([]))
    const listing = await repo.listWithSource()
    expect(listing.source).toBe('github')
    expect(listing.projects).toHaveLength(SNAPSHOT.length)
  })

  it('falls back to the catalogue when the live source fails', async () => {
    const onFallback = vi.fn()
    const live = { list: vi.fn(async () => { throw new Error('offline') }) }
    const repo = new CompositeProjectRepository(live, new StaticProjectRepository(), onFallback)
    const listing = await repo.listWithSource()
    expect(listing.source).toBe('catalogue')
    expect(listing.projects.map(p => p.slug)).toContain('GOAT')
    expect(onFallback).toHaveBeenCalledOnce()
  })

  it('falls back when the live source is empty', async () => {
    const live = { list: vi.fn(async () => []) }
    const repo = new CompositeProjectRepository(live, new StaticProjectRepository())
    expect((await repo.listWithSource()).source).toBe('catalogue')
  })

  it('rethrows an abort instead of falling back', async () => {
    const controller = new AbortController()
    const live = { list: vi.fn(async () => { controller.abort(); throw new DOMException('aborted', 'AbortError') }) }
    const repo = new CompositeProjectRepository(live, new StaticProjectRepository())
    await expect(repo.listWithSource(controller.signal)).rejects.toThrow('aborted')
  })
})
