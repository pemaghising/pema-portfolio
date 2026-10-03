"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { nav, site } from "@/data/site";
import { available, getLevel, getServerState, getState, subscribe, toggle } from "@/lib/sound";

function SoundButton() {
  const s = useSyncExternalStore(subscribe, getState, getServerState);
  const bars = useRef<HTMLSpanElement>(null);
  // the level meter writes straight to the DOM, so React does not re-render every frame
  useEffect(() => {
    if (!s.on) return;
    let id = 0;
    const tick = () => {
      const lv = getLevel();
      bars.current?.querySelectorAll("i").forEach((el, i) => {
        el.style.transform = `scaleY(${0.15 + Math.min(1, lv * (1.6 - i * 0.2)) * 0.85})`;
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [s.on]);
  return (
    <button
      className={`snd${s.blocked ? " wait" : ""}`}
      type="button"
      aria-pressed={s.on}
      aria-label={s.on ? "Pause music" : "Play music"}
      title={s.blocked ? "Tap to play the music" : undefined}
      onClick={toggle}
    >
      <span className="ic" aria-hidden="true" />
      <span className="bars" ref={bars} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} />
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
