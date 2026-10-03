"use client";

import { useEffect, useRef } from "react";

/**
 * The orange-foam dot is the site's cursor on mouse and pen devices: the system cursor is hidden
 * (only once this script runs, so it never disappears without a replacement) and the dot sits
 * exactly on the pointer. It swells and stretches with the speed of the hand (shake it and it
 * grows), then settles. Over anything clickable it opens into a ring; on press it tightens.
 * Touch devices keep their normal behaviour.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current!;
    const blob = el.firstElementChild as HTMLElement;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("has-cursor");

    let x = -100,
      y = -100,
      lx = 0,
      ly = 0,
      lt = 0,
      speed = 0, // smoothed px per second
      angle = 0,
      raf = 0,
      last = 0;

    const frame = (t: number) => {
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 1 / 60;
      last = t;
      // speed falls back to rest on its own, so the dot shrinks once the hand stops
      speed *= Math.exp(-dt * 6);
      const v = reduce ? 0 : Math.min(1, speed / 900); // a brisk hand movement is ~900px/s
      const grow = 1 + v * 1.2; // up to 2.2× when moved fast or shaken
      const stretch = 1 + v * 0.35; // a little longer along the direction of travel
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
      blob.style.transform = `rotate(${angle}rad) scale(${grow * stretch},${grow / stretch})`;
      raf = speed > 5 ? requestAnimationFrame(frame) : ((last = 0), (speed = 0), 0);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = e.timeStamp;
      const dx = e.clientX - lx,
        dy = e.clientY - ly,
        dt = (now - lt) / 1000;
      if (lt && dt > 0 && dt < 0.1) {
        const inst = Math.hypot(dx, dy) / dt;
        speed += (inst - speed) * 0.35;
        if (Math.hypot(dx, dy) > 1.5) angle = Math.atan2(dy, dx);
      }
      lx = x = e.clientX;
      ly = y = e.clientY;
      lt = now;
      el.classList.add("on");
      const t = e.target as Element | null;
      el.classList.toggle("hot", !!t?.closest?.("a, button, [role='button'], label, .case, canvas.over, canvas.drag"));
      kick();
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

  return (
    <div ref={dot} className="cursor" aria-hidden="true">
      <i />
    </div>
  );
}
