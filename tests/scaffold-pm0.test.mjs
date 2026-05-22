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
