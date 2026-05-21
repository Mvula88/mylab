"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeClampStand, glassMaterial, liquidMaterial } from "./three/SceneKit";

const V_SOUND = 343;
const FORKS = [
  { hz: 256, name: "256 Hz" },
  { hz: 384, name: "384 Hz" },
  { hz: 512, name: "512 Hz" },
];

const QUIZ = [
  { q: "At the FIRST resonance, what fraction of a wavelength is in the air column?",
    options: ["½ λ", "¼ λ — quarter wavelength (closed at water, open at top)", "λ", "¾ λ"], correct: 1 },
  { q: "Using L₁ and L₂, how do you calculate λ?",
    options: ["λ = L₁ + L₂", "λ = 2 × (L₂ − L₁)", "λ = L₂ ÷ L₁", "λ = 4 × L₁"], correct: 1 },
  { q: "Why use BOTH L₁ and L₂ rather than just L₁?",
    options: ["More reagents", "End-correction cancels out in (L₂ − L₁) — more accurate λ", "L₂ is louder", "Higher frequencies need both"], correct: 1 },
  { q: "If 384 Hz resonates at L₁ = 22.0 cm and L₂ = 67.0 cm, speed of sound?",
    options: ["≈ 345 m/s", "180", "768", "55"], correct: 0 },
];

export default function ResonanceTubeLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [forkIdx, setForkIdx] = useState(1);
  const [waterCm, setWaterCm] = useState(50);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const forkRef = useRef(FORKS[1]);
  const waterRef = useRef(50);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.45, y: 0.7, z: 1.2, lookY: 0.4 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.65 }));

    // Clamp stand
    const stand = makeClampStand({ rodHeight: 0.85 });
    stand.position.set(0.3, 0, -0.05);
    scene.add(stand);

    // Vertical tube
    const tubeR = 0.025, tubeH = 0.82;
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(tubeR, tubeR, tubeH, 32, 1, true),
      glassMaterial({ opacity: 0.3 })
    );
    tube.position.set(0, tubeH / 2 + 0.05, 0);
    scene.add(tube);

    // Water in tube (rises from bottom)
    const waterMat = liquidMaterial(0xa7d4ec, 0.7);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(tubeR - 0.001, tubeR - 0.001, 0.4, 32),
      waterMat
    );
    water.position.set(0, 0.05 + 0.2, 0);
    scene.add(water);

    // Tuning fork above tube
    const forkBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.015, 0.04, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 })
    );
    forkBase.position.set(0, 0.95, 0);
    scene.add(forkBase);
    const tine1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.008, 0.07, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x55585c, roughness: 0.5, metalness: 0.7 })
    );
    tine1.position.set(-0.014, 1.01, 0);
    scene.add(tine1);
    const tine2 = tine1.clone();
    tine2.position.x = 0.014;
    scene.add(tine2);

    // Loudness indicator sprite (top-left)
    const loudCanvas = document.createElement("canvas");
    loudCanvas.width = 256; loudCanvas.height = 96;
    const loudTex = new THREE.CanvasTexture(loudCanvas);
    loudTex.colorSpace = THREE.SRGBColorSpace;
    const loudSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: loudTex, transparent: true }));
    loudSprite.scale.set(0.2, 0.075, 1);
    loudSprite.position.set(-0.3, 0.95, 0);
    scene.add(loudSprite);

    sceneRef.current = { scene, camera, renderer, dispose, water, tubeH, tubeR, tine1, tine2, loudCanvas, loudTex, loudSprite };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.4 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      const fork = forkRef.current;
      const airColCm = waterRef.current;

      // Water level: tube top at y=tubeH+0.05=0.87, air column above water of length airColCm cm
      // Water height = 100 cm - airColCm
      const waterCmHeight = 100 - airColCm;
      const waterH = (waterCmHeight / 100) * tubeH;
      water.scale.y = waterH / 0.4;
      water.position.y = 0.05 + waterH / 2;

      // Calculate resonance
      const λ = V_SOUND / fork.hz;
      const L1cm = (λ / 4) * 100;
      const L2cm = (3 * λ / 4) * 100;
      const loudness1 = Math.exp(-Math.pow((airColCm - L1cm) / 2.5, 2));
      const loudness2 = airColCm > 0 && L2cm < 100 ? Math.exp(-Math.pow((airColCm - L2cm) / 2.5, 2)) : 0;
      const loud = Math.max(loudness1, loudness2);

      // tuning fork wobble
      const wobble = Math.sin(now / 30) * 0.001;
      tine1.position.x = -0.014 + wobble;
      tine2.position.x = 0.014 - wobble;

      // loudness indicator
      const ctx = sceneRef.current.loudCanvas.getContext("2d");
      ctx.clearRect(0, 0, 256, 96);
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 256, 96);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 14px 'IBM Plex Mono', monospace";
      ctx.fillText("LOUDNESS", 12, 24);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(12, 36, 232, 18);
      ctx.fillStyle = "#c2185b"; ctx.fillRect(12, 36, 232 * loud, 18);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText(`L₁ ≈ ${L1cm.toFixed(1)} cm  L₂ ≈ ${L2cm.toFixed(1)} cm`, 12, 76);
      sceneRef.current.loudTex.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { forkRef.current = FORKS[forkIdx]; }, [forkIdx]);
  useEffect(() => { waterRef.current = waterCm; }, [waterCm]);

  const fork = FORKS[forkIdx];
  const λ = V_SOUND / fork.hz;
  const L1cm = (λ / 4) * 100;
  const L2cm = (3 * λ / 4) * 100;
  const loudness1 = Math.exp(-Math.pow((waterCm - L1cm) / 2.5, 2));
  const loudness2 = waterCm > 0 && L2cm < 100 ? Math.exp(-Math.pow((waterCm - L2cm) / 2.5, 2)) : 0;
  const loud = Math.max(loudness1, loudness2);

  const recordFirst = () => {
    if (loudness1 < 0.9) return;
    setRecorded((r) => ({ ...r, [forkIdx]: { ...r[forkIdx], L1: waterCm } }));
  };
  const recordSecond = () => {
    if (loudness2 < 0.9) return;
    setRecorded((r) => ({ ...r, [forkIdx]: { ...r[forkIdx], L2: waterCm } }));
  };
  const reset = () => { setRecorded({}); setWaterCm(50); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = FORKS.map((f, i) => {
    const r = recorded[i];
    const L1 = r?.L1, L2 = r?.L2;
    let lam = "—", v = "—";
    if (L1 != null && L2 != null) {
      const lambdaM = 2 * (L2 - L1) / 100;
      lam = (lambdaM * 100).toFixed(1);
      v = (f.hz * lambdaM).toFixed(0);
    }
    return [f.name, L1 != null ? L1.toFixed(1) : "—", L2 != null ? L2.toFixed(1) : "—", lam, v];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Waves · Resonance">
      <Header
        title="Speed of sound by"
        accent="resonance tube"
        blurb="A vertical tube is partly filled with water; a vibrating tuning fork is held above the open top. The water level is adjusted until the column of air sings strongly — that is the first resonance position. The second resonance occurs three times deeper. From L₁ and L₂, the speed of sound can be calculated."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {FORKS.map((f, i) => (
              <button key={i} onClick={() => { setForkIdx(i); setWaterCm(20); }}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: i === forkIdx ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${i === forkIdx ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: i === forkIdx ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-sm" style={{ fontFamily: mono, fontWeight: 600 }}>{f.name}</div>
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "10/14", maxHeight: 580, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>air column length (drag water level)</div>
            <input type="range" min="5" max="95" step="0.5" value={waterCm} onChange={(e) => setWaterCm(parseFloat(e.target.value))} className="w-full" />
            <div className="text-sm" style={{ fontFamily: mono }}>L = {waterCm.toFixed(1)} cm  {loud > 0.9 && <span style={{ color: "#2e7d32" }}>· LOUD RESONANCE</span>}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={recordFirst} disabled={loudness1 < 0.9}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record L₁
            </button>
            <button onClick={recordSecond} disabled={loudness2 < 0.9}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record L₂
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results · v = fλ, λ = 2(L₂−L₁)"
            columns={["Fork", "L₁ (cm)", "L₂ (cm)", "λ (cm)", "v (m/s)"]}
            rows={rows} />
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
