import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import Plate from "@/components/Plate";
import { contact, projects } from "@/data/site";

// Only projects without their own standalone page get a /work route.
const routed = projects.filter((p) => !p.href);

export const dynamicParams = false;

export function generateStaticParams() {
  return routed.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = routed.find((x) => x.slug === slug);
  if (!p) return {};
  const ready = !!p.sections?.length;
  return {
    title: p.title,
    description: p.summary ?? `${p.title} — a project by Pema Ghising. Case study in preparation.`,
    alternates: { canonical: `/work/${p.slug}` },
    // Placeholder studies stay out of search results until they have content.
    robots: ready ? undefined : { index: false, follow: true },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = routed.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = routed[(routed.indexOf(project) + 1) % routed.length];
  const meta = [
    ["Project", `No. ${String(index + 1).padStart(2, "0")}`],
    ["Category", project.category],
    ["Year", project.year],
    ["Status", project.sections?.length ? "Case study" : "Case study in preparation"],
  ].filter((m): m is [string, string] => !!m[1]);

  return (
    <main id="main" className="surface-ink">
      {/* The plate the visitor clicked, now the whole frame. */}
      <section className="relative h-[100svh]" aria-labelledby="case-title">
        <ViewTransition name={`plate-${project.slug}`} share="morph" enter="plate-rise" default="none">
          <div className="absolute inset-0">
            <Plate project={project} index={index} priority bare />
          </div>
        </ViewTransition>
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 px-[var(--margin)] pt-40 pb-[clamp(5rem,12vh,9rem)] ${project.cover ? "bg-linear-to-t from-[var(--color-ink)] to-transparent" : ""}`}
        >
          <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
            <h1
              id="case-title"
              className="wide w-fit text-[clamp(3.25rem,13vw,12rem)] lg:text-[10vw] leading-[0.85] font-bold tracking-[-0.05em] text-balance"
            >
              {project.title}
            </h1>
          </ViewTransition>
        </div>
      </section>

      <ViewTransition enter={{ "to-case": "page", default: "none" }} exit={{ "nav-back": "page", default: "none" }} default="none">
        <div>
          <dl className="grid-sys hairline t-micro gap-y-6 border-b py-8">
            {meta.map(([k, v]) => (
              <div key={k} className="col-span-2 md:col-span-2 lg:col-span-3">
                <dt className="muted mb-1">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {project.sections?.length ? (
            <article className="py-[var(--space-section)]">
              {project.summary && (
                <p className="grid-sys t-lead mb-[var(--space-section)]">
                  <span className="col-span-4 md:col-span-7 lg:col-span-8 lg:col-start-3">{project.summary}</span>
                </p>
              )}
              {project.sections.map((s) => (
                <section key={s.heading} className="grid-sys mb-[clamp(5rem,10vw,10rem)] gap-y-6">
                  <h2 className="t-micro muted col-span-4 md:col-span-2">{s.heading}</h2>
                  <p className="t-lead col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">{s.body}</p>
                  {s.media && (
                    <div className="relative col-span-4 mt-8 md:col-span-8 lg:col-span-12" style={{ aspectRatio: `${s.media.width}/${s.media.height}` }}>
                      <Image src={s.media.src} alt={s.media.alt} fill sizes="100vw" className="object-cover" />
                    </div>
                  )}
                </section>
              ))}
            </article>
          ) : (
            <div className="grid-sys gap-y-8 py-[var(--space-section)]">
              <p className="t-micro muted col-span-4 md:col-span-2">Note</p>
              <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
                <p className="t-lead">
                  The full story of {project.title} is still being written. Until it is published, the
                  name stands in for the work — nothing here has been invented to fill the space.
                </p>
                <p className="muted mt-8">
                  Want to see it sooner?{" "}
                  <a href={`mailto:${contact.email}?subject=${encodeURIComponent(project.title)}`} className="link-u text-[var(--fg)]">
                    {contact.email}
                  </a>
                </p>
              </div>
            </div>
          )}

          <nav aria-label="Projects" className="hairline border-t">
            <Link
              href={`/work/${next.slug}`}
              transitionTypes={["to-case"]}
              className="group grid-sys items-end gap-y-3 py-[clamp(3rem,8vw,8rem)]"
              data-cursor="Next"
            >
              <span className="t-micro muted col-span-4 md:col-span-2">Next project</span>
              <span className="wide col-span-4 text-[clamp(2.5rem,8vw,9rem)] leading-[0.88] font-bold tracking-[-0.05em] transition-transform duration-700 group-hover:translate-x-[1vw] md:col-span-6 lg:col-span-10">
                {next.title}
              </span>
            </Link>
            <div className="grid-sys hairline t-micro border-t py-6">
              <Link href="/#work" transitionTypes={["nav-back"]} className="link-u col-span-4 justify-self-start">
                ← Back to the index
              </Link>
            </div>
          </nav>
        </div>
      </ViewTransition>
    </main>
  );
}
