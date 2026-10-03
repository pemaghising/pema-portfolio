"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { practice } from "@/data/site";
import { Label } from "./Reveal";

/**
 * How Pema works — four verbs, pinned on large screens. Scrolling moves the
 * focus from one to the next, like stepping through keyframes.
 * Below 1024px it becomes a plain sequence: every verb with its line.
 */
export default function Practice() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(practice.length - 1, Math.max(0, Math.floor(v * practice.length)))),
  );

  return (
    <section ref={ref} id="practice" data-scene="Practice" aria-labelledby="practice-title" className="surface-ink lg:h-[380svh]">
      <div className="grid-sys gap-y-10 py-[var(--space-section)] lg:sticky lg:top-0 lg:h-[100svh] lg:content-center lg:py-0">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <Label no="05">Practice</Label>
          <h2 id="practice-title" className="mt-6 max-w-[22ch] text-[clamp(1.25rem,1.5vw,1.6rem)] leading-snug font-medium">
            How Pema works — with designers, across teams, from strategy to the thing people see.
          </h2>
          <p className="t-micro muted mt-6 hidden tabular-nums lg:block" aria-hidden>
            {String(active + 1).padStart(2, "0")} / {String(practice.length).padStart(2, "0")}
          </p>
        </div>

        <ol className="col-span-4 md:col-span-8 lg:col-span-9 lg:col-start-4">
          {practice.map((p, i) => (
            <li key={p.verb} className="hairline grid grid-cols-1 border-t py-4 last:border-b lg:grid-cols-9 lg:gap-x-[var(--gutter)] lg:border-none lg:py-0">
              <span
                className="wide text-[clamp(3.25rem,15vw,6rem)] leading-[0.92] font-bold tracking-[-0.05em] transition-opacity duration-700 lg:col-span-6 lg:text-[clamp(4rem,8.6vw,10.5rem)] lg:leading-[0.86]"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
                data-dim={i !== active}
              >
                {p.verb}
              </span>
              <span
                className="muted mt-2 max-w-[28ch] transition-[opacity,translate] duration-700 lg:col-span-3 lg:mt-0 lg:self-center"
                data-hide={i !== active}
              >
                {p.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          #practice [data-dim="true"] { opacity: .14; }
          #practice [data-hide="true"] { opacity: 0; translate: 0 12px; }
        }
      `}</style>
    </section>
  );
}
