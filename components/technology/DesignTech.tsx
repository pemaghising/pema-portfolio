"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { designTechContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function DesignTech() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10">
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
          {accentPeriod(preventOrphan(designTechContent.statement))}
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
