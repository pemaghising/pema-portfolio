"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { toolsContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;
const BASE_VELOCITY = 2;

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  const mod = (((value - min) % range) + range) % range;
  return mod + min;
}

function useMarqueeX() {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 2000], [-5, 5], {
    clamp: true,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;

    let moveBy = directionFactor.current * BASE_VELOCITY * (delta / 1000);
    const factor = velocityFactor.get();

    if (factor < 0) directionFactor.current = -1;
    else if (factor > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return x;
}

export default function Tools() {
  const track = [...toolsContent.items, ...toolsContent.items];
  const x = useMarqueeX();

  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-10">
        <motion.div
          className="col-span-12 md:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <SectionLabel index="06" />
          <h2 className="mt-3 text-pretty font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {toolsContent.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </motion.div>
        <motion.p
          className="col-span-12 self-end text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          {preventOrphan(toolsContent.supporting)}
        </motion.p>
      </div>

      <div className="relative mt-20 py-8">
        <Divider className="absolute top-0" />
        <motion.div
          aria-hidden
          style={{ x }}
          className="flex w-max"
        >
          {track.map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className="flex items-center whitespace-nowrap font-serif text-[clamp(2rem,6vw,4rem)] text-primary"
            >
              {tool}
              <span aria-hidden className="mx-8 text-accent">
                ·
              </span>
            </span>
          ))}
        </motion.div>
        <Divider className="absolute bottom-0" />
        <p className="sr-only">{toolsContent.items.join(", ")}</p>
      </div>
    </section>
  );
}
