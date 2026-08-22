"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { experienceContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  return (
    <section className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-7">
          <SectionLabel index="05" />
          <h2 className="mt-3 text-pretty font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.9] text-primary">
            {experienceContent.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <p className="col-span-12 self-end text-pretty font-sans text-base text-secondary md:col-span-4 md:col-start-9 md:text-lg">
          {preventOrphan(experienceContent.intro)}
        </p>
      </div>

      <div className="mt-20 border-t border-primary/15">
        {experienceContent.roles.map((role, i) => (
          <motion.div
            key={role.title}
            className="grid grid-cols-editorial gap-x-4 gap-y-6 border-b border-primary/15 py-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          >
            <span className="col-span-12 font-sans text-xs uppercase tracking-[0.2em] text-accent md:col-span-2">
              {role.period}
            </span>

            <div className="col-span-12 md:col-span-5">
              <h3 className="text-pretty font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight text-primary">
                {role.title}
              </h3>
              <p className="mt-2 font-sans text-sm uppercase tracking-[0.15em] text-secondary">
                {role.company}
              </p>
            </div>

            <div className="col-span-12 flex flex-wrap gap-x-4 gap-y-2 md:col-span-2">
              {role.disciplines.map((discipline) => (
                <span
                  key={discipline}
                  className="font-sans text-xs uppercase tracking-[0.15em] text-secondary"
                >
                  {discipline}
                </span>
              ))}
            </div>

            <p className="col-span-12 max-w-sm text-pretty font-sans text-secondary md:col-span-3">
              {preventOrphan(role.description)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
