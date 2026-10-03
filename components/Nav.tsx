"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { nav, site } from "@/data/site";
import { available, getServerState, getState, subscribe, toggle } from "@/lib/sound";

function SoundButton() {
  const s = useSyncExternalStore(subscribe, getState, getServerState);
  return (
    <button className="snd" type="button" aria-pressed={s.on} aria-label={s.on ? "Pause music" : "Play music"} onClick={toggle}>
      <span className="ic" aria-hidden="true" />
      <span className="bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} style={{ transform: `scaleY(${s.on ? 0.15 + Math.min(1, s.level * (1.6 - i * 0.2)) * 0.85 : 0.15})` }} />
        ))}
      </span>
    </button>
  );
}

/** Slim device strip: PG monogram, the section links, and a sound icon when there is music. */
export function Nav() {
  useEffect(() => {
    const set = () => document.body.classList.toggle("scrolled", scrollY > 24);
    set();
    addEventListener("scroll", set, { passive: true });
    return () => removeEventListener("scroll", set);
  }, []);
  return (
    <header className="bar">
      <Link className="id" href="/" aria-label={`PG, ${site.name}, home`}>
        PG
      </Link>
      {available ? <SoundButton /> : <span />}
      <nav aria-label="Primary">
        {nav.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
