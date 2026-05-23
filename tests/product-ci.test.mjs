import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runProductCi } from "../skills/pm0/scripts/product-ci.mjs";

const testFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testFilePath), "..");
const productCiScriptPath = path.join(repoRoot, "skills/pm0/scripts/product-ci.mjs");

async function write(root, relativePath, content) {
  const fullPath = path.join(root, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf8");
}

async function writeValidOnboardingSurface(root) {
  await write(root, ".pm0/project.md", "# Product\n");
  await write(root, ".pm0/surfaces/onboarding.md", `# Onboarding

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
None.

## Accepted PRDs
None.

## Rejected Proposals
None.

## Open Questions
None.

## Evidence
Repo routes and product copy.

## Agent Notes
Keep notes short.
`);
}

async function writeValidProposal(root) {
  await write(root, ".pm0/proposals/2026-05-23-onboarding-empty-state.md", `# Onboarding Empty State

Status: Draft
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
`);
}

test("runProductCi warns when a product PR lacks PM0 artifact links", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await writeValidOnboardingSurface(root);
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
    await writeValidOnboardingSurface(root);
    await writeValidProposal(root);

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

test("runProductCi warns when a linked PM0 artifact escapes proposal and PRD directories", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await writeValidOnboardingSurface(root);

    const result = await runProductCi({
      root,
      changedFiles: ["apps/web/src/onboarding/page.tsx"],
      prBody: "PM0 Proposal: .pm0/proposals/../surfaces/onboarding.md"
    });

    assert.equal(result.result, "warning");
    assert.equal(result.findings.length, 1);
    assert.match(result.findings[0].message, /Invalid PM0 artifact link/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runProductCi reports duplicate missing PM0 links once", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await writeValidOnboardingSurface(root);

    const result = await runProductCi({
      root,
      changedFiles: ["apps/web/src/onboarding/page.tsx"],
      prBody: "[.pm0/proposals/missing.md](.pm0/proposals/missing.md)"
    });

    assert.equal(result.result, "warning");
    assert.equal(result.findings.length, 1);
    assert.equal(result.findings[0].message, "Linked PM0 artifact does not exist: .pm0/proposals/missing.md");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runProductCi is informational when no product surface is inferable", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await writeValidOnboardingSurface(root);

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

test("runProductCi includes PM0 memory validator warnings", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await write(root, ".pm0/project.md", "# Product\n");
    await write(root, ".pm0/surfaces/index.md", "# Product Surfaces\n\n- Unverified: add product surfaces such as `onboarding`, `pricing`, or `dashboard`.\n");

    const result = await runProductCi({
      root,
      changedFiles: ["scripts/release.mjs"],
      prBody: "Release maintenance."
    });

    assert.equal(result.result, "warning");
    assert.equal(result.surface, null);
    assert.match(
      result.findings.map((finding) => finding.message).join("\n"),
      /Surface index\.md contains scaffold placeholder residue/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("runProductCi infers a product surface from PR body text", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await writeValidOnboardingSurface(root);

    const result = await runProductCi({
      root,
      changedFiles: ["apps/web/src/routes/start.tsx"],
      prBody: "This improves onboarding for new founders."
    });

    assert.equal(result.surface, "onboarding");
    assert.equal(result.result, "warning");
    assert.match(result.findings[0].message, /onboarding surface/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("product CI CLI emits GitHub annotations and step summary for warnings", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-cli-"));
  try {
    await writeValidOnboardingSurface(root);
    const summaryPath = path.join(root, "summary.md");

    const result = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [productCiScriptPath], {
        cwd: root,
        env: {
          ...process.env,
          PM0_CHANGED_FILES: "apps/web/src/onboarding/page.tsx",
          PM0_PR_BODY: "Improve onboarding.",
          GITHUB_STEP_SUMMARY: summaryPath
        }
      });
      let stdout = "";
      let stderr = "";

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.on("error", reject);
      child.on("close", (code) => {
        resolve({ code, stdout, stderr });
      });
    });

    assert.equal(result.code, 0);
    assert.match(result.stdout, /::warning title=PM0 product memory::/);
    assert.match(result.stdout, /"result": "warning"/);
    assert.equal(result.stderr, "");

    const summary = await readFile(summaryPath, "utf8");
    assert.match(summary, /## PM0 Product CI/);
    assert.match(summary, /Result: warning/);
    assert.match(summary, /Changes appear to affect the onboarding surface/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
