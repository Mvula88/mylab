"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, Pause } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeClampStand, glassMaterial, liquidMaterial } from "./three/SceneKit";

const ALLOY_MASS_G = 2.00;
const IRON_FRACTION = 0.804;
const FE_AR = 55.85;
const VOL_FLASK = 250;
const ALIQUOT = 25.0;
const KMNO4_M = 0.0200;
const TRUE_END = 28.79;

const QUIZ = [
  { q: "Why is KMnO₄ called a SELF-INDICATOR?",
    options: ["Releases hydrogen ions", "Its own deep purple is destroyed by reaction with Fe²⁺ until Fe²⁺ exhausted — first permanent pink = endpoint", "It is a litmus", "Changes pH"], correct: 1 },
  { q: "Balanced ionic equation:",
    options: ["MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O", "MnO₄⁻ + Fe²⁺ → MnO₃⁻ + Fe³⁺", "Mn²⁺ + Fe³⁺ → MnO₄⁻ + Fe²⁺", "2MnO₄⁻ + 3Fe³⁺ → 2MnO₂ + 3Fe⁴⁺"], correct: 0 },
  { q: "Why is dilute H₂SO₄ (not HCl) used to acidify the Fe²⁺ solution?",
    options: ["HCl evaporates", "HCl would be OXIDISED by KMnO₄ — inaccurate (too high) titre. Sulfuric acid is inert to KMnO₄", "HCl is expensive", "Sulfate reacts with iron"], correct: 1 },
  { q: "28.80 cm³ of 0.0200 M KMnO₄ for 25.0 cm³ aliquot (250 cm³ stock from 2.00 g alloy). Calculate %Fe.",
    options: ["≈ 80 %", "≈ 25 %", "≈ 100 %", "≈ 50 %"], correct: 0 },
];

export default function AlloyRedoxTitrationLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [vol, setVol] = useState(0);
  const [running, setRunning] = useState(false);
  const [reading, setReading] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const volRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.4, y: 0.65, z: 1.0, lookY: 0.35 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.7 }));

    const stand = makeClampStand({ rodHeight: 0.85 });
    scene.add(stand);

    // Burette
    const buretteH = 0.6;
    const burette = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, buretteH, 24, 1, true),
      glassMaterial({ opacity: 0.3 })
    );
    burette.position.set(0.05, 0.4, 0);
    scene.add(burette);
    // Burette fluid (KMnO₄ purple)
    const buretteFluidMat = liquidMaterial(0x5a1c5a, 0.9);
    const buretteFluid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.013, 0.013, 0.5, 24),
      buretteFluidMat
    );
    buretteFluid.position.set(0.05, 0.45, 0);
    scene.add(buretteFluid);
    // tap
    const tap = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.018, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.5 })
    );
    tap.position.set(0.05, 0.105, 0);
    scene.add(tap);

    // Conical flask (Erlenmeyer)
    const flaskGeom = new THREE.LatheGeometry([
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.06, 0),
      new THREE.Vector2(0.06, 0.015),
      new THREE.Vector2(0.025, 0.085),
      new THREE.Vector2(0.022, 0.1),
    ], 32);
    const flask = new THREE.Mesh(flaskGeom, glassMaterial());
    flask.position.set(0.05, 0, 0);
    scene.add(flask);
    // flask fluid (initially clear/yellow-green pale, becomes pink past endpoint)
    const flaskFluidMat = liquidMaterial(0xeaebdc, 0.6);
    const flaskFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 32), flaskFluidMat);
    flaskFluid.position.set(0.05, 0.025, 0);
    scene.add(flaskFluid);

    // Drip
    const drip = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x5a1c5a })
    );
    drip.position.set(0.05, 0.085, 0);
    drip.visible = false;
    scene.add(drip);

    sceneRef.current = { scene, camera, renderer, dispose, buretteFluid, flaskFluidMat, drip };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.35 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) {
        const remaining = TRUE_END - volRef.current;
        const rate = remaining > 5 ? 2 : remaining > 1 ? 0.5 : 0.08;
        volRef.current = Math.min(50, volRef.current + dt * rate);
      }

      // Burette fluid scales down with vol
      const filledFrac = (50 - volRef.current) / 50;
      buretteFluid.scale.y = filledFrac;
      buretteFluid.position.y = 0.2 + filledFrac * 0.25;

      // Flask colour shifts past endpoint
      const overEnd = Math.max(0, volRef.current - TRUE_END);
      const pinkness = Math.min(1, overEnd * 4);
      flaskFluidMat.color.setHex(lerpHex(0xeaebdc, 0xb43c8c, pinkness));
      flaskFluidMat.opacity = 0.6 + pinkness * 0.3;

      // drip animation
      if (runRef.current && volRef.current < 50) {
        drip.visible = true;
        const phase = ((now ?? performance.now()) / 1000 * 2) % 1;
        drip.position.y = 0.1 - phase * 0.05;
        drip.material.transparent = true;
        drip.material.opacity = 1 - phase;
      } else {
        drip.visible = false;
      }

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
      setVol(volRef.current);
      if (volRef.current >= TRUE_END + 0.1 && reading == null) {
        setReading(volRef.current);
        setRunning(false);
        clearInterval(id);
      }
      if (volRef.current >= 50) { setRunning(false); clearInterval(id); }
    }, 80);
    return () => clearInterval(id);
  }, [running, reading]);

  const start = () => { setRunning(true); setReading(null); };
  const stop = () => { setRunning(false); setReading(vol); };
  const reset = () => { setRunning(false); setVol(0); volRef.current = 0; setReading(null); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const userMolMn = reading ? KMNO4_M * reading / 1000 : null;
  const userMolFe25 = userMolMn ? userMolMn * 5 : null;
  const userMolFeTotal = userMolFe25 ? userMolFe25 * (VOL_FLASK / ALIQUOT) : null;
  const userMassFe = userMolFeTotal ? userMolFeTotal * FE_AR : null;
  const userPct = userMassFe ? (userMassFe / ALLOY_MASS_G) * 100 : null;

  return (
    <Shell back="/iodine-clock" backLabel="Back" topic="NSSCAS Chemistry · 8224/3 · Redox titration">
      <Header
        title="Alloy redox"
        accent="titration"
        blurb="A 2.00 g sample of iron alloy has been dissolved in dilute sulfuric acid and made up to 250 cm³. A 25.0 cm³ aliquot is titrated against 0.0200 M potassium manganate(VII). The first permanent pink colour marks the end-point, from which the percentage of iron in the alloy can be calculated."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "10/12", maxHeight: 540, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {!running ? <PrimaryButton onClick={start} icon={Play} disabled={vol >= 50}>{vol === 0 ? "Begin titration" : "Resume"}</PrimaryButton>
              : <SecondaryButton onClick={stop} icon={Pause}>Stop &amp; record</SecondaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>burette: {vol.toFixed(2)} cm³</div>
          </div>

          <StatGrid cols={3}>
            <Stat label="m alloy" value={`${ALLOY_MASS_G.toFixed(2)} g`} />
            <Stat label="[KMnO₄]" value={`${KMNO4_M.toFixed(4)} M`} />
            <Stat label="endpoint" value={reading ? `${reading.toFixed(2)} cm³` : "—"} highlight={!!reading} />
          </StatGrid>
        </div>

        <div className="lg:col-span-5">
          <Card label="Calculation">
            <div className="text-sm leading-relaxed" style={{ fontFamily: mono }}>
              MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O
            </div>
            {reading && (
              <div className="text-xs mt-3 space-y-1 leading-snug" style={{ fontFamily: mono }}>
                <div>V = {reading.toFixed(2)} cm³</div>
                <div>n(MnO₄⁻) = {(KMNO4_M * reading / 1000 * 1e4).toFixed(2)} × 10⁻⁴ mol</div>
                <div>n(Fe²⁺) in 25 cm³ = {(userMolFe25 * 1e3).toFixed(3)} × 10⁻³ mol</div>
                <div>× 10 for 250 cm³ → {(userMolFeTotal).toFixed(4)} mol</div>
                <div>m(Fe) = {(userMassFe).toFixed(3)} g</div>
                <div style={{ color: "#c2185b", fontWeight: 600 }}>% iron = {(userPct).toFixed(1)} %</div>
                <div className="opacity-65">True value: {(IRON_FRACTION * 100).toFixed(1)} %</div>
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
