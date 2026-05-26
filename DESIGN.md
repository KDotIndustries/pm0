---
name: PM0
description: Repo-native product memory for AI coding agents.
colors:
  ink: 'oklch(15% 0.027 151)'
  paper: 'oklch(96% 0.015 88)'
  graph: 'oklch(93% 0.016 91)'
  muted: 'oklch(44% 0.025 128)'
  line: 'oklch(73% 0.017 104)'
  command: 'oklch(78% 0.064 239)'
  command-deep: 'oklch(42% 0.09 239)'
  evidence-amber: 'oklch(84% 0.104 78)'
  evidence-blue: 'oklch(78% 0.064 239)'
  evidence-rose: 'oklch(78% 0.092 25)'
typography:
  display:
    fontFamily: 'Rockwell, Roboto Slab, Georgia, Times New Roman, serif'
    fontSize: 'clamp(3rem, 10vw, 4.8rem)'
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: '0'
  headline:
    fontFamily: 'Rockwell, Roboto Slab, Georgia, Times New Roman, serif'
    fontSize: 'clamp(2.25rem, 5vw, 3.75rem)'
    fontWeight: 900
    lineHeight: 1
    letterSpacing: '0'
  title:
    fontFamily: 'Rockwell, Roboto Slab, Georgia, Times New Roman, serif'
    fontSize: '1.875rem'
    fontWeight: 900
    lineHeight: 1
    letterSpacing: '0'
  body:
    fontFamily: 'Geist Mono, ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New, monospace'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: '0'
  label:
    fontFamily: 'Geist Mono, ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New, monospace'
    fontSize: '0.78rem'
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: '0'
rounded:
  none: '0px'
spacing:
  xs: '0.5rem'
  sm: '0.75rem'
  md: '1rem'
  lg: '1.25rem'
  xl: '2rem'
components:
  command-button:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '0.75rem 1rem'
  evidence-slip:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.none}'
    padding: '0.72rem'
    width: 'min(10.85rem, 44%)'
  logo-tile:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    size: '2.25rem'
  ledger-panel:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '1.25rem'
---

# Design System: PM0

## 1. Overview

**Creative North Star: "The Field Notebook Ledger"**

PM0 should feel like a sharp product operator's notebook left open next to a terminal: tactile, practical, slightly messy, and visibly useful. The surface is a brand landing page for an open-source skill, not a SaaS dashboard. It communicates through paper texture, command affordances, hard-edged artifacts, and evidence becoming order.

The system uses a restrained notebook palette with one clear command accent. Visual energy comes from physical arrangement: gravity cards, rotated slips, ledger grids, line paper, and offset shadows. Do not polish away the mess; make the mess legible.

It explicitly rejects generic AI SaaS, heavy enterprise PM suites, vague AI-hype landing pages, enterprise workflow software, waitlist framing, inflated platform claims, decorative dashboards, abstract productivity promises, and anything that implies PM0 is a hosted product-management app.

**Key Characteristics:**

- Square, tactile, paper-first surfaces with visible borders.
- Command-line credibility without becoming a developer-only toy.
- Scattered product inputs resolving into structured product memory.
- Restrained blue command accent, used as evidence and action, not decoration.
- Motion is purposeful: gravity, scan lines, and short reveal timing only.

## 2. Colors

The palette is notebook paper, dark ink, pale ledger lines, and a quiet blue command marker.

### Primary

- **Command Blue:** The install command, focus rings, links, selected states, memory labels, and the underline under "move." It should appear sparingly so it still feels like action.
- **Deep Command Blue:** Section kickers, brand accent, and small product-system labels. Use it when the accent needs more authority than the pale blue.

### Secondary

- **Evidence Amber:** Metrics, tickets, and warm evidence slips. Use it to mark product signals and timing.
- **Evidence Rose:** Feedback, complaints, and human-input artifacts. Use it for customer or stakeholder mess.
- **Evidence Blue:** Interview and research artifacts. Use it for learning-oriented inputs.

### Neutral

- **Notebook Ink:** Primary text, borders, dark panels, and structural rules.
- **Notebook Paper:** The base canvas and default surface color.
- **Graph Paper:** Alternating section background and quiet card fill.
- **Muted Pencil:** Body copy and secondary explanations.
- **Ledger Line:** Ruled-paper lines, dividers, and low-emphasis grid marks.

### Named Rules

**The Blue Is A Command Rule.** Command Blue is for action, source, selection, or evidence. Never spread it across the page as generic brand decoration.

**The Paper Must Stay Warm Rule.** Avoid sterile white, cold gray, or pure black. Every neutral should feel like ink or paper, not software chrome.

## 3. Typography

**Display Font:** Rockwell with Roboto Slab, Georgia, and Times New Roman fallbacks.
**Body Font:** Geist Mono with system monospace fallbacks.
**Label/Mono Font:** Geist Mono.

**Character:** The pairing is deliberately mechanical and notebook-like. Rockwell gives the page founder-readable confidence; Geist Mono carries commands, artifact names, logs, and evidence without turning the whole page into a terminal costume.

### Hierarchy

- **Display** (900, large fluid clamp, tight line-height): Hero-only type such as "Bring the mess. Find the move."
- **Headline** (900, section-scale fluid type, line-height 1): Major section claims like "Product work with recipes."
- **Title** (900, 1.875rem, line-height 1): Loop cells and compact panel headings.
- **Body** (400, 1rem, relaxed line-height): Explanatory copy, memory rows, and longer founder-readable paragraphs. Keep line length under 75ch.
- **Label** (400, 0.78rem, no letter spacing): Section kickers, artifact names, nav, command metadata, and ledger labels.

### Named Rules

**The No Costume Mono Rule.** Mono is allowed because PM0 is command-native, but it must carry real commands, evidence labels, and artifact text. Do not use mono as generic tech styling.

**The Big Claim Rule.** Use Rockwell for claims, not decoration. If the text is not a product-positioning statement, it should usually stay in Geist Mono.

## 4. Elevation

PM0 uses structural, hard offset shadows rather than soft ambient elevation. Surfaces should feel like paper pieces, command bars, and ledger panels sitting on a desk. Depth is physical and low-tech: one border, one offset shadow, no blur-heavy glass.

### Shadow Vocabulary

- **Artifact Shadow** (`4px 4px 0 color-mix(in oklch, var(--color-ink) 14%, transparent)`): Evidence slips and logo tiles.
- **Command Shadow** (`8px 8px 0 color-mix(in oklch, var(--color-command) 22%, transparent)`): Install command button and primary command affordances.
- **Ledger Shadow** (`10px 10px 0 var(--color-command)`): Dark memory panels that need to read as a decisive output.
- **Stack Shadow** (`12px 12px 0 color-mix(in oklch, var(--color-ink) 13%, transparent)`): Large outcome cards and stacked notebook blocks.

### Named Rules

**The Hard Shadow Rule.** Shadows are offset blocks, never blurred glow. If a surface starts to look like glassmorphism or generic SaaS elevation, remove the effect.

## 5. Components

### Buttons

- **Shape:** Square and bordered (0px radius).
- **Primary:** Paper background, ink text, Command Blue border, Command Shadow, and a compact mono command label.
- **Hover / Focus:** Hover may translate up slightly. Focus must use a visible Command Blue outline with offset.
- **Secondary / Ghost:** Text or bordered links only. Keep them quieter than the command button.

### Chips

- **Style:** Use bordered paper or evidence-color slips instead of rounded pills.
- **State:** If selected, use Command Blue or Deep Command Blue. Do not use generic pill gradients.

### Cards / Containers

- **Corner Style:** Square corners only.
- **Background:** Notebook Paper, Graph Paper, or a named evidence color.
- **Shadow Strategy:** Use Artifact Shadow for slips and tiles; use Stack Shadow for larger outcome blocks.
- **Border:** One-pixel ink border is the default structural edge.
- **Internal Padding:** Compact by default: 0.72rem on slips, 1rem to 1.25rem on panels.

### Inputs / Fields

- **Style:** PM0 has no conventional form fields on the landing page. When needed, fields should look like command-line or ledger entries: square, bordered, paper background, mono text.
- **Focus:** Command Blue outline, 2px width, visible offset.
- **Error / Disabled:** Use Evidence Rose for error states and Muted Pencil for disabled states.

### Navigation

- **Style:** Small mono links, no pills, no nav cards. Default state is muted ink; hover reveals an underline and stronger ink.
- **Mobile Treatment:** Keep navigation short. Preserve the GitHub/source link and avoid wrapping the header into a marketing menu.

### Command Copy

The install command button is the primary conversion component. It must include a terminal icon, the literal install command, a copy affordance, Command Blue border, paper fill, and Command Shadow. It should feel like something a founder or PM can actually use, not a decorative CTA.

### Gravity Input Cards

Gravity cards are the signature PM0 motion pattern. They represent messy inputs falling into the product process. Cards must stay readable, with an icon tile, short label, paper/evidence tone, hard border, and hard shadow. Respect `prefers-reduced-motion` by placing them statically.

### Evidence Wall

The evidence wall is a ruled-paper composition of rotated slips and logo-only integration tiles. Slips sit above logos; logos are contextual source artifacts, not a logo garden. Keep artifact text legible even when the pile is visually dense.

### Ledger Memory Panel

The dark memory panel is the ordered output. Use ink background, paper text, Command Blue labels, thin dividers, and a subtle scan-line motion. It should contrast with the messy evidence wall without becoming a SaaS dashboard.

## 6. Do's and Don'ts

### Do:

- **Do** lead with the product loop, not a vague AI promise.
- **Do** make the install command, source access, and open-source nature immediately visible.
- **Do** show scattered product inputs becoming structured product work.
- **Do** keep copy concise, founder-readable, and skeptical of unnecessary process.
- **Do** preserve the gravity-item hero and use it to explain the product.
- **Do** use square borders, hard offset shadows, and warm paper backgrounds.
- **Do** use Command Blue for action, evidence, and source credibility.

### Don't:

- **Don't** make PM0 feel like generic AI SaaS.
- **Don't** make it feel like a heavy enterprise PM suite.
- **Don't** make it a vague AI-hype landing page.
- **Don't** make it look like enterprise workflow software.
- **Don't** use waitlist framing, inflated platform claims, decorative dashboards, or abstract productivity promises.
- **Don't** imply PM0 is a hosted product-management app.
- **Don't** make it feel like a developer-only CLI toy.
- **Don't** use glassmorphism, gradient text, generic rounded card grids, or soft SaaS glow.
- **Don't** replace evidence artifacts with a clean logo garden. Logos must feel thrown into the notebook.
