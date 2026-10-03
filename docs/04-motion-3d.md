# Motion and 3D

Three signature moments carry the site. Everything else moves quietly around them.

1. **Press play (hero):** a hi-fi tape deck wakes up: VU needles swing, the orange display counts SIDE A 000 to 007 and the LED ladder fills, in about 1.5 seconds (once per visit). A 3D cassette tilts with the cursor. On scroll the name splits, the player rises, its door opens, the tape slides in, the door shuts, play presses down and the reels spin.
2. **Rack and case study:** hover slides a spine out of the rack; visitors can drag tapes to reorder their own mix (GSAP Flip, saved in their browser). Click pulls the tape out and its J-card unfolds into the case-study page (React ViewTransition).
3. **Plug in (contact):** orange-foam headphones whose 3D cable, with rope physics, swings toward the cursor. The plug can be dragged into the player's jack, or the visitor clicks the email.

## Stack

- GSAP: ScrollTrigger, SplitText, Flip.
- Three.js through React Three Fiber. Models are built in code: no downloaded models, no licence issues.
- Custom shaders for pixel-dither and LCD effects, used sparingly.
- Lenis for smooth scroll.
- React ViewTransition with `transitionTypes` on Link for page changes.

## Timing rules

- Boot: 2 seconds or less, not replayed on return visits within a session.
- UI feedback 150–400 ms. Big moments 600–900 ms.
- One wow moment per section.
- Optional UI sound, off until the visitor switches it on.
- Reduced motion: no boot, no scroll scenes, all content still there.

## ViewTransition rules

- Never two mounted elements with the same transition name. Name the clicked spine only at click time.
- If view transitions are unsupported or aborted, fall back to plain navigation.

## Performance rules

- 3D loads after the page is visible and renders only while on screen.
- Pixel ratio capped at 2. Still-image fallback when WebGL is missing or the device is weak.
