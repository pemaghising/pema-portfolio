"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Divider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left bg-primary/15 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE }}
    />
  );
}
