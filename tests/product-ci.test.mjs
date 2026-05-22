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

test("runProductCi warns when a linked PM0 artifact escapes proposal and PRD directories", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "pm0-ci-"));
  try {
    await write(root, ".pm0/surfaces/onboarding.md", "# Onboarding\n");

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
    await write(root, ".pm0/surfaces/onboarding.md", "# Onboarding\n");

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
