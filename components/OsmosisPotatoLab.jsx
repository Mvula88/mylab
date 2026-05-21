"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { RotateCcw, FastForward } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const CONCS = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
const START_MASS = 3.00;
const isotonic = 0.30;
const massChange = (C) => -27 * (C - isotonic);

const QUIZ = [
  { q: "At which sucrose concentration was the potato closest to starting mass?",
    options: ["0.0 M", "0.2 M", "0.4 M (close to 0.3 M)", "1.0 M"], correct: 2 },
  { q: "What does the crossing point on the graph tell you?",
    options: ["Water potential of the potato tissue equals that of the sucrose solution", "Sucrose digested", "Osmosis stopped", "No water in cylinder"], correct: 0 },
  { q: "Why BLOT the cylinders before reweighing?",
    options: ["Remove iodine", "Remove surface water so only the mass of the cylinder is measured", "Kill bacteria", "Make turgid"], correct: 1 },
  { q: "Why must all cylinders have the SAME starting mass and surface area?",
    options: ["Fit in beaker", "Only the test variable ([sucrose]) changes — surface area for osmosis is kept constant", "Fixed-mass food", "Save reagent"], correct: 1 },
];

export default function OsmosisPotatoLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [stage, setStage] = useState("setup");
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const progRef = useRef(0);
  const stageRef = useRef("setup");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.45, z: 1.05, lookY: 0.08 },
    });
    scene.add(makeBench({ width: 2.4, depth: 0.7 }));

    const items = CONCS.map((C, i) => {
      const grp = new THREE.Group();
      grp.position.set((i - 2.5) * 0.32, 0, 0);
      // beaker
      const beaker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.1, 32, 1, true),
        glassMaterial({ opacity: 0.3 })
      );
      beaker.position.y = 0.05;
      grp.add(beaker);
      // sucrose solution (darker with higher conc)
      const sucroseAlpha = 0.4 + C * 0.3;
      const fluid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.057, 0.057, 0.09, 32),
        liquidMaterial(lerpHex(0xa7d4ec, 0xc8a058, C), sucroseAlpha)
      );
      fluid.position.y = 0.05;
      grp.add(fluid);
      // potato cylinder (stays at fixed Y but scales with osmosis result)
      const potato = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0xf4d68b, roughness: 0.7 })
      );
      potato.position.y = 0.05;
      grp.add(potato);
      // label
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${C.toFixed(1)} M`, 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.13, 0.035, 1);
      sprite.position.set(0, 0.16, 0);
      grp.add(sprite);
      scene.add(grp);
      return { grp, potato, C };
    });

    sceneRef.current = { scene, camera, renderer, dispose, items };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.08 });

    let raf;
    const animate = () => {
      const p = progRef.current;
      items.forEach((it) => {
        const finalPct = massChange(it.C) * p;
        const scale = 1 + finalPct * 0.02;
        it.potato.scale.set(scale, scale, scale);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    stageRef.current = stage;
    if (stage !== "soaking") return;
    progRef.current = 0;
    const start = performance.now();
    const dur = 4500;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      progRef.current = k;
      setProgress(k);
      if (k < 1) requestAnimationFrame(tick);
      else setStage("done");
    };
    requestAnimationFrame(tick);
  }, [stage]);

  const start = () => setStage("soaking");
  const skip = () => { progRef.current = 1; setProgress(1); setStage("done"); };
  const reset = () => { setStage("setup"); setProgress(0); progRef.current = 0; };
  const rows = CONCS.map((C) => {
    const finalPct = massChange(C) * progress;
    const finalMass = START_MASS * (1 + finalPct / 100);
    return { C, finalPct, finalMass };
  });
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Osmosis · Plant tissue">
      <Header
        title="Osmosis with"
        accent="potato cylinders"
        blurb={`Six equal potato cylinders (${START_MASS.toFixed(2)} g each) are placed in sucrose solutions of different concentration. After 60 minutes they are blotted and re-weighed. The change in mass tells you which way water has moved by osmosis.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {stage === "setup" && (
              <button onClick={start}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                Place cylinders &amp; start timer
              </button>
            )}
            {stage === "soaking" && <SecondaryButton onClick={skip} icon={FastForward}>Skip to 60 min</SecondaryButton>}
            {stage === "done" && <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>}
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(progress * 60)} min / 60 min</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Results table">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">[sucrose]</th>
                  <th className="text-right py-1.5 opacity-65">m₀ (g)</th>
                  <th className="text-right py-1.5 opacity-65">m₁ (g)</th>
                  <th className="text-right py-1.5 opacity-65">% Δm</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.C} className="border-b border-stone-900/8">
                    <td className="py-1.5">{r.C.toFixed(1)} M</td>
                    <td className="text-right py-1.5">{START_MASS.toFixed(2)}</td>
                    <td className="text-right py-1.5">{r.finalMass.toFixed(2)}</td>
                    <td className="text-right py-1.5" style={{ color: r.finalPct > 0 ? "#2e7d32" : r.finalPct < 0 ? "#c2185b" : undefined }}>
                      {r.finalPct >= 0 ? "+" : ""}{r.finalPct.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stage === "done" && (
              <div className="text-xs mt-2 leading-snug opacity-80">
                Line crosses zero around <span style={{ color: "#c2185b", fontWeight: 600 }}>{isotonic.toFixed(2)} M</span> — water potential of potato cytoplasm.
              </div>
            )}
          </Card>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
