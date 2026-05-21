"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBeaker, liquidMaterial } from "./three/SceneKit";

const TUBES = [
  { c: 0.05, time: 90 },
  { c: 0.10, time: 45 },
  { c: 0.15, time: 30 },
  { c: 0.20, time: 22 },
  { c: 0.25, time: 18 },
];

const SIM_MAX = 100;
const REAL_DURATION = 6500;

const QUIZ = [
  { q: "What causes the solution to become cloudy?",
    options: ["Sodium chloride precipitates", "Solid SULFUR (S) is formed as a fine suspension — Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + S↓ + H₂O", "Hydrogen gas bubbles", "Cold water vapour"], correct: 1 },
  { q: "How is the RATE of reaction estimated in this experiment?",
    options: ["Mass of sulfur weighed", "Volume of gas collected", "1 / time taken for the cross to disappear", "Change in temperature"], correct: 2 },
  { q: "If a plot of 1/time vs [Na₂S₂O₃] gives a STRAIGHT LINE through the origin, what does that tell you?",
    options: ["The reaction is independent of [thiosulfate]", "The reaction is FIRST ORDER in [thiosulfate]", "Temperature is not constant", "There is a catalyst present"], correct: 1 },
  { q: "Why MUST every run use the same paper cross, same beaker depth, same viewer, and same room temperature?",
    options: ["To avoid spillage", "End-point detection is subjective — keeping everything else identical means only [thiosulfate] is changing", "Because the law requires it", "To save reagents"], correct: 1 },
];

export default function ThiosulfateRateLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const tRef = useRef(0);
  const runRef = useRef(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.6, z: 1.4, lookY: 0.1 },
    });
    scene.add(makeBench({ width: 2.4, depth: 0.7 }));

    const items = TUBES.map((tube, i) => {
      const grp = new THREE.Group();
      grp.position.set((i - 2) * 0.34, 0, 0);

      // paper cross on bench
      const paper = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xfefcf3, roughness: 0.95 })
      );
      paper.rotation.x = -Math.PI / 2;
      paper.position.y = 0.001;
      grp.add(paper);
      // cross lines (two thin black strips)
      const crossMat = new THREE.MeshStandardMaterial({ color: 0x1a1f2e });
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.002, 0.008), crossMat);
      crossH.position.y = 0.002;
      grp.add(crossH);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.002, 0.08), crossMat);
      crossV.position.y = 0.002;
      grp.add(crossV);

      // beaker (tallish)
      const beaker = makeBeaker({ radius: 0.05, height: 0.12 });
      beaker.position.y = 0.0;
      grp.add(beaker);
      beaker.userData.setFill(0.85, 0xfefcf3, 0.35);

      // label sprite
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e";
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 24px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${tube.c.toFixed(2)} M`, 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.18, 0.045, 1);
      sprite.position.set(0, 0.15, 0);
      grp.add(sprite);

      scene.add(grp);
      return { grp, beaker, paper, crossH, crossV, tube };
    });

    sceneRef.current = { scene, camera, renderer, items, dispose };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.1 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (runRef.current) tRef.current = Math.min(SIM_MAX, tRef.current + dt * (SIM_MAX / (REAL_DURATION / 1000)));

      items.forEach((it) => {
        const cloud = Math.min(1, tRef.current / it.tube.time);
        // Fill becomes more opaque/cloudy
        const col = lerpHex(0xfefcf3, 0xeae4d0, cloud);
        it.beaker.userData.setFill(0.85, col, 0.35 + cloud * 0.6);
        // Cross visibility
        const crossOpacity = Math.max(0, 1 - cloud * 1.6);
        it.crossH.material.opacity = crossOpacity;
        it.crossH.material.transparent = true;
        it.crossV.material.opacity = crossOpacity;
        it.crossV.material.transparent = true;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    runRef.current = running;
    if (running) {
      const id = setInterval(() => {
        if (tRef.current >= SIM_MAX) { clearInterval(id); setRunning(false); }
        setT(tRef.current);
      }, 80);
      return () => clearInterval(id);
    }
  }, [running]);

  useEffect(() => {
    // Record times as tubes complete
    setResults((prev) => {
      const next = { ...prev };
      TUBES.forEach((tube, i) => {
        if (!next[i] && tube.time <= t) next[i] = tube.time;
      });
      return next;
    });
  }, [t]);

  const start = () => setRunning(true);
  const reset = () => { tRef.current = 0; setT(0); setRunning(false); setResults({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = TUBES.map((tube, i) => [
    `${tube.c.toFixed(2)} M`,
    results[i] ? results[i].toString() : (t > 0 ? "running…" : "—"),
    results[i] ? (1000 / results[i]).toFixed(1) : "—",
  ]);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Rates · Turbidity method">
      <Header
        title="Rate of reaction —"
        accent="Na₂S₂O₃ + HCl"
        blurb="A paper cross is drawn on white card and a beaker of sodium thiosulfate solution is placed on top. Hydrochloric acid is added; sulfur precipitates and the solution slowly turns cloudy. Time how long it takes for the cross to disappear from view. Repeat at five different [Na₂S₂O₃]."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2">
            {!running && t < SIM_MAX && <PrimaryButton onClick={start} icon={Play}>{t === 0 ? "Add HCl to all" : "Resume"}</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {t.toFixed(0)} s</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["[Na₂S₂O₃]", "t (s)", "rate × 1000 (s⁻¹)"]} rows={rows} />
          <div className="mt-4">
            <Card label="Rate vs [Na₂S₂O₃]">
              <RatePlot results={results} />
              {Object.keys(results).length === TUBES.length && (
                <div className="text-xs opacity-80 mt-2 leading-snug">
                  The straight line through the origin shows the reaction is <strong>first order</strong> in [Na₂S₂O₃].
                </div>
              )}
            </Card>
          </div>
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function RatePlot({ results }) {
  const W = 280, H = 150;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const xMin = 0, xMax = 0.3;
  const yMax = 60;
  const xPx = (x) => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
  const yPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const points = TUBES.map((tube, i) => ({ x: tube.c, y: results[i] ? (1000 / results[i]) : 0 }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {[0, 0.1, 0.2, 0.3].map((x) => (
        <text key={x} x={xPx(x)} y={H - padB + 14} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">{x}</text>
      ))}
      {points.map((p, i) => p.y > 0 ? (
        <circle key={i} cx={xPx(p.x)} cy={yPx(p.y)} r="3" fill="#c2185b" />
      ) : null)}
      <polyline
        points={points.filter((p) => p.y > 0).map((p) => `${xPx(p.x)},${yPx(p.y)}`).join(" ")}
        fill="none" stroke="#c2185b" strokeWidth="1.5" opacity="0.65"
      />
      <text x={W / 2} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">[Na₂S₂O₃] (M)</text>
      <text x={padL - 6} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">rate</text>
    </svg>
  );
}

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
