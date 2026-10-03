"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, ViewTransition } from "react";
import { otherWork, projects, type Project } from "@/data/site";
import Plate from "./Plate";
import { Rise, Words } from "./Reveal";

/**
 * The work index. Projects with a cover become editorial features; the rest
 * stay in a typographic index where the name is the hero. Hovering shows the
 * project plate under the cursor; clicking grows that plate into the case study.
 */
export default function Work() {
  const featured = projects.filter((p) => p.cover);
  const listed = projects.filter((p) => !p.cover);
  const [active, setActive] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.7 });
  const current = projects.find((p) => p.slug === active);

  return (
    <section id="work" data-scene="Work" aria-labelledby="work-title" className="surface-paper relative z-10 -mt-[100svh] pt-[clamp(6rem,12vw,12rem)] pb-[var(--space-section)]">
      <header className="grid-sys mb-[clamp(3rem,8vw,9rem)] items-end">
        <p className="t-micro muted col-span-4 mb-6 md:col-span-8 lg:col-span-12">02 — Selected work</p>
        <h2 id="work-title" className="t-section col-span-4 md:col-span-8 lg:col-span-9">
          <Words as="span" text="Work, in progress." />
        </h2>
        <Rise className="muted col-span-4 mt-6 max-w-[34ch] md:col-span-5 md:col-start-4 lg:col-span-3 lg:col-start-10 lg:mt-0">
          {projects.length} projects, one index. Most case studies are still in preparation — each will
          open from here.
        </Rise>
      </header>

      {featured.map((p) => (
        <Feature key={p.slug} project={p} index={projects.indexOf(p)} />
      ))}

      <ol
        className="index hairline border-t"
        onPointerMove={(e) => {
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {listed.map((p) => {
          const i = projects.indexOf(p);
          const row = (
            <>
              <span className="t-micro muted col-span-1 self-center tabular-nums lg:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-3 col-start-2 md:col-span-5 lg:col-span-9 lg:col-start-2">
                <ViewTransition name={`title-${p.slug}`} share="morph" default="none">
                  <span className="title inline-block text-[clamp(2.1rem,7vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
                    {p.title}
                  </span>
                </ViewTransition>
              </span>
              <span className="t-micro muted col-span-3 col-start-2 self-center md:col-span-2 md:col-start-auto md:text-right lg:col-start-11">
                {p.href ? "Case study ↗" : "In preparation"}
              </span>
            </>
          );
          const cls =
            "row grid-sys hairline relative items-baseline gap-y-2 border-b py-[clamp(1.1rem,2.2vw,2.4rem)]";
          return (
            <li key={p.slug} onPointerEnter={() => { setActive(p.slug); setLeaving(null); }}>
              {p.href ? (
                <a href={p.href} className={cls} data-cursor="Open">
                  {row}
                </a>
              ) : (
                <Link
                  href={`/work/${p.slug}`}
                  transitionTypes={["to-case"]}
                  className={cls}
                  data-cursor="View"
                  onClick={() => setLeaving(p.slug)}
                  // Keyboard focus hides the pointer plate; a click's focus must not,
                  // or the plate unmounts before it can grow into the case study.
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(null)}
                >
                  {row}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <Rise className="grid-sys mt-10">
        <p className="t-micro muted col-span-4 md:col-span-2">Also</p>
        <ul className="col-span-4 flex flex-wrap gap-x-8 gap-y-1 md:col-span-6 lg:col-span-9 lg:col-start-4">
          {otherWork.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </Rise>

      {/* Floating plate (fine pointers only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden [@media(pointer:fine)]:block"
        style={{ x: sx, y: sy }}
      >
        <div
          className="aspect-[4/3] w-[clamp(260px,24vw,440px)] translate-x-16 -translate-y-1/2 transition-[opacity,scale] duration-500"
          style={{
            opacity: current && !current.href ? 1 : 0,
            scale: current && !current.href ? 1 : 0.85,
            transitionTimingFunction: "var(--ease-out)",
          }}
        >
          {current && !current.href && (
            <ViewTransition name={leaving === current.slug ? `plate-${current.slug}` : undefined} share="morph" default="none">
              <div className="h-full w-full">
                <Plate project={current} index={projects.indexOf(current)} sizes="440px" />
              </div>
            </ViewTransition>
          )}
        </div>
      </motion.div>

      <style>{`
        .index .title { transition: transform .8s var(--ease-out), font-variation-settings .8s var(--ease-out); font-variation-settings: "wdth" 100; }
        .index .row { transition: opacity .5s var(--ease-out); }
        .index .row > span:first-child { transition: color .3s; }
        @media (hover: hover) {
          .index:has(.row:hover) .row:not(:hover) { opacity: .28; }
          .index .row:hover .title { transform: translateX(1.2vw); font-variation-settings: "wdth" 112; }
          .index .row:hover > span:first-child { color: var(--color-ink); }
        }
      `}</style>
    </section>
  );
}

function Feature({ project, index }: { project: Project; index: number }) {
  const layout = project.layout ?? "feature";
  const frame = {
    feature: "col-span-4 md:col-span-8 lg:col-span-8 aspect-[16/10]",
    wide: "col-span-4 md:col-span-8 lg:col-span-12 aspect-[21/9]",
    portrait: "col-span-4 md:col-span-5 lg:col-span-5 lg:col-start-7 aspect-[4/5]",
    full: "col-span-4 md:col-span-8 lg:col-span-12 aspect-[16/9]",
  }[layout];
  const meta = [project.category, project.year].filter(Boolean).join(" · ");
  return (
    <article className={`grid-sys mb-[clamp(5rem,10vw,10rem)] items-end gap-y-6 ${layout === "full" ? "!px-0" : ""}`}>
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["to-case"]}
        className={`group relative block overflow-hidden ${frame} ${layout === "portrait" ? "lg:order-2" : ""}`}
        data-cursor="View"
      >
        <ViewTransition name={`plate-${project.slug}`} share="morph" default="none">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]">
            <Plate project={project} index={index} sizes="(min-width:1024px) 66vw, 100vw" />
          </div>
        </ViewTransition>
        {project.hoverFrame && (
          <Image
            src={project.hoverFrame.src}
            alt=""
            fill
            sizes="(min-width:1024px) 66vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
      </Link>
      <div className={`col-span-4 md:col-span-6 lg:col-span-4 ${layout === "portrait" ? "lg:order-1 lg:col-start-1 lg:row-start-1 lg:self-center" : ""}`}>
        <p className="t-micro muted mb-3">
          {String(index + 1).padStart(2, "0")} {meta && `— ${meta}`}
        </p>
        <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
          <h3 className="t-section w-fit text-[clamp(2.5rem,5vw,6rem)]">{project.title}</h3>
        </ViewTransition>
        {project.summary && <p className="muted mt-4 max-w-[40ch]">{project.summary}</p>}
      </div>
    </article>
  );
}
