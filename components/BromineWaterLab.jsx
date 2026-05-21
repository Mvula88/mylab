"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeTestTube } from "./three/SceneKit";

const SUBSTANCES = [
  { id: "hexane",      name: "Hexane (C₆H₁₄)",       unsat: false, family: "alkane",          layerColour: 0xd8e9d8 },
  { id: "hexene",      name: "Hex-1-ene (C₆H₁₂)",     unsat: true,  family: "alkene",          layerColour: 0xd8e9d8 },
  { id: "cyclohexane", name: "Cyclohexane",          unsat: false, family: "alkane",          layerColour: 0xd8e9d8 },
  { id: "cyclohexene", name: "Cyclohexene",          unsat: true,  family: "alkene",          layerColour: 0xd8e9d8 },
  { id: "sunflower",   name: "Sunflower oil",         unsat: true,  family: "unsaturated fat", layerColour: 0xf4d68b },
  { id: "lard",        name: "Animal fat (lard)",     unsat: false, family: "saturated fat",   layerColour: 0xf6e8c8 },
];

const QUIZ = [
  {
    q: "Why does bromine water turn from ORANGE to COLOURLESS in the presence of an alkene?",
    options: [
      "Bromine evaporates",
      "Bromine ADDS across the C=C double bond, producing a colourless dibromoalkane",
      "Bromine reacts with hydrogen",
      "Bromine is reduced to iodide",
    ],
    correct: 1,
  },
  {
    q: "Which homologous family contains C=C double bonds and therefore DECOLOURISES bromine water?",
    options: [
      "Alkanes — saturated",
      "Alkenes — unsaturated",
      "Both equally",
      "Neither — only alcohols react",
    ],
    correct: 1,
  },
  {
    q: "Sunflower oil decolourises bromine water; lard does not. What does this tell you?",
    options: [
      "Sunflower oil contains C=C bonds (unsaturated); lard is mostly saturated",
      "Lard is more concentrated",
      "Sunflower oil is heavier",
      "Bromine reacts only with plants",
    ],
    correct: 0,
  },
  {
    q: "Write the ADDITION reaction for ethene with bromine.",
    options: [
      "C₂H₄ + Br₂ → C₂H₄Br₂ (1,2-dibromoethane)",
      "C₂H₄ + Br → C₂H₅Br",
      "C₂H₆ + Br₂ → C₂H₅Br + HBr",
      "C₂H₄ + 2Br → C₂H₄ + Br₂",
    ],
    correct: 0,
  },
];

const BROMINE_ORANGE = 0xf0a83a;
const DECOLOURISED = 0xf2ecd6;

export default function BromineWaterLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [tested, setTested] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const testedRef = useRef(tested);
  testedRef.current = tested;

  /* ─── Scene boot ─── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.42, z: 1.1, lookY: 0.18 },
    });

    scene.add(makeBench({ width: 2.0, depth: 0.7 }));

    // Test tube rack
    const rack = new THREE.Group();
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x6a4a26, roughness: 0.9 });
    const rackBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.02), rackMat);
    rackBack.position.y = 0.14;
    rackBack.castShadow = true; rackBack.receiveShadow = true;
    rack.add(rackBack);
    const rackFront = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.02), rackMat);
    rackFront.position.set(0, 0.14, 0.07);
    rack.add(rackFront);
    const rackBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.025, 0.12), rackMat);
    rackBase.position.set(0, 0.012, 0.035);
    rack.add(rackBase);
    // posts
    for (const x of [-0.5, 0.5]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.02), rackMat);
      post.position.set(x, 0.1, 0);
      rack.add(post);
      const postF = post.clone(); postF.position.z = 0.07;
      rack.add(postF);
    }
    // holes for tubes
    for (let i = 0; i < SUBSTANCES.length; i++) {
      const x = -0.45 + i * 0.18;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.005, 16),
        new THREE.MeshStandardMaterial({ color: 0x2a1a0c, roughness: 1 })
      );
      hole.position.set(x, 0.165, 0.035);
      rack.add(hole);
      const hole2 = hole.clone();
      hole2.position.set(x, 0.165, 0.035 + 0.035);
      rack.add(hole2);
    }
    scene.add(rack);

    // Tubes (one per substance) — tall, slim
    const tubes = [];
    SUBSTANCES.forEach((s, i) => {
      const tube = makeTestTube({ radius: 0.014, height: 0.16 });
      tube.position.set(-0.45 + i * 0.18, 0.05, 0.035);
      tube.userData.setFill(0.55, BROMINE_ORANGE, 0.92);
      scene.add(tube);
      tubes.push(tube);

      // floating organic layer (initially hidden)
      const layerMat = new THREE.MeshPhysicalMaterial({
        color: s.layerColour,
        transparent: true,
        opacity: 0.85,
        transmission: 0.4,
        roughness: 0.2,
        side: THREE.DoubleSide,
      });
      const layer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.025, 24),
        layerMat
      );
      layer.position.set(tube.position.x, 0.05 + 0.135, tube.position.z);
      layer.visible = false;
      scene.add(layer);

      // floating label card (substance name)
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e";
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(s.name.split(" (")[0], 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.13, 0.033, 1);
      sprite.position.set(tube.position.x, 0.245, tube.position.z + 0.005);
      scene.add(sprite);

      tube.userData.layer = layer;
      tube.userData.substance = s;
    });

    sceneRef.current = { scene, camera, renderer, tubes, dispose, tested: {} };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf;
    const t0 = performance.now();
    const animate = (now) => {
      const t = ((now ?? performance.now()) - t0) / 1000;
      // Subtle bromine wobble — only on untested tubes
      tubes.forEach((tube) => {
        const tested = !!sceneRef.current.tested[tube.userData.substance.id];
        if (!tested) {
          tube.rotation.z = Math.sin(t * 0.6 + tube.position.x * 10) * 0.005;
        }
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      detach();
      dispose();
    };
  }, []);

  /* ─── React → 3D sync: animate test on click ─── */
  const test = (id) => {
    if (tested[id]) return;
    setTested((p) => ({ ...p, [id]: true }));
    sceneRef.current.tested = { ...sceneRef.current.tested, [id]: true };
    const tube = sceneRef.current.tubes?.find((t) => t.userData.substance.id === id);
    if (!tube) return;
    const sub = tube.userData.substance;
    // Reveal floating layer + change bromine colour if alkene reacts
    tube.userData.layer.visible = true;
    // Animate the bromine fill colour over 1.2s
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const colour = sub.unsat
        ? lerpHex(BROMINE_ORANGE, DECOLOURISED, k)
        : BROMINE_ORANGE;
      tube.userData.setFill(0.55, colour, sub.unsat ? 0.85 - k * 0.4 : 0.92);
      // organic layer slides into place over the bromine
      tube.userData.layer.position.y = 0.05 + 0.135 - 0.04 * (1 - k);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const reset = () => {
    setTested({});
    sceneRef.current.tested = {};
    sceneRef.current.tubes?.forEach((tube) => {
      tube.userData.setFill(0.55, BROMINE_ORANGE, 0.92);
      tube.userData.layer.visible = false;
      tube.userData.layer.position.y = 0.05 + 0.135;
    });
  };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Organic · Bromine water test">
      <Header
        title="Testing for"
        accent="unsaturation"
        blurb="Bromine water is orange. When shaken with a substance that contains a C=C double bond (an alkene, an unsaturated oil), Br₂ adds across the double bond and the colour disappears. Saturated compounds do not react."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div
            ref={mountRef}
            className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {SUBSTANCES.map((s) => (
              <button
                key={s.id}
                onClick={() => test(s.id)}
                disabled={!!tested[s.id]}
                className="p-2 text-left transition active:scale-95 disabled:opacity-90"
                style={{
                  backgroundColor: tested[s.id]
                    ? s.unsat ? "rgba(46,125,50,0.12)" : "rgba(26,31,46,0.05)"
                    : "rgba(26,31,46,0.06)",
                  border: `1px solid ${tested[s.id] ? (s.unsat ? "#2e7d32" : "rgba(26,31,46,0.2)") : "rgba(26,31,46,0.2)"}`,
                }}
              >
                <div className="text-sm" style={{ fontWeight: 500 }}>{s.name}</div>
                <div className="text-[10px] opacity-65" style={{ fontFamily: mono }}>{s.family}</div>
                {tested[s.id] && (
                  <div className="text-[10px] mt-1" style={{ fontFamily: mono, color: s.unsat ? "#2e7d32" : "rgba(26,31,46,0.65)" }}>
                    {s.unsat ? "✓ decolourised" : "− stays orange"}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>{Object.keys(tested).length} / {SUBSTANCES.length} tested</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Observations">
            <div className="space-y-1.5">
              {SUBSTANCES.map((s) => (
                <div key={s.id} className="flex items-baseline gap-2 text-sm py-1 border-b border-stone-900/8 last:border-0">
                  {tested[s.id] ? <CheckCircle2 size={12} color="#2e7d32" /> : <span className="w-3" />}
                  <span className="flex-1">{s.name}</span>
                  {tested[s.id] && (
                    <span className="text-[11px]" style={{ fontFamily: mono, color: s.unsat ? "#2e7d32" : "rgba(26,31,46,0.65)" }}>
                      {s.unsat ? "decolourised" : "stays orange"}
                    </span>
                  )}
                </div>
              ))}
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
