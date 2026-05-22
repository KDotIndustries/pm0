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
