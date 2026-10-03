# Project brief

## Overview

A new portfolio for Pema Ghising, Graphic & Motion Designer with 7+ years of experience, Lead Graphic Designer at Leapfrog Technology. The site presents the work as a mixtape: projects are cassettes in a tape library. It is built to be submitted to Awwwards (Site of the Day / Month) and shared as shots and clips on Behance and Dribbble.

- **Audience, in order:** product companies (in-house brand and design teams), freelance clients, award juries.
- **What a visitor leaves with:** Pema's name, what Pema does, a feel for the craft, an easy way to get in touch.
- **Lead projects:** Addy and Frogtoberfest get full case studies first. Other projects stay "In preparation" until their visuals are ready.
- **Assets:** some project visuals are ready, others still need work.
- **Domain:** pemaghising.com.np. Repo branch for the rebuild: `fresh-start`.

## Concept: Mixtape

The work is a mixtape. Each project is a cassette in a tape library, with its own J-card, catalogue number and side. The hero loads Pema's tape into a portable cassette player and presses play. It draws on Pema's interests: Walkmans, cassettes, wired earphones, 80s tech, collecting music and films.

The earlier cartridge concept (Famicom) is kept as a backup: `prototypes/hero.html`.

- **Feel:** a clean photo studio with real objects in it. Brushed aluminium, smoked plastic, paper labels, soft light, grain, big confident type. Premium, never kitsch.
- **Japanese detail:** Pema's name in katakana (ペマ・ギシン), as on 80s Japanese tape packaging.
- **Mechanical motion:** doors swing, keys press, reels spin, spines slide. Short and precise.
- **Avoid:** synthwave neon, sunset gradients, VHS glitch overload, kitsch, glossy skeuomorphism, real brand marks (no Sony, Walkman, TDK or Maxell names or logos).

## Site map

| Section | Concept | Shows |
| --- | --- | --- |
| Nav | Device strip | PG monogram, Work / About / Experiments / Contact as hardware buttons, a sound icon. No full name, role, timecode or section label |
| Hero | Label maker + press play | Name, role, statement; the tape loads into the player on scroll |
| Work | The tape library | Projects as cassette cases showing their cover (J-card front); visitors can drag them into their own order |
| Case study | The J-card unfolded | Project page; "In preparation" + noindex until it has content |
| Motion | Tape deck | Reels play in a deck with spinning reels; "No tape loaded" until reels exist |
| About | Liner notes | Bio, four disciplines, philosophy, tools |
| Experience | Tracklist | Roles as tracks, newest first; Leapfrog "now playing" |
| Experiments | B-sides | Empty slots until experiments exist; an "on rotation" strip |
| Contact | Plug in | The invite line from data; three tiles: Email, LinkedIn, Instagram (no address written out); headphones whose cable you drag into the player, with a red arrow on the player marking the jack |

Roomie links to its existing standalone page at `/roomie` and is never redesigned or reused.

## Quality bar

- Lighthouse 90+ target, real scores reported.
- Real HTML for all text, keyboard navigation, reduced-motion support, WCAG AA contrast.
- Checked at 1920×1080, 768×1024, 390×844 and with reduced motion, on the production build.
- Metadata, JSON-LD, sitemap, robots, favicon, share image.
