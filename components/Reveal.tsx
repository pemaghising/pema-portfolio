"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Words rise out of a mask, staggered — the house entrance for type. */
export function Words({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  stagger = 0.025,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {text.split(" ").map((w, i) => (
          <span key={i}>
            <span className="mask inline-block align-top">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: "105%" }, shown: { y: 0 } }}
                transition={{ duration: 1, ease }}
              >
                {w}
              </motion.span>
            </span>{" "}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Section label: number + name, set in the micro face. */
export function Label({ no, children, className = "" }: { no: string; children: string; className?: string }) {
  return (
    <p className={`t-micro muted ${className}`}>
      {no} — {children}
    </p>
  );
}

/** Generic block entrance: a short rise and fade. */
export function Rise({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </M>
  );
}
