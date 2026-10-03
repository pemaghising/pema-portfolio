"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { available, getLevel, getState, onTapeInserted } from "@/lib/sound";

type Props = {
  name: string;
  role: string;
  years: string;
  kana: string;
  statement: string;
  trackCount: number;
};

const BOOTED = "pg-booted";

/**
 * Hero: label-maker boot (about 2s, once per session), a 3D cassette that tilts with the cursor,
 * then on scroll the player rises, the tape goes in, the door shuts and the reels spin.
 */
export function Hero({ name, role, years, kana, statement, trackCount }: Props) {
  const root = useRef<HTMLElement>(null);
  const [first, ...rest] = name.toUpperCase().split(" ");
  const last = rest.join(" ");

  // returning visitors (and reduced motion) skip the boot: drop it before the first paint
  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOTED) === "1";
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) root.current?.querySelector<HTMLElement>(".boot")?.style.setProperty("display", "none");
  }, []);

  useEffect(() => {
    const el = root.current!;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOTED) === "1";
    } catch {}
    let disposed = false;
    const cleanups: (() => void)[] = [];

    const ptr = { nx: 0, ny: 0 };
    const onMove = (e: PointerEvent) => {
      ptr.nx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ny = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => removeEventListener("pointermove", onMove));

    const portrait = innerWidth / innerHeight < 1;
    const REST = { rx: 0.1, ry: -0.4, rz: 0.05, y: portrait ? -0.45 : -0.78 };
    const S = { gy: -1.98, rx: 0.5, ry: -2.2, rz: 0.2, y: -3.4, z: 0, s: 1, free: 1, py: -6, door: 0, key: 0, play: 0.15, ins: 0, camY: 0, lookY: 0, zf: 1, led: 0 };
    if (reduce || seen) Object.assign(S, REST);

    // ---- boot: the counter rolls to 007 while the label maker punches the name.
    // It starts at once and runs while the 3D scene loads.
    const booting = !(reduce || seen);
    if (booting) document.body.classList.add("booting");
    const typed = booting
      ? new Promise<void>((res) => {
          const dy = q<HTMLElement>("#dy"),
            c2 = q<HTMLElement>("#c2");
          const car = q<HTMLElement>(".dymo .car");
          // every letter is laid out from the start and shown in turn, so nothing shifts;
          // the caret slides with a transform
          dy.innerHTML = [...name.toUpperCase()].map((ch) => (ch === " " ? "<b>&nbsp;</b>" : `<b>${ch}</b>`)).join("");
          const letters = [...dy.children] as HTMLElement[];
          letters.forEach((b) => (b.style.visibility = "hidden"));
          const start = performance.now();
          const step = (now: number) => {
            if (disposed) return res();
            const p = Math.min(1, (now - start) / 1050);
            const n = Math.round(p * letters.length);
            letters.forEach((b, i) => (b.style.visibility = i < n ? "" : "hidden"));
            const lastEl = letters[n - 1];
            const x = lastEl ? lastEl.offsetLeft + lastEl.offsetWidth : letters[0].offsetLeft;
            car.style.transform = `translateX(${x - (dy.offsetLeft + dy.offsetWidth)}px)`;
            c2.textContent = String(Math.min(7, Math.floor(p * 8)));
            if (p < 1) requestAnimationFrame(step);
            else res();
          };
          requestAnimationFrame(step);
        })
      : null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      // ---- reveal: the name comes up as soon as the counter is done; it never waits for 3D
      const boot = q<HTMLElement>(".boot");
      let revealed: Promise<unknown> = Promise.resolve();
      if (!typed) boot.style.display = "none";
      else {
        const chars = el.querySelectorAll(".title .ch");
        const bar = document.querySelector(".bar");
        gsap.set(chars, { yPercent: 110 });
        gsap.set([...el.querySelectorAll(".foot, .kana, .cat"), bar], { opacity: 0 });
        revealed = typed.then(() => {
          if (disposed) return;
          return gsap
            .timeline({
              onComplete: () => {
                document.body.classList.remove("booting");
                try {
                  sessionStorage.setItem(BOOTED, "1");
                } catch {}
              },
            })
            .to(q(".bootbox"), { y: -20, opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.1 })
            .to(boot, { autoAlpha: 0, duration: 0.2 }, "-=.1")
            .to(chars, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.028 }, "-=.15")
            .to([...el.querySelectorAll(".foot, .kana, .cat"), bar], { opacity: 1, duration: 0.4 }, "-=.55")
            .then();
        });
      }

      // heavy 3D work waits until the name is up, so it never delays or stutters the reveal
      await revealed;
      if (disposed) return;
      const m = await import("@/lib/mixtape3d");
      if (disposed) return;

      // fonts must be ready before the label is painted
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
      if (disposed) return;
      const labelCanvas = m.makeLabel({ name, role, years, kana, catalogue: "PG-001" });

      // ---- 3D
      const canvas = q<HTMLCanvasElement>("#gl");
      const st = m.createStage(canvas);
      let frame: ((t: number) => void) | null = null;
      if (!st) {
        canvas.style.display = "none";
        const img = new Image();
        img.className = "fallback";
        img.alt = "";
        img.src = labelCanvas.toDataURL();
        q(".stage").insertBefore(img, q(".cat"));
      } else {
        const { renderer, scene, cam, ground } = st;
        cleanups.push(st.dispose);
        const { tape, reels } = m.buildCassette(labelCanvas, renderer.capabilities.getMaxAnisotropy());
        scene.add(tape);
        const { player, door, playKey, ledMat } = m.buildPlayer();
        scene.add(player);
        const blob = m.contactShadow();
        scene.add(blob);
        let baseZ = 10;
        const resize = () => {
          renderer.setSize(innerWidth, innerHeight, false);
          cam.aspect = innerWidth / innerHeight;
          cam.updateProjectionMatrix();
          baseZ = cam.aspect < 1 ? (10 / Math.max(cam.aspect, 0.45)) * 0.62 : 10;
        };
        resize();
        addEventListener("resize", resize);
        cleanups.push(() => removeEventListener("resize", resize));
        const sm = { x: 0, y: 0 };
        let last = 0;
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(el);
        cleanups.push(() => io.disconnect());
        frame = (t: number) => {
          if (document.hidden || !visible) return;
          st.adapt(t);
          const dt = Math.min(0.05, (t - last) / 1000);
          last = t;
          sm.x += (ptr.nx - sm.x) * 0.06;
          sm.y += (ptr.ny - sm.y) * 0.06;
          const f = reduce ? 0 : S.free;
          tape.rotation.set(S.rx + sm.y * 0.22 * f, S.ry + sm.x * 0.45 * f, S.rz + sm.x * -0.05 * f);
          tape.position.set(0, S.y + Math.sin(t * 0.0012) * 0.05 * f, S.z);
          tape.scale.setScalar(S.s);
          const snd = getState();
          const playing = S.ins > 0.5 && (!available || snd.on);
          const spd = S.ins > 0.5 ? (playing ? 1 + getLevel() * 0.8 : 0) : S.play;
          if (!reduce) {
            reels[0].rotation.z -= dt * spd * 4;
            reels[1].rotation.z -= dt * spd * 6.5;
          }
          S.key += ((playing ? 1 : 0) - S.key) * 0.25;
          player.position.y = S.py;
          door.rotation.x = S.door;
          playKey.position.y = 1.03 - S.key * 0.06;
          ledMat.emissiveIntensity = S.led * (snd.on ? 4 + getLevel() * 8 : 3);
          ground.position.y = S.gy;
          blob.position.y = S.gy + 0.01;
          const lift = Math.max(0, S.y - S.gy);
          (blob.material as import("three").MeshBasicMaterial).opacity =
            Math.max(0, Math.min(1, 1.25 - lift * 0.35)) * (1 - Math.min(1, (S.py + 6) / 6));
          blob.scale.setScalar(1 + lift * 0.12);
          cam.position.set(0, S.camY, baseZ * S.zf);
          cam.lookAt(0, S.lookY, 0);
          renderer.render(scene, cam);
        };
        renderer.setAnimationLoop(frame);
      }

      // ---- scroll: the tape goes into the player
      const startScroll = () => {
        if (reduce) return;
        const w1 = q(".w1"),
          w2 = q(".w2");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.5 } });
        tl.to(S, { gy: -1.3, rx: 0, ry: 0, rz: 0, free: 0, y: 0.2, z: 1.4, s: 0.92, py: -0.3, door: 0.95, camY: 0.9, lookY: -0.2, play: 0, duration: 0.35, ease: "power2.inOut" }, 0)
          .to(w1, { xPercent: -60, opacity: 0.1, duration: 0.35, ease: "power2.in" }, 0)
          .to(w1, { opacity: 0, duration: 0.15, ease: "none" }, 0.36)
          .to(w2, { xPercent: 60, opacity: 0.1, duration: 0.35, ease: "power2.in" }, 0)
          .to(w2, { opacity: 0, duration: 0.15, ease: "none" }, 0.36)
          .to(el.querySelectorAll(".foot, .kana, .cat"), { opacity: 0, duration: 0.1 }, 0)
          .to(S, { y: -0.33, z: 0, s: 1, duration: 0.2, ease: "power2.inOut" }, 0.36)
          .to(S, { door: 0, duration: 0.1, ease: "power3.in" }, 0.57)
          .to(S, { led: 1, duration: 0.04 }, 0.68)
          .to(S, { ins: 1, duration: 0.02, onUpdate: () => void (S.ins > 0.5 && onTapeInserted()) }, 0.7)
          .to(S, { zf: 1.04, camY: 0.2, lookY: -0.32, duration: 0.22, ease: "power1.inOut" }, 0.72)
          .fromTo(q(".sideA"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.8);
        cleanups.push(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      };

      // ---- the tape flies in (once the counter is done), then scroll takes over
      if (typed) await gsap.to(S, { ...REST, duration: 0.95, ease: "expo.out" }).then();
      if (!disposed) startScroll();
    })();

    return () => {
      disposed = true;
      document.body.classList.remove("booting");
      cleanups.forEach((f) => f());
    };
  }, [name, role, years, kana]);

  const chars = (w: string) =>
    [...w].map((c, i) => (
      <span key={i} className="ch">
        {c}
      </span>
    ));

  return (
    <section id="hero" ref={root} aria-label="Introduction">
      <div className="stage">
        <h1 className="title" aria-label={name}>
          <span className="w w1" aria-hidden="true">
            {chars(first)}
          </span>
          <span className="w w2" aria-hidden="true">
            {chars(last)}
          </span>
        </h1>
        <canvas id="gl" aria-hidden="true" />
        <div className="cat" aria-hidden="true">
          <span>PG-001</span>
          <span>SIDE A</span>
          <span>TYPE II</span>
        </div>
        <div className="kana" aria-hidden="true">
          {kana}
        </div>
        <div className="foot">
          <p className="stmt">{statement}</p>
          <div className="cue">
            <i aria-hidden="true" />
            Scroll to press play
          </div>
        </div>
        <div className="sideA" aria-hidden="true">
          <div className="k">{kana} · NOW PLAYING · SIDE A</div>
          <h2>
            Selected work
            <br />
            {trackCount} tracks
          </h2>
        </div>
        <div className="boot" aria-hidden="true">
          <div className="bootbox">
            <div className="counter">
              <span>0</span>
              <span>0</span>
              <span id="c2">0</span>
            </div>
            <div className="dymo">
              <span id="dy" />
              <span className="car" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
