import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { detectHarnessMode, installGithubCi } from '../skills/pm0/scripts/install-github-ci.mjs'

const testFilePath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(testFilePath), '..')
const sourceSkillDir = path.join(repoRoot, 'skills/pm0')

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

test('detectHarnessMode maps common PM0 skill locations', () => {
  assert.equal(detectHarnessMode('/repo/.claude/skills/pm0'), 'claude')
  assert.equal(detectHarnessMode('/repo/.agents/skills/pm0'), 'codex')
  assert.equal(detectHarnessMode('/repo/skills/pm0'), 'local')
})

test('installGithubCi installs local workflow with selected skill directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-ci-install-'))
  try {
    const result = await installGithubCi({
      root,
      skillDir: '.agents/skills/pm0',
      templateSkillDir: sourceSkillDir,
      mode: 'local',
    })

    assert.equal(result.mode, 'local')
    assert.equal(result.workflowPath, '.github/workflows/pm0.yml')
    assert.deepEqual(result.created, ['.github/workflows/pm0.yml'])

    const workflow = await readFile(path.join(root, '.github/workflows/pm0.yml'), 'utf8')
    assert.match(workflow, /PM0_SKILL_DIR: \.agents\/skills\/pm0/)
    assert.match(workflow, /node "\$PM0_SKILL_DIR\/scripts\/product-ci\.mjs"/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('installGithubCi auto-selects the current agent workflow', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-ci-install-'))
  try {
    const result = await installGithubCi({
      root,
      skillDir: '.agents/skills/pm0',
      templateSkillDir: sourceSkillDir,
      mode: 'auto',
    })

    assert.equal(result.mode, 'codex')
    const workflow = await readFile(path.join(root, '.github/workflows/pm0.yml'), 'utf8')
    assert.match(workflow, /openai\/codex-action@v1/)
    assert.match(workflow, /PM0_SKILL_DIR: \.agents\/skills\/pm0/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('installGithubCi refuses to overwrite existing workflow without force', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-ci-install-'))
  try {
    await mkdir(path.join(root, '.github/workflows'), { recursive: true })
    const workflowPath = path.join(root, '.github/workflows/pm0.yml')
    await mkdir(path.dirname(workflowPath), { recursive: true })
    await writeFile(workflowPath, 'name: Existing\n', 'utf8')

    await assert.rejects(
      () =>
        installGithubCi({
          root,
          skillDir: '.claude/skills/pm0',
          templateSkillDir: sourceSkillDir,
          mode: 'claude',
        }),
      /already exists/,
    )

    assert.equal(await exists(workflowPath), true)
    assert.equal(await readFile(workflowPath, 'utf8'), 'name: Existing\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('installGithubCi can install Claude and Codex agent examples', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'pm0-ci-install-'))
  try {
    const claude = await installGithubCi({
      root,
      skillDir: '.claude/skills/pm0',
      templateSkillDir: sourceSkillDir,
      mode: 'claude',
    })
    const claudeWorkflow = await readFile(path.join(root, claude.workflowPath), 'utf8')
    assert.match(claudeWorkflow, /anthropics\/claude-code-action@v1/)
    assert.match(claudeWorkflow, /ANTHROPIC_API_KEY/)
    assert.match(claudeWorkflow, /PM0_PRODUCT_REVIEW_PROMPT/)

    const codex = await installGithubCi({
      root,
      skillDir: '.agents/skills/pm0',
      templateSkillDir: sourceSkillDir,
      mode: 'codex',
      workflowPath: '.github/workflows/pm0-codex.yml',
    })
    const codexWorkflow = await readFile(path.join(root, codex.workflowPath), 'utf8')
    assert.match(codexWorkflow, /openai\/codex-action@v1/)
    assert.match(codexWorkflow, /OPENAI_API_KEY/)
    assert.match(codexWorkflow, /PM0_PRODUCT_REVIEW_PROMPT/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
