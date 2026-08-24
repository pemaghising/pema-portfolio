"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Stage index maps directly to the PG identity states from the brief:
// 0 = "P        G", 1 = "P     G", 2 = "P G", 3 = "PG",
// 4 = stacked "P / G", 5 = expanded "PEMA / GHISING"
const STAGE_GAPS = ["16vw", "6.5vw", "1.75vw", "0vw"];
const STAGE_DELAYS_MS = [650, 1250, 1850, 2450, 3100];
const SEEN_KEY = "pg-mark-seen";

interface PGMarkProps {
  variant?: "hero" | "compact";
  className?: string;
  onSettled?: () => void;
}

export default function PGMark({
  variant = "compact",
  className = "",
  onSettled,
}: PGMarkProps) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(
    variant === "hero" && !reduceMotion ? 0 : 5
  );

  useEffect(() => {
    if (variant !== "hero" || reduceMotion) {
      onSettled?.();
      return;
    }

    // Already played once this browser session (e.g. a recruiter reopening
    // the tab) — resolve immediately instead of replaying the full sequence.
    if (sessionStorage.getItem(SEEN_KEY)) {
      const resolveTimer = setTimeout(() => setStage(5), 0);
      onSettled?.();
      return () => clearTimeout(resolveTimer);
    }

    const timers = STAGE_DELAYS_MS.map((delay, i) =>
      setTimeout(() => setStage(i + 1), delay)
    );
    const settleTimer = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      onSettled?.();
    }, STAGE_DELAYS_MS[STAGE_DELAYS_MS.length - 1] + 700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(settleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, reduceMotion]);

  if (variant === "compact") {
    return <CompactMark className={className} />;
  }

  const stacked = stage >= 4;
  const expanded = stage >= 5;
  const gap = STAGE_GAPS[Math.min(stage, 3)];

  return (
    <motion.div
      layout
      aria-hidden="true"
      className={`flex font-serif text-primary ${
        stacked ? "flex-col items-start" : "flex-row items-baseline"
      } ${className}`}
      style={{ gap: stacked ? "0.08em" : gap }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <motion.div layout className="flex items-baseline" transition={{ duration: 0.9, ease: EASE }}>
        <span>P</span>
        <motion.span
          initial={false}
          animate={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="overflow-hidden whitespace-nowrap"
        >
          EMA
        </motion.span>
      </motion.div>
      <motion.div layout className="flex items-baseline" transition={{ duration: 0.9, ease: EASE }}>
        <span>G</span>
        <motion.span
          initial={false}
          animate={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="overflow-hidden whitespace-nowrap"
        >
          HISING
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function CompactMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-baseline font-serif text-lg text-primary transition-colors duration-500 group-hover:text-accent group-focus-visible:text-accent md:text-xl ${className}`}
    >
      <span>P</span>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap">EMA&nbsp;</span>
      </span>
      <span>G</span>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap">HISING</span>
      </span>
    </span>
  );
}
