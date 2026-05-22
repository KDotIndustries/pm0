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

Mark uncertain claims as unverified and place them under assumptions needing confirmation. Keep raw tickets, transcripts, emails, and replay data out of `.pm0/`; store short summaries, links, counts, and caveats instead.

## GitHub CI Offer

After scaffolding, ask whether the user wants optional GitHub CI that warns when product-changing PRs do not link a PM0 proposal or PRD. If they want it, use `reference/github-ci.md`, `templates/github-workflow.yml`, and the bundled `scripts/product-ci.mjs` script in the active PM0 skill directory as the implementation reference.

## Output

Report:

- Files and directories created.
- Product surfaces inferred or requested.
- Any selected context files created.
- Assumptions that need founder confirmation.
- Whether optional GitHub CI was offered, accepted, or skipped.
