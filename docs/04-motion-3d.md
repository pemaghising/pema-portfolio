# Motion and 3D

Three signature moments carry the site. Everything else moves quietly around them.

1. **Boot and insert (hero):** the LCD scrambles in ペマ・ギシン, then PEMA GHISING, in about 2 seconds. A 3D cartridge tilts with the cursor. On scroll the name splits, a console rises, the cartridge drops into the slot and the power LED turns on.
2. **Shelf and case study:** hover pulls a cartridge out and tilts it to the light. Click inserts it and its label expands into the case-study page (React ViewTransition).
3. **Plug in (contact):** a 3D wired earphone cable with rope physics swings toward the cursor. The plug can be dragged into a jack, or the visitor clicks the email.

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

- Never two mounted elements with the same transition name. Name the clicked cartridge only at click time.
- If view transitions are unsupported or aborted, fall back to plain navigation.

## Performance rules

- 3D loads after the page is visible and renders only while on screen.
- Pixel ratio capped at 2. Still-image fallback when WebGL is missing or the device is weak.
