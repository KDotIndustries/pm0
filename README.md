# PM0

Your AI product manager for founder-led teams.

PM0 helps founders and product-minded builders turn scattered product context into repo-native product memory, proposals, quick prototypes, and PRDs that coding agents can actually use.

Read the broader product thinking at [pm0.app](https://pm0.app/).

## Why PM0

Coding agents can change code quickly, but product context is usually scattered across founder memory, support tickets, analytics, interviews, Slack, GitHub, and old PRDs.

PM0 gives early-stage teams a lightweight product management layer without requiring a full-time PM process. It keeps the product brain next to the code, so the agent changing the product can also understand the user, market, surface, proposal history, and acceptance criteria.

PM0 is also useful when you are a founder, PM, or operator who does not write code every day. You can discuss a proposal, ask the coding agent to build the smallest useful prototype or product change, share it for feedback, and come back to update the proposal before deciding whether it deserves engineering handoff.

PM0 is not a replacement for engineering review or production-quality implementation. It helps make a product direction testable earlier, with the context attached, instead of starting from a blank prompt in a generic prototyping tool.

PM0 makes that context explicit:

- each product area has durable surface memory
- each new idea starts as a proposal
- accepted proposals become PRDs during handoff
- rejected proposals are summarized back into the surface

## Who PM0 Is For

PM0 is designed for:

- founders building with AI coding agents
- early-stage startups without a full-time product manager
- PMs and operators who want to prototype a product direction without starting from code
- product-minded engineers who want stronger product judgment before shipping
- teams that want product decisions stored next to code instead of buried in chat threads

## Why Use PM0

Use PM0 when you want the agent to do product work before code work.

PM0 helps you:

- keep durable product context in `.pm0/`
- analyze a product surface before changing it
- turn vague founder ideas, customer complaints, or market signals into proposals
- keep discussing a proposal after stakeholder, user, or customer feedback
- turn a proposal into the smallest useful prototype or repo change
- turn accepted proposals into PRDs for engineering
- use available MCP/connectors when the local agent has relevant product data access
- preserve the loop from context to surface memory to proposal to build to PRD

## Commands

```text
/pm0
/pm0 init
/pm0 context competitive landscape
/pm0 analyze onboarding
/pm0 discuss onboarding
/pm0 discuss 2026-05-23-onboarding-empty-state
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
5. Run `/pm0 discuss <proposal>` when you have stakeholder feedback, user interview notes, customer objections, or new evidence for an existing proposal.
6. Run `/pm0 build <proposal>` to ask the host coding agent for the smallest useful prototype or product change.
7. Run `/pm0 handoff <proposal>` to accept for engineering, reject, or mark as needs more discussion.

Proposals are meant to be shared and revisited. A founder can send a proposal to users, teammates, advisors, or customers, then come back with feedback and use `/pm0 discuss <proposal>` to update the product judgment before building or handing it off.

## Installation

PM0 follows the same packaging style as the local Superpowers and Impeccable examples in this repository. Install the skill directory for your agent harness, or use the plugin manifest when your harness supports plugins.

The quickest install path is:

```bash
npx skills add KDotIndustries/pm0
```

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

When `/pm0 init` creates context files, it follows the same founder-grade context rules as `/pm0 context <topic>`. If there is not enough evidence to create a useful context artifact, init should leave that context uncreated and recommend the specific follow-up command instead.

## Build Product Context

Use `/pm0 context <topic>` for focused research-backed context after init. PM0 starts from repo memory and can use available tools such as web search, product URLs, screenshots, or connected MCPs when they are relevant and allowed by the current agent harness.

If your agent already has product MCPs or connectors, PM0 can route research through the relevant ones. Examples include PostHog or Amplitude for funnels and cohorts, Intercom or Zendesk for support themes, Granola or interview-note tools for research summaries, Linear or GitHub for issue history, and CRM or billing tools for sales and pricing signals. PM0 does not install or manage those integrations; it uses what the current agent environment exposes.

PM0 uses opinionated context templates for common product work. Instead of asking the agent to "think about strategy" from scratch, context files give it familiar PM shapes such as target users and ICP, Jobs To Be Done, competitive landscape, positioning, roadmap, GTM, MVP framing, workflow analysis, research plans, pricing packages, and success metrics such as a North Star metric, input metrics, guardrails, and instrumentation gaps.

Examples:

```text
/pm0 context target users
/pm0 context competitive landscape
/pm0 context pricing packages
/pm0 context design system
```

Founder-grade context should be structured enough to support a decision. For example, competitive landscape should discover competitors, compare them in tables, rank threats, and call out differentiation opportunities. Pricing context should compare packages, expose contradictions, and benchmark competitors. Success metrics context should define a North Star candidate, input metrics, baselines, targets, instrumentation, and caveats.

PM0 stores durable summaries in `.pm0/contexts/`, not raw tickets, transcripts, emails, analytics exports, or replay data.

## Optional GitHub CI

PM0 can add optional GitHub CI during `/pm0 init`.

- Local check: warning-oriented, no hosted agent, validates PM0 memory shape, flags scaffold placeholders, and checks that product-changing PRs link a PM0 proposal or PRD.
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

## Inspiration And Thanks

PM0 exists in the same spirit as projects that made agent skills feel practical, portable, and useful in real development work. Thank you to the maintainers and contributors behind:

- [Impeccable](https://github.com/pbakaus/impeccable)
- [Superpowers](https://github.com/obra/superpowers)
