"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { whatIDoContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

export default function WhatIDo() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4">
        <div className="col-span-12 mb-16 md:col-span-6">
          <SectionLabel index="02" />
          <h2 className="mt-3 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            <span className="block">WHAT I</span>
            <span className="block">DO.</span>
          </h2>
        </div>
      </div>

      <div className="border-t border-primary/15">
        {whatIDoContent.map((item, i) => (
          <div
            key={item.title}
            tabIndex={0}
            className="group border-b border-primary/15 py-6 outline-none md:py-8"
          >
            <div className="grid grid-cols-editorial items-baseline gap-x-4">
              <span className="col-span-2 font-sans text-xs tracking-[0.2em] text-secondary transition-colors duration-500 group-hover:text-accent group-focus-visible:text-accent md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="col-span-10 font-serif text-[clamp(1.75rem,5.5vw,3.75rem)] leading-none text-secondary transition-colors duration-500 group-hover:text-primary group-focus-visible:text-primary md:col-span-9">
                {item.title}
              </h3>
            </div>

            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="grid grid-cols-editorial gap-x-4 pt-4">
                  <p className="col-span-12 max-w-md text-pretty font-sans text-secondary md:col-span-5 md:col-start-8 md:text-lg">
                    {preventOrphan(item.description)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
