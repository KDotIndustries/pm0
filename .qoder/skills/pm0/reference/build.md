# Build

## Purpose

Use a PM0 proposal to guide the smallest useful product change. The host agent implements code; PM0 supplies product context, constraints, acceptance criteria, and evidence from repo memory.

## Required Input

The user must provide a proposal path, proposal slug, or clear proposal title. If multiple proposals match, ask which one to build before changing code.

## Read Order

1. `.pm0/project.md`.
2. Relevant files from `.pm0/contexts/`.
3. The named proposal in `.pm0/proposals/`.
4. `.pm0/surfaces/{surface}.md`.
5. Accepted PRDs or rejected proposal summaries linked from the surface.
6. Relevant product routes, components, docs, and tests.

## Build Rules

- Build the smallest useful change that satisfies the proposal.
- Preserve the product intent, non-goals, and constraints in the proposal.
- Do not expand scope because nearby code makes it tempting.
- Ask before changing the proposal's product direction.
- Prefer reversible product changes when the proposal has weak evidence.
- Keep `.pm0/` updates focused on product memory, not implementation logs.
- Update the related surface using the surface template from `reference/analyze.md` when the build changes current behavior, metrics/signals, known problems, accepted PRDs, open questions, or durable evidence.
- Run the repo's relevant verification commands before reporting the build result.

## Proposal Build Notes

Before coding, translate the proposal into concise implementation context for the host agent:

- Product intent.
- Surface and affected users.
- Desired behavior.
- Non-goals.
- Acceptance criteria.
- Metrics or instrumentation expectations.
- Risks, caveats, and open questions.

If the proposal is missing acceptance criteria or desired behavior, pause and ask for the missing product decision instead of guessing.

## Output

Report:

- Proposal used.
- Product behavior changed.
- Files changed outside `.pm0/`.
- Any PM0 memory updates.
- Verification commands and results.
- Remaining product questions or follow-up proposal work.
