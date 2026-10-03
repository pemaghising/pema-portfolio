"use client";

import { useRef } from "react";

/**
 * The About heading, with its rough construction hiding underneath: outlined letters and baseline
 * guides, revealed in a circle that follows the mouse. "Making ideas visible", literally.
 * The copy underneath is the real heading; the sketch is a decorative duplicate (aria-hidden).
 */
export function LensHeading({ id, text }: { id: string; text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const set = (x: number, y: number) => {
    ref.current?.style.setProperty("--x", `${x}px`);
    ref.current?.style.setProperty("--y", `${y}px`);
  };
  return (
    <h2
      ref={ref}
      className="ab-h ab-lens"
      id={id}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        set(e.clientX - r.left, e.clientY - r.top);
      }}
      onPointerLeave={() => set(-999, -999)}
    >
      {text}
      <span className="ab-sk" aria-hidden="true">
        {text}
      </span>
    </h2>
  );
}
