"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const VOL_HCl = 25.0, VOL_NaOH = 25.0, CONC = 1.0;
const C_WATER = 4.18, T_INITIAL = 22.0, TRUE_ΔH = -57.0;
const EFFICIENCY = 0.95;
const ΔT_OBSERVED = (Math.abs(TRUE_ΔH) * 1000 * 0.025 * EFFICIENCY) / (50 * C_WATER);

const QUIZ = [
  { q: "Why is a styrofoam (polystyrene) cup used?",
    options: ["It is cheap", "Poor conductor of heat — minimises heat loss; ΔT reflects actual reaction enthalpy", "It dissolves", "Reaction is faster in plastic"], correct: 1 },
  { q: "Why is ΔH of neutralisation roughly CONSTANT for strong acid + strong base?",
    options: ["Same reagents", "The net ionic equation is always H⁺ + OH⁻ → H₂O; spectator ions don't react", "Same molecular weight", "Tradition"], correct: 1 },
  { q: "Why is the experimental value usually a LITTLE less negative than −57 kJ/mol?",
    options: ["Mixing too slow", "Some heat goes to cup and surroundings rather than the solution — smaller ΔT → ΔH appears smaller", "Water absorbs heat from reaction", "Acid reacts with the cup"], correct: 1 },
  { q: "25 cm³ 1.0 M HCl + 25 cm³ 1.0 M NaOH, ΔT = 6.6 °C. What is ΔH? (m=50 g, c=4.18, n=0.025)",
    options: ["≈ −55 kJ/mol (q = 50×4.18×6.6 = 1379 J; ΔH = −1379/0.025)", "−100 kJ/mol", "+55 kJ/mol", "−27 kJ/mol"], correct: 0 },
];

export default function EnthalpyNeutralisationLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [phase, setPhase] = useState("idle");
  const [temp, setTemp] = useState(T_INITIAL);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const phaseRef = useRef("idle");
  const tempRef = useRef(T_INITIAL);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.0, lookY: 0.15 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.7 }));

    // Styrofoam cup
    const cup = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.04, 0),
        new THREE.Vector2(0.055, 0.12),
        new THREE.Vector2(0.058, 0.13),
      ], 32),
      new THREE.MeshStandardMaterial({ color: 0xfefcf3, roughness: 0.95 })
    );
    cup.add(outer);
    const inner = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.001, 0.005),
        new THREE.Vector2(0.05, 0.005),
        new THREE.Vector2(0.053, 0.12),
        new THREE.Vector2(0.001, 0.12),
      ], 32),
      new THREE.MeshStandardMaterial({ color: 0xf0ece0, roughness: 0.95 })
    );
    cup.add(inner);
    scene.add(cup);

    // Solution
    const solnMat = liquidMaterial(0xa7d4ec, 0.65);
    const soln = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.038, 0.075, 32),
      solnMat
    );
    soln.position.y = 0.04;
    scene.add(soln);

    // Thermometer
    const thMat = glassMaterial({ opacity: 0.55 });
    const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.22, 12), thMat);
    thermo.position.set(0.025, 0.18, 0);
    scene.add(thermo);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.005, 12, 8), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    bulb.position.set(0.025, 0.075, 0);
    scene.add(bulb);
    const merc = new THREE.Mesh(new THREE.CylinderGeometry(0.0023, 0.0023, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    merc.position.set(0.025, 0.095, 0);
    scene.add(merc);

    // NaOH bottle (small beaker that pours)
    const bottleGroup = new THREE.Group();
    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.07, 24),
      glassMaterial()
    );
    bottleBody.position.y = 0.035;
    bottleGroup.add(bottleBody);
    const naohMat = liquidMaterial(0xfdfaf0, 0.6);
    const naoh = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 24), naohMat);
    naoh.position.y = 0.03;
    bottleGroup.add(naoh);
    bottleGroup.position.set(-0.2, 0.18, 0);
    scene.add(bottleGroup);
    // pour stream
    const stream = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xa7d4ec, transparent: true, opacity: 0.8 })
    );
    stream.position.set(-0.1, 0.13, 0);
    stream.rotation.z = -Math.PI / 5;
    stream.visible = false;
    scene.add(stream);

    sceneRef.current = { scene, camera, renderer, dispose, merc, solnMat, bottleGroup, stream };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.15 });

    let raf;
    const animate = () => {
      const t = tempRef.current;
      // Mercury height (15..35°C scale → 0..0.08 m)
      const tFrac = Math.max(0, Math.min(1, (t - 15) / 20));
      merc.scale.y = 1 + tFrac * 4;
      merc.position.y = 0.075 + (tFrac * 0.08) / 2;
      // Solution colour: cold blue → warm pinkish
      const warmth = Math.min(1, (t - T_INITIAL) / 8);
      solnMat.color.setHex(lerpHex(0xa7d4ec, 0xf4c8a8, warmth));

      // Pour animation during 'reacting'
      if (phaseRef.current === "reacting") {
        stream.visible = true;
        bottleGroup.rotation.z = -0.4;
        bottleGroup.position.set(-0.15, 0.22, 0);
      } else {
        stream.visible = false;
        bottleGroup.rotation.z = 0;
        bottleGroup.position.set(-0.2, 0.18, 0);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
    if (phase !== "reacting") return;
    const start = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      tempRef.current = T_INITIAL + ΔT_OBSERVED * eased;
      setTemp(tempRef.current);
      if (k < 1) requestAnimationFrame(tick);
      else setPhase("done");
    };
    requestAnimationFrame(tick);
  }, [phase]);

  const start = () => setPhase("reacting");
  const reset = () => { setPhase("idle"); setTemp(T_INITIAL); tempRef.current = T_INITIAL; };

  const ΔT = temp - T_INITIAL;
  const q = 50 * C_WATER * ΔT;
  const n = (VOL_HCl / 1000) * CONC;
  const ΔH_kJmol = phase === "done" ? -q / n / 1000 : null;
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/iodine-clock" backLabel="Back" topic="NSSCAS Chemistry · 8224/3 · Calorimetry">
      <Header
        title="Enthalpy of"
        accent="neutralisation"
        blurb="Equal volumes of 1.0 M HCl and 1.0 M NaOH are mixed in a polystyrene cup. The temperature shoots up; the heat released per mole of water formed gives the standard enthalpy of neutralisation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/10", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {phase === "idle" ? <PrimaryButton onClick={start} icon={Play}>Pour NaOH into HCl</PrimaryButton>
              : phase === "done" ? <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
              : null}
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>T = {temp.toFixed(2)} °C</div>
          </div>

          <StatGrid cols={4}>
            <Stat label="m (solution)" value="50 g" />
            <Stat label="c" value={`${C_WATER} J/g/K`} />
            <Stat label="ΔT" value={`${ΔT.toFixed(2)} K`} highlight={phase === "done"} />
            <Stat label="n (water)" value={`${n.toFixed(3)} mol`} />
          </StatGrid>
        </div>

        <div className="lg:col-span-5">
          <Card label="Calculation">
            <div className="text-sm" style={{ fontFamily: mono }}>q = m c ΔT</div>
            <div className="text-sm" style={{ fontFamily: mono }}>ΔH = − q ÷ n</div>
            {phase === "done" && (
              <div className="text-xs mt-3 leading-snug" style={{ fontFamily: mono }}>
                q = 50 × 4.18 × {ΔT.toFixed(2)} = {q.toFixed(0)} J
                <br />
                n = 0.025 mol
                <br />
                <span style={{ color: "#c2185b", fontWeight: 600 }}>ΔH = {ΔH_kJmol.toFixed(1)} kJ/mol</span>
                <br />
                <span className="opacity-65">Published: {TRUE_ΔH.toFixed(1)} kJ/mol</span>
              </div>
            )}
            <div className="text-xs opacity-75 leading-snug mt-3 border-t border-stone-900/15 pt-3">
              Net ionic equation: <span style={{ fontFamily: mono }}>H⁺(aq) + OH⁻(aq) → H₂O(l)</span>
            </div>
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
