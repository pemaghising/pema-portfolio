"use client";

import { useEffect, useRef, useState } from "react";
import { contact, kana, site } from "@/data/site";

const icons: Record<string, React.ReactNode> = {
  Email: (
    <svg className="ic3" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </svg>
  ),
  LinkedIn: (
    <svg className="ic3 fill" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="4.8" r="2.2" />
      <path d="M10 9h3.8v1.7c.7-1.2 2-2 3.8-2 3.2 0 4.4 2 4.4 5.3V21h-4v-6.2c0-1.5-.5-2.5-1.9-2.5S14 13.3 14 14.8V21h-4z" />
    </svg>
  ),
  Instagram: (
    <svg className="ic3" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
};
const verbs: Record<string, string> = { Email: "Say hello", LinkedIn: "Connect", Instagram: "Follow" };

const tracks = [{ label: "Email", href: `mailto:${contact.email}` }, ...contact.links];

/** Side B: plug the headphones into the player, then pick a track to get in touch. */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<{ toggle: () => void } | null>(null);
  const [plugged, setPlugged] = useState(false);
  const [has3d, setHas3d] = useState(true);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let ct: ReturnType<typeof import("@/lib/contact3d").createContactScene> = null;
    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        ct?.run(visible);
      },
      { rootMargin: "200px 0px" },
    );
    let started = false;
    const start = async () => {
      if (started) return;
      started = true;
      const [m, c3] = await Promise.all([import("@/lib/mixtape3d"), import("@/lib/contact3d")]);
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
      if (disposed) return;
      const labelCanvas = m.makeLabel({ name: site.name, role: site.role, years: site.years, kana, catalogue: "PG-001" });
      ct = c3.createContactScene({ canvas: canvas.current!, labelCanvas, reduce, onPlugged: setPlugged });
      if (!ct) return setHas3d(false);
      scene.current = ct;
      if (reduce) ct.setPlugged(true);
      ct.run(visible);
    };
    io.observe(root.current!);
    return () => {
      disposed = true;
      io.disconnect();
      ct?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <section id="contact" ref={root} aria-labelledby="ct">
      <p className="ct-k">{kana} · SIDE B · CONTACT</p>
      <h2 className="ct-h" id="ct">
        {contact.invite}
      </h2>
      {has3d && (
        <div className={`ct-stage${plugged ? " on" : ""}`}>
          <canvas id="gl2" ref={canvas} aria-hidden="true" />
          <p className="ct-hint" aria-live="polite">
            <span className="dot" aria-hidden="true" />
            <span>{plugged ? "Connected. Say hello." : "Drag the plug into the player"}</span>
          </p>
          <button className="plug-btn" type="button" aria-pressed={plugged} onClick={() => scene.current?.toggle()}>
            <svg className="ic2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 3v5M15 3v5" />
              <path d="M6.5 8h11v3.2a5.5 5.5 0 0 1-11 0z" />
              <path d="M12 16.7V21" />
              {plugged && <path d="M3.5 3.5l17 17" />}
            </svg>
            <span>{plugged ? "Unplug" : "Plug in"}</span>
          </button>
        </div>
      )}
      <div className="tl">
        <div className="tl-h">
          <span>Side B · Contact</span>
          <span>{kana}</span>
        </div>
        {tracks.map((t, i) => {
          const external = t.href.startsWith("http");
          return (
            <a key={t.label} className="trk" href={t.href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              {icons[t.label]}
              <b>{t.label}</b>
              <span className="lead">
                <span className="eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {verbs[t.label] ?? "Open"}
              </span>
              {external && <span className="sr"> (opens in a new tab)</span>}
            </a>
          );
        })}
      </div>
      <div className="ct-foot">
        <span>
          {site.name.toUpperCase()} · {site.role.toUpperCase()}
        </span>
        <span>
          {kana} · PG-001 · SIDE B
        </span>
      </div>
    </section>
  );
}
