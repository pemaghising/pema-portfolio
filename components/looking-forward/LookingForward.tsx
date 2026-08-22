"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { lookingForwardContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LookingForward() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-12">
        <div className="col-span-12">
          <SectionLabel index="09" />
          <h2 className="mt-3 text-pretty font-serif text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.9] text-primary">
            {lookingForwardContent.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <motion.p
          className="col-span-12 max-w-2xl text-pretty font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-secondary md:col-span-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {preventOrphan(lookingForwardContent.copy)}
        </motion.p>

        <div className="col-span-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary/15 pt-8">
          {lookingForwardContent.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs uppercase tracking-[0.2em] text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
