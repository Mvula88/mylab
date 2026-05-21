"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench } from "./three/SceneKit";

const SURFACES = [
  { id: "smooth", name: "Polished wood",       mu: 0.18, texture: 0xeac98a },
  { id: "wood",   name: "Wood on wood",        mu: 0.30, texture: 0xa97a48 },
  { id: "rubber", name: "Rubber on wood",      mu: 0.65, texture: 0x402020 },
  { id: "sand",   name: "Wood on sandpaper",   mu: 0.50, texture: 0xc89a64 },
];

const QUIZ = [
  { q: "At the angle when the block just BEGINS to slide, what is the relationship between angle and coefficient of static friction?",
    options: ["μs = sin θ", "μs = tan θ  (at slipping, mg sin θ = μs · mg cos θ)", "μs = cos θ", "μs is independent of θ"], correct: 1 },
  { q: "Why is the coefficient of friction for RUBBER on wood the highest?",
    options: ["Rubber is heavier", "Many small irregularities + flexible contact + adhesive forces — rubber grips strongly", "Rubber is more elastic", "Wood has lower density"], correct: 1 },
  { q: "Once the block starts to slide, friction is generally:",
    options: ["Larger than static", "Smaller than static — kinetic friction is usually a little lower than the maximum static friction", "Exactly the same", "Zero"], correct: 1 },
  { q: "Which of these would NOT affect the slipping angle (same surfaces)?",
    options: ["Contact area or doubling the mass (both cancel out)", "Switching surfaces", "Heating the wood", "Adding lubricant"], correct: 0 },
];

export default function FrictionInclineLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [surfId, setSurfId] = useState(SURFACES[0].id);
  const [angle, setAngle] = useState(5);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const angleRef = useRef(5);
  const surfRef = useRef(SURFACES[0]);
  const blockProgRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 0.95, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.7 }));

    // Plank (pivots at left base)
    const plankLen = 0.6;
    const plank = new THREE.Group();
    const plankBase = new THREE.Mesh(
      new THREE.BoxGeometry(plankLen, 0.012, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x6a4a26, roughness: 0.8 })
    );
    plankBase.position.set(plankLen / 2, 0.006, 0);
    plank.add(plankBase);
    // surface texture overlay (colour swatch on top of plank)
    const surface = new THREE.Mesh(
      new THREE.BoxGeometry(plankLen, 0.002, 0.115),
      new THREE.MeshStandardMaterial({ color: 0xeac98a, roughness: 0.7 })
    );
    surface.position.set(plankLen / 2, 0.013, 0);
    plank.add(surface);
    // pivot point at origin
    plank.position.set(-0.3, 0, 0);
    scene.add(plank);

    // Block on plank (also pivots with plank because we'll do math)
    const block = new THREE.Group();
    const bWidth = 0.05, bHeight = 0.04, bDepth = 0.05;
    const blockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, bHeight, bDepth),
      new THREE.MeshStandardMaterial({ color: 0xaa6a44, roughness: 0.7 })
    );
    blockMesh.position.y = bHeight / 2 + 0.014;
    blockMesh.castShadow = true;
    block.add(blockMesh);
    scene.add(block);

    // Protractor arc (sprite)
    const arcCanvas = document.createElement("canvas");
    arcCanvas.width = 256; arcCanvas.height = 256;
    const arcSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(arcCanvas), transparent: true }));
    arcSprite.scale.set(0.2, 0.2, 1);
    arcSprite.position.set(-0.2, 0.12, 0.07);
    scene.add(arcSprite);
    arcSprite.userData = {
      tex: arcSprite.material.map,
      draw: (deg) => {
        const ctx = arcCanvas.getContext("2d");
        ctx.clearRect(0, 0, 256, 256);
        ctx.strokeStyle = "#c2185b"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(60, 200, 100, -Math.PI / 2, -Math.PI / 2 + (deg * Math.PI / 180)); ctx.stroke();
        ctx.fillStyle = "#1a1f2e";
        ctx.font = "bold 22px 'IBM Plex Mono', monospace";
        ctx.fillText(`θ = ${deg.toFixed(1)}°`, 70, 50);
        arcSprite.userData.tex.needsUpdate = true;
      },
    };

    sceneRef.current = { scene, camera, renderer, dispose, plank, block, blockMesh, surface, arcSprite };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = Math.min(0.05, ((now ?? performance.now()) - last) / 1000);
      last = now ?? performance.now();

      const a = angleRef.current;
      const sf = surfRef.current;
      const θ = a * Math.PI / 180;
      plank.rotation.z = θ;
      // Surface colour
      surface.material.color.setHex(sf.texture);

      // Determine slipping
      const slipAngleDeg = Math.atan(sf.mu) * 180 / Math.PI;
      const slipping = a > slipAngleDeg;
      if (slipping) {
        const aDownSlope = 9.8 * Math.sin(θ) - 9.8 * 0.9 * sf.mu * Math.cos(θ);
        blockProgRef.current = Math.min(1, blockProgRef.current + dt * dt * aDownSlope * 0.6);
      } else {
        blockProgRef.current = 0.4;
      }
      // Position block on plank
      const pos = (slipping ? 0.05 + blockProgRef.current * 0.5 : 0.3); // distance along plank
      const localX = pos;
      const localY = 0.014 + bHeight / 2;
      const worldX = -0.3 + localX * Math.cos(θ) - localY * Math.sin(θ);
      const worldY = localX * Math.sin(θ) + localY * Math.cos(θ);
      block.position.set(worldX, worldY, 0);
      block.rotation.z = θ;

      arcSprite.userData.draw(a);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { surfRef.current = SURFACES.find((s) => s.id === surfId); }, [surfId]);

  const surf = SURFACES.find((s) => s.id === surfId);
  const slipAngle = Math.atan(surf.mu) * (180 / Math.PI);
  const sliding = angle > slipAngle;

  const record = () => {
    if (!sliding || results[surfId] != null) return;
    setResults((r) => ({ ...r, [surfId]: angle }));
  };
  const switchSurf = (id) => { setSurfId(id); setAngle(5); blockProgRef.current = 0; };
  const reset = () => { setAngle(5); setResults({}); blockProgRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = SURFACES.map((s) => {
    const a = results[s.id];
    return [s.name, a != null ? a.toFixed(1) : "—", a != null ? Math.tan(a * Math.PI / 180).toFixed(2) : "—"];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Mechanics · Friction">
      <Header
        title="Friction on an"
        accent="inclined plane"
        blurb="Place a block on a tilted plank and slowly raise one end. At the angle where the block JUST begins to slide, the static-friction force has been overcome. Use μs = tan θ to find the coefficient of static friction for each pair of surfaces."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {SURFACES.map((s) => (
              <button key={s.id} onClick={() => switchSurf(s.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: s.id === surfId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${s.id === surfId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: s.id === surfId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-[11px] leading-tight">{s.name}</div>
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4"
            style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>angle θ</div>
              <input type="range" min="0" max="50" step="0.5" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full" />
              <div className="text-lg" style={{ fontFamily: mono }}>{angle.toFixed(1)}°{sliding && <span style={{ color: "#c2185b" }}> · sliding</span>}</div>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={record} disabled={!sliding || results[surfId] != null}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                Record slipping angle
              </button>
              <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["Surface", "θ (°)", "μs = tan θ"]} rows={rows} />
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
