"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBattery, makeMeter, makeResistor, makeWire } from "./three/SceneKit";

const R_OHM = 10;
const V_STEPS = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];

const QUIZ = [
  { q: "Ohm's law states that, for a metallic conductor at constant T:",
    options: ["V = IR — current is directly proportional to voltage; R is constant", "P = IV", "V = I²R", "V = I + R"], correct: 0 },
  { q: "On a graph of V (y-axis) vs I (x-axis) for a fixed resistor, the GRADIENT represents:",
    options: ["Power", "Resistance R (in Ω)", "Voltage of the supply", "Current"], correct: 1 },
  { q: "Why is the AMMETER in SERIES and the voltmeter in PARALLEL?",
    options: ["Ammeter measures the same current flowing through the component (so it joins the line); voltmeter measures pd ACROSS the component (parallel)", "Just convention", "The ammeter is heavier", "Voltmeters cannot carry current"], correct: 0 },
  { q: "A resistor obeys Ohm's law from 0–5 V but at 6 V the V-I graph BENDS. Why?",
    options: ["Higher currents heat the resistor; resistance is only constant at constant temperature", "The ammeter is broken", "The wire shrinks", "Voltmeter polarity reversed"], correct: 0 },
];

export default function OhmsLawLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [V, setV] = useState(1.0);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const vRef = useRef(1.0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.6, z: 1.1, lookY: 0.2 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Battery
    const battery = makeBattery({ label: "DC SUPPLY" });
    battery.position.set(-0.5, 0, 0);
    scene.add(battery);
    // Ammeter
    const ammeter = makeMeter({ symbol: "A", value: 0.1, unit: "A", radius: 0.06 });
    ammeter.position.set(-0.2, 0.18, 0);
    scene.add(ammeter);
    // Resistor
    const resistor = makeResistor({ value: "10 Ω" });
    resistor.position.set(0.15, 0.18, 0);
    scene.add(resistor);
    // Voltmeter (in parallel with resistor, above)
    const voltmeter = makeMeter({ symbol: "V", value: 1.0, unit: "V", radius: 0.06 });
    voltmeter.position.set(0.15, 0.35, 0);
    scene.add(voltmeter);

    // Wires
    // Battery + → ammeter
    scene.add(makeWire([[-0.5 + 0.06, 0.072, 0], [-0.5 + 0.06, 0.18, 0], [-0.2 - 0.06, 0.18, 0]]));
    // Ammeter → resistor
    scene.add(makeWire([[-0.2 + 0.06, 0.18, 0], [0.15 - 0.06, 0.18, 0]]));
    // Resistor → back to battery
    scene.add(makeWire([[0.15 + 0.06, 0.18, 0], [0.45, 0.18, 0], [0.45, 0.04, 0], [-0.55, 0.04, 0], [-0.5 - 0.06, 0.072, 0]]));
    // Voltmeter parallel
    scene.add(makeWire([[0.15 - 0.04, 0.18, 0], [0.15 - 0.04, 0.29, 0], [0.15 - 0.06, 0.35, 0]]));
    scene.add(makeWire([[0.15 + 0.04, 0.18, 0], [0.15 + 0.04, 0.29, 0], [0.15 + 0.06, 0.35, 0]]));

    sceneRef.current = { scene, camera, renderer, dispose, ammeter, voltmeter };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.2 });

    let raf;
    const animate = () => {
      const v = vRef.current;
      const i = v / R_OHM;
      ammeter.userData.setValue(i);
      voltmeter.userData.setValue(v);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { vRef.current = V; }, [V]);

  const I = V / R_OHM;
  const record = () => {
    const nearest = V_STEPS.reduce((best, v) => Math.abs(v - V) < Math.abs(best - V) ? v : best, V_STEPS[0]);
    if (Math.abs(nearest - V) > 0.3) return;
    setRecorded((r) => ({ ...r, [nearest]: { V, I: V / R_OHM } }));
  };
  const reset = () => { setV(1.0); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = V_STEPS.map((v) => {
    const r = recorded[v];
    return [`${v.toFixed(1)}`, r ? r.I.toFixed(3) : "—", r ? (r.V / r.I).toFixed(2) : "—"];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Electricity · Ohm's law">
      <Header
        title="Ohm's law for a"
        accent="fixed resistor"
        blurb="Build a simple series circuit with an ammeter, a fixed resistor, and an adjustable supply. Read the voltmeter across the resistor and the ammeter in the line. Increase V step by step and tabulate I — R = V/I should come out constant."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>supply voltage</div>
            <input type="range" min="0" max="6.5" step="0.1" value={V} onChange={(e) => setV(parseFloat(e.target.value))} className="w-full" />
            <div className="text-lg" style={{ fontFamily: mono }}>V = {V.toFixed(2)} V · I = {I.toFixed(3)} A · R = {(V > 0 ? V / I : R_OHM).toFixed(2)} Ω</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record at nearest 1.0 V
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["V (V)", "I (A)", "R (Ω)"]} rows={rows} />
          <div className="mt-4">
            <Card label="Plot · V vs I">
              <VIPlot recorded={recorded} />
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

function VIPlot({ recorded }) {
  const W = 280, H = 150;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const xMax = 0.7, yMax = 7;
  const xPx = (x) => padL + (x / xMax) * (W - padL - padR);
  const yPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const points = Object.values(recorded).map((r) => [r.I, r.V]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {[0, 0.2, 0.4, 0.6].map((x) => (
        <text key={x} x={xPx(x)} y={H - padB + 14} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">{x}</text>
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={xPx(x)} cy={yPx(y)} r="3" fill="#c2185b" />
      ))}
      <polyline points={points.sort((a, b) => a[0] - b[0]).map(([x, y]) => `${xPx(x)},${yPx(y)}`).join(" ")} fill="none" stroke="#c2185b" strokeWidth="1.5" opacity="0.65" />
      <text x={W / 2} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">I (A)</text>
      <text x={padL - 6} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">V (V)</text>
    </svg>
  );
}
