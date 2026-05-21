"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, Pause, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const ORGANISMS = [
  { id: "peas",   name: "Germinating peas (5 g)", mass: 5.0, uptakeRate: 0.65, colour: 0x9bc36a },
  { id: "maggot", name: "Maggots (3 g)",           mass: 3.0, uptakeRate: 2.2,  colour: 0xf0e6c2 },
  { id: "wood",   name: "Woodlice (2 g)",          mass: 2.0, uptakeRate: 3.4,  colour: 0x8a7a5c },
  { id: "dead",   name: "Boiled peas (control)",   mass: 5.0, uptakeRate: 0.0,  colour: 0xaa8e6a },
];
const DURATION_MIN = 5;
const SIM_SECONDS = 8;
const CAPILLARY_AREA = 0.785;

const QUIZ = [
  { q: "What is the purpose of the KOH in each chamber?",
    options: ["Absorb water vapour", "Absorb the CO₂ produced by respiration, so the manometer measures only O₂ uptake", "Kill bacteria", "Keep the organism warm"], correct: 1 },
  { q: "Why is a SECOND identical apparatus set up alongside?",
    options: ["For duplicate accuracy", "To correct for changes in pressure or temperature in the room (control)", "Absorb extra CO₂", "Compare colours"], correct: 1 },
  { q: "Why is rate calculated PER GRAM of tissue?",
    options: ["Mass changes during respiration", "To compare organisms of different sizes on an equal footing", "Volume is hard to measure", "O₂ reacts with grams"], correct: 1 },
  { q: "At 30 °C instead of 20 °C, you would expect the rate to:",
    options: ["Stay the same", "Decrease", "Increase — respiratory enzymes work faster within tolerated range", "Reverse direction"], correct: 2 },
];

export default function RespirometerLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [orgId, setOrgId] = useState(ORGANISMS[0].id);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const orgRef = useRef(ORGANISMS[0]);
  const timeRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.0, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Chamber (sealed boiling tube on its side, but vertical for ease)
    const chamber = new THREE.Group();
    const chamberBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.16, 24),
      glassMaterial()
    );
    chamberBody.position.y = 0.08;
    chamber.add(chamberBody);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.008, 24),
      new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.6 })
    );
    cap.position.y = 0.164;
    chamber.add(cap);

    // Mesh divider
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.033, 0.033, 0.002, 24),
      new THREE.MeshStandardMaterial({ color: 0x666, roughness: 0.7, metalness: 0.5, transparent: true, opacity: 0.6 })
    );
    mesh.position.y = 0.085;
    chamber.add(mesh);

    // KOH below
    const koh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.033, 0.033, 0.06, 24),
      liquidMaterial(0xc8d9e6, 0.7)
    );
    koh.position.y = 0.05;
    chamber.add(koh);

    // Organism above mesh
    const organism = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const o = new THREE.Mesh(
        new THREE.SphereGeometry(0.006, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x9bc36a, roughness: 0.6 })
      );
      o.position.set((Math.random() - 0.5) * 0.05, 0.1 + Math.random() * 0.05, (Math.random() - 0.5) * 0.05);
      organism.add(o);
    }
    chamber.add(organism);

    chamber.position.set(-0.3, 0, 0);
    scene.add(chamber);

    // Capillary tube (horizontal exit)
    const capillary = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.4, 12),
      glassMaterial({ opacity: 0.45 })
    );
    capillary.rotation.z = Math.PI / 2;
    capillary.position.set(0.0, 0.13, 0);
    scene.add(capillary);

    // U-tube manometer (right)
    const uMat = glassMaterial({ opacity: 0.45 });
    const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 12), uMat);
    tube1.position.set(0.2, 0.09, 0);
    scene.add(tube1);
    const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 12), uMat);
    tube2.position.set(0.3, 0.09, 0);
    scene.add(tube2);
    const uBend = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.005, 8, 24, Math.PI),
      uMat
    );
    uBend.position.set(0.25, 0.0, 0);
    uBend.rotation.x = -Math.PI / 2;
    uBend.rotation.z = Math.PI;
    scene.add(uBend);

    // Manometer fluid
    const fluidMat = liquidMaterial(0xc2185b, 0.85);
    const fluidL = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.08, 12), fluidMat);
    fluidL.position.set(0.2, 0.04, 0);
    scene.add(fluidL);
    const fluidR = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.08, 12), fluidMat);
    fluidR.position.set(0.3, 0.04, 0);
    scene.add(fluidR);

    sceneRef.current = { scene, camera, renderer, dispose, organism, fluidL, fluidR };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      const org = orgRef.current;
      if (runRef.current) timeRef.current = Math.min(DURATION_MIN, timeRef.current + dt * (DURATION_MIN / SIM_SECONDS));

      // organism colour
      organism.children.forEach((c) => c.material.color.setHex(org.colour));
      // manometer fluid shifts toward organism (left side rises, right falls)
      const distance = (org.uptakeRate * org.mass / CAPILLARY_AREA) * timeRef.current;
      const shift = Math.min(0.04, distance * 0.0008);
      fluidL.position.y = 0.04 + shift;
      fluidL.scale.y = 1 + shift * 10;
      fluidR.position.y = 0.04 - shift;
      fluidR.scale.y = 1 - shift * 10;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { orgRef.current = ORGANISMS.find((o) => o.id === orgId); }, [orgId]);
  useEffect(() => {
    runRef.current = running;
    if (!running) return;
    const id = setInterval(() => {
      setTime(timeRef.current);
      if (timeRef.current >= DURATION_MIN) {
        clearInterval(id);
        setRunning(false);
        const org = orgRef.current;
        const finalDistance = (org.uptakeRate * org.mass / CAPILLARY_AREA) * DURATION_MIN;
        setResults((r) => ({ ...r, [orgId]: { distance: finalDistance, rate: org.uptakeRate, mass: org.mass } }));
      }
    }, 80);
    return () => clearInterval(id);
  }, [running, orgId]);

  const org = ORGANISMS.find((o) => o.id === orgId);
  const distance = (org.uptakeRate * org.mass / CAPILLARY_AREA) * time;
  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const switchOrg = (id) => { setRunning(false); setOrgId(id); setTime(0); timeRef.current = 0; };
  const reset = () => { setRunning(false); setTime(0); timeRef.current = 0; };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Respiration · Respirometer">
      <Header
        title="Comparing rate of"
        accent="respiration in different organisms"
        blurb="The organism sits in a sealed tube with KOH (absorbs CO₂). As it respires, O₂ is consumed and pressure drops. The manometer fluid moves toward the organism. Distance moved ÷ time → rate of O₂ uptake."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {ORGANISMS.map((o) => {
              const isActive = o.id === orgId;
              const done = !!results[o.id];
              return (
                <button key={o.id} onClick={() => switchOrg(o.id)}
                  className="relative p-2 transition active:scale-95"
                  style={{
                    backgroundColor: isActive ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                    border: `1px solid ${isActive ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                    color: isActive ? "#e8e4d8" : "#1a1f2e",
                  }}>
                  <div className="text-[10px] leading-tight">{o.name}</div>
                  {done && (
                    <div className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ backgroundColor: "#2e7d32" }}>
                      <CheckCircle2 size={11} color="#e8e4d8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2">
            {time < DURATION_MIN && (running
              ? <SecondaryButton onClick={pause} icon={Pause}>Pause</SecondaryButton>
              : <PrimaryButton onClick={start} icon={Play}>{time === 0 ? "Start 5-min run" : "Resume"}</PrimaryButton>)}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {time.toFixed(2)} min · d = {distance.toFixed(1)} mm</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Results table">
            <table className="w-full text-xs" style={{ fontFamily: mono }}>
              <thead>
                <tr className="border-b border-stone-900/15">
                  <th className="text-left py-1.5 opacity-65">Organism</th>
                  <th className="text-right py-1.5 opacity-65">d (mm)</th>
                  <th className="text-right py-1.5 opacity-65">μL O₂ /g /min</th>
                </tr>
              </thead>
              <tbody>
                {ORGANISMS.map((o) => {
                  const r = results[o.id];
                  return (
                    <tr key={o.id} className="border-b border-stone-900/8">
                      <td className="py-1.5">{o.name.split(" (")[0]}</td>
                      <td className="text-right py-1.5">{r ? r.distance.toFixed(1) : "—"}</td>
                      <td className="text-right py-1.5" style={{ color: r && r.rate > 0 ? "#2e7d32" : undefined }}>
                        {r ? r.rate.toFixed(2) : "—"}
                      </td>
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
