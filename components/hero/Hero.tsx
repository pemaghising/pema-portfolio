"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import PGMark from "@/components/pg/PGMark";
import RevealText from "@/components/ui/RevealText";
import { heroContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [identityResolved, setIdentityResolved] = useState(false);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const linesY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);

  return (
    <section id="top" ref={sectionRef} className="relative overflow-hidden">
      <motion.div style={{ y: linesY }} className="pointer-events-none absolute inset-0">
        <GridLines />
      </motion.div>
      <CropMarks />

      <h1 className="sr-only">{heroContent.srHeading}</h1>

      {/* Identity beat */}
      <div className="relative flex min-h-screen flex-col px-6 pt-32 pb-10 md:px-10">
        <div className="grid flex-1 grid-cols-editorial items-center gap-x-4 gap-y-10 py-10">
          <div className="col-span-12 md:col-span-7">
            <PGMark
              variant="hero"
              onSettled={() => setIdentityResolved(true)}
              className="text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.82] tracking-[-0.01em]"
            />
          </div>

          <motion.div
            aria-hidden
            className="col-span-12 font-sans text-[clamp(1.1rem,2.6vw,1.9rem)] font-semibold uppercase leading-[1.05] tracking-tight text-primary md:col-span-4 md:col-start-9"
            initial={{ opacity: 0, y: 14 }}
            animate={identityResolved ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {heroContent.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.div>
        </div>

        <ScrollCue visible={identityResolved} />
      </div>

      {/* Statement beat */}
      <div className="relative grid min-h-screen grid-cols-editorial items-center gap-x-4 gap-y-12 px-6 py-16 md:px-10">
        <RevealText
          as="p"
          lines={heroContent.statement}
          start={identityResolved}
          className="col-span-12 font-serif text-[clamp(3.5rem,15vw,11rem)] leading-[0.82] tracking-[-0.01em] text-primary md:col-span-9"
        />

        <motion.p
          className="col-span-12 max-w-md self-start text-pretty font-sans text-base text-secondary md:col-span-5 md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={identityResolved ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          {preventOrphan(heroContent.supporting)}
        </motion.p>

        <motion.div
          className="col-span-12 self-end md:col-span-6 md:col-start-7"
          initial={{ opacity: 0, y: 12 }}
          animate={identityResolved ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        >
          <FrameSequence />
        </motion.div>
      </div>
    </section>
  );
}

function ScrollCue({ visible }: { visible: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="mt-auto flex items-center gap-3 pt-10 font-sans text-[10px] uppercase tracking-[0.2em] text-secondary"
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <span>Scroll</span>
      <motion.span
        className="h-8 w-px bg-primary/25"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={visible ? { scaleY: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  );
}

function FrameSequence() {
  const frames = ["01", "02", "03", "04", "05"];
  const activeIndex = 2;

  return (
    <div className="border-t border-primary/15 pt-3">
      <div className="grid grid-cols-5 gap-2">
        {frames.map((frame, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={frame}
              className={`group relative aspect-[3/4] border transition-colors duration-300 ${
                active
                  ? "border-accent"
                  : "border-primary/15 hover:border-primary/40"
              }`}
            >
              <span
                className={`absolute bottom-1.5 left-1.5 font-sans text-[10px] tracking-[0.15em] ${
                  active ? "text-accent" : "text-secondary"
                }`}
              >
                {frame}
              </span>
              <span
                aria-hidden
                className={`absolute top-1.5 right-1.5 h-1 w-1 rounded-full transition-colors duration-300 ${
                  active ? "bg-accent" : "bg-primary/15"
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-sans text-[10px] tracking-[0.15em] text-secondary">
        <span>FRAME SEQUENCE</span>
        <span>05 / 05</span>
      </div>
    </div>
  );
}

function GridLines() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid grid-cols-editorial gap-x-4 px-6 md:px-10"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-full border-l border-primary/[0.06]" />
      ))}
    </div>
  );
}

function CropMarks() {
  const base = "absolute h-3 w-3 border-primary/25 md:h-4 md:w-4";
  return (
    <>
      <span
        aria-hidden
        className={`${base} top-4 left-4 border-t border-l md:top-6 md:left-6`}
      />
      <span
        aria-hidden
        className={`${base} top-4 right-4 border-t border-r md:top-6 md:right-6`}
      />
      <span
        aria-hidden
        className={`${base} bottom-4 left-4 border-b border-l md:bottom-6 md:left-6`}
      />
      <span
        aria-hidden
        className={`${base} bottom-4 right-4 border-b border-r md:bottom-6 md:right-6`}
      />
    </>
  );
}
