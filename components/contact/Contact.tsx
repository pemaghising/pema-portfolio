"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { contactContent } from "@/data/content";
import { preventOrphan } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINK_CLASS =
  "font-sans text-xs uppercase tracking-[0.2em] text-secondary transition-colors duration-300 hover:text-accent focus-visible:text-accent";

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-10">
      <div className="grid grid-cols-editorial gap-x-4 gap-y-16">
        <div className="col-span-12">
          <SectionLabel index="10" />
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
              {line}
            </span>
          ))}
        </motion.h2>

        <div className="col-span-12 flex flex-col gap-10 md:col-span-6">
          <p className="max-w-md text-pretty font-sans text-base text-secondary md:text-lg">
            {preventOrphan(contactContent.subtitle)}
          </p>

          <a
            href={`mailto:${contactContent.email}`}
            className="group inline-flex w-fit items-center gap-3 font-sans text-sm uppercase tracking-[0.15em] text-primary transition-colors duration-300 hover:text-accent focus-visible:text-accent"
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

        <div className="col-span-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-primary/15 pt-8 md:col-span-6 md:col-start-7 md:justify-end md:border-t-0 md:pt-0">
          <a href={`mailto:${contactContent.email}`} className={LINK_CLASS}>
            EMAIL
          </a>
          {contactContent.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => e.preventDefault()}
              className={LINK_CLASS}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
