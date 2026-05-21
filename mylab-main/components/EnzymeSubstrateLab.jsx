"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Play, RotateCcw, Pause, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const TUBES = [
  { id: 1,  label: "1.0 %" },
  { id: 2,  label: "2.0 %" },
  { id: 4,  label: "4.0 %" },
  { id: 6,  label: "6.0 %" },
  { id: 8,  label: "8.0 %" },
  { id: 10, label: "10.0 %" },
];
const VMAX = 0.10, KM = 2;
const rateFor = (S) => VMAX * S / (KM + S);
const timeFor = (S) => 1 / rateFor(S);

const QUIZ = [
  { q: "At low substrate concentration, doubling [H₂O₂] approximately doubles the rate. Why?",
    options: ["Decomposes faster in dark", "Most active sites unoccupied — adding substrate gives more E-S complexes", "Dilute is more concentrated", "Rate independent"], correct: 1 },
  { q: "At high substrate concentration, rate plateaus. Limiting factor?",
    options: ["O₂ supply in room", "Number of enzyme active sites — all are occupied, further substrate can't increase rate", "Water in tube", "Filter paper thickness"], correct: 1 },
  { q: "Why use the SAME yeast volume in every tube?",
    options: ["Cost", "Control the amount of enzyme — only [substrate] varies", "Settle quickly", "Absorb foam"], correct: 1 },
  { q: "Why does the disc RISE faster in higher [H₂O₂]?",
    options: ["More buoyant", "More O₂ per second on the disc; bubbles attach and lift it sooner", "Yeast denser", "H₂O₂ pushes upward"], correct: 1 },
];

export default function EnzymeSubstrateLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [tubeId, setTubeId] = useState(TUBES[0].id);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tubeRef = useRef(TUBES[0]);
  const tRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 0.7, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.3, depth: 0.6 }));

    // Single big tube
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.3, 32, 1, true),
      glassMaterial({ opacity: 0.3 })
    );
    tube.position.y = 0.15;
    scene.add(tube);
    // H2O2
    const fluidMat = liquidMaterial(0xd6e9f3, 0.55);
    const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.28, 32), fluidMat);
    fluid.position.y = 0.15;
    scene.add(fluid);
    // disc
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.004, 24),
      new THREE.MeshStandardMaterial({ color: 0xf6f0d8, roughness: 0.85 })
    );
    disc.position.y = 0.04;
    scene.add(disc);

    // bubble pool
    const bubbleGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.003 + Math.random() * 0.002, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
      );
      b.userData = { t: -1, x: (Math.random() - 0.5) * 0.04 };
      b.visible = false;
      bubbleGroup.add(b);
    }
    scene.add(bubbleGroup);

    // label sprite
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256; labelCanvas.height = 64;
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true }));
    labelSprite.scale.set(0.15, 0.04, 1);
    labelSprite.position.set(0, 0.34, 0);
    scene.add(labelSprite);
    const drawLabel = (text) => {
      const ctx = labelCanvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 24px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
      labelTex.needsUpdate = true;
    };
    drawLabel(`H₂O₂ ${TUBES[0].label}`);

    sceneRef.current = { scene, camera, renderer, dispose, disc, bubbleGroup, drawLabel };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      const tube = tubeRef.current;
      const target = timeFor(tube.id);
      if (runRef.current) tRef.current = Math.min(target, tRef.current + dt * 5);

      const frac = Math.min(1, tRef.current / target);
      disc.position.y = 0.04 + frac * 0.22;
      // bubbles emit based on concentration
      const emitRate = Math.min(1, tube.id / 6) * 0.5;
      bubbleGroup.children.forEach((b) => {
        if (b.userData.t < 0 && Math.random() < emitRate * dt * 30) {
          b.userData.t = 0;
          b.userData.x = disc.position.x + (Math.random() - 0.5) * 0.04;
          b.position.set(b.userData.x, disc.position.y + 0.005, (Math.random() - 0.5) * 0.04);
          b.visible = true;
        }
        if (b.userData.t >= 0) {
          b.userData.t += dt * 1.2;
          b.position.y += dt * 0.12;
          b.material.opacity = 0.85 * (1 - b.userData.t);
          if (b.userData.t > 1) { b.userData.t = -1; b.visible = false; }
        }
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    tubeRef.current = TUBES.find((t) => t.id === tubeId);
    if (sceneRef.current.drawLabel) sceneRef.current.drawLabel(`H₂O₂ ${tubeRef.current.label}`);
    tRef.current = 0; setT(0);
  }, [tubeId]);

  useEffect(() => {
    runRef.current = running;
    if (!running) return;
    const id = setInterval(() => {
      setT(tRef.current);
      const tube = tubeRef.current;
      if (tRef.current >= timeFor(tube.id)) {
        clearInterval(id);
        setRunning(false);
        setResults((r) => ({ ...r, [tube.id]: timeFor(tube.id) }));
      }
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  const tube = TUBES.find((t) => t.id === tubeId);
  const target = timeFor(tube.id);
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); tRef.current = 0; setT(0); };
  const switchTube = (id) => { setRunning(false); setTubeId(id); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Enzymes · Substrate concentration">
      <Header
        title="Effect of"
        accent="[H₂O₂] on catalase activity"
        blurb="A filter-paper disc soaked in yeast suspension (catalase) is dropped into hydrogen peroxide. Oxygen bubbles form on the disc until it floats up. The time it takes to rise is a measure of how fast the reaction is going."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
            {TUBES.map((t) => {
              const active = t.id === tubeId;
              const done = !!results[t.id];
              return (
                <button key={t.id} onClick={() => switchTube(t.id)}
                  className="relative p-2 transition active:scale-95"
                  style={{
                    backgroundColor: active ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                    border: `1px solid ${active ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                    color: active ? "#e8e4d8" : "#1a1f2e",
                  }}>
                  <div className="text-[11px]">{t.label}</div>
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

          <div className="flex flex-wrap items-center gap-2">
            {!running && !results[tubeId] ? <PrimaryButton onClick={start} icon={Play}>{t === 0 ? "Drop disc" : "Resume"}</PrimaryButton>
              : running ? <SecondaryButton onClick={pause} icon={Pause}>Pause</SecondaryButton> : null}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset this tube</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {t.toFixed(1)} s</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Results table">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">[H₂O₂]</th>
                  <th className="text-right py-1.5 opacity-65">t (s)</th>
                  <th className="text-right py-1.5 opacity-65">rate (1/t)</th>
                </tr>
              </thead>
              <tbody>
                {TUBES.map((t) => {
                  const r = results[t.id];
                  return (
                    <tr key={t.id} className="border-b border-stone-900/8">
                      <td className="py-1.5">{t.label}</td>
                      <td className="text-right py-1.5">{r ? r.toFixed(1) : "—"}</td>
                      <td className="text-right py-1.5">{r ? (1 / r).toFixed(3) : "—"}</td>
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
