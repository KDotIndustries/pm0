# PM0 Skill Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public PM0 skill/plugin pack: one `/pm0` skill with command references, deterministic `.pm0` scaffolding, optional GitHub CI, harness packaging, tests, and README.

**Architecture:** Keep one canonical source under `skills/pm0/`, following the Impeccable one-skill command-router pattern. Scripts provide deterministic scaffolding and CI checks; product judgment stays in skill/reference instructions. Harness-specific skill copies and plugin manifests are generated or synchronized from the canonical source.

**Tech Stack:** Markdown skill files, Node.js ESM scripts using only built-in modules, `node:test`, shell scripts, JSON plugin manifests.

---

## Reference Inputs

Read these before implementing:

- `docs/specs/2026-05-23-pm0-skill-pack-design.md`
- `examples/impeccable-main/skill/SKILL.md`
- `examples/impeccable-main/.agents/skills/impeccable/SKILL.md`
- `examples/impeccable-main/.claude-plugin/plugin.json`
- `examples/superpowers-main/.codex-plugin/plugin.json`
- `examples/superpowers-main/.claude-plugin/plugin.json`
- `examples/superpowers-main/README.md`

Do not copy PMOS templates or PMOS command text.

## File Structure

Create or modify these files:

- Create `package.json`: Node test scripts and package metadata.
- Create `README.md`: public install/use documentation.
- Create `.claude-plugin/plugin.json`: Claude plugin manifest.
- Create `.codex-plugin/plugin.json`: Codex plugin manifest.
- Create `.cursor-plugin/plugin.json`: Cursor plugin manifest following the Superpowers example shape.
- Create `skills/pm0/SKILL.md`: canonical one-skill command router.
- Create `skills/pm0/reference/init.md`: `/pm0 init` workflow.
- Create `skills/pm0/reference/analyze.md`: `/pm0 analyze <surface>` workflow.
- Create `skills/pm0/reference/discuss.md`: `/pm0 discuss <surface-or-proposal>` workflow.
- Create `skills/pm0/reference/build.md`: `/pm0 build <proposal>` workflow.
- Create `skills/pm0/reference/handoff.md`: `/pm0 handoff <proposal>` workflow.
- Create `skills/pm0/reference/github-ci.md`: optional GitHub CI workflow.
- Create `skills/pm0/scripts/scaffold-pm0.mjs`: deterministic `.pm0` scaffold script.
- Create `skills/pm0/scripts/product-ci.mjs`: static PR artifact checker.
- Create `scripts/sync-harness-skills.mjs`: copies canonical skill into harness directories.
- Create `tests/scaffold-pm0.test.mjs`: tests scaffold behavior.
- Create `tests/product-ci.test.mjs`: tests CI behavior.
- Create `tests/skill-content.test.mjs`: tests public skill content constraints.

Harness copy targets:

- `.agents/skills/pm0/`
- `.claude/skills/pm0/`
- `.cursor/skills/pm0/`
- `.gemini/skills/pm0/`
- `.github/skills/pm0/`
- `.kiro/skills/pm0/`
- `.opencode/skills/pm0/`
- `.pi/skills/pm0/`
- `.qoder/skills/pm0/`
- `.rovodev/skills/pm0/`
- `.trae-cn/skills/pm0/`
- `.trae/skills/pm0/`

## Task 1: Add Node Test Harness

**Files:**
- Create: `package.json`
- Create: `tests/`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "pm0",
  "version": "0.1.0",
  "type": "module",
  "private": false,
  "description": "Product memory for AI agents.",
  "license": "MIT",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "sync:harnesses": "node scripts/sync-harness-skills.mjs"
  }
}
```

- [ ] **Step 2: Verify Node is available**

Run: `node --version`

Expected: prints a Node.js version and exits 0.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "Add Node test harness"
```

## Task 2: Test `.pm0` Scaffolding Before Implementation

**Files:**
- Create: `tests/scaffold-pm0.test.mjs`
- Task 3 creates: `skills/pm0/scripts/scaffold-pm0.mjs`

- [ ] **Step 1: Write failing scaffold tests**

Create `tests/scaffold-pm0.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { scaffoldPm0 } from "../skills/pm0/scripts/scaffold-pm0.mjs";

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

test("scaffoldPm0 creates the base PM0 memory tree", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-scaffold-"));
  try {
    const result = await scaffoldPm0({
      root,
      productName: "Acme Analytics",
      productOneLiner: "Analytics for founder-led SaaS teams.",
      surfaces: ["onboarding", "pricing"]
    });

    assert.deepEqual(result.created.sort(), [
      ".pm0/contexts",
      ".pm0/project.md",
      ".pm0/proposals",
      ".pm0/prds",
      ".pm0/surfaces",
      ".pm0/surfaces/index.md"
    ].sort());

    assert.equal(await exists(path.join(root, ".pm0/project.md")), true);
    assert.equal(await exists(path.join(root, ".pm0/contexts")), true);
    assert.equal(await exists(path.join(root, ".pm0/surfaces/index.md")), true);
    assert.equal(await exists(path.join(root, ".pm0/proposals")), true);
    assert.equal(await exists(path.join(root, ".pm0/prds")), true);

    const project = await readFile(path.join(root, ".pm0/project.md"), "utf8");
    assert.match(project, /^# Acme Analytics/m);
    assert.match(project, /Analytics for founder-led SaaS teams\./);
    assert.match(project, /## Assumptions To Confirm/);

    const index = await readFile(path.join(root, ".pm0/surfaces/index.md"), "utf8");
    assert.match(index, /- `onboarding`/);
    assert.match(index, /- `pricing`/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("scaffoldPm0 does not overwrite existing user memory", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-scaffold-"));
  try {
    await scaffoldPm0({ root, productName: "First Name", surfaces: ["onboarding"] });
    await scaffoldPm0({ root, productName: "Second Name", surfaces: ["billing"] });

    const project = await readFile(path.join(root, ".pm0/project.md"), "utf8");
    const index = await readFile(path.join(root, ".pm0/surfaces/index.md"), "utf8");

    assert.match(project, /^# First Name/m);
    assert.doesNotMatch(project, /^# Second Name/m);
    assert.match(index, /- `onboarding`/);
    assert.doesNotMatch(index, /- `billing`/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run scaffold tests to verify RED**

Run: `npm test -- tests/scaffold-pm0.test.mjs`

Expected: FAIL with an import/module-not-found error for `skills/pm0/scripts/scaffold-pm0.mjs`.

- [ ] **Step 3: Commit failing test**

```bash
git add tests/scaffold-pm0.test.mjs
git commit -m "Test PM0 scaffolding"
```

## Task 3: Implement `.pm0` Scaffolding

**Files:**
- Create: `skills/pm0/scripts/scaffold-pm0.mjs`

- [ ] **Step 1: Create scaffold script**

Create `skills/pm0/scripts/scaffold-pm0.mjs`:

```js
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeSurface(surface) {
  return String(surface || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectTemplate({ productName, productOneLiner }) {
  const name = productName || "Product";
  const oneLiner = productOneLiner || "Unverified: product one-liner needs founder confirmation.";
  return `# ${name}

## One-Liner

${oneLiner}

## Target Users

- Unverified: confirm primary user segment.

## Problem

- Unverified: confirm the painful product problem PM0 should preserve.

## Business Model

- Unverified: confirm business model.

## Current Stage

- Unverified: confirm current product stage.

## Current Goals

- Unverified: confirm near-term product goals.

## Product Principles

- Keep product context close to the code.
- Prefer small, reversible product changes.
- Treat external sources as evidence, not truth.

## Assumptions To Confirm

- Product name
- Target users
- Important product surfaces
- Success metrics
`;
}

function surfaceIndexTemplate(surfaces) {
  const normalized = surfaces.map(normalizeSurface).filter(Boolean);
  const lines = normalized.length
    ? normalized.map((surface) => `- \`${surface}\`: Unverified surface detected during init.`)
    : ["- Unverified: add product surfaces such as `onboarding`, `pricing`, or `dashboard`."];

  return `# Product Surfaces

Each surface is a product area or flow with durable memory.

${lines.join("\n")}
`;
}

export async function scaffoldPm0(options = {}) {
  const root = options.root || process.cwd();
  const pm0Root = path.join(root, ".pm0");
  const created = [];

  for (const dir of ["contexts", "surfaces", "proposals", "prds"]) {
    const dirPath = path.join(pm0Root, dir);
    if (!(await pathExists(dirPath))) {
      await mkdir(dirPath, { recursive: true });
      created.push(path.posix.join(".pm0", dir));
    }
  }

  const projectPath = path.join(pm0Root, "project.md");
  if (!(await pathExists(projectPath))) {
    await writeFile(projectPath, projectTemplate(options), "utf8");
    created.push(".pm0/project.md");
  }

  const indexPath = path.join(pm0Root, "surfaces", "index.md");
  if (!(await pathExists(indexPath))) {
    await writeFile(indexPath, surfaceIndexTemplate(options.surfaces || []), "utf8");
    created.push(".pm0/surfaces/index.md");
  }

  return { root, created };
}

async function main() {
  const args = process.argv.slice(2);
  const productNameIndex = args.indexOf("--product-name");
  const oneLinerIndex = args.indexOf("--one-liner");
  const surfacesIndex = args.indexOf("--surfaces");

  const result = await scaffoldPm0({
    root: process.cwd(),
    productName: productNameIndex >= 0 ? args[productNameIndex + 1] : undefined,
    productOneLiner: oneLinerIndex >= 0 ? args[oneLinerIndex + 1] : undefined,
    surfaces: surfacesIndex >= 0 ? args[surfacesIndex + 1].split(",") : []
  });

  console.log(JSON.stringify(result, null, 2));
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Run scaffold tests to verify GREEN**

Run: `npm test -- tests/scaffold-pm0.test.mjs`

Expected: PASS for both tests.

- [ ] **Step 3: Commit**

```bash
git add skills/pm0/scripts/scaffold-pm0.mjs tests/scaffold-pm0.test.mjs
git commit -m "Implement PM0 scaffold script"
```

## Task 4: Test Optional GitHub CI Script Before Implementation

**Files:**
- Create: `tests/product-ci.test.mjs`
- Task 5 creates: `skills/pm0/scripts/product-ci.mjs`

- [ ] **Step 1: Write failing CI tests**

Create `tests/product-ci.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { runProductCi } from "../skills/pm0/scripts/product-ci.mjs";

async function write(root, relativePath, content) {
  const fullPath = path.join(root, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf8");
}

test("runProductCi warns when a product PR lacks PM0 artifact links", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await write(root, ".pm0/surfaces/onboarding.md", "# Onboarding\n");
    const result = await runProductCi({
      root,
      changedFiles: ["apps/web/src/onboarding/page.tsx"],
      prBody: "Improve the first run experience."
    });

    assert.equal(result.result, "warning");
    assert.equal(result.findings.length, 1);
    assert.match(result.findings[0].message, /proposal or PRD/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runProductCi passes when PR links an existing PM0 proposal", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await write(root, ".pm0/surfaces/onboarding.md", "# Onboarding\n");
    await write(root, ".pm0/proposals/2026-05-23-onboarding-empty-state.md", "# Proposal\n");

    const result = await runProductCi({
      root,
      changedFiles: ["apps/web/src/onboarding/page.tsx"],
      prBody: "PM0 Proposal: .pm0/proposals/2026-05-23-onboarding-empty-state.md"
    });

    assert.equal(result.result, "pass");
    assert.deepEqual(result.findings, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runProductCi is informational when no product surface is inferable", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await write(root, ".pm0/surfaces/onboarding.md", "# Onboarding\n");

    const result = await runProductCi({
      root,
      changedFiles: ["scripts/release.mjs"],
      prBody: "Release maintenance."
    });

    assert.equal(result.result, "pass");
    assert.deepEqual(result.findings, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run CI tests to verify RED**

Run: `npm test -- tests/product-ci.test.mjs`

Expected: FAIL with an import/module-not-found error for `skills/pm0/scripts/product-ci.mjs`.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/product-ci.test.mjs
git commit -m "Test PM0 product CI"
```

## Task 5: Implement Optional GitHub CI Script

**Files:**
- Create: `skills/pm0/scripts/product-ci.mjs`

- [ ] **Step 1: Create product CI script**

Create `skills/pm0/scripts/product-ci.mjs`:

```js
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdownFiles(dir) {
  if (!(await pathExists(dir))) {
    return [];
  }
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);
}

function slugFromFile(fileName) {
  return fileName.replace(/\.md$/, "");
}

function inferSurface(changedFiles, surfaceSlugs) {
  for (const surface of surfaceSlugs) {
    if (changedFiles.some((file) => file.toLowerCase().includes(surface))) {
      return surface;
    }
  }
  return null;
}

function extractPm0Links(prBody) {
  const links = [];
  const pattern = /\.pm0\/(?:proposals|prds)\/[A-Za-z0-9._/-]+\.md/g;
  for (const match of String(prBody || "").matchAll(pattern)) {
    links.push(match[0]);
  }
  return links;
}

export async function runProductCi({ root = process.cwd(), changedFiles = [], prBody = "" } = {}) {
  const surfaceFiles = await listMarkdownFiles(path.join(root, ".pm0", "surfaces"));
  const surfaceSlugs = surfaceFiles
    .map(slugFromFile)
    .filter((slug) => slug !== "index");

  const inferredSurface = inferSurface(changedFiles, surfaceSlugs);
  const links = extractPm0Links(prBody);
  const findings = [];

  if (!inferredSurface) {
    return { result: "pass", surface: null, findings };
  }

  if (links.length === 0) {
    findings.push({
      level: "warning",
      message: `Changes appear to affect the ${inferredSurface} surface, but the PR body does not link a PM0 proposal or PRD.`
    });
  }

  for (const link of links) {
    if (!(await pathExists(path.join(root, link)))) {
      findings.push({
        level: "warning",
        message: `Linked PM0 artifact does not exist: ${link}`
      });
    }
  }

  return {
    result: findings.length ? "warning" : "pass",
    surface: inferredSurface,
    findings
  };
}

async function main() {
  const changedFiles = (process.env.PM0_CHANGED_FILES || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const prBody = process.env.PM0_PR_BODY || "";
  const result = await runProductCi({ changedFiles, prBody });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Run CI tests to verify GREEN**

Run: `npm test -- tests/product-ci.test.mjs`

Expected: PASS for all three tests.

- [ ] **Step 3: Commit**

```bash
git add skills/pm0/scripts/product-ci.mjs tests/product-ci.test.mjs
git commit -m "Implement PM0 product CI script"
```

## Task 6: Create Canonical PM0 Skill And References

**Files:**
- Create: `skills/pm0/SKILL.md`
- Create: `skills/pm0/reference/init.md`
- Create: `skills/pm0/reference/analyze.md`
- Create: `skills/pm0/reference/discuss.md`
- Create: `skills/pm0/reference/build.md`
- Create: `skills/pm0/reference/handoff.md`
- Create: `skills/pm0/reference/github-ci.md`

- [ ] **Step 1: Create `skills/pm0/SKILL.md`**

The file must include this frontmatter and routing table:

```markdown
---
name: pm0
description: Use when the user invokes /pm0 or asks for product memory, proposal shaping, PRD handoff, product-surface analysis, founder product management, or repo-native product context for AI agents.
argument-hint: "[command] [surface-or-proposal]"
user-invocable: true
allowed-tools:
  - Bash(node skills/pm0/scripts/scaffold-pm0.mjs *)
  - Bash(node skills/pm0/scripts/product-ci.mjs *)
---

PM0 is product memory for AI agents. It keeps product context in `.pm0/` so agents can understand a product surface before changing it.

## Setup

Before doing PM0 work:

1. Read `.pm0/project.md` if it exists.
2. Read relevant files from `.pm0/contexts/` when the user or surface points to them.
3. Read `.pm0/surfaces/{surface}.md` before analyzing, discussing, building, or handing off that surface.
4. Treat repo memory as durable product truth. Treat external sources as evidence.
5. Do not paste raw tickets, transcripts, emails, or replay data into `.pm0/`.

If `.pm0/` does not exist and the command is not `init`, tell the user to run `/pm0 init` first, unless they explicitly want to discuss PM0 itself.

## Commands

| Command | Job | Reference |
| --- | --- | --- |
| `/pm0` | Show command menu | This file |
| `/pm0 init` | Create `.pm0` product memory | `reference/init.md` |
| `/pm0 analyze <surface>` | Analyze one product area | `reference/analyze.md` |
| `/pm0 discuss <surface-or-proposal>` | Create or continue a proposal | `reference/discuss.md` |
| `/pm0 build <proposal>` | Build the smallest useful change | `reference/build.md` |
| `/pm0 handoff <proposal>` | Accept for engineering, reject, or continue discussion | `reference/handoff.md` |

## Routing

- No argument: show the command menu and ask what the user wants to do.
- First word is `init`: read `reference/init.md` and follow it.
- First word is `analyze`: read `reference/analyze.md` and follow it.
- First word is `discuss`: read `reference/discuss.md` and follow it.
- First word is `build`: read `reference/build.md` and follow it.
- First word is `handoff`: read `reference/handoff.md` and follow it.
- Any other argument: treat it as `/pm0 discuss <argument>` after confirming the intended product surface or proposal.

Use only space-separated subcommands.
Do not expose `/pm0 prd` or `/pm0 review`.
```

- [ ] **Step 2: Create `reference/init.md`**

Include sections: Purpose, Reads, Writes, Context Selection, GitHub CI Offer, Output. Require the scaffold script for deterministic folders. State that `/pm0 init` may create selected context files but must not create every context file by default.

- [ ] **Step 3: Create `reference/analyze.md`**

Include sections: Purpose, Required Input, Read Order, Surface Template, Evidence Rules, Output. Make clear that this analyzes product behavior, not code quality.

- [ ] **Step 4: Create `reference/discuss.md`**

Include sections: Purpose, Required Input, Read Order, Tool And Integration Routing, Proposal Template, End States. Include the routing examples from the spec for login, onboarding, pricing, regression, and competitor questions.

- [ ] **Step 5: Create `reference/build.md`**

Include sections: Purpose, Required Input, Read Order, Build Rules, Proposal Build Notes, Output. State that the host agent implements code, while PM0 supplies product context and constraints.

- [ ] **Step 6: Create `reference/handoff.md`**

Include sections: Purpose, Required Input, Outcomes, PRD Template, Surface Updates, GitHub PR Description. The only outcomes are accepted for engineering, rejected, and needs more discussion.

- [ ] **Step 7: Create `reference/github-ci.md`**

Include sections: Purpose, Trigger, Inputs, Checks, Output, Limitations. State that CI is optional, warning-oriented, and not exposed as `/pm0 review`.

- [ ] **Step 8: Run content grep**

Run:

```bash
rg -n "PM0 Cloud|PM0-managed|PM0-owned|cloud account|config\\.yml|/pm0:init|/pm0 prd|/pm0 review" skills/pm0 || true
```

Expected: no matches except `/pm0 prd` and `/pm0 review` only if they appear in a "Do not expose" sentence.

- [ ] **Step 9: Commit**

```bash
git add skills/pm0/SKILL.md skills/pm0/reference
git commit -m "Add canonical PM0 skill"
```

## Task 7: Test Skill Content Constraints

**Files:**
- Create: `tests/skill-content.test.mjs`

- [ ] **Step 1: Create skill content tests**

Create `tests/skill-content.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

async function read(relativePath) {
  return readFile(path.join(process.cwd(), relativePath), "utf8");
}

test("PM0 skill exposes the approved commands", async () => {
  const skill = await read("skills/pm0/SKILL.md");
  for (const command of [
    "/pm0 init",
    "/pm0 analyze <surface>",
    "/pm0 discuss <surface-or-proposal>",
    "/pm0 build <proposal>",
    "/pm0 handoff <proposal>"
  ]) {
    assert.match(skill, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("PM0 skill does not expose removed command forms", async () => {
  const files = [
    "skills/pm0/SKILL.md",
    ...(await readdir("skills/pm0/reference")).map((file) => `skills/pm0/reference/${file}`)
  ];
  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(text, /\/pm0:init/);
  }
});

test("handoff reference has exactly three outcomes", async () => {
  const handoff = await read("skills/pm0/reference/handoff.md");
  assert.match(handoff, /accepted for engineering/);
  assert.match(handoff, /rejected/);
  assert.match(handoff, /needs more discussion/);
  assert.doesNotMatch(handoff, /accepted and already built/);
  assert.doesNotMatch(handoff, /\bkilled\b/);
});
```

- [ ] **Step 2: Run skill content tests**

Run: `npm test -- tests/skill-content.test.mjs`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/skill-content.test.mjs
git commit -m "Test PM0 skill content"
```

## Task 8: Add Harness Sync Script And Copies

**Files:**
- Create: `scripts/sync-harness-skills.mjs`
- Create generated copies under harness directories.

- [ ] **Step 1: Create sync script**

Create `scripts/sync-harness-skills.mjs`:

```js
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const targets = [
  ".agents/skills/pm0",
  ".claude/skills/pm0",
  ".cursor/skills/pm0",
  ".gemini/skills/pm0",
  ".github/skills/pm0",
  ".kiro/skills/pm0",
  ".opencode/skills/pm0",
  ".pi/skills/pm0",
  ".qoder/skills/pm0",
  ".rovodev/skills/pm0",
  ".trae-cn/skills/pm0",
  ".trae/skills/pm0"
];

const source = path.join(process.cwd(), "skills", "pm0");

for (const target of targets) {
  const destination = path.join(process.cwd(), target);
  await mkdir(path.dirname(destination), { recursive: true });
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
  console.log(`synced ${target}`);
}
```

- [ ] **Step 2: Run harness sync**

Run: `npm run sync:harnesses`

Expected: one `synced ...` line for each harness directory.

- [ ] **Step 3: Verify copied skill files match canonical source**

Run:

```bash
diff -qr skills/pm0 .agents/skills/pm0
diff -qr skills/pm0 .claude/skills/pm0
diff -qr skills/pm0 .cursor/skills/pm0
diff -qr skills/pm0 .gemini/skills/pm0
diff -qr skills/pm0 .github/skills/pm0
diff -qr skills/pm0 .opencode/skills/pm0
```

Expected: no output from each `diff`.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-harness-skills.mjs .agents .claude .cursor .gemini .github .kiro .opencode .pi .qoder .rovodev .trae-cn .trae
git commit -m "Add PM0 harness skill copies"
```

## Task 9: Add Plugin Manifests

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.codex-plugin/plugin.json`
- Create: `.cursor-plugin/plugin.json`

- [ ] **Step 1: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "pm0",
  "description": "Product memory for AI agents: repo-native surfaces, proposals, PRDs, and founder product workflows.",
  "version": "0.1.0",
  "author": {
    "name": "PM0"
  },
  "homepage": "https://github.com/omarkhatib/pm0",
  "repository": "https://github.com/omarkhatib/pm0",
  "license": "MIT",
  "keywords": [
    "product-memory",
    "skills",
    "founders",
    "prd",
    "proposals"
  ],
  "skills": "./.claude/skills/"
}
```

- [ ] **Step 2: Create `.codex-plugin/plugin.json`**

```json
{
  "name": "pm0",
  "version": "0.1.0",
  "description": "Product memory for AI agents: repo-native surfaces, proposals, PRDs, and founder product workflows.",
  "author": {
    "name": "PM0"
  },
  "homepage": "https://github.com/omarkhatib/pm0",
  "repository": "https://github.com/omarkhatib/pm0",
  "license": "MIT",
  "keywords": [
    "product-memory",
    "skills",
    "founders",
    "prd",
    "proposals"
  ],
  "skills": "./.agents/skills/",
  "interface": {
    "displayName": "PM0",
    "shortDescription": "Product memory, proposals, and PRDs for AI agents",
    "longDescription": "Use PM0 to create repo-native product memory, analyze product surfaces, shape founder proposals, build from product context, and generate PRDs during handoff.",
    "developerName": "PM0",
    "category": "Coding",
    "capabilities": [
      "Interactive",
      "Read",
      "Write"
    ],
    "defaultPrompt": [
      "/pm0 init",
      "/pm0 discuss onboarding"
    ],
    "websiteURL": "https://github.com/omarkhatib/pm0",
    "brandColor": "#111827",
    "screenshots": []
  }
}
```

- [ ] **Step 3: Create `.cursor-plugin/plugin.json`**

```json
{
  "name": "pm0",
  "description": "Product memory for AI agents: repo-native surfaces, proposals, PRDs, and founder product workflows.",
  "version": "0.1.0",
  "author": {
    "name": "PM0"
  },
  "homepage": "https://github.com/omarkhatib/pm0",
  "repository": "https://github.com/omarkhatib/pm0",
  "license": "MIT",
  "keywords": [
    "product-memory",
    "skills",
    "founders",
    "prd",
    "proposals"
  ],
  "skills": "./.cursor/skills/"
}
```

- [ ] **Step 4: Validate JSON**

Run:

```bash
node -e "for (const f of ['.claude-plugin/plugin.json','.codex-plugin/plugin.json','.cursor-plugin/plugin.json']) JSON.parse(require('fs').readFileSync(f,'utf8'))"
```

Expected: exit 0 with no output.

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/plugin.json .codex-plugin/plugin.json .cursor-plugin/plugin.json
git commit -m "Add PM0 plugin manifests"
```

## Task 10: Add Public README

**Files:**
- Create or replace: `README.md`

- [ ] **Step 1: Create README**

Create `README.md` with these sections:

````markdown
# PM0

Product memory for AI agents.

PM0 helps founders and product-minded builders keep product context next to the code, then use that context before changing a product surface.

## Why PM0

Coding agents can change code quickly, but product context is usually scattered across founder memory, support tickets, analytics, interviews, Slack, GitHub, and old PRDs.

PM0 makes that context explicit:

- each product area has durable surface memory
- each new idea starts as a proposal
- accepted proposals become PRDs during handoff
- rejected proposals are summarized back into the surface

## Commands

```text
/pm0
/pm0 init
/pm0 analyze onboarding
/pm0 discuss onboarding
/pm0 build 2026-05-23-onboarding-empty-state
/pm0 handoff 2026-05-23-onboarding-empty-state
```

## Memory Structure

```text
.pm0/
  project.md
  contexts/
  surfaces/
  proposals/
  prds/
```

## Basic Workflow

1. Run `/pm0 init` to create product memory.
2. Run `/pm0 analyze <surface>` for a product area such as onboarding or pricing.
3. Run `/pm0 discuss <surface>` to turn a founder idea or user problem into a proposal.
4. Run `/pm0 build <proposal>` to ask the host coding agent for the smallest useful change.
5. Run `/pm0 handoff <proposal>` to accept for engineering, reject, or continue discussion.

## Installation

PM0 follows the same packaging style as the local Superpowers and Impeccable examples in this repository. Install the skill directory for your agent harness, or use the plugin manifest when your harness supports plugins.

### Codex

Use the Codex plugin manifest in `.codex-plugin/plugin.json`, or copy `.agents/skills/pm0` into a repo-local or user-wide Codex skills directory.

### Claude Code

Use the Claude plugin manifest in `.claude-plugin/plugin.json`, or copy `.claude/skills/pm0` into your Claude skills directory.

### Cursor

Copy `.cursor/skills/pm0` into your project or user Cursor skills directory.

### Other Harnesses

PM0 includes harness copies for `.gemini`, `.github`, `.kiro`, `.opencode`, `.pi`, `.qoder`, `.rovodev`, `.trae-cn`, and `.trae`.

## Optional GitHub CI

PM0 can add a warning-oriented GitHub CI check during `/pm0 init`. The check looks for product-changing PRs that should link a PM0 proposal or PRD.

## Design References

PM0's packaging follows:

- `examples/impeccable-main` for one skill with command references
- `examples/superpowers-main` for plugin manifests and cross-harness packaging
````

- [ ] **Step 2: Verify README does not mention removed public terms**

Run:

```bash
rg -n "PM0 Cloud|PM0-managed|PM0-owned|cloud account|config\\.yml|/pm0:init" README.md || true
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add PM0 README"
```

## Task 11: Final Verification

**Files:**
- All implementation files.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run harness sync and diff checks**

Run:

```bash
npm run sync:harnesses
diff -qr skills/pm0 .agents/skills/pm0
diff -qr skills/pm0 .claude/skills/pm0
diff -qr skills/pm0 .cursor/skills/pm0
diff -qr skills/pm0 .gemini/skills/pm0
diff -qr skills/pm0 .github/skills/pm0
diff -qr skills/pm0 .opencode/skills/pm0
```

Expected: sync prints one line per harness, and `diff` prints no output.

- [ ] **Step 3: Run public language scan**

Run:

```bash
rg -n "PM0 Cloud|PM0-managed|PM0-owned|cloud account|config\\.yml|/pm0:init" README.md skills .agents .claude .cursor .gemini .github .opencode .codex-plugin .claude-plugin .cursor-plugin || true
```

Expected: no output.

- [ ] **Step 4: Inspect git status**

Run: `git status --short`

Expected: only intended implementation files are modified or added.

- [ ] **Step 5: Commit final verification fixes if any**

If Task 11 changes generated harness copies or fixes content, commit:

```bash
git add README.md package.json skills scripts tests .agents .claude .cursor .gemini .github .kiro .opencode .pi .qoder .rovodev .trae-cn .trae .claude-plugin .codex-plugin .cursor-plugin
git commit -m "Verify PM0 skill pack"
```
