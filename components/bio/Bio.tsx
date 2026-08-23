"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { bioContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Bio() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-16">
        <div className="col-span-12">
          <SectionLabel index="01" />
        </div>

        <motion.h2
          className="col-span-12 font-serif text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] text-primary md:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          {accentPeriod(bioContent.heading)}
        </motion.h2>

        <div className="col-span-12 flex max-w-xl flex-col gap-8 md:col-span-5 md:col-start-8">
          {bioContent.paragraphs.map((paragraph, i) => (
            <motion.p
              key={paragraph}
              className="text-pretty font-sans text-base text-secondary md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              {preventOrphan(paragraph)}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
