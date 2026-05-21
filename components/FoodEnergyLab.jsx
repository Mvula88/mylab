"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Flame, RotateCcw, CheckCircle2, XCircle, Award } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card, StatGrid, Stat } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeClampStand, glassMaterial, liquidMaterial } from "./three/SceneKit";

const SAMPLES = [
  { id: "peanut",      name: "Peanut",       mass: 0.45, deltaT: 56.0, published: 24.0, colour: 0xcaa476 },
  { id: "cashew",      name: "Cashew",       mass: 0.55, deltaT: 68.5, published: 25.0, colour: 0xe8c98f },
  { id: "marshmallow", name: "Marshmallow",  mass: 0.80, deltaT: 50.0, published: 14.0, colour: 0xfdfaf0 },
  { id: "crisp",       name: "Potato crisp", mass: 0.30, deltaT: 32.5, published: 22.0, colour: 0xe7c170 },
  { id: "pasta",       name: "Dry pasta",    mass: 0.60, deltaT: 41.5, published: 16.0, colour: 0xdbb872 },
  { id: "bread",       name: "Toasted bread",mass: 0.50, deltaT: 21.0, published: 10.0, colour: 0xb58c5b },
];
const C_WATER = 4.18;
const MASS_WATER = 20;

const PHASES = { IDLE: "idle", READY: "ready", IGNITING: "igniting", BURNING: "burning", FINAL: "final", DONE: "done" };

export default function FoodEnergyLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [tInitial, setTInitial] = useState(null);
  const [tFinal, setTFinal] = useState(null);
  const [tNow, setTNow] = useState(20.0);
  const [results, setResults] = useState({});
  const [userQ, setUserQ] = useState("");
  const [userQpg, setUserQpg] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const sample = SAMPLES.find((s) => s.id === sampleId);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const sampleRef = useRef(sample);
  sampleRef.current = sample;
  const tempRef = useRef(20);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.4, y: 0.6, z: 1.1, lookY: 0.3 },
    });
    scene.add(makeBench({ width: 2.2, depth: 0.7 }));

    // Clamp stand
    const stand = makeClampStand({ rodHeight: 0.6 });
    stand.position.set(0.2, 0, 0);
    scene.add(stand);
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 })
    );
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.05, 0.42, 0);
    scene.add(arm);

    // Boiling tube
    const tubeOuter = [
      new THREE.Vector2(0.0001, 0),
      new THREE.Vector2(0.027, 0.005),
      new THREE.Vector2(0.027, 0.18),
      new THREE.Vector2(0.029, 0.18),
      new THREE.Vector2(0.029, 0),
      new THREE.Vector2(0.0001, 0),
    ];
    const tube = new THREE.Mesh(new THREE.LatheGeometry(tubeOuter, 28), glassMaterial());
    tube.position.set(-0.06, 0.27, 0);
    tube.castShadow = true;
    scene.add(tube);
    // 20 ml water
    const waterMat = liquidMaterial(0xa7d4ec, 0.65);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 24), waterMat);
    water.position.set(-0.06, 0.32, 0);
    scene.add(water);

    // Thermometer
    const thermoMat = glassMaterial({ opacity: 0.55 });
    const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.26, 12), thermoMat);
    thermo.position.set(-0.06, 0.36, 0);
    scene.add(thermo);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.005, 12, 8), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    bulb.position.set(-0.06, 0.27, 0);
    scene.add(bulb);
    // mercury column
    const mercuryMat = new THREE.MeshStandardMaterial({ color: 0xc2185b });
    const mercury = new THREE.Mesh(new THREE.CylinderGeometry(0.0023, 0.0023, 0.05, 12), mercuryMat);
    mercury.position.set(-0.06, 0.295, 0);
    scene.add(mercury);

    // Food on needle stand
    const needleStand = new THREE.Group();
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.012, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x6a4a26, roughness: 0.85 })
    );
    block.position.set(-0.06, 0.006, 0);
    needleStand.add(block);
    const needle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0015, 0.0015, 0.13, 8),
      new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.5, metalness: 0.8 })
    );
    needle.position.set(-0.06, 0.075, 0);
    needleStand.add(needle);
    scene.add(needleStand);

    // food sample sphere (colour swapped per sample)
    const food = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xcaa476, roughness: 0.6 })
    );
    food.position.set(-0.06, 0.14, 0);
    food.castShadow = true;
    scene.add(food);

    // flame (orange + blue inner)
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.012, 0.06, 16),
      new THREE.MeshBasicMaterial({ color: 0xf7a82a, transparent: true, opacity: 0.85 })
    );
    flame.position.set(-0.06, 0.18, 0);
    flame.visible = false;
    scene.add(flame);
    const flameCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.005, 0.03, 12),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.95 })
    );
    flameCore.position.set(-0.06, 0.165, 0);
    flameCore.visible = false;
    scene.add(flameCore);

    // smoke wisps when burning
    const smokeGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.5 })
      );
      s.userData = { t: Math.random(), x: (Math.random() - 0.5) * 0.02 };
      s.visible = false;
      smokeGroup.add(s);
    }
    scene.add(smokeGroup);

    sceneRef.current = {
      scene, camera, renderer, dispose,
      food, flame, flameCore, mercury, water, waterMat, smokeGroup, bulb,
    };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.3 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const p = phaseRef.current;
      const samp = sampleRef.current;

      // food colour
      food.material.color.setHex(samp.colour);

      // mercury height scales with tempRef (20..100°C → 0..0.10)
      const tempK = Math.max(0, Math.min(1, (tempRef.current - 0) / 110));
      mercury.scale.y = tempK * 5;
      mercury.position.y = 0.273 + (tempK * 0.25 / 2);

      // flame & burning state
      if (p === PHASES.BURNING || p === PHASES.IGNITING) {
        flame.visible = true; flameCore.visible = true;
        // flicker
        const flick = 0.85 + Math.sin(now / 50) * 0.15;
        flame.scale.set(flick, flick, flick);
        flameCore.scale.set(flick, flick, flick);
        // smoke
        smokeGroup.children.forEach((s) => {
          if (!s.visible && Math.random() < 0.04) {
            s.visible = true;
            s.userData.t = 0;
            s.position.set(food.position.x + (Math.random() - 0.5) * 0.02, 0.21, food.position.z + (Math.random() - 0.5) * 0.02);
            s.scale.setScalar(0.4);
            s.material.opacity = 0.45;
          }
          if (s.visible) {
            s.userData.t += dt * 0.4;
            s.position.y += dt * 0.07;
            s.scale.setScalar(0.4 + s.userData.t * 0.8);
            s.material.opacity = 0.45 * (1 - s.userData.t);
            if (s.userData.t > 1) s.visible = false;
          }
        });
      } else {
        flame.visible = false; flameCore.visible = false;
        smokeGroup.children.forEach((s) => { s.visible = false; });
      }

      // shrink food while burning (driven by tempRef → relative to deltaT)
      if (p === PHASES.BURNING) {
        const burnedFrac = Math.min(1, (tempRef.current - (tInitial ?? 20)) / samp.deltaT);
        food.scale.setScalar(Math.max(0.2, 1 - burnedFrac * 0.7));
        food.material.color.setHex(lerpHex(samp.colour, 0x1a0a06, burnedFrac));
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { tempRef.current = tNow; }, [tNow]);

  /* Procedure phases */
  useEffect(() => {
    if (phase !== PHASES.BURNING) return;
    const startTemp = tInitial;
    const target = tInitial + sample.deltaT;
    const start = performance.now();
    const dur = 4500;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 2);
      setTNow(startTemp + (target - startTemp) * eased);
      if (k < 1) requestAnimationFrame(tick);
      else { setTFinal(target); setPhase(PHASES.FINAL); }
    };
    requestAnimationFrame(tick);
  }, [phase, tInitial, sample.deltaT]);

  const begin = () => { setPhase(PHASES.READY); setTInitial(20); setTNow(20); };
  const ignite = () => {
    setPhase(PHASES.IGNITING);
    setTimeout(() => setPhase(PHASES.BURNING), 700);
  };
  const acceptFinal = () => setPhase(PHASES.DONE);
  const switchSample = (id) => {
    setSampleId(id); setPhase(PHASES.IDLE); setTInitial(null); setTFinal(null); setTNow(20);
    setUserQ(""); setUserQpg("");
  };
  const submitCalc = () => {
    const dT = tFinal - tInitial;
    const trueQ = MASS_WATER * C_WATER * dT;
    const trueQpg = trueQ / sample.mass / 1000;
    const percent = (trueQpg / sample.published) * 100;
    setResults((r) => ({ ...r, [sampleId]: { tInitial, tFinal, dT, q: trueQ, qPerGram: trueQpg, percent, userQ: parseFloat(userQ), userQpg: parseFloat(userQpg) } }));
  };

  const expectedQ = phase === PHASES.DONE && tFinal != null ? +(MASS_WATER * C_WATER * (tFinal - tInitial)).toFixed(0) : null;
  const expectedQpg = phase === PHASES.DONE && tFinal != null ? +((MASS_WATER * C_WATER * (tFinal - tInitial)) / sample.mass / 1000).toFixed(1) : null;
  const qOK = userQ !== "" && expectedQ != null && Math.abs(parseFloat(userQ) - expectedQ) < expectedQ * 0.03;
  const qpgOK = userQpg !== "" && expectedQpg != null && Math.abs(parseFloat(userQpg) - expectedQpg) < 0.5;
  const result = results[sampleId];
  const completed = Object.keys(results).length;

  const QUIZ = [
    { q: "Which equation links electrical input to heat produced?", options: ["q = m × c × ΔT", "q = m × g × h", "q = V × t", "q = ΔT × t"], correct: 0 },
    { q: "Why is the experimental energy per gram usually MUCH LOWER than the published value?", options: ["The food contains extra water", "Heat is lost to surroundings, beaker glass, and incomplete combustion — only a fraction reaches the water", "Calorimetry is flawed by design", "The thermometer reads low"], correct: 1 },
    { q: "Why use a SMALL mass of food (less than 1 g)?", options: ["So the temperature rise fits on the thermometer scale and the run completes quickly", "The food shouldn't taste burnt", "Big pieces won't fit on the needle", "Bigger samples react more slowly"], correct: 0 },
    { q: "Specific heat capacity of water:", options: ["4.18 J/g/K", "1 J/g/K", "0.418 J/g/K", "418 J/g/K"], correct: 0 },
  ];
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Food & nutrition · Calorimetry">
      <Header
        title="Energy content of food by"
        accent="combustion calorimetry"
        blurb="Burn a food sample under a boiling tube of 20 cm³ water. Read the temperature rise. Calculate the energy released per gram using q = mcΔT and compare to the published value."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
            {SAMPLES.map((s) => {
              const done = !!results[s.id];
              const active = s.id === sampleId;
              return (
                <button key={s.id} onClick={() => switchSample(s.id)}
                  className="relative p-2 transition active:scale-95"
                  style={{
                    backgroundColor: active ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                    border: `1px solid ${active ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                    color: active ? "#e8e4d8" : "#1a1f2e",
                  }}>
                  <div className="text-[10px] leading-tight">{s.name}</div>
                  <div className="text-[9px] opacity-65 mt-0.5" style={{ fontFamily: mono }}>{s.mass.toFixed(2)} g</div>
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
            style={{ aspectRatio: "16/10", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {phase === PHASES.IDLE && <PrimaryButton onClick={begin}>1 · Take initial reading</PrimaryButton>}
            {phase === PHASES.READY && <PrimaryButton onClick={ignite} icon={Flame}>2 · Ignite sample</PrimaryButton>}
            {(phase === PHASES.IGNITING || phase === PHASES.BURNING) && (
              <div className="py-2.5 px-4 text-[11px] uppercase inline-flex items-center gap-2"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                <Flame size={13} color="#c2185b" /> Burning…
              </div>
            )}
            {phase === PHASES.FINAL && <PrimaryButton onClick={acceptFinal}>3 · Record final temperature</PrimaryButton>}
            {phase === PHASES.DONE && <SecondaryButton onClick={() => switchSample(sampleId)} icon={RotateCcw}>Restart this sample</SecondaryButton>}
          </div>

          {phase !== PHASES.IDLE && (
            <StatGrid cols={3}>
              <Stat label="m (water)" value={`${MASS_WATER} g`} />
              <Stat label="T initial" value={tInitial != null ? `${tInitial.toFixed(1)} °C` : "—"} />
              <Stat label="T final" value={tFinal != null ? `${tFinal.toFixed(1)} °C` : phase === PHASES.BURNING ? `${tNow.toFixed(1)} °C` : "—"} />
            </StatGrid>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card label="Equation">
            <div className="text-base mb-1" style={{ fontFamily: mono, fontWeight: 500 }}>q = m × c × ΔT</div>
            <div className="text-xs opacity-70 leading-snug">
              m = mass of water (g) · c = 4.18 J g⁻¹ K⁻¹ · ΔT = temp rise (°C). Per-gram value: q ÷ m_food.
            </div>
          </Card>

          {phase === PHASES.DONE && !result && (
            <div className="mt-4">
              <Card label="Your turn · calculate">
                <div className="text-xs opacity-75 mb-3 leading-snug">
                  ΔT = {(tFinal - tInitial).toFixed(1)} °C · m(water) = {MASS_WATER} g · m(food) = {sample.mass.toFixed(2)} g
                </div>
                <label className="block text-xs mb-2">
                  <div className="opacity-65 mb-1" style={{ fontFamily: mono }}>q released (J)</div>
                  <input value={userQ} onChange={(e) => setUserQ(e.target.value)} className="w-full px-3 py-2 text-sm"
                    style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", fontFamily: mono }} />
                </label>
                <label className="block text-xs mb-3">
                  <div className="opacity-65 mb-1" style={{ fontFamily: mono }}>energy per gram (kJ/g, 1 dp)</div>
                  <input value={userQpg} onChange={(e) => setUserQpg(e.target.value)} className="w-full px-3 py-2 text-sm"
                    style={{ backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", fontFamily: mono }} />
                </label>
                <button onClick={submitCalc} disabled={userQ === "" || userQpg === ""}
                  className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                  style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                  Submit calculation
                </button>
              </Card>
            </div>
          )}

          {result && (
            <div className="mt-4 p-5" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} color="#ec407a" />
                <div className="text-[10px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#ec407a" }}>
                  {sample.name} · result
                </div>
              </div>
              <Row label="q" expected={`${expectedQ} J`} user={`${userQ} J`} ok={qOK} />
              <Row label="q / m food" expected={`${expectedQpg} kJ/g`} user={`${userQpg} kJ/g`} ok={qpgOK} />
              <div className="my-3 border-t border-stone-400/20" />
              <div className="text-xs opacity-80 leading-snug">
                Published: <span style={{ color: "#ec407a", fontWeight: 600 }}>{sample.published.toFixed(1)} kJ/g</span> · Apparent efficiency:{" "}
                <span style={{ color: "#ec407a", fontWeight: 600 }}>{result.percent.toFixed(0)} %</span>
              </div>
            </div>
          )}

          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>

          <div className="mt-4 p-4" style={{ backgroundColor: "rgba(232,228,216,0.5)", border: "1px solid rgba(26,31,46,0.15)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-2" style={{ fontFamily: mono, letterSpacing: "0.22em" }}>Progress</div>
            <div className="text-sm">
              <span style={{ fontWeight: 500 }}>{completed} / {SAMPLES.length}</span> samples completed
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Row({ label, expected, user, ok }) {
  return (
    <div className="flex items-center gap-2 text-sm py-0.5">
      {ok ? <CheckCircle2 size={14} color="#7ad59d" /> : <XCircle size={14} color="#ec407a" />}
      <span className="opacity-65 w-24 text-xs" style={{ fontFamily: mono }}>{label}</span>
      <span style={{ fontFamily: mono }}>{user}</span>
      <span className="opacity-50 text-xs ml-auto" style={{ fontFamily: mono }}>accepted: {expected}</span>
    </div>
  );
}

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
