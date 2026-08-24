"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { beyondDesignContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

// Hairline cell borders: right divider absent from the last column in each
// visual row, bottom divider absent once a breakpoint removes that row edge.
const CELL_BORDER = [
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-b border-r-0 md:border-b-0 lg:border-r",
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-r-0",
];

export default function BeyondDesign() {
  return (
    <section className="relative bg-transparent px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-6">
          <SectionLabel index="08" />
          <h2 className="mt-3 text-pretty font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {beyondDesignContent.heading.map((line) => (
              <span key={line} className="block">
                {accentPeriod(line)}
              </span>
            ))}
          </h2>
        </div>
        <p className="col-span-12 self-end text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(beyondDesignContent.intro)}
        </p>
      </div>

      <Divider className="mt-20" />
      <div className="grid grid-cols-1 gap-0 border-t border-b border-primary/10 bg-surface md:grid-cols-2 lg:grid-cols-4">
        {beyondDesignContent.items.map((item, i) => (
          <motion.div
            key={item.title}
            className={`space-y-3 border-primary/10 p-8 ${CELL_BORDER[i]}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          >
            <h3 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] text-primary">
              {item.title}
            </h3>
            <p className="text-pretty font-sans text-xs uppercase tracking-[0.15em] text-accent">
              {item.tags}
            </p>
            <p className="max-w-sm text-pretty font-sans text-secondary">
              {preventOrphan(item.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
