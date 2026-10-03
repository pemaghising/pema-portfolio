---
name: portfolio-build
description: The step-by-step process for designing and building Pema Ghising's portfolio (retro cartridge concept). Use whenever working on this site's design, sections, motion, 3D, content or launch, or when asked what step comes next.
---

# Portfolio build process

This repo is Pema Ghising's portfolio. Before any design or build work, read `docs/README.md` and the doc for the area you are touching. The docs are the source of truth; this skill is how to work.

## Where things are

- Brief, audience, site map: `docs/01-brief.md`
- The 14 steps and current status: `docs/02-process.md`
- Colours, type, layout: `docs/03-design-system.md`
- Signature moments, stack, timing, ViewTransition and performance rules: `docs/04-motion-3d.md`
- Content rules and what Pema still has to supply: `docs/05-content.md`
- Decision log: `docs/06-decisions.md`
- Approved hero prototype (the quality bar): `docs/prototypes/hero.html`
- All site copy: `data/site.ts`

## How to work

1. Find the current step in `docs/02-process.md`. Work on one step or one section at a time.
2. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (this Next.js version has breaking changes; see AGENTS.md).
3. Build the section to the quality of the hero prototype: real light and depth, precise type, short mechanical motion, one wow moment per section.
4. Content comes only from `data/site.ts`. Never invent clients, stats, dates, project details or imagery. Missing content gets a designed empty state.
5. Never modify `public/roomie/**` or the `/roomie` rewrite in `next.config.ts`, and never reuse their copy, images or colours.
6. Check the section against its definition of done (below), then show Pema and wait for approval.
7. Update `docs/02-process.md` status and add a row to `docs/06-decisions.md` for any decision made.
8. Commit as `pemaghising <pema.ghising133@gmail.com>` on the `fresh-start` branch and push. Commit messages and files describe the work only.

## Definition of done

- `npm run build` and `npx eslint .` pass.
- Production build (`npm start`) checked in headless Chromium at 1920×1080, 768×1024, 390×844 and with reduced motion. Test tooling stays in a scratch folder, never in the repo.
- Keyboard focus visible, text is real HTML, contrast passes WCAG AA.
- 3D loads after first paint, pauses off screen, and has a still fallback.
- For the case-study transition: hover → click → case study, back, direct load, all reliable.

## Asking Pema

Pema prefers short, plain messages and visible results over long explanations. Ask only questions whose answers change what gets built, and offer a recommended option.
