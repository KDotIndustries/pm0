# GitHub CI

## Purpose

Provide optional GitHub CI for PM0 product memory. The default local check warns when product-changing pull requests do not link the relevant PM0 proposal or PRD. Agent-backed examples can ask Claude or Codex to review a PR against PM0 product memory when the repository owner already has that integration configured.

## Trigger

Use this reference only when the user asks to add optional GitHub CI during `/pm0 init` or explicitly asks for a PM0 product CI workflow.

## Modes

- `local`: installs `templates/github-workflow.yml` and runs the bundled `scripts/product-ci.mjs` script.
- `claude`: installs `templates/github-workflow.claude.example.yml` and uses the shared `templates/product-review-prompt.md` prompt with `anthropics/claude-code-action@v1`.
- `codex`: installs `templates/github-workflow.codex.example.yml` and uses the shared `templates/product-review-prompt.md` prompt with `openai/codex-action@v1`.
- `auto`: chooses Claude when the PM0 skill directory is `.claude/skills/pm0`, Codex when it is `.agents/skills/pm0`, and local otherwise.

Run the bundled installer from the active PM0 skill directory:

```bash
node <active PM0 skill directory>/scripts/install-github-ci.mjs --mode local
node <active PM0 skill directory>/scripts/install-github-ci.mjs --mode claude --skill-dir .claude/skills/pm0
node <active PM0 skill directory>/scripts/install-github-ci.mjs --mode codex --skill-dir .agents/skills/pm0
```

## Inputs

The CI check needs:

- Changed files in the pull request.
- Pull request body text.
- Existing `.pm0/surfaces/*.md` files.
- Existing `.pm0/proposals/*.md` and `.pm0/prds/*.md` files.

The local check uses `templates/github-workflow.yml` as the starting workflow. Set `PM0_SKILL_DIR` to a PM0 skill directory committed in the repository for the target harness, then run the bundled script with `node "$PM0_SKILL_DIR/scripts/product-ci.mjs"`.

## Checks

- Infer whether changed files appear to affect a known product surface.
- If no product surface can be inferred, pass without findings.
- If a product surface is inferred, look for linked `.pm0/proposals/*.md` or `.pm0/prds/*.md` artifacts in the PR body.
- Warn when a product-changing PR does not link a proposal or PRD.
- Warn when a linked PM0 artifact path does not exist.

## Output

For the local check, return a concise result with:

- `pass` when no warning is needed.
- `warning` when the PR appears product-changing and lacks a valid PM0 artifact link.
- Finding messages that explain what to add or fix.

The local check should not fail the build by default. It should emit GitHub warning annotations and write a step summary when GitHub provides `GITHUB_STEP_SUMMARY`.

For agent-backed examples, ask the agent to review only PM0 product-memory concerns. Do not ask it to review general code style unless code changes affect user-facing product behavior.

## Template

Prefer `scripts/install-github-ci.mjs` over hand-copying templates. The installer writes `.github/workflows/pm0.yml`, replaces `PM0_SKILL_DIR`, and refuses to overwrite an existing workflow unless the user passes `--force`.

The local template does not invoke Claude, Codex, or any hosted coding agent. Agent-backed product review depends on the repository owner's existing GitHub integration, secrets, permissions, and billing setup. If the repository already uses an agent GitHub Action, keep that workflow separate or explicitly install the Claude/Codex PM0 example after confirming the required secret exists.

## Limitations

This is a heuristic. It is optional, warning-oriented, and based on file names, PR text, and existing PM0 memory. It does not decide whether a product change is good, complete, approved, or shippable.
