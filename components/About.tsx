import { about, beyond, experience, kana, philosophy, tools } from "@/data/site";

/** About, laid out like the liner notes folded inside a cassette case. */
export function About() {
  return (
    <section id="about" aria-labelledby="ab">
      <p className="ab-k">{kana} · LINER NOTES</p>
      <h2 className="ab-h" id="ab">
        {about.lead}
      </h2>
      <div className="ab-grid">
        <div className="ab-col">
          <p className="ab-body">{about.body}</p>
          <p className="ab-ph">
            <b>{philosophy.line}</b> {philosophy.note}
          </p>
        </div>
        <ol className="ab-list" aria-label="Disciplines">
          {about.disciplines.map((d, i) => (
            <li key={d.name}>
              <span className="n">
                <span className="num">A{i + 1}</span>
                <span className="play" aria-hidden="true">
                  ▶
                </span>
              </span>
              <div>
                <h3>{d.name}</h3>
                <p>{d.text}</p>
              </div>
              <span className="eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="ab-card">
        <div className="tl-h">
          <span>Experience</span>
          <span>{kana}</span>
        </div>
        {experience.map((r) => (
          <div className="ab-role" key={r.company + r.start}>
            <span className="yr">
              {r.start}–{r.end ?? "Now"}
            </span>
            <div>
              <h3>{r.title}</h3>
              <p className="co">
                {r.company}
                {!r.end && <span className="live">Now playing</span>}
              </p>
              <p>{r.text}</p>
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
