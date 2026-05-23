# Init

## Purpose

Create the `.pm0/` product memory tree and make the repo product-aware. Init should capture enough durable product context for future agents to reason about product surfaces before changing them.

## Reads

- README and existing product docs.
- Package files and app metadata that reveal the product shape.
- Visible routes, app structure, components, or screens that indicate product surfaces.
- Existing agent instructions or repository conventions.
- Product URL or screenshots if the user provides them.
- Product context supplied by the user in the conversation.
- Web search or available MCP/connectors when the user asks for researched context, approves deeper context gathering, or provides a product question that needs external evidence.

## Writes

Init writes the base memory tree:

```text
.pm0/project.md
.pm0/contexts/
.pm0/surfaces/index.md
.pm0/proposals/
.pm0/prds/
```

Run the bundled scaffold script from the active PM0 skill directory, for example `node <active PM0 skill directory>/scripts/scaffold-pm0.mjs`, to create deterministic folders and starter files. Do not hand-create the base tree when the script is available.

## Context Selection

Create selected context files only when they are useful for the repo and the user has provided or approved enough information. Do not create every possible context file by default.

Good candidates include context for target users, product vision, positioning, roadmap, pricing, design system, go-to-market, competitive landscape, success metrics, research plans, or workflow analysis. Choose based on the product surface and evidence in the repo, not a fixed template list.

Before creating any context file during init, read `reference/context.md` and follow its quality bar and artifact-specific guidance for that context type. Do not create thin placeholder context files. If init cannot meet the relevant context quality bar with available repo evidence, user input, approved web search, screenshots, or available MCP/connectors, leave the context uncreated and recommend the exact `/pm0 context <topic>` command to run next.

Init should usually create only the highest-confidence seed context, often one to three files. If more context would be useful but needs deeper research, ask which context topic the user wants next and recommend `/pm0 context <topic>`.

Mark uncertain claims as unverified and place them under assumptions needing confirmation. Keep raw tickets, transcripts, emails, and replay data out of `.pm0/`; store short summaries, links, counts, and caveats instead.

When using external tools, treat public pages, search results, support summaries, analytics, CRM records, and interview notes as evidence. Summarize durable product implications rather than copying source material.

## GitHub CI Offer

After scaffolding, ask whether the user wants optional GitHub CI.

Offer these choices:

- local PM0 product-memory check: no hosted agent, warning-oriented, links product-changing PRs to proposals or PRDs
- Claude-backed PM0 product review: uses the repository owner's Claude GitHub Action setup
- Codex-backed PM0 product review: uses the repository owner's Codex GitHub Action setup
- skip

If the user chooses local, run the bundled installer from the active PM0 skill directory with `--mode local`. If the user chooses Claude or Codex, run it with `--mode claude` or `--mode codex`. If the user wants the agent to choose, run it with `--mode auto`; auto selects Claude from `.claude/skills/pm0`, Codex from `.agents/skills/pm0`, and local otherwise.

Use `reference/github-ci.md`, `templates/github-workflow.yml`, `templates/github-workflow.claude.example.yml`, `templates/github-workflow.codex.example.yml`, `templates/product-review-prompt.md`, `scripts/install-github-ci.mjs`, and `scripts/product-ci.mjs` as implementation references.

## Output

Report:

- Files and directories created.
- Product surfaces inferred or requested.
- Any selected context files created.
- Assumptions that need founder confirmation.
- Recommended follow-up context commands when useful, such as `/pm0 context competitive landscape`.
- Whether optional GitHub CI was offered, accepted, installed, or skipped.
