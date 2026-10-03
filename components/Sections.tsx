import { about, beyond, philosophy, tools } from "@/data/site";
import { Label, Rise, Words } from "./Reveal";

export function About() {
  return (
    <section id="about" data-scene="About" aria-labelledby="about-title" className="surface-paper pb-[var(--space-section)]">
      <div className="grid-sys gap-y-8">
        <Label no="03" className="col-span-4 md:col-span-2 lg:pt-[1.4vw]">
          About
        </Label>
        <h2 id="about-title" className="sr-only">
          About Pema
        </h2>
        <Words
          text={about.lead}
          className="col-span-4 text-[clamp(2rem,4.6vw,5.75rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance md:col-span-8 lg:col-span-10"
        />
        <Rise className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-7 lg:mt-10">
          <p className="t-lead text-[clamp(1.25rem,1.6vw,1.75rem)]">{about.body}</p>
        </Rise>
      </div>

      <div className="grid-sys mt-[clamp(5rem,10vw,11rem)]">
        <h3 className="t-micro muted col-span-4 mb-6 md:col-span-2">What Pema does</h3>
        <ol className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-3">
          {about.disciplines.map((d, i) => (
            <Rise as="li" key={d.name} className="hairline grid grid-cols-4 gap-x-[var(--gutter)] gap-y-3 border-t py-[clamp(1.25rem,2.4vw,2.75rem)] md:grid-cols-8 lg:grid-cols-10">
              <span className="t-micro muted col-span-1 pt-[0.9vw]">{String(i + 1).padStart(2, "0")}</span>
              <span className="col-span-3 text-[clamp(2rem,4.4vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.04em] md:col-span-4 lg:col-span-5">
                {d.name}
              </span>
              <span className="muted col-span-3 col-start-2 max-w-[36ch] md:col-span-3 md:col-start-auto lg:col-span-4 lg:pt-[0.9vw]">
                {d.text}
              </span>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** An interlude: the principle, set at a volume that practises it. */
export function Philosophy() {
  return (
    <section data-scene="Philosophy" aria-label="Philosophy" className="surface-paper grid min-h-[100svh] place-items-center px-[var(--margin)] text-center">
      <div>
        <Words as="h2" text={philosophy.line} className="t-section text-balance" />
        <Rise delay={0.4}>
          <p className="t-micro muted mt-8">{philosophy.note}</p>
        </Rise>
      </div>
    </section>
  );
}

export function Kit() {
  return (
    <section data-scene="Off the clock" aria-labelledby="kit-title" className="surface-paper pb-[var(--space-section)]">
      <div className="grid-sys gap-y-16">
        <div className="col-span-4 md:col-span-8 lg:col-span-6">
          <Label no="08" className="mb-8">
            Tools
          </Label>
          <h2 id="kit-title" className="t-lead text-[clamp(2rem,3.6vw,4.25rem)] leading-[1.02] font-medium">
            {tools.lines.map((l, i) => (
              <Words key={l} as="span" text={l} delay={i * 0.15} className={i === 0 ? "" : "muted"} />
            ))}
          </h2>
          <Rise>
            <ul className="t-micro mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {tools.list.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Rise>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
          <p className="t-micro muted mb-8">Beyond design</p>
          <dl>
            {beyond.map((b) => (
              <Rise key={b.label} className="hairline grid grid-cols-5 items-baseline gap-x-[var(--gutter)] border-t py-5">
                <dt className="col-span-2 font-semibold">{b.label}</dt>
                <dd className="muted col-span-3">{b.text}</dd>
              </Rise>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
