"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { currentlyContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Currently() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial items-end gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-6">
          <SectionLabel index="03" />
          <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {currentlyContent.heading}
          </h2>
        </div>
        <p className="col-span-12 max-w-sm text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(currentlyContent.intro)}
        </p>
      </div>

      <div className="mt-20 grid grid-cols-editorial gap-x-4 gap-y-12 border-t border-primary/15 pt-10">
        {currentlyContent.items.map((item, i) => (
          <motion.div
            key={item.title}
            className="col-span-12 sm:col-span-6 md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          >
            <span className="font-sans text-xs tracking-[0.2em] text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-sans text-lg font-semibold uppercase tracking-tight text-primary">
              {item.title}
            </h3>
            <p className="mt-3 max-w-xs text-pretty font-sans text-sm text-secondary">
              {preventOrphan(item.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
