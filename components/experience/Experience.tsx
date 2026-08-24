"use client";

import { motion } from "framer-motion";
import Divider from "@/components/ui/Divider";
import SectionLabel from "@/components/ui/SectionLabel";
import { experienceContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  return (
    <section className="relative bg-transparent px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-16">
        <div className="col-span-12">
          <SectionLabel index="01" />
        </div>

        <motion.h2
          className="col-span-12 font-serif text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] text-primary md:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          {experienceContent.heading.map((line) => (
            <span key={line} className="block">
              {accentPeriod(line)}
            </span>
          ))}
        </motion.h2>

        <div className="col-span-12 flex max-w-xl flex-col gap-8 md:col-span-5 md:col-start-8">
          {experienceContent.paragraphs.map((paragraph, i) => (
            <motion.p
              key={paragraph}
              className="text-pretty font-sans text-base text-secondary md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              {preventOrphan(paragraph)}
            </motion.p>
          ))}
        </div>
      </div>

      <Divider className="mt-20" />
      <div className="grid grid-cols-1 gap-0 border-t border-b border-primary/10 bg-surface">
        {experienceContent.roles.map((role, i) => (
          <motion.div
            key={role.title}
            className={`grid grid-cols-1 items-start gap-8 border-primary/10 p-8 md:grid-cols-12 ${
              i !== experienceContent.roles.length - 1 ? "border-b" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
          >
            {/* Date & company */}
            <div className="md:col-span-3 md:pr-6">
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono text-xs tracking-[0.1em] text-primary">
                  {role.period}
                </span>
              </div>
              <p className="mt-2 font-sans text-sm uppercase tracking-[0.15em] text-secondary">
                {role.company}
              </p>
            </div>

            {/* Role & narrative */}
            <div className="md:col-span-5 md:px-6">
              <h3 className="mb-4 font-serif text-2xl text-primary md:text-3xl">
                {role.title}
              </h3>
              <p className="max-w-md text-pretty font-sans text-secondary">
                {preventOrphan(role.description)}
              </p>
            </div>

            {/* Disciplines */}
            <div className="flex flex-wrap gap-2 md:col-span-4 md:justify-end md:pl-6">
              {role.disciplines.map((discipline) => (
                <span
                  key={discipline}
                  className="rounded-full border border-accent/30 px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-accent"
                >
                  {discipline}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
