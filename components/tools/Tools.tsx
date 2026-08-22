"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { toolsContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

export default function Tools() {
  const track = [...toolsContent.items, ...toolsContent.items];

  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-6">
          <SectionLabel index="06" />
          <h2 className="mt-3 text-pretty font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {toolsContent.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <p className="col-span-12 self-end text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(toolsContent.supporting)}
        </p>
      </div>

      <div className="relative mt-20 border-y border-primary/15 py-8">
        <div
          aria-hidden
          className="flex w-max animate-[marquee_32s_linear_infinite] motion-reduce:animate-none"
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
        </div>
        <p className="sr-only">{toolsContent.items.join(", ")}</p>
      </div>
    </section>
  );
}
