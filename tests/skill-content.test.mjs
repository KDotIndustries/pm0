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
    "/pm0 context <topic>",
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
    "README.md",
    "skills/pm0/SKILL.md",
    ...(await readdir("skills/pm0/reference")).map((file) => `skills/pm0/reference/${file}`)
  ];
  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(text, /\/pm0:init/);
    assert.doesNotMatch(text, /\/pm0\s+review/);
    assert.doesNotMatch(text, /\/pm0\s+prd/);
  }
});

test("context reference supports focused tool-backed research", async () => {
  const skill = await read("skills/pm0/SKILL.md");
  const context = await read("skills/pm0/reference/context.md");

  assert.match(skill, /First word is `context`/);
  assert.match(context, /web search/i);
  assert.match(context, /available MCP/i);
  assert.match(context, /Do not use every integration/i);
  assert.match(context, /External sources are evidence/i);
  assert.match(context, /Do not store raw tickets/i);
  assert.match(context, /dated names for point-in-time/i);
});

test("handoff reference has exactly three outcomes", async () => {
  const handoff = await read("skills/pm0/reference/handoff.md");
  const outcomesSection = handoff.match(/## Outcomes\n\n[\s\S]*?\n\n(?=## )/);
  assert.ok(outcomesSection, "handoff reference includes an Outcomes section");

  const outcomes = [...outcomesSection[0].matchAll(/^- (.+)$/gm)].map(([, outcome]) => outcome);
  assert.deepEqual(outcomes, [
    "accepted for engineering",
    "rejected",
    "needs more discussion"
  ]);
});

test("skill guidance does not hard-code source-tree script paths", async () => {
  const files = [
    "skills/pm0/reference/init.md",
    "skills/pm0/reference/github-ci.md"
  ];

  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(text, /node skills\/pm0\/scripts\//);
    assert.match(text, /active PM0 skill directory|PM0 skill directory committed in the repository|installed PM0 skill directory/);
  }
});

test("README uses approved handoff wording", async () => {
  const readme = await read("README.md");
  assert.match(readme, /needs more discussion/);
  assert.doesNotMatch(readme, /continue discussion/);
});

test("GitHub CI workflow template exists and wires product-ci inputs", async () => {
  const template = await read("skills/pm0/templates/github-workflow.yml");
  assert.match(template, /pull_request:/);
  assert.match(template, /PM0_CHANGED_FILES/);
  assert.match(template, /PM0_PR_BODY/);
  assert.match(template, /PM0_SKILL_DIR/);
  assert.match(template, /PM0 product CI script not found/);
  assert.match(template, /node "\$PM0_SKILL_DIR\/scripts\/product-ci\.mjs"/);
});

test("agent CI templates use the shared PM0 product review prompt", async () => {
  const prompt = await read("skills/pm0/templates/product-review-prompt.md");
  assert.match(prompt, /founder-minded product manager/);
  assert.match(prompt, /\.pm0\/project\.md/);
  assert.match(prompt, /Do not review code style/);

  const claude = await read("skills/pm0/templates/github-workflow.claude.example.yml");
  assert.match(claude, /anthropics\/claude-code-action@v1/);
  assert.match(claude, /ANTHROPIC_API_KEY/);
  assert.match(claude, /PM0_PRODUCT_REVIEW_PROMPT/);

  const codex = await read("skills/pm0/templates/github-workflow.codex.example.yml");
  assert.match(codex, /openai\/codex-action@v1/);
  assert.match(codex, /OPENAI_API_KEY/);
  assert.match(codex, /PM0_PRODUCT_REVIEW_PROMPT/);
});

test("discuss guidance keeps proposals and surfaces as source of truth", async () => {
  const discuss = await read("skills/pm0/reference/discuss.md");
  assert.match(discuss, /source of truth/);
  assert.match(discuss, /internal run artifacts/i);
  assert.match(discuss, /update the proposal/i);
  assert.match(discuss, /update the surface/i);
});
