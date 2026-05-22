# Analyze

## Purpose

Analyze one product area as a product surface. This is a product behavior analysis, not a code quality review. Focus on what users experience, what the surface is trying to accomplish, where it may be weak, and what PM0 should remember.

## Required Input

The user must provide a surface name, flow, screen, or product area. If the target is ambiguous, ask one clarifying question before reading or writing surface memory.

## Read Order

1. `.pm0/project.md` for whole-product context.
2. Relevant files from `.pm0/contexts/`.
3. `.pm0/surfaces/{surface}.md` if it exists.
4. Accepted PRDs and proposal summaries linked from the surface.
5. Relevant routes, components, docs, screenshots, or app behavior for the surface.
6. External evidence only when it helps explain product behavior.

## Surface Template

Use or update this structure for `.pm0/surfaces/{surface}.md`:

```markdown
# {Surface Name}

## Purpose

## Current Behavior

## Target Users

## Product Principles

## Known Problems

## Metrics

## Active Proposals

## Accepted PRDs

## Rejected Proposals

## Open Questions

## Agent Notes
```

## Evidence Rules

- Separate durable product truth from evidence.
- Treat repo memory as the current source of product truth.
- Treat code, analytics, support, issues, research, and web sources as evidence.
- Mark stale, weak, inferred, or contradictory evidence explicitly.
- Summarize evidence; do not paste raw customer messages, transcripts, emails, tickets, or replay data into `.pm0/`.
- Do not rate engineering quality, implementation style, or test coverage unless it affects the product behavior users experience.

## Output

Update or create the surface file and summarize:

- Current product behavior.
- User intent and target segments.
- Product constraints and principles.
- Known problems or tensions.
- Open questions.
- Evidence used and caveats.
