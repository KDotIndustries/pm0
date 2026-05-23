# Discuss

## Purpose

Turn a founder idea, complaint, customer quote, product problem, or opportunity into a PM0 proposal. Discuss can also continue an existing proposal after new feedback or evidence.

## Required Input

The user must provide a surface, proposal, idea, problem, or product question. If the request lacks a surface and cannot be inferred from repo memory, ask for the intended product area before writing a proposal.

## Read Order

If `/pm0 discuss <proposal>` names an existing proposal, read that proposal first to discover its `Surface:` value, then read the matching surface memory.

If `/pm0 discuss <surface>` names a product surface, read product and surface memory first before creating or updating any proposal.

1. Existing proposal, only when one is named.
2. `.pm0/project.md`.
3. Relevant files from `.pm0/contexts/`.
4. `.pm0/surfaces/{surface}.md`.
5. Active proposal if one is named and has not already been read.
6. Related accepted PRDs and rejected proposal summaries.
7. Current branch or PR state if it affects the proposal.
8. Host-agent tools and integrations when the question needs external evidence.

## Tool And Integration Routing

Choose evidence sources based on the product question and the tools available in the host agent. Ask or inspect what integrations are available, then use only the relevant ones.

| Product question | Likely sources if available |
| --- | --- |
| Login is failing | Intercom or Zendesk support tickets, Sentry, GitHub issues, recent PRs, auth logs. |
| Users drop during onboarding | PostHog or Amplitude funnels, session replay, support tickets, onboarding surface memory. |
| Pricing confusion | Support tickets, sales notes, checkout analytics, competitor pages, pricing surface memory. |
| User interview feedback | Granola or interview-note summaries, CRM notes, founder-provided notes, research-plan context. |
| Recent product regression | Git history, GitHub PRs or issues, Sentry, release notes. |
| Competitor or market question | Web research, competitor sites or docs, sales notes. |

Do not use every available integration just because it exists. Store links, short summaries, counts, and caveats rather than raw tickets, emails, transcripts, or replay data. Mark evidence strength and contradictions. If evidence is weak, say so.

## Proposal Template

Write proposals to `.pm0/proposals/YYYY-MM-DD-{surface}-{slug}.md` using this structure:

```markdown
# {Proposal Title}

Status: Draft
Surface: {surface}
Date: YYYY-MM-DD

## Problem Or Opportunity

## Why Now

## Target Users Or Segment

## Current Behavior

## Desired Outcome

## Evidence And Caveats

## Proposed Scope

## Non-Goals

## Success Criteria

## Risks And Tradeoffs

## Open Questions

## Build Notes

## Handoff Readiness

- [ ] Problem is clear
- [ ] Target user is clear
- [ ] Scope is small enough for one engineering pass
- [ ] Acceptance criteria are testable
- [ ] Metrics or learning signal is defined
- [ ] Major open questions are resolved or explicitly accepted
```

Use proposal status values from the PM0 spec: Draft, Investigating, Proposed, Accepted, Rejected, Built, or Shipped.

Keep proposals founder-friendly and concise, but do not leave them vague. The proposal should be strong enough for a later `/pm0 handoff` to judge whether it is ready for engineering.

## Memory Hygiene

Keep `.pm0/proposals/` and `.pm0/surfaces/` as the source of truth. Internal run artifacts, scratch notes, chat transcripts, or analysis files can preserve reasoning, but they are not durable product memory by themselves.

When discussion improves the product judgment, update the proposal instead of leaving the best version only in notes. In particular, update the proposal when discussion changes:

- status
- problem framing
- desired outcome
- target segment
- proposed scope
- non-goals
- acceptance criteria
- open questions
- build notes

Update the surface whenever discussion changes the surface-level memory. Use the surface template from `reference/analyze.md`. Add or revise:

- active proposal links and one-line summaries
- accepted PRD links
- rejected proposal summaries
- known problems or tensions
- metrics or signals
- open questions
- evidence caveats

If you write an internal run artifact, also summarize any durable decision or recommendation back into the relevant proposal and surface before ending, unless the user explicitly asked for notes only.

## End States

End by asking whether the user wants to continue discussing, build the proposal, reject it, or hand it off. If the proposal is clearly not ready, recommend continuing discussion and list the missing product decisions.
