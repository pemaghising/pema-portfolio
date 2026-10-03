"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { currently, designTech, experiments, site } from "@/data/site";
import { Label, Rise, Words } from "./Reveal";

/**
 * The playful room. A live type instrument (the site's own typeface, two
 * axes, played with the pointer), what Pema is currently working through,
 * and — once published — real experiments from the data file.
 */
export default function Experiments() {
  return (
    <section id="experiments" data-scene="Experiments" aria-labelledby="exp-lab-title" className="surface-paper py-[var(--space-section)]">
      <div className="grid-sys gap-y-8">
        <Label no="07" className="col-span-4 md:col-span-2">
          Experiments
        </Label>
        <h2 id="exp-lab-title" className="t-section col-span-4 md:col-span-6 lg:col-span-9">
          <Words as="span" text="Things that don't need a brief." />
        </h2>
        <Rise className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-3 lg:mt-8">
          <p className="text-[clamp(1.125rem,1.35vw,1.5rem)] leading-normal">{designTech}</p>
        </Rise>
      </div>

      <div className="grid-sys mt-[clamp(4rem,8vw,8rem)]">
        <Instrument />
      </div>

      {experiments.length > 0 && (
        <ul className="grid-sys mt-[clamp(4rem,8vw,8rem)] gap-y-12">
          {experiments.map((e, i) => (
            <li key={e.title} className={`col-span-4 ${i % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"} md:col-span-4`}>
              {e.video ? (
                <video src={e.video} muted loop playsInline autoPlay className="aspect-[4/3] w-full object-cover" />
              ) : e.media ? (
                <div className="relative aspect-[4/3]">
                  <Image src={e.media.src} alt={e.media.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                </div>
              ) : null}
              <p className="t-micro mt-3 flex justify-between">
                <span>{e.title}</span>
                <span className="muted">{e.medium}</span>
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="grid-sys mt-[clamp(5rem,10vw,10rem)] gap-y-10">
        <h3 className="t-micro muted col-span-4 md:col-span-8 lg:col-span-2">Currently</h3>
        {currently.map((c, i) => (
          <Rise
            key={c.label}
            delay={i * 0.08}
            className={`hairline col-span-4 border-t pt-5 md:col-span-4 lg:col-span-5 ${i % 2 ? "lg:col-start-8" : "lg:col-start-3"}`}
          >
            <p className="mb-3 text-[clamp(1.5rem,2.2vw,2.5rem)] leading-none font-semibold tracking-[-0.03em]">{c.label}</p>
            <p className="muted max-w-[40ch]">{c.text}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/** Pointer X → width axis, pointer Y → weight axis. Idles on its own. */
function Instrument() {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    const t = text.current;
    if (!el || !t || reduce) return;
    const target = { w: 100, g: 600 };
    const cur = { ...target };
    let touched = false;
    let raf = 0;
    let visible = false;

    const tick = (now: number) => {
      if (!touched) {
        target.w = 100 + Math.sin(now / 1400) * 25;
        target.g = 550 + Math.cos(now / 1900) * 300;
      }
      cur.w += (target.w - cur.w) * 0.12;
      cur.g += (target.g - cur.g) * 0.12;
      t.style.fontVariationSettings = `"wdth" ${cur.w.toFixed(1)}, "wght" ${cur.g.toFixed(0)}`;
      if (readout.current) readout.current.textContent = `wdth ${cur.w.toFixed(0)} · wght ${cur.g.toFixed(0)}`;
      if (visible) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      touched = true;
      target.w = 75 + Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * 50;
      target.g = 200 + Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1) * 700;
    };
    const leave = () => (touched = false);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <figure className="col-span-4 md:col-span-8 lg:col-span-12">
      <div
        ref={box}
        className="surface-ink relative grid aspect-[4/5] touch-pan-y place-items-center overflow-hidden px-[4vw] md:aspect-[16/9]"
        data-cursor="Play"
      >
        <p
          ref={text}
          className="text-center text-[clamp(3rem,10.5vw,13rem)] leading-[0.88] tracking-[-0.045em] text-balance"
          style={{ fontVariationSettings: '"wdth" 100, "wght" 600' }}
        >
          {site.tagline}
        </p>
        <div className="t-micro absolute inset-x-[clamp(16px,2.5vw,40px)] bottom-[clamp(16px,2.5vw,40px)] flex justify-between gap-4">
          <span ref={readout} className="tabular-nums">
            wdth 100 · wght 600
          </span>
          <span className="muted text-right">Move across to play</span>
        </div>
      </div>
      <figcaption className="t-micro muted mt-3 flex justify-between gap-4">
        <span>Type study 01 — one typeface, two axes</span>
        <span className="hidden md:inline">Width × weight, live</span>
      </figcaption>
    </figure>
  );
}
