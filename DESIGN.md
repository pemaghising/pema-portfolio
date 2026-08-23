---
name: Pema Ghising Portfolio
description: A dark, blueprint-precise editorial portfolio for a graphic & motion designer
colors:
  ink-black: "#121212"
  drafting-surface: "#181818"
  primary-paper: "#f5f5f5"
  secondary-graphite: "#a3a3a3"
  blueprint-violet: "#a855f7"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 13vw, 11rem)"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.75rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.2em"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.15em"
rounded:
  none: "0px"
  sm: "2px"
  pill: "9999px"
spacing:
  section-x: "24px"
  section-x-md: "40px"
  section-y: "128px"
  grid-gap: "16px"
components:
  link-cta:
    textColor: "{colors.primary-paper}"
    typography: "{typography.label}"
  link-cta-hover:
    textColor: "{colors.blueprint-violet}"
  grid-cell:
    backgroundColor: "{colors.drafting-surface}"
    textColor: "{colors.primary-paper}"
    rounded: "{rounded.none}"
    padding: "32px"
  grid-cell-hover:
    backgroundColor: "{colors.blueprint-violet}"
  index-badge:
    textColor: "{colors.blueprint-violet}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "4px 10px"
---

# Design System: Pema Ghising Portfolio

## Overview

**Creative North Star: "The Architect's Blueprint"**

The site reads as a technical drawing brought to life: a near-black drafting surface, a barely-visible 12-column grid printed under everything, hairline rules instead of boxes, and a single violet "ink" reserved for the marks that matter — icons, hovers, index numbers, one dot per marquee loop. Type does the loudest work in the system: oversized Instrument Serif display lines carry the emotional weight, while small, wide-tracked uppercase Inter labels ("PG / 03", "GET IN TOUCH") behave like drafting annotations — precise, restrained, never decorative for its own sake.

Motion is mechanical and kinetic rather than ornamental: the "PG" monogram assembles itself letter-by-letter on load like a machine calibrating, section headlines and grid cells rise into place on scroll with a consistent easing curve, and the tools marquee reacts to scroll velocity like something with real inertia. Nothing glows, bounces, or plays for attention — precision is the personality. The system explicitly rejects the bright, multi-color, rounded-bubble "friendly SaaS" look and the glossy, shadow-heavy corporate-agency look; both would break the blueprint illusion.

**Key Characteristics:**
- Near-black surface with a faint printed grid and film-grain noise as the base texture
- One accent color (Blueprint Violet) used sparingly and consistently — never as a fill, almost always as ink, with one deliberate exception at display scale: the terminal period of every major headline
- Oversized serif display type paired with small, wide-tracked uppercase sans labels
- Flat by default: depth comes from hairline borders and surface/opacity shifts, not shadows
- Square, sharp-edged geometry everywhere except the small pill-shaped index badges

## Colors

A two-tone dark palette (ink black + off-white paper) with exactly one saturated accent, used the way a draftsman uses colored ink on a blueprint — sparingly, and always meaningfully.

### Primary
- **Primary Paper** (#f5f5f5): Main text color for headlines, body copy, and the PG monogram. Reads as ink/paper against the dark ground.

### Secondary
- **Blueprint Violet** (#a855f7): The system's only accent. Used for section-index labels, icon accents (a single node/line per icon), link/nav hover states, the marquee's separator dot, focus rings, and the terminal period of every major headline (see The Full Stop Rule). Never used as a large fill.

### Neutral
- **Ink Black** (#121212): Page background — the "drafting surface" the whole system sits on.
- **Drafting Surface** (#181818): Slightly raised panel color for grid-cell rows (What I Do, Currently, Beyond Design) — the one-step lighter tone that reads as a card without a shadow.
- **Secondary Graphite** (#a3a3a3): Supporting body copy and subtitle text — dimmer than Primary Paper so headlines keep priority.

### Named Rules
**The Single Accent Rule.** Blueprint Violet appears only as ink (text, icon strokes/nodes, borders, dots) — never as a background fill on a UI element of consequence. Its rarity is what makes it register as a signal.

**The Full Stop Rule.** Almost every major headline on the site ends in a period ("CURRENTLY.", "I'M PEMA.", "SOMETHING MOVE."). That terminal period is always set in Blueprint Violet, colored via a shared `accentPeriod()` helper — never any other punctuation, never mid-sentence, never in body copy. It's the single deliberate place the accent is allowed to appear at display scale, extending the system's existing "dot" vocabulary (the marquee separator, tag bullets, badge borders) up to the biggest type on the page without adding a second color or turning violet into a fill.

**The Hairline Border Rule.** Structure is drawn with 1px borders at 10% primary-paper opacity (`border-primary/10`), not with cards, shadows, or heavier strokes. This is the system's substitute for elevation.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif fallback)
**Body/Label Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A large, quiet serif for statement moments against a small, mechanical, all-caps sans for every functional and meta element — the pairing itself performs "editorial meets blueprint annotation."

### Hierarchy
- **Display** (400, `clamp(2.75rem, 13vw, 11rem)`, line-height 0.85): Hero identity mark and hero statement lines only ("DESIGN THAT MOVES").
- **Headline** (400, `clamp(2.75rem, 8vw, 6rem)`, line-height 0.9): Every section's opening line ("WHAT I DO.", "CURRENTLY.").
- **Title** (400, `clamp(1.75rem, 4vw, 2.75rem)`, line-height 1.1): In-grid card titles (Beyond Design item titles, tool marquee entries).
- **Body** (400, 1rem–1.125rem, line-height 1.5): Paragraph copy in Secondary Graphite, max-width capped (`max-w-md`/`max-w-sm`/`max-w-xl`) rather than full column width.
- **Label** (400, 0.75rem, letter-spacing 0.2em, uppercase): Section index tags, nav/CTA links, tool-tag lines. Always uppercase, always wide-tracked.
- **Micro** (400, 0.625rem, letter-spacing 0.15em, uppercase): The smallest annotation step, reserved for compact fixed-size contexts where a full Label would overpower the element — the hero scroll cue and the Currently index-badge pill. Not for general use.

### Named Rules
**The Uppercase Label Rule.** Every non-prose piece of type — section labels, index numbers, nav links, CTAs, tag lists — is small, uppercase Inter with 0.15–0.2em letter-spacing. It never competes with the serif display type; it annotates it.

## Layout

A strict 12-column "editorial" grid (`grid-template-columns: repeat(12, minmax(0,1fr))`) with a 16px column gap, printed faintly under the entire page via a fixed `ArchitecturalGrid` overlay (12 hairline columns at 4% opacity) plus a fractal-noise texture overlay at 4% opacity — both `pointer-events-none` and purely atmospheric.

Sections use generous vertical rhythm: `py-32` (128px) section padding, `px-6 md:px-10` (24px/40px) horizontal padding. Content is deliberately asymmetric within the grid rather than centered — headlines typically span columns 1–8/9, supporting copy or secondary content is pushed to columns 5–12 or right-aligned in the remaining columns, echoing a drafting layout rather than a centered marketing layout. Grid-cell sections (What I Do, Currently, Beyond Design) collapse from a bordered N-column row on desktop to a single column on mobile, with hairline borders redistributed per breakpoint so no cell ever shows a dangling edge.

## Elevation & Depth

Flat by default: no `box-shadow` appears anywhere in the current implementation. Depth is conveyed entirely through hairline borders, a one-step surface-color shift (Ink Black → Drafting Surface), and low-opacity accent washes on hover (`hover:bg-accent/5`). This is the working default, not a permanent prohibition — a future component (e.g. a modal or dropdown) may introduce real elevation if the interaction genuinely needs it, but nothing in the current system should reach for a shadow as a default styling choice.

## Shapes

Sharp and square by default (`rounded-none` on all grid cells and structural elements) — the blueprint reads as drawn with a ruler, not a rounded-corner tool. The one deliberate exception is the fully rounded pill (`rounded-full`) used for small numeric index badges (Currently section), which reads as a stamped marker rather than a container. Corner-mark decorations (Hero's crop marks) reinforce the drafting/print-production reference directly.

## Components

Interaction across the system is mechanical and kinetic: color/position changes are exact, timed, and driven by scroll or hover state rather than decorative easing for its own sake — the PG monogram assembly, scroll-linked marquee, and staged grid-cell reveals are the system's signature move, not a one-off flourish.

### Links / CTAs
- **Style:** Plain text, uppercase label typography, no background or border.
- **Default:** Primary Paper text.
- **Hover / Focus:** Color shifts to Blueprint Violet over 200–300ms; the Contact CTA additionally translates its arrow glyph `→` 4px on hover (`group-hover:translate-x-1`).

### Grid Cells (signature component)
- **Corner Style:** `rounded-none`.
- **Background:** Drafting Surface (`bg-surface`) at rest.
- **Border:** Hairline `border-primary/10`, redistributed per cell/breakpoint so no dangling edges appear.
- **Hover:** Background washes to `accent/5`; icon and heading text shift from Primary Paper to Blueprint Violet.
- **Internal Padding:** 32px (`p-8`).
- **Reveal:** Cells animate in with `opacity 0 → 1`, `y: 20 → 0`, staggered ~0.1s per cell, `viewport once`.

### Index Badges
- **Style:** `rounded-full` pill, 1px `border-accent/30`, Blueprint Violet text, label typography, small padding (`px-2.5 py-1`).
- **Use:** Numeric markers inside Currently cards only.

### Navigation
- **Style:** Fixed header, `bg-background/90` with `backdrop-blur-md`, full-bleed `inset-x-0`.
- **Mark:** Compact "PG" monogram; on hover/focus, hidden letters ("EMA", "HISING") reveal via an animated `grid-template-columns: 0fr → 1fr` transition, and the mark's color shifts Primary Paper → Blueprint Violet.
- **Focus:** `focus-visible:ring-2 ring-accent` with offset, on the logo link.

### PG Monogram (signature component)
- **Hero variant:** On load, assembles through five timed stages (max spacing → collapsed "PG" → stacked "P / G" → expanded "PEMA / GHISING"), using shared-layout animation (`layout` prop) so each stage physically settles rather than cross-fading. Respects `prefers-reduced-motion` by skipping straight to the final state.
- **Compact variant:** Static "PG", expands inline to the full name on hover/focus via the same grid-template-columns technique used in Navigation.

### Tools Marquee (signature component)
- **Style:** Continuous horizontal scroll of serif tool names separated by a single Blueprint Violet interpunct (`·`), bounded top and bottom by hairline `Divider` rules.
- **Behavior:** Base drift plus scroll-velocity-driven acceleration/direction reversal (via Framer Motion `useVelocity`/`useSpring`); disabled under `prefers-reduced-motion`. Duplicated content track (`sr-only` text carries the accessible list) so the loop is seamless.

### Divider
- **Style:** 1px hairline (`bg-primary/10`), full width.
- **Reveal:** `scaleX: 0 → 1` from the left edge on scroll into view, 1s duration.

## Do's and Don'ts

### Do:
- **Do** keep Blueprint Violet to ink-only usage — text, strokes, borders, dots, badges — never a large fill.
- **Do** pair every non-prose label (index tags, CTAs, tags, nav) with uppercase Inter and 0.15–0.2em tracking.
- **Do** build depth with hairline borders and the Ink Black → Drafting Surface step, not shadows, as the default.
- **Do** keep grid cells `rounded-none`; reserve `rounded-full` for small stamped badges only.
- **Do** respect `prefers-reduced-motion` on every custom animation (monogram, marquee, reveals) the way the existing components already do.

### Don't:
- **Don't** introduce a second accent color — the system's power comes from having exactly one.
- **Don't** reach for `box-shadow` as a default styling choice; treat it as an exception that needs justification.
- **Don't** center content symmetrically within the 12-column grid — the asymmetric, drafting-table composition (headline left/wide, support right/narrow) is the system's layout signature.
- **Don't** pull this toward a bright, rounded, multi-color "friendly SaaS" look or a glossy, shadow-heavy "corporate agency" look — both were explicitly rejected as anti-references.
