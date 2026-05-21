"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const BATHS = [
  { id: 5,  label: " 5 °C", time: 480 },
  { id: 20, label: "20 °C", time: 180 },
  { id: 35, label: "35 °C", time: 50  },
  { id: 50, label: "50 °C", time: 150 },
  { id: 65, label: "65 °C", time: 999 },
];
const SIM_DURATION_S = 600;
const REAL_DURATION_S = 12;

const QUIZ = [
  { q: "Which temperature gave the highest rate? Why?",
    options: ["5 °C", "35 °C — close to optimum, balance of KE and intact active site", "65 °C", "Rate independent of temperature"], correct: 1 },
  { q: "Why does rate FALL above ~40 °C?",
    options: ["Starch evaporates", "Iodine breaks down", "Enzyme active site is denatured", "Amylase reverses"], correct: 2 },
  { q: "Why is iodine sampling spot taken on a white tile?",
    options: ["Any colour change clearly visible against neutral background", "Iodine reacts with tile", "Keep enzyme cold", "Slow reaction"], correct: 0 },
  { q: "Why warm amylase before adding starch?",
    options: ["So temperature recorded is the temperature at which reaction takes place", "Denature amylase", "Cold amylase reacts with iodine", "Dissolve the starch"], correct: 0 },
];

export default function EnzymeTemperatureLab() {
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

    const items = BATHS.map((b, i) => {
      const grp = new THREE.Group();
      grp.position.set((i - 2) * 0.32, 0, 0);
      // water bath (beaker)
      const bath = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.12, 32, 1, true),
        glassMaterial({ opacity: 0.25 })
      );
      bath.position.y = 0.06;
      grp.add(bath);
      const bathWater = new THREE.Mesh(
        new THREE.CylinderGeometry(0.067, 0.067, 0.11, 32),
        liquidMaterial(0xa7d4ec, 0.4)
      );
      bathWater.position.y = 0.057;
      grp.add(bathWater);
      // test tube inside
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.16, 24),
        glassMaterial({ opacity: 0.4 })
      );
      tube.position.y = 0.1;
      grp.add(tube);
      // tube contents (changes colour)
      const tubeMat = liquidMaterial(0x1a2548, 0.85);
      const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 24), tubeMat);
      fluid.position.y = 0.1;
      grp.add(fluid);
      // label
      const canvas = document.createElement("canvas");
      canvas.width = 192; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 192, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b.label, 96, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.1, 0.03, 1);
      sprite.position.set(0, 0.215, 0);
      grp.add(sprite);
      scene.add(grp);
      return { grp, tubeMat, bath: b };
    });

    sceneRef.current = { scene, camera, renderer, dispose, items };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.1 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(SIM_DURATION_S, tRef.current + dt * (SIM_DURATION_S / REAL_DURATION_S));

      items.forEach((it) => {
        const frac = Math.min(1, tRef.current / it.bath.time);
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
        BATHS.forEach((b) => { if (!next[b.id] && b.time <= tRef.current) next[b.id] = b.time; });
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
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Enzymes · Effect of temperature">
      <Header
        title="Effect of"
        accent="temperature on amylase"
        blurb="Five water baths run in parallel: 5, 20, 35, 50 and 65 °C. Each test tube contains starch + amylase at the same concentration. Every 30 seconds, a drop is tested with iodine on a white tile. When the iodine spot stays orange-brown, all the starch has been digested."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && time < SIM_DURATION_S && <PrimaryButton onClick={start} icon={Play}>{time === 0 ? "Begin all 5 baths" : "Resume"}</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(time)} s</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Time-to-digest table">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">Temp</th>
                  <th className="text-right py-1.5 opacity-65">t (s)</th>
                  <th className="text-right py-1.5 opacity-65">rate × 1000</th>
                </tr>
              </thead>
              <tbody>
                {BATHS.map((b) => {
                  const done = results[b.id];
                  const notFinished = b.time > 600 && time >= 600;
                  return (
                    <tr key={b.id} className="border-b border-stone-900/8">
                      <td className="py-1.5">{b.label}</td>
                      <td className="text-right py-1.5">{done ? done.toFixed(0) : notFinished ? "—" : (time > 0 ? "running…" : "—")}</td>
                      <td className="text-right py-1.5">{done ? (1 / done * 1000).toFixed(2) : notFinished ? "≈ 0" : "—"}</td>
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
