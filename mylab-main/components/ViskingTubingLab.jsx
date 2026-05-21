"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, FastForward } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial, makeClampStand } from "./three/SceneKit";

const TESTS = {
  iodine_bag:       { label: "Iodine on bag contents",            expect: true,  result: "Blue-black" },
  iodine_beaker:    { label: "Iodine on beaker water",             expect: false, result: "Stays orange-brown" },
  benedicts_bag:    { label: "Benedict's + heat — bag contents",    expect: true,  result: "Brick-red precipitate" },
  benedicts_beaker: { label: "Benedict's + heat — beaker water",    expect: true,  result: "Brick-red precipitate" },
};

const QUIZ = [
  {
    q: "After 30 minutes, iodine added to the water OUTSIDE the bag stays orange-brown. What does this show?",
    options: ["No glucose has escaped from the bag", "Starch molecules are too LARGE to pass through the Visking tubing pores", "Iodine has been used up", "The bag is impermeable to water"],
    correct: 1,
  },
  {
    q: "After 30 minutes, Benedict's reagent added to the water OUTSIDE the bag gives a brick-red precipitate. What does this show?",
    options: ["Glucose is SMALL enough to pass through the Visking tubing pores", "Starch has been digested", "The water was already sugary", "The bag has burst"],
    correct: 0,
  },
  {
    q: "Visking tubing is a model of which cell structure?",
    options: ["Cell wall", "Partially permeable cell-surface membrane", "Nucleus", "Mitochondrion"],
    correct: 1,
  },
  {
    q: "Why must the OUTSIDE of the bag be washed with distilled water BEFORE submerging it in the beaker?",
    options: ["To remove any traces of starch / glucose that splashed on outside — so anything found in the beaker water has truly diffused through the membrane", "To make the bag waterproof", "To soften the bag", "To start the reaction"],
    correct: 0,
  },
];

export default function ViskingTubingLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // mirror state for the animation loop
  const tRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.45, z: 1.1, lookY: 0.22 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Clamp stand
    const stand = makeClampStand({ rodHeight: 0.55 });
    stand.position.set(0.32, 0, 0);
    scene.add(stand);
    // horizontal arm holding the bag
    const armMat = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.5 });
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.28, 12), armMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.18, 0.5, 0);
    scene.add(arm);

    // Beaker of distilled water
    const beakerR = 0.07, beakerH = 0.16;
    const beakerProfile = [
      new THREE.Vector2(0.0001, 0),
      new THREE.Vector2(beakerR - 0.002, 0),
      new THREE.Vector2(beakerR - 0.002, beakerH),
      new THREE.Vector2(beakerR, beakerH),
      new THREE.Vector2(beakerR, 0),
      new THREE.Vector2(0.0001, 0),
    ];
    const beakerMesh = new THREE.Mesh(new THREE.LatheGeometry(beakerProfile, 40), glassMaterial());
    beakerMesh.castShadow = true;
    scene.add(beakerMesh);
    // water in beaker (initially clear, gains glucose particles)
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR - 0.003, beakerR - 0.003, beakerH - 0.008, 36),
      liquidMaterial(0xa7d4ec, 0.55)
    );
    water.position.y = (beakerH - 0.008) / 2 + 0.004;
    scene.add(water);

    // Visking bag — capsule (cylinder + 2 hemispheres) suspended in water
    const bagR = 0.028, bagH = 0.085;
    const bagMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4d68b, transparent: true, opacity: 0.45,
      transmission: 0.35, roughness: 0.18, side: THREE.DoubleSide,
    });
    const bag = new THREE.Group();
    const bagCyl = new THREE.Mesh(new THREE.CylinderGeometry(bagR, bagR, bagH, 24), bagMat);
    bag.add(bagCyl);
    const bagTop = new THREE.Mesh(new THREE.SphereGeometry(bagR, 24, 16), bagMat);
    bagTop.position.y = bagH / 2;
    bag.add(bagTop);
    const bagBot = new THREE.Mesh(new THREE.SphereGeometry(bagR, 24, 16), bagMat);
    bagBot.position.y = -bagH / 2;
    bag.add(bagBot);
    bag.position.set(0, 0.08, 0);
    scene.add(bag);
    // string holding bag to arm
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0008, 0.0008, 0.3, 6),
      new THREE.MeshStandardMaterial({ color: 0xc4a06a, roughness: 0.9 })
    );
    string.position.set(0, 0.35, 0);
    scene.add(string);

    // Starch (large red-brown rectangles) — inside bag only, always stay
    const starches = [];
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.006, 0.006),
        new THREE.MeshStandardMaterial({ color: 0xa3531c, roughness: 0.6 })
      );
      // place inside bag (rough box positions)
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * (bagR - 0.005);
      mesh.position.set(Math.cos(ang) * r, (Math.random() - 0.5) * bagH * 0.8 + bag.position.y, Math.sin(ang) * r);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      starches.push(mesh);
      scene.add(mesh);
    }

    // Glucose particles — start inside bag, gradually drift out
    const NG = 40;
    const glucoses = [];
    const glucGeom = new THREE.SphereGeometry(0.0028, 8, 8);
    const glucMat = new THREE.MeshStandardMaterial({ color: 0x5fa83e, roughness: 0.4 });
    for (let i = 0; i < NG; i++) {
      const m = new THREE.Mesh(glucGeom, glucMat);
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * (bagR - 0.004);
      m.position.set(Math.cos(ang) * r, (Math.random() - 0.5) * bagH * 0.7 + bag.position.y, Math.sin(ang) * r);
      const destAng = Math.random() * Math.PI * 2;
      const destR = (bagR + 0.012) + Math.random() * (beakerR - bagR - 0.025);
      m.userData = {
        origin: m.position.clone(),
        target: new THREE.Vector3(
          Math.cos(destAng) * destR,
          Math.random() * (beakerH - 0.02) + 0.02,
          Math.sin(destAng) * destR
        ),
        escapeT: i / NG,
      };
      glucoses.push(m);
      scene.add(m);
    }

    sceneRef.current = { scene, camera, renderer, dispose, glucoses };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.22 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (runningRef.current) {
        tRef.current = Math.min(1, tRef.current + dt / 4.5);
      }
      // move glucose particles toward target based on tRef
      glucoses.forEach((g) => {
        const fraction = Math.max(0, Math.min(1, (tRef.current - g.userData.escapeT) * 3));
        g.position.lerpVectors(g.userData.origin, g.userData.target, fraction);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { tRef.current = t; }, []);

  const start = () => {
    setRunning(true);
    setTimeout(() => {
      // Approximate the timing in React state too
      const id = setInterval(() => {
        if (tRef.current >= 1) {
          clearInterval(id);
          setRunning(false);
          setT(1);
        } else {
          setT(tRef.current);
        }
      }, 100);
    }, 0);
  };
  const skip = () => { tRef.current = 1; setT(1); setRunning(false); };
  const reset = () => { tRef.current = 0; setT(0); setRunning(false); setResults({}); };
  const runTest = (key) => { if (t < 1) return; setResults((r) => ({ ...r, [key]: true })); };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Diffusion · Membrane model">
      <Header
        title="Visking tubing as a"
        accent="model membrane"
        blurb="A bag of Visking tubing containing starch and glucose solution is suspended in a beaker of distilled water. Visking tubing has microscopic pores: small molecules pass through, large ones cannot. After 30 minutes, test both the bag contents and the surrounding water for each sugar."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && t < 1 && <PrimaryButton onClick={start}>Submerge bag &amp; wait</PrimaryButton>}
            <SecondaryButton onClick={skip} disabled={t >= 1} icon={FastForward}>Skip to 30 min</SecondaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(t * 30)} min / 30 min</div>
          </div>

          {t >= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(TESTS).map(([key, td]) => {
                const done = results[key];
                return (
                  <button key={key} onClick={() => runTest(key)} disabled={done}
                    className="p-3 text-left transition active:scale-95"
                    style={{
                      backgroundColor: done ? (td.expect ? "rgba(46,125,50,0.12)" : "rgba(26,31,46,0.05)") : "rgba(26,31,46,0.06)",
                      border: `1px solid ${done ? (td.expect ? "#2e7d32" : "rgba(26,31,46,0.2)") : "rgba(26,31,46,0.2)"}`,
                    }}>
                    <div className="text-sm leading-snug mb-1" style={{ fontWeight: 500 }}>{td.label}</div>
                    {done && (
                      <div className="text-[10px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.18em", color: td.expect ? "#2e7d32" : "rgba(26,31,46,0.6)" }}>
                        {td.expect ? "+ " : "− "}{td.result}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card label="Summary">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65"> </th>
                  <th className="text-center py-1.5 opacity-65">Starch?</th>
                  <th className="text-center py-1.5 opacity-65">Glucose?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-900/8">
                  <td className="py-1.5">Bag contents</td>
                  <td className="text-center" style={{ color: "#2e7d32" }}>+ (large)</td>
                  <td className="text-center" style={{ color: "#2e7d32" }}>+ (small)</td>
                </tr>
                <tr className="border-b border-stone-900/8">
                  <td className="py-1.5">Beaker water</td>
                  <td className="text-center" style={{ color: "rgba(26,31,46,0.55)" }}>−</td>
                  <td className="text-center" style={{ color: "#2e7d32" }}>+</td>
                </tr>
              </tbody>
            </table>
            <div className="text-xs opacity-75 leading-snug mt-3">
              Starch has not crossed the membrane (molecules are too large). Glucose has diffused into the surrounding water (small enough to pass).
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
