"use client";

import { useEffect, useRef } from "react";

/**
 * The orange-foam dot is the site's cursor on mouse and pen devices: the system cursor is hidden
 * (only once this script runs, so it never disappears without a replacement) and the dot sits
 * exactly on the pointer. Over anything clickable it opens into a ring; on press it tightens.
 * Touch devices keep their normal behaviour.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current!;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100,
      y = -100,
      raf = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      el.classList.add("on");
      const t = e.target as Element | null;
      el.classList.toggle("hot", !!t?.closest?.("a, button, [role='button'], label, .case, canvas.over, canvas.drag"));
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => el.classList.remove("on");
    const onDown = () => el.classList.add("press");
    const onUp = () => el.classList.remove("press");
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true" />;
}
