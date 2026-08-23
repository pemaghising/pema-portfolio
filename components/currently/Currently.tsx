"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { currentlyContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = [DesigningIcon, ExploringIcon, LearningIcon, ExperimentingIcon];

// Hairline cell borders: right divider absent from the last column in each
// visual row, bottom divider absent once a breakpoint removes that row edge.
const CELL_BORDER = [
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-b border-r-0 md:border-b-0 lg:border-r",
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-r-0",
];

export default function Currently() {
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
          <SectionLabel index="03" />
          <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {currentlyContent.heading}
          </h2>
        </motion.div>
        <p className="col-span-12 max-w-sm text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(currentlyContent.intro)}
        </p>
      </div>

      <Divider className="mt-20" />
      <div className="grid grid-cols-1 gap-0 border-t border-b border-primary/10 bg-surface md:grid-cols-2 lg:grid-cols-4">
        {currentlyContent.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={item.title}
              className={`group relative rounded-none border-primary/10 p-8 transition-colors duration-300 hover:bg-accent/5 ${CELL_BORDER[i]}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <div className="relative">
                <span className="inline-flex items-center rounded-full border border-accent/30 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.15em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="mt-6 text-primary transition-colors duration-300 group-hover:text-accent">
                  <Icon className="mb-6 h-16 w-16" />
                </div>

                <h3 className="font-serif text-2xl text-primary md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-pretty font-sans text-sm text-secondary">
                  {preventOrphan(item.description)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

const ICON_PROPS = {
  viewBox: "0 0 96 96",
  strokeWidth: "1.25",
  stroke: "currentColor",
  fill: "none" as const,
};

function DesigningIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <rect x="24" y="24" width="48" height="48" />
      <rect x="19" y="19" width="6" height="6" />
      <rect x="71" y="19" width="6" height="6" />
      <rect x="19" y="71" width="6" height="6" />
      <rect x="71" y="71" width="6" height="6" />
      <line x1="48" y1="8" x2="48" y2="88" />
      <line x1="8" y1="48" x2="88" y2="48" />
      <circle cx="48" cy="48" r="3.5" fill="currentColor" stroke="none" className="text-accent" />
    </svg>
  );
}

function ExploringIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <circle cx="48" cy="48" r="3" fill="currentColor" stroke="none" />
      <line x1="48" y1="48" x2="48" y2="12" />
      <line x1="48" y1="48" x2="78" y2="28" />
      <line x1="48" y1="48" x2="84" y2="60" />
      <line x1="48" y1="48" x2="28" y2="82" />
      <line x1="48" y1="48" x2="14" y2="38" />
      <path d="M48 14 A34 34 0 0 1 78 28" />
      <circle cx="48" cy="12" r="3" fill="currentColor" stroke="none" className="text-accent" />
      <circle cx="84" cy="60" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LearningIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <path
        d="M24 30 L48 20 L72 30 L48 40 Z"
        fill="currentColor"
        className="text-accent"
      />
      <path d="M24 48 L48 38 L72 48 L48 58 Z" />
      <path d="M24 66 L48 56 L72 66 L48 76 Z" />
      <line x1="24" y1="30" x2="24" y2="48" />
      <line x1="72" y1="30" x2="72" y2="48" />
      <line x1="24" y1="48" x2="24" y2="66" />
      <line x1="72" y1="48" x2="72" y2="66" />
    </svg>
  );
}

function ExperimentingIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <path d="M10 30 Q 24 16, 38 30 T 66 30 T 94 30" />
      <path d="M10 48 Q 24 40, 38 48 T 66 48 T 94 48" />
      <path d="M10 66 Q 24 76, 38 66 T 66 66 T 94 66" />
      <circle cx="24" cy="23" r="3" fill="currentColor" stroke="none" className="text-accent" />
    </svg>
  );
}
