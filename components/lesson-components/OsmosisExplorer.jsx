'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createScene, attachOrbitDrag, makeBench, makeBeaker,
} from '@/components/three/SceneKit';

const mono = '"IBM Plex Mono", monospace';
const serif = '"Fraunces", Georgia, serif';

/**
 * 3D mini-lab: one magnified plant cell inside a beaker.
 * The learner drags the outside-solute slider; the cell visibly swells
 * (turgid in pure water), holds steady (isotonic), or shrinks with the
 * cytoplasm pulling away from the wall (plasmolysis).
 * Animated water molecules flow IN when outside is dilute, OUT when concentrated.
 */
export default function OsmosisExplorer() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [solute, setSolute] = useState(0.5);  // 0 = pure water, 1 = very concentrated
  const soluteRef = useRef(0.5);

  useEffect(() => { soluteRef.current = solute; }, [solute]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.35, y: 0.36, z: 0.55, lookY: 0.13 },
    });
    scene.add(makeBench({ width: 1.2, depth: 0.5 }));

    // ── Beaker with sucrose solution ───────────────────────────────────
    const beaker = makeBeaker({ radius: 0.12, height: 0.22 });
    beaker.position.set(0, 0, 0);
    scene.add(beaker);
    let fluidColor = new THREE.Color(0xa7d4ec);
    beaker.userData.setFill(0.88, fluidColor.getHex(), 0.55);

    // Helper to recolour fluid as solute concentration changes
    const setFluid = (s) => {
      // light blue (dilute) → caramel (concentrated)
      const c = new THREE.Color().lerpColors(
        new THREE.Color(0xb8dcf2), new THREE.Color(0xc8a058), s
      );
      beaker.userData.setFill(0.88, c.getHex(), 0.55 + s * 0.15);
    };

    // ── Magnified plant cell, suspended in the centre of the fluid ─────
    const CELL = 0.085;        // overall size — the rigid wall
    const cellGroup = new THREE.Group();
    cellGroup.position.set(0, 0.11, 0);
    scene.add(cellGroup);

    // Cell wall (rigid, doesn''t scale)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32, transparent: true, opacity: 0.92,
      roughness: 0.6, metalness: 0.05,
    });
    const wallEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(CELL, CELL, CELL)),
      new THREE.LineBasicMaterial({ color: 0x2e7d32, linewidth: 2 })
    );
    cellGroup.add(wallEdges);
    // Translucent green wall faces
    const wallFaces = new THREE.Mesh(
      new THREE.BoxGeometry(CELL, CELL, CELL),
      new THREE.MeshPhysicalMaterial({
        color: 0x86c191, transparent: true, opacity: 0.18,
        transmission: 0.55, roughness: 0.4, side: THREE.DoubleSide,
      })
    );
    cellGroup.add(wallFaces);

    // Cell membrane + cytoplasm (the bit that shrinks/swells)
    const cytoplasm = new THREE.Mesh(
      new THREE.BoxGeometry(CELL * 0.92, CELL * 0.92, CELL * 0.92),
      new THREE.MeshPhysicalMaterial({
        color: 0xeac4d2, transparent: true, opacity: 0.55,
        transmission: 0.3, roughness: 0.3, side: THREE.DoubleSide,
      })
    );
    cellGroup.add(cytoplasm);

    // Central vacuole (pink-tinged sphere)
    const vacuole = new THREE.Mesh(
      new THREE.SphereGeometry(CELL * 0.35, 24, 18),
      new THREE.MeshPhysicalMaterial({
        color: 0xc2185b, transparent: true, opacity: 0.45,
        transmission: 0.5, roughness: 0.25,
      })
    );
    cellGroup.add(vacuole);

    // Nucleus (small dark sphere off-centre)
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(CELL * 0.12, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.5 })
    );
    nucleus.position.set(CELL * 0.25, CELL * 0.15, CELL * 0.18);
    cellGroup.add(nucleus);

    // ── Status label sprite floating above the cell ────────────────────
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 480; labelCanvas.height = 80;
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true }));
    labelSprite.scale.set(0.24, 0.04, 1);
    labelSprite.position.set(0, 0.27, 0);
    scene.add(labelSprite);
    const drawLabel = (text, bg) => {
      const ctx = labelCanvas.getContext('2d');
      ctx.clearRect(0, 0, 480, 80);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 480, 80);
      ctx.strokeStyle = '#1a1f2e'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 476, 76);
      ctx.fillStyle = '#fefcf3';
      ctx.font = "bold 26px 'IBM Plex Mono', monospace";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, 240, 40);
      labelTex.needsUpdate = true;
    };

    // ── Water molecule pool (rendered as small blue spheres) ───────────
    const moleculeMat = new THREE.MeshStandardMaterial({
      color: 0x4287f5, transparent: true, opacity: 0.85, roughness: 0.2,
    });
    const moleculeGeom = new THREE.SphereGeometry(0.0035, 8, 8);
    const molecules = [];
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(moleculeGeom, moleculeMat);
      m.userData = {
        angle: (i / 18) * Math.PI * 2,
        elev: -0.4 + Math.random() * 0.8,
        phase: Math.random(),
      };
      m.visible = false;
      cellGroup.add(m);
      molecules.push(m);
    }

    sceneRef.current = { scene, camera, renderer, dispose };
    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.13 });

    let raf;
    let prevLabelState = null;
    const animate = () => {
      const s = soluteRef.current;
      const inside = 0.5;
      const diff = s - inside;   // + → water leaves cell → shrink
      // Target scale: 0.55 (very plasmolysed) to 1.1 (turgid)
      const targetScale = Math.max(0.55, Math.min(1.1, 1 - diff * 0.7));
      cytoplasm.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      vacuole.scale.copy(cytoplasm.scale);
      nucleus.position.set(CELL * 0.25 * cytoplasm.scale.x, CELL * 0.15 * cytoplasm.scale.x, CELL * 0.18 * cytoplasm.scale.x);

      setFluid(s);

      // Water molecule motion — flow inward (diff < 0) or outward (diff > 0)
      const flowMag = Math.abs(diff);
      const flowing = flowMag > 0.04;
      molecules.forEach((m) => {
        m.visible = flowing;
        if (!flowing) return;
        m.userData.phase += 0.012 * (0.5 + flowMag * 1.5);
        if (m.userData.phase > 1) m.userData.phase = 0;
        const p = m.userData.phase;
        // Outward when diff > 0 (going from inside to outside): radius grows
        // Inward when diff < 0: radius shrinks from outer to membrane
        const r = diff > 0
          ? CELL * 0.5 + p * CELL * 1.0
          : CELL * 1.5 - p * CELL * 1.0;
        m.position.set(
          Math.cos(m.userData.angle) * r,
          m.userData.elev * CELL * 0.3,
          Math.sin(m.userData.angle) * r
        );
        m.material.opacity = 0.85 * Math.sin(p * Math.PI);
      });

      // Status label
      let labelState;
      if (s < 0.35) labelState = 'HYPO';
      else if (s > 0.65) labelState = 'HYPER';
      else labelState = 'ISO';
      if (labelState !== prevLabelState) {
        if (labelState === 'HYPO') drawLabel('HYPOTONIC · cell is TURGID', '#2e7d32');
        else if (labelState === 'HYPER') drawLabel('HYPERTONIC · PLASMOLYSED', '#c2185b');
        else drawLabel('ISOTONIC · cell is flaccid', '#1a1f2e');
        prevLabelState = labelState;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    drawLabel('ISOTONIC · cell is flaccid', '#1a1f2e');
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  const stateBg = solute < 0.35 ? '#2e7d32' : solute > 0.65 ? '#c2185b' : '#1a1f2e';

  return (
    <div className="my-6">
      <div className="text-[10px] uppercase mb-3 opacity-65"
        style={{ fontFamily: mono, letterSpacing: '0.28em', color: '#c2185b' }}>
        Try it — change the solution outside the cell
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
        style={{ fontFamily: mono, letterSpacing: '0.2em' }}>drag to rotate the apparatus</div>

      <label className="block mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
            outside solute concentration
          </span>
          <span className="text-[11px] uppercase font-bold px-2 py-0.5"
            style={{ fontFamily: mono, letterSpacing: '0.2em', backgroundColor: stateBg, color: '#fefcf3' }}>
            {(solute * 100).toFixed(0)} %
          </span>
        </div>
        <input type="range" min="0" max="1" step="0.01" value={solute}
          onChange={(e) => setSolute(Number(e.target.value))}
          style={{ width: '100%', accentColor: stateBg }} />
        <div className="flex justify-between text-[9px] opacity-60 mt-0.5" style={{ fontFamily: mono }}>
          <span>0 % — pure water</span>
          <span>50 % — same as inside</span>
          <span>100 % — saturated</span>
        </div>
      </label>
    </div>
  );
}
