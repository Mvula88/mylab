"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBattery, makeMeter, makeWire } from "./three/SceneKit";

const TURNS_OPTIONS = [20, 40, 60, 80, 100];
const PAPERCLIPS_PER_AMP_TURN = 0.06;

const QUIZ = [
  { q: "Increasing the CURRENT in the coil makes the electromagnet:",
    options: ["Weaker", "Stronger — B ∝ I", "Unchanged", "Hotter only"], correct: 1 },
  { q: "Increasing the NUMBER OF TURNS (same current):",
    options: ["No difference", "Increases field roughly in proportion to N (B ∝ NI for a long solenoid)", "Reverses polarity", "Decreases the field"], correct: 1 },
  { q: "Why is the CORE made of SOFT iron?",
    options: ["Cheaper", "Easily magnetised but loses magnetism quickly when current off — useful for switching", "Steel cannot be magnetised", "Light"], correct: 1 },
  { q: "If you REVERSE the current, what happens to the electromagnet?",
    options: ["Stops working", "Polarity reverses (N and S ends switch); strength unchanged", "Hotter only", "Doubles in strength"], correct: 1 },
];

export default function ElectromagnetLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [turns, setTurns] = useState(60);
  const [current, setCurrent] = useState(1.0);
  const [recorded, setRecorded] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const turnsRef = useRef(60);
  const currentRef = useRef(1.0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.4, z: 0.85, lookY: 0.12 },
    });
    scene.add(makeBench({ width: 1.4, depth: 0.65 }));

    // Iron nail (horizontal cylinder + cone tip)
    const nailMat = new THREE.MeshStandardMaterial({ color: 0x9b9b9b, roughness: 0.5, metalness: 0.5 });
    const nail = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 16), nailMat);
    nail.rotation.z = Math.PI / 2;
    nail.position.set(0, 0.15, 0);
    scene.add(nail);
    const nailTip = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.04, 16), nailMat);
    nailTip.rotation.z = -Math.PI / 2;
    nailTip.position.set(0.18, 0.15, 0);
    scene.add(nailTip);
    const nailHead = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 16), nailMat);
    nailHead.rotation.z = Math.PI / 2;
    nailHead.position.set(-0.16, 0.15, 0);
    scene.add(nailHead);

    // Coil — a group of small torii along the nail
    const coilGroup = new THREE.Group();
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb96a2f, roughness: 0.45, metalness: 0.6 });
    const coilCount = 20;
    for (let i = 0; i < coilCount; i++) {
      const t = i / (coilCount - 1);
      const x = -0.12 + t * 0.24;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.0028, 8, 24), coilMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(x, 0.15, 0);
      coilGroup.add(ring);
    }
    scene.add(coilGroup);

    // Battery + ammeter
    const battery = makeBattery({ width: 0.08, height: 0.04, depth: 0.04, label: "DC" });
    battery.position.set(-0.4, 0.04, 0);
    scene.add(battery);
    const ammeter = makeMeter({ symbol: "A", value: 1.0, unit: "A", radius: 0.04 });
    ammeter.position.set(-0.25, 0.05, 0);
    scene.add(ammeter);
    // Wires from supply → coil ends → back
    scene.add(makeWire([[-0.36, 0.08, 0], [-0.36, 0.18, 0], [-0.16, 0.18, 0]]));
    scene.add(makeWire([[0.16, 0.18, 0], [0.36, 0.18, 0], [0.36, 0.02, 0], [-0.32, 0.02, 0], [-0.32, 0.04, 0]]));

    // Paperclips dangling from tip
    const clipGroup = new THREE.Group();
    clipGroup.position.set(0.2, 0.15, 0);
    scene.add(clipGroup);

    sceneRef.current = { scene, camera, renderer, dispose, coilGroup, ammeter, clipGroup };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.12 });

    let raf;
    const animate = () => {
      // adjust coil count based on turns: just darken/lighten existing rings
      coilGroup.children.forEach((ring, i) => {
        const targetN = Math.min(coilCount, Math.round(turnsRef.current / 5));
        ring.visible = i < targetN;
      });
      ammeter.userData.setValue(currentRef.current);

      // paperclips
      const clipCount = Math.round(turnsRef.current * currentRef.current * PAPERCLIPS_PER_AMP_TURN);
      // remove excess
      while (clipGroup.children.length > clipCount) {
        const c = clipGroup.children.pop();
        c.geometry.dispose(); c.material.dispose();
      }
      // add new
      while (clipGroup.children.length < clipCount) {
        const i = clipGroup.children.length;
        const clip = new THREE.Mesh(
          new THREE.TorusGeometry(0.006, 0.0008, 6, 20),
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.7 })
        );
        clip.position.set((i % 3) * 0.008 - 0.008, -0.005 - Math.floor(i / 3) * 0.01, (i % 2) * 0.004);
        clip.rotation.x = Math.PI / 2;
        clipGroup.add(clip);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { turnsRef.current = turns; }, [turns]);
  useEffect(() => { currentRef.current = current; }, [current]);

  const clips = Math.round(turns * current * PAPERCLIPS_PER_AMP_TURN);
  const record = () => setRecorded((r) => [...r, { turns, current, clips }]);
  const reset = () => setRecorded([]);
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Electromagnetism">
      <Header
        title="Strength of an"
        accent="electromagnet"
        blurb="A coil of insulated wire wrapped around an iron nail. When current flows, the nail behaves as a magnet. Vary the current and the number of turns, and count how many paperclips the electromagnet can pick up."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-4"
            style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>turns</div>
              <select value={turns} onChange={(e) => setTurns(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm" style={{ fontFamily: mono, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.25)" }}>
                {TURNS_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>current (A)</div>
              <input type="range" min="0" max="3" step="0.1" value={current} onChange={(e) => setCurrent(parseFloat(e.target.value))} className="w-full" />
              <div className="text-sm" style={{ fontFamily: mono }}>{current.toFixed(1)} A</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record reading
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
              N×I = {(turns * current).toFixed(0)} A-turns · {clips} paperclips
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table"
            columns={["N", "I (A)", "NI", "clips"]}
            rows={recorded.length === 0
              ? [["—", "—", "—", "—"]]
              : recorded.map((r) => [r.turns, r.current.toFixed(1), (r.turns * r.current).toFixed(0), r.clips])} />
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
