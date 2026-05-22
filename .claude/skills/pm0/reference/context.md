# Context

## Purpose

Create or update one focused context file under `.pm0/contexts/` for durable product background that should inform future analysis, proposals, builds, and PRDs.

Use this for topics such as target users, product vision, positioning, roadmap, pricing packages, design system, go-to-market, competitive landscape, success metrics, research plan, or workflow analysis.

## Required Input

The user must provide a topic, for example:

```text
/pm0 context competitive landscape
/pm0 context pricing packages
/pm0 context target users
/pm0 context design system
```

If the topic is too broad or ambiguous, ask one clarifying question before researching or writing.

## Tool Use

Start with repo memory: `.pm0/project.md`, relevant `.pm0/surfaces/`, existing `.pm0/contexts/`, README, docs, routes, visible UI, and product copy.

Use web search, product URLs, screenshots, and available MCP/connectors when they are relevant to the context topic and allowed by the current harness. Choose tools based on the question. Do not use every integration by default.

Examples:

- competitive landscape: use web search, public competitor pages, pricing pages, docs, changelogs, review sites, and founder-provided competitors
- target users: use repo copy, CRM or support summaries if available, interview notes if supplied, analytics cohorts if available, and founder input
- pricing packages: use current pricing copy, billing code, public market pricing, and sales/support summaries if available
- workflow analysis: use app routes, screenshots, product surfaces, session summaries if available, and support summaries if available

External sources are evidence, not truth. Store links, dates, short summaries, counts, and caveats. Mark uncertain claims as unverified.

Do not store raw tickets, transcripts, emails, CRM records, analytics exports, or replay data in `.pm0/`. Summarize only the product-relevant insight and link back to the source when appropriate.

## File Naming

Use stable names for durable context that should be maintained over time:

```text
.pm0/contexts/target-users.md
.pm0/contexts/competitive-landscape.md
.pm0/contexts/positioning.md
.pm0/contexts/pricing-packages.md
.pm0/contexts/design-system.md
.pm0/contexts/research-plan.md
.pm0/contexts/roadmap.md
.pm0/contexts/success-metrics.md
.pm0/contexts/workflow-analysis.md
```

Use dated names for point-in-time research snapshots:

```text
.pm0/contexts/YYYY-MM-DD-{topic}.md
```

Prefer updating an existing stable context when the user is improving durable product memory. Prefer a dated snapshot when the result depends on a specific market scan, campaign, customer batch, or research run.

## Template

Use this shape unless the context clearly needs a different structure:

```markdown
# {Context Title}

Status: Draft
Last updated: YYYY-MM-DD
Topic: {topic}

## Why This Matters

## What We Know

## Evidence

## Product Implications

## Assumptions And Caveats

## Open Questions

## Related Surfaces And Proposals
```

## Output

Report:

- Context file created or updated.
- Tools and sources used.
- Claims that remain unverified.
- Related surfaces or proposals that should be updated.
- Recommended next PM0 command, usually `/pm0 analyze <surface>` or `/pm0 discuss <surface>`.
