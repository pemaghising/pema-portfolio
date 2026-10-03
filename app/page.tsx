import { site } from "@/data/site";

/** Foundation only: sections are built one by one (docs/02-process.md). */
export default function Home() {
  return (
    <main id="main" className="px-(--gutter)">
      <section className="flex min-h-svh flex-col justify-center gap-8 pt-24">
        <p className="font-pixel text-sm text-ink-2">ペマ・ギシン · PG-001</p>
        <h1 className="font-display text-[clamp(48px,15.2vw,300px)] leading-[0.84] tracking-[-0.015em] whitespace-nowrap">
          <span className="block">PEMA</span>
          <span className="block text-right">GHISING</span>
        </h1>
        <p className="max-w-[34ch] text-base font-medium text-balance">{site.statement}</p>
      </section>
      <section id="work" className="min-h-[50svh]" />
      <section id="about" className="min-h-[50svh]" />
      <section id="experiments" className="min-h-[50svh]" />
      <section id="contact" className="min-h-[50svh]" />
    </main>
  );
}
