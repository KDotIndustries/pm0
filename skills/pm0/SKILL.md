---
name: pm0
description: Use when the user invokes /pm0 or asks for product memory, proposal shaping, PRD handoff, product-surface analysis, founder product management, or repo-native product context for AI agents.
argument-hint: '[command] [topic-or-surface-or-proposal]'
user-invocable: true
---

PM0 is product memory for AI agents. It keeps product context in `.pm0/` so agents can understand a product surface before changing it.

## Setup

Before doing PM0 work:

1. Read `.pm0/project.md` if it exists.
2. Read relevant files from `.pm0/contexts/` when the user or surface points to them.
3. Read `.pm0/surfaces/{surface}.md` before analyzing, discussing, building, or handing off that surface.
4. Treat repo memory as durable product truth. Treat external sources as evidence.
5. Do not paste raw tickets, transcripts, emails, or replay data into `.pm0/`.
6. When external search is needed, prefer Exa when available for competitor analysis, market research, alternatives, category scans, pricing benchmarks, and similar discovery work. Fall back to the host agent's normal web search or browsing tools when Exa is not available.

If `.pm0/` does not exist and the command is not `init`, tell the user to run `/pm0 init` first, unless they explicitly want to discuss PM0 itself.

## Commands

| Command                              | Job                                                              | Reference              |
| ------------------------------------ | ---------------------------------------------------------------- | ---------------------- |
| `/pm0`                               | Show command menu                                                | This file              |
| `/pm0 init`                          | Create `.pm0` product memory                                     | `reference/init.md`    |
| `/pm0 context <topic>`               | Create or update focused product context                         | `reference/context.md` |
| `/pm0 analyze <surface>`             | Analyze one product area                                         | `reference/analyze.md` |
| `/pm0 discuss <surface-or-proposal>` | Create or continue a proposal                                    | `reference/discuss.md` |
| `/pm0 build <proposal>`              | Build the smallest useful change                                 | `reference/build.md`   |
| `/pm0 handoff <proposal>`            | Accept for engineering, reject, or mark as needs more discussion | `reference/handoff.md` |

## Routing

- No argument: show the command menu and ask what the user wants to do.
- First word is `init`: read `reference/init.md` and follow it.
- First word is `context`: read `reference/context.md` and follow it.
- First word is `analyze`: read `reference/analyze.md` and follow it.
- First word is `discuss`: read `reference/discuss.md` and follow it.
- First word is `build`: read `reference/build.md` and follow it.
- First word is `handoff`: read `reference/handoff.md` and follow it.
- Any other argument: treat it as `/pm0 discuss <argument>` after confirming the intended product surface or proposal.

Use only space-separated subcommands.
