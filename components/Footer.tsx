"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { contact, lookingForward, site } from "@/data/site";
import { Label, Rise, Words } from "./Reveal";
import { scrollToId } from "./SmoothScroll";

/**
 * Moment 03 — the closing frame. The three lines slide in from opposite
 * sides as you arrive; then MOVE responds to the pointer, each letter
 * stretching on the width axis as you pass over it.
 */
export default function Footer({ year }: { year: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const a = useTransform(scrollYProgress, [0, 0.8], ["-30%", "0%"]);
  const b = useTransform(scrollYProgress, [0, 0.8], ["30%", "0%"]);

  return (
    <footer id="contact" data-scene="Contact" className="surface-ink overflow-hidden pt-[var(--space-section)]">
      <div className="grid-sys gap-y-8">
        <Label no="09" className="col-span-4 md:col-span-2">
          Next
        </Label>
        <Words
          text={lookingForward.text}
          className="t-lead col-span-4 text-balance md:col-span-6 lg:col-span-8"
        />
        <Rise className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-8 lg:col-start-3">
          <p className="t-micro muted mb-3">Open to</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            {lookingForward.open.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Rise>
      </div>

      <div ref={ref} className="mt-[clamp(6rem,14vw,14rem)] px-[var(--margin)]">
        <h2 className="font-bold tracking-[-0.05em] uppercase" aria-label="Let's make something move.">
          <motion.span aria-hidden className="rm-static wide block text-[clamp(2.75rem,11vw,14rem)] leading-[0.85]" style={{ x: a }}>
            Let&apos;s make
          </motion.span>
          <motion.span aria-hidden className="rm-static wide block text-right text-[clamp(2.75rem,11vw,14rem)] leading-[0.85]" style={{ x: b }}>
            something
          </motion.span>
          <Move />
        </h2>
      </div>

      <div className="grid-sys mt-[clamp(4rem,8vw,8rem)] items-end gap-y-10">
        <div className="col-span-4 md:col-span-5 lg:col-span-7">
          <p className="muted mb-4 max-w-[36ch]">{contact.invite}</p>
          <Magnetic>
            <a
              href={`mailto:${contact.email}`}
              className="link-u inline-block text-[clamp(1.35rem,3.6vw,4rem)] leading-tight font-medium tracking-[-0.03em] break-all"
            >
              {contact.email}
            </a>
          </Magnetic>
        </div>
        <ul className="col-span-4 flex gap-8 md:col-span-3 md:justify-end lg:col-span-5">
          {contact.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer" className="link-u text-[clamp(1.125rem,1.4vw,1.5rem)]">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid-sys hairline t-micro muted mt-[clamp(4rem,8vw,8rem)] gap-y-3 border-t py-6">
        <p className="col-span-2 md:col-span-3">
          © {year} {site.name}
        </p>
        <p className="col-span-2 text-right md:col-span-2 md:text-left lg:col-span-3 lg:col-start-6">{site.tagline}</p>
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="link-u col-span-4 justify-self-start uppercase md:col-span-3 md:justify-self-end lg:col-span-4"
        >
          Back to the opening frame ↑
        </button>
      </div>
    </footer>
  );
}

const LETTERS = "MOVE".split("");

function Move() {
  const row = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = row.current;
    if (!el || reduce) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-l]"));
    const cur = spans.map(() => 100);
    let px = -1;
    let raf = 0;
    let running = false;
    const fine = matchMedia("(pointer: fine)").matches;

    const tick = (now: number) => {
      const r = el.getBoundingClientRect();
      // Touch: a slow travelling wave stands in for the pointer.
      const x = fine ? px : r.left + ((Math.sin(now / 1100) + 1) / 2) * r.width;
      const rects = spans.map((s) => s.getBoundingClientRect()); // read all, then write
      spans.forEach((s, i) => {
        const b = rects[i];
        const d = x < 0 ? 1 : Math.min(Math.abs(b.left + b.width / 2 - x) / (r.width * 0.4), 1);
        const target = 125 - d * 50;
        cur[i] += (target - cur[i]) * 0.14;
        s.style.fontVariationSettings = `"wdth" ${cur[i].toFixed(1)}`;
      });
      if (running) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => (px = e.clientX);
    const leave = () => (px = -1);
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    const zone = el.closest("footer")!;
    zone.addEventListener("pointermove", move);
    zone.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      zone.removeEventListener("pointermove", move);
      zone.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <span ref={row} aria-hidden className="flex items-baseline text-[clamp(5.5rem,30vw,30rem)] lg:text-[25vw] leading-[0.8]">
      {LETTERS.map((l, i) => (
        <span key={i} data-l className="inline-block" style={{ fontVariationSettings: '"wdth" 100' }}>
          {l}
        </span>
      ))}
      <span className="text-[var(--color-accent)]">.</span>
    </span>
  );
}

/** Extremely subtle pull toward the pointer. Fine pointers only. */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
