"use client";

import { soundtrack } from "@/data/site";

/**
 * The hero music. Off until the tape is inserted; browsers only allow sound after one click,
 * tap or key press, so if the visitor has not done one yet it starts on their first.
 * Does nothing at all while `soundtrack` in data/site.ts is undefined.
 */
type State = { on: boolean; blocked: boolean };
let state: State = { on: false, blocked: false };
/** Loudness 0..1, read every frame by the 3D (kept out of React state so nothing re-renders per frame). */
let level = 0;
export const getLevel = () => level;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

let el: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let an: AnalyserNode | null = null;
let data: Uint8Array<ArrayBuffer> | null = null;
let busy = false;
let userPaused = false;
let armed = false;
let raf = 0;

export const available = Boolean(soundtrack);

export function subscribe(f: () => void) {
  subs.add(f);
  return () => subs.delete(f);
}
export const getState = () => state;
const serverState: State = { on: false, blocked: false };
export const getServerState = () => serverState;

function init() {
  if (ctx || !soundtrack) return;
  el = new Audio(soundtrack.src);
  el.loop = true;
  el.preload = "none";
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  const src = ctx.createMediaElementSource(el);
  gain = ctx.createGain();
  gain.gain.value = 0;
  an = ctx.createAnalyser();
  an.fftSize = 64;
  data = new Uint8Array(new ArrayBuffer(an.frequencyBinCount));
  src.connect(an);
  an.connect(gain);
  gain.connect(ctx.destination);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
}

function ramp(to: number, secs: number) {
  if (!ctx || !gain) return;
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.linearRampToValueAtTime(to, t + secs);
}

function meter() {
  cancelAnimationFrame(raf);
  const tick = () => {
    if (!state.on || !an || !data) return void (level = 0);
    an.getByteFrequencyData(data);
    let lv = 0;
    for (let i = 0; i < 4; i++) lv += data[2 + i * 5] / 255 / 4;
    level += (lv - level) * 0.25;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

export async function play() {
  if (!available) return false;
  init();
  if (state.on || busy || !ctx || !el) return state.on;
  busy = true;
  try {
    // both start inside the same call as the click/tap; Safari refuses media started after an await
    const resumed = ctx.resume();
    const started = el.play();
    await Promise.race([resumed, new Promise((r) => setTimeout(r, 600))]);
    await started;
    if (ctx.state !== "running") {
      el.pause();
      return false;
    }
  } catch {
    return false;
  } finally {
    busy = false;
  }
  state = { on: true, blocked: false };
  ramp(0.3, 1.4);
  emit();
  meter();
  return true;
}

export function pause() {
  if (!state.on || !el) return;
  state = { on: false, blocked: false };
  ramp(0, 0.35);
  setTimeout(() => {
    if (!state.on) el?.pause();
  }, 380);
  emit();
}

export function toggle() {
  if (state.on) {
    userPaused = true;
    pause();
  } else {
    userPaused = false;
    void play();
  }
}

/** Called by the hero when the tape locks into the player. */
export async function onTapeInserted() {
  if (!available || state.on || userPaused || armed) return;
  const active = navigator.userActivation ? navigator.userActivation.hasBeenActive : true;
  if (active && (await play())) return;
  if (armed || state.on) return;
  armed = true;
  state = { ...state, blocked: true };
  emit();
  const go = () => {
    (["pointerdown", "keydown", "touchend"] as const).forEach((t) => removeEventListener(t, go, true));
    armed = false;
    if (!userPaused) void play();
  };
  (["pointerdown", "keydown", "touchend"] as const).forEach((t) => addEventListener(t, go, true));
}

/**
 * Unlock audio on the visitor's first click, tap or key press anywhere (silently, at zero volume),
 * so the song can start by itself the moment the tape goes in.
 */
if (typeof window !== "undefined" && available) {
  const prime = () => {
    (["pointerdown", "keydown", "touchend"] as const).forEach((t) => removeEventListener(t, prime, true));
    init();
    if (!ctx || !el || state.on || busy) return;
    void ctx.resume().catch(() => {});
    el.play()
      .then(() => {
        if (!state.on && !busy) el?.pause();
      })
      .catch(() => {});
  };
  (["pointerdown", "keydown", "touchend"] as const).forEach((t) => addEventListener(t, prime, { capture: true, passive: true }));
}
