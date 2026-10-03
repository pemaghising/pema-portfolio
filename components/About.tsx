import { about, beyond, experience, kana, philosophy, tools } from "@/data/site";
import { Disciplines } from "./Disciplines";
import { LensHeading } from "./LensHeading";

/** About, laid out like the liner notes folded inside a cassette case. */
export function About() {
  return (
    <section id="about" aria-labelledby="ab">
      <p className="ab-k">{kana} · LINER NOTES</p>
      <LensHeading id="ab" text={about.lead} />
      <div className="ab-grid">
        <div className="ab-col">
          <p className="ab-body">{about.body}</p>
          <p className="ab-ph">
            <b>{philosophy.line}</b> {philosophy.note}
          </p>
        </div>
        <Disciplines items={about.disciplines} />
      </div>

      <div className="ab-card">
        <div className="tl-h">
          <span>Experience</span>
          <span>{kana}</span>
        </div>
        {experience.map((r) => (
          <div className="ab-role" key={r.company + r.start}>
            <span className="yr">
              {r.end === r.start ? r.start : `${r.start}–${r.end ?? "Now"}`}
            </span>
            <div>
              <h3>{r.title}</h3>
              <p className="co">
                {r.company}
                {!r.end && <span className="live">Now playing</span>}
              </p>
              {r.text && <p>{r.text}</p>}
            </div>
          </div>
        ))}
        <div className="ab-meta">
          <div>
            <h3>Tools</h3>
            <p>{tools.list.join(" · ")}</p>
            <p className="q">{tools.lines.join(" ")}</p>
          </div>
          <div>
            <h3>Off the clock</h3>
            <ul>
              {beyond.map((b) => (
                <li key={b.label}>
                  <b>{b.label}</b> {b.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
