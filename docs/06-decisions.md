# Decision log

Newest first.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-10-03 | The orange-foam dot cursor from the prototype is back and replaces the system cursor on mouse and pen devices (sits exactly on the pointer, swells and stretches with the speed of the hand, opens into a ring over anything clickable). Touch devices are unchanged | It was in the prototype but missed in the build; two cursors at once looked wrong |
| 2026-10-03 | Loading screen becomes option B, "Deck": a hi-fi tape deck with VU meters, an orange LCD counting to 007 and an LED ladder (replaces the label maker). Options are in `docs/prototypes/loading-screens.html` | Pema wanted a more retro loader from the mood board and picked Deck |
| 2026-10-03 | The 3D code downloads during the counter and the scene is built (shaders pre-compiled) while it rests on 007, so the cassette flies in together with the name instead of after it | Pema saw the cassette arrive late |
| 2026-10-03 | Smoothness on modest devices: smooth scroll and scroll animation share one clock; 3D resolution and shadows scale to the device and step down if frames run slow; the contact cable is only rebuilt while it moves; no backdrop blur on the nav; the music meter no longer re-renders the page | Pema saw choppy animation on lower-GPU devices |
| 2026-10-03 | Music unlocks on the visitor's first click, tap or key anywhere, so it can start by itself when the tape goes in; if the browser still blocks it, the nav sound button pulses orange until tapped | Browsers block sound until a click; scrolling does not count |
| 2026-10-03 | Launch build: the prototype becomes the real Next.js site (hero, tape library with case-study pages, liner-notes About, Side B contact). Case studies without content are honest "in preparation" pages, kept out of search | Pema asked to go live |
| 2026-10-03 | 恋人へ ships with the site (`public/audio/koibito-e.mp3`) | Pema confirmed they hold the licence |
| 2026-10-03 | Contact links become a tracklist on a J-card (01 Email, 02 LinkedIn, 03 Instagram; hover "plays" the track with a small level meter). Hardware keys dropped; Plug in and Reset order go back to slim outlined buttons like the nav. Other options kept in `docs/prototypes/contact-variations.html` | Pema didn't like the key buttons |
| 2026-10-03 | Nav links and the sound button go back to the slim outlined buttons; the hardware-key style stays only on content buttons (Plug in, Reset order, contact keys) | Pema preferred the earlier nav |
| 2026-10-03 | Retro buttons everywhere: the rounded pill buttons (nav links, sound, Plug in, Reset order) become small silver hardware keys with a visible stem that press down; no pill shapes. Contact keys lose the arrow and scale their text to the key width so nothing overflows. The contact headline is sentence case, smaller and balanced so it reads easily | Pema's feedback: headline hard to read, pills not retro, text overflowing the keys |
| 2026-10-03 | Removed the copy-address icon from the Email key; Email is a plain mailto link | Pema's request |
| 2026-10-03 | Contact tiles redesigned as hardware keys (silver caps on a visible stem, orange for Email like the player's eject key, pressed down on click); the red arrow on the player is removed, the pulsing red ring round the jack stays as the only cue | Pema: tiles should fit the retro theme; remove the arrow |
| 2026-10-03 | Contact: three large tiles (Email, LinkedIn, Instagram) with icons, no email address written out, a small copy-address icon on the Email tile; the intro paragraph and "open to" pills removed. The "plug here" cue is a small red arrow printed on the player under the jack plus a pulsing red ring round the jack (replaces the floating 3D arrow) | Pema's feedback |
| 2026-10-03 | Contact: a red bobbing arrow and pulsing ring mark the jack where the plug goes (hidden once connected); the email is plain text with a mail icon, no highlight; icons added for LinkedIn, Instagram, copy and plug/unplug | Pema's feedback |
| 2026-10-03 | Contact: orange-foam headphones beside the player, a verlet-rope cable that reaches toward the cursor; drag the plug into the jack (or press Plug in) and the LED lights and the email underlines. Copy-email button, LinkedIn, Instagram and the "looking forward" text from `data/site.ts`. No form, no invented details | Pema's request |
| 2026-10-03 | Small print rule: nothing under about 5% of the cover width, and small labels use the bold text face, not the thin pixel face. Library captions stack (number, name, status) so long names never collide | Pema's feedback: small text was hard to read |
| 2026-10-03 | Hero layout: the name sits at the top and the cassette below it, so nothing overlaps. Nav is just a PG monogram, the section links and a sound icon (no full name, role or years) | Pema's feedback |
| 2026-10-03 | Nav: frosted solid bar (nothing shows through), shrinks on scroll, no dot before the name; the giant name fully fades out once the tape is inserted | Pema's feedback: text overlapped the player, name still visible behind it |
| 2026-10-03 | Back to the earlier player design (smoked dark cassette, aluminium-face landscape player, flat insert). The blue reference-style Walkman is kept as an alternative in `docs/prototypes/mixtape-blue-walkman.html` | Pema preferred the earlier look |
| 2026-10-03 | Player turned landscape again: the cassette slides in flat through a door that flips down (Pema liked the earlier sideways insert); keeps the reference styling (blue body, silver strip, yellow key) | Pema's feedback |
| 2026-10-03 | Player modelled on Pema's portable-player reference: portrait blue body, brushed-silver right strip, front door hinged left with a small upright reel window, yellow stop/eject + silver keys on top, volume wheel and jacks on the side. Cassette: cream shell, white label with red PG-001 print. No brand names; the door reads ペマ・ギシン and PG-1 | Pema's reference sheet |
| 2026-10-03 | Work section becomes a tape library: a grid of cassette cases showing cover art (5:8 J-card), placeholders until Pema designs covers; still draggable | Pema's request; covers show design work better than spines |
| 2026-10-03 | Tape rack is reorderable: visitors drag tapes (mouse anywhere, touch on the grip, Alt+arrow keys) to make their own mix; order saved per visitor, with a reset | Pema's request; the default order still comes from `data/site.ts` |
| 2026-10-03 | Hero music: 恋人へ starts when the tape is inserted (or on the first click if the browser has blocked sound), low volume, nav pause control | Pema asked for no press-play step |
| 2026-10-03 | Concept switched to Mixtape (Walkman and cassettes); cartridge concept kept as backup | Pema compared both prototypes and chose Mixtape |
| 2026-10-03 | Accent changes to headphone-foam orange #F26A21, with aluminium and player blue | Fits the Walkman look |
| 2026-10-03 | Foundation: tokens in `app/globals.css` (Tailwind `@theme`), fonts via `next/font`, device-strip nav, Lenis | Step 10.1 of the build |
| 2026-10-03 | Removed `framer-motion` and the deprecated `@studio-freight/lenis`; added `gsap`, `three`, `@react-three/fiber`, `lenis` | One motion stack (GSAP), current Lenis package |
| 2026-10-03 | Lead projects: Addy and Frogtoberfest | Pema's strongest work with visuals ready soonest |
| 2026-10-03 | Audience: product companies, freelance clients, award juries | Pema's answer in discovery |
| 2026-10-03 | Build process documented in `docs/` with a build checklist (`docs/07-build-checklist.md`) | Every session follows the same steps |
| 2026-10-03 | Cartridge model gets an insert tab with exposed gold contacts | Pema's feedback on the prototype |
| 2026-10-03 | Hero prototype approved as the quality bar | "The vibe is really nice", needs polish |
| 2026-10-03 | Stack adds GSAP, Three.js / React Three Fiber, shaders, Lenis | Pema asked for top-tier 3D and motion |
| 2026-10-03 | Fonts: Dela Gothic One, DotGothic16, Zen Kaku Gothic New | Famicom label feel; real katakana. Three families, overriding the earlier two-font limit |
| 2026-10-03 | Main colour Famicom red #9E1B32 with teal, mustard, cobalt label inks | Pema dropped the violet-and-black constraint |
| 2026-10-03 | Concept: retro tech, collected (Famicom cartridges) | Pema's references and interests |
| 2026-10-03 | Previous design removed; content in `data/` kept | Fresh start on `fresh-start` |
