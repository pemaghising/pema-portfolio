"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealTextProps {
  lines: string[];
  start?: boolean;
  className?: string;
  as?: ElementType;
  baseDelay?: number;
}

export default function RevealText({
  lines,
  start = true,
  className = "",
  as: Tag = "span",
  baseDelay = 0,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
          opacity: 1,
          transition: { duration: 0.4, delay: baseDelay + i * 0.05 },
        }),
      }
    : {
        hidden: { y: "110%" },
        visible: (i: number) => ({
          y: "0%",
          transition: {
            duration: 1.05,
            delay: baseDelay + i * 0.12,
            ease: EASE,
          },
        }),
      };

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            custom={i}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            variants={variants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
