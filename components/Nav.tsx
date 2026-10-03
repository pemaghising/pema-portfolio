"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { contact, nav } from "@/data/site";
import { scrollToId } from "./SmoothScroll";

/** The page reads as a 3-minute film; the nav shows where in it you are. */
const RUNTIME_S = 180;

function timecode(p: number) {
  const f = Math.round(Math.min(Math.max(p, 0), 1) * RUNTIME_S * 25);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(f / 1500))}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
}

export default function Nav() {
  const path = usePathname();
  const home = path === "/";
  const [ready, setReady] = useState(!home);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState("");
  const tc = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Revealed by the hero's opening sequence (or immediately elsewhere).
  useEffect(() => {
    if (!home || (window as { __introDone?: boolean }).__introDone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    const done = () => setReady(true);
    window.addEventListener("intro-done", done);
    return () => window.removeEventListener("intro-done", done);
  }, [home]);

  // Compact state + timecode, written straight to the DOM (no re-render per frame).
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setCompact(scrollY > 60);
        if (tc.current) tc.current.textContent = timecode(max > 0 ? scrollY / max : 0);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [path]);

  // Current scene name from [data-scene] sections.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-scene]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setScene(e.target.getAttribute("data-scene") || "");
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  // Menu: escape to close, focus management, scroll lock.
  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const btn = menuBtn.current;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", key);
    return () => {
      removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
      btn?.focus();
    };
  }, [open]);

  const go = (e: MouseEvent, href: string) => {
    setOpen(false);
    if (!home) return; // let <Link> navigate back to the index
    const id = href.split("#")[1] || "top";
    if (scrollToId(id)) e.preventDefault();
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 text-[var(--color-paper)] mix-blend-difference"
        style={{
          viewTransitionName: "site-nav",
          opacity: ready ? 1 : 0,
          transform: ready ? "none" : "translateY(-12px)",
          transition: "opacity 1s var(--ease-out), transform 1s var(--ease-out)",
        }}
      >
        <nav
          aria-label="Primary"
          className="grid-sys items-center transition-[padding] duration-700"
          style={{ paddingBlock: compact ? 14 : 28, transitionTimingFunction: "var(--ease-out)" }}
        >
          <Link
            href="/"
            onClick={(e) => go(e, "/#top")}
            transitionTypes={home ? undefined : ["nav-back"]}
            className="col-span-2 flex items-baseline text-[15px] font-semibold tracking-[-0.01em] md:col-span-3"
            aria-label="Pema Ghising — home"
          >
            Pema
            <span
              className="inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-700"
              style={{ maxWidth: compact ? 0 : 120, opacity: compact ? 0 : 1 }}
            >
              &nbsp;Ghising
            </span>
          </Link>

          <p className="t-micro hidden items-center gap-3 lg:col-span-3 lg:col-start-5 lg:flex" aria-hidden>
            <span className="inline-block size-1.5 rounded-full bg-[var(--color-paper)]" />
            <span ref={tc} className="tabular-nums">00:00:00</span>
            <span className="opacity-60">{scene}</span>
          </p>

          <ul className="col-span-5 hidden justify-end gap-8 text-[15px] md:col-start-4 md:flex lg:col-start-8">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  transitionTypes={home ? undefined : ["nav-back"]}
                  className="link-u pb-0.5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            ref={menuBtn}
            type="button"
            className="col-span-2 col-start-3 h-6 justify-self-end overflow-hidden text-[15px] md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className="flex flex-col transition-transform duration-500"
              style={{ transform: open ? "translateY(-50%)" : "none", transitionTimingFunction: "var(--ease-out)" }}
            >
              <span className="h-6 leading-6">Menu</span>
              <span className="h-6 leading-6">Close</span>
            </span>
          </button>
        </nav>
      </header>

      <div
        id="menu"
        className="surface-ink fixed inset-0 z-40 flex flex-col justify-between px-[var(--margin)] pt-28 pb-10 md:hidden"
        style={{
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          visibility: open ? "visible" : "hidden",
          transition: `clip-path .8s var(--ease-in-out), visibility 0s ${open ? "0s" : ".8s"}`,
        }}
        aria-hidden={!open}
      >
        <ul>
          {nav.map((l, i) => (
            <li key={l.href} className="mask hairline border-b">
              <Link
                ref={i === 0 ? firstLink : undefined}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                tabIndex={open ? 0 : -1}
                className="wide flex items-baseline justify-between py-3 text-[13vw] leading-[0.95] font-semibold tracking-[-0.04em]"
                style={{
                  transform: open ? "none" : "translateY(110%)",
                  transition: `transform .9s var(--ease-out) ${open ? 0.25 + i * 0.07 : 0}s`,
                }}
              >
                {l.label}
                <span className="t-micro muted">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="t-micro muted flex flex-col gap-2">
          <a href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1} className="normal-case">
            {contact.email}
          </a>
          <div className="flex gap-6">
            {contact.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
