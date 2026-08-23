"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { whatIDoContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = [GraphicDesignIcon, MotionDesignIcon, BrandIdentityIcon, VisualSystemsIcon];

// Hairline cell borders: right divider absent from the last column in each
// visual row, bottom divider absent once a breakpoint removes that row edge.
const CELL_BORDER = [
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-b border-r-0 md:border-b-0 lg:border-r",
  "border-b border-r-0 md:border-b-0 md:border-r lg:border-r",
  "border-r-0",
];

export default function WhatIDo() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4">
        <motion.div
          className="col-span-12 mb-16 md:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <SectionLabel index="02" />
          <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            <span className="block">WHAT I</span>
            <span className="block">{accentPeriod("DO.")}</span>
          </h2>
        </motion.div>
      </div>

      <Divider />
      <div className="grid grid-cols-1 gap-0 border-t border-b border-primary/10 md:grid-cols-2 lg:grid-cols-4">
        {whatIDoContent.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={item.title}
              className={`group relative rounded-none border-primary/10 bg-surface p-8 transition-colors duration-300 hover:bg-accent/5 ${CELL_BORDER[i]}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <div className="relative">
                <span className="font-mono text-xs tracking-[0.15em] text-accent">
                  {item.index}
                </span>

                <div className="mt-6 text-primary transition-colors duration-300 group-hover:text-accent">
                  <Icon className="h-16 w-16" />
                </div>

                <h3 className="mt-6 font-serif text-2xl leading-tight text-primary">
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

function GraphicDesignIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <path
        d="M12 40 L48 24 L84 40 L48 56 Z"
        fill="currentColor"
        className="text-accent"
      />
      <path d="M20 60 L56 44 L92 60 L56 76 Z" />
      <line x1="26" y1="39" x2="38" y2="33" />
      <line x1="34" y1="43" x2="46" y2="37" />
      <line x1="42" y1="47" x2="54" y2="41" />
    </svg>
  );
}

function MotionDesignIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <circle cx="48" cy="48" r="14" />
      <circle cx="48" cy="48" r="26" />
      <circle cx="48" cy="48" r="38" />
      <circle cx="48" cy="48" r="3" fill="currentColor" stroke="none" className="text-accent" />
      <circle cx="74" cy="48" r="2.5" fill="currentColor" stroke="none" className="text-accent" />
      <path d="M18 72 C 30 80, 42 80, 50 68 C 58 56, 70 56, 78 64" />
    </svg>
  );
}

function BrandIdentityIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <circle cx="36" cy="48" r="26" />
      <circle cx="60" cy="48" r="26" />
      <path
        d="M48 25 A26 26 0 0 1 48 71 A26 26 0 0 1 48 25 Z"
        stroke="none"
        fill="currentColor"
        className="text-accent"
      />
    </svg>
  );
}

function VisualSystemsIcon({ className = "" }: { className?: string }) {
  const points = [16, 48, 80];
  const keyNodes = new Set(["16-16", "80-16", "48-48"]);
  return (
    <svg aria-hidden className={className} {...ICON_PROPS}>
      <line x1="16" y1="16" x2="80" y2="16" />
      <line x1="16" y1="48" x2="80" y2="48" />
      <line x1="16" y1="80" x2="80" y2="80" />
      <line x1="16" y1="16" x2="16" y2="80" />
      <line x1="48" y1="16" x2="48" y2="80" />
      <line x1="80" y1="16" x2="80" y2="80" />
      <line x1="16" y1="16" x2="48" y2="48" />
      <line x1="80" y1="16" x2="48" y2="48" />
      {points.flatMap((x) =>
        points.map((y) => {
          const isKey = keyNodes.has(`${x}-${y}`);
          return (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={isKey ? "3.5" : "2.5"}
              fill="currentColor"
              stroke="none"
              className={isKey ? "text-accent" : undefined}
            />
          );
        })
      )}
    </svg>
  );
}
