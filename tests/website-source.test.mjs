import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('package keeps skill tests and adds website scripts', async () => {
  const pkg = JSON.parse(await read('package.json'))

  assert.equal(pkg.scripts.test, 'node --test tests/*.test.mjs')
  assert.equal(pkg.scripts.dev, 'astro dev')
  assert.equal(pkg.scripts.build, 'astro build')
  assert.equal(pkg.scripts.preview, 'astro preview')
  assert.equal(pkg.scripts.check, 'pnpm format:check && pnpm lint && astro check')
})

test('homepage presents PM0 as an installable open-source skill', async () => {
  const page = await read('src/pages/index.astro')

  assert.match(page, /Product memory for AI agents/)
  assert.match(page, /Bring the mess\. Find the move\./)
  assert.match(page, /npx skills add KDotIndustries\/pm0/)
  assert.match(page, /DM Fouad/)
  assert.match(page, /Open source/)
})

test('homepage does not keep waitlist or access copy', async () => {
  const page = await read('src/pages/index.astro')
  const hero = await read('src/components/InputGravityHero.tsx')
  const combined = `${page}\n${hero}`.toLowerCase()

  assert.doesNotMatch(combined, /waitlist/)
  assert.doesNotMatch(combined, /get access/)
  assert.doesNotMatch(combined, /request access/)
})

test('hero includes the required product input cards', async () => {
  const hero = await read('src/components/InputGravityHero.tsx')

  for (const label of [
    'Intercom tickets',
    'Linear issues',
    'Slack messages',
    'Miro boards',
    'PostHog events',
    'Figma comments',
    'Customer calls',
    'CSV exports',
    'Research repo',
    'GitHub issues',
  ]) {
    assert.match(hero, new RegExp(label))
  }
})
