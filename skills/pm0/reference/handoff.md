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

## Proposal Readiness Check

Before accepting a proposal for engineering, read its `Handoff Readiness` checklist and validate the content, not just the checkboxes.

Accept for engineering only when:

- Problem is clear.
- Target user or segment is clear.
- Scope is small enough for one engineering pass.
- Acceptance criteria or success criteria are testable.
- Metrics, instrumentation, or learning signal is defined.
- Major open questions are resolved or explicitly accepted as implementation constraints.

If any item is missing or vague, choose `needs more discussion`, update the proposal with the missing decisions or evidence, and do not create a PRD.

## PRD Template

Use this structure for accepted proposals:

```markdown
# {PRD Title}

Status: Accepted for engineering
Surface: {surface}
Date: YYYY-MM-DD
Source Proposal: .pm0/proposals/YYYY-MM-DD-{surface}-{slug}.md
Related Context: .pm0/contexts/{context}.md
Related Surface: .pm0/surfaces/{surface}.md

## Product Intent

## Background And Strategic Fit

## Problem

## Users And Jobs

## Current Behavior

## Desired Behavior

## Evidence

## Requirements

| Requirement | Priority | User Value | Acceptance Criteria | Notes |
| ----------- | -------- | ---------- | ------------------- | ----- |

## User Flows / UX Notes

## Scope

## Non-Goals

## Metrics And Instrumentation

## Rollout / Migration Notes

## Risks, Tradeoffs, And Assumptions

## Open Questions

## Engineering Notes

Do not prescribe architecture unless the product constraint requires it. Capture product constraints, known dependencies, data or integration concerns, and links engineers should read.

## Verification Expectations
```

The `Requirements` table is mandatory for accepted handoffs. Requirements should describe product behavior and user value, not implementation tasks. Use priorities such as `P0`, `P1`, and `P2`.

Keep PRDs concise but complete. The goal is "enough for engineering to review and implement with product context," not a large enterprise specification. If major questions remain unresolved, choose `needs more discussion` instead of generating a weak PRD.

## Surface Updates

Update `.pm0/surfaces/{surface}.md` so future agents can understand the durable product history from the surface file alone.
Use the surface template from `reference/analyze.md` if the surface file is missing or incomplete.

- Add accepted PRDs under `Accepted PRDs`.
- Keep active proposals under `Active Proposals`.
- Add rejected proposal summaries under `Rejected Proposals`.
- Add unresolved decisions under `Open Questions`.
- Update known problems, metrics/signals, evidence, and product principles when the handoff changes durable surface truth.
- Keep `Agent Notes` factual and brief.

## GitHub PR Description

When the handoff is accepted for engineering and the user is preparing a PR, provide a concise PR description that links the PM0 PRD and summarizes:

- Product intent.
- Scope.
- Non-goals.
- Acceptance criteria.
- Verification expectations.
- Known risks or open questions.

Keep PR descriptions public-safe. Do not paste raw customer evidence, private support or research links, confidential strategy, or internal-only language into the PR description. Redact sensitive details and use short neutral summaries, aggregate counts, or links that are safe for the repository audience.
