import { describe, expect, it, vi } from 'vitest'
import { GitHubProjectRepository, toProject, type GitHubRepo } from './GitHubProjectRepository.ts'

const repo = (over: Partial<GitHubRepo> = {}): GitHubRepo => ({
  name: 'GOAT', description: 'A native AI workspace for Mac.', html_url: 'https://github.com/goatsoft/GOAT',
  homepage: 'https://goatapp.dev/', language: 'Swift', stargazers_count: 1, topics: ['mac', 'ai'], pushed_at: '2026-09-13T02:27:48Z',
  ...over,
})

const okJson = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))

describe('toProject', () => {
  it('maps the GitHub shape to the domain entity', () => {
    expect(toProject(repo())).toEqual({
      slug: 'GOAT', name: 'GOAT', description: 'A native AI workspace for Mac.', repoUrl: 'https://github.com/goatsoft/GOAT',
      homepageUrl: 'https://goatapp.dev/', language: 'Swift', stars: 1, topics: ['mac', 'ai'], updatedAt: '2026-09-13T02:27:48Z',
    })
  })
  it('treats empty homepage and null description as absent', () => {
    const p = toProject(repo({ homepage: '', description: null, topics: undefined }))
    expect(p.homepageUrl).toBeUndefined()
    expect(p.description).toBe('')
    expect(p.topics).toEqual([])
  })
})

describe('GitHubProjectRepository', () => {
  it('lists public, non-fork, non-archived repositories', async () => {
    const fetchFn = vi.fn(() => okJson([repo(), repo({ name: 'fork', fork: true }), repo({ name: 'old', archived: true })]))
    const repos = new GitHubProjectRepository({ organisation: 'goatsoft', fetch: fetchFn as unknown as typeof fetch })
    const list = await repos.list()
    expect(list.map(p => p.slug)).toEqual(['GOAT'])
    expect(fetchFn).toHaveBeenCalledWith('https://api.github.com/orgs/goatsoft/repos?type=public&sort=updated&per_page=100', expect.anything())
  })

  it('throws on a non-OK response so the composite can fall back', async () => {
    const fetchFn = vi.fn(() => Promise.resolve(new Response('rate limited', { status: 403 })))
    const repos = new GitHubProjectRepository({ organisation: 'goatsoft', fetch: fetchFn as unknown as typeof fetch })
    await expect(repos.list()).rejects.toThrow('403')
  })

  it('serves a fresh cache without calling the network', async () => {
    const store = new Map<string, string>()
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
    const fetchFn = vi.fn(() => okJson([repo()]))
    const repos = new GitHubProjectRepository({ organisation: 'goatsoft', fetch: fetchFn as unknown as typeof fetch, storage })
    await repos.list()
    await repos.list()
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
})
