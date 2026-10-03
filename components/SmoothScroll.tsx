"use client";

import Lenis from "@studio-freight/lenis";
import { MotionConfig, MotionGlobalConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";

let lenis: Lenis | null = null;

// Reduced motion: every framer animation (intro, reveals) jumps to its end state.
// Set at module load so it applies before the first component animates.
if (typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
  MotionGlobalConfig.instantAnimations = true;
}

/** Smooth-scrolls to an element id; falls back to native jump without Lenis. */
export function scrollToId(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView();
  history.replaceState(null, "", id === "top" ? "/" : `/#${id}`);
  return true;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
    let id = requestAnimationFrame(function raf(t) {
      lenis?.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
