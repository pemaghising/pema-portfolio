"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { workContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

// Hairline cell borders for a 3-item, single-row grid: right divider between
// columns, none at the trailing edge (last column).
const CELL_BORDER = [
  "border-b md:border-b-0 md:border-r",
  "border-b md:border-b-0 md:border-r",
  "border-r-0",
];

export default function Work() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial items-end gap-x-4 gap-y-10">
        <motion.div
          className="col-span-12 md:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <SectionLabel index="04" />
          <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {workContent.heading.map((line) => (
              <span key={line} className="block">
                {accentPeriod(line)}
              </span>
            ))}
          </h2>
        </motion.div>
        <p className="col-span-12 max-w-sm text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(workContent.intro)}
        </p>
      </div>

      <Divider className="mt-20" />
      <div className="grid grid-cols-1 gap-0 border-t border-b border-primary/10 bg-surface md:grid-cols-3">
        {workContent.items.map((item, i) => (
          <motion.div
            key={item.index}
            className={`group relative border-primary/10 p-8 transition-colors duration-300 ${CELL_BORDER[i]}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          >
            <span className="font-mono text-xs tracking-[0.15em] text-accent">
              {item.index}
            </span>

            <div className="mt-6 text-primary/40">
              <PlaceholderFrameIcon className="h-16 w-16" />
            </div>

            <h3 className="mt-6 font-serif text-2xl leading-tight text-primary">
              {item.type}
            </h3>
            <p className="mt-3 text-pretty font-sans text-sm text-secondary">
              {item.status}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PlaceholderFrameIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 96 96"
      strokeWidth="1.25"
      stroke="currentColor"
      fill="none"
    >
      <rect x="16" y="16" width="64" height="64" />
      <line x1="16" y1="16" x2="80" y2="80" />
      <line x1="80" y1="16" x2="16" y2="80" />
      <circle
        cx="48"
        cy="48"
        r="3.5"
        fill="currentColor"
        stroke="none"
        className="text-accent"
      />
    </svg>
  );
}
