# PM0 Website Design

Date: 2026-05-25
Status: Approved for implementation planning

## Goal

Create a small Astro website for PM0, the open-source product memory skill for AI agents.
The site should present PM0 as an installable tool, not as a waitlist product or long
founder memo. It should keep the old marketing site's strongest visual idea: a hero
background where product inputs fall into view using Matter.js physics.

## Source Material

- Use `/Users/omarkhatib/GitHub/khatib.gg/` as the Astro skeleton reference.
- Reuse its general structure: Astro, React islands, Tailwind v4, Oxlint/Oxfmt, layout,
  global CSS, and a small component set.
- Use `/Users/omarkhatib/GitHub/pm0-v3/apps/web-marketing/app/components/home/hero-section.tsx`
  as the Matter.js hero behavior reference.
- Use the current PM0 README and skill files for product truth.
- Treat `https://www.usehallmark.com/` as structural inspiration: editorial, specimen-like,
  restrained, and highly scannable.
- Pull only a compact "why this exists" idea from the old `https://pm0.app/` founder memo.

## Architecture

Add a small Astro marketing site at the repository root.

Expected structure:

```text
src/
  components/
    InputGravityHero.tsx
    CommandCopy.tsx
  layouts/
    layout.astro
  pages/
    index.astro
  styles/
    global.css
public/
  fonts/
```

Configuration should follow the `khatib.gg` reference:

- `astro.config.mjs` with React and Tailwind integration.
- `tsconfig.json`.
- `oxlint.config.ts`.
- `oxfmt.config.ts`.
- `pnpm-workspace.yaml`.
- `package.json` scripts for `dev`, `build`, `preview`, `format`, `format:check`, `lint`,
  `lint:fix`, `check`, and the existing `test` command.

Dependencies:

- Astro, React, React DOM, `@astrojs/react`.
- Tailwind v4 and `@tailwindcss/vite`.
- `matter-js` and `@types/matter-js`.
- `@phosphor-icons/react` for generic input cards.
- `@ridemountainpig/svgl-react` for brand logos where available.
- Oxlint, Oxfmt, TypeScript, and Astro check tooling.

Do not copy the PostHog token from `khatib.gg`. A PostHog component pattern can exist later,
but analytics should remain disabled unless PM0 has its own config.

## Page Design

Build a single editorial specimen page.

Hero:

- Header: `pm0` on the left; `GitHub` and `DM Fouad` links on the right.
- Warm off-white editorial background.
- Matter.js cards fall behind and around the hero copy.
- Hero eyebrow: `Product memory for AI agents`.
- Hero headline: `Bring the mess. Find the move.`
- Hero lede: PM0 turns scattered product context into repo-native memory, proposals,
  prototypes, and handoffs that coding agents can use.
- Primary action: a command bar for `npx skills add KDotIndustries/pm0`, with a copy affordance.
- No waitlist or "get access" call to action.

Sections:

1. `What it does`
   Explain PM0 as an installable skill that creates `.pm0/` product memory and guides
   context, analysis, discussion, build, and handoff.
2. `The loop`
   Show the compact loop: inputs -> context -> proposal -> prototype/build -> feedback ->
   PRD/handoff. This keeps the old memo's core idea without becoming an essay.
3. `Commands`
   Show the core commands: `/pm0 init`, `/pm0 context`, `/pm0 analyze`, `/pm0 discuss`,
   `/pm0 build`, and `/pm0 handoff`.
4. `Open source`
   Link the GitHub repository, note the open-source/MIT posture, and briefly acknowledge
   the broader agent-skill ecosystem.
5. Footer feedback
   Use a low-pressure feedback route: `Have feedback or a real product question? DM Fouad.`

Tone:

- Direct, founder-friendly, and open-source native.
- More manual/specimen than SaaS landing page.
- No fake metrics, testimonials, pricing, waitlist, or access language.

## Hero Behavior

The hero physics layer should be a React island.

Requirements:

- Cards are DOM elements controlled by Matter.js bodies, so icons and text remain crisp.
- Desktop cards spawn from both sides while leaving the hero copy readable.
- Mobile uses fewer cards and a narrower spawn pattern.
- Cards are draggable by mouse on desktop. On mobile, the card layer should not intercept
  touch gestures across the full hero because page scrolling is more important than dragging
  decorative background items.
- Cards represent a dense product-input cloud, using the old marketing hero as the baseline:
  Intercom tickets, Linear issues, Slack messages, user uploads, interviews, emails, user
  stories, GitHub issues, Figma comments, Notion docs, Jira tickets, Granola notes, PostHog
  events, analytics tools, task tools, Miro boards, CRM records, calls, feedback, exports,
  surveys, roadmaps, changelogs, session replay, launch notes, data warehouse, research repo,
  and stakeholder decks.
- Use `svgl-react` logos only where the package has a practical match. Use Phosphor domain
  icons for unsupported brands instead of mismatched placeholders. In particular, GitHub uses
  the current `GitHubDark` logo and `Research repo` uses a book/research icon, not Granola.
- Use brand logos from `@ridemountainpig/svgl-react` when available.
- Fall back to Phosphor icons when a specific logo export is unavailable.
- `prefers-reduced-motion` disables physics and shows a static fallback arrangement.

## Non-Goals

- No waitlist.
- No account backend.
- No long-form founder memo.
- No pricing page.
- No testimonials or artificial social proof.
- No analytics token copied from another project.

## Verification

Before completion:

- Install dependencies with `pnpm install` if needed.
- Run `pnpm check` or equivalent format/lint/type checks.
- Run the existing test suite with `pnpm test`.
- Run `pnpm build`.
- Start the local dev server and verify the page in the in-app browser.
- Check desktop and mobile widths.
- Confirm that falling cards render, move, and do not obscure the primary hero copy.
- Confirm the install command copy affordance works.
- Confirm reduced-motion fallback is usable.

## Approved Decisions

- Primary action is install: `npx skills add KDotIndustries/pm0`.
- `DM Fouad` is retained as a header/footer feedback route.
- Use the Editorial Specimen visual direction.
- Implement approach 1: Astro single-page specimen copied from the `khatib.gg` skeleton,
  with a Matter.js React island.
