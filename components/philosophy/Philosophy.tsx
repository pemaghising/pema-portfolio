"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { philosophyContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Philosophy() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <SectionLabel index="04" className="mb-16 block" />

      {philosophyContent.map((item, i) => (
        <div
          key={item.support}
          className="grid min-h-[85vh] grid-cols-editorial items-center gap-x-4 border-t border-primary/10 first:border-t-0"
        >
          <motion.div
            className="col-span-12 md:col-span-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span className="font-sans text-xs tracking-[0.2em] text-secondary">
              {String(i + 1).padStart(2, "0")} /{" "}
              {String(philosophyContent.length).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-serif text-[clamp(2.25rem,7.5vw,6.5rem)] leading-[0.95] text-primary">
              {item.statement.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            <p className="mt-6 max-w-xl text-pretty font-sans text-secondary md:text-lg">
              {preventOrphan(item.support)}
            </p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
