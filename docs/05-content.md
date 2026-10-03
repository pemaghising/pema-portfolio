# Content

Every word on the site comes from `data/site.ts`, which holds only facts Pema has published (LinkedIn and the current site).

## Rules

- No invented clients, stats, quotes, dates or project details.
- No fake imagery. Until real covers exist, a cartridge carries a typographic label with the project name only.
- Projects without a case study show an honest "In preparation" page that search engines don't index.
- Empty lists (reels, experiments, earlier roles) show a designed empty state and fill in when content is added.
- No Behance link until a Behance profile exists.
- `public/roomie/**` and the `/roomie` rewrite are a separate project: never modify them or reuse their copy, images or colours.

## Pema to supply

Start with the lead projects, Addy and Frogtoberfest.

- [ ] Addy: category, year, one-line summary, cover image, case-study sections and images
- [ ] Frogtoberfest: category, year, one-line summary, cover image, case-study sections and images
- [ ] Cassette cover (J-card front) per project — see Cover art spec below
- [ ] Motion reels: muted, looping H.264 MP4 plus a poster frame, in `public/motion/`
- [ ] Experiments, if any
- [ ] Earlier roles before Leapfrog, if they should appear

Images go in `public/work/<slug>/`.

## Cover art spec (tape library)

Each project shows as a cassette case in the tape library. Its cover is the J-card front, seen through the clear case.

- **Ratio:** 5:8 portrait (a real J-card front is 63.5 × 101.6 mm).
- **Export:** 1250 × 2000 px, sRGB, JPG or WebP (under 400 KB), plus a 2500 × 4000 px master for case-study pages.
- **Safe area:** keep text 7% in from every edge; the case frame and hinge overlap the edges slightly.
- **File:** `public/work/<slug>/cover.jpg`, then set `cover` for that project in `data/site.ts`.
- **Until a cover exists,** the library shows a typographic placeholder J-card (4 layouts, the project's ink colour, an "In prep" sticker).

## Music

- 恋人へ starts when the tape is inserted (fade-in at low volume, pause control in the nav, pauses on tab switch). Browsers allow sound only after one click, tap or key press; if the visitor has not done one yet, the song starts on their first.
- Pema holds the licence for the track. The file is `public/audio/koibito-e.mp3`, set in `soundtrack` in `data/site.ts` (set it to `undefined` to switch music off).
