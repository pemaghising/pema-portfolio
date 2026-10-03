# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

In order of priority (confirmed): product companies (in-house brand and design teams) deciding whether to hire or approach Pema; freelance clients looking for a graphic and motion designer; award juries (Awwwards Site of the Day / Month). Visitors arrive from LinkedIn, Instagram, shared shots and clips on Behance and Dribbble, or a direct link. Success for a visitor is leaving with Pema's name, what Pema does, a feel for the craft, and an easy way to get in touch.

## Product Purpose

A personal portfolio for Pema Ghising, a Graphic & Motion Designer with 7+ years of experience and Lead Graphic Designer at Leapfrog Technology since 2021. It presents selected projects and a point of view so that the right people get in touch (email, LinkedIn, Instagram). It is also built to be submitted to Awwwards and to supply shots and clips for Behance and Dribbble. Domain: pemaghising.com.np.

## Positioning

The work is presented as a mixtape: each project is a cassette in a tape library with its own catalogue number, and the hero loads Pema's tape into a portable cassette player. The concept comes from Pema's own interests (Walkmans, cassettes, wired earphones, 80s tech, collecting music and films), and the Japanese detail is Pema's name in katakana (ペマ・ギシン). A neighbouring designer could not truthfully copy it, because it is built from Pema's own taste.

## Operating Context

Pema is the sole owner and editor. All copy and structured facts live in one file, `data/site.ts`; project images go in `public/work/<slug>/`. Content is added as it becomes real, and the UI hides whatever is not there. Stack: Next.js (App Router) with Tailwind, GSAP and Lenis for motion and smooth scroll, and React Three Fiber for the 3D cassette and headphones. Dev command: `npm run dev`. Branch history: the rebuild lives on `fresh-start`, merged to `main`.

## Capabilities and Constraints

- Sections today: hero (tape-deck boot and scroll-driven player), the tape library of project cassettes (drag to reorder, saved in the visitor's browser), case study pages at `/work/[slug]`, About (liner notes, four disciplines, experience, tools, off the clock) and Contact (plug the headphones into the player, plus a tracklist of Email, LinkedIn and Instagram).
- Motion and Experiments sections stay hidden until real reels and experiments exist (confirmed). Nothing is shown as a placeholder for work that does not exist.
- A case study with no content shows "In preparation" and is noindex. Addy and Frogtoberfest are the lead case studies; other projects wait until their visuals are ready.
- Roomie links to its existing standalone page at `/roomie` and is never redesigned or reused (confirmed).
- Hero music (a licensed track) starts when the tape goes in; sound is blocked until the visitor interacts.
- Quality bar from the brief: Lighthouse 90+ with real scores reported, real HTML text, keyboard navigation, reduced-motion support and WCAG AA contrast, checked at 1920x1080, 768x1024 and 390x844 on the production build. Metadata, JSON-LD, sitemap, robots, favicon and share image are required.

## Brand Commitments

- Voice: Pema speaks for themself in the first person ("I"), never "Pema is..." (confirmed).
- Name and monogram: Pema Ghising, "PG"; katakana name used on labels.
- Not re-confirmed this session, but stated in `docs/01-brief.md`: avoid synthwave neon, sunset gradients, VHS glitch, kitsch and glossy skeuomorphism, and use no real brand marks (Sony, Walkman, TDK, Maxell).

## Evidence on Hand

- Real: Pema's role and tenure, the nine project names, the Roomie standalone page and its assets (`public/roomie/`), the soundtrack file, and the published LinkedIn and Instagram profiles.
- Absent, and must not be fabricated: case study content for all projects except possibly Roomie, project covers, categories and years, motion reels, experiments, a Behance profile, testimonials, client names, metrics and awards.

## Product Principles

1. Only published facts: missing information stays missing, and the interface hides it instead of inventing it (confirmed).
2. Pema's own voice, first person, plain and confident.
3. The craft is the pitch: the site itself must show the same design and motion standard Pema offers clients, in service of getting a message sent.
4. The concept has to survive scrutiny from a hiring manager: it is memorable, but contact and the work stay easy to find and reach.
5. Motion and 3D are never the only way to get anything: reduced motion, keyboard and touch visitors get the full content.

## Accessibility & Inclusion

WCAG AA contrast and full keyboard operation, as set in the brief. Reduced-motion visitors skip the boot sequence and get static equivalents. The orange accent currently falls short of AA contrast on light backgrounds (see the audit).
