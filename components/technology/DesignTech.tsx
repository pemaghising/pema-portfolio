"use client";

import { motion } from "framer-motion";
import PGMark from "@/components/pg/PGMark";
import SectionLabel from "@/components/ui/SectionLabel";
import { designTechContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DesignTech() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-editorial gap-x-4 px-6 md:px-10"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full border-l border-primary/[0.06]" />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 opacity-[0.04] md:block"
      >
        <PGMark
          variant="hero"
          autoPlay={false}
          className="text-[16vw] leading-[0.82]"
        />
      </div>

      <div className="relative grid grid-cols-editorial gap-x-4 gap-y-10">
        <div className="col-span-12">
          <SectionLabel index="07" />
        </div>

        <motion.h2
          className="col-span-12 text-pretty font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1] text-primary md:col-span-9"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          {preventOrphan(designTechContent.statement)}
        </motion.h2>

        <motion.p
          className="col-span-12 max-w-xl text-pretty font-sans text-secondary md:col-span-5 md:col-start-8 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {preventOrphan(designTechContent.paragraph)}
        </motion.p>
      </div>
    </section>
  );
}
