import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { validatePm0Memory } from '../skills/pm0/scripts/validate-pm0-memory.mjs'

const testFilePath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(testFilePath), '..')
const validatorScriptPath = path.join(repoRoot, 'skills/pm0/scripts/validate-pm0-memory.mjs')

async function write(root, relativePath, content) {
  const fullPath = path.join(root, relativePath)
  await mkdir(path.dirname(fullPath), { recursive: true })
  await writeFile(fullPath, content, 'utf8')
}

const validSurface = `# Onboarding

Status: Draft
Last updated: 2026-05-23

## Product Role
Help new users reach first value.

## Target Users / Jobs
Founders setting up the product.

## Current Behavior
Users see a guided setup.

## Product Principles
Keep setup short.

## Known Problems / Tensions
Activation can stall.

## Metrics / Signals
Setup completion.

## Active Proposals
- .pm0/proposals/2026-05-23-onboarding-empty-state.md

## Accepted PRDs
- .pm0/prds/2026-05-23-onboarding-empty-state.md

## Rejected Proposals
None.

## Open Questions
None.

## Evidence
Repo routes and product copy.

## Agent Notes
Keep notes short.
`

const validProposal = `# Onboarding Empty State

Status: Accepted
Surface: onboarding
Date: 2026-05-23

## Problem Or Opportunity
New users do not know where to start.

## Why Now
Activation matters.

## Target Users Or Segment
New founders.

## Current Behavior
Blank state.

## Desired Outcome
Clear first step.

## Evidence And Caveats
Surface analysis.

## Proposed Scope
Add a checklist.

## Non-Goals
Do not rebuild onboarding.

## Success Criteria
Users can start setup.

## Risks And Tradeoffs
May be too generic.

## Open Questions
None.

## Build Notes
Keep small.

## Handoff Readiness
- [x] Problem is clear
- [x] Target user is clear
- [x] Scope is small enough for one engineering pass
- [x] Acceptance criteria are testable
- [x] Metrics or learning signal is defined
- [x] Major open questions are resolved or explicitly accepted
`

const validPrd = `# Onboarding Empty State

Status: Accepted for engineering
Surface: onboarding
Date: 2026-05-23
Source Proposal: .pm0/proposals/2026-05-23-onboarding-empty-state.md
Related Context: .pm0/contexts/target-users.md
Related Surface: .pm0/surfaces/onboarding.md

## Product Intent
Improve activation.

## Background And Strategic Fit
Supports first value.

## Problem
Users are stuck.

## Users And Jobs
Founders.

## Current Behavior
Blank state.

## Desired Behavior
Guided setup.

## Evidence
Proposal.

## Requirements

| Requirement | Priority | User Value | Acceptance Criteria | Notes |
| --- | --- | --- | --- | --- |
| Show first step | P0 | Start faster | Step is visible | None |

## User Flows / UX Notes
Show checklist.

## Scope
Checklist only.

## Non-Goals
No full redesign.

## Metrics And Instrumentation
Setup completion.

## Rollout / Migration Notes
No migration.

## Risks, Tradeoffs, And Assumptions
May need copy iteration.

## Open Questions
None.

## Engineering Notes
Use existing UI.

## Verification Expectations
Check empty state renders.
`

test('validatePm0Memory passes for a complete PM0 memory tree', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-validate-'))
  try {
    await write(root, '.pm0/project.md', '# Product\n')
    await write(root, '.pm0/surfaces/onboarding.md', validSurface)
    await write(root, '.pm0/proposals/2026-05-23-onboarding-empty-state.md', validProposal)
    await write(root, '.pm0/prds/2026-05-23-onboarding-empty-state.md', validPrd)

    const result = await validatePm0Memory({ root })

    assert.equal(result.result, 'pass')
    assert.deepEqual(result.findings, [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('validatePm0Memory warns about malformed artifacts and placeholder residue', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-validate-'))
  try {
    await write(root, '.pm0/project.md', '# Product\n')
    await write(
      root,
      '.pm0/surfaces/onboarding.md',
      '# Onboarding\n\n- Unverified surface detected during init.\n',
    )
    await write(
      root,
      '.pm0/proposals/2026-05-23-onboarding-empty-state.md',
      '# Proposal\n\n## Problem Or Opportunity\n',
    )
    await write(
      root,
      '.pm0/prds/2026-05-23-onboarding-empty-state.md',
      '# PRD\n\n## Product Intent\n',
    )

    const result = await validatePm0Memory({ root })
    const messages = result.findings.map(finding => finding.message).join('\n')

    assert.equal(result.result, 'warning')
    assert.match(messages, /Surface onboarding\.md is missing required section: ## Product Role/)
    assert.match(messages, /Surface onboarding\.md contains scaffold placeholder residue/)
    assert.match(
      messages,
      /Proposal 2026-05-23-onboarding-empty-state\.md is missing required section: ## Handoff Readiness/,
    )
    assert.match(
      messages,
      /PRD 2026-05-23-onboarding-empty-state\.md is missing required section: ## Requirements/,
    )
    assert.match(
      messages,
      /PRD 2026-05-23-onboarding-empty-state\.md is not linked from any surface Accepted PRDs section/,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('validate PM0 memory CLI emits JSON and exits zero for warnings', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-validate-cli-'))
  try {
    await write(root, '.pm0/project.md', '# Product\n')
    await write(
      root,
      '.pm0/surfaces/index.md',
      '# Product Surfaces\n\n- Unverified: add product surfaces such as `onboarding`, `pricing`, or `dashboard`.\n',
    )

    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [validatorScriptPath], { cwd: root })
      let stdout = ''
      let stderr = ''

      child.stdout.setEncoding('utf8')
      child.stderr.setEncoding('utf8')
      child.stdout.on('data', chunk => {
        stdout += chunk
      })
      child.stderr.on('data', chunk => {
        stderr += chunk
      })
      child.on('error', reject)
      child.on('close', code => {
        resolve({ code, stdout, stderr })
      })
    })

    assert.equal(result.code, 0)
    assert.equal(result.stderr, '')
    assert.match(result.stdout, /"result": "warning"/)
    assert.match(result.stdout, /placeholder residue/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
