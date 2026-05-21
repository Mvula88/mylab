"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeMeter } from "./three/SceneKit";

const R_PER_M = 5.0;
const LENGTHS = [20, 40, 60, 80, 100];

const QUIZ = [
  { q: "For a uniform wire, how does resistance depend on length L?",
    options: ["R is independent of L", "R is inversely proportional to L", "R ∝ L — straight line through origin", "R = L²"], correct: 2 },
  { q: "Why must the wire be kept COOL (low current)?",
    options: ["To save power", "Heating the wire would increase its resistance — invalidating the simple R ∝ L relationship which assumes constant T", "Cool wires are easier to read", "Hot wires emit light"], correct: 1 },
  { q: "If you double the wire's CROSS-SECTIONAL AREA but keep L the same, what happens to R?",
    options: ["Doubles", "Halves — R inversely proportional to area (R = ρL/A)", "Stays the same", "Quadruples"], correct: 1 },
  { q: "From the slope of R-vs-L you can calculate ρ. Formula:",
    options: ["ρ = slope × A  (R = ρL/A; gradient = ρ/A; × A → ρ)", "ρ = slope ÷ L", "ρ = slope × L", "ρ = R × L"], correct: 0 },
];

export default function ResistanceWireLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [L, setL] = useState(50);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const Lref = useRef(50);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.4, z: 0.85, lookY: 0.1 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.6 }));

    // Metre rule
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.02, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xfdfbf3, roughness: 0.85 })
    );
    ruler.position.set(0, 0.01, 0.04);
    scene.add(ruler);
    // ticks
    const ruleCanvas = document.createElement("canvas");
    ruleCanvas.width = 1024; ruleCanvas.height = 48;
    const rcx = ruleCanvas.getContext("2d");
    rcx.fillStyle = "#fdfbf3"; rcx.fillRect(0, 0, 1024, 48);
    rcx.strokeStyle = "#1a1f2e"; rcx.lineWidth = 2; rcx.fillStyle = "#1a1f2e"; rcx.font = "bold 18px monospace";
    for (let i = 0; i <= 100; i += 5) {
      const x = (i / 100) * 1024;
      const h = i % 10 === 0 ? 26 : 14;
      rcx.beginPath(); rcx.moveTo(x, 0); rcx.lineTo(x, h); rcx.stroke();
      if (i % 10 === 0) rcx.fillText(`${i}`, x + 4, h + 16);
    }
    const tex = new THREE.CanvasTexture(ruleCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const rulerTop = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.04),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    rulerTop.rotation.x = -Math.PI / 2;
    rulerTop.position.set(0, 0.021, 0.04);
    scene.add(rulerTop);

    // Wire (constantan, stretched between two posts)
    const postMat = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.5 });
    const postA = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 12), postMat);
    postA.position.set(-0.5, 0.02, 0.0);
    scene.add(postA);
    const postB = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 12), postMat);
    postB.position.set(0.5, 0.02, 0.0);
    scene.add(postB);
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0008, 0.0008, 1.0, 6),
      new THREE.MeshStandardMaterial({ color: 0xc0bba0, roughness: 0.4, metalness: 0.7 })
    );
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0, 0.04, 0);
    scene.add(wire);

    // Jockey clip
    const jockey = new THREE.Group();
    const jBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.015, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xc2185b, roughness: 0.5 })
    );
    jBody.position.y = 0.07;
    jockey.add(jBody);
    const jProbe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0015, 0.0015, 0.04, 8),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.7 })
    );
    jProbe.position.y = 0.05;
    jockey.add(jProbe);
    scene.add(jockey);

    // Ohmmeter
    const ohm = makeMeter({ symbol: "Ω", value: 2.5, unit: "Ω", radius: 0.07 });
    ohm.position.set(-0.4, 0.25, -0.05);
    scene.add(ohm);

    sceneRef.current = { scene, camera, renderer, dispose, jockey, ohm };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.1 });

    let raf;
    const animate = () => {
      const x = -0.5 + (Lref.current / 100) * 1.0;
      jockey.position.x = x;
      const R = (Lref.current / 100) * R_PER_M;
      ohm.userData.setValue(R);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { Lref.current = L; }, [L]);

  const R = (L / 100) * R_PER_M;
  const record = () => {
    const nearest = LENGTHS.reduce((best, x) => Math.abs(x - L) < Math.abs(best - L) ? x : best, LENGTHS[0]);
    if (Math.abs(nearest - L) > 8) return;
    setRecorded((r) => ({ ...r, [nearest]: { L, R: (L / 100) * R_PER_M } }));
  };
  const reset = () => { setL(50); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = LENGTHS.map((l) => {
    const r = recorded[l];
    return [`${l}`, r ? r.R.toFixed(2) : "—", r ? (r.R / r.L * 100).toFixed(2) : "—"];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Electricity · Resistance">
      <Header
        title="Resistance vs"
        accent="length of wire"
        blurb="A length of constantan wire is stretched along a metre rule between two clips. A jockey contact slides along the wire, allowing different lengths to be tested. Measure R for each length and plot R against L — the gradient gives the resistance per metre."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/8", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>length under test (drag jockey)</div>
            <input type="range" min="10" max="100" step="1" value={L} onChange={(e) => setL(parseFloat(e.target.value))} className="w-full" />
            <div className="text-lg" style={{ fontFamily: mono }}>L = {L} cm · R = {R.toFixed(2)} Ω</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record at nearest {LENGTHS.join("/")} cm
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["L (cm)", "R (Ω)", "R/L (Ω/m)"]} rows={rows} />
          <div className="mt-4">
            <Card label="Plot · R vs L">
              <RLPlot recorded={recorded} />
              <div className="text-[11px] opacity-75 mt-2">Straight line through origin → R ∝ L. Gradient ≈ {R_PER_M.toFixed(1)} Ω/m.</div>
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

function RLPlot({ recorded }) {
  const W = 280, H = 150;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const xMax = 110, yMax = 6;
  const xPx = (x) => padL + (x / xMax) * (W - padL - padR);
  const yPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const points = Object.values(recorded).map((r) => [r.L, r.R]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {[0, 25, 50, 75, 100].map((x) => (
        <text key={x} x={xPx(x)} y={H - padB + 14} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">{x}</text>
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={xPx(x)} cy={yPx(y)} r="3" fill="#c2185b" />
      ))}
      <polyline points={points.sort((a, b) => a[0] - b[0]).map(([x, y]) => `${xPx(x)},${yPx(y)}`).join(" ")} fill="none" stroke="#c2185b" strokeWidth="1.5" opacity="0.65" />
      <text x={W / 2} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">L (cm)</text>
      <text x={padL - 6} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">R (Ω)</text>
    </svg>
  );
}
