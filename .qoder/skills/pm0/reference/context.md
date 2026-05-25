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

When external search is needed, prefer Exa when available for competitor analysis, market research, alternatives, category scans, pricing benchmarks, and similar discovery work. If Exa is not available, use the host agent's normal web search or browsing tools.

Examples of relevant product MCP/connectors include PostHog or Amplitude for funnels and cohorts, Intercom or Zendesk for support themes, Granola or interview-note tools for research summaries, Linear or GitHub for issue history, and CRM or billing tools for sales and pricing signals. PM0 does not install or manage those integrations; it uses only what the current agent environment exposes.

Examples:

- competitive landscape: prefer Exa when available, then use public competitor pages, pricing pages, docs, changelogs, review sites, generic web search, and founder-provided competitors
- target users: use repo copy, CRM or support summaries if available, interview notes if supplied, analytics cohorts if available, and founder input
- pricing packages: use current pricing copy, billing code, public market pricing, and sales/support summaries if available
- workflow analysis: use app routes, screenshots, product surfaces, session summaries if available, and support summaries if available

External sources are evidence, not truth. Store links, dates, short summaries, counts, and caveats. Mark uncertain claims as unverified.

Do not store raw tickets, transcripts, emails, CRM records, analytics exports, or replay data in `.pm0/`. Summarize only the product-relevant insight and link back to the source when appropriate.

## Quality Bar

Do not ship a weak artifact. A context file should help a founder make a better product decision, not merely list links or summarize obvious repo facts.

For researched contexts:

- Identify what type of artifact the user requested and use the matching template below.
- Search broadly enough to discover the relevant entities before writing conclusions.
- Prefer structured tables when comparison, prioritization, or measurement is the point of the context.
- Separate repo facts, public web evidence, user-provided context, and assumptions.
- Include contradictions and confidence levels.
- If tools are unavailable or evidence is too thin, write a useful research plan and mark the context as incomplete instead of pretending the work is complete.

When this reference is loaded by `/pm0 init`, apply the same quality bar while working across a small batch of contexts. Init should normally produce two to five context files, but every file must still satisfy the relevant context-type shape below. If one context can be done well and four would be shallow, create the one and recommend the exact follow-up commands for the rest.

## Context Type Index

Map the user's topic to the closest context type. If the topic spans multiple types, create the highest-value context first and recommend the next one.

| User asks for | Context type | Required shape |
| --- | --- | --- |
| competitors, market map, alternatives, battlecard | Competitive Landscape | competitor discovery, comparison matrix, threat ranking, differentiation |
| pricing, plans, packaging, billing, limits | Pricing Packages | current package matrix, competitor pricing benchmark, contradictions |
| metrics, KPIs, north star, activation, retention | Success Metrics | north star candidate, input metrics, guardrails, instrumentation gaps |
| personas, ICP, user definition, buyer | Target Users | segment matrix, buyer/user split, jobs, non-targets |
| design system, UI language, visual consistency | Design System | interface inventory, reusable patterns, accessibility and risks |
| vision, strategy, product direction | Product Vision | future state, strategic bets, product principles, risks |
| positioning, messaging, category, differentiation | Positioning | competitive alternatives, unique attributes, value, target segment, category |
| roadmap, now next later, priorities | Roadmap | themes, initiatives, outcomes, dependencies, confidence |
| go-to-market, launch, channels, sales motion | Go-To-Market Outline | ICP, positioning, channels, funnel, launch risks, metrics |
| MVP, v1 scope, first release | MVP Framing | user promise, included scope, excluded scope, riskiest assumptions |
| workflow, journey, funnel, onboarding | Workflow Analysis | current workflow, user goals, friction, drop-offs, opportunities |
| research plan, validation plan, interviews | Research Plan | research questions, methods, participants, timeline, synthesis plan |

## Artifact-Specific Guidance

### Competitive Landscape

A competitive landscape must compare competitors. Do not only name competitors or list source links.

Research flow:

1. Identify the product category and likely buyer from repo memory and public product copy.
2. Discover competitors through Exa when available, web search, similar-site search when available, pricing pages, comparison pages, review sites, marketplace listings, and founder-provided names.
3. Include direct competitors, adjacent substitutes, and regional or vertical competitors when relevant.
4. Read enough primary sources for each important competitor to understand positioning, packaging, target buyer, channels, and pricing model.
5. Compare the competitors against the user's product and extract product implications.

Minimum output:

```markdown
## Category Definition

## Competitor Set

| Competitor | Type | Target Buyer | Core Promise | Pricing Model | Why They Matter | Sources | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Competitor Comparison

| Capability / Position | Our Product | Competitor A | Competitor B | Competitor C |
| --- | --- | --- | --- | --- |

## Threat Ranking

| Rank | Competitor | Threat Level | Reason | PM0 Implication |
| --- | --- | --- | --- | --- |

## Differentiation Opportunities

## Positioning Risks

## Evidence And Caveats

## Open Questions
```

Aim for at least five relevant competitors when the market is discoverable. Use fewer only when the category is genuinely narrow, and explain why.

### Pricing Packages

Pricing context must compare packages and expose mismatches between product, billing, marketing, and competitors.

Minimum output:

```markdown
## Current Package Matrix

| Package | Price | Buyer / Use Case | Limits | Included | Excluded / Add-ons | Source | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Pricing And Packaging Matrix

| Company | Entry Package | Core Paid Package | AI / Usage Pricing | Seat Pricing | Key Limits | Notes | Sources |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Internal Contradictions

## Packaging Implications

## Open Questions
```

When repo billing constants and public pricing disagree, call that out as a first-class product risk.

### Success Metrics

Success metrics context must define how the product should know whether it is working. Do not stop at generic KPI names.

Minimum output:

```markdown
## North Star Candidate

## Success Metrics Matrix

| Metric | Definition | User / Business Reason | Current Baseline | Target | Instrumentation Source | Cadence | Caveats |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Funnel Or Workflow Metrics

## Quality Guardrails

## Instrumentation Gaps

## Review Cadence
```

If baselines are unavailable, write `Unknown` and identify the event, dashboard, or tool needed to measure it.

### Target Users

Target-user context must distinguish segments, buyer, user, and non-targets.

Minimum output:

```markdown
## Segment Matrix

| Segment | Buyer | Daily User | Trigger Problem | Current Alternative | Success Criteria | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Priority Segment Recommendation

## Non-Targets

## Jobs To Be Done

## Evidence And Caveats
```

### Design System

Design-system context must capture the actual product UI language, not generic design advice.

Minimum output:

```markdown
## Interface Inventory

| Surface | Components / Patterns | Visual Language | Interaction Notes | Source |
| --- | --- | --- | --- | --- |

## Reusable Patterns

## Product UX Principles

## Accessibility And Responsiveness Notes

## Risks And Inconsistencies
```

### Product Vision

Product vision context must connect product direction to users, market, and constraints. Do not write generic aspirational copy.

Minimum output:

```markdown
## Current Product Thesis

## Future State

## Strategic Bets

| Bet | User / Market Belief | Product Implication | Evidence | Risk | Confidence |
| --- | --- | --- | --- | --- | --- |

## Product Principles

## Anti-Goals

## Risks And Revisit Triggers
```

### Positioning

Positioning context must explain why the product should be perceived differently from alternatives.

Minimum output:

```markdown
## Category Hypothesis

## Positioning Matrix

| Target Segment | Competitive Alternative | Unique Attribute | Value Enabled | Proof / Evidence | Caveat |
| --- | --- | --- | --- | --- | --- |

## Positioning Statement Candidates

## Messaging Pillars

## Differentiation Risks

## Open Questions
```

### Roadmap

Roadmap context must express outcomes and sequencing, not just a feature list.

Minimum output:

```markdown
## Roadmap Principles

## Roadmap Matrix

| Horizon | Theme | Initiative | Customer Outcome | Business Outcome | Dependencies | Confidence |
| --- | --- | --- | --- | --- | --- | --- |

## Now / Next / Later

## Dependencies And Risks

## What Not To Build Yet

## Review Triggers
```

If dates are unavailable or risky, use now/next/later horizons instead of inventing deadlines.

### Go-To-Market Outline

Go-to-market context must connect target segment, positioning, pricing, channels, funnel, and success metrics.

Minimum output:

```markdown
## GTM Thesis

## ICP And Buyer

## GTM Motion Matrix

| Channel / Motion | Target Segment | Message | Offer / CTA | Funnel Stage | Success Metric | Evidence | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Launch Or Campaign Plan

## Sales / Support Enablement Needs

## GTM Risks

## Metrics And Review Cadence
```

### MVP Framing

MVP context must define the smallest product promise that can validate the riskiest assumption.

Minimum output:

```markdown
## MVP Product Promise

## Riskiest Assumptions

## MVP Scope Matrix

| Capability | Include In MVP? | User Value | Validation Purpose | Non-Goals / Later |
| --- | --- | --- | --- | --- |

## First User Segment

## Learning Goals

## Success Criteria

## Kill Or Continue Signals
```

### Workflow Analysis

Workflow context must explain how a product flow works today and where it breaks.

Minimum output:

```markdown
## Workflow Breakdown

| Step | User Goal | Current Behavior | Friction / Risk | Evidence | Opportunity |
| --- | --- | --- | --- | --- | --- |

## Entry Points

## Exit States

## Failure And Empty States

## Measurement Gaps

## Product Opportunities
```

### Research Plan

Research-plan context must turn uncertainty into an executable learning plan.

Minimum output:

```markdown
## Research Objective

## Key Questions

## Research Plan Matrix

| Question | Method | Participants / Source | Sample Size | Output | Timeline | Risk |
| --- | --- | --- | --- | --- | --- | --- |

## Recruiting Or Source Plan

## Discussion Guide Outline

## Synthesis Plan

## Decision This Research Should Inform
```

## File Naming

Use stable names for durable context that should be maintained over time:

```text
.pm0/contexts/target-users.md
.pm0/contexts/competitive-landscape.md
.pm0/contexts/product-vision.md
.pm0/contexts/positioning.md
.pm0/contexts/pricing-packages.md
.pm0/contexts/design-system.md
.pm0/contexts/go-to-market.md
.pm0/contexts/mvp-framing.md
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
