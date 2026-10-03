"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Mode = "dot" | "link" | "view" | "hidden";

/** Fine pointers only. Dot by default, ring on links, "View" over projects. */
export default function Cursor() {
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const [label, setLabel] = useState("View");
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = reduce ? { stiffness: 2000, damping: 100 } : { stiffness: 900, damping: 60, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    // Enabling once on mount; the media query never changes on a desktop session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(true);
    const classify = (t: Element | null) => {
      const view = t?.closest<HTMLElement>("[data-cursor]");
      if (view) {
        setMode("view");
        setLabel(view.dataset.cursor || "View");
      } else if (t?.closest("a, button, [role=button], input, label")) setMode("link");
      else setMode("dot");
    };
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      classify(e.target as Element | null);
    };
    // Content scrolls under a still pointer; re-read what's beneath it.
    const scroll = () => {
      if (x.get() >= 0) classify(document.elementFromPoint(x.get(), y.get()));
    };
    const leave = () => setMode("hidden");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!on) return null;

  const size = mode === "view" ? 104 : mode === "link" ? 44 : mode === "dot" ? 10 : 0;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90]"
      style={{ x: sx, y: sy, mixBlendMode: mode === "view" ? "normal" : "difference" }}
    >
      <div
        className="t-micro flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: mode === "view" ? "var(--color-accent)" : mode === "link" ? "transparent" : "var(--color-paper)",
          border: mode === "link" ? "1px solid var(--color-paper)" : "none",
          color: "var(--color-ink)",
          transition:
            "width .5s var(--ease-out), height .5s var(--ease-out), background-color .3s, border-color .3s",
        }}
      >
        <span style={{ opacity: mode === "view" ? 1 : 0, transition: "opacity .3s" }}>{label}</span>
      </div>
    </motion.div>
  );
}
