import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CoverArt } from "@/components/CoverArt";
import { kana, projects, site } from "@/data/site";

export const dynamicParams = false;

const pages = projects.filter((p) => !p.href);

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = pages.find((x) => x.slug === slug);
  if (!p) return {};
  const ready = Boolean(p.sections?.length);
  return {
    title: p.title,
    description: p.summary ?? `${p.title}, a project by ${site.name}.`,
    alternates: { canonical: `/work/${p.slug}` },
    // pages still in preparation stay out of search results
    robots: ready ? undefined : { index: false, follow: true },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = pages.find((x) => x.slug === slug);
  if (!p) notFound();
  const index = projects.indexOf(p);
  const no = String(index + 1).padStart(3, "0");
  const meta = [p.category, p.year].filter(Boolean);

  return (
    <main id="main" className="cs-page">
      <div className="cs-cover">
        <ViewTransition name={`cover-${p.slug}`} share="cover" default="none">
          <CoverArt project={p} index={index} kana={kana} sizes="(max-width: 760px) 260px, 420px" />
        </ViewTransition>
      </div>
      <article>
        <p className="cs-k">
          PG-{no} · {kana}
        </p>
        <h1 className="cs-h">{p.title}</h1>
        {meta.length > 0 && (
          <p className="cs-meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        )}
        {p.summary && <p className="cs-sum">{p.summary}</p>}
        {p.sections?.length ? (
          p.sections.map((s) => (
            <section className="cs-sec" key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
              {s.media && <Image src={s.media.src} alt={s.media.alt} width={s.media.width} height={s.media.height} sizes="(max-width: 760px) 100vw, 62ch" />}
            </section>
          ))
        ) : (
          <div className="cs-prep">
            <p>This case study is in preparation.</p>
            <p>The tape is labelled; the recording is still in the studio.</p>
          </div>
        )}
        <Link className="cs-back" href="/#work" transitionTypes={["tape-close"]}>
          ← Back to the library
        </Link>
      </article>
    </main>
  );
}
