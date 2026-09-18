#!/usr/bin/env node
/**
 * Fails when an em dash (U+2014) appears anywhere in tracked source, copy or docs.
 * The house style uses "-", ":" or "(...)" instead. @see AGENTS.md
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SKIP = new Set(['node_modules', 'dist', '.git', 'public'])
// Built from the code point so this file passes its own check.
const EM_DASH = String.fromCodePoint(0x2014)
const EXT = /\.(ts|vue|css|md|json|html|mjs|yml|yaml)$/

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (EXT.test(name)) yield path
  }
}

let failures = 0
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) {
      failures++
      console.error(`${relative(ROOT, file)}:${i + 1}: em dash found`)
    }
  })
}
if (failures) {
  console.error(`\n${failures} em dash${failures === 1 ? '' : 'es'} found. Use "-", ":" or "(...)" instead.`)
  process.exit(1)
}
console.log('Prose check passed: no em dashes.')
