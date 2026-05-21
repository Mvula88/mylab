"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeClampStand, makeSpring, makeMassHanger, makeSlottedMass } from "./three/SceneKit";

const SPRING_K = 25;
const ELASTIC_LIMIT_N = 6.0;
const POST_ELASTIC_K = 8;
const LOADS = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];

const extensionFor = (F) => {
  if (F <= ELASTIC_LIMIT_N) return (F / SPRING_K) * 100;
  return ((ELASTIC_LIMIT_N / SPRING_K) + (F - ELASTIC_LIMIT_N) / POST_ELASTIC_K) * 100;
};

const QUIZ = [
  { q: "Hooke's Law states:", options: ["Force is proportional to mass", "Within the elastic limit, the extension of a spring is DIRECTLY PROPORTIONAL to the load (F = kx)", "Springs cannot be stretched", "All springs have the same stiffness"], correct: 1 },
  { q: "On the F-vs-extension graph, what does the GRADIENT represent?",
    options: ["The mass of the load", "The spring CONSTANT k (in N/m) — stiffness of the spring", "Gravitational field strength", "The diameter of the spring wire"], correct: 1 },
  { q: "After the elastic LIMIT is exceeded, why does the line curve?",
    options: ["Terminal velocity reached", "The spring is being deformed permanently — it will no longer return to its original length when unloaded", "Gravity has weakened", "Hooke's law applies more strongly"], correct: 1 },
  { q: "A 200 g mass is hung on a spring of stiffness 50 N/m. Extension?",
    options: ["0.4 cm", "4 cm", "40 cm", "0.04 m → 4 cm"], correct: 3 },
];

export default function HookesLawLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [loadN, setLoadN] = useState(0);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const loadRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.4, y: 0.5, z: 0.9, lookY: 0.3 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.7 }));

    // Clamp stand with horizontal arm
    const stand = makeClampStand({ rodHeight: 0.7 });
    scene.add(stand);
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 })
    );
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.02, 0.66, 0);
    scene.add(arm);

    // Spring hanging from arm
    const spring = makeSpring({ coils: 16, radius: 0.018 });
    spring.position.set(0.05, 0.66, 0);
    scene.add(spring);

    // Mass hanger
    const hanger = makeMassHanger();
    scene.add(hanger);
    // Slotted masses (we create up to 16 (0.5N each))
    const masses = [];
    for (let i = 0; i < 16; i++) {
      const m = makeSlottedMass({ thickness: 0.006 });
      m.visible = false;
      scene.add(m);
      masses.push(m);
    }

    // Ruler
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.5, 0.005),
      new THREE.MeshStandardMaterial({ color: 0xfdfbf3, roughness: 0.95 })
    );
    ruler.position.set(0.13, 0.4, 0);
    scene.add(ruler);
    // tick canvas texture on ruler
    const rulerCanvas = document.createElement("canvas");
    rulerCanvas.width = 64; rulerCanvas.height = 500;
    const rcx = rulerCanvas.getContext("2d");
    rcx.fillStyle = "#fdfbf3"; rcx.fillRect(0, 0, 64, 500);
    rcx.strokeStyle = "#1a1f2e"; rcx.lineWidth = 2;
    for (let i = 0; i <= 30; i++) {
      const y = (i / 30) * 480 + 10;
      rcx.beginPath(); rcx.moveTo(0, y); rcx.lineTo(i % 5 === 0 ? 30 : 18, y); rcx.stroke();
      if (i % 5 === 0) {
        rcx.fillStyle = "#1a1f2e";
        rcx.font = "bold 14px monospace";
        rcx.fillText(`${i}`, 34, y + 5);
      }
    }
    const tex = new THREE.CanvasTexture(rulerCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const rulerFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.018, 0.5),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    rulerFace.position.set(0.13, 0.4, 0.003);
    rulerFace.rotation.y = 0;
    scene.add(rulerFace);

    // Pointer (magenta arrow)
    const pointer = new THREE.Mesh(
      new THREE.ConeGeometry(0.005, 0.012, 8),
      new THREE.MeshStandardMaterial({ color: 0xc2185b })
    );
    pointer.rotation.z = -Math.PI / 2;
    scene.add(pointer);

    sceneRef.current = { scene, camera, renderer, dispose, spring, hanger, masses, pointer };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.3 });

    let raf;
    const animate = () => {
      const F = loadRef.current;
      const extCm = extensionFor(F);
      const stretchedLen = 0.12 + (extCm / 100) * 1.0; // 1 cm = 1 cm world
      spring.userData.setStretch(stretchedLen);
      const bottomY = 0.66 - stretchedLen;
      hanger.position.set(0.05, bottomY, 0);
      // place masses stacking below the hanger plate
      const n = Math.round(F / 0.5);
      masses.forEach((m, i) => {
        if (i < n) {
          m.visible = true;
          m.position.set(0.05, bottomY - 0.025 - 0.007 - i * 0.008, 0);
        } else {
          m.visible = false;
        }
      });
      // pointer at the hanger plate level
      pointer.position.set(0.115, bottomY - 0.025, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { loadRef.current = loadN; }, [loadN]);

  const setLoad = (n) => { if (n >= 0 && n <= 8) setLoadN(n); };
  const record = () => {
    setRecorded((r) => ({ ...r, [loadN]: extensionFor(loadN) }));
  };
  const reset = () => { setLoadN(0); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const ext = extensionFor(loadN);
  const rows = LOADS.map((L) => [
    L.toFixed(1),
    recorded[L] != null ? recorded[L].toFixed(2) : "—",
    recorded[L] != null && L > 0 ? (L / (recorded[L] / 100)).toFixed(1) : "—",
  ]);

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Forces · Hooke's law">
      <Header
        title="Hooke's law for a"
        accent="helical spring"
        blurb="Hang masses one by one from a vertical spring. Use a metre rule to measure how far the pointer has moved each time. Plot F against extension — within the elastic limit, you get a straight line through the origin. The gradient gives the spring constant."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "10/12", maxHeight: 560, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <SecondaryButton onClick={() => setLoad(loadN - 0.5)} disabled={loadN <= 0} icon={Minus}>0.5 N</SecondaryButton>
            <SecondaryButton onClick={() => setLoad(loadN + 0.5)} disabled={loadN >= 8} icon={Plus}>0.5 N</SecondaryButton>
            <button onClick={record} disabled={recorded[loadN] != null}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record this point
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>
              F = {loadN.toFixed(1)} N · x = {ext.toFixed(2)} cm
              {loadN > ELASTIC_LIMIT_N && <span style={{ color: "#c2185b" }}> · past elastic limit</span>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["F (N)", "x (cm)", "k (N/m)"]} rows={rows} />
          <div className="mt-4">
            <Card label="Plot · F vs extension">
              <ExtensionPlot recorded={recorded} />
              <div className="text-[11px] opacity-75 mt-2">Linear region: k = {SPRING_K} N/m. Beyond ~ 6 N the spring deforms plastically.</div>
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

function ExtensionPlot({ recorded }) {
  const W = 280, H = 180;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const xMax = 40, yMax = 8;
  const xPx = (x) => padL + (x / xMax) * (W - padL - padR);
  const yPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const points = LOADS.filter((L) => recorded[L] != null).map((L) => [recorded[L], L]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#1a1f2e" strokeWidth="1" opacity="0.4" />
      {[0, 10, 20, 30].map((x) => (
        <text key={x} x={xPx(x)} y={H - padB + 14} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">{x}</text>
      ))}
      {[0, 2, 4, 6, 8].map((y) => (
        <text key={y} x={padL - 4} y={yPx(y) + 3} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">{y}</text>
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={xPx(x)} cy={yPx(y)} r="3" fill="#c2185b" />
      ))}
      <polyline points={points.map(([x, y]) => `${xPx(x)},${yPx(y)}`).join(" ")} fill="none" stroke="#c2185b" strokeWidth="1.5" opacity="0.65" />
      <text x={W / 2} y={H - 4} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#1a1f2e" opacity="0.6">extension (cm)</text>
      <text x={padL - 6} y={padT + 6} fontSize="9" fontFamily="monospace" textAnchor="end" fill="#1a1f2e" opacity="0.6">F (N)</text>
    </svg>
  );
}
