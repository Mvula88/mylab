"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, FastForward } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const QUIZ = [
  { q: "Why does the dye rise UP the celery stalk?",
    options: ["Capillary action plus transpiration pulling water (and dye) up through xylem vessels", "Convection", "Phloem pumps it up", "Celery pushes it"], correct: 0 },
  { q: "In the cross-section, the red dye appears in distinct strands. Which tissue?",
    options: ["Phloem", "Epidermis", "Xylem vessels", "Stomata"], correct: 2 },
  { q: "Why is XYLEM made up of DEAD, hollow, lignified cells?",
    options: ["Save energy", "Hollow tubes allow water and minerals to move with minimal resistance; lignin gives strength to resist tension", "Never were alive", "To make food"], correct: 1 },
  { q: "If celery is left longer, dye reaches the leaves. Function of xylem?",
    options: ["Transports water (and dissolved minerals) from roots up to leaves", "Transports sugars", "Stores starch", "Photosynthesises"], correct: 0 },
];

export default function CeleryXylemLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 0.9, lookY: 0.25 },
    });
    scene.add(makeBench({ width: 1.4, depth: 0.6 }));

    // Beaker with red dye
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.1, 32, 1, true),
      glassMaterial({ opacity: 0.3 })
    );
    beaker.position.y = 0.05;
    scene.add(beaker);
    const dye = new THREE.Mesh(
      new THREE.CylinderGeometry(0.077, 0.077, 0.09, 32),
      liquidMaterial(0xcf2828, 0.8)
    );
    dye.position.y = 0.05;
    scene.add(dye);

    // Celery stalk (curved, with leaves at top)
    const stalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.022, 0.45, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xbcd986, roughness: 0.8 })
    );
    stalk.position.y = 0.27;
    scene.add(stalk);
    // Xylem strands (4 vertical thin red rods) — appear progressively
    const strandMat = new THREE.MeshStandardMaterial({ color: 0xc83232, roughness: 0.6 });
    const strands = [];
    const angles = [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2];
    angles.forEach((a) => {
      const strand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.001, 0.001, 0.45, 8),
        strandMat
      );
      strand.position.set(Math.cos(a) * 0.015, 0.27, Math.sin(a) * 0.015);
      // start with full bar but use scale.y to grow upward from base
      strand.scale.y = 0;
      strand.position.y = 0.07; // start at bottom
      strands.push(strand);
      scene.add(strand);
    });

    // Leaves at top
    const leafShape = new THREE.Shape();
    leafShape.moveTo(-0.04, 0);
    leafShape.quadraticCurveTo(0, 0.04, 0.04, 0);
    leafShape.quadraticCurveTo(0, -0.02, -0.04, 0);
    const leafGeom = new THREE.ShapeGeometry(leafShape, 16);
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(leafGeom, new THREE.MeshStandardMaterial({ color: 0x5a8c3b, roughness: 0.8, side: THREE.DoubleSide }));
      const a = (i / 5) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.04, 0.5, Math.sin(a) * 0.04);
      leaf.rotation.x = -Math.PI / 2;
      leaf.rotation.z = a;
      scene.add(leaf);
    }

    sceneRef.current = { scene, camera, renderer, dispose, strands };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.25 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(1, tRef.current + dt / 6);

      strands.forEach((s) => {
        s.scale.y = tRef.current;
        // grow from base upward — position.y should be base + half-height
        s.position.y = 0.07 + (tRef.current * 0.45) / 2;
      });

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
      setTime(tRef.current);
      if (tRef.current >= 1) { clearInterval(id); setRunning(false); }
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const skip = () => { setRunning(false); tRef.current = 1; setTime(1); };
  const reset = () => { setRunning(false); tRef.current = 0; setTime(0); setShowSection(false); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Plant transport · Xylem">
      <Header
        title="Tracking water flow through"
        accent="xylem"
        blurb="A celery stalk is placed in red food dye. Over an hour, the dye travels up the stalk. Cutting a cross-section reveals which tissue carried the water — the dye traces out the xylem vessels."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "10/12", maxHeight: 540, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && time < 1 ? <PrimaryButton onClick={start} icon={Play}>Start</PrimaryButton> : null}
            <SecondaryButton onClick={skip} disabled={time >= 1} icon={FastForward}>Skip to 60 min</SecondaryButton>
            <button onClick={() => setShowSection(true)} disabled={time < 1}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-30"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: time >= 1 ? "#c2185b" : "rgba(26,31,46,0.05)", color: time >= 1 ? "#e8e4d8" : "#1a1f2e" }}>
              Cut cross-section
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>t = {Math.floor(time * 60)} min</div>
          </div>

          {showSection && (
            <div className="relative overflow-hidden mb-4 p-4" style={{ aspectRatio: "2/1", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)" }}>
              <CrossSectionSVG />
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card label="Observation">
            <div className="text-sm leading-snug opacity-80">
              Red dye rises through narrow channels in the celery stalk, eventually reaching the leaves. Cutting horizontally reveals discrete red dots arranged in a ring — the xylem vessels (vascular bundles).
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

function CrossSectionSVG() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      <rect x="0" y="0" width="800" height="400" fill="#f5f1e3" />
      <text x="400" y="30" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a1f2e" letterSpacing="2">CROSS-SECTION (HORIZONTAL CUT)</text>
      <ellipse cx="400" cy="220" rx="180" ry="130" fill="#bcd986" stroke="#1a1f2e" strokeWidth="2" />
      <ellipse cx="400" cy="220" rx="180" ry="130" fill="none" stroke="#5a8c3b" strokeWidth="3" />
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a) => {
        const rad = a * Math.PI / 180;
        const cx = 400 + Math.cos(rad) * 140;
        const cy = 220 + Math.sin(rad) * 95;
        return (
          <g key={a}>
            <circle cx={cx} cy={cy} r="11" fill="#7a9a5b" opacity="0.85" />
            <circle cx={cx + Math.cos(rad) * (-6)} cy={cy + Math.sin(rad) * (-6)} r="6" fill="#c83232" opacity="0.95" />
          </g>
        );
      })}
      <text x="600" y="180" fontSize="11" fontFamily="monospace" fill="#1a1f2e">VASCULAR BUNDLE</text>
      <text x="600" y="220" fontSize="10" fontFamily="monospace" fill="#1a1f2e">red = xylem (stained)</text>
      <text x="600" y="240" fontSize="10" fontFamily="monospace" fill="#1a1f2e" opacity="0.6">green = phloem (unstained)</text>
    </svg>
  );
}
