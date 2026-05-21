"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBattery, makeMeter, makeWire, glassMaterial, liquidMaterial } from "./three/SceneKit";

const VOLTAGE = 12.0;
const CURRENT = 4.0;
const POWER = VOLTAGE * CURRENT;
const MASS = 0.200;
const C_TRUE = 4180;
const T_INITIAL = 20.0;
const EFFICIENCY = 0.86;
const DURATION_S = 360;
const REAL_DURATION_MS = 8000;

const QUIZ = [
  { q: "Which equation links electrical input to heat produced?",
    options: ["P = V × I, and Q = Pt = VIt", "Q = m g h", "Q = V + I + t", "Q = V²t"], correct: 0 },
  { q: "Specific heat capacity is defined as:",
    options: ["Heat per unit mass per °C temperature rise (Q = mcΔT)", "Heat to boil 1 kg of water", "Total heat the substance contains", "Energy per metre travelled"], correct: 0 },
  { q: "The experimental c usually comes out HIGHER than 4180. Why?",
    options: ["Heater overcounts energy", "Not all heat enters the water — some lost to surroundings, beaker, heater. Less ΔT → apparent c is higher", "Water is incompressible", "Electronic fault"], correct: 1 },
  { q: "12 V × 4 A heats 200 g of water for 5 min. ΔT = 17 °C. Calculate c.",
    options: ["≈ 4240 J/kg/K  (VIt=14 400; c = 14400 / (0.2 × 17))", "≈ 2120", "≈ 8480", "≈ 100"], correct: 0 },
];

export default function SpecificHeatLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const tRef = useRef(0);
  const runRef = useRef(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.1, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.8, depth: 0.7 }));

    // Insulated beaker (cylinder with foam wrap)
    const beakerR = 0.07, beakerH = 0.14;
    const beaker = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0), new THREE.Vector2(beakerR - 0.003, 0),
        new THREE.Vector2(beakerR - 0.003, beakerH), new THREE.Vector2(beakerR, beakerH),
        new THREE.Vector2(beakerR, 0), new THREE.Vector2(0.0001, 0),
      ], 36),
      glassMaterial()
    );
    scene.add(beaker);
    const foam = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR + 0.01, beakerR + 0.01, beakerH, 36, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xfdfaf0, roughness: 0.95, side: THREE.DoubleSide })
    );
    foam.position.y = beakerH / 2;
    scene.add(foam);
    // water (heats up — colour drifts)
    const waterMat = liquidMaterial(0xa7d4ec, 0.65);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR - 0.005, beakerR - 0.005, beakerH - 0.01, 36),
      waterMat
    );
    water.position.y = (beakerH - 0.01) / 2 + 0.005;
    scene.add(water);

    // Immersion heater (cylinder hanging into water with coil at bottom)
    const heaterMat = new THREE.MeshStandardMaterial({ color: 0x888, roughness: 0.5, metalness: 0.6 });
    const heaterShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 12), heaterMat);
    heaterShaft.position.set(-0.025, 0.18, 0);
    scene.add(heaterShaft);
    // glowing coil
    const coilGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const c = new THREE.Mesh(
        new THREE.TorusGeometry(0.022, 0.0025, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0x666, roughness: 0.4, emissive: 0x000000, emissiveIntensity: 0 })
      );
      c.rotation.x = Math.PI / 2;
      c.position.set(-0.025, 0.04 + i * 0.02, 0);
      coilGroup.add(c);
    }
    scene.add(coilGroup);

    // Thermometer
    const thMat = glassMaterial({ opacity: 0.55 });
    const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.2, 12), thMat);
    thermo.position.set(0.03, 0.18, 0);
    scene.add(thermo);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.005, 12, 8), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    bulb.position.set(0.03, 0.06, 0);
    scene.add(bulb);
    const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.0023, 0.0023, 0.05, 12), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    mercury.position.set(0.03, 0.085, 0);
    scene.add(mercury);

    // Battery + Voltmeter + Ammeter
    const battery = makeBattery({ width: 0.1, height: 0.05, depth: 0.04, label: "DC 12V" });
    battery.position.set(-0.5, 0.04, 0);
    scene.add(battery);
    const voltmeter = makeMeter({ symbol: "V", value: VOLTAGE, unit: "V", radius: 0.05 });
    voltmeter.position.set(-0.32, 0.3, 0);
    scene.add(voltmeter);
    const ammeter = makeMeter({ symbol: "A", value: CURRENT, unit: "A", radius: 0.05 });
    ammeter.position.set(-0.32, 0.18, 0);
    scene.add(ammeter);
    // Wires
    scene.add(makeWire([[-0.46, 0.06, 0], [-0.46, 0.18, 0], [-0.37, 0.18, 0]]));
    scene.add(makeWire([[-0.27, 0.18, 0], [-0.025, 0.18, 0], [-0.025, 0.28, 0]]));
    scene.add(makeWire([[-0.025, 0.28, 0], [-0.42, 0.28, 0], [-0.42, 0.06, 0]]));

    sceneRef.current = { scene, camera, renderer, dispose, mercury, waterMat, coilGroup, voltmeter, ammeter };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(DURATION_S, tRef.current + dt * (DURATION_S / (REAL_DURATION_MS / 1000)));

      const deltaT = (EFFICIENCY * POWER * tRef.current) / (MASS * C_TRUE);
      const temp = T_INITIAL + deltaT;
      // mercury height
      const tFrac = Math.max(0, Math.min(1, (temp - 0) / 110));
      mercury.scale.y = tFrac * 5;
      mercury.position.y = 0.06 + (tFrac * 0.25) / 2;
      // water colour shift to slightly warmer
      waterMat.color.lerp(new THREE.Color(0xf0d4a8), Math.min(1, deltaT / 70) * 0.02);
      // glowing coil when running
      coilGroup.children.forEach((c) => {
        c.material.emissive.setHex(runRef.current ? 0xff5520 : 0x000000);
        c.material.emissiveIntensity = runRef.current ? 0.8 : 0;
      });

      voltmeter.userData.setValue(runRef.current ? VOLTAGE : 0);
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
      if (tRef.current >= DURATION_S) { clearInterval(id); setRunning(false); }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const deltaT = (EFFICIENCY * POWER * t) / (MASS * C_TRUE);
  const apparentC = t > 0 ? (POWER * t) / (MASS * deltaT) : null;

  const start = () => setRunning(true);
  const reset = () => { setRunning(false); setT(0); tRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Thermal · Specific heat capacity">
      <Header
        title="Specific heat capacity of"
        accent="water"
        blurb="An immersion heater of known power heats a measured mass of water in an insulated beaker. The temperature rise after a known time gives the specific heat capacity using Q = mcΔT — and the difference between the calculated value and the true 4180 J/kg/K reveals how much heat is lost to the surroundings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && t < DURATION_S && <PrimaryButton onClick={start} icon={Play}>{t === 0 ? "Switch heater on" : "Resume"}</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(t)} s</div>
          </div>

          <StatGrid cols={3}>
            <Stat label="V" value={`${VOLTAGE.toFixed(1)} V`} />
            <Stat label="I" value={`${CURRENT.toFixed(1)} A`} />
            <Stat label="P = VI" value={`${POWER.toFixed(0)} W`} />
            <Stat label="Mass" value={`${MASS.toFixed(3)} kg`} />
            <Stat label="ΔT" value={`${deltaT.toFixed(1)} K`} />
            <Stat label="c (apparent)" value={apparentC ? `${apparentC.toFixed(0)} J/kg/K` : "—"} highlight={t >= DURATION_S} />
          </StatGrid>
        </div>
        <div className="lg:col-span-5">
          <Card label="Calculation">
            <div className="text-sm" style={{ fontFamily: mono }}>VIt = mcΔT</div>
            <div className="text-sm mt-1" style={{ fontFamily: mono }}>c = (V × I × t) / (m × ΔT)</div>
            {t > 30 && (
              <div className="text-xs mt-3 leading-snug" style={{ fontFamily: mono }}>
                = ({VOLTAGE} × {CURRENT} × {t.toFixed(0)}) / ({MASS} × {deltaT.toFixed(2)})
                <br />
                = {(POWER * t).toFixed(0)} J / {(MASS * deltaT).toFixed(2)} kg·K
                <br />
                <span style={{ color: "#c2185b", fontWeight: 600 }}>= {apparentC?.toFixed(0)} J/kg/K</span>
              </div>
            )}
            <div className="text-xs opacity-75 leading-snug mt-3 border-t border-stone-900/15 pt-3">
              Published value: <strong>4180 J/kg/K</strong>. Difference is heat lost to beaker / surroundings / heater (~{(100 * (1 - EFFICIENCY)).toFixed(0)} %).
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
