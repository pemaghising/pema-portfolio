"use client";

import {
  motion,
  transform,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const ease = [0.76, 0, 0.24, 1] as const;

// Function-form transforms: framer would otherwise hand scroll-linked opacity to a
// native ViewTimeline, which ignores the clamp in some Chromium builds.
const at = (input: number[], output: number[]) => (v: number) => transform(v, input, output);
const out = [0.16, 1, 0.3, 1] as const;

/**
 * Moment 01 — the opening frame.
 * A playhead scrubs across an empty screen, PEMA is "rendered" behind it,
 * then the width axis opens the word to the full measure. GHISING rises,
 * the frame settles, the nav arrives. Scrolling then splits the name apart
 * and the statement is written into the space it leaves.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const pema = useRef<HTMLSpanElement>(null);
  const ghising = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState<{ a: string; b: string }>({ a: "21.5vw", b: "21.5vw" });
  const reduce = useReducedMotion();

  // Justify both words to the same measure using the font's width axis.
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el || !pema.current || !ghising.current) return;
      const avail = el.clientWidth - 2 * parseFloat(getComputedStyle(pema.current.parentElement!).paddingLeft);
      const probe = (word: string, wdth: number) => {
        const s = document.createElement("span");
        s.textContent = word;
        s.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:700 100px var(--font-sans);font-variation-settings:"wdth" ${wdth};letter-spacing:-0.045em`;
        document.body.appendChild(s);
        const w = s.getBoundingClientRect().width;
        s.remove();
        return w;
      };
      let a = (avail / probe("PEMA", 125)) * 100;
      let b = (avail / probe("GHISING", 75)) * 100;
      // On wide screens, height is the limit: shrink both, keeping them justified to each other.
      const k = Math.min(1, (innerHeight * 0.64) / (0.8 * (a + b)));
      a *= k;
      b *= k;
      setFit({ a: `${a}px`, b: `${b}px` });
    };
    measure();
    document.fonts.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const flag = window as { __introDone?: boolean };
    const finish = () => {
      flag.__introDone = true;
      dispatchEvent(new Event("intro-done"));
    };
    if (reduce) return finish();
    const t = setTimeout(finish, 3000);
    return () => clearTimeout(t);
  }, [reduce]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const leftX = useTransform(p, [0, 0.36], ["0vw", "-70vw"]);
  const rightX = useTransform(p, [0, 0.36], ["0vw", "70vw"]);
  const nameFade = useTransform(p, at([0.06, 0.26], [1, 0]));
  const slateFade = useTransform(p, at([0, 0.08], [1, 0]));
  const stageScale = useTransform(p, [0.7, 1], [1, 0.92]);
  const stageDim = useTransform(p, at([0.7, 1], [1, 0.35]));
  const statementY = useTransform(p, [0.2, 0.62], ["8vh", "0vh"]);


  return (
    <section
      id="top"
      ref={ref}
      data-scene="Opening"
      aria-label="Introduction"
      className="surface-ink relative h-[300svh]"
    >
      <motion.div
        className="rm-static sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden"
        style={{ scale: stageScale, opacity: stageDim }}
      >
        <motion.div
          className="flex h-full flex-col justify-end"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: out }}
        >
          {/* Slate */}
          <motion.div className="grid-sys t-micro absolute inset-x-0 top-[15svh]" style={{ opacity: slateFade }}>
            <motion.p
              className="col-span-2 md:col-span-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: out, delay: 0.3 }}
            >
              {site.role}
            </motion.p>
            <motion.p
              className="col-span-2 text-right md:col-span-3 md:col-start-6 lg:col-start-10"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: out, delay: 0.45 }}
            >
              {site.tagline}
            </motion.p>
          </motion.div>

          {/* Secondary line */}
          <motion.div
            className="grid-sys t-micro mb-[clamp(16px,2.5vw,40px)]"
            style={{ opacity: slateFade }}
          >
            <motion.p
              className="col-span-3 md:col-span-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: out, delay: 2.4 }}
            >
              {site.years} years · Lead Graphic Designer, Leapfrog Technology
            </motion.p>
            <motion.p
              className="col-span-1 text-right md:col-span-2 md:col-start-7 lg:col-start-11"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.9 }}
              aria-hidden
            >
              Scroll ↓
            </motion.p>
          </motion.div>
          {/* Name */}
          <h1 className="relative pb-[max(var(--margin),2svh)]" aria-label={site.name}>
            <motion.span
              aria-hidden
              className="relative block px-[var(--margin)]"
              initial={{ clipPath: "inset(-10% 100% -10% 0%)" }}
              animate={{ clipPath: "inset(-10% 0% -10% 0%)" }}
              transition={{ duration: 1.1, ease, delay: 0.6 }}
            >
              <motion.span
                ref={pema}
                className="rm-static block font-bold leading-[0.8] tracking-[-0.045em] whitespace-nowrap will-change-transform"
                style={{ fontSize: fit.a, x: leftX, opacity: nameFade }}
                initial={{ fontVariationSettings: '"wdth" 62' }}
                animate={{ fontVariationSettings: '"wdth" 125' }}
                transition={{ duration: 1.1, ease, delay: 1.55 }}
              >
                PEMA
              </motion.span>
              <span className="mask block">
                <motion.span
                  ref={ghising}
                  className="rm-static narrow block font-bold leading-[0.8] tracking-[-0.045em] whitespace-nowrap will-change-transform"
                  style={{ fontSize: fit.b, x: rightX, opacity: nameFade }}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: out, delay: 2.05 }}
                >
                  GHISING
                </motion.span>
              </span>
            </motion.span>

            {/* Playhead */}
            {(
              <span aria-hidden className="absolute inset-x-[var(--margin)] top-[-6%] bottom-[8%]">
                <motion.span
                  className="absolute inset-y-0 w-[2px] bg-[var(--color-accent)]"
                  initial={{ left: "0%", opacity: 1 }}
                  animate={{ left: "100%", opacity: [1, 1, 0] }}
                  transition={{
                    left: { duration: 1.1, ease, delay: 0.6 },
                    opacity: { duration: 1.7, times: [0, 0.65, 1], delay: 0.6 },
                  }}
                />
              </span>
            )}
          </h1>

        </motion.div>

        {/* The statement, written into the space the name leaves. */}
        <motion.div
          className="rm-static grid-sys pointer-events-none absolute inset-0 content-center"
          style={{ y: statementY }}
        >
          <p className="t-lead col-span-4 md:col-span-7 lg:col-span-9 lg:col-start-2 lg:text-[clamp(2rem,4.4vw,5.5rem)] lg:leading-[1.02]">
            {site.statement.split(" ").map((w, i, all) => (
              <Word key={i} p={p} i={i} n={all.length} word={w} />
            ))}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Word({ p, i, n, word }: { p: MotionValue<number>; i: number; n: number; word: string }) {
  const start = 0.2 + (i / n) * 0.34;
  const opacity = useTransform(p, at([start, start + 0.06], [0, 1]));
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}
