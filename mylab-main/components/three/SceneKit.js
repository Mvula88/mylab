// SceneKit — shared Three.js factories for the science-lab scenes.
// Use imperatively from a `useEffect` block that mounts a canvas, à la PendulumLab.
//
// Conventions:
//   - Bench top sits at y = 0; everything stands on it.
//   - World units are metres.
//   - All factories return THREE.Object3D instances ready to .add() to a scene.

import * as THREE from "three";

/* ───────────────────────── Scene boot helpers ─────────────────────────── */

export function createScene(mount, { background = 0xf5f1e3, camera: camOpts = {} } = {}) {
  const width = mount.clientWidth || 800;
  const height = mount.clientHeight || 450;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);

  const camera = new THREE.PerspectiveCamera(
    camOpts.fov ?? 38,
    width / height,
    0.05,
    100
  );
  camera.position.set(camOpts.x ?? 1.1, camOpts.y ?? 0.95, camOpts.z ?? 1.4);
  camera.lookAt(camOpts.lookX ?? 0, camOpts.lookY ?? 0.35, camOpts.lookZ ?? 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  // Standard 3-point lighting
  const hemi = new THREE.HemisphereLight(0xfff4dc, 0x4a4030, 0.55);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff0d0, 1.4);
  key.position.set(1.8, 2.8, 1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -1.5;
  key.shadow.camera.right = 1.5;
  key.shadow.camera.top = 1.5;
  key.shadow.camera.bottom = -1.5;
  key.shadow.bias = -0.0005;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xc2dcff, 0.35);
  fill.position.set(-2, 1.5, -1);
  scene.add(fill);

  // Resize observer
  const onResize = () => {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  let ro;
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(onResize);
    ro.observe(mount);
  }

  return {
    scene, camera, renderer,
    dispose() {
      ro?.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          const m = obj.material;
          (Array.isArray(m) ? m : [m]).forEach((mi) => mi.dispose?.());
        }
      });
    },
  };
}

/* ───────── Camera orbit drag (matches PendulumLab convention) ─────────── */

export function attachOrbitDrag(camera, dom, opts = {}) {
  const lookAt = new THREE.Vector3(opts.lookX ?? 0, opts.lookY ?? 0.35, opts.lookZ ?? 0);
  let azimuth = Math.atan2(camera.position.x - lookAt.x, camera.position.z - lookAt.z);
  const dx0 = camera.position.x - lookAt.x;
  const dy0 = camera.position.y - lookAt.y;
  const dz0 = camera.position.z - lookAt.z;
  let elevation = Math.atan2(dy0, Math.sqrt(dx0 * dx0 + dz0 * dz0));
  const radius = Math.sqrt(dx0 * dx0 + dy0 * dy0 + dz0 * dz0);

  let isDragging = false, prevX = 0, prevY = 0;
  const onDown = (e) => {
    isDragging = true;
    const pt = e.touches ? e.touches[0] : e;
    prevX = pt.clientX; prevY = pt.clientY;
  };
  const onMove = (e) => {
    if (!isDragging) return;
    const pt = e.touches ? e.touches[0] : e;
    azimuth -= (pt.clientX - prevX) * 0.008;
    elevation = Math.max(-0.05, Math.min(0.85, elevation + (pt.clientY - prevY) * 0.005));
    prevX = pt.clientX; prevY = pt.clientY;
    const r = radius * Math.cos(elevation);
    camera.position.x = lookAt.x + Math.sin(azimuth) * r;
    camera.position.z = lookAt.z + Math.cos(azimuth) * r;
    camera.position.y = lookAt.y + radius * Math.sin(elevation);
    camera.lookAt(lookAt);
  };
  const onUp = () => { isDragging = false; };
  dom.style.touchAction = "none";
  dom.addEventListener("mousedown", onDown);
  dom.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  dom.addEventListener("touchstart", onDown, { passive: true });
  dom.addEventListener("touchmove", onMove, { passive: true });
  dom.addEventListener("touchend", onUp);

  return () => {
    dom.removeEventListener("mousedown", onDown);
    dom.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    dom.removeEventListener("touchstart", onDown);
    dom.removeEventListener("touchmove", onMove);
    dom.removeEventListener("touchend", onUp);
  };
}

/* ───────────────────────── Bench / floor ───────────────────────────────── */

export function makeBench({ width = 2.6, depth = 0.8 } = {}) {
  const grp = new THREE.Group();
  // top
  const topMat = new THREE.MeshStandardMaterial({ color: 0x8c6c43, roughness: 0.85 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), topMat);
  top.position.y = -0.02;
  top.receiveShadow = true;
  grp.add(top);
  // wood-grain stripes
  for (let i = 0; i < 6; i++) {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.001, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x7a5d39, roughness: 0.9 })
    );
    stripe.position.set(0, 0, -depth / 2 + 0.1 + i * (depth - 0.2) / 5);
    grp.add(stripe);
  }
  // back wall (subtle)
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, 1.4, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xe8e0c8, roughness: 0.95 })
  );
  wall.position.set(0, 0.7, -depth / 2 - 0.01);
  wall.receiveShadow = true;
  grp.add(wall);
  return grp;
}

/* ──────────────────────── Glass material ───────────────────────────────── */

export function glassMaterial(opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: opts.color ?? 0xfffefb,
    transparent: true,
    opacity: opts.opacity ?? 0.32,
    transmission: opts.transmission ?? 0.92,
    roughness: opts.roughness ?? 0.04,
    metalness: 0,
    ior: 1.5,
    thickness: 0.005,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  });
}

export function liquidMaterial(color = 0xa7d4ec, opacity = 0.85) {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    transmission: 0.35,
    roughness: 0.18,
    ior: 1.34,
    thickness: 0.02,
    side: THREE.DoubleSide,
  });
}

/* ──────────────────────── Test tube ────────────────────────────────────── */

export function makeTestTube({ radius = 0.012, height = 0.12, wall = 0.0014 } = {}) {
  const grp = new THREE.Group();
  // tube body (open top, rounded bottom via Lathe)
  const points = [];
  const segs = 24;
  // straight side
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const y = t * height;
    points.push(new THREE.Vector2(radius, y));
  }
  // round bottom half
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * Math.PI;
    points.push(new THREE.Vector2(radius * Math.cos(Math.PI / 2 - a / 2) , -radius * Math.sin(Math.PI / 2 - a / 2) * 0));
  }
  // simpler: hemispherical bottom
  const outer = [];
  for (let i = 0; i <= 8; i++) {
    const a = (Math.PI / 2) + (i / 8) * (Math.PI / 2);
    outer.push(new THREE.Vector2(radius * Math.cos(a), radius * Math.sin(a) + 0));
  }
  for (let i = 1; i <= 16; i++) {
    outer.push(new THREE.Vector2(radius, (i / 16) * height));
  }
  const tubeGeom = new THREE.LatheGeometry(outer, 28);
  const tube = new THREE.Mesh(tubeGeom, glassMaterial());
  tube.castShadow = true;
  grp.add(tube);

  // rim (slight lip at top)
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(radius + 0.0005, 0.0008, 8, 24),
    glassMaterial({ opacity: 0.45 })
  );
  rim.position.y = height;
  rim.rotation.x = Math.PI / 2;
  grp.add(rim);

  // helper to set fill (returns the liquid mesh; recreated each call)
  let liquidMesh = null;
  const setFill = (level01, color = 0xa7d4ec, alpha = 0.85) => {
    if (liquidMesh) {
      grp.remove(liquidMesh);
      liquidMesh.geometry.dispose();
      liquidMesh.material.dispose();
    }
    const lvl = Math.max(0, Math.min(1, level01));
    if (lvl <= 0) { liquidMesh = null; return; }
    // approximate fluid: cylinder from -0.6r to lvl*height, plus rounded bottom cap
    const fluidR = radius - wall;
    const fluidH = lvl * (height + radius);
    const cyl = new THREE.CylinderGeometry(fluidR, fluidR, fluidH, 24, 1, false);
    liquidMesh = new THREE.Mesh(cyl, liquidMaterial(color, alpha));
    liquidMesh.position.y = -radius * 0.6 + fluidH / 2;
    grp.add(liquidMesh);
  };

  grp.userData = { setFill, radius, height };
  return grp;
}

/* ─────────────────────────── Beaker ────────────────────────────────────── */

export function makeBeaker({ radius = 0.045, height = 0.08, wall = 0.0018 } = {}) {
  const grp = new THREE.Group();
  // outer cylinder (open top, flat bottom)
  const profile = [];
  // bottom inner up to fluid
  profile.push(new THREE.Vector2(0.0001, 0));
  profile.push(new THREE.Vector2(radius - wall, 0));
  profile.push(new THREE.Vector2(radius - wall, height));
  profile.push(new THREE.Vector2(radius, height));
  profile.push(new THREE.Vector2(radius, 0));
  profile.push(new THREE.Vector2(0.0001, 0));
  const geom = new THREE.LatheGeometry(profile, 36);
  const mesh = new THREE.Mesh(geom, glassMaterial());
  mesh.castShadow = true;
  grp.add(mesh);

  // pouring spout (small triangular notch)
  const spout = new THREE.Mesh(
    new THREE.BoxGeometry(0.004, 0.003, 0.01),
    glassMaterial()
  );
  spout.position.set(radius, height - 0.005, 0);
  spout.rotation.z = -0.4;
  grp.add(spout);

  // base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.002, 36),
    glassMaterial({ opacity: 0.4 })
  );
  base.position.y = 0;
  grp.add(base);

  let liquidMesh = null;
  const setFill = (level01, color = 0xa7d4ec, alpha = 0.7) => {
    if (liquidMesh) {
      grp.remove(liquidMesh);
      liquidMesh.geometry.dispose();
      liquidMesh.material.dispose();
    }
    const lvl = Math.max(0, Math.min(1, level01));
    if (lvl <= 0) { liquidMesh = null; return; }
    const fluidR = radius - wall - 0.0005;
    const fluidH = lvl * (height - wall * 2);
    const cyl = new THREE.CylinderGeometry(fluidR, fluidR, fluidH, 36, 1, false);
    liquidMesh = new THREE.Mesh(cyl, liquidMaterial(color, alpha));
    liquidMesh.position.y = wall + fluidH / 2;
    grp.add(liquidMesh);
  };

  grp.userData = { setFill, radius, height };
  return grp;
}

/* ─────────────────────────── Bunsen burner ─────────────────────────────── */

export function makeBunsen() {
  const grp = new THREE.Group();
  // base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.045, 0.018, 24),
    new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.65, metalness: 0.4 })
  );
  base.position.y = 0.009;
  base.castShadow = true;
  grp.add(base);
  // barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.011, 0.011, 0.13, 16),
    new THREE.MeshStandardMaterial({ color: 0x55585c, roughness: 0.5, metalness: 0.7 })
  );
  barrel.position.y = 0.018 + 0.065;
  barrel.castShadow = true;
  grp.add(barrel);
  // gas tap nipple
  const nip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.04, 12),
    new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.5 })
  );
  nip.rotation.z = Math.PI / 2;
  nip.position.set(0.035, 0.018, 0);
  grp.add(nip);

  // flame
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xf7a82a, transparent: true, opacity: 0.85,
  });
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.018, 0.085, 16, 1, true),
    flameMat
  );
  flame.position.y = 0.018 + 0.13 + 0.04;
  flame.visible = false;
  grp.add(flame);

  const innerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.009, 0.05, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3d7fef, transparent: true, opacity: 0.75 })
  );
  innerFlame.position.y = 0.018 + 0.13 + 0.025;
  innerFlame.visible = false;
  grp.add(innerFlame);

  const setFlame = (on, intensity = 1) => {
    flame.visible = on;
    innerFlame.visible = on;
    flame.scale.set(intensity, intensity, intensity);
    innerFlame.scale.set(intensity, intensity, intensity);
  };
  grp.userData = { setFlame, flameTop: 0.018 + 0.13 + 0.085 };
  return grp;
}

/* ─────────────────────────── Tripod + gauze ────────────────────────────── */

export function makeTripod() {
  const grp = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.55, metalness: 0.6 });
  const legGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.16, 8);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(legGeom, mat);
    leg.position.set(Math.sin(a) * 0.04, 0.08, Math.cos(a) * 0.04);
    leg.rotation.set(0.15 * Math.cos(a), 0, 0.15 * Math.sin(a));
    leg.castShadow = true;
    grp.add(leg);
  }
  // top ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.003, 8, 24),
    mat
  );
  ring.position.y = 0.155;
  ring.rotation.x = Math.PI / 2;
  grp.add(ring);
  // gauze (square)
  const gauze = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.004, 0.11),
    new THREE.MeshStandardMaterial({ color: 0xd6d6d6, roughness: 0.85, metalness: 0.3 })
  );
  gauze.position.y = 0.158;
  grp.add(gauze);
  grp.userData = { gauzeY: 0.16 };
  return grp;
}

/* ─────────────────────────── Clamp stand ───────────────────────────────── */

export function makeClampStand({ rodHeight = 0.5 } = {}) {
  const grp = new THREE.Group();
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 });
  // base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.13), matMetal);
  base.position.y = 0.006;
  base.castShadow = true;
  grp.add(base);
  // rod
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, rodHeight, 12), matMetal);
  rod.position.set(-0.07, 0.012 + rodHeight / 2, 0);
  rod.castShadow = true;
  grp.add(rod);
  grp.userData = { rodX: -0.07, rodTop: 0.012 + rodHeight };
  return grp;
}

/* ─────────────────────────── Dropper / pipette ─────────────────────────── */

export function makeDropper({ length = 0.08 } = {}) {
  const grp = new THREE.Group();
  // bulb
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.011, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.5 })
  );
  bulb.position.y = length;
  grp.add(bulb);
  // tube
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0025, 0.0017, length, 16),
    glassMaterial({ opacity: 0.5 })
  );
  tube.position.y = length / 2;
  grp.add(tube);
  return grp;
}

/* ─────────────────────────── Sphere "droplet" pool ─────────────────────── */

export function makeDropletPool(maxDrops = 20) {
  const pool = [];
  const geom = new THREE.SphereGeometry(0.003, 8, 8);
  for (let i = 0; i < maxDrops; i++) {
    const m = new THREE.Mesh(geom.clone(), new THREE.MeshStandardMaterial({ color: 0xa7d4ec, roughness: 0.15 }));
    m.visible = false;
    pool.push(m);
  }
  return pool;
}

/* ─────────────────────────── Optical bench ─────────────────────────────── */

export function makeOpticalBench({ length = 1.6 } = {}) {
  const grp = new THREE.Group();
  const railMat = new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.5, metalness: 0.4 });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.012, 0.06), railMat);
  rail.position.y = 0.006;
  rail.receiveShadow = true;
  grp.add(rail);
  // scale markings every 10 cm
  for (let i = 0; i <= 16; i++) {
    const x = -length / 2 + (i / 16) * length;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.002, 0.008, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xe8e4d8 })
    );
    tick.position.set(x, 0.0125, 0);
    grp.add(tick);
  }
  grp.userData = { length };
  return grp;
}

export function makeLensHolder({ height = 0.18, lensR = 0.04 } = {}) {
  const grp = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, height, 0.014),
    new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.5, metalness: 0.4 })
  );
  post.position.y = height / 2;
  grp.add(post);
  // biconvex lens disc — two spherical caps on a thin disc
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xb8e0f5,
    transparent: true,
    opacity: 0.35,
    transmission: 0.85,
    roughness: 0.05,
    ior: 1.5,
    thickness: 0.005,
    side: THREE.DoubleSide,
  });
  const lens = new THREE.Mesh(new THREE.SphereGeometry(lensR, 32, 16, 0, Math.PI * 2, 0, Math.PI / 8), lensMat);
  lens.position.set(0, height + 0.005, 0);
  lens.rotation.x = Math.PI / 2;
  grp.add(lens);
  const lens2 = lens.clone();
  lens2.rotation.x = -Math.PI / 2;
  grp.add(lens2);
  // disc edge
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(lensR, 0.002, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.6, metalness: 0.4 })
  );
  ring.position.set(0, height + 0.005, 0);
  ring.rotation.y = Math.PI / 2;
  grp.add(ring);
  grp.userData = { lens, lensY: height + 0.005, lensR };
  return grp;
}

export function makeIlluminatedObject({ height = 0.18, arrowH = 0.06 } = {}) {
  const grp = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, height, 0.014),
    new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.5, metalness: 0.4 })
  );
  post.position.y = height / 2;
  grp.add(post);
  // lamp box behind
  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.06, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, emissive: 0xfff1c0, emissiveIntensity: 0.6 })
  );
  lamp.position.set(0, height, -0.04);
  grp.add(lamp);
  // crosshair / arrow object — drawn on a small white plane
  const arrowMat = new THREE.MeshStandardMaterial({ color: 0x1a1f2e });
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.002, arrowH, 0.001), arrowMat);
  stem.position.set(0, height + arrowH / 2, 0);
  grp.add(stem);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.01, 8), arrowMat);
  head.position.set(0, height + arrowH + 0.005, 0);
  grp.add(head);
  grp.userData = { arrowTopY: height + arrowH, arrowBottomY: height };
  return grp;
}

export function makeScreen({ height = 0.2, w = 0.12, h = 0.12 } = {}) {
  const grp = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, height, 0.014),
    new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.5, metalness: 0.4 })
  );
  post.position.y = height / 2;
  grp.add(post);
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: 0xfefcf3, roughness: 0.9, side: THREE.DoubleSide })
  );
  board.position.y = height + h / 2;
  grp.add(board);
  // image canvas drawn here (will be set later)
  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = 256; imgCanvas.height = 256;
  const imgTex = new THREE.CanvasTexture(imgCanvas);
  imgTex.colorSpace = THREE.SRGBColorSpace;
  const imgPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.85, h * 0.85),
    new THREE.MeshStandardMaterial({ map: imgTex, transparent: true, side: THREE.DoubleSide })
  );
  imgPlane.position.set(0, height + h / 2, 0.001);
  grp.add(imgPlane);
  grp.userData = { imgCanvas, imgTex, screenY: height + h / 2 };
  return grp;
}

/* ─────────────────────────── Plane mirror ──────────────────────────────── */

export function makeMirror({ width = 0.2, height = 0.005, depth = 0.04 } = {}) {
  const grp = new THREE.Group();
  // reflective face
  const mirror = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color: 0xd6e1ea, roughness: 0.05, metalness: 0.9 })
  );
  mirror.position.y = height / 2;
  grp.add(mirror);
  // hatch backing
  for (let i = 0; i < 12; i++) {
    const t = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.004, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x222, roughness: 0.9 })
    );
    t.position.set(-width / 2 + i * (width / 11), -0.002, depth / 2 + 0.006);
    t.rotation.y = -0.3;
    grp.add(t);
  }
  return grp;
}

/* ─────────────────────────── Ray helper (line) ─────────────────────────── */

export function makeRay(color = 0xc2185b) {
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(6);
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  const line = new THREE.Line(geom, mat);
  const setEndpoints = (ax, ay, az, bx, by, bz) => {
    pos[0] = ax; pos[1] = ay; pos[2] = az;
    pos[3] = bx; pos[4] = by; pos[5] = bz;
    geom.attributes.position.needsUpdate = true;
    geom.computeBoundingSphere();
  };
  line.userData = { setEndpoints };
  return line;
}

/* ─────────────────────────── Spring (coil) ─────────────────────────────── */

export function makeSpring({ coils = 14, radius = 0.018, wireRadius = 0.0018, color = 0xa8a8b0 } = {}) {
  const grp = new THREE.Group();
  const coilMeshes = [];
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.7 });
  for (let i = 0; i < coils; i++) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(radius, wireRadius, 8, 32), mat);
    c.rotation.x = Math.PI / 2;
    grp.add(c);
    coilMeshes.push(c);
  }
  const setStretch = (totalLength) => {
    const step = totalLength / coils;
    coilMeshes.forEach((c, i) => { c.position.y = -i * step; });
  };
  setStretch(0.12);
  grp.userData = { setStretch, coils, radius };
  return grp;
}

/* ─────────────────────────── Mass hanger / slotted mass ─────────────────── */

export function makeMassHanger() {
  const grp = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x55585c, roughness: 0.6, metalness: 0.6 });
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.005, 0.001, 8, 12, Math.PI), mat);
  hook.rotation.z = Math.PI;
  hook.position.y = 0.005;
  grp.add(hook);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.0014, 0.0014, 0.03, 8), mat);
  rod.position.y = -0.01;
  grp.add(rod);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.003, 24), mat);
  plate.position.y = -0.025;
  grp.add(plate);
  return grp;
}

export function makeSlottedMass({ thickness = 0.006 } = {}) {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, thickness, 24),
    new THREE.MeshStandardMaterial({ color: 0xa3a3aa, roughness: 0.5, metalness: 0.7 })
  );
}

/* ─────────────────────────── Digital readout sprite ────────────────────── */

export function makeReadoutSprite({ width = 0.16, height = 0.06, prefix = "", suffix = "", initial = "—" } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 320; canvas.height = 96;
  const ctx = canvas.getContext("2d");
  const draw = (text) => {
    ctx.fillStyle = "#fefcf3"; ctx.fillRect(0, 0, 320, 96);
    ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 316, 92);
    ctx.fillStyle = "#222"; ctx.fillRect(16, 18, 288, 60);
    ctx.fillStyle = "#7ad59d";
    ctx.font = "bold 36px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${prefix}${text}${suffix}`, 160, 48);
  };
  draw(initial);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(width, height, 1);
  sprite.userData = { setText: (s) => { draw(s); tex.needsUpdate = true; } };
  return sprite;
}

/* ─────────────────────────── Battery / power supply ───────────────────── */

export function makeBattery({ width = 0.12, height = 0.06, depth = 0.06, label = "POWER" } = {}) {
  const grp = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color: 0xfefcf3, roughness: 0.7 })
  );
  body.position.y = height / 2;
  body.castShadow = true;
  grp.add(body);
  // labels canvas
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fefcf3"; ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 252, 124);
  ctx.fillStyle = "#1a1f2e";
  ctx.font = "bold 36px 'IBM Plex Mono', monospace";
  ctx.fillText("−", 30, 80); ctx.fillText("+", 210, 80);
  ctx.font = "bold 18px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(label, 128, 30);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  body.material.map = tex;
  body.material.needsUpdate = true;
  // terminals (small posts)
  const term = new THREE.MeshStandardMaterial({ color: 0x444, roughness: 0.4, metalness: 0.6 });
  const termA = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.012, 12), term);
  termA.position.set(-width / 2 + 0.012, height + 0.006, 0);
  grp.add(termA);
  const termB = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.012, 12), term);
  termB.position.set(width / 2 - 0.012, height + 0.006, 0);
  grp.add(termB);
  grp.userData = { posTerminal: termB.position.clone(), negTerminal: termA.position.clone() };
  return grp;
}

/* ─────────────────────────── Ammeter / Voltmeter ───────────────────────── */

export function makeMeter({ symbol = "A", value = 0, unit = "A", radius = 0.04 } = {}) {
  const grp = new THREE.Group();
  // body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.02, 32),
    new THREE.MeshStandardMaterial({ color: 0xfefcf3, roughness: 0.55 })
  );
  body.rotation.x = Math.PI / 2;
  body.position.z = 0;
  grp.add(body);
  // face — canvas texture
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 256;
  const draw = (val) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fefcf3"; ctx.fillRect(0, 0, 256, 256);
    ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 6; ctx.stroke();
    // big symbol top
    ctx.fillStyle = "#1a1f2e";
    ctx.font = "bold 60px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(symbol, 128, 80);
    // digital readout box
    ctx.fillStyle = "#222"; ctx.fillRect(40, 140, 176, 60);
    ctx.fillStyle = "#7ad59d";
    ctx.font = "bold 32px 'IBM Plex Mono', monospace";
    ctx.fillText(`${val.toFixed(val < 10 ? 3 : 2)} ${unit}`, 128, 175);
  };
  draw(value);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true })
  );
  face.position.z = 0.011;
  grp.add(face);
  // posts
  const term = new THREE.MeshStandardMaterial({ color: 0x444, roughness: 0.4, metalness: 0.6 });
  const termA = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.01, 8), term);
  termA.position.set(-radius * 0.6, -radius - 0.005, 0);
  grp.add(termA);
  const termB = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.01, 8), term);
  termB.position.set(radius * 0.6, -radius - 0.005, 0);
  grp.add(termB);
  grp.userData = { setValue: (v) => { draw(v); tex.needsUpdate = true; } };
  return grp;
}

/* ─────────────────────────── Resistor (ceramic block w/ zigzag) ───────── */

export function makeResistor({ value = "10 Ω" } = {}) {
  const grp = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.06, 16),
    new THREE.MeshStandardMaterial({ color: 0xd9c79b, roughness: 0.7 })
  );
  body.rotation.z = Math.PI / 2;
  grp.add(body);
  // colour bands
  const bands = [0x222222, 0xb22222, 0x222222, 0xc0c0c0];
  bands.forEach((c, i) => {
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0102, 0.0102, 0.006, 16),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 })
    );
    band.rotation.z = Math.PI / 2;
    band.position.x = -0.02 + i * 0.012;
    grp.add(band);
  });
  // leads
  const lead = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.3, metalness: 0.7 });
  const leadA = new THREE.Mesh(new THREE.CylinderGeometry(0.0014, 0.0014, 0.05, 8), lead);
  leadA.rotation.z = Math.PI / 2;
  leadA.position.x = -0.055;
  grp.add(leadA);
  const leadB = new THREE.Mesh(new THREE.CylinderGeometry(0.0014, 0.0014, 0.05, 8), lead);
  leadB.rotation.z = Math.PI / 2;
  leadB.position.x = 0.055;
  grp.add(leadB);
  // label sprite
  const canvas = document.createElement("canvas");
  canvas.width = 192; canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 192, 64);
  ctx.fillStyle = "#e8e4d8";
  ctx.font = "bold 24px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(value, 96, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(0.08, 0.025, 1);
  sprite.position.set(0, 0.028, 0);
  grp.add(sprite);
  return grp;
}

/* ─────────────────────────── Wire (polyline of segments) ───────────────── */

export function makeWire(points, color = 0x1a1f2e) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const ax = a[0], ay = a[1], az = a[2] ?? 0;
    const bx = b[0], by = b[1], bz = b[2] ?? 0;
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, len, 8), mat);
    cyl.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
    // orient cylinder along direction
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
    grp.add(cyl);
  }
  return grp;
}

/* ─────────────────────────── Hex / colour helpers ──────────────────────── */

export function lerpColour(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
