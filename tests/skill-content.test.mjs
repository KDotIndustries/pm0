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
  const discuss = await read("skills/pm0/reference/discuss.md");
  const readme = await read("README.md");

  assert.match(skill, /First word is `context`/);
  assert.match(context, /web search/i);
  assert.match(context, /available MCP/i);
  assert.match(context, /PostHog/);
  assert.match(context, /Intercom/);
  assert.match(context, /Granola/);
  assert.match(context, /Do not use every integration/i);
  assert.match(context, /External sources are evidence/i);
  assert.match(context, /Do not store raw tickets/i);
  assert.match(context, /dated names for point-in-time/i);
  assert.match(discuss, /Granola or interview-note summaries/);
  assert.match(readme, /PM0 does not install or manage those integrations/);
});

test("context reference requires founder-grade artifact templates", async () => {
  const context = await read("skills/pm0/reference/context.md");

  assert.match(context, /Quality Bar/i);
  assert.match(context, /Context Type Index/i);
  assert.match(context, /A competitive landscape must compare competitors/i);
  assert.match(context, /Competitor Comparison/i);
  assert.match(context, /Threat Ranking/i);
  assert.match(context, /Success Metrics Matrix/i);
  assert.match(context, /Pricing And Packaging Matrix/i);
  assert.match(context, /Segment Matrix/i);
  assert.match(context, /Positioning Matrix/i);
  assert.match(context, /Roadmap Matrix/i);
  assert.match(context, /GTM Motion Matrix/i);
  assert.match(context, /MVP Scope Matrix/i);
  assert.match(context, /Workflow Breakdown/i);
  assert.match(context, /Research Plan Matrix/i);
  assert.match(context, /Do not ship a weak artifact/i);
});

test("init reuses context guidance for generated context files", async () => {
  const init = await read("skills/pm0/reference/init.md");
  const context = await read("skills/pm0/reference/context.md");

  assert.match(init, /reference\/context\.md/);
  assert.match(init, /quality bar/i);
  assert.match(init, /artifact-specific guidance/i);
  assert.match(init, /Do not create thin placeholder context files/i);
  assert.match(init, /two to five researched context files by default/i);
  assert.match(init, /web search and relevant available MCP\/connectors/i);
  assert.match(context, /Init should normally produce two to five context files/i);
});

test("analyze defines the durable surface template", async () => {
  const analyze = await read("skills/pm0/reference/analyze.md");

  for (const section of [
    "Status: Draft",
    "Last updated: YYYY-MM-DD",
    "## Product Role",
    "## Target Users / Jobs",
    "## Current Behavior",
    "## Product Principles",
    "## Known Problems / Tensions",
    "## Metrics / Signals",
    "## Active Proposals",
    "## Accepted PRDs",
    "## Rejected Proposals",
    "## Open Questions",
    "## Evidence",
    "## Agent Notes"
  ]) {
    assert.match(analyze, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(analyze, /durable source of truth for a product area/);
  assert.match(analyze, /not proposal drafts or mini-PRDs/);
  assert.match(analyze, /Do not store raw customer messages/);
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

test("discuss proposal template includes founder handoff readiness", async () => {
  const discuss = await read("skills/pm0/reference/discuss.md");

  for (const section of [
    "## Problem Or Opportunity",
    "## Why Now",
    "## Target Users Or Segment",
    "## Current Behavior",
    "## Desired Outcome",
    "## Evidence And Caveats",
    "## Proposed Scope",
    "## Non-Goals",
    "## Success Criteria",
    "## Risks And Tradeoffs",
    "## Open Questions",
    "## Build Notes",
    "## Handoff Readiness"
  ]) {
    assert.match(discuss, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const readinessItem of [
    "Problem is clear",
    "Target user is clear",
    "Scope is small enough for one engineering pass",
    "Acceptance criteria are testable",
    "Metrics or learning signal is defined",
    "Major open questions are resolved or explicitly accepted"
  ]) {
    assert.match(discuss, new RegExp(readinessItem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("handoff PRD template follows modern founder-to-engineering shape", async () => {
  const handoff = await read("skills/pm0/reference/handoff.md");

  for (const section of [
    "## Product Intent",
    "## Background And Strategic Fit",
    "## Problem",
    "## Users And Jobs",
    "## Current Behavior",
    "## Desired Behavior",
    "## Evidence",
    "## Requirements",
    "## User Flows / UX Notes",
    "## Scope",
    "## Non-Goals",
    "## Metrics And Instrumentation",
    "## Rollout / Migration Notes",
    "## Risks, Tradeoffs, And Assumptions",
    "## Open Questions",
    "## Engineering Notes",
    "## Verification Expectations"
  ]) {
    assert.match(handoff, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(handoff, /\| Requirement \| Priority \| User Value \| Acceptance Criteria \| Notes \|/);
  assert.match(handoff, /The `Requirements` table is mandatory/);
  assert.match(handoff, /Do not prescribe architecture unless the product constraint requires it/);
  assert.match(handoff, /needs more discussion/);
});

test("handoff validates proposal readiness before PRD creation", async () => {
  const handoff = await read("skills/pm0/reference/handoff.md");

  assert.match(handoff, /Proposal Readiness Check/);
  assert.match(handoff, /Handoff Readiness/);
  assert.match(handoff, /validate the content, not just the checkboxes/);
  assert.match(handoff, /Accept for engineering only when/);
  assert.match(handoff, /If any item is missing or vague, choose `needs more discussion`/);
  assert.match(handoff, /do not create a PRD/);
});

test("commands update surfaces through the shared surface template", async () => {
  const discuss = await read("skills/pm0/reference/discuss.md");
  const handoff = await read("skills/pm0/reference/handoff.md");
  const build = await read("skills/pm0/reference/build.md");

  assert.match(discuss, /surface template from `reference\/analyze\.md`/);
  assert.match(discuss, /active proposal links/);
  assert.match(discuss, /metrics or signals/);
  assert.match(discuss, /evidence caveats/);

  assert.match(handoff, /surface template from `reference\/analyze\.md`/);
  assert.match(handoff, /Accepted PRDs/);
  assert.match(handoff, /Rejected Proposals/);
  assert.match(handoff, /metrics\/signals/);

  assert.match(build, /surface template from `reference\/analyze\.md`/);
  assert.match(build, /current behavior/);
  assert.match(build, /metrics\/signals/);
  assert.match(build, /durable evidence/);
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

test("README includes skills install command", async () => {
  const readme = await read("README.md");

  assert.match(readme, /npx skills add KDotIndustries\/pm0/);
});

test("README positions PM0 for founders and early-stage teams", async () => {
  const readme = await read("README.md");

  assert.match(readme, /Your AI product manager for founder-led teams/);
  assert.match(readme, /\[pm0\.app\]\(https:\/\/pm0\.app\/\)/);
  assert.match(readme, /early-stage startups without a full-time product manager/);
  assert.match(readme, /PMs and operators who want to prototype a product direction without starting from code/);
  assert.match(readme, /product-minded engineers/);
  assert.match(readme, /Use PM0 when you want the agent to do product work before code work/);
  assert.doesNotMatch(readme, /Future Direction/);
});

test("README explains careful prototype use for non-coders", async () => {
  const readme = await read("README.md");

  assert.match(readme, /does not write code every day/);
  assert.match(readme, /smallest useful prototype or product change/);
  assert.match(readme, /not a replacement for engineering review/);
  assert.match(readme, /testable earlier, with the context attached/);
  assert.match(readme, /generic prototyping tool/);
});

test("README emphasizes PM0 context templates", async () => {
  const readme = await read("README.md");

  assert.match(readme, /opinionated context templates/);
  assert.match(readme, /target users and ICP/);
  assert.match(readme, /Jobs To Be Done/);
  assert.match(readme, /GTM/);
  assert.match(readme, /MVP framing/);
  assert.match(readme, /North Star metric/);
  assert.match(readme, /input metrics, guardrails, and instrumentation gaps/);
});

test("README explains proposal discussion loop", async () => {
  const readme = await read("README.md");

  assert.match(readme, /\/pm0 discuss 2026-05-23-onboarding-empty-state/);
  assert.match(readme, /Run `\/pm0 discuss <proposal>`/);
  assert.match(readme, /stakeholder feedback/);
  assert.match(readme, /Proposals are meant to be shared and revisited/);
  assert.match(readme, /update the product judgment before building or handing it off/);
});

test("README thanks public inspiration projects", async () => {
  const readme = await read("README.md");

  assert.match(readme, /Inspiration And Thanks/);
  assert.match(readme, /practical, portable, and useful in real development work/);
  assert.match(readme, /Thank you to the maintainers and contributors/);
  assert.match(readme, /\[Impeccable\]\(https:\/\/github\.com\/pbakaus\/impeccable\)/);
  assert.match(readme, /\[Superpowers\]\(https:\/\/github\.com\/obra\/superpowers\)/);
  assert.doesNotMatch(readme, /examples\/impeccable-main/);
  assert.doesNotMatch(readme, /examples\/superpowers-main/);
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

test("GitHub CI guidance includes PM0 memory validation", async () => {
  const readme = await read("README.md");
  const init = await read("skills/pm0/reference/init.md");
  const githubCi = await read("skills/pm0/reference/github-ci.md");
  const productCi = await read("skills/pm0/scripts/product-ci.mjs");

  assert.match(readme, /validates PM0 memory shape/);
  assert.match(init, /validate-pm0-memory\.mjs/);
  assert.match(githubCi, /validate-pm0-memory\.mjs/);
  assert.match(githubCi, /scaffold placeholder residue/);
  assert.match(productCi, /validatePm0Memory/);
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
