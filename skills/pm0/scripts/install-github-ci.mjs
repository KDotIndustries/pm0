import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const VALID_MODES = new Set(['auto', 'local', 'claude', 'codex'])

function normalizePath(filePath) {
  return String(filePath || '').replace(/\\/g, '/')
}

export function detectHarnessMode(skillDir) {
  const normalized = normalizePath(skillDir)
  if (/(^|\/)\.claude\/skills\/pm0$/.test(normalized)) {
    return 'claude'
  }
  if (/(^|\/)\.agents\/skills\/pm0$/.test(normalized)) {
    return 'codex'
  }
  return 'local'
}

function templateNameForMode(mode) {
  if (mode === 'claude') {
    return 'github-workflow.claude.example.yml'
  }
  if (mode === 'codex') {
    return 'github-workflow.codex.example.yml'
  }
  return 'github-workflow.yml'
}

function resolveMode(mode, skillDir) {
  if (!VALID_MODES.has(mode)) {
    throw new Error(`Unknown CI mode: ${mode}`)
  }
  return mode === 'auto' ? detectHarnessMode(skillDir) : mode
}

function renderWorkflow(template, skillDir) {
  return template.replace(/^(\s*PM0_SKILL_DIR:\s*).+$/m, `$1${skillDir}`)
}

export async function installGithubCi(options = {}) {
  const root = options.root || process.cwd()
  const skillDir = options.skillDir || '.agents/skills/pm0'
  const templateSkillDir =
    options.templateSkillDir || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const mode = resolveMode(options.mode || 'auto', skillDir)
  const workflowPath = options.workflowPath || '.github/workflows/pm0.yml'
  const destination = path.join(root, workflowPath)
  const templatePath = path.join(templateSkillDir, 'templates', templateNameForMode(mode))

  const template = await readFile(templatePath, 'utf8')
  const workflow = renderWorkflow(template, skillDir)
  await mkdir(path.dirname(destination), { recursive: true })

  try {
    await writeFile(destination, workflow, { encoding: 'utf8', flag: options.force ? 'w' : 'wx' })
  } catch (error) {
    if (error?.code === 'EEXIST') {
      throw new Error(`${workflowPath} already exists. Re-run with --force to overwrite it.`)
    }
    throw error
  }

  return { mode, workflowPath, created: [workflowPath] }
}

function usage() {
  return [
    'Usage: node <active PM0 skill directory>/scripts/install-github-ci.mjs [--mode local|claude|codex|auto] [--skill-dir <path>] [--workflow <path>] [--force]',
    '',
    'Options:',
    '  --mode <mode>       Workflow mode. auto detects from --skill-dir. Default: auto',
    '  --skill-dir <path>  PM0 skill directory committed in this repository. Default: .agents/skills/pm0',
    '  --workflow <path>   Destination workflow path. Default: .github/workflows/pm0.yml',
    '  --force            Overwrite an existing workflow',
  ].join('\n')
}

function parseArgs(args) {
  const options = {}
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--force') {
      options.force = true
      continue
    }

    const value = args[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`${arg} requires a value.\n\n${usage()}`)
    }

    if (arg === '--mode') {
      options.mode = value
    } else if (arg === '--skill-dir') {
      options.skillDir = value
    } else if (arg === '--workflow') {
      options.workflowPath = value
    } else {
      throw new Error(`Unknown option: ${arg}\n\n${usage()}`)
    }
    index += 1
  }
  return options
}

async function main() {
  const result = await installGithubCi(parseArgs(process.argv.slice(2)))
  console.log(JSON.stringify(result, null, 2))
}

const currentFile = fileURLToPath(import.meta.url)
if (process.argv[1] === currentFile) {
  main().catch(error => {
    console.error(error.message)
    process.exit(1)
  })
}
