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
/pm0 context competitive landscape
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
2. Run `/pm0 context <topic>` when you want focused product context such as competitive landscape, pricing packages, target users, or design system.
3. Run `/pm0 analyze <surface>` for a product area such as onboarding or pricing.
4. Run `/pm0 discuss <surface>` to turn a founder idea or user problem into a proposal.
5. Run `/pm0 build <proposal>` to ask the host coding agent for the smallest useful change.
6. Run `/pm0 handoff <proposal>` to accept for engineering, reject, or mark as needs more discussion.

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

## Initialize Product Memory

From your product repository, run `/pm0 init` in your agent. The skill creates:

```text
.pm0/project.md
.pm0/contexts/
.pm0/surfaces/index.md
.pm0/proposals/
.pm0/prds/
```

The bundled scaffold script is also available if you want a deterministic setup step:

```bash
node <active PM0 skill directory>/scripts/scaffold-pm0.mjs \
  --product-name "Acme Analytics" \
  --one-liner "Analytics for founder-led SaaS teams." \
  --surfaces "onboarding,pricing,dashboard"
```

Use the PM0 skill directory for your harness, for example `.agents/skills/pm0` for Codex or `.claude/skills/pm0` for Claude Code.

## Build Product Context

Use `/pm0 context <topic>` for focused research-backed context after init. PM0 starts from repo memory and can use available tools such as web search, product URLs, screenshots, or connected MCPs when they are relevant and allowed by the current agent harness.

Examples:

```text
/pm0 context target users
/pm0 context competitive landscape
/pm0 context pricing packages
/pm0 context design system
```

Founder-grade context should be structured enough to support a decision. For example, competitive landscape should discover competitors, compare them in tables, rank threats, and call out differentiation opportunities. Pricing context should compare packages, expose contradictions, and benchmark competitors. Success metrics context should define metrics, baselines, targets, instrumentation, and caveats.

PM0 stores durable summaries in `.pm0/contexts/`, not raw tickets, transcripts, emails, analytics exports, or replay data.

## Optional GitHub CI

PM0 can add optional GitHub CI during `/pm0 init`.

- Local check: warning-oriented, no hosted agent, validates that product-changing PRs link a PM0 proposal or PRD.
- Claude example: uses the repository owner's Claude GitHub Action setup and PM0's shared product-review prompt.
- Codex example: uses the repository owner's Codex GitHub Action setup and PM0's shared product-review prompt.

Install the local, no-agent check:

```bash
node <active PM0 skill directory>/scripts/install-github-ci.mjs \
  --mode local \
  --skill-dir .agents/skills/pm0
```

Install the Claude-backed example:

```bash
node <active PM0 skill directory>/scripts/install-github-ci.mjs \
  --mode claude \
  --skill-dir .claude/skills/pm0
```

This expects the repository owner to configure the Claude GitHub Action and `ANTHROPIC_API_KEY`.

Install the Codex-backed example:

```bash
node <active PM0 skill directory>/scripts/install-github-ci.mjs \
  --mode codex \
  --skill-dir .agents/skills/pm0
```

This expects the repository owner to configure the Codex GitHub Action and `OPENAI_API_KEY`.

Use `--mode auto` when you want PM0 to choose from the skill directory: `.claude/skills/pm0` selects Claude, `.agents/skills/pm0` selects Codex, and other locations select the local check.

The installer writes `.github/workflows/pm0.yml` and refuses to overwrite an existing workflow unless you pass `--force`.

## Design References

PM0's packaging follows:

- `examples/impeccable-main` for one skill with command references
- `examples/superpowers-main` for plugin manifests and cross-harness packaging
