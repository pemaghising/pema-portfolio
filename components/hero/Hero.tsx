"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PGMark from "@/components/pg/PGMark";
import RevealText from "@/components/ui/RevealText";
import { heroContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const [identityResolved, setIdentityResolved] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden">
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
