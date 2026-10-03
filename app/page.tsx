import { about, contact, currently, experience, nav, otherWork, projects, site } from "@/data/site";

export default function Home() {
  return (
    <main>
      <h1>{site.name}</h1>
      <p>{site.role}</p>
      <p>{site.statement}</p>
      <nav>
        <ul>
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <h2>Work</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>{p.title}</li>
        ))}
        {otherWork.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <h2>About</h2>
      <p>{about.lead}</p>
      <p>{about.body}</p>
      <ul>
        {about.disciplines.map((d) => (
          <li key={d.name}>
            {d.name}: {d.text}
          </li>
        ))}
      </ul>
      <h2>Experience</h2>
      {experience.map((r) => (
        <p key={r.company}>
          {r.title}, {r.company}, {r.start}–{r.end ?? "present"}. {r.text}
        </p>
      ))}
      <h2>Currently</h2>
      <ul>
        {currently.map((c) => (
          <li key={c.label}>
            {c.label}: {c.text}
          </li>
        ))}
      </ul>
      <h2>Contact</h2>
      <p>{contact.invite}</p>
      <ul>
        <li>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        {contact.links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
