"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { about, reels, type Reel } from "@/data/site";
import { Label, Rise } from "./Reveal";

const CURVES = [
  { name: "linear", css: "linear" },
  { name: "ease-out · 0.16, 1, 0.3, 1", css: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { name: "ease-in-out · 0.76, 0, 0.24, 1", css: "cubic-bezier(0.76, 0, 0.24, 1)" },
];

/**
 * Design, in motion. The title starts as static type and, as you scroll,
 * its letters pick up a wave — the moment type becomes movement.
 * Reels come from the data file; until then the frame shows the timing
 * curves this site itself is animated with.
 */
export default function MotionSection() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 10%"] });
  const word = "motion.";
  const motionCopy = about.disciplines.find((d) => d.name === "Motion Design")!.text;

  return (
    <section id="motion" data-scene="Motion" aria-labelledby="motion-title" className="surface-ink pb-[var(--space-section)]">
      <div className="grid-sys gap-y-8 pt-[var(--space-section)]">
        <Label no="06" className="col-span-4 md:col-span-8 lg:col-span-12">
          Motion
        </Label>
        <h2
          ref={ref}
          id="motion-title"
          aria-label="Design, in motion."
          className="wide col-span-4 text-[clamp(3.5rem,13.5vw,17rem)] leading-[0.82] font-bold tracking-[-0.05em] md:col-span-8 lg:col-span-12"
        >
          <span aria-hidden className="block">Design, in</span>
          <span aria-hidden className="block whitespace-nowrap">
            {word.split("").map((ch, i) => (
              <Letter key={i} ch={ch} i={i} p={scrollYProgress} accent={ch === "."} />
            ))}
          </span>
        </h2>
        <Rise className="t-lead col-span-4 mt-6 max-w-[24ch] md:col-span-6 lg:col-span-5 lg:col-start-8">
          {motionCopy}
        </Rise>
      </div>

      <div className="grid-sys mt-[clamp(4rem,8vw,8rem)] gap-y-[var(--gutter)]">
        {reels.length ? (
          reels.map((r, i) => <ReelPlayer key={r.src} reel={r} wide={i === 0} />)
        ) : (
          <TimingFrame />
        )}
      </div>
    </section>
  );
}

function Letter({ ch, i, p, accent }: { ch: string; i: number; p: MotionValue<number>; accent: boolean }) {
  const amp = Math.sin((i / 6) * Math.PI * 1.5) * 0.22;
  const y = useTransform(p, [0.25, 0.75], ["0em", `${amp}em`]);
  const r = useTransform(p, [0.25, 0.75], [0, amp * 18]);
  return (
    <motion.span
      className={`rm-static inline-block ${accent ? "text-[var(--color-accent)]" : ""}`}
      style={{ y, rotate: r }}
    >
      {ch}
    </motion.span>
  );
}

/** Placeholder frame: honest about the missing reel, and still about motion. */
function TimingFrame() {
  return (
    <figure className="hairline col-span-4 border md:col-span-8 lg:col-span-12">
      <div className="relative flex aspect-[4/5] flex-col justify-between p-[clamp(16px,2.5vw,40px)] md:aspect-[16/9] lg:aspect-[21/9]">
        <div className="t-micro flex justify-between">
          <span>Showreel</span>
          <span className="muted">In preparation</span>
        </div>
        <div className="space-y-[clamp(1.25rem,3vw,3rem)]">
          {CURVES.map((c) => (
            <div key={c.name}>
              <p className="t-micro muted mb-3 normal-case">{c.name}</p>
              <div className="relative h-3 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--fg)] opacity-20" />
                <span className="timing-run absolute inset-y-0 right-3 left-0" style={{ animationTimingFunction: c.css }}>
                  <span className="absolute top-0 left-0 size-3 rounded-full bg-[var(--fg)]" />
                </span>
              </div>
            </div>
          ))}
        </div>
        <figcaption className="t-micro muted max-w-[46ch] normal-case">
          Until the reel lands: the three curves every movement on this site is built from. Same
          distance, same duration — only the timing changes.
        </figcaption>
      </div>
      <style>{`
        .timing-run { animation: timing 2.4s infinite alternate; will-change: transform; }
        @keyframes timing { from { transform: translateX(0); } to { transform: translateX(100%); } }
      `}</style>
    </figure>
  );
}

function ReelPlayer({ reel, wide }: { reel: Reel; wide: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.25,
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <figure className={`col-span-4 ${wide ? "md:col-span-8 lg:col-span-12" : "md:col-span-4 lg:col-span-6"}`}>
      <button
        type="button"
        className="group relative block w-full overflow-hidden"
        data-cursor="Play"
        aria-label={`Play ${reel.title} fullscreen`}
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          v.muted = false;
          v.controls = true;
          v.play().catch(() => {});
          v.requestFullscreen?.().catch(() => {});
        }}
      >
        <video
          ref={ref}
          src={reel.src}
          poster={reel.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="aspect-video w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.02]"
        />
      </button>
      <figcaption className="t-micro mt-3 flex justify-between">
        <span>{reel.title}</span>
        {reel.year && <span className="muted">{reel.year}</span>}
      </figcaption>
    </figure>
  );
}
