# Discuss

## Purpose

Turn a founder idea, complaint, customer quote, product problem, or opportunity into a PM0 proposal. Discuss can also continue an existing proposal after new feedback or evidence.

## Required Input

The user must provide a surface, proposal, idea, problem, or product question. If the request lacks a surface and cannot be inferred from repo memory, ask for the intended product area before writing a proposal.

## Read Order

1. `.pm0/project.md`.
2. Relevant files from `.pm0/contexts/`.
3. `.pm0/surfaces/{surface}.md`.
4. Active proposal if one is named.
5. Related accepted PRDs and rejected proposal summaries.
6. Current branch or PR state if it affects the proposal.
7. Host-agent tools and integrations when the question needs external evidence.

## Tool And Integration Routing

Choose evidence sources based on the product question and the tools available in the host agent. Ask or inspect what integrations are available, then use only the relevant ones.

| Product question | Likely sources if available |
| --- | --- |
| Login is failing | Intercom or Zendesk support tickets, Sentry, GitHub issues, recent PRs, auth logs. |
| Users drop during onboarding | PostHog or Amplitude funnels, session replay, support tickets, onboarding surface memory. |
| Pricing confusion | Support tickets, sales notes, checkout analytics, competitor pages, pricing surface memory. |
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

## Current Behavior

## Desired Outcome

## Target Users Or Segment

## Evidence And Caveats

## Proposed Scope

## Non-Goals

## Acceptance Criteria

## Open Questions

## Build Notes
```

Use proposal status values from the PM0 spec: Draft, Investigating, Proposed, Accepted, Rejected, Built, or Shipped.

## End States

End by asking whether the user wants to continue discussing, build the proposal, reject it, or hand it off. If the proposal is clearly not ready, recommend continuing discussion and list the missing product decisions.
