"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, ViewTransition } from "react";
import { flushSync } from "react-dom";
import type { Project } from "@/data/site";
import { CoverArt } from "./CoverArt";

const KEY = "pg-mix-order";

type Props = { projects: Project[]; kana: string };

/**
 * The tape library: each project is a cassette case showing its cover. Visitors can drag the
 * cases into their own order (mouse anywhere, touch on the grip, Alt + arrow keys); the order is
 * saved in their browser. Clicking a case opens its page, and its cover carries over (ViewTransition).
 */
export function Library({ projects, kana }: Props) {
  const initial = projects.map((p) => p.slug);
  const [order, setOrder] = useState(initial);
  const [active, setActive] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const list = useRef<HTMLOListElement>(null);
  const flip = useRef<{ state: unknown; exclude?: Element } | null>(null);
  const gs = useRef<{ gsap: typeof import("gsap").gsap; Flip: typeof import("gsap/Flip").Flip } | null>(null);
  const drag = useRef<{ el: HTMLElement; id: number; x0: number; y0: number; gx: number; gy: number; on: boolean; slug: string } | null>(null);
  const reduce = useRef(false);
  const bySlug = new Map(projects.map((p, i) => [p.slug, { p, i }]));

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    Promise.all([import("gsap"), import("gsap/Flip")]).then(([{ gsap }, { Flip }]) => {
      gsap.registerPlugin(Flip);
      gs.current = { gsap, Flip };
    });
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(saved) && saved.length === initial.length && initial.every((s) => saved.includes(s))) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a saved, per-visitor preference after hydration
        setOrder(saved);
      }
    } catch {}
    // initial is derived from props and stable for the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changed = order.join() !== initial.join();
  useEffect(() => {
    try {
      if (changed) localStorage.setItem(KEY, JSON.stringify(order));
      else localStorage.removeItem(KEY);
    } catch {}
  }, [order, changed]);

  // animate every reorder from where things were
  useLayoutEffect(() => {
    const f = flip.current;
    if (!f || !gs.current) return;
    flip.current = null;
    const { Flip } = gs.current;
    Flip.from(f.state as ReturnType<typeof Flip.getState>, {
      duration: reduce.current ? 0 : 0.35,
      ease: "power3.out",
      targets: [...(list.current?.children ?? [])].filter((c) => c !== f.exclude),
    });
  }, [order]);

  const items = () => [...(list.current?.children ?? [])] as HTMLElement[];
  const capture = (exclude?: Element) => {
    if (gs.current) flip.current = { state: gs.current.Flip.getState(items().filter((c) => c !== exclude)), exclude };
  };
  const move = (slug: string, to: number, exclude?: Element) => {
    capture(exclude);
    setOrder((o) => {
      const n = o.filter((s) => s !== slug);
      n.splice(to, 0, slug);
      return n;
    });
  };

  const layoutPos = (el: HTMLElement) => {
    const r = list.current!.getBoundingClientRect();
    return { x: r.left + el.offsetLeft, y: r.top + el.offsetTop };
  };

  const onPointerDown = (e: React.PointerEvent, slug: string) => {
    if (e.button !== 0) return;
    if (e.pointerType !== "mouse" && !(e.target as Element).closest(".grip")) return;
    const el = (e.currentTarget as HTMLElement).closest("li") as HTMLElement;
    const lp = layoutPos(el);
    drag.current = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, gx: e.clientX - lp.x, gy: e.clientY - lp.y, on: false, slug };
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id || !gs.current) return;
      const { gsap } = gs.current;
      if (!d.on) {
        if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
        d.on = true;
        list.current!.classList.add("sorting");
        d.el.classList.add("lifted");
        d.el.style.pointerEvents = "none";
      }
      e.preventDefault();
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest("li.case") as HTMLElement | null;
      if (over && over !== d.el && over.parentNode === list.current) {
        const to = items().indexOf(over);
        flushSync(() => move(d.slug, to, d.el));
      }
      const lp = layoutPos(d.el);
      gsap.set(d.el, { x: e.clientX - d.gx - lp.x, y: e.clientY - d.gy - lp.y, rotate: -2, scale: 1.04 });
    };
    const onUp = () => {
      const d = drag.current;
      drag.current = null;
      if (!d || !d.on || !gs.current) return;
      d.el.style.pointerEvents = "";
      list.current!.classList.remove("sorting");
      gs.current.gsap.to(d.el, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: reduce.current ? 0 : 0.45,
        ease: "back.out(1.6)",
        onComplete: () => d.el.classList.remove("lifted"),
      });
      const pos = items().indexOf(d.el) + 1;
      setLive(`${bySlug.get(d.slug)?.p.title} moved to position ${pos} of ${projects.length}.`);
      // the click that ends a drag should not open the project
      // (removed shortly after, so a click that never comes can't swallow the next real one)
      const block = (ev: Event) => (ev.preventDefault(), ev.stopPropagation());
      addEventListener("click", block, { capture: true, once: true });
      setTimeout(() => removeEventListener("click", block, { capture: true }), 100);
    };
    addEventListener("pointermove", onMove, { passive: false });
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
    };
  });

  const onKeyDown = (e: React.KeyboardEvent, slug: string) => {
    if (!e.altKey || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const i = order.indexOf(slug),
      back = e.key === "ArrowUp" || e.key === "ArrowLeft",
      j = back ? i - 1 : i + 1;
    if (j < 0 || j >= order.length) return;
    move(slug, j);
    setLive(`${bySlug.get(slug)?.p.title} moved to position ${j + 1} of ${order.length}.`);
    requestAnimationFrame(() => (document.querySelector(`[data-slug="${slug}"] a`) as HTMLElement | null)?.focus());
  };

  // tilt + glare toward the cursor
  const onHover = (e: React.PointerEvent) => {
    if (drag.current?.on || reduce.current || e.pointerType !== "mouse") return;
    const c = e.currentTarget as HTMLElement,
      r = c.querySelector(".cs")!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    c.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    c.style.setProperty("--gx", `${x * 100}%`);
  };
  const onLeave = (e: React.PointerEvent) => {
    const c = e.currentTarget as HTMLElement;
    c.style.setProperty("--ry", "0deg");
    c.style.setProperty("--rx", "0deg");
    c.style.setProperty("--gx", "30%");
  };

  // a cover only gets its transition name on the click that opens it, so two are never mounted at once
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(null), 1500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section id="work" aria-labelledby="wk">
      <div className="wk-head">
        <h2 id="wk">The tape library</h2>
        <div className="wk-tools">
          <p>DRAG THE TAPES TO MAKE YOUR OWN MIX</p>
          {changed && (
            <button
              className="reset"
              type="button"
              onClick={() => {
                capture();
                setOrder(initial);
                setLive("Original order restored.");
              }}
            >
              Reset order
            </button>
          )}
        </div>
      </div>
      <p className="sr" aria-live="polite">
        {live}
      </p>
      <p className="sr" id="how">
        Drag to reorder, or press Alt with an arrow key.
      </p>
      <ol className="lib" ref={list}>
        {order.map((slug) => {
          const { p, i } = bySlug.get(slug)!;
          const no = String(i + 1).padStart(3, "0");
          const status = p.sections?.length || p.href ? "Case study" : "In preparation";
          const art = (
            <div className="cs">
              <span className="hinge" aria-hidden="true" />
              {p.href ? (
                <CoverArt project={p} index={i} kana={kana} />
              ) : (
                <ViewTransition name={active === slug ? `cover-${slug}` : undefined} share="cover" default="none">
                  <CoverArt project={p} index={i} kana={kana} />
                </ViewTransition>
              )}
              <span className="glare" aria-hidden="true" />
            </div>
          );
          const cap = (
            <div className="cap">
              <span className="no">PG-{no}</span>
              <span className="nm">{p.title}</span>
              <span className="st">{status}</span>
            </div>
          );
          return (
            <li key={slug} className="case" data-slug={slug} onPointerMove={onHover} onPointerLeave={onLeave} onPointerDown={(e) => onPointerDown(e, slug)}>
              {p.href ? (
                <a href={p.href} className="case-link" aria-describedby="how" onKeyDown={(e) => onKeyDown(e, slug)} draggable={false}>
                  {art}
                  {cap}
                </a>
              ) : (
                <Link
                  href={`/work/${slug}`}
                  className="case-link"
                  aria-describedby="how"
                  draggable={false}
                  transitionTypes={["tape-open"]}
                  onKeyDown={(e) => onKeyDown(e, slug)}
                  onClick={() => flushSync(() => setActive(slug))}
                >
                  {art}
                  {cap}
                </Link>
              )}
              <span className="grip" aria-hidden="true" />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
