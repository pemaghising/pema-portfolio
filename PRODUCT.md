# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal priority: hiring managers/recruiters evaluating Pema Ghising for graphic/motion design roles, and prospective freelance clients or collaborators considering commissioning design or motion work. Both arrive to assess craft, range, and fit before reaching out.

## Product Purpose

A personal portfolio site for Pema Ghising, a graphic & motion designer with 7+ years of experience (currently Lead Graphic Designer at Leapfrog Technology). The site communicates who Pema is, what they do, and how they think about design, and drives visitors to get in touch (job opportunities, freelance/collaboration inquiries).

## Positioning

Sits at the intersection of graphic design, motion, storytelling, and technology — not a single-discipline specialist. Espouses "clarity over decoration": design that communicates cleanly rather than for its own sake. Curious about how AI and emerging tools change creative workflows, without treating technology as the point.

## Operating Context

Single-page scrolling site (`app/page.tsx`) built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and Framer Motion for scroll-driven reveal animations. Sections in order: Hero, Bio, What I Do, Currently, Philosophy, Experience, Tools, Design+Tech, Beyond Design, Looking Forward, Contact. Single active theme (`app/themes/dark.css`) — the earlier `purple.css`/`warm.css` alternates were unused dead code and were removed.

## Capabilities and Constraints

- No CMS or backend — all copy lives in `data/content.ts` as static structured content.
- No "Work" / "Case Studies" / project-samples section exists yet. This is a **known, durable gap**: project work is planned but not yet built or supplied. Future work should design for a projects/case-studies section even before real case-study content exists (e.g., scaffolding, placeholder-aware layout) — do not treat the current sample-free structure as a deliberate final decision.
- External proof currently routed through social links (LinkedIn, Instagram; Behance link is a placeholder `#` — not yet live).
- Contact funnel: direct email (pema.ghising133@gmail.com) plus social links, no contact form currently.

## Brand Commitments

Name: Pema Ghising. Role framing: "Graphic & Motion Designer." No visual identity element (mark, font, palette) is locked as binding — the current purple theme, "PG" personal mark, and editorial/grid-based layout are incumbent implementation and evidence of prior direction, not a confirmed constraint. Future design work is free to refine or replace them.

## Evidence on Hand

- Real bio copy, role history (Leapfrog Technology, 2021–present), tool list (Figma, After Effects, Premiere Pro, Illustrator, Photoshop, Google Slides, Frame.io, AI tools), and personal-interest content (music, movement, play, watch, read) — all in `data/content.ts`.
- No project case studies, work samples, testimonials, or client logos exist yet. Do not fabricate any.
- Behance link is a non-functional placeholder (`href: "#"`) pending a real profile/URL.

## Product Principles

1. Clarity over decoration — design should communicate, not just perform.
2. Range over specialization — the story is graphic + motion + brand + digital, not one discipline.
3. Craft is demonstrated through the site itself, not just described in copy (the portfolio is itself a work sample).
4. Design and technology are explored together, not treated as separate tracks.
5. Serve both audiences (recruiters and freelance clients) without splitting the site into two funnels — one coherent narrative, one contact path.
