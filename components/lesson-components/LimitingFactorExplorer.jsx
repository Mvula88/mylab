'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createScene, attachOrbitDrag, makeBench, makeBeaker,
} from '@/components/three/SceneKit';

const mono = '"IBM Plex Mono", monospace';

/**
 * 3D mini-lab: Elodea pondweed in a beaker, lamp at adjustable distance,
 * sliders for CO₂ concentration and temperature.
 * Bubbles of O₂ rise from the leaves and are collected in an inverted test tube.
 * The bubble rate (shown on a digital readout) is set by the slowest factor —
 * the **limiting factor**. This is the photosynthesis Paper 3 experiment, miniaturised.
 */
export default function LimitingFactorExplorer() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [light, setLight] = useState(0.6);    // 0..1 (slider for lamp distance, inverted)
  const [co2, setCo2] = useState(0.06);       // % (atmosphere ~0.04, enriched 0.1+)
  const [temp, setTemp] = useState(28);       // °C
  const lightRef = useRef(0.6);
  const co2Ref = useRef(0.06);
  const tempRef = useRef(28);
  const bubbleRateRef = useRef(0);

  useEffect(() => { lightRef.current = light; }, [light]);
  useEffect(() => { co2Ref.current = co2; }, [co2]);
  useEffect(() => { tempRef.current = temp; }, [temp]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.45, y: 0.45, z: 0.7, lookY: 0.13 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.55 }));

    // ── Beaker with water ──────────────────────────────────────────────
    const beaker = makeBeaker({ radius: 0.11, height: 0.20 });
    beaker.position.set(0, 0, 0);
    scene.add(beaker);
    beaker.userData.setFill(0.85, 0xb8dcf2, 0.45);

    // ── Elodea pondweed (stem + leaves) inside the beaker ──────────────
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x1f5223, roughness: 0.65 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.15, 8), darkGreenMat);
    stem.position.set(0, 0.085, 0);
    scene.add(stem);
    const leafPositions = [];
    for (let i = 0; i < 14; i++) {
      const angle = i * 0.6;
      const yOff = 0.02 + i * 0.01;
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 6),
        greenMat
      );
      leaf.scale.set(1, 0.3, 0.6);
      leaf.position.set(Math.cos(angle) * 0.015, yOff, Math.sin(angle) * 0.015);
      leaf.rotation.y = angle + Math.PI / 2;
      scene.add(leaf);
      leafPositions.push(new THREE.Vector3(leaf.position.x, leaf.position.y, leaf.position.z));
    }

    // ── Inverted glass funnel over the pondweed ────────────────────────
    const funnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.07, 0.08, 24, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xfffefb, transparent: true, opacity: 0.25,
        transmission: 0.9, roughness: 0.05, ior: 1.5, side: THREE.DoubleSide,
      })
    );
    funnel.position.set(0, 0.12, 0);
    scene.add(funnel);

    // ── Test tube above the funnel collecting O₂ ───────────────────────
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffefb, transparent: true, opacity: 0.28,
      transmission: 0.9, roughness: 0.04, ior: 1.5, side: THREE.DoubleSide,
    });
    const testTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.08, 24, 1, true),
      tubeMat
    );
    testTube.position.set(0, 0.2, 0);
    scene.add(testTube);
    const tubeBottom = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      tubeMat
    );
    tubeBottom.position.set(0, 0.16, 0);
    tubeBottom.rotation.x = Math.PI;
    scene.add(tubeBottom);

    // Gas collected at top of test tube (visible volume that grows)
    const collectedGas = new THREE.Mesh(
      new THREE.CylinderGeometry(0.013, 0.013, 0.001, 24),
      new THREE.MeshBasicMaterial({ color: 0xfefcf3, transparent: true, opacity: 0.7 })
    );
    collectedGas.position.set(0, 0.235, 0);
    scene.add(collectedGas);
    let gasVolume = 0;  // fraction 0..1

    // ── Lamp (sphere with emissive material), positioned at variable X ─
    const lampGroup = new THREE.Group();
    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffefa0, emissive: 0xfff1a0, emissiveIntensity: 1.5,
      })
    );
    lampGroup.add(lampBulb);
    const lampHolder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 })
    );
    lampHolder.position.y = -0.115;
    lampGroup.add(lampHolder);
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.05, 0.015, 16),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.55, metalness: 0.55 })
    );
    lampBase.position.y = -0.225;
    lampGroup.add(lampBase);
    lampGroup.position.set(0.35, 0.165, 0);
    scene.add(lampGroup);

    // Actual point light from the lamp
    const lampLight = new THREE.PointLight(0xfff1a0, 0.8, 1.2);
    lampLight.position.copy(lampGroup.position);
    scene.add(lampLight);

    // ── Bubble pool (small white-blue spheres rising from leaves) ──────
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xeaf6ff, transparent: true, opacity: 0.85,
      transmission: 0.5, roughness: 0.05, ior: 1.33,
    });
    const bubbleGeom = new THREE.SphereGeometry(0.004, 8, 8);
    const bubblePool = [];
    for (let i = 0; i < 30; i++) {
      const b = new THREE.Mesh(bubbleGeom, bubbleMat);
      b.userData = { active: false, t: 0, x0: 0, z0: 0 };
      b.visible = false;
      scene.add(b);
      bubblePool.push(b);
    }

    // ── Digital readout sprite (bubbles / min) ─────────────────────────
    const roCanvas = document.createElement('canvas');
    roCanvas.width = 360; roCanvas.height = 110;
    const roTex = new THREE.CanvasTexture(roCanvas);
    roTex.colorSpace = THREE.SRGBColorSpace;
    const drawReadout = (rate, limiter) => {
      const ctx = roCanvas.getContext('2d');
      ctx.fillStyle = '#fefcf3'; ctx.fillRect(0, 0, 360, 110);
      ctx.strokeStyle = '#1a1f2e'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, 354, 104);
      ctx.fillStyle = '#222'; ctx.fillRect(20, 22, 320, 50);
      ctx.fillStyle = '#7ad59d';
      ctx.font = "bold 32px 'IBM Plex Mono', monospace";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`${rate.toFixed(0)} bubbles/min`, 180, 47);
      ctx.fillStyle = '#1a1f2e';
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText(`limiting factor: ${limiter}`, 180, 90);
      roTex.needsUpdate = true;
    };
    drawReadout(0, '—');
    const readoutSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: roTex, transparent: true }));
    readoutSprite.scale.set(0.34, 0.105, 1);
    readoutSprite.position.set(-0.28, 0.36, 0);
    scene.add(readoutSprite);

    sceneRef.current = { scene, camera, renderer, dispose };
    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.13 });

    // Animation loop — emits bubbles at the rate set by the limiting factor
    let raf;
    let lastEmit = performance.now();
    let frameCount = 0;
    const animate = (now) => {
      frameCount++;
      const L = lightRef.current;            // 0..1
      const C = co2Ref.current;              // %
      const T = tempRef.current;             // °C

      // Move the lamp based on light slider (further = dimmer)
      const lampX = 0.6 - L * 0.4;           // L=1 → close, L=0 → far
      lampGroup.position.x = lampX;
      lampLight.position.x = lampX;
      lampLight.intensity = 0.4 + L * 1.4;

      // Limiting-factor logic: rate = min of three normalised factors
      const lightFactor = L;                                       // 0..1
      const co2Factor = Math.min(C / 0.10, 1);                     // 0..1 (saturates at 0.1%)
      const tempFactor = T < 5 ? 0
        : T > 50 ? 0
        : T < 30 ? (T - 5) / 25
        : T < 40 ? Math.max(0, 1 - (T - 30) * 0.04)
        : Math.max(0, 1 - (T - 30) * 0.1);

      // Which one is limiting?
      let limiter = 'light';
      let limit = lightFactor;
      if (co2Factor < limit) { limit = co2Factor; limiter = 'CO₂'; }
      if (tempFactor < limit) { limit = tempFactor; limiter = T < 15 ? 'cold' : T > 40 ? 'denatured enzymes' : 'temperature'; }

      const ratePerMin = Math.round(limit * 90);  // 0..90 bubbles/min
      bubbleRateRef.current = ratePerMin;

      // Emit bubbles at the correct rate
      const interval = ratePerMin > 0 ? 60000 / ratePerMin : Infinity;
      if (now - lastEmit > interval) {
        lastEmit = now;
        const leafIdx = Math.floor(Math.random() * leafPositions.length);
        const start = leafPositions[leafIdx];
        const b = bubblePool.find((b) => !b.userData.active);
        if (b) {
          b.userData.active = true;
          b.userData.t = 0;
          b.userData.x0 = start.x;
          b.userData.z0 = start.z;
          b.position.set(start.x, start.y, start.z);
          b.visible = true;
        }
      }

      // Animate active bubbles rising to the test tube
      bubblePool.forEach((b) => {
        if (!b.userData.active) return;
        b.userData.t += 0.012;
        const t = b.userData.t;
        // path from leaf → up through funnel → into test tube
        const startY = 0.05, endY = 0.235;
        const y = startY + t * (endY - startY);
        // Converge x,z to 0 by the time they reach the funnel neck
        const k = Math.min(1, t * 1.3);
        b.position.set(b.userData.x0 * (1 - k), y, b.userData.z0 * (1 - k));
        // Wobble
        b.position.x += Math.sin(t * 20 + b.userData.x0 * 100) * 0.001;
        if (t > 1) {
          b.userData.active = false;
          b.visible = false;
          gasVolume = Math.min(0.07, gasVolume + 0.001);
        }
      });

      // Update collected gas volume in test tube
      collectedGas.scale.y = 1 + gasVolume * 50;
      collectedGas.position.y = 0.235 - (gasVolume * 50 - 1) * 0.0005;

      // Update readout every ~10 frames
      if (frameCount % 12 === 0) {
        drawReadout(ratePerMin, limiter);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  return (
    <div className="my-6">
      <div className="text-[10px] uppercase mb-3 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.28em', color: '#c2185b' }}>
        Try it — change light, CO₂ or temperature
      </div>
      <div ref={mountRef}
        style={{
          width: '100%',
          aspectRatio: '16/10',
          backgroundColor: '#f5f1e3',
          border: '1px solid rgba(26,31,46,0.2)',
          overflow: 'hidden',
          cursor: 'grab',
        }} />
      <div className="text-[9px] uppercase opacity-50 text-right mt-1"
        style={{ fontFamily: mono, letterSpacing: '0.2em' }}>drag to rotate · readout shows bubbles per minute</div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <Slider label="Lamp brightness" value={`${(light * 100).toFixed(0)} %`}>
          <input type="range" min="0" max="1" step="0.01" value={light}
            onChange={(e) => setLight(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c2185b' }} />
          <div className="flex justify-between text-[9px] opacity-60 mt-0.5" style={{ fontFamily: mono }}>
            <span>far / dim</span><span>close / bright</span>
          </div>
        </Slider>
        <Slider label="CO₂ concentration" value={`${(co2 * 100).toFixed(2)} %`}>
          <input type="range" min="0.01" max="0.15" step="0.005" value={co2}
            onChange={(e) => setCo2(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c2185b' }} />
          <div className="flex justify-between text-[9px] opacity-60 mt-0.5" style={{ fontFamily: mono }}>
            <span>atmospheric (0.04)</span><span>enriched (0.10+)</span>
          </div>
        </Slider>
        <Slider label="Temperature" value={`${temp} °C`}>
          <input type="range" min="5" max="50" step="1" value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c2185b' }} />
          <div className="flex justify-between text-[9px] opacity-60 mt-0.5" style={{ fontFamily: mono }}>
            <span>cold</span><span>optimum (30)</span><span>denatured</span>
          </div>
        </Slider>
      </div>
    </div>
  );
}

function Slider({ label, value, children }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase opacity-75" style={{ fontFamily: mono, letterSpacing: '0.2em' }}>{label}</span>
        <span className="text-[10px] uppercase font-bold" style={{ fontFamily: mono, letterSpacing: '0.2em', color: '#c2185b' }}>{value}</span>
      </div>
      {children}
    </label>
  );
}
