"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeMeter, glassMaterial } from "./three/SceneKit";

const PV_CONST = 100;
const VOLUMES = [25, 33, 50, 67, 100];

const QUIZ = [
  { q: "Boyle's law states (constant T, fixed mass):",
    options: ["PV = constant (P inversely proportional to V)", "P + V = constant", "P = constant", "V = constant"], correct: 0 },
  { q: "Which graph gives a STRAIGHT LINE THROUGH THE ORIGIN if Boyle's law holds?",
    options: ["P vs V", "P vs 1/V", "V vs T", "P vs T"], correct: 1 },
  { q: "Why must temperature be CONSTANT?",
    options: ["To avoid burns", "PV = constant is only true at constant T — if T changes, P changes for reasons unrelated to V", "To keep gauge accurate", "It doesn't matter"], correct: 1 },
  { q: "Gas occupies 60 cm³ at 1.5 atm. What volume at 3.0 atm (constant T)?",
    options: ["30 cm³  (P₁V₁ = P₂V₂)", "120 cm³", "90 cm³", "20 cm³"], correct: 0 },
];

export default function BoylesLawLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [volume, setVolume] = useState(100);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const volRef = useRef(100);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.6, z: 1.1, lookY: 0.3 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Vertical syringe (cylinder open top)
    const sylR = 0.04, sylH = 0.4;
    const sylBody = new THREE.Mesh(
      new THREE.CylinderGeometry(sylR, sylR, sylH, 32, 1, true),
      glassMaterial({ opacity: 0.3 })
    );
    sylBody.position.set(-0.2, 0.2, 0);
    scene.add(sylBody);
    const sylBase = new THREE.Mesh(
      new THREE.CylinderGeometry(sylR, sylR, 0.005, 32),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.4 })
    );
    sylBase.position.set(-0.2, 0.003, 0);
    scene.add(sylBase);

    // gas (semi-transparent yellow column)
    const gasMat = new THREE.MeshBasicMaterial({ color: 0xf4d58b, transparent: true, opacity: 0.45 });
    const gas = new THREE.Mesh(new THREE.CylinderGeometry(sylR - 0.002, sylR - 0.002, 0.32, 32), gasMat);
    gas.position.set(-0.2, 0.16, 0);
    scene.add(gas);

    // Piston with rod & handle
    const pMat = new THREE.MeshStandardMaterial({ color: 0x666, roughness: 0.5, metalness: 0.4 });
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(sylR - 0.001, sylR - 0.001, 0.012, 32), pMat);
    piston.position.set(-0.2, 0.32, 0);
    scene.add(piston);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.18, 12), pMat);
    rod.position.set(-0.2, 0.42, 0);
    scene.add(rod);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.012), pMat);
    handle.position.set(-0.2, 0.52, 0);
    scene.add(handle);

    // Pressure gauge
    const gauge = makeMeter({ symbol: "P", value: 1.0, unit: "atm", radius: 0.08 });
    gauge.position.set(0.25, 0.25, 0);
    scene.add(gauge);
    // hose
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.25, 12), pMat);
    hose.rotation.z = Math.PI / 2.5;
    hose.position.set(0.07, 0.05, 0);
    scene.add(hose);

    sceneRef.current = { scene, camera, renderer, dispose, gas, piston, rod, handle, gauge };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.3 });

    let raf;
    const animate = () => {
      const v = volRef.current;
      const p = PV_CONST / v;
      // Scale gas column proportionally to V (100 cm³ → 0.32 m, 25 cm³ → 0.08 m)
      const gasH = (v / 100) * 0.32;
      gas.scale.y = gasH / 0.32;
      gas.position.y = 0.005 + gasH / 2;
      // Piston above gas
      piston.position.y = 0.005 + gasH + 0.006;
      rod.position.y = piston.position.y + 0.09;
      handle.position.y = piston.position.y + 0.19;
      // gauge readout
      gauge.userData.setValue(p);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { volRef.current = volume; }, [volume]);

  const pressure = PV_CONST / volume;
  const record = () => {
    const nearest = VOLUMES.reduce((best, v) => Math.abs(v - volume) < Math.abs(best - volume) ? v : best, VOLUMES[0]);
    if (Math.abs(nearest - volume) > 5) return;
    setRecorded((r) => ({ ...r, [nearest]: { V: volume, P: PV_CONST / volume } }));
  };
  const reset = () => { setVolume(100); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = VOLUMES.map((v) => {
    const r = recorded[v];
    return [`${v}`, r ? r.P.toFixed(2) : "—", r ? (r.P * r.V).toFixed(0) : "—", r ? (1 / r.V * 1000).toFixed(2) : "—"];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Thermal · Gas laws">
      <Header
        title="Boyle's law —"
        accent="P vs V at constant T"
        blurb="A sealed gas column has its volume changed by a piston, while a pressure gauge reads the gas pressure. Pressure goes up as you squeeze the gas down; their product PV stays roughly constant — that is Boyle's law."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>volume of gas (drag piston)</div>
            <input type="range" min="20" max="120" step="0.5" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full" />
            <div className="text-lg" style={{ fontFamily: mono }}>V = {volume.toFixed(1)} cm³ · P = {pressure.toFixed(2)} atm · PV = {(volume * pressure).toFixed(0)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record at nearest {VOLUMES.join("/")} cm³
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["V (cm³)", "P (atm)", "PV", "1/V × 1000"]} rows={rows} />
          <div className="mt-4">
            <Card label="Plot · P vs 1/V">
              <PVPlot recorded={recorded} />
              <div className="text-[11px] opacity-75 mt-2">Straight line through the origin confirms PV = constant.</div>
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

function PVPlot({ recorded }) {
  const W = 280, H = 150;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const xMax = 50, yMax = 5;
  const xPx = (x) => padL + (x / xMax) * (W - padL - padR);
  const yPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const points = Object.values(recorded).map((r) => [1000 / r.V, r.P]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {[0, 10, 20, 30, 40, 50].map((x) => (
        <text key={x} x={xPx(x)} y={H - padB + 14} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">{x}</text>
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={xPx(x)} cy={yPx(y)} r="3" fill="#c2185b" />
      ))}
      <polyline points={points.sort((a, b) => a[0] - b[0]).map(([x, y]) => `${xPx(x)},${yPx(y)}`).join(" ")} fill="none" stroke="#c2185b" strokeWidth="1.5" opacity="0.65" />
      <text x={W / 2} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">1/V × 1000 (cm⁻³)</text>
      <text x={padL - 6} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">P (atm)</text>
    </svg>
  );
}
