import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** Shared 3D pieces for the Mixtape scenes. Every model is built in code: no downloaded assets. */

export type LabelInfo = { name: string; role: string; years: string; kana: string; catalogue: string };

export const LABEL = { w: 1600, h: 700, win: { x: 430, y: 270, w: 740, h: 240 } };

/** The cassette label, drawn on a canvas, with the reel window cut out. */
export function makeLabel(info: LabelInfo) {
  const { w: LW, h: LH, win: WIN } = LABEL;
  const c = document.createElement("canvas");
  c.width = LW;
  c.height = LH;
  const g = c.getContext("2d")!;
  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    g.roundRect(x, y, w, h, r);
  };
  const css = getComputedStyle(document.documentElement);
  const font = (v: string, fb: string) => css.getPropertyValue(v).trim() || fb;
  const display = font("--nf-display", "'Dela Gothic One'");
  const pixel = font("--nf-pixel", "'DotGothic16'");
  const text = font("--nf-text", "'Zen Kaku Gothic New'");

  g.fillStyle = "#F2ECDF";
  rr(0, 0, LW, LH, 30);
  g.fill();
  (
    [
      ["#F26A21", 40],
      ["#E9AE0B", 74],
      ["#14A39E", 108],
    ] as const
  ).forEach(([col, y]) => {
    g.fillStyle = col;
    g.fillRect(0, y, LW, 26);
  });
  g.fillStyle = "#1B1B1E";
  g.textBaseline = "alphabetic";
  g.font = `400 92px ${display}`;
  g.fillText(info.name.toUpperCase(), 60, 234);
  g.textAlign = "right";
  g.font = `700 50px ${text}`;
  g.fillText("TYPE II · 90", LW - 60, 226);
  g.textAlign = "left";
  g.fillStyle = "#1B1B1E";
  rr(WIN.x - 16, WIN.y - 16, WIN.w + 32, WIN.h + 32, 40);
  g.fill();
  g.beginPath();
  g.arc(240, 390, 96, 0, 7);
  g.lineWidth = 10;
  g.strokeStyle = "#1B1B1E";
  g.stroke();
  g.font = `400 120px ${display}`;
  g.textAlign = "center";
  g.fillText("A", 240, 434);
  g.font = `700 40px ${text}`;
  g.fillText("SIDE", 240, 536);
  g.font = `400 150px ${pixel}`;
  g.fillText(`${info.years.replace("+", "").padStart(2, "0")}+`, 1360, 420);
  g.font = `700 40px ${text}`;
  g.fillText("YEARS", 1360, 482);
  g.textAlign = "left";
  g.fillRect(60, 566, LW - 120, 7);
  g.font = `700 46px ${text}`;
  g.fillText(info.role.toUpperCase(), 60, 646);
  g.textAlign = "right";
  g.font = `700 50px ${text}`;
  g.fillText(`${info.kana} · ${info.catalogue}`, LW - 60, 648);
  g.globalCompositeOperation = "destination-out";
  rr(WIN.x, WIN.y, WIN.w, WIN.h, 30);
  g.fill();
  g.globalCompositeOperation = "source-over";
  return c;
}

export function roundRectShape(w: number, h: number, r: number, cx = 0, cy = 0) {
  const s = new THREE.Shape(),
    x = cx - w / 2,
    y = cy - h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export const darkMat = () => new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.9 });
export const aluMat = () => new THREE.MeshPhysicalMaterial({ color: 0xc9cdd3, roughness: 0.32, metalness: 0.85 });
export const blueMat = () => new THREE.MeshPhysicalMaterial({ color: 0x2d3e78, roughness: 0.45, metalness: 0.35, clearcoat: 0.3 });

/** A rough guess at a modest GPU: few cores, little memory, or a phone with a very dense screen. */
export function isLowEnd() {
  const n = navigator as Navigator & { deviceMemory?: number };
  const cores = n.hardwareConcurrency || 8;
  const mem = n.deviceMemory || 8;
  const phone = matchMedia("(pointer: coarse)").matches;
  return cores <= 4 || mem <= 4 || (phone && devicePixelRatio > 2);
}

/** Renderer, studio lighting, a shadow-catching floor. Returns null when WebGL is unavailable. */
export function createStage(canvas: HTMLCanvasElement) {
  const low = isLowEnd();
  let renderer: THREE.WebGLRenderer;
  try {
    // dense screens don't need MSAA, and modest GPUs can't afford it
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !low && devicePixelRatio < 2, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  let ratio = Math.min(devicePixelRatio, low ? 1.5 : 2);
  renderer.setPixelRatio(ratio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-4, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff1e6, 1.1);
  rim.position.set(6, 2, -4);
  scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.14 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const dispose = () => {
    renderer.setAnimationLoop(null);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    pmrem.dispose();
    renderer.dispose();
  };
  // Frame governor: if frames run slow, lower the resolution step by step so motion stays smooth.
  // It only ever steps down, so it never flickers between sizes.
  let last = 0,
    warm = 0,
    sum = 0,
    count = 0;
  const adapt = (t: number) => {
    const d = t - last;
    last = t;
    if (warm < 20) return void warm++; // skip shader compiles and the first frames
    if (d <= 0 || d > 1000) return; // a tab switch, not the steady state
    sum += Math.min(d, 120); // one long hitch should not decide alone
    if (++count < 30) return;
    const avg = sum / count;
    sum = count = 0;
    if (avg > 21 && ratio > 0.75) {
      ratio = Math.max(0.75, ratio - 0.25);
      renderer.setPixelRatio(ratio);
    }
  };
  return { renderer, scene, cam, ground, dispose, adapt, low };
}

/** The smoked cassette with spinning reels. Origin at its centre, 2.56 × 1.6 units. */
export function buildCassette(labelCanvas: HTMLCanvasElement, maxAniso: number) {
  const { w: LW, h: LH, win: WIN } = LABEL;
  const tape = new THREE.Group();
  const dark = darkMat();
  const shellMat = new THREE.MeshPhysicalMaterial({ color: 0x26262a, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25 });
  const back = new THREE.Mesh(new RoundedBoxGeometry(2.56, 1.6, 0.22, 5, 0.06), shellMat);
  back.position.z = -0.03;
  tape.add(back);
  const k = 2.3 / LW,
    lcy = 0.17;
  const toX = (px: number) => (px - LW / 2) * k;
  const toY = (py: number) => lcy + (LH / 2 - py) * (1 / LH);
  const winW = WIN.w * k,
    winH = WIN.h / LH,
    winCy = toY(WIN.y + WIN.h / 2);
  const front = roundRectShape(2.56, 1.6, 0.08);
  front.holes.push(roundRectShape(winW - 0.02, winH - 0.02, 0.04, 0, winCy));
  const plate = new THREE.Mesh(
    new THREE.ExtrudeGeometry(front, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 10 }),
    shellMat,
  );
  plate.position.z = 0.08;
  tape.add(plate);
  const tex = new THREE.CanvasTexture(labelCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.0), new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.5, roughness: 0.55 }));
  label.position.set(0, lcy, 0.152);
  tape.add(label);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH),
    new THREE.MeshPhysicalMaterial({ color: 0x777777, transparent: true, opacity: 0.16, roughness: 0.05, clearcoat: 1 }),
  );
  glass.position.set(0, winCy, 0.145);
  tape.add(glass);
  const brown = new THREE.MeshStandardMaterial({ color: 0x3b2a20, roughness: 0.6, metalness: 0.1 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.5 });
  const reels: THREE.Group[] = [];
  (
    [
      [toX(WIN.x + WIN.w * 0.26), 0.3],
      [toX(WIN.x + WIN.w * 0.74), 0.17],
    ] as const
  ).forEach(([x, packR]) => {
    const r = new THREE.Group();
    r.position.set(x, winCy, 0.085);
    const pack = new THREE.Mesh(new THREE.CylinderGeometry(packR, packR, 0.015, 48), brown);
    pack.rotation.x = Math.PI / 2;
    r.add(pack);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 32), white);
    hub.rotation.x = Math.PI / 2;
    hub.position.z = 0.01;
    r.add(hub);
    for (let i = 0; i < 6; i++) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.04, 0.035), dark);
      const a = (i / 6) * Math.PI * 2;
      t.position.set(Math.cos(a) * 0.045, Math.sin(a) * 0.045, 0.014);
      t.rotation.z = a;
      r.add(t);
    }
    tape.add(r);
    reels.push(r);
  });
  const trap = new THREE.Shape();
  trap.moveTo(-0.95, -0.8);
  trap.lineTo(0.95, -0.8);
  trap.lineTo(0.74, -0.43);
  trap.lineTo(-0.74, -0.43);
  trap.closePath();
  const tz = new THREE.Mesh(new THREE.ExtrudeGeometry(trap, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 }), shellMat);
  tz.position.z = 0.14;
  tape.add(tz);
  [-0.6, -0.3, 0, 0.3, 0.6].forEach((x, i) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(i === 2 ? 0.2 : 0.1, 0.07, 0.06), dark);
    h.position.set(x, -0.77, 0.17);
    tape.add(h);
  });
  const screwMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9f, metalness: 0.9, roughness: 0.3 });
  (
    [
      [-1.2, 0.72],
      [1.2, 0.72],
      [-1.2, -0.72],
      [1.2, -0.72],
      [0, -0.55],
    ] as const
  ).forEach(([x, y]) => {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 20), screwMat);
    s.rotation.x = Math.PI / 2;
    s.position.set(x, y, y === -0.55 ? 0.2 : 0.152);
    tape.add(s);
  });
  return { tape, reels };
}

/** Landscape portable player: blue body, aluminium face, smoked door hinged at the bottom, keys on top. */
export function buildPlayer() {
  const player = new THREE.Group();
  const blue = blueMat(),
    alu = aluMat(),
    dark = darkMat();
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 2.0, 0.4, 6, 0.12), blue);
  body.position.z = -0.36;
  player.add(body);
  const face = roundRectShape(2.92, 1.92, 0.1);
  face.holes.push(roundRectShape(2.66, 1.7, 0.06, 0, -0.03));
  const faceM = new THREE.Mesh(
    new THREE.ExtrudeGeometry(face, { depth: 0.42, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 10 }),
    alu,
  );
  faceM.position.z = -0.2;
  player.add(faceM);
  const cavity = new THREE.Mesh(new THREE.PlaneGeometry(2.66, 1.7), dark);
  cavity.position.set(0, -0.03, -0.155);
  player.add(cavity);
  const door = new THREE.Group();
  door.position.set(0, -0.88, 0.24);
  const frame = roundRectShape(2.66, 1.7, 0.06, 0, 0.85);
  frame.holes.push(roundRectShape(2.36, 1.32, 0.05, 0, 0.87));
  door.add(new THREE.Mesh(new THREE.ExtrudeGeometry(frame, { depth: 0.03, bevelEnabled: false }), alu));
  const pane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.36, 1.32),
    new THREE.MeshPhysicalMaterial({ color: 0x3a3f4a, transparent: true, opacity: 0.32, roughness: 0.05, clearcoat: 1 }),
  );
  pane.position.set(0, 0.87, 0.015);
  door.add(pane);
  player.add(door);
  let playKey: THREE.Mesh | null = null;
  [-1.05, -0.6, -0.15, 0.3].forEach((x, i) => {
    const kk = new THREE.Mesh(
      new RoundedBoxGeometry(0.4, 0.14, 0.34, 3, 0.04),
      i === 0 ? new THREE.MeshPhysicalMaterial({ color: 0xf26a21, roughness: 0.4, clearcoat: 0.4 }) : alu,
    );
    kk.position.set(x, 1.03, -0.1);
    player.add(kk);
    if (i === 0) playKey = kk;
  });
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 24), alu);
  jack.position.set(1.1, 1.02, -0.1);
  player.add(jack);
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x401505, emissive: 0xff6a21, emissiveIntensity: 0 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), ledMat);
  led.position.set(1.25, 0.9, 0.24);
  player.add(led);
  player.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return { player, door, playKey: playKey!, ledMat };
}

/** A soft round shadow that sits under a floating object. */
export function contactShadow(w = 3.4, d = 1.2) {
  const sc = document.createElement("canvas");
  sc.width = sc.height = 256;
  const sg = sc.getContext("2d")!;
  const gr = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(0,0,0,.42)");
  gr.addColorStop(0.55, "rgba(0,0,0,.12)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  sg.fillStyle = gr;
  sg.fillRect(0, 0, 256, 256);
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  return blob;
}

export { THREE, RoundedBoxGeometry };
