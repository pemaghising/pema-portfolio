"use client";

import { useEffect, useRef } from "react";

/**
 * The orange-foam dot that rides along with the pointer (mouse and pen only). Over anything
 * clickable it opens into a ring. It moves with a transform on its own frame loop, so it never
 * causes layout work, and it pauses while the pointer is still.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const to = { x: -100, y: -100 },
      at = { x: -100, y: -100 };
    let raf = 0,
      last = 0;
    const tick = (t: number) => {
      // time-based easing: it catches up just as fast on a slow frame rate as on a fast one
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 1 / 60;
      last = t;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 28);
      at.x += (to.x - at.x) * k;
      at.y += (to.y - at.y) * k;
      el.style.transform = `translate3d(${at.x}px,${at.y}px,0)`;
      raf = Math.abs(to.x - at.x) + Math.abs(to.y - at.y) > 0.1 ? requestAnimationFrame(tick) : ((last = 0), 0);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      to.x = e.clientX;
      to.y = e.clientY;
      el.classList.add("on");
      const t = e.target as Element | null;
      el.classList.toggle("hot", !!t?.closest?.("a, button, [role='button'], label, .case, canvas.over"));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => el.classList.remove("on");
    const onDown = () => el.classList.add("press");
    const onUp = () => el.classList.remove("press");
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true" />;
}
