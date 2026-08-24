"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { contactContent } from "@/data/content";
import { accentPeriod, preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINK_CLASS =
  "relative font-sans text-xs uppercase tracking-[0.2em] text-primary transition-colors duration-200 before:absolute before:inset-[-8px] before:content-[''] hover:text-accent focus-visible:text-accent";

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-16">
        <div className="col-span-12">
          <SectionLabel index="09" />
        </div>

        <motion.h2
          className="col-span-12 text-pretty font-serif text-[clamp(3rem,11vw,8.5rem)] leading-[0.9] text-primary md:col-span-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          {contactContent.heading.map((line) => (
            <span key={line} className="block">
              {accentPeriod(line)}
            </span>
          ))}
        </motion.h2>

        <div className="col-span-12 flex flex-col gap-10 md:col-span-6">
          <p className="max-w-md text-pretty font-sans text-base text-secondary md:text-lg">
            {preventOrphan(contactContent.subtitle)}
          </p>

          <a
            href={`mailto:${contactContent.email}`}
            className="group relative inline-flex w-fit items-center gap-4 border border-primary/15 px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] text-primary transition-colors duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent focus-visible:border-accent/40 focus-visible:bg-accent/5 focus-visible:text-accent"
          >
            {contactContent.cta}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        <div className="col-span-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-primary/10 pt-8 md:col-span-6 md:col-start-7 md:justify-end md:border-t-0 md:pt-0">
          {contactContent.socialLinks.map((link) => {
            const isPlaceholder = link.href === "#";

            if (isPlaceholder) {
              return (
                <span
                  key={link.label}
                  aria-disabled="true"
                  title={`${link.label} — coming soon`}
                  className="relative cursor-not-allowed font-sans text-xs uppercase tracking-[0.2em] text-secondary/50 before:absolute before:inset-[-8px] before:content-['']"
                >
                  {link.label}
                  <span className="ml-1.5 normal-case tracking-normal">(soon)</span>
                </span>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
