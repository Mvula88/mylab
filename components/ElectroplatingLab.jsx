"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, Pause } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, StatGrid, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBattery, makeMeter, makeWire, glassMaterial, liquidMaterial } from "./three/SceneKit";

const CURRENT = 0.50;
const F = 96500;
const Cu_AR = 63.5;
const PLATE_DURATION_S = 1200;
const REAL_DURATION_MS = 8000;

const QUIZ = [
  { q: "Which electrode must the OBJECT TO BE PLATED be connected to?",
    options: ["The anode (positive)", "The cathode (negative) — positive Cu²⁺ ions migrate there and are reduced", "Either", "Neither"], correct: 1 },
  { q: "Why is the OTHER electrode made of PURE COPPER?",
    options: ["Copper is heavier", "It dissolves into solution as plating progresses, replacing Cu²⁺ ions used at the cathode", "Better conductor than carbon", "Looks attractive"], correct: 1 },
  { q: "Half-equation at the CATHODE (zinc plate):",
    options: ["Cu → Cu²⁺ + 2e⁻", "Cu²⁺ + 2e⁻ → Cu", "Zn → Zn²⁺ + 2e⁻", "2H⁺ + 2e⁻ → H₂"], correct: 1 },
  { q: "Using F = 96500 C mol⁻¹ and Ar(Cu) = 63.5, what mass of Cu would 0.50 A for 1200 s deposit?",
    options: ["0.10 g", "0.20 g — (0.50 × 1200) / 96500 ÷ 2 × 63.5", "1.00 g", "3.00 g"], correct: 1 },
];

export default function ElectroplatingLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const runRef = useRef(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.0, lookY: 0.2 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Beaker of CuSO4
    const bR = 0.08, bH = 0.16;
    const beaker = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0), new THREE.Vector2(bR - 0.003, 0),
        new THREE.Vector2(bR - 0.003, bH), new THREE.Vector2(bR, bH),
        new THREE.Vector2(bR, 0), new THREE.Vector2(0.0001, 0),
      ], 36),
      glassMaterial()
    );
    scene.add(beaker);
    const cuso4 = new THREE.Mesh(
      new THREE.CylinderGeometry(bR - 0.005, bR - 0.005, 0.135, 36),
      liquidMaterial(0x2476b3, 0.6)
    );
    cuso4.position.y = 0.075;
    scene.add(cuso4);

    // Zinc plate (cathode, left) — silver plate, gets copper coating
    const zinc = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.18, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.4, metalness: 0.7 })
    );
    zinc.position.set(-0.035, 0.09, 0);
    scene.add(zinc);
    // copper coating overlay (scale grows with progress)
    const coating = new THREE.Mesh(
      new THREE.BoxGeometry(0.019, 0.18, 0.041),
      new THREE.MeshStandardMaterial({ color: 0xb96a2f, roughness: 0.5, metalness: 0.4, transparent: true, opacity: 0 })
    );
    coating.position.set(-0.035, 0.09, 0);
    scene.add(coating);

    // Copper plate (anode, right) — shrinks slightly
    const copper = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.18, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xb96a2f, roughness: 0.5, metalness: 0.4 })
    );
    copper.position.set(0.035, 0.09, 0);
    scene.add(copper);

    // Labels
    const makeLabel = (text, x) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.12, 0.03, 1);
      sprite.position.set(x, 0.22, 0);
      return sprite;
    };
    scene.add(makeLabel("Zn (−)", -0.035));
    scene.add(makeLabel("Cu (+)", 0.035));

    // Battery + ammeter above
    const battery = makeBattery({ width: 0.1, height: 0.05, depth: 0.05, label: "DC SUPPLY" });
    battery.position.set(-0.18, 0.36, 0);
    scene.add(battery);
    const ammeter = makeMeter({ symbol: "A", value: CURRENT, unit: "A", radius: 0.05 });
    ammeter.position.set(0.16, 0.4, 0);
    scene.add(ammeter);

    // wires from battery / ammeter to electrodes
    scene.add(makeWire([[-0.13, 0.42, 0], [-0.035, 0.42, 0], [-0.035, 0.18, 0]]));
    scene.add(makeWire([[-0.08, 0.42, 0], [0.10, 0.42, 0]]));
    scene.add(makeWire([[0.21, 0.4, 0], [0.21, 0.42, 0], [0.035, 0.42, 0], [0.035, 0.18, 0]]));

    // Cu²⁺ ions drifting from anode to cathode (sprites)
    const ionGroup = new THREE.Group();
    const ionMat = new THREE.MeshBasicMaterial({ color: 0x67c5e8, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 10; i++) {
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.003, 8, 6), ionMat);
      ion.userData = { t: Math.random(), y: 0.04 + Math.random() * 0.12 };
      ionGroup.add(ion);
    }
    scene.add(ionGroup);

    sceneRef.current = { scene, camera, renderer, dispose, coating, copper, ionGroup, ammeter };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.2 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(PLATE_DURATION_S, tRef.current + dt * (PLATE_DURATION_S / (REAL_DURATION_MS / 1000)));

      const k = tRef.current / PLATE_DURATION_S;
      coating.material.opacity = Math.min(1, k);
      copper.scale.x = 1 - k * 0.2;

      // ion drift
      if (runRef.current) {
        ionGroup.children.forEach((ion) => {
          ion.userData.t += dt * 0.6;
          if (ion.userData.t > 1) { ion.userData.t = 0; ion.userData.y = 0.04 + Math.random() * 0.12; }
          ion.position.set(0.025 - ion.userData.t * 0.06, ion.userData.y, 0);
          ion.material.opacity = 0.85 * (1 - Math.pow(2 * ion.userData.t - 1, 2));
        });
      }

      ammeter.userData.setValue(runRef.current ? CURRENT : 0);

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
      setT(tRef.current);
      if (tRef.current >= PLATE_DURATION_S) { clearInterval(id); setRunning(false); }
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setT(0); tRef.current = 0; };

  const charge = CURRENT * t;
  const moleE = charge / F;
  const moleCu = moleE / 2;
  const massCu = moleCu * Cu_AR;
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Electrochemistry · Electroplating">
      <Header
        title="Electroplating zinc with"
        accent="copper"
        blurb="A clean zinc plate (cathode) and a copper plate (anode) are dipped in copper(II) sulfate solution and connected to a battery. When current flows, the zinc plate gains a copper coating while the copper plate dissolves. Constant current and time → predictable mass of copper deposited."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/10", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && t < PLATE_DURATION_S ? <PrimaryButton onClick={start} icon={Play}>{t === 0 ? "Close circuit" : "Resume"}</PrimaryButton>
              : running ? <SecondaryButton onClick={pause} icon={Pause}>Pause</SecondaryButton> : null}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(t)} s · I = {CURRENT.toFixed(2)} A</div>
          </div>

          <StatGrid cols={3}>
            <Stat label="Charge passed" value={`${charge.toFixed(0)} C`} />
            <Stat label="Moles of e⁻" value={`${(moleE * 1e3).toFixed(2)} × 10⁻³`} />
            <Stat label="Mass of Cu deposited" value={`${massCu.toFixed(3)} g`} highlight={t >= PLATE_DURATION_S} />
          </StatGrid>
        </div>
        <div className="lg:col-span-5">
          <Card label="Half-equations">
            <div className="space-y-2" style={{ fontFamily: mono }}>
              <div>
                <div className="text-[10px] opacity-65 uppercase" style={{ letterSpacing: "0.18em" }}>at the cathode (zinc plate)</div>
                <div className="text-sm">Cu²⁺(aq) + 2e⁻ → Cu(s)</div>
                <div className="text-xs opacity-70 mt-0.5">Copper deposits as a layer on the zinc.</div>
              </div>
              <div className="border-t border-stone-900/10 pt-2">
                <div className="text-[10px] opacity-65 uppercase" style={{ letterSpacing: "0.18em" }}>at the anode (copper plate)</div>
                <div className="text-sm">Cu(s) → Cu²⁺(aq) + 2e⁻</div>
                <div className="text-xs opacity-70 mt-0.5">Copper dissolves to replenish [Cu²⁺] in solution.</div>
              </div>
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
