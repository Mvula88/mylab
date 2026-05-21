"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const TUBES = [
  { id: 3,  label: "pH 3",  time: 540, colour: 0xd63b3b },
  { id: 5,  label: "pH 5",  time: 120, colour: 0xe08043 },
  { id: 7,  label: "pH 7",  time: 50,  colour: 0xe3d245 },
  { id: 9,  label: "pH 9",  time: 220, colour: 0x5da25b },
  { id: 11, label: "pH 11", time: 480, colour: 0x3b6da3 },
];
const SIM_DURATION_S = 600;
const REAL_DURATION_S = 12;

const QUIZ = [
  { q: "At which pH was the rate highest?", options: ["pH 3", "pH 5", "pH 7", "pH 11"], correct: 2 },
  { q: "Why is amylase still ACTIVE — just slower — at pH 5 and pH 9, but barely active at pH 3 and pH 11?",
    options: ["Slight deviations from optimum reduce activity; extreme pH denatures the enzyme so substrate can no longer bind", "Iodine reacts with H⁺", "Starch dissolves better at neutral pH", "Amylase only works in stomach"], correct: 0 },
  { q: "Why keep temperature constant?",
    options: ["No effect", "So only ONE variable (pH) is changed at a time", "Amylase only works at 35°C", "Prevent iodine evaporating"], correct: 1 },
  { q: "Salivary amylase optimum is pH 7; pepsin optimum is pH 2. Why?",
    options: ["Pepsin is older", "Each enzyme has an active-site shape stable at the pH of its body region", "Pepsin has more atoms", "Random chance"], correct: 1 },
];

export default function EnzymePhLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.55, z: 1.3, lookY: 0.1 },
    });
    scene.add(makeBench({ width: 2.2, depth: 0.7 }));

    const items = TUBES.map((tube, i) => {
      const grp = new THREE.Group();
      grp.position.set((i - 2) * 0.32, 0, 0);
      // buffer tag (coloured plate above tube)
      const tag = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.02, 0.005),
        new THREE.MeshStandardMaterial({ color: tube.colour, roughness: 0.6 })
      );
      tag.position.y = 0.21;
      grp.add(tag);
      // tube
      const tubeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.18, 24),
        glassMaterial({ opacity: 0.4 })
      );
      tubeBody.position.y = 0.105;
      grp.add(tubeBody);
      // contents
      const tubeMat = liquidMaterial(0x1a2548, 0.85);
      const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 24), tubeMat);
      fluid.position.y = 0.105;
      grp.add(fluid);
      // label sprite
      const canvas = document.createElement("canvas");
      canvas.width = 192; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 192, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tube.label, 96, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.1, 0.03, 1);
      sprite.position.set(0, 0.265, 0);
      grp.add(sprite);
      scene.add(grp);
      return { grp, tubeMat, tube };
    });

    sceneRef.current = { scene, camera, renderer, dispose, items };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.1 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(SIM_DURATION_S, tRef.current + dt * (SIM_DURATION_S / REAL_DURATION_S));

      items.forEach((it) => {
        const frac = Math.min(1, tRef.current / it.tube.time);
        const colour = lerpHex(0x1a2548, 0xc9871f, frac);
        it.tubeMat.color.setHex(colour);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    runRef.current = running;
    if (!running) return;
    const id = setInterval(() => {
      setTime(tRef.current);
      setResults((prev) => {
        const next = { ...prev };
        TUBES.forEach((t) => { if (!next[t.id] && t.time <= tRef.current) next[t.id] = t.time; });
        return next;
      });
      if (tRef.current >= SIM_DURATION_S) { clearInterval(id); setRunning(false); }
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const reset = () => { setRunning(false); tRef.current = 0; setTime(0); setResults({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Enzymes · Effect of pH">
      <Header
        title="Effect of"
        accent="pH on amylase"
        blurb="Five tubes, each buffered to a different pH (3, 5, 7, 9, 11), all held at 35 °C. Equal amylase and starch. Sample every 30 s and test with iodine on a white tile. Time to clear → rate of digestion."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && time < SIM_DURATION_S && <PrimaryButton onClick={start} icon={Play}>{time === 0 ? "Begin all 5 tubes" : "Resume"}</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(time)} s</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Results table">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">pH</th>
                  <th className="text-right py-1.5 opacity-65">t (s)</th>
                  <th className="text-right py-1.5 opacity-65">rate × 1000</th>
                </tr>
              </thead>
              <tbody>
                {TUBES.map((b) => {
                  const done = results[b.id];
                  const notFinished = b.time > SIM_DURATION_S && time >= SIM_DURATION_S;
                  return (
                    <tr key={b.id} className="border-b border-stone-900/8">
                      <td className="py-1.5">{b.label}</td>
                      <td className="text-right py-1.5">{done ? done.toFixed(0) : notFinished ? "≥ 600" : (time > 0 ? "running…" : "—")}</td>
                      <td className="text-right py-1.5">{done ? (1000 / done).toFixed(2) : "—"}</td>
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

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
