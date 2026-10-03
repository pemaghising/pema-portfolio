"use client";

import { useRef, useState } from "react";

type Item = { name: string; text: string };

/** One short looping scene per discipline, drawn in code (swap for real work footage later). */
function Scene({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="ab-type">
        <i className="a" />
        <i className="b" />
        <i className="d" />
        <i className="e" />
        <i className="f" />
      </div>
    );
  if (i === 1)
    return (
      <svg viewBox="30 0 340 200" preserveAspectRatio="xMinYMid meet">
        <path d="M40 170 C 120 170, 140 30, 200 30 S 300 170, 360 40" fill="none" stroke="#F2ECDF" strokeWidth="2.5" opacity=".5" id="ab-curve" />
        <path d="M40 170H360M40 30V170" stroke="#A9A7A0" strokeDasharray="3 5" opacity=".6" fill="none" />
        <circle className="ab-ball" r="8" fill="#F26A21">
          <animateMotion dur="3s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="spline" keySplines=".6 0 .3 1;.6 0 .3 1">
            <mpath href="#ab-curve" />
          </animateMotion>
        </circle>
      </svg>
    );
  if (i === 2)
    return (
      <div className="ab-marks">
        {Array.from({ length: 5 }, (_, k) => (
          <i key={k} style={{ ["--k" as string]: k }}>
            PG
          </i>
        ))}
      </div>
    );
  return (
    <div className="ab-sys">
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

/** The disciplines as an accordion: open a row and its card plays the discipline. One open at a time. */
export function Disciplines({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(0);
  const mouse = useRef(false); // a mouse opens rows by hovering, so its click only keeps one open; touch and keys toggle
  const intent = useRef(0);
  const hover = (e: React.PointerEvent, i: number) => {
    mouse.current = e.pointerType === "mouse";
    if (!mouse.current) return;
    // a short pause, so sweeping the pointer across rows doesn't flick them open
    clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setOpen(i), 90);
  };
  return (
    <ol className="ab-list" aria-label="Disciplines" onKeyDown={() => (mouse.current = false)}>
      {items.map((d, i) => {
        const isOpen = i === open;
        return (
          <li key={d.name} className={isOpen ? "open" : undefined} onPointerEnter={(e) => hover(e, i)} onPointerLeave={() => clearTimeout(intent.current)}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`ab-p${i}`} onClick={() => setOpen(mouse.current || !isOpen ? i : -1)}>
                <span className="n">
                  <span className="num">A{i + 1}</span>
                  <span className="play" aria-hidden="true">
                    ▶
                  </span>
                </span>
                <span className="tx">
                  <span className="nm">{d.name}</span>
                  <span className="ds">{d.text}</span>
                </span>
                <span className="eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="pm" aria-hidden="true" />
              </button>
            </h3>
            <div className="ab-reveal" id={`ab-p${i}`} inert={!isOpen}>
              <div>
                <div className="ab-view" aria-hidden="true">
                  <Scene i={i} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
