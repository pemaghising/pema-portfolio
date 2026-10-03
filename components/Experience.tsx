"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience, site } from "@/data/site";
import { Label, Rise, Words } from "./Reveal";

/**
 * Experience as a timeline ruler — the instrument a motion designer scrubs
 * every day. The playhead travels to "now" as you scroll; the ruler extends
 * itself as earlier roles are added to the data file.
 */
export default function Experience({ now }: { now: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const head = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const first = Math.min(...experience.map((r) => r.start));
  const years = Array.from({ length: now - first + 1 }, (_, i) => first + i);
  const pos = (y: number) => `${((y - first) / (now + 1 - first)) * 100}%`;

  return (
    <section id="experience" data-scene="Experience" aria-labelledby="exp-title" className="surface-paper pb-[var(--space-section)]">
      <div className="grid-sys items-end gap-y-6">
        <Label no="04" className="col-span-4 md:col-span-2">
          Experience
        </Label>
        <h2 id="exp-title" className="t-section col-span-4 md:col-span-6 lg:col-span-9">
          <Words as="span" text={`${site.years} years of making ideas visible.`} />
        </h2>
      </div>

      <div ref={ref} className="relative mx-[var(--margin)] mt-[clamp(4rem,8vw,8rem)] h-16" aria-hidden>
        {years.map((y) => (
          <div key={y} className="absolute bottom-0 flex flex-col items-start" style={{ left: pos(y) }}>
            <span className="t-micro muted mb-2 tabular-nums">{y}</span>
            <span className="h-5 w-px bg-[var(--fg)] opacity-40" />
          </div>
        ))}
        <span className="t-micro absolute right-0 bottom-7 hidden md:block">Now</span>
        <div className="absolute bottom-0 left-0 h-px w-full bg-[var(--fg)] opacity-25" />
        {experience.map((r) => (
          <motion.div
            key={r.company + r.start}
            className="absolute bottom-0 h-[3px] bg-[var(--fg)]"
            style={{ left: pos(r.start), width: head, maxWidth: `calc(${pos(r.end ?? now + 1)} - ${pos(r.start)})` }}
          />
        ))}
        <motion.div className="absolute -bottom-3 h-10 w-[2px] bg-[var(--color-accent)]" style={{ left: head }} />
      </div>

      <ol className="mt-[clamp(3rem,6vw,6rem)]">
        {experience.map((r) => (
          <Rise as="li" key={r.company + r.start} className="grid-sys gap-y-6">
            <p className="t-lead col-span-4 tabular-nums md:col-span-2 lg:col-span-3">
              {r.start} — {r.end ?? "Present"}
            </p>
            <div className="col-span-4 md:col-span-6 lg:col-span-9">
              <h3 className="wide text-[clamp(2.25rem,5.4vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.045em]">
                {r.company}
              </h3>
              <p className="mt-4 text-[clamp(1.25rem,1.6vw,1.75rem)] font-medium">{r.title}</p>
              <p className="t-micro muted mt-3">{r.disciplines.join(" / ")}</p>
              <p className="t-lead mt-10 max-w-[30ch] text-[clamp(1.25rem,2vw,2.25rem)]">{r.text}</p>
            </div>
          </Rise>
        ))}
      </ol>
    </section>
  );
}
