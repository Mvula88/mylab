"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, FastForward } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial } from "./three/SceneKit";

const T_AMBIENT = 20.0;
const T_LIVE_MAX = 28.5;
const T_DEAD_MAX = 20.2;
const DURATION_H = 48;

const QUIZ = [
  { q: "Why are the dead/boiled seeds used as a control?",
    options: ["Test protein content", "Show that any temperature rise is caused by respiration in living seeds, not by something else", "Absorb CO₂", "Remove water vapour"], correct: 1 },
  { q: "Why rinse seeds in disinfectant first?",
    options: ["Start germination earlier", "Kill micro-organisms whose respiration would also produce heat (confound the result)", "Remove seed coat", "Soften seeds"], correct: 1 },
  { q: "Equation summarising the reaction:",
    options: ["6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O (+ ENERGY)", "2H₂O → 2H₂ + O₂", "N₂ + 3H₂ → 2NH₃"], correct: 1 },
  { q: "Why is the flask lined with cotton wool / inverted?",
    options: ["Stop rotting", "Trap warm air rising from seeds and reduce heat loss (insulation)", "Increase O₂ supply", "Weigh easily"], correct: 1 },
];

export default function GerminatingSeedsLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const hRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.55, z: 1.05, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    const makeFlask = (x, seedHex, label) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, 0);
      // dewar (insulated flask)
      const outer = new THREE.Mesh(
        new THREE.LatheGeometry([
          new THREE.Vector2(0.06, 0),
          new THREE.Vector2(0.075, 0.04),
          new THREE.Vector2(0.075, 0.25),
          new THREE.Vector2(0.07, 0.28),
          new THREE.Vector2(0.05, 0.3),
          new THREE.Vector2(0.05, 0.32),
        ], 28),
        new THREE.MeshStandardMaterial({ color: 0xddd5c1, roughness: 0.7 })
      );
      grp.add(outer);
      // cotton wool inside
      const cotton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.2, 24),
        new THREE.MeshStandardMaterial({ color: 0xf6f0d8, roughness: 0.95 })
      );
      cotton.position.y = 0.15;
      grp.add(cotton);
      // seeds (cluster of small spheres)
      for (let i = 0; i < 12; i++) {
        const seed = new THREE.Mesh(
          new THREE.SphereGeometry(0.008, 12, 8),
          new THREE.MeshStandardMaterial({ color: seedHex, roughness: 0.6 })
        );
        seed.position.set((Math.random() - 0.5) * 0.06, 0.1 + Math.random() * 0.1, (Math.random() - 0.5) * 0.06);
        grp.add(seed);
      }
      // thermometer poking out top
      const thMat = glassMaterial({ opacity: 0.55 });
      const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.18, 12), thMat);
      thermo.position.y = 0.34;
      grp.add(thermo);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
      bulb.position.y = 0.25;
      grp.add(bulb);
      const merc = new THREE.Mesh(new THREE.CylinderGeometry(0.0024, 0.0024, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
      merc.position.y = 0.27;
      grp.add(merc);
      // label sprite
      const canvas = document.createElement("canvas");
      canvas.width = 384; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 384, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, 192, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.28, 0.045, 1);
      sprite.position.set(0, -0.05, 0);
      grp.add(sprite);
      scene.add(grp);
      return { grp, merc };
    };
    const live = makeFlask(-0.2, 0x9bc36a, "LIVE GERMINATING SEEDS");
    const dead = makeFlask(0.2, 0x8a6a44, "DEAD (BOILED) — CONTROL");

    sceneRef.current = { scene, camera, renderer, dispose, live, dead };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) hRef.current = Math.min(DURATION_H, hRef.current + dt * (DURATION_H / 12));

      const tLive = T_AMBIENT + (T_LIVE_MAX - T_AMBIENT) * (1 - Math.exp(-hRef.current / 12));
      const tDead = T_AMBIENT + (T_DEAD_MAX - T_AMBIENT) * (1 - Math.exp(-hRef.current / 8));
      // mercury height
      const liveFrac = Math.max(0, Math.min(1, (tLive - 0) / 40));
      const deadFrac = Math.max(0, Math.min(1, (tDead - 0) / 40));
      live.merc.scale.y = liveFrac * 8;
      live.merc.position.y = 0.25 + (liveFrac * 0.04 / 2);
      dead.merc.scale.y = deadFrac * 8;
      dead.merc.position.y = 0.25 + (deadFrac * 0.04 / 2);

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
      setHours(hRef.current);
      if (hRef.current >= DURATION_H) { clearInterval(id); setRunning(false); }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const tLive = T_AMBIENT + (T_LIVE_MAX - T_AMBIENT) * (1 - Math.exp(-hours / 12));
  const tDead = T_AMBIENT + (T_DEAD_MAX - T_AMBIENT) * (1 - Math.exp(-hours / 8));

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const skip = () => { stop(); setHours(DURATION_H); hRef.current = DURATION_H; };
  const reset = () => { stop(); setHours(0); hRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Respiration · Heat production">
      <Header
        title="Germinating seeds release"
        accent="heat"
        blurb="Two insulated flasks. The first holds soaked germinating peas; the second holds dead seeds that have been boiled (control). Both have thermometers. Over 48 hours, only the live flask warms up — direct evidence that respiration releases energy as heat."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && hours < DURATION_H ? (
              <button onClick={start}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                Start clock
              </button>
            ) : running ? (
              <SecondaryButton onClick={stop}>Pause</SecondaryButton>
            ) : (
              <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            )}
            <SecondaryButton onClick={skip} disabled={hours >= DURATION_H} icon={FastForward}>Skip to 48 h</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {hours.toFixed(1)} h</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 p-4"
            style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em", color: "#2e7d32" }}>LIVE seeds</div>
              <div className="text-2xl" style={{ fontFamily: mono, fontWeight: 500 }}>{tLive.toFixed(1)} °C</div>
              <div className="text-[10px] opacity-60 mt-1">Δ {(tLive - T_AMBIENT).toFixed(1)} °C above ambient</div>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>DEAD seeds (control)</div>
              <div className="text-2xl" style={{ fontFamily: mono, fontWeight: 500 }}>{tDead.toFixed(1)} °C</div>
              <div className="text-[10px] opacity-60 mt-1">Δ {(tDead - T_AMBIENT).toFixed(1)} °C above ambient</div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
        </div>
      </div>
    </Shell>
  );
}
