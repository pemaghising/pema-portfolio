import { THREE, RoundedBoxGeometry, createStage, darkMat, aluMat, blueMat } from "./mixtape3d";

type Options = {
  canvas: HTMLCanvasElement;
  labelCanvas: HTMLCanvasElement;
  reduce: boolean;
  onPlugged: (on: boolean) => void;
};

/**
 * Contact scene: orange-foam headphones, a cable with rope (verlet) physics and a plug the
 * visitor drags into the player's jack. Returns null when WebGL is unavailable.
 */
export function createContactScene({ canvas, labelCanvas, reduce, onPlugged }: Options) {
  const st = createStage(canvas);
  if (!st) return null;
  const { renderer, scene, cam, ground } = st;

  const dark = darkMat();
  const silver = aluMat();
  const foam = new THREE.MeshPhysicalMaterial({ color: 0xf26a21, roughness: 0.75, sheen: 1, sheenColor: 0xffb085 });
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x26262a, roughness: 0.35, clearcoat: 0.6 });
  const R = 1.05;

  // headphones
  const hp = new THREE.Group();
  hp.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.075, 14, 64, Math.PI), shell));
  const pad = new THREE.Mesh(new THREE.TorusGeometry(R, 0.11, 14, 24, Math.PI * 0.5), foam);
  pad.rotation.z = Math.PI * 0.25;
  hp.add(pad);
  for (const sx of [-1, 1]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.3, 40), shell);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(sx * (R + 0.02), -0.1, 0);
    const cush = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 20), foam);
    cush.scale.set(0.42, 1, 1);
    cush.position.set(sx * (R - 0.17), -0.1, 0);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 32), silver);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(sx * (R + 0.18), -0.1, 0);
    hp.add(cup, cush, cap);
  }
  scene.add(hp);

  // player, simplified: aluminium face, the tape in the window, keys, a jack on top
  const pl = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.0, 2.0, 0.7, 6, 0.12), blueMat());
  body.position.z = -0.08;
  const face = new THREE.Mesh(new RoundedBoxGeometry(2.96, 1.96, 0.3, 5, 0.1), silver);
  face.position.z = 0.2;
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.3), dark);
  win.position.set(0, -0.1, 0.355);
  const tex = new THREE.CanvasTexture(labelCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const lab = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 0.92),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.5, roughness: 0.55 }),
  );
  lab.position.set(0, 0, 0.36);
  pl.add(body, face, win, lab);
  const brown = new THREE.MeshStandardMaterial({ color: 0x3b2a20, roughness: 0.6 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.5 });
  for (const [x, r] of [
    [-0.25, 0.13],
    [0.25, 0.09],
  ]) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.01, 40), brown);
    d.rotation.x = Math.PI / 2;
    d.position.set(x, -0.065, 0.3585);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 20), white);
    h.rotation.x = Math.PI / 2;
    h.position.set(x, -0.065, 0.3595);
    pl.add(d, h);
  }
  const ek = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.12, 0.3, 3, 0.035),
    new THREE.MeshPhysicalMaterial({ color: 0xf2a23a, roughness: 0.45, clearcoat: 0.3 }),
  );
  ek.position.set(-0.35, 1.04, 0.1);
  pl.add(ek);
  for (const x of [0.1, 0.45, 0.8]) {
    const k = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.1, 0.3, 3, 0.03), silver);
    k.position.set(x, 1.03, 0.1);
    pl.add(k);
  }
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 28), dark);
  jack.position.set(-1.1, 1.0, 0.1);
  const jackRim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 10, 28), silver);
  jackRim.rotation.x = Math.PI / 2;
  jackRim.position.set(-1.1, 1.02, 0.1);
  // a pulsing red ring marks where the plug goes
  const ringM = new THREE.MeshBasicMaterial({ color: 0xe5322d, transparent: true, opacity: 0.9 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 10, 40), ringM);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(-1.1, 1.045, 0.1);
  const ledM = new THREE.MeshStandardMaterial({ color: 0x401505, emissive: 0xff6a21, emissiveIntensity: 0 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), ledM);
  led.position.set(1.28, 0.82, 0.37);
  pl.add(jack, jackRim, ring, led);
  scene.add(pl);
  for (const g of [hp, pl])
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });

  // cable: one end pinned at the left cup, the other free, dragged or plugged in
  const N = 28;
  let LEN = 5.5,
    SEG = LEN / (N - 1),
    gy = -1.5;
  const P: THREE.Vector3[] = [],
    Q: THREE.Vector3[] = [];
  const exit = new THREE.Vector3(),
    socket = new THREE.Vector3(),
    target = new THREE.Vector3();
  const plug = new THREE.Group();
  const part = (geo: THREE.BufferGeometry, mat: THREE.Material, y: number) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = y;
    m.castShadow = true;
    plug.add(m);
  };
  part(new THREE.CylinderGeometry(0.12, 0.1, 0.34, 24), dark, -0.17);
  part(new THREE.CylinderGeometry(0.065, 0.065, 0.5, 20), silver, -0.59);
  part(new THREE.CylinderGeometry(0.067, 0.067, 0.05, 20), dark, -0.5);
  part(new THREE.SphereGeometry(0.065, 16, 10), silver, -0.84);
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 8), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.y = -0.5;
  plug.add(hit);
  scene.add(plug);
  const cable = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.55 }));
  cable.castShadow = true;
  scene.add(cable);

  const S = { plugged: false, drag: false, over: false, arr: 1 };
  const ptr = { wx: 0, wy: 0, has: false, nx: 0, ny: 0 };
  let camZ = 10,
    camX = 0,
    camY = 0;

  function step(dt: number) {
    const pin = S.drag ? target : S.plugged ? socket : null;
    for (let i = 1; i < N; i++) {
      const p = P[i],
        q = Q[i],
        vx = (p.x - q.x) * 0.985,
        vy = (p.y - q.y) * 0.985;
      q.copy(p);
      p.x += vx;
      p.y += vy - 22 * dt * dt;
    }
    // the free end reaches a little toward the cursor
    if (!pin && ptr.has && !reduce)
      for (let i = N - 8; i < N; i++) {
        const w = ((i - (N - 9)) / 8) * 0.014;
        P[i].x += (ptr.wx - P[i].x) * w;
        P[i].y += (ptr.wy - P[i].y) * w * 0.6;
      }
    for (let it = 0; it < 14; it++) {
      P[0].copy(exit);
      if (pin) P[N - 1].set(pin.x, pin.y, 0);
      for (let i = 0; i < N - 1; i++) {
        const a = P[i],
          b = P[i + 1],
          dx = b.x - a.x,
          dy = b.y - a.y,
          d = Math.hypot(dx, dy) || 1e-5,
          diff = (d - SEG) / d;
        const wa = i === 0 ? 0 : 0.5,
          wb = i + 1 === N - 1 && pin ? 0 : 0.5,
          s = wa + wb || 1;
        a.x += (dx * diff * wa) / s;
        a.y += (dy * diff * wa) / s;
        b.x -= (dx * diff * wb) / s;
        b.y -= (dy * diff * wb) / s;
      }
      for (let i = 1; i < N; i++) if (P[i].y < gy + 0.05) P[i].y = gy + 0.05;
    }
  }

  function layout() {
    const w = canvas.clientWidth || innerWidth,
      h = canvas.clientHeight || 600,
      a = w / h;
    renderer.setSize(w, h, false);
    cam.aspect = a;
    cam.updateProjectionMatrix();
    const portrait = a < 0.95;
    LEN = portrait ? 2.3 : 5.5;
    SEG = LEN / (N - 1);
    if (portrait) {
      hp.position.set(0, 1.55, -0.7);
      pl.position.set(0, -1.45, 0);
      camZ = Math.max(11.5, 3.9 / (0.4618 * a));
      camX = 0;
      camY = 0.1;
    } else {
      hp.position.set(-2.2, -0.95, -0.7);
      pl.position.set(1.6, -0.5, 0);
      camZ = Math.max(10, 7.4 / (0.4618 * a));
      camX = -0.25;
      camY = 0;
    }
    gy = pl.position.y - 1.0;
    ground.position.y = gy;
    exit.set(hp.position.x - R - 0.1, hp.position.y - 0.5, 0);
    socket.set(pl.position.x - 1.1, pl.position.y + 1.5, 0.1);
    P.length = Q.length = 0;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      P.push(new THREE.Vector3(exit.x + t * 3.2, Math.max(gy + 0.05, exit.y - Math.sin(t * Math.PI) * 0.3 - t * 0.3), 0));
      Q.push(P[i].clone());
    }
    for (let k = 0; k < 140; k++) step(1 / 60);
  }

  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const toWorld = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const out = new THREE.Vector3();
    ray.ray.intersectPlane(plane, out);
    return out;
  };

  const setPlugged = (on: boolean) => {
    if (S.plugged === on) return;
    S.plugged = on;
    onPlugged(on);
  };

  const onMove = (e: PointerEvent) => {
    const w = toWorld(e);
    ptr.wx = w.x;
    ptr.wy = w.y;
    ptr.has = true;
    if (S.drag) return void target.set(w.x, Math.max(gy + 0.15, w.y), 0);
    const over = ray.intersectObject(hit).length > 0;
    if (over !== S.over) canvas.classList.toggle("over", (S.over = over));
  };
  const onWinMove = (e: PointerEvent) => {
    ptr.nx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ny = (e.clientY / innerHeight) * 2 - 1;
  };
  const onLeave = () => (ptr.has = false);
  const onDown = (e: PointerEvent) => {
    const w = toWorld(e);
    if (!ray.intersectObject(hit).length) return;
    canvas.setPointerCapture(e.pointerId);
    S.drag = true;
    canvas.classList.add("drag");
    setPlugged(false);
    target.set(w.x, w.y, 0);
  };
  const onUp = () => {
    if (!S.drag) return;
    S.drag = false;
    canvas.classList.remove("drag");
    if (target.distanceTo(socket) < 1.1) setPlugged(true);
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  addEventListener("pointermove", onWinMove, { passive: true });
  addEventListener("resize", layout);
  layout();

  const shape = Array.from({ length: N }, () => new THREE.Vector3(1e3, 0, 0));
  const curve = new THREE.CatmullRomCurve3(shape, false, "catmullrom", 0.3);
  const q = new THREE.Quaternion(),
    down = new THREE.Vector3(0, -1, 0),
    dir = new THREE.Vector3();
  const sm = { x: 0, y: 0 };
  let last = 0,
    running = false;
  const frame = (t: number) => {
    if (document.hidden) return;
    st.adapt(t);
    const dt = Math.min(0.033, (t - last) / 1000 || 0.016);
    last = t;
    sm.x += (ptr.nx - sm.x) * 0.05;
    sm.y += (ptr.ny - sm.y) * 0.05;
    const f = reduce ? 0 : 1;
    hp.rotation.y = 0.3 + sm.x * 0.25 * f;
    hp.rotation.x = sm.y * 0.06 * f;
    pl.rotation.y = -0.18 + sm.x * 0.08 * f;
    step(dt / 2);
    step(dt / 2);
    // the plug follows the last segment, or stands straight in the jack
    const e = P[N - 1],
      pr = P[N - 2];
    dir.set(e.x - pr.x, e.y - pr.y, 0).normalize();
    if (S.plugged && !S.drag) dir.set(0, -1, 0);
    q.setFromUnitVectors(down, dir);
    plug.quaternion.slerp(q, 1 - Math.exp(-dt * 16));
    plug.position.copy(e);
    // rebuild the cable only while it moves; at rest it costs nothing
    let moved = 0;
    for (let i = 0; i < N; i++) moved = Math.max(moved, P[i].distanceToSquared(shape[i]));
    if (moved > 1e-7 || !cable.geometry.attributes.position) {
      for (let i = 0; i < N; i++) shape[i].copy(P[i]);
      cable.geometry.dispose();
      cable.geometry = new THREE.TubeGeometry(curve, st.low ? 56 : 84, 0.042, st.low ? 6 : 8, false);
    }
    const near = S.drag ? Math.max(0, Math.min(1, (target.distanceTo(socket) - 0.5) / 1.2)) : 1;
    S.arr += ((S.plugged ? 0 : near) - S.arr) * Math.min(1, dt * 10);
    const pulse = reduce ? 1 : Math.sin(t * 0.006) * 0.5 + 0.5;
    ring.visible = S.arr > 0.02;
    ring.scale.setScalar(S.arr * (1 + pulse * 0.3));
    ringM.opacity = S.arr * (0.95 - pulse * 0.55);
    ledM.emissiveIntensity += ((S.plugged ? 4 : 0) - ledM.emissiveIntensity) * 0.15;
    cam.position.set(camX, camY, camZ);
    cam.lookAt(camX, camY, 0);
    renderer.render(scene, cam);
  };

  return {
    setPlugged,
    toggle: () => setPlugged(!S.plugged),
    run(on: boolean) {
      if (on === running) return;
      running = on;
      renderer.setAnimationLoop(on ? frame : null);
    },
    dispose() {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      removeEventListener("pointermove", onWinMove);
      removeEventListener("resize", layout);
      tex.dispose();
      st.dispose();
    },
  };
}
