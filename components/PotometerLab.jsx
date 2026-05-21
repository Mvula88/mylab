"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, Wind, Sun, CloudRain, Thermometer, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const CONDITIONS = [
  { id: "control", label: "Still air · 22 °C", rate: 8,  icon: null,       explain: "Baseline" },
  { id: "wind",    label: "Fan on (wind)",     rate: 22, icon: Wind,       explain: "Wind removes saturated humid layer near stomata, increasing the concentration gradient" },
  { id: "light",   label: "Bright light",      rate: 16, icon: Sun,        explain: "Stomata open more widely for photosynthesis → more water vapour escapes" },
  { id: "humid",   label: "Polythene bag",     rate: 3,  icon: CloudRain,  explain: "Air near leaves becomes saturated; concentration gradient outwards reduced" },
  { id: "hot",     label: "Heated to 30 °C",   rate: 14, icon: Thermometer, explain: "Higher KE of water molecules and saturation pressure → faster transpiration" },
];
const RUN_MIN = 5;
const REAL_DURATION = 5;

const QUIZ = [
  { q: "Which condition gave the fastest rate?", options: ["Bright light", "Wind (fan)", "Polythene bag", "30 °C heat"], correct: 1 },
  { q: "Why does WIND increase transpiration rate?",
    options: ["Wind cools the leaf", "Wind blows away the humid air around stomata, restoring a steep concentration gradient for water vapour", "Opens stomata", "Increases atmospheric pressure"], correct: 1 },
  { q: "Why does a POLYTHENE BAG DECREASE the rate?",
    options: ["Blocks light", "Trapped air saturates with water vapour, reducing the concentration gradient", "Heats leaves", "Closes stomata physically"], correct: 1 },
  { q: "The bubble moves AWAY from the cut shoot. What does this indicate?",
    options: ["Water moves shoot → reservoir", "Water is being drawn UP through the shoot to replace water lost from the leaves", "Capillary is blocked", "Air is leaking in"], correct: 1 },
];

export default function PotometerLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [condId, setCondId] = useState(CONDITIONS[0].id);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const condRef = useRef(CONDITIONS[0]);
  const timeRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.0, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Leafy shoot (stem with leaves)
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: 0x4a7233, roughness: 0.8 })
    );
    stem.position.set(-0.35, 0.25, 0);
    scene.add(stem);
    // leaves
    const leafShape = new THREE.Shape();
    leafShape.moveTo(-0.04, 0);
    leafShape.quadraticCurveTo(0, 0.025, 0.04, 0);
    leafShape.quadraticCurveTo(0, -0.025, -0.04, 0);
    const leafGeom = new THREE.ShapeGeometry(leafShape, 16);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x5a8c3b, roughness: 0.8, side: THREE.DoubleSide });
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.set(-0.35 + (i % 2 === 0 ? -0.045 : 0.045), 0.15 + i * 0.05, 0);
      leaf.rotation.set(-Math.PI / 2, 0, (i % 2 === 0 ? 1 : -1) * 0.4);
      scene.add(leaf);
    }

    // Potometer body (water reservoir below shoot)
    const reservoir = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.05),
      glassMaterial()
    );
    reservoir.position.set(-0.35, 0.07, 0);
    scene.add(reservoir);
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.05, 0.045),
      liquidMaterial(0xa7d4ec, 0.55)
    );
    water.position.set(-0.35, 0.065, 0);
    scene.add(water);

    // Capillary tube (horizontal, going right)
    const capillaryLen = 0.65;
    const capillary = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, capillaryLen, 12),
      glassMaterial({ opacity: 0.4 })
    );
    capillary.rotation.z = Math.PI / 2;
    capillary.position.set(-0.35 + capillaryLen / 2 + 0.03, 0.07, 0);
    scene.add(capillary);
    // capillary water (initially full)
    const capWaterMat = liquidMaterial(0xa7d4ec, 0.7);
    const capWater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, capillaryLen, 12),
      capWaterMat
    );
    capWater.rotation.z = Math.PI / 2;
    capWater.position.set(-0.35 + capillaryLen / 2 + 0.03, 0.07, 0);
    scene.add(capWater);
    // air bubble (a small section)
    const bubble = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0032, 0.0032, 0.015, 12),
      new THREE.MeshStandardMaterial({ color: 0xfefcf3, transparent: true, opacity: 0.7 })
    );
    bubble.rotation.z = Math.PI / 2;
    scene.add(bubble);

    // Reservoir at far right
    const farRes = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.05, 0.05),
      glassMaterial()
    );
    farRes.position.set(-0.35 + capillaryLen + 0.055, 0.065, 0);
    scene.add(farRes);

    // Wind arrows (sprites — visible when 'wind')
    const arrowSprites = [];
    for (let i = 0; i < 3; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 128; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(20, 32); ctx.lineTo(100, 32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(100, 32); ctx.lineTo(85, 18); ctx.moveTo(100, 32); ctx.lineTo(85, 46); ctx.stroke();
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.08, 0.04, 1);
      sprite.position.set(-0.55, 0.2 + i * 0.05, 0);
      sprite.visible = false;
      scene.add(sprite);
      arrowSprites.push(sprite);
    }

    // Sun sprite (for 'light')
    const sunCanvas = document.createElement("canvas");
    sunCanvas.width = 128; sunCanvas.height = 128;
    const sunCtx = sunCanvas.getContext("2d");
    sunCtx.fillStyle = "#f7c948";
    sunCtx.beginPath(); sunCtx.arc(64, 64, 30, 0, Math.PI * 2); sunCtx.fill();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      sunCtx.strokeStyle = "#f7c948"; sunCtx.lineWidth = 4;
      sunCtx.beginPath();
      sunCtx.moveTo(64 + Math.cos(a) * 36, 64 + Math.sin(a) * 36);
      sunCtx.lineTo(64 + Math.cos(a) * 50, 64 + Math.sin(a) * 50);
      sunCtx.stroke();
    }
    const sunTex = new THREE.CanvasTexture(sunCanvas);
    sunTex.colorSpace = THREE.SRGBColorSpace;
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true }));
    sun.scale.set(0.12, 0.12, 1);
    sun.position.set(-0.4, 0.5, 0);
    sun.visible = false;
    scene.add(sun);

    sceneRef.current = { scene, camera, renderer, dispose, bubble, capillaryLen, arrowSprites, sun };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf;
    const animate = () => {
      const cond = condRef.current;
      const distance = cond.rate * timeRef.current;
      // bubble starts at right (full water) and moves left toward shoot
      const px = -0.35 + 0.03 + Math.max(0.01, capillaryLen - Math.min(capillaryLen - 0.02, distance * 0.0013));
      bubble.position.set(px, 0.07, 0);

      // Wind arrows
      sceneRef.current.arrowSprites.forEach((a) => a.visible = cond.id === "wind");
      sceneRef.current.sun.visible = cond.id === "light";

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { condRef.current = CONDITIONS.find((c) => c.id === condId); }, [condId]);
  useEffect(() => {
    runRef.current = running;
    if (!running) return;
    const start = performance.now();
    const t0 = timeRef.current;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const newT = Math.min(RUN_MIN, t0 + (elapsed / REAL_DURATION) * RUN_MIN);
      timeRef.current = newT;
      setTime(newT);
      if (newT >= RUN_MIN) {
        setRunning(false);
        const cond = condRef.current;
        setResults((r) => ({ ...r, [cond.id]: cond.rate * RUN_MIN }));
        return;
      }
      if (runRef.current) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [running]);

  const cond = CONDITIONS.find((c) => c.id === condId);
  const distance = cond.rate * time;
  const start = () => setRunning(true);
  const reset = () => { setRunning(false); setTime(0); timeRef.current = 0; };
  const switchCond = (id) => { setRunning(false); setCondId(id); setTime(0); timeRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Plant transport · Potometer">
      <Header
        title="Measuring transpiration rate with a"
        accent="potometer"
        blurb="A leafy shoot is sealed into a water-filled capillary tube with an air bubble. As the leaves lose water by transpiration, the bubble moves along the capillary. Distance ÷ time = rate of water uptake — a good proxy for transpiration rate."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-4">
            {CONDITIONS.map((c) => {
              const active = c.id === condId;
              const done = !!results[c.id];
              const Icon = c.icon;
              return (
                <button key={c.id} onClick={() => switchCond(c.id)}
                  className="relative p-2 transition active:scale-95"
                  style={{
                    backgroundColor: active ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                    border: `1px solid ${active ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                    color: active ? "#e8e4d8" : "#1a1f2e",
                  }}>
                  {Icon && <Icon size={14} className="mb-1" />}
                  <div className="text-[10px] leading-tight">{c.label}</div>
                  {done && (
                    <div className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ backgroundColor: "#2e7d32" }}>
                      <CheckCircle2 size={11} color="#e8e4d8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {!running && !results[condId] && <PrimaryButton onClick={start} icon={Play}>Start 5-min run</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {time.toFixed(2)} min · d = {distance.toFixed(0)} mm</div>
          </div>
          <div className="text-xs opacity-75 leading-snug">
            <span className="opacity-65" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>WHY:</span> {cond.explain}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Results (5-min run)">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">Condition</th>
                  <th className="text-right py-1.5 opacity-65">d (mm)</th>
                  <th className="text-right py-1.5 opacity-65">rate (mm/min)</th>
                </tr>
              </thead>
              <tbody>
                {CONDITIONS.map((c) => {
                  const d = results[c.id];
                  return (
                    <tr key={c.id} className="border-b border-stone-900/8">
                      <td className="py-1.5">{c.label.split("·")[0]}</td>
                      <td className="text-right py-1.5">{d ? d.toFixed(0) : "—"}</td>
                      <td className="text-right py-1.5">{d ? (d / RUN_MIN).toFixed(1) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
