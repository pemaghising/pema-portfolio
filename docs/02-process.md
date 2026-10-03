# Build process

How a professional portfolio gets made, step by step. Each step ends with Pema's approval before the next starts, and every step is committed and pushed.

| # | Step | Output | Status |
| --- | --- | --- | --- |
| 1 | Discovery | Goals, audience, lead projects (01-brief.md) | Done |
| 2 | Curate the work | 4–6 strongest projects, each with a short story | In progress: Addy, Frogtoberfest |
| 3 | Research and references | Mood board, reference sites | Done |
| 4 | Concept | One idea that ties the site together | Done: retro tech, collected |
| 5 | Visual system | Colours, type, grid, materials (03-design-system.md) | Done |
| 6 | Wireframes | Page structure, mobile and desktop | Covered by the site map |
| 7 | Key screens | Hero, work index, one case study | Hero done as prototype |
| 8 | Motion prototypes | Signature moments tested in a browser | Hero done (prototypes/hero.html) |
| 9 | Copy and assets | Case-study text, covers, reels, optimised images | Waiting on Pema |
| 10 | Build | Foundation, then section by section | Next |
| 11 | Polish | Micro-interactions, timing, sound, loading and empty states | Not started |
| 12 | Quality checks | Lighthouse, mobile, accessibility, browsers, SEO | Not started |
| 13 | Launch | Domain, analytics, soft launch for feedback | Not started |
| 14 | Promote | Awwwards, CSSDA, FWA, Dribbble, Behance, LinkedIn | Not started |

## Build order (step 10)

1. Foundation: tokens, fonts, grid, nav, libraries
2. Hero (from the prototype)
3. Work shelf and case-study transition
4. Motion tape deck
5. About and Experience
6. Experiments
7. Contact cable
8. Favicon, share image, SEO, testing, Lighthouse, pull request

## Definition of done for each section

- `npm run build` and `npx eslint .` pass.
- Checked on the production build at 1920×1080, 768×1024, 390×844 and with reduced motion.
- No invented content; everything comes from `data/site.ts`.
- Docs updated (this table, 06-decisions.md).
