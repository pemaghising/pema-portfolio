import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// keep in sync with the stacked-layout media query in style.css
const MOBILE_MQ = matchMedia('(max-width: 820px), (max-aspect-ratio: 10/11) and (max-width: 1200px)');
const isMobile = () => MOBILE_MQ.matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const vh = () => innerHeight;

document.body.classList.add('is-loading');

/* ───────── smooth scroll ───────── */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(t, { duration: 2.4 }) : t.scrollIntoView();
}));

/* ───────── gallery (built from the real screen files) ───────── */
const SCREENS = ['01-welcome', '02-register', '03-login', '04-your-space', '05-name-home', '06-suggested-chores', '07-busy-days',
  '08-invite', '09-home', '10-chores', '11-add-chore', '12-celebration', '13-pantry-shared', '14-restock-bridge',
  '15-roommates-shelves', '16-add-shared', '17-add-personal', '18-restock-to-chores', '19-request-sent', '20-fab-menu',
  '21-add-item-unified', '22-profile', '23-invite-modal', '24-edit-busy-days', '25-nudge-style', '26-roommates', '27-lockscreen'];
{
  const tilt = $('.gallery__tilt');
  const cols = Array.from({ length: 6 }, () => tilt.appendChild(Object.assign(document.createElement('div'), { className: 'gcol' })));
  SCREENS.forEach((s, i) => {
    const img = new Image();
    Object.assign(img, { src: `/roomie/assets/screens/${s}.png`, alt: '', loading: 'lazy', decoding: 'async', width: 393, height: s < '09' ? 812 : 852 });
    cols[i % 6].appendChild(img);
  });
  // second pass so every column is tall enough to fill the tilted wall
  SCREENS.slice().reverse().forEach((s, i) => cols[i % 6].appendChild(Object.assign(cols[i % 6].children[0].cloneNode(), { src: `/roomie/assets/screens/${s}.png` })));
}

/* ───────── text utilities ───────── */
function splitWords(el, cls = 'w') {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => cls === 'w' ? `<span class="w"><span>${w}</span></span>` : `<span class="${cls}">${w}</span>`).join(' ');
  return $$(cls === 'w' ? '.w > span' : '.' + cls, el);
}
$$('[data-split]').forEach(el => splitWords(el));
$$('[data-scrub-words]').forEach(el => splitWords(el, 'sw'));

/* ───────── WebGL ───────── */
let G = null;
try { G = initGL(); } catch (err) {
  console.warn('WebGL unavailable, using static fallback', err);
  document.documentElement.classList.add('no-gl');
}

function initGL() {
  const canvas = $('#gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.7, 9);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight('#fff0e0', 1.8); key.position.set(3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight('#a98bff', 3); rim.position.set(-5, 2.5, -4); scene.add(rim);
  const warm = new THREE.DirectionalLight('#ffb98a', 0.8); warm.position.set(5, -1, 2); scene.add(warm);

  const manager = new THREE.LoadingManager();
  const texLoader = new THREE.TextureLoader(manager);

  /* house */
  const house = new THREE.Group();
  const floatG = new THREE.Group();
  house.add(floatG);
  scene.add(house);
  const H = { roofPivot: null, sproutPivot: null, inner: null };

  const shadowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(12,6,30,.85)'); grd.addColorStop(1, 'rgba(12,6,30,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.06;
  house.add(shadow);

  // light pouring out of the opened roof
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 0.78, 4.6, 64, 1, true),
    // BackSide: only the far inner wall draws, so the beam sits behind the house face and the rising phone, never over them
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.BackSide,
      uniforms: { uO: { value: 0 }, uC: { value: new THREE.Color('#fff1d6') } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
      fragmentShader: 'varying vec2 vUv; uniform float uO; uniform vec3 uC; void main(){ float a = pow(1. - vUv.y, 1.8) * smoothstep(0., .1, vUv.y) * uO; gl_FragColor = vec4(uC, a); }',
    }));
  beam.position.y = 0.55 + 2.3; // starts at the top of the walls (the roof opening), not inside the body
  floatG.add(beam);
  const glow = new THREE.PointLight('#ffd2a0', 0, 7, 1.5);
  glow.position.y = 0.6;
  floatG.add(glow);

  const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/draco/gltf/');
  const housePromise = new GLTFLoader(manager).setDRACOLoader(draco).loadAsync('/roomie/assets/roomie.glb').then(gltf => {
    const inner = gltf.scene;
    inner.position.y = -1.05;
    floatG.add(inner);
    house.updateMatrixWorld(true);
    const roof = inner.getObjectByName('Roof');
    const sprout = inner.getObjectByName('Sprout');
    if (roof) {
      const c = new THREE.Box3().setFromObject(roof).getCenter(new THREE.Vector3());
      H.roofPivot = new THREE.Group();
      inner.add(H.roofPivot);
      H.roofPivot.position.copy(inner.worldToLocal(c));
      house.updateMatrixWorld(true);
      H.roofPivot.attach(roof);
      if (sprout) {
        const b = new THREE.Box3().setFromObject(sprout);
        H.sproutPivot = new THREE.Group();
        H.roofPivot.add(H.sproutPivot);
        house.updateMatrixWorld(true);
        H.sproutPivot.position.copy(H.roofPivot.worldToLocal(new THREE.Vector3((b.min.x + b.max.x) / 2, b.min.y, (b.min.z + b.max.z) / 2)));
        house.updateMatrixWorld(true);
        H.sproutPivot.attach(sprout);
      }
    }
    // living house: pivots so the eyes can look and blink, and the smile can widen, in place
    const pivotize = names => {
      const objs = names.map(n => inner.getObjectByName(n)).filter(Boolean);
      if (!objs.length) return null;
      const box = new THREE.Box3(); objs.forEach(o => box.expandByObject(o));
      house.updateMatrixWorld(true);
      const g = new THREE.Group(); inner.add(g);
      g.position.copy(inner.worldToLocal(box.getCenter(new THREE.Vector3())));
      house.updateMatrixWorld(true);
      objs.forEach(o => g.attach(o));
      g.userData.base = g.position.clone();
      return g;
    };
    H.eyes = [pivotize(['Eye_L']), pivotize(['Eye_R'])].filter(Boolean);
    H.smile = pivotize(['Smile', 'SmileCap', 'SmileCap_7']);
    H.meshes = []; inner.traverse(o => { if (o.isMesh) H.meshes.push(o); });
    H.sproutMeshes = []; if (sprout) sprout.traverse(o => { if (o.isMesh) H.sproutMeshes.push(o); });
    inner.traverse(o => { if (o.isMesh) o.layers.enable(2); }); // the house can hide the rising phone's screen
    H.inner = inner;
  });

  /* phone */
  const phone = new THREE.Group();
  scene.add(phone);
  // A modern handset: extruded rounded-rect frame (true corner radius), black glass, inset screen, island, buttons.
  const SW = 0.92, SH = SW * 852 / 393, BEZ = 0.042, R = 0.16, D = 0.1, BEV = 0.022;
  const roundRect = (w, h, r) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    // absarc draws its own connecting line (an explicit lineTo duplicates a point and spikes the bevel)
    s.moveTo(x + r + 0.001, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    return s;
  };
  const OW = SW + BEZ * 2, OH = SH + BEZ * 2;
  const frameGeo = new THREE.ExtrudeGeometry(roundRect(OW - BEV * 2, OH - BEV * 2, R - BEV), {
    depth: D - BEV * 2, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 8, curveSegments: 32,
  });
  frameGeo.translate(0, 0, -(D - BEV * 2) / 2);
  const frameMat = new THREE.MeshPhysicalMaterial({ color: '#4a4358', metalness: 1, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  phone.add(new THREE.Mesh(frameGeo, frameMat));
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#07060a', roughness: 0.08, metalness: 0, clearcoat: 1 });
  const glass = new THREE.Mesh(new THREE.ShapeGeometry(roundRect(OW - 0.012, OH - 0.012, R - 0.006), 32), glassMat);
  glass.position.z = D / 2 + 0.001;
  phone.add(glass);
  const back = glass.clone(); back.material = new THREE.MeshPhysicalMaterial({ color: '#2a2433', roughness: 0.35, metalness: 0.2, clearcoat: 1 });
  back.position.z = -D / 2 - 0.001; back.rotation.y = Math.PI;
  phone.add(back);
  // the back is on show during the 360° spin between screens: camera module + Roomie mark
  {
    const BZ = -D / 2 - 0.002;
    const cam = new THREE.Group();
    cam.add(new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.4, 0.03, 4, 0.012), new THREE.MeshPhysicalMaterial({ color: '#3b3448', roughness: 0.15, metalness: 0.3, clearcoat: 1 })));
    const lensGlass = new THREE.MeshPhysicalMaterial({ color: '#0a0910', roughness: 0.05, metalness: 0.4, clearcoat: 1 });
    [[0.085, 0.085], [0.085, -0.085], [-0.085, 0]].forEach(([x, y]) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 32), frameMat); ring.rotation.x = Math.PI / 2; ring.position.set(x, y, -0.02);
      const glassL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.032, 32), lensGlass); glassL.rotation.x = Math.PI / 2; glassL.position.set(x, y, -0.022);
      cam.add(ring, glassL);
    });
    cam.position.set(OW / 2 - 0.27, OH / 2 - 0.27, BZ - 0.014); // top-left when seen from behind
    phone.add(cam);
    const logoTex = texLoader.load('/roomie/assets/roomie-icon.svg'); logoTex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }));
    logo.rotation.y = Math.PI; logo.position.set(0, 0.05, BZ - 0.001);
    phone.add(logo);
  }
  [[-1, 0.62, 0.16], [-1, 0.4, 0.16], [-1, 0.78, 0.07], [1, 0.5, 0.26]].forEach(([side, y, h]) => {
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.02, h, 0.045, 2, 0.008), frameMat);
    b.position.set(side * (OW / 2 + 0.006), y * SH / 2, 0);
    phone.add(b);
  });

  const screenU = {
    tA: { value: null }, tB: { value: null }, uMix: { value: 0 }, rA: { value: 1 }, rB: { value: 1 },
    uR: { value: R - BEZ }, uSize: { value: new THREE.Vector2(SW, SH) },
  };
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.ShaderMaterial({
    transparent: true, uniforms: screenU,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `
      uniform sampler2D tA, tB; uniform float uMix, rA, rB, uR; uniform vec2 uSize; varying vec2 vUv;
      float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
      // k = image aspect / screen aspect. Shorter exports (393x812) are width-fit and top-aligned; their two baked
      // bottom corners are replaced by the screens' own white. The frame line baked into every export is trimmed.
      vec3 samp(sampler2D t, float k, vec2 st){
        vec2 uv = vec2(st.x, 1. - (1. - st.y) / max(k, .0001));
        float corner = (1. - step(.055, uv.y)) * max(1. - step(.11, uv.x), step(.89, uv.x));
        float keep = 1. - corner + step(.999, k);
        uv = (uv - .5) * vec2(1. - 10. / 393., 1. - 10. / 852.) + .5;
        vec4 c = texture2D(t, clamp(uv, 0., 1.));
        return mix(vec3(1.), c.rgb, c.a * clamp(keep, 0., 1.));
      }
      void main(){
        vec2 p = (vUv - .5) * uSize;
        float m = 1. - smoothstep(-0.002, 0.0, sdRound(p, uSize * .5, uR));
        // iOS-style push: the next screen slides in from the right over the current one, which eases left and dims
        float s = uMix, edge = 1. - s;
        vec3 col;
        if (vUv.x >= edge && s > 0.) col = samp(tB, rB, vec2(vUv.x - edge, vUv.y));
        else {
          col = samp(tA, rA, vec2(vUv.x + s * .3, vUv.y)) * (1. - s * .25);
          col *= 1. - .22 * smoothstep(.08, 0., edge - vUv.x) * step(.001, s); // soft shadow cast by the incoming screen
        }
        gl_FragColor = vec4(col, m);
        #include <colorspace_fragment>
      }`,
  }));
  screen.position.z = D / 2 + 0.003;
  phone.add(screen);
  const island = new THREE.Mesh(new THREE.ShapeGeometry(roundRect(0.25, 0.072, 0.036), 16), new THREE.MeshBasicMaterial({ color: '#000000' }));
  island.position.set(0, SH / 2 - 0.068, D / 2 + 0.005);
  phone.add(island);
  // soft glass reflection sweeping across the screen
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uSize: screenU.uSize, uR: screenU.uR },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `uniform vec2 uSize; uniform float uR; varying vec2 vUv;
      float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
      void main(){ float m = 1. - smoothstep(-0.002, 0.0, sdRound((vUv - .5) * uSize, uSize * .5, uR));
        float band = smoothstep(.0, .35, vUv.x + vUv.y * .6 - .55) * (1. - smoothstep(.35, .7, vUv.x + vUv.y * .6 - .55));
        gl_FragColor = vec4(vec3(1.), band * .07 * m); }`,
  }));
  sheen.position.z = D / 2 + 0.006;
  phone.add(sheen);
  // layers for the post pipeline: 1 = drawn after post (exact UI colours), 2 = depth occluders for that pass
  [screen, island, sheen].forEach(o => o.layers.set(1));
  phone.traverse(o => { if (o.isMesh && o.layers.mask === 1) o.layers.enable(2); });
  camera.layers.enable(1);

  const steps = $$('.dstep');
  const screenTex = steps.map(s => {
    const t = texLoader.load(s.dataset.screen, tx => { tx.userData.r = (tx.image.height / tx.image.width) / (852 / 393); });
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.userData.r = 1;
    return t;
  });
  screenU.tA.value = screenU.tB.value = screenTex[0];

  /* balance: fair isn't equal */
  const bal = new THREE.Group();
  scene.add(bal);
  const darkMat = new THREE.MeshPhysicalMaterial({ color: '#3a2d5c', roughness: 0.32, metalness: 0.25, clearcoat: 1 });
  const creamMat = new THREE.MeshPhysicalMaterial({ color: '#efe7da', roughness: 0.42, clearcoat: 0.6 });
  const L = 3.4, PIVOT = 0.85, ROD = 0.95;
  const baseM = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.16, 0.75, 4, 0.06), darkMat); baseM.position.y = -1.55; bal.add(baseM);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, PIVOT + 1.5, 24), darkMat); post.position.y = (PIVOT - 1.5) / 2; bal.add(post);
  const beamG = new THREE.Group(); beamG.position.y = PIVOT; bal.add(beamG);
  beamG.add(new THREE.Mesh(new RoundedBoxGeometry(L, 0.1, 0.14, 4, 0.045), darkMat));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16), creamMat); cap.position.y = PIVOT; bal.add(cap);
  const tokenGeo = new RoundedBoxGeometry(1, 1, 1, 5, 0.17);
  const mintMat = new THREE.MeshPhysicalMaterial({ color: '#6ee7b7', roughness: 0.3, clearcoat: 1 });
  const peachMat = new THREE.MeshPhysicalMaterial({ color: '#fdba74', roughness: 0.3, clearcoat: 1 });
  const pans = [-1, 1].map(side => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, ROD, 8), darkMat);
    const pan = new THREE.Group();
    pan.add(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.56, 0.08, 48), creamMat));
    bal.add(rod, pan);
    return { side, rod, pan };
  });
  // chore tokens live on the balance (not the pans) so they can hop and be dragged between sides
  const tokPool = Array.from({ length: 10 }, () => {
    const m = new THREE.Mesh(tokenGeo, mintMat);
    m.visible = false; m.userData.hop = null;
    bal.add(m);
    return m;
  });
  const spring = { a: 0, v: 0 };
  // little leaves that burst out of the sprout when it's clicked
  const leafGeo = new THREE.SphereGeometry(0.07, 14, 10);
  const leafMat = new THREE.MeshPhysicalMaterial({ color: '#7bd66b', roughness: 0.35, clearcoat: 1 });
  const leaves = Array.from({ length: 10 }, () => {
    const m = new THREE.Mesh(leafGeo, leafMat); m.visible = false; m.scale.set(1, 0.55, 1);
    m.userData = { v: new THREE.Vector3(), life: 0 }; scene.add(m); return m;
  });

  /* a room at dusk: window light on the wall, a lamp's warm pool, and dust drifting only where the light is.
     All three follow the object in focus and fade out when the lights come on. */
  const room = new THREE.Group();
  scene.add(room);
  const quadVS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }';
  const glowMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uO: { value: 0 }, uC: { value: new THREE.Color('#ff9f5a') } },
    vertexShader: quadVS,
    fragmentShader: 'varying vec2 vUv; uniform float uO; uniform vec3 uC; void main(){ float r = length(vUv - .5) * 2.; float a = pow(max(0., 1. - r), 2.4) * uO; gl_FragColor = vec4(uC * a, a); }',
  });
  const lampGlow = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), glowMat);
  lampGlow.position.set(0.3, 0.2, -2);
  // four-pane window, sheared like light falling on a wall, edges softened
  const winMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uO: { value: 0 }, uC: { value: new THREE.Color('#ffc48a') } },
    vertexShader: quadVS,
    fragmentShader: `varying vec2 vUv; uniform float uO; uniform vec3 uC;
      float box(vec2 p, vec2 a, vec2 b, float s){ vec2 i = smoothstep(a - s, a + s, p) * (1. - smoothstep(b - s, b + s, p)); return i.x * i.y; }
      void main(){
        vec2 p = vec2(vUv.x + (vUv.y - .5) * .38, vUv.y);
        float s = .025, m = .028;
        float pane = box(p, vec2(.12, .06), vec2(.5 - m, .5 - m), s) + box(p, vec2(.5 + m, .06), vec2(.88, .5 - m), s)
                   + box(p, vec2(.12, .5 + m), vec2(.5 - m, .94), s) + box(p, vec2(.5 + m, .5 + m), vec2(.88, .94), s);
        float a = pane * (.55 + .45 * (1. - vUv.y)) * uO;
        gl_FragColor = vec4(uC * a, a);
      }`,
  });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 5.8), winMat);
  win.position.set(-2.4, 1.3, -4.5); // up and behind, so the object stands in its light instead of hiding it
  // dust motes: a few dozen, warm, only lit inside the slanted light pool
  const N = isMobile() ? 55 : 95;
  const dPos = new Float32Array(N * 3), dSeed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    dPos[i * 3] = (Math.random() - 0.5) * 6; dPos[i * 3 + 1] = (Math.random() - 0.5) * 5.2; dPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    dSeed[i] = Math.random();
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  dGeo.setAttribute('seed', new THREE.BufferAttribute(dSeed, 1));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uO: { value: 0 }, uSpread: { value: 1 }, uC: { value: new THREE.Color('#ffd8a8') } },
    vertexShader: `attribute float seed; uniform float uTime, uPR, uO, uSpread; varying float vA;
      void main(){
        vec3 p = position;
        float t = uTime * .12 + seed * 6.2831;
        p.x += sin(t * 1.3 + seed * 10.) * .35;
        p.y = mod(p.y + uTime * .05 * (.4 + seed) + 2.6, 5.2) - 2.6;
        p.z += cos(t) * .3;
        vec2 d = vec2(p.x + p.y * .38 - .3, p.y);           // slanted pool, same lean as the window light
        float pool = smoothstep(3.2, .4, length(d * vec2(1., .72)));
        vA = pool * (.55 + .45 * sin(uTime * 1.6 + seed * 40.)) * uO;
        vec4 mv = modelViewMatrix * vec4(p * uSpread, 1.);
        gl_PointSize = (7. + seed * 12.) * uPR * (7. / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: 'uniform vec3 uC; varying float vA; void main(){ float a = pow(smoothstep(.5, 0., length(gl_PointCoord - .5)), 1.6) * vA; gl_FragColor = vec4(uC * a, a); }',
  });
  room.add(win, lampGlow, new THREE.Points(dGeo, dustMat));

  /* chapter props: one clay object per design-thinking phase, so the house stays the hero rather than a repeat */
  const clay = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.25, ...extra });
  const C = { lav: '#b9a2ff', lavDeep: '#8b6cf0', mint: '#6ee7b7', peach: '#fdba74', butter: '#fde68a', cream: '#f3ece0', navy: '#2b2140', white: '#ffffff' };
  const pillow = (shape, depth, bev) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 8, curveSegments: 32 });
    g.translate(0, 0, -depth / 2);
    return g;
  };
  // extrude groups: 0 = front/back faces, 1 = sides + bevel. A deeper side tone gives the silhouette definition on dark backgrounds.
  const twoTone = (face, side) => [clay(face), clay(side, { roughness: 0.5 })];
  const capsule = (w, h, color) => {
    const m = new THREE.Mesh(pillow(roundRect(w, h, h / 2 - 0.001), 0.02, 0.015), clay(color));
    return m;
  };

  // 01 Empathize — the group chat everyone already uses
  const chat = new THREE.Group();
  {
    // bubble + tail as ONE outline, so the bevel runs unbroken (separate tail shapes left notches).
    // the tail must sit on the flat bottom edge, between the corner arcs, or the outline self-intersects.
    const bubble = (w, h, r, tx, right) => {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r + 0.02, y); // start just past the corner so the closing arc doesn't duplicate the first point (bevel spike)
      const [p, q] = right ? [tx - 0.42, tx] : [tx, tx + 0.42];
      s.lineTo(p, y); s.lineTo(right ? tx - 0.04 : tx + 0.04, y - 0.36); s.lineTo(q, y);
      // absarc draws its own connecting line; an explicit lineTo to the arc start duplicates a point (bevel spike)
      s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
      s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
      s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
      s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
      return s;
    };
    const a = new THREE.Group();
    a.add(new THREE.Mesh(pillow(bubble(1.7, 1.1, 0.42, -0.36, false), 0.2, 0.1), twoTone('#b8a0ff', '#6a48dc')));
    a.userData.dots = [-0.38, 0, 0.38].map(x => {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16), clay(C.white)); d.position.set(x, 0, 0.22); a.add(d); return d;
    });
    a.position.set(-0.3, 0.42, 0);
    const b = new THREE.Group();
    b.add(new THREE.Mesh(pillow(bubble(1.3, 0.82, 0.34, 0.28, true), 0.2, 0.1), twoTone('#6fe3b2', '#14966a')));
    [[0.12, 0.66], [-0.14, 0.42]].forEach(([y, w]) => { const l = capsule(w, 0.11, C.white); l.position.set(-0.16 + (w - 0.66) / 2, y, 0.21); b.add(l); });
    b.position.set(0.45, -0.58, 0.45);
    chat.add(a, b);
    chat.userData.tick = t => a.userData.dots.forEach((d, i) => { d.position.z = 0.22; d.position.y = Math.max(0, Math.sin(t * 5 - i * 0.9)) * 0.1; });
  }

  // 02 Define — looking closely at what's actually broken
  const lens = new THREE.Group();
  {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.15, 40, 120), clay(C.lav));
    // an opaque, softly lit lens reads on both the night and daylight backgrounds; under it, the insight: ≠
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.67, 64), clay('#f4f0ff', { emissive: '#e6deff', emissiveIntensity: 0.45, roughness: 0.2, clearcoat: 1 }));
    const neq = new THREE.Group();
    const navyM = clay(C.navy);
    [0.12, -0.12].forEach(y => { const bar = capsule(0.62, 0.1, C.navy); bar.position.y = y; neq.add(bar); });
    const slash = capsule(0.72, 0.1, C.peach); slash.rotation.z = Math.PI / 2.6; slash.position.z = 0.03; neq.add(slash);
    neq.position.z = 0.03;
    const shine = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 16, 48, Math.PI * 0.4), clay(C.white));
    shine.rotation.z = Math.PI * 0.58; shine.position.z = 0.09;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.24, 32), navyM);
    const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.8, 12, 32), clay(C.peach));
    collar.position.set(0, -0.88, 0); handle.position.set(0, -1.42, 0);
    const stem = new THREE.Group(); stem.add(collar, handle); stem.rotation.z = Math.PI / 5;
    lens.add(ring, glass, neq, shine, stem);
    lens.position.set(-0.3, 0.55, 0); // centres ring + handle around the prop origin
    lens.userData.tick = t => { neq.scale.setScalar(1 + Math.sin(t * 2) * 0.05); };
  }

  // 03 Ideate — the bulb
  const bulb = new THREE.Group();
  {
    const prof = new THREE.SplineCurve([[0, 1.32], [0.38, 1.26], [0.66, 1.0], [0.72, 0.68], [0.6, 0.38], [0.42, 0.14], [0.36, 0]].map(([x, y]) => new THREE.Vector2(x, y))).getPoints(48);
    const glassM = clay(C.butter, { emissive: '#fbbf24', emissiveIntensity: 0.28, roughness: 0.18, clearcoat: 1 });
    const glassMesh = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), glassM);
    const base = new THREE.Group();
    base.add(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.33, 0.38, 48), clay(C.lavDeep)));
    [0.1, -0.02, -0.14].forEach(y => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.035, 12, 48), clay(C.lav)); r.rotation.x = Math.PI / 2; r.position.y = y; base.add(r); });
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 12), clay(C.navy)); tip.position.y = -0.24; base.add(tip);
    base.position.y = -0.19;
    const bulbLight = new THREE.PointLight('#ffd27a', 3, 4, 1.6); bulbLight.position.y = 0.7;
    const core = new THREE.Group(); core.add(glassMesh, base, bulbLight); core.position.y = -0.55;
    const sparks = [[-0.95, 0.85, C.peach], [0.95, 0.65, C.mint], [0.7, 1.25, C.lav]].map(([x, y, c]) => {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), clay(c)); s.scale.set(1, 1.7, 0.6); s.position.set(x, y - 0.4, 0.1); return s;
    });
    bulb.add(core, ...sparks);
    bulb.scale.setScalar(1.2);
    bulb.userData.tick = t => {
      glassM.emissiveIntensity = 0.24 + Math.sin(t * 2.2) * 0.08;
      sparks.forEach((s, i) => { s.rotation.y = t * 1.6 + i; const k = 0.85 + Math.sin(t * 3 + i * 2) * 0.2; s.scale.set(k, 1.7 * k, 0.6 * k); });
    };
  }

  // 04 Prototype — screens stacking up, wireframe to hi-fi
  const cards = new THREE.Group();
  {
    const card = (face, side) => new THREE.Mesh(pillow(roundRect(1.0, 1.9, 0.16), 0.05, 0.03), twoTone(face, side));
    const lo = card(C.cream, '#b9ab95'), mid = card('#b8a0ff', '#6a48dc'), hi = card(C.white, '#c9bfe0');
    const ui = new THREE.Group();
    const head = capsule(0.5, 0.12, C.navy); head.position.set(-0.18, 0.66, 0); ui.add(head);
    [[-0.27, C.mint, 0.3], [0.07, C.butter, 0.34], [0.35, C.peach, 0.2]].forEach(([x, c, w]) => { const ch = capsule(w, 0.13, c); ch.position.set(x, 0.38, 0); ui.add(ch); });
    [0.1, -0.15, -0.4].forEach(y => { const r = capsule(0.8, 0.16, '#efeaf6'); r.position.set(0, y, 0); ui.add(r); });
    const cta = capsule(0.8, 0.17, C.navy); cta.position.set(0, -0.72, 0); ui.add(cta);
    ui.position.z = 0.06; hi.add(ui);
    const stack = new THREE.Group(); stack.add(lo, mid, hi);
    stack.rotation.set(-0.95, 0, 0.55);
    cards.add(stack);
    cards.scale.setScalar(1.18);
    cards.userData.tick = t => { const g = 0.26 + Math.sin(t * 1.3) * 0.05; lo.position.z = -g; mid.position.z = 0; hi.position.z = g; };
  }

  // 05 Test — did it work?
  const badge = new THREE.Group();
  {
    const circ = new THREE.Shape(); circ.absarc(0, 0, 0.78, 0, Math.PI * 2, false);
    const disc = new THREE.Mesh(pillow(circ, 0.18, 0.12), twoTone('#6fe3b2', '#14966a'));
    const path = new THREE.CurvePath();
    const p0 = new THREE.Vector3(-0.36, 0.02, 0), p1 = new THREE.Vector3(-0.1, -0.24, 0), p2 = new THREE.Vector3(0.38, 0.28, 0);
    path.add(new THREE.LineCurve3(p0, p1)); path.add(new THREE.LineCurve3(p1, p2));
    const navyM = clay(C.navy);
    const tick = new THREE.Group();
    tick.add(new THREE.Mesh(new THREE.TubeGeometry(path, 64, 0.09, 20, false), navyM));
    [p0, p1, p2].forEach(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 10), navyM); s.position.copy(p); tick.add(s); });
    tick.position.z = 0.24;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.03, 12, 96), clay(C.lav));
    badge.add(disc, tick, ring);
    badge.userData.tick = t => { ring.rotation.x = Math.sin(t * 0.8) * 0.5; ring.rotation.y = t * 0.6; };
  }

  const props = new THREE.Group(), propFloat = new THREE.Group();
  props.add(propFloat);
  const propList = [chat, lens, bulb, cards, badge];
  propList.forEach(p => { p.visible = false; propFloat.add(p); });
  const propShadow = shadow.clone(); propShadow.material = shadow.material.clone(); propShadow.position.y = -1.25;
  props.add(propShadow);
  const propLight = new THREE.PointLight('#fff3e6', 3.5, 9, 1.3); propLight.position.set(1.4, 1.8, 3.2); props.add(propLight); // soft key so props read on the night sky
  scene.add(props);

  /* film-camera finish: the scene renders off-screen (HDR, MSAA), gets a soft bloom, a hint of lens fringing and fine
     grain, then is tone-mapped onto the canvas. The phone's screen (layer 1) is drawn afterwards straight to the canvas,
     depth-tested against the house and the phone body (layer 2), so UI colours stay exact and never bloom. */
  const fx = (() => {
    if (!renderer.capabilities.isWebGL2) return null;
    const rt = (samples = 0) => new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples });
    const rtScene = rt(isMobile() ? 2 : 4), h1 = rt(), h2 = rt(), q1 = rt(), q2 = rt();
    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    const quadScene = new THREE.Scene(); quadScene.add(quad);
    const vs = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
    const bright = new THREE.ShaderMaterial({
      uniforms: { t: { value: rtScene.texture }, th: { value: 1.45 } }, vertexShader: vs, // only true highlights (bulb, beam, lamp) bloom
      fragmentShader: `uniform sampler2D t; uniform float th; varying vec2 vUv;
        void main(){ vec3 c = texture2D(t, vUv).rgb; float br = max(c.r, max(c.g, c.b)), k = .35;
          float soft = clamp(br - th + k, 0., 2. * k); soft = soft * soft / (4. * k + 1e-4);
          gl_FragColor = vec4(c * max(soft, br - th) / max(br, 1e-4), 1.); }`,
    });
    const blur = new THREE.ShaderMaterial({
      uniforms: { t: { value: null }, dir: { value: new THREE.Vector2() } }, vertexShader: vs,
      fragmentShader: `uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;
        void main(){ vec3 s = texture2D(t, vUv).rgb * .227027;
          s += (texture2D(t, vUv + dir * 1.3846).rgb + texture2D(t, vUv - dir * 1.3846).rgb) * .316216;
          s += (texture2D(t, vUv + dir * 3.2308).rgb + texture2D(t, vUv - dir * 3.2308).rgb) * .070270;
          gl_FragColor = vec4(s, 1.); }`,
    });
    const comp = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: rtScene.texture }, tB1: { value: h2.texture }, tB2: { value: q2.texture },
        uBloom: { value: 0.6 }, uCA: { value: 0.003 }, uGrain: { value: 0.022 }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: vs,
      fragmentShader: `uniform sampler2D tScene, tB1, tB2; uniform float uBloom, uCA, uGrain, uTime; uniform vec2 uRes; varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main(){
          vec2 d = vUv - .5; vec2 off = d * uCA * dot(d, d) * 4.;      // fringing grows toward the edges only
          vec4 base = texture2D(tScene, vUv);
          vec3 col = vec3(texture2D(tScene, vUv - off).r, base.g, texture2D(tScene, vUv + off).b);
          vec3 bloom = (texture2D(tB1, vUv).rgb * .6 + texture2D(tB2, vUv).rgb) * uBloom;
          col += bloom;
          float a = max(base.a, clamp(max(bloom.r, max(bloom.g, bloom.b)) * 1.2, 0., 1.)); // glow can spill past silhouettes
          gl_FragColor = vec4(col, a);
          #include <tonemapping_fragment>
          gl_FragColor.rgb += (hash(vUv * uRes + uTime) - .5) * uGrain * base.a; // grain on the 3D only, not the page
          #include <colorspace_fragment>
        }`,
    });
    const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
    const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(quadScene, quadCam); };
    const blurInto = (src, mid, dst) => {
      blur.uniforms.t.value = src.texture; blur.uniforms.dir.value.set(1 / src.width, 0); pass(blur, mid);
      blur.uniforms.t.value = mid.texture; blur.uniforms.dir.value.set(0, 1 / mid.height); pass(blur, dst);
    };
    return {
      comp,
      setSize(w, h) {
        rtScene.setSize(w, h);
        [h1, h2].forEach(r => r.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1)));
        [q1, q2].forEach(r => r.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2)));
        comp.uniforms.uRes.value.set(w, h);
      },
      render(scene, camera, drawScreen) {
        renderer.setClearColor(0x000000, 0);
        camera.layers.set(0);
        renderer.setRenderTarget(rtScene); renderer.clear(); renderer.render(scene, camera);
        pass(bright, h1); blurInto(h1, q1, h2);           // half-res bright pass, blurred
        blurInto(h2, q1, q2);                              // wider, quarter-res glow
        pass(comp, null);
        if (drawScreen) {
          renderer.autoClear = false;
          renderer.clearDepth();
          camera.layers.set(2); scene.overrideMaterial = depthOnly; renderer.render(scene, camera); scene.overrideMaterial = null;
          camera.layers.set(1); renderer.render(scene, camera);
          renderer.autoClear = true;
        }
        camera.layers.set(0); camera.layers.enable(1);
      },
    };
  })();

  /* sizing */
  const view = { halfH: 1, halfW: 1, k: 1 };
  function resize() {
    const w = innerWidth, h = innerHeight;
    // cap the drawing buffer (~4.2 MP) so 4K / high-DPI screens don't render 4x the pixels
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.75 : 2, Math.sqrt(4.2e6 / (w * h))));
    renderer.setSize(w, h, false);
    if (fx) { const s = renderer.getDrawingBufferSize(new THREE.Vector2()); fx.setSize(s.x, s.y); }
    if (dustMat) dustMat.uniforms.uPR.value = renderer.getPixelRatio();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view.halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    view.halfW = view.halfH * camera.aspect;
    view.k = isMobile() ? clamp(camera.aspect / 0.46, 0.85, 1.15) : clamp(camera.aspect / 1.6, 0.72, 1.12);
  }
  resize();
  addEventListener('resize', resize);

  const loaded = Promise.all([housePromise, new Promise(r => { manager.onLoad = r; })]);
  return { renderer, scene, camera, house, floatG, H, shadow, beam, glow, phone, screenU, screenTex, bal, beamG, pans, spring, tokPool, mintMat, peachMat, leaves, props, propFloat, propList, propShadow,
    room, glowMat, winMat, dustMat, view, rim, manager, loaded, PIVOT, L, ROD, fx };
}

/* ───────── pinned sequences (created first, in page order) ───────── */
const fair = { p: 0 };
const fairST = ScrollTrigger.create({
  trigger: '#fair', start: 'top top', end: () => '+=' + vh() * 4.4, pin: true, scrub: true, // the last ~30% holds for play
  onUpdate: s => { fair.p = s.progress; },
});

const track = $('.wires__track');
const panDist = () => Math.max(0, track.scrollWidth - innerWidth);
ScrollTrigger.create({
  trigger: '#wires', start: 'top top', end: () => '+=' + Math.max(vh() * 0.8, panDist()), pin: true, scrub: true, invalidateOnRefresh: true,
  animation: gsap.fromTo(track, { x: 0 }, { x: () => -panDist(), ease: 'none' }),
});

const revealTL = gsap.timeline({ paused: true })
  .to('.reveal__a', { opacity: 0, y: -50, duration: 0.2, ease: 'power2.in' }, 0.12)
  .fromTo('.reveal__b', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out' }, 0.56)
  .to('.reveal__b', { opacity: 0, y: -40, duration: 0.1 }, 0.88)
  .set({}, {}, 1);
// One pin carries the reveal, a short handoff, and the key screens, so the phone never detaches from its copy.
const REV = 2.6, HAND = 0.6, DEC = 0.75 * $$('.dstep').length, TOT = REV + HAND + DEC;
const R_END = REV / TOT, H_END = (REV + HAND) / TOT;
const dec = { p: 0 }, decCopy = $('.decisions__copy');
const revealST = ScrollTrigger.create({
  trigger: '#reveal', start: 'top top', end: () => '+=' + vh() * TOT, pin: true, scrub: true,
  onUpdate: s => {
    revealTL.progress(clamp(s.progress / R_END, 0, 1));
    const h = smooth(clamp((s.progress - R_END - 0.15 * (H_END - R_END)) / (0.85 * (H_END - R_END)), 0, 1));
    decCopy.style.opacity = h;
    decCopy.style.transform = `translateY(${(1 - h) * 40}px)`;
    decCopy.style.pointerEvents = h > 0.5 ? 'auto' : 'none';
    dec.p = clamp((s.progress - H_END) / (1 - H_END), 0, 1);
  },
});

/* ───────── 3D choreography: scroll anchors → poses ─────────
   x is a fraction of the half-width, y of the half-height, scale is multiplied by a viewport factor.
   Anchors are sorted by scroll position and merged cumulatively, so each one only states what changes. */
const BASE = { hx: 0, hy: 0, hs: 0, hry: 0, roof: 0, sprout: 1, px: 0, py: -0.1, ps: 0, pry: 0, bx: 0.42, by: 0, bs: 0, ax: 0.5, ay: -1.3, as: 0, ary: 0 };
const KEYS = Object.keys(BASE);
const anchors = [];
const key = (y, d, m = {}) => anchors.push({ y, d, m });
const at = (trigger, start) => { const st = ScrollTrigger.create({ trigger, start }); return () => st.start; };
const inPin = (st, f) => () => st.start + (st.end - st.start) * f;
const after = (st, k) => () => st.end + vh() * k;

key(() => 0, { hx: 0.46, hy: -0.12, hs: 0.92, hry: -0.5, bx: 0.42, by: 0 }, { hx: 0, hy: 0.36, hs: 0.5, bx: 0, by: 0.4 });
key(at('#brief', 'top bottom'), {});
key(at('#brief', 'top 25%'), { hx: 0.64, hy: 0.12, hs: 0.5, hry: 0.6 }, { hx: 0, hy: 1.3, hs: 0.3 });
key(at('#context', 'top 60%'), { hx: 0.82, hy: 1.4, hs: 0, hry: 1.2 }, { hy: 1.5, hs: 0 });

// each chapter card brings in its own prop (chat, lens, bulb, cards, badge); the house is saved for hero, reveal and outro
const chapterTurn = { 'ch-empathize': -0.35, 'ch-define': 0.3, 'ch-ideate': -0.2, 'ch-prototype': 0.35, 'ch-test': -0.3 };
const chapterEnter = [];
$$('.chapter').forEach(ch => {
  const r = chapterTurn[ch.id];
  chapterEnter.push(at(ch, 'top bottom'));
  key(at(ch, 'top bottom'), { ax: 0.4, ay: -1.3, as: 0, ary: r - 0.9 }, { ax: 0, ay: -1.3, as: 0 });
  key(at(ch, 'top 10%'), { ax: 0.4, ay: -0.02, as: 0.95, ary: r }, { ax: 0, ay: 0.42, as: 0.46 });
  key(at(ch, 'bottom 90%'), {});
  key(at(ch, 'bottom 15%'), { ay: 1.35, as: 0, ary: r + 0.7 }, { ay: 1.35, as: 0 });
});

key(inPin(fairST, 0), { bs: 0.92, bx: 0.38, by: -0.04 }, { bs: 0.42, bx: 0, by: 0.4 });
key(inPin(fairST, 1), {});
key(after(fairST, 0.7), { bs: 0, by: 0.9 }, { bs: 0, by: 1.2 });

const rp = f => inPin(revealST, f * R_END);
key(() => revealST.start - vh(), { hx: 0, hy: -1.4, hs: 0, hry: -0.9, roof: 0 }, { hx: 0, hy: -1.4, hs: 0 });
key(rp(0), { hy: -0.08, hs: 1.05, hry: 0 }, { hy: 0, hs: 0.58 });
key(rp(0.08), {});
key(rp(0.32), { roof: 1, hry: 0.16 });
key(rp(0.44), { ps: 0.12, py: -0.12, px: 0, pry: 0 });
key(rp(0.74), { ps: 1.15, py: -0.16, pry: 0.22, hy: -1.4, hs: 0.8, roof: 1.6 }, { ps: 0.95, py: -0.1 });
key(rp(0.9), { hs: 0, hy: -1.7 });
key(rp(1), { roof: 0 });
key(inPin(revealST, H_END), { px: 0.42, ps: 1.45, pry: -0.18, py: -0.02 }, { px: 0, py: 0.38, ps: 0.8, pry: 0 });
key(inPin(revealST, 1), {});
// after the pin the stage scrolls away; the phone rides up with it (1 viewport = 2 half-heights)
key(after(revealST, 1), { py: 1.98 }, { py: 2.38 });
key(after(revealST, 1.3), { ps: 0 });

key(at('#outro', 'top bottom'), { hx: 0.4, hy: -1.4, hs: 0, hry: -1.2, roof: 0, sprout: 0.6 }, { hx: 0, hy: -1.4, hs: 0 });
key(at('#outro', 'top 15%'), { hx: 0.5, hy: -0.16, hs: 0.8, hry: -0.4, sprout: 1.5 }, { hx: 0, hy: 0.34, hs: 0.45 });

let track3d = [];
function buildTrack() {
  const list = anchors.map((a, i) => ({ ...a, yy: a.y(), i })).sort((a, b) => a.yy - b.yy || a.i - b.i);
  let D = { ...BASE }, M = { ...BASE };
  track3d = list.map(a => { D = { ...D, ...a.d }; M = { ...M, ...a.d, ...a.m }; return { y: a.yy, D, M }; });
}
function sample(y, mobile, out) {
  const T = track3d, P = mobile ? 'M' : 'D';
  if (!T.length) return Object.assign(out, BASE);
  if (y <= T[0].y) return Object.assign(out, T[0][P]);
  for (let i = 0; i < T.length - 1; i++) {
    if (y < T[i + 1].y) {
      const t = smooth(clamp((y - T[i].y) / Math.max(1, T[i + 1].y - T[i].y), 0, 1));
      for (const k of KEYS) out[k] = lerp(T[i][P][k], T[i + 1][P][k], t);
      return out;
    }
  }
  return Object.assign(out, T[T.length - 1][P]);
}

/* themes and chapter tracking also read from cached scroll positions */
// the page fades to the app's daylight while the roof comes off, and back to night entering Test — tied to scroll, not a timer
const themeMarks = [rp(0.34), rp(0.54), at('#ch-test', 'top bottom'), at('#ch-test', 'top 35%')];
const chapterMarks = $$('[data-chapter]').map(ch => ({ y: at(ch, 'top 55%'), n: ch.dataset.chapter }));
let themeYs = [], chapterYs = [], propYs = [];
ScrollTrigger.addEventListener('refresh', () => {
  buildTrack();
  themeYs = themeMarks.map(f => f());
  propYs = chapterEnter.map(f => f());
  chapterYs = chapterMarks.map(m => ({ y: m.y(), n: m.n }));
});

/* ───────── DOM motion ───────── */
if (!reduce) {
  $$('[data-split]').forEach(el => gsap.from($$('.w > span', el), {
    yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 86%' },
  }));
  $$('[data-reveal]').forEach(el => gsap.from(el.dataset.reveal === 'stagger' ? el.children : el, {
    y: 56, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 88%' },
  }));
  $$('.chapter').forEach(ch => gsap.fromTo($('.chapter__num', ch), { yPercent: 18 }, {
    yPercent: -18, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  }));
  gsap.to('.hero__inner', { yPercent: -18, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.from('.ideas__cloud li', { y: 60, scale: 0.7, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.05, scrollTrigger: { trigger: '#ideas', start: 'top 85%' } });
}
$$('[data-scrub-words]').forEach(el => gsap.fromTo($$('.sw', el), { opacity: 0.14 }, {
  opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 50%', scrub: 0.8 },
}));
gsap.fromTo('.loop__steps li', { opacity: 0.14 }, {
  opacity: 1, stagger: 0.25, ease: 'none', scrollTrigger: { trigger: '.loop__steps', start: 'top 72%', end: 'bottom 55%', scrub: 0.8 },
});
$$('[data-count]').forEach(el => {
  const o = { v: 0 }, n = +el.dataset.count;
  gsap.to(o, { v: n, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: () => { el.textContent = Math.round(o.v); } });
});
ScrollTrigger.create({ trigger: '#ideas', start: 'top 35%', onEnter: () => $('#ideas').classList.add('is-judged'), onLeaveBack: () => $('#ideas').classList.remove('is-judged') });
gsap.set('.strike', { rotation: -8, scaleX: 0 });
gsap.to('.strike', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.tradeoff__num', start: 'top 70%', end: 'top 35%', scrub: 0.8 } });
$$('.gcol').forEach((c, i) => gsap.fromTo(c, { yPercent: i % 2 ? -22 : 4 }, {
  yPercent: i % 2 ? 4 : -22, ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: 1 },
}));

/* step text for the two pinned scenes */
const fairSteps = $$('.fair__step');
const dSteps = $$('.dstep'), dDots = $$('.decisions__dots i'), dCount = $('.decisions__count b'), dStatic = $('.decisions__static img');
let fairOn = -1, decOn = -1;
function setOn(list, idx) { list.forEach((el, i) => el.classList.toggle('is-on', i === idx)); }

/* ───────── per-frame ───────── */
const cur = { ...BASE }, tgt = { ...BASE };
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });
let intro = 0, sun = 0, eff = 0, drop = 0, theme = 'dark', chapter = null, light = -1, tagsShown = true, lastProg = -1;
const spin = { angle: 0, goal: 0, from: 0, to: 0, shown: 0 };
// living house state, and the playable balance (minutes are the two durations from the research; nothing else is invented)
const life = { lx: 0, ly: 0, hov: 0, sq: 0, pop: 1, blinkAt: -1, nextBlink: 2 };
const MINUTES = { trash: 2, bath: 45 };
const DEFAULT_TOKENS = [{ type: 'trash', side: -1 }, { type: 'trash', side: -1 }, { type: 'trash', side: -1 }, { type: 'bath', side: 1 }];
const game = { tokens: DEFAULT_TOKENS.map(t => ({ ...t })), mode: 'effort' };
let drag = null, hoverHouse = false;
const v3b = new THREE.Vector3();
// theme tokens (mirror style.css), blended per frame by scroll position
const THEME_D = { bg: [14, 10, 22, 1], ink: [243, 238, 251, 1], muted: [157, 148, 179, 1], line: [243, 238, 251, 0.12], card: [255, 255, 255, 0.035], acc: [185, 162, 255, 1] };
const THEME_L = { bg: [243, 238, 251, 1], ink: [22, 15, 40, 1], muted: [106, 97, 128, 1], line: [22, 15, 40, 0.12], card: [255, 255, 255, 0.62], acc: [92, 59, 155, 1] };
const mixRGBA = (a, b, t) => `rgba(${a.slice(0, 3).map((v, i) => Math.round(lerp(v, b[i], t))).join(',')},${lerp(a[3], b[3], t).toFixed(3)})`;
const navLinks = $$('[data-nav]'), progressBar = $('.nav__progress i');
const tags = $$('.fair__tag'), v3 = new THREE.Vector3();

function frame(time, deltaMs) {
  const dt = Math.min(deltaMs / 1000, 0.12);
  const y = scrollY;

  // nav + theme
  const maxY = document.documentElement.scrollHeight - innerHeight;
  const prog = Math.round(clamp(y / maxY, 0, 1) * 1000) / 1000;
  if (prog !== lastProg) { lastProg = prog; progressBar.style.transform = `scaleX(${prog})`; }
  if (themeYs.length) {
    const [a, b, c, d] = themeYs;
    const L = smooth(clamp((y - a) / (b - a), 0, 1)) * (1 - smooth(clamp((y - c) / (d - c), 0, 1)));
    if (Math.abs(L - light) > 0.002 || (L !== light && (L === 0 || L === 1))) {
      light = L;
      const bs = document.body.style;
      for (const k in THEME_D) bs.setProperty('--' + k, mixRGBA(THEME_D[k], THEME_L[k], L));
      bs.setProperty('--L', L);
      const t = L > 0.5 ? 'light' : 'dark';
      if (t !== theme) { theme = t; document.body.dataset.theme = t; $('meta[name="theme-color"]').content = t === 'light' ? '#f3eefb' : '#0e0a16'; }
    }
  }
  let c = null; for (const m of chapterYs) if (y >= m.y) c = m.n;
  if (c !== chapter) { chapter = c; navLinks.forEach(a => a.classList.toggle('is-on', a.dataset.nav === c)); }

  // fair steps
  const fp = fair.p;
  const fi = fp < 0.12 ? 0 : fp < 0.29 ? 1 : fp < 0.54 ? 2 : fp < 0.7 ? 3 : 4; // 4 = "Your turn" (interactive)
  if (fi !== fairOn) { fairOn = fi; setOn(fairSteps, fi); }
  // decision steps
  // scroll picks the step; the change plays as a timed, eased 360° turn (scrubbing a full spin off a wheel notch stutters).
  // Retargeting mid-turn continues from the current angle. The screen swaps while the back faces the camera.
  const n = dSteps.length, stepTarget = Math.min(n - 1, Math.floor(dec.p * n));
  if (stepTarget !== spin.to) {
    spin.from = spin.shown; spin.to = stepTarget;
    if (reduce) spin.angle = spin.goal;
    else {
      spin.goal += Math.sign(stepTarget - spin.from || 1) * Math.PI * 2;
      gsap.to(spin, { angle: spin.goal, duration: 1.15, ease: 'power3.inOut', overwrite: true });
    }
  }
  const away = Math.abs(spin.goal - spin.angle);
  spin.shown = away < Math.PI ? spin.to : spin.from;
  const shown = spin.shown, turn = Math.sin(Math.PI * clamp(away / (Math.PI * 2), 0, 1));
  if (shown !== decOn) {
    const dir = shown > decOn ? 1 : -1;
    decOn = shown; setOn(dSteps, shown); setOn(dDots, shown);
    dCount.textContent = String(shown + 1).padStart(2, '0');
    dStatic.src = dSteps[shown].dataset.screen;
    // incoming copy: title, insight, body stagger in from the scroll direction (reduced motion: a short fade only)
    gsap.fromTo(dSteps[shown].children, { y: reduce ? 0 : 26 * dir, opacity: 0 },
      { y: 0, opacity: 1, duration: reduce ? 0.25 : 0.8, ease: 'expo.out', stagger: reduce ? 0 : 0.08, overwrite: true });
    gsap.fromTo(dCount, { yPercent: reduce ? 0 : 60 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out', overwrite: true });
  }
  // segment fill: done = full, current = progress through the step, upcoming = empty
  {
    const f = dec.p * n;
    dDots.forEach((d, i) => { const v = clamp(f - i, 0, 1).toFixed(3); if (d.dataset.f !== v) { d.dataset.f = v; d.style.setProperty('--f', v); } });
  }

  if (!G) return;
  const { renderer, scene, camera, house, floatG, H, shadow, beam, glow, phone, screenU, screenTex, bal, beamG, pans, spring, tokPool, mintMat, peachMat, leaves, room, glowMat, winMat, dustMat, view, rim, fx } = G;
  const mobile = isMobile();
  const damp = 1 - Math.exp(-dt * (reduce ? 30 : 4.2));
  sample(y, mobile, tgt);
  for (const k of KEYS) cur[k] += (tgt[k] - cur[k]) * damp;
  mouse.sx += (mouse.x - mouse.sx) * damp; mouse.sy += (mouse.y - mouse.sy) * damp;
  sun = light;
  const idle = reduce ? 0 : 1, tt = time;

  // house
  // desktop: never grow past scale 1 on wide-short screens, where the house would crowd the headline and cue
  const hs = cur.hs * (mobile ? view.k : Math.min(view.k, 1)) * (0.2 + 0.8 * intro);
  house.visible = hs > 0.01;
  house.position.set(cur.hx * view.halfW, cur.hy * view.halfH, 0);
  house.scale.setScalar(Math.max(hs, 0.0001));
  house.rotation.y = cur.hry + (1 - intro) * -2.4;
  floatG.position.y = Math.sin(tt * 1.2) * 0.05 * idle;
  floatG.rotation.y = Math.sin(tt * 0.45) * 0.1 * idle + mouse.sx * 0.35;
  floatG.rotation.x = mouse.sy * 0.08;
  shadow.material.opacity = 0.5 - sun * 0.25;
  const roof = cur.roof;
  if (H.roofPivot) {
    H.roofPivot.userData.base ??= H.roofPivot.position.clone();
    const b = H.roofPivot.userData.base;
    H.roofPivot.position.set(b.x + roof * 0.6, b.y + roof * 4.6 + Math.max(0, roof - 1) * 9, b.z - roof * 0.3);
    H.roofPivot.visible = roof < 1.08; // gone once it has left the frame, so it never sits behind the headline
    H.roofPivot.rotation.set(-roof * 0.12, roof * 0.3, -roof * 0.3);
  }
  if (H.sproutPivot) H.sproutPivot.scale.setScalar(cur.sprout * life.pop * (1 + Math.sin(tt * 2) * 0.02 * idle));
  // living house: eyes follow the cursor, it blinks, smiles wider on hover, squashes when poked
  if (house.visible && H.eyes) {
    house.getWorldPosition(v3); v3.project(camera);
    life.lx += (clamp(mouse.x - v3.x, -1, 1) - life.lx) * damp * 1.8;
    life.ly += (clamp(-mouse.y - v3.y, -1, 1) - life.ly) * damp * 1.8;
    if (idle && tt > life.nextBlink) { life.blinkAt = tt; life.nextBlink = tt + (Math.random() < 0.2 ? 0.3 : 2.4 + Math.random() * 3); }
    const b = clamp((tt - life.blinkAt) / 0.16, 0, 1), lid = b < 1 ? Math.sin(b * Math.PI) : 0;
    life.hov += ((hoverHouse ? 1 : 0) - life.hov) * damp * 2;
    for (const e of H.eyes) {
      const base = e.userData.base;
      e.position.set(base.x + life.lx * 0.07, base.y + life.ly * 0.05 + life.hov * 0.02, base.z);
      e.scale.set(1, Math.max(0.08, 1 - 0.9 * lid - 0.12 * life.hov), 1);
    }
    if (H.smile) H.smile.scale.set(1 + 0.28 * life.hov, 1 + 0.2 * life.hov, 1);
    floatG.scale.set(1 + 0.12 * life.sq, 1 - 0.18 * life.sq, 1 + 0.12 * life.sq);
  }
  for (const l of leaves) {
    if (!l.visible) continue;
    const u = l.userData; u.life -= dt;
    if (u.life <= 0) { l.visible = false; continue; }
    u.v.y -= 5 * dt; l.position.addScaledVector(u.v, dt); l.rotation.y += dt * 4;
    l.scale.setScalar(Math.min(1, u.life * 2) * hs);
  }
  beam.material.uniforms.uO.value = clamp(roof, 0, 1) * clamp(2 - roof, 0, 1) * 0.95;
  glow.intensity = clamp(roof, 0, 1) * 9;

  // chapter prop: whichever chapter card was entered last; swaps only while scaled to nothing
  const { props, propFloat, propList, propShadow } = G;
  const as = cur.as * (mobile ? view.k : Math.min(view.k, 1));
  props.visible = as > 0.01;
  if (props.visible) {
    let pi = 0; for (let i = 0; i < propYs.length; i++) if (y >= propYs[i]) pi = i;
    propList.forEach((p, i) => { p.visible = i === pi; });
    // keep the whole prop (≈1.3 units half-width at scale 1) inside the frame on wide screens
    props.position.set(Math.min(cur.ax * view.halfW, Math.max(0, view.halfW - 1.4 * as - 0.4)), cur.ay * view.halfH, 0);
    props.scale.setScalar(as);
    props.rotation.y = cur.ary;
    propFloat.position.y = Math.sin(tt * 1.1) * 0.06 * idle;
    propFloat.rotation.y = Math.sin(tt * 0.5) * 0.15 * idle + mouse.sx * 0.4;
    propFloat.rotation.x = mouse.sy * 0.1;
    propShadow.material.opacity = 0.45;
    if (idle) propList[pi].userData.tick?.(tt);
  }

  // phone
  // desktop: size by viewport height (fixed half-height), and keep the whole phone inside the frame on wide-short screens
  const ps = cur.ps * (mobile ? view.k : clamp(view.halfW / view.halfH / 1.2, 0.75, 1));
  phone.visible = ps > 0.01;
  // on very wide screens, cap the phone's offset so it doesn't drift away from the copy
  phone.position.set(Math.min(cur.px * view.halfW, 2.4, Math.max(0, view.halfW - 0.6 * ps - 0.35)), cur.py * view.halfH + Math.sin(tt * 0.9) * 0.03 * idle, 0.4);
  // mid-turn the phone pulls back slightly (going out, coming in)
  phone.scale.setScalar(Math.max(ps * (1 - 0.12 * turn), 0.0001));
  phone.rotation.set(mouse.sy * 0.06, cur.pry + mouse.sx * 0.18 + spin.angle, turn * 0.05);
  const tA = screenTex[shown];
  screenU.tA.value = tA; screenU.uMix.value = 0; screenU.rA.value = tA.userData.r;

  // balance
  const bs = cur.bs * view.k;
  bal.visible = bs > 0.01;
  bal.position.set(cur.bx * view.halfW, cur.by * view.halfH, 0);
  bal.scale.setScalar(Math.max(bs, 0.0001));
  bal.rotation.y = mouse.sx * 0.2 - 0.12;
  // balance: scroll plays steps 1–4; step 5 ("Your turn") hands the same scale to the visitor
  const playing = fairOn === 4;
  drop += ((playing ? 1 : clamp(fp / 0.15, 0, 1)) - drop) * damp;
  eff += ((playing ? (game.mode === 'effort' ? 1 : 0) : smooth(clamp((fp - 0.31) / 0.2, 0, 1))) - eff) * damp;
  const list = playing ? game.tokens : DEFAULT_TOKENS;
  let wL = 0, wR = 0;
  for (const t of list) { const w = lerp(1, MINUTES[t.type], eff); if (t.side < 0) wL += w; else wR += w; }
  const target = (wL + wR ? 0.3 * (wL - wR) / (wL + wR) : 0) * clamp(drop * 1.2, 0, 1);
  if (reduce) spring.a = target; else {
    spring.v += (target - spring.a) * 38 * dt;
    spring.v *= Math.exp(-4.2 * dt);
    spring.a += spring.v * dt;
  }
  beamG.rotation.z = spring.a;
  for (const P of pans) {
    const ex = P.side * G.L / 2 * Math.cos(spring.a), ey = G.PIVOT + P.side * G.L / 2 * Math.sin(spring.a);
    P.rod.position.set(ex, ey - G.ROD / 2, 0);
    P.pan.position.set(ex, ey - G.ROD, 0);
  }
  // each side's chores sit in a row centred on its pan, shrinking to fit
  const sizeOf = t => lerp(0.3, t.type === 'bath' ? 0.58 : 0.2, eff);
  for (const side of [-1, 1]) {
    const pan = pans[side < 0 ? 0 : 1].pan.position, idx = [];
    list.forEach((t, i) => { if (t.side === side) idx.push(i); });
    const gap = 0.07, total = idx.reduce((s, i) => s + sizeOf(list[i]), 0) + gap * Math.max(0, idx.length - 1);
    const f = Math.min(1, 1.3 / Math.max(total, 0.001));
    let x = -total * f / 2;
    for (const i of idx) {
      const s = sizeOf(list[i]) * f, m = tokPool[i];
      (m.userData.target ??= new THREE.Vector3()).set(pan.x + x + s / 2, pan.y + 0.04 + s / 2, 0);
      m.userData.s = s;
      x += s + gap * f;
    }
  }
  tokPool.forEach((m, i) => {
    const t = list[i];
    m.visible = !!t;
    if (!t) return;
    m.material = t.type === 'bath' ? peachMat : mintMat;
    const tp = m.userData.target;
    m.scale.setScalar(m.userData.s);
    if (drag && drag.i === i && drag.moved && drag.pos) {           // held: follows the cursor, wiggles a little
      m.position.lerp(drag.pos, 0.45);
      m.rotation.set(0, m.rotation.y + dt * 2, Math.sin(tt * 7) * 0.1);
    } else if (m.userData.hop) {                                     // hopping to the other pan in an arc
      const e = m.userData.hop.t;
      m.position.lerpVectors(m.userData.hop.from, tp, e);
      m.position.y += Math.sin(Math.PI * e) * 0.9;
      m.rotation.set(0, m.userData.hop.spin + e * Math.PI * 2, 0);
    } else if (!playing) {                                           // scripted drop-in
      const d = clamp((drop * 1.6 - i * 0.2) / 0.6, 0, 1);
      m.visible = d > 0.001;
      m.position.set(tp.x, tp.y + Math.pow(1 - d, 3) * 3, 0);
      m.rotation.set(0, (1 - d) * 1.5, 0);
    } else { m.position.copy(tp); m.rotation.set(0, 0, 0); }
  });
  const showTags = bal.visible && cur.bs > 0.3 && drop > 0.9;
  if (showTags || tagsShown) {
    const n = [0, 0], mins = [0, 0];
    for (const t of list) { const k = t.side < 0 ? 0 : 1; n[k]++; mins[k] += MINUTES[t.type]; }
    tags.forEach((tag, i) => { // skipped entirely while the balance is off screen
      pans[i].pan.getWorldPosition(v3); v3.y -= 0.32 * bs; v3.project(camera);
      tag.style.transform = `translate(calc(${(v3.x * 0.5 + 0.5) * innerWidth}px - 50%), ${(-v3.y * 0.5 + 0.5) * innerHeight}px)`;
      tag.style.opacity = showTags ? 1 : 0;
      const txt = eff < 0.5 ? `${n[i]} task${n[i] === 1 ? '' : 's'}` : `${mins[i]} min`;
      const span = tag.lastElementChild;
      if (span.textContent !== txt) span.textContent = txt;
    });
  }
  tagsShown = showTags;

  // the room follows whatever object is in focus (weighted by how present each one is)
  {
    const cands = [[house, house.visible ? hs : 0], [props, props.visible ? as : 0], [bal, bal.visible ? bs : 0], [phone, phone.visible ? ps * 0.6 : 0]];
    let wsum = 0, cx = 0, cy = 0, pres = 0;
    for (const [o, w] of cands) { wsum += w; cx += o.position.x * w; cy += o.position.y * w; pres = Math.max(pres, w); }
    if (wsum > 0.001) { room.position.x += (cx / wsum - room.position.x) * damp; room.position.y += (cy / wsum - room.position.y) * damp; }
    const night = 1 - sun, p = clamp(pres / 0.8, 0, 1);
    glowMat.uniforms.uO.value = 0.3 * p * night;
    winMat.uniforms.uO.value = 0.13 * p * night;
    dustMat.uniforms.uO.value = 1.1 * p * night;
    dustMat.uniforms.uTime.value = idle ? tt : 0;
    dustMat.uniforms.uSpread.value = mobile ? 0.7 : 1.3;
    room.visible = p * night > 0.005;
  }
  scene.environmentIntensity = 0.75 + sun * 0.35;
  rim.intensity = 3 - sun * 1.6;
  camera.position.x = mouse.sx * 0.18;
  camera.lookAt(0, 0, 0);

  if (fx) {
    fx.comp.uniforms.uBloom.value = 0.6 * (1 - 0.5 * sun);   // daylight needs less glow
    fx.comp.uniforms.uTime.value = idle ? (tt % 100) : 0;
    fx.render(scene, camera, phone.visible);
  } else renderer.render(scene, camera);
}
gsap.ticker.add(frame);

/* ───────── interaction: the playable balance and the living house ───────── */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), dragPlane = new THREE.Plane(), hitP = new THREE.Vector3();
const verdictEl = $('.play__verdict'), addBtns = $$('[data-add]'), modeBtns = $$('[data-mode]');

function aim(e) { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, G.camera); }
function tokenUnder() {
  if (fairOn !== 4 || !G.bal.visible) return -1;
  const hit = ray.intersectObjects(G.tokPool.filter(m => m.visible), false)[0];
  return hit ? G.tokPool.indexOf(hit.object) : -1;
}
const houseUnder = objs => G.house.visible && objs?.length ? ray.intersectObjects(objs, false)[0] : null;

function hopToken(m, side, from) {
  const hop = { t: 0, from: (from || m.position).clone(), spin: m.rotation.y };
  m.userData.hop = hop;
  gsap.to(hop, {
    t: 1, duration: reduce ? 0.01 : 0.6, ease: 'power2.inOut',
    onComplete: () => { if (m.userData.hop === hop) m.userData.hop = null; G.spring.v += side < 0 ? 0.9 : -0.9; }, // landing kicks the beam
  });
}
function updatePlay() {
  const side = s => game.tokens.filter(t => t.side === s);
  const [A, B] = [side(-1), side(1)];
  const mA = A.reduce((s, t) => s + MINUTES[t.type], 0), mB = B.reduce((s, t) => s + MINUTES[t.type], 0);
  const pct = (v, tot) => Math.round(v / tot * 100);
  let txt;
  if (!A.length && !B.length) txt = 'Add a chore to start.';
  else if (game.mode === 'count') txt = `By count: A does ${pct(A.length, A.length + B.length)}%, B does ${pct(B.length, A.length + B.length)}%.`;
  else txt = `By effort: A carries ${pct(mA, mA + mB || 1)}% (${mA} min), B ${pct(mB, mA + mB || 1)}% (${mB} min).`;
  const byCount = Math.sign(A.length - B.length), byEffort = Math.sign(mA - mB);
  if (byCount && byEffort && byCount !== byEffort) txt += ' Same chores, opposite story.';
  verdictEl.textContent = txt;
  addBtns.forEach(b => { b.disabled = side(+b.dataset.add).length >= 5; });
  modeBtns.forEach(b => { const on = b.dataset.mode === game.mode; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
}
updatePlay();

addBtns.forEach(b => b.addEventListener('click', () => {
  const side = +b.dataset.add;
  if (game.tokens.filter(t => t.side === side).length >= 5) return;
  game.tokens.push({ type: b.dataset.type, side });
  if (G) { const m = G.tokPool[game.tokens.length - 1], pan = G.pans[side < 0 ? 0 : 1].pan.position; hopToken(m, side, new THREE.Vector3(pan.x, pan.y + 2.6, 0)); }
  updatePlay();
}));
modeBtns.forEach(b => b.addEventListener('click', () => { game.mode = b.dataset.mode; updatePlay(); }));
$('[data-reset]').addEventListener('click', () => { game.tokens = DEFAULT_TOKENS.map(t => ({ ...t })); game.mode = 'effort'; updatePlay(); });

function popSprout() {
  gsap.fromTo(life, { pop: 1.45 }, { pop: 1, duration: 1.3, ease: 'elastic.out(1, 0.35)', overwrite: true });
  if (!G.H.sproutPivot) return;
  G.H.sproutPivot.getWorldPosition(v3b);
  G.leaves.forEach((l, i) => {
    const a = i / G.leaves.length * Math.PI * 2;
    l.position.copy(v3b); l.position.y += 0.2;
    l.userData.v.set(Math.cos(a) * (1.2 + Math.random()), 2 + Math.random() * 1.5, Math.sin(a) * 0.8);
    l.userData.life = 1.1; l.visible = true;
  });
}
function pokeHouse() { gsap.fromTo(life, { sq: 1 }, { sq: 0, duration: 1.1, ease: 'elastic.out(1.1, 0.3)', overwrite: true }); }

addEventListener('pointerdown', e => {
  if (!G || e.button > 0 || e.target.closest?.('button, a, input')) return;
  aim(e);
  const i = tokenUnder();
  if (i >= 0) {
    drag = { i, x: e.clientX, y: e.clientY, moved: false, mouse: e.pointerType === 'mouse', pos: null };
    if (drag.mouse) { e.preventDefault(); lenis?.stop(); }
    return;
  }
  if (reduce) return;
  if (houseUnder(G.H.sproutMeshes)) popSprout();
  else if (houseUnder(G.H.meshes)) pokeHouse();
});
addEventListener('pointermove', e => {
  if (!G) return;
  aim(e);
  if (drag) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true;
    if (drag.moved && drag.mouse) {
      G.camera.getWorldDirection(hitP);
      dragPlane.setFromNormalAndCoplanarPoint(hitP.negate(), G.bal.getWorldPosition(v3b));
      if (ray.ray.intersectPlane(dragPlane, hitP)) drag.pos = G.bal.worldToLocal(hitP.clone());
      document.body.style.cursor = 'grabbing';
    }
    return;
  }
  if (e.pointerType !== 'mouse') return;
  const overTok = tokenUnder() >= 0;
  hoverHouse = !overTok && !!houseUnder(G.H.meshes);
  document.body.style.cursor = overTok ? 'grab' : hoverHouse ? 'pointer' : '';
}, { passive: true });
function endDrag() {
  if (!drag) return;
  const d = drag; drag = null; lenis?.start(); document.body.style.cursor = '';
  const t = game.tokens[d.i], m = G.tokPool[d.i];
  if (!t) return;
  // a click hops it across; a drag drops it on whichever side it was released over (max 5 per side)
  let side = d.moved && d.mouse && d.pos ? (d.pos.x < 0 ? -1 : 1) : -t.side;
  if (side !== t.side && game.tokens.filter(o => o.side === side).length >= 5) side = t.side;
  t.side = side;
  hopToken(m, side);
  updatePlay();
}
addEventListener('pointerup', endDrag);
addEventListener('pointercancel', () => { if (drag) { drag = null; lenis?.start(); } });

/* ───────── loading + intro ───────── */
const pctEl = $('.loader__pct span'), barEl = $('.loader__bar i');
const setPct = p => { pctEl.textContent = Math.round(p * 100); barEl.style.transform = `scaleX(${p})`; };
if (G) G.manager.onProgress = (_, l, t) => setPct(l / t);
const timeout = new Promise(r => setTimeout(r, 9000));
Promise.race([Promise.all([G ? G.loaded : null, document.fonts.ready, new Promise(r => setTimeout(r, 700))]), timeout])
  .catch(err => console.warn(err))
  .then(() => {
    setPct(1);
    ScrollTrigger.refresh();
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: reduce ? 0.01 : 1.2, ease: 'expo.inOut' })
      .set('.loader', { display: 'none' })
      .to({ v: 0 }, { v: 1, duration: reduce ? 0.01 : 2.2, ease: 'expo.out', onUpdate() { intro = this.targets()[0].v; } }, 0.55);
    if (!reduce) {
      tl.from('.hero__title .line > span', { yPercent: 110, duration: 1.5, ease: 'expo.out', stagger: 0.1 }, 0.7)
        .from('.hero__kicker span, .hero__foot > *', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 }, 1.0);
    } else intro = 1;
    tl.add(() => { document.body.classList.remove('is-loading'); lenis?.start(); }, 0.9);
  });

/* late layout shifts (fonts, images, reduced-motion styles) move every pin; re-measure whenever the page height changes */
{
  let lastH = 0, t;
  new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - lastH) < 2) return;
    lastH = h;
    clearTimeout(t);
    t = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
  addEventListener('load', () => ScrollTrigger.refresh());
}
