"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial, makeReadoutSprite } from "./three/SceneKit";

const SAMPLES = [
  { id: "stone", name: "Granite stone",  mass: 81.0, vol: 30.0, density: 2.70, colour: 0x7d7670 },
  { id: "brass", name: "Brass nut",       mass: 51.0, vol: 6.0,  density: 8.50, colour: 0xc1a161 },
  { id: "alum",  name: "Aluminium block", mass: 27.0, vol: 10.0, density: 2.70, colour: 0xb9bcc1 },
  { id: "lead",  name: "Lead sinker",     mass: 56.7, vol: 5.0,  density: 11.34,colour: 0x4d4d56 },
  { id: "glass", name: "Glass marble",    mass: 12.5, vol: 5.0,  density: 2.50, colour: 0xa3d0e8 },
];
const MATERIALS = ["Granite (~2.7)", "Brass (~8.5)", "Aluminium (~2.7)", "Lead (~11.3)", "Glass (~2.5)"];

const QUIZ = [
  { q: "Why is WATER-DISPLACEMENT used for an IRREGULAR solid?",
    options: ["It is the only legal method", "Its volume cannot be calculated from lengths — the rise in water level GIVES that volume directly", "Water dissolves the solid", "Water is heavier"], correct: 1 },
  { q: "How is DENSITY calculated?",
    options: ["ρ = mass × volume", "ρ = mass ÷ volume  (g cm⁻³ or kg m⁻³)", "ρ = volume ÷ mass", "ρ = mass × 9.81"], correct: 1 },
  { q: "If a solid FLOATS, can you still use this method?",
    options: ["No — never", "Not directly, but you can tie it to a heavy SINKER and subtract the sinker's volume", "Yes — floats give the right volume", "Only if hollow"], correct: 1 },
  { q: "Why must the meniscus be read at the BOTTOM of the curve at eye level?",
    options: ["To avoid parallax error", "To stop evaporation", "Because the top is sharper", "It does not matter"], correct: 0 },
];

export default function DensityDisplacementLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [submerged, setSubmerged] = useState(false);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const sample = SAMPLES.find((s) => s.id === sampleId);
  const sampleRef = useRef(sample);
  sampleRef.current = sample;
  const submergedRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.45, z: 1.0, lookY: 0.2 },
    });
    scene.add(makeBench({ width: 2.0, depth: 0.7 }));

    // Balance (digital scale on left)
    const balance = new THREE.Group();
    const baseB = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.06, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xdbd1b4, roughness: 0.7 })
    );
    baseB.position.y = 0.03;
    balance.add(baseB);
    const screenB = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.05, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x111, roughness: 0.4 })
    );
    screenB.position.set(0, 0.07, 0.08);
    balance.add(screenB);
    const massReadout = makeReadoutSprite({ width: 0.13, height: 0.04, suffix: " g", initial: sample.mass.toFixed(1) });
    massReadout.position.set(0, 0.07, 0.11);
    balance.add(massReadout);
    const pan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.003, 32),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.5 })
    );
    pan.position.set(0, 0.065, -0.02);
    balance.add(pan);
    balance.position.set(-0.45, 0, 0);
    scene.add(balance);
    // sample on balance (or in cylinder when submerged)
    const sampleMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 24, 16),
      new THREE.MeshStandardMaterial({ color: sample.colour, roughness: 0.5, metalness: 0.3 })
    );
    sampleMesh.position.set(-0.45, 0.09, -0.02);
    scene.add(sampleMesh);

    // Measuring cylinder on right
    const cylR = 0.04, cylH = 0.32;
    const cyl = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0),
        new THREE.Vector2(cylR - 0.002, 0),
        new THREE.Vector2(cylR - 0.002, cylH),
        new THREE.Vector2(cylR, cylH),
        new THREE.Vector2(cylR, 0),
        new THREE.Vector2(0.0001, 0),
      ], 36),
      glassMaterial()
    );
    cyl.position.set(0.4, 0, 0);
    scene.add(cyl);
    // base
    const cylBase = new THREE.Mesh(
      new THREE.CylinderGeometry(cylR * 1.5, cylR * 1.5, 0.01, 32),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.5 })
    );
    cylBase.position.set(0.4, 0.005, 0);
    scene.add(cylBase);

    // water level — 50 mL initially (height ratio 50/100)
    const waterMat = liquidMaterial(0xa7d4ec, 0.55);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(cylR - 0.003, cylR - 0.003, 0.16, 36),
      waterMat
    );
    water.position.set(0.4, 0.08, 0);
    scene.add(water);

    // Scale ticks (canvas plane on outside)
    const scaleCanvas = document.createElement("canvas");
    scaleCanvas.width = 96; scaleCanvas.height = 384;
    const sx = scaleCanvas.getContext("2d");
    sx.fillStyle = "rgba(0,0,0,0)";
    sx.clearRect(0, 0, 96, 384);
    sx.fillStyle = "#1a1f2e"; sx.font = "bold 18px monospace";
    for (let i = 0; i <= 10; i++) {
      const y = 376 - i * 36;
      sx.strokeStyle = "#1a1f2e"; sx.lineWidth = 2;
      sx.beginPath(); sx.moveTo(0, y); sx.lineTo(28, y); sx.stroke();
      sx.fillText(`${i * 10}`, 32, y + 6);
    }
    const stex = new THREE.CanvasTexture(scaleCanvas);
    stex.colorSpace = THREE.SRGBColorSpace;
    const scaleFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.024, 0.32),
      new THREE.MeshBasicMaterial({ map: stex, transparent: true })
    );
    scaleFace.position.set(0.4 + cylR + 0.005, 0.16, 0);
    scene.add(scaleFace);

    sceneRef.current = { scene, camera, renderer, dispose, sampleMesh, water, massReadout };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.2 });

    let raf;
    const animate = () => {
      const samp = sampleRef.current;
      sampleMesh.material.color.setHex(samp.colour);
      massReadout.userData.setText(samp.mass.toFixed(1));

      if (submergedRef.current) {
        // sample inside cylinder
        sampleMesh.position.set(0.4, 0.06 + (samp.vol / 100) * 0.16, 0);
        // water level rises
        const totalVol = 50 + samp.vol;
        const newHeight = (totalVol / 100) * 0.32;
        water.scale.y = (totalVol / 50);
        water.position.y = newHeight / 2 + 0.003;
      } else {
        sampleMesh.position.set(-0.45, 0.09, -0.02);
        water.scale.y = 1;
        water.position.y = 0.08 + 0.003;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { submergedRef.current = submerged; }, [submerged]);

  const switchSample = (id) => {
    setSampleId(id); setSubmerged(false); setGuess(""); setRevealed(false);
  };
  const v1 = 50, v2 = v1 + (submerged ? sample.vol : 0);
  const density = sample.mass / sample.vol;
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Mechanics · Density">
      <Header
        title="Density of an"
        accent="irregular solid"
        blurb="Measure the mass of the object on a balance. Note the water level in a measuring cylinder, lower the object in, and read the new water level. Volume = (new − old) cm³. Density = mass ÷ volume — and that number identifies the material."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-4">
            {SAMPLES.map((s) => (
              <button key={s.id} onClick={() => switchSample(s.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: s.id === sampleId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${s.id === sampleId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: s.id === sampleId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-[10px] leading-tight">{s.name}</div>
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!submerged ? (
              <button onClick={() => setSubmerged(true)}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                Submerge sample
              </button>
            ) : (
              <SecondaryButton onClick={() => { setSubmerged(false); setGuess(""); setRevealed(false); }} icon={RotateCcw}>
                Lift sample
              </SecondaryButton>
            )}
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
              m = {sample.mass.toFixed(1)} g{submerged && <> · ΔV = {sample.vol.toFixed(1)} cm³</>}
            </div>
          </div>

          {submerged && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4"
              style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
              <div>
                <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Your guess</div>
                <select value={guess} onChange={(e) => setGuess(e.target.value)} disabled={revealed}
                  className="w-full px-3 py-2 text-sm" style={{ fontFamily: mono, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.25)" }}>
                  <option value="">Calculate ρ → identify material…</option>
                  {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                {!revealed ? (
                  <button onClick={() => setRevealed(true)} disabled={!guess}
                    className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                    style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                    Check
                  </button>
                ) : (
                  <div className="text-sm" style={{ fontFamily: mono }}>
                    ρ = {density.toFixed(2)} g cm⁻³ → <span style={{ color: guess.toLowerCase().includes(sample.name.split(" ")[0].toLowerCase()) ? "#2e7d32" : "#c2185b", fontWeight: 600 }}>
                      {sample.name.split(" ")[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card label="Calculation">
            <div className="text-sm" style={{ fontFamily: mono }}>ρ = m ÷ V</div>
            <div className="text-xs opacity-75 mt-2">Mass measured on a balance; volume by displacement.</div>
            {submerged && (
              <div className="text-xs mt-3 leading-snug" style={{ fontFamily: mono }}>
                <div>m = {sample.mass.toFixed(1)} g</div>
                <div>V₁ = {v1} cm³, V₂ = {v2} cm³</div>
                <div>V = V₂ − V₁ = {sample.vol.toFixed(1)} cm³</div>
                <div style={{ color: "#c2185b", fontWeight: 600 }}>ρ = {density.toFixed(2)} g cm⁻³</div>
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
