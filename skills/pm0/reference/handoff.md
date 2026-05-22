# Handoff

## Purpose

Convert a discussed proposal into a clear product decision. Handoff either accepts the proposal for engineering, rejects it, or marks it as needing more discussion.

## Required Input

The user must provide a proposal path, proposal slug, or clear proposal title. If multiple proposals match, ask which one to hand off.

## Outcomes

The only valid outcomes are:

- accepted for engineering
- rejected
- needs more discussion

For accepted for engineering, create a PRD in `.pm0/prds/YYYY-MM-DD-{surface}-{slug}.md`, update the proposal status to Accepted, and link the PRD from the related surface.

For rejected, update the proposal status to Rejected, summarize the rejection under `Rejected Proposals` in the related surface, and ask whether to keep or delete the proposal file.

For needs more discussion, update the proposal with the missing decisions or evidence, keep it active on the related surface, and do not create a PRD.

## PRD Template

Use this structure for accepted proposals:

```markdown
# {PRD Title}

Status: Accepted
Surface: {surface}
Date: YYYY-MM-DD
Source Proposal: .pm0/proposals/YYYY-MM-DD-{surface}-{slug}.md

## Product Intent

## Problem

## Current Behavior

## Desired Behavior

## Users And Segments

## Evidence

## Scope

## Non-Goals

## Acceptance Criteria

## Metrics And Instrumentation

## Risks And Tradeoffs

## Implementation Notes

## Verification Expectations
```

## Surface Updates

Update `.pm0/surfaces/{surface}.md` so future agents can understand the durable product history from the surface file alone.

- Add accepted PRDs under `Accepted PRDs`.
- Keep active proposals under `Active Proposals`.
- Add rejected proposal summaries under `Rejected Proposals`.
- Add unresolved decisions under `Open Questions`.
- Keep `Agent Notes` factual and brief.

## GitHub PR Description

When the handoff is accepted for engineering and the user is preparing a PR, provide a concise PR description that links the PM0 PRD and summarizes:

- Product intent.
- Scope.
- Non-goals.
- Acceptance criteria.
- Verification expectations.
- Known risks or open questions.
