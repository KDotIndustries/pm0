# GitHub CI

## Purpose

Provide an optional, warning-oriented PR check that helps product-changing pull requests link the relevant PM0 proposal or PRD.

## Trigger

Use this reference only when the user asks to add optional GitHub CI during `/pm0 init` or explicitly asks for the PM0 product CI check.

## Inputs

The CI check needs:

- Changed files in the pull request.
- Pull request body text.
- Existing `.pm0/surfaces/*.md` files.
- Existing `.pm0/proposals/*.md` and `.pm0/prds/*.md` files.

Use `templates/github-workflow.yml` as the starting workflow. Set `PM0_SKILL_DIR` to a PM0 skill directory committed in the repository for the target harness, then run the bundled script with `node "$PM0_SKILL_DIR/scripts/product-ci.mjs"`.

## Checks

- Infer whether changed files appear to affect a known product surface.
- If no product surface can be inferred, pass without findings.
- If a product surface is inferred, look for linked `.pm0/proposals/*.md` or `.pm0/prds/*.md` artifacts in the PR body.
- Warn when a product-changing PR does not link a proposal or PRD.
- Warn when a linked PM0 artifact path does not exist.

## Output

Return a concise result with:

- `pass` when no warning is needed.
- `warning` when the PR appears product-changing and lacks a valid PM0 artifact link.
- Finding messages that explain what to add or fix.

The check should not fail the build by default.

## Template

Copy `templates/github-workflow.yml` to `.github/workflows/pm0.yml` and adjust `PM0_SKILL_DIR` if the PM0 skill is installed somewhere other than `.agents/skills/pm0`.

This default template does not invoke Claude, Codex, or any other hosted coding agent. Agent-backed product review depends on the repository owner's existing GitHub integration, secrets, permissions, and billing setup. If the repository already uses an agent GitHub Action, keep that workflow separate and pass PM0 context as part of that action's prompt or instructions.

## Limitations

This is a heuristic. It is optional, warning-oriented, and based on file names, PR text, and existing PM0 memory. It does not decide whether a product change is good, complete, approved, or shippable.
