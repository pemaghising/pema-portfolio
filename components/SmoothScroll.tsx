"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooth scroll, off for reduced motion. Lenis runs on GSAP's ticker and tells ScrollTrigger
 * about every scroll, so scroll-driven animation and the page move on the same frame (no judder).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: true });
    let stop = () => {};
    let disposed = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => gsap.ticker.remove(tick);
    });
    return () => {
      disposed = true;
      stop();
      lenis.destroy();
    };
  }, []);
  return null;
}
