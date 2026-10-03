"use client";

import { soundtrack } from "@/data/site";

/**
 * The hero music. Off until the tape is inserted; browsers only allow sound after one click,
 * tap or key press, so if the visitor has not done one yet it starts on their first.
 * Does nothing at all while `soundtrack` in data/site.ts is undefined.
 */
type State = { on: boolean; level: number };
let state: State = { on: false, level: 0 };
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
const serverState: State = { on: false, level: 0 };
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
    if (!state.on || !an || !data) return;
    an.getByteFrequencyData(data);
    let lv = 0;
    for (let i = 0; i < 4; i++) lv += data[2 + i * 5] / 255 / 4;
    state = { ...state, level: state.level + (lv - state.level) * 0.25 };
    emit();
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
    await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 600))]);
    if (ctx.state !== "running") return false;
    await el.play();
  } catch {
    return false;
  } finally {
    busy = false;
  }
  state = { on: true, level: 0 };
  ramp(0.3, 1.4);
  emit();
  meter();
  return true;
}

export function pause() {
  if (!state.on || !el) return;
  state = { on: false, level: 0 };
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
  const go = () => {
    (["pointerdown", "keydown", "touchend"] as const).forEach((t) => removeEventListener(t, go, true));
    armed = false;
    if (!userPaused) void play();
  };
  (["pointerdown", "keydown", "touchend"] as const).forEach((t) => addEventListener(t, go, true));
}
