/**
 * Who GOATsoft is, as the site describes it. Copy lives here so the presentation
 * layer renders facts rather than owning them. @see ADR 0002
 */
export interface OrganisationLink {
  readonly label: string
  readonly href: string
  readonly external?: boolean
}

export interface Pillar {
  readonly title: string
  readonly summary: string
  readonly icon: 'shield' | 'cpu' | 'code' | 'mountain'
}

export interface Organisation {
  readonly name: string
  readonly githubHandle: string
  readonly githubUrl: string
  readonly tagline: string
  readonly headline: string
  readonly mission: string
  readonly location: string
  readonly contactEmail: string
  readonly pillars: readonly Pillar[]
  readonly links: readonly OrganisationLink[]
}

export const ORGANISATION: Organisation = {
  name: 'GOATsoft',
  githubHandle: 'goatsoft',
  githubUrl: 'https://github.com/goatsoft',
  tagline: 'GOATed software, built in the open.',
  headline: 'Climb to new heights',
  mission:
    'GOATsoft designs and ships native macOS software that respects the people who use it: private by default, fast on your hardware, and open source with no hidden agendas.',
  location: 'Australia',
  contactEmail: 'baa@goatapp.dev',
  pillars: [
    {
      title: 'Private by design',
      summary: 'No accounts, no telemetry, no surprise network calls. Data stays on the device unless you choose otherwise.',
      icon: 'shield',
    },
    {
      title: 'Native first',
      summary: 'We build for the platform, not around it. Swift on the Mac, WebGPU in the browser, and the frameworks each one does best.',
      icon: 'cpu',
    },
    {
      title: 'Open source',
      summary: 'Every product ships with its source, its decisions and its licences. Issues, discussions and pull requests are the front door.',
      icon: 'code',
    },
    {
      title: 'Built to last',
      summary: 'Small, deliberate releases with architectural decision records behind them, so the reasoning outlives the code.',
      icon: 'mountain',
    },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/goatsoft', external: true },
    { label: 'GOAT for Mac', href: 'https://goatapp.dev', external: true },
    { label: 'Documentation', href: 'https://goatherd.dev', external: true },
  ],
}
