"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench } from "./three/SceneKit";

const STEPS = [
  { id: "light",   label: "Leave in bright light for 6 h" },
  { id: "boil",    label: "Boil leaf in water for 1 minute" },
  { id: "ethanol", label: "Boil in ethanol (water bath) 3 min" },
  { id: "rinse",   label: "Rinse leaf in warm water" },
  { id: "iodine",  label: "Add iodine solution" },
];

const QUIZ = [
  { q: "Why boil the leaf in water first?", options: ["To remove chlorophyll", "To kill cells and break down membranes so reagents can penetrate", "To start photosynthesis", "To test for starch"], correct: 1 },
  { q: "Why boil in ethanol?", options: ["Dissolve cell walls", "Remove chlorophyll so colour changes are visible", "Kill cells", "Convert starch to glucose"], correct: 1 },
  { q: "After iodine: GREEN regions go blue-black; WHITE stay orange. What does this show?", options: ["Starch everywhere", "Chlorophyll is required for photosynthesis (and starch production)", "Iodine reacts only with chlorophyll", "White regions have different sugar"], correct: 1 },
  { q: "Why rinse in warm water after ethanol?", options: ["Wash off chlorophyll", "Remove iodine", "Ethanol leaves leaf brittle; warm water softens it", "Stop reaction with starch"], correct: 2 },
];

const PATCHES = [
  { cx: 0.0,   cy: -0.05, rx: 0.06, ry: 0.05, c: true  },
  { cx: -0.12, cy:  0.0,  rx: 0.05, ry: 0.04, c: false },
  { cx: 0.1,   cy:  0.02, rx: 0.05, ry: 0.04, c: true  },
  { cx: -0.05, cy:  0.06, rx: 0.045,ry: 0.035,c: true  },
  { cx: 0.05,  cy: -0.10, rx: 0.045,ry: 0.04, c: false },
  { cx: -0.12, cy: -0.08, rx: 0.04, ry: 0.035,c: true  },
  { cx: 0.15,  cy: -0.04, rx: 0.035,ry: 0.03, c: false },
];

export default function VariegatedLeafLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [stepIdx, setStepIdx] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const stepRef = useRef(-1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.35, z: 0.6, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.4, depth: 0.6 }));

    // Leaf-shaped plane (use a custom geometry via Shape)
    const shape = new THREE.Shape();
    // Almond-shaped leaf
    shape.moveTo(-0.18, 0);
    shape.quadraticCurveTo(0, 0.13, 0.18, 0);
    shape.quadraticCurveTo(0, -0.13, -0.18, 0);
    const leafGeo = new THREE.ShapeGeometry(shape, 32);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xa8c97a, roughness: 0.8, side: THREE.DoubleSide });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.rotation.x = -Math.PI / 2 + 0.2;
    leaf.position.set(0, 0.15, 0);
    scene.add(leaf);

    // Patches as thin ellipses on top of leaf
    const patchMeshes = PATCHES.map((p) => {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(1, 24),
        new THREE.MeshStandardMaterial({ color: 0x3e8a31, roughness: 0.8, side: THREE.DoubleSide })
      );
      m.scale.set(p.rx, p.ry, 1);
      m.position.set(p.cx, p.cy, 0.001);
      m.rotation.x = 0;
      leaf.add(m);
      return { mesh: m, patch: p };
    });

    // Beaker for boiling steps (visible during stages 1-3)
    const beakerMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffefb, transparent: true, opacity: 0.3, transmission: 0.85,
      roughness: 0.05, ior: 1.5, side: THREE.DoubleSide,
    });
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32, 1, true),
      beakerMat
    );
    beaker.position.set(0, 0.12, 0);
    beaker.visible = false;
    scene.add(beaker);

    // Beaker fluid
    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: 0xa7d4ec, transparent: true, opacity: 0.4, transmission: 0.4, side: THREE.DoubleSide,
    });
    const fluid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.175, 0.175, 0.08, 32),
      fluidMat
    );
    fluid.position.set(0, 0.1, 0);
    fluid.visible = false;
    scene.add(fluid);

    // Iodine droppers (visible only at step 4)
    const dropGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const d = new THREE.Mesh(
        new THREE.SphereGeometry(0.005, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xa85a1a })
      );
      d.position.set((i - 1.5) * 0.06, 0.3, 0);
      d.visible = false;
      d.userData = { delay: i * 0.15, t: 0 };
      dropGroup.add(d);
    }
    scene.add(dropGroup);

    sceneRef.current = { scene, camera, renderer, dispose, leaf, leafMat, patchMeshes, beaker, fluid, fluidMat, dropGroup };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, dropStart = null;
    const animate = (now) => {
      const s = stepRef.current;
      // Leaf base colour per stage
      let leafBaseHex;
      if (s < 1) leafBaseHex = 0xa8c97a;
      else if (s === 1) leafBaseHex = 0x8eaf6b;
      else if (s === 2) leafBaseHex = 0xe8e4c6;
      else if (s === 3) leafBaseHex = 0xe8e4c6;
      else leafBaseHex = 0xdcd2a3;
      leafMat.color.setHex(leafBaseHex);
      // Patches
      patchMeshes.forEach(({ mesh, patch }) => {
        let hex;
        if (s < 1) hex = patch.c ? 0x3e8a31 : 0xf4ede0;
        else if (s === 1) hex = patch.c ? 0x346b29 : 0xe2d9be;
        else if (s === 2 || s === 3) hex = patch.c ? 0xd6cfa5 : 0xf0e8d0;
        else hex = patch.c ? 0x1a2548 : 0xc9871f;
        mesh.material.color.setHex(hex);
      });

      // Stage props
      beaker.visible = s === 1 || s === 2 || s === 3;
      fluid.visible = s === 1 || s === 2 || s === 3;
      // ethanol amber tint
      if (s === 2) fluidMat.color.setHex(0xe8b450);
      else fluidMat.color.setHex(0xa7d4ec);

      // bubbles when boiling — simulate via a few wandering circles (would need a separate pool, skip for brevity)

      // iodine droplets falling
      if (s === 4) {
        if (!dropStart) dropStart = now;
        const dt = (now - dropStart) / 1000;
        dropGroup.children.forEach((d, i) => {
          d.visible = true;
          const localT = Math.max(0, dt - d.userData.delay);
          d.position.y = 0.3 - localT * 0.6;
          if (d.position.y < 0.15) d.position.y = 0.15;
          d.material.transparent = true;
          d.material.opacity = Math.max(0, 1 - localT * 1.5);
        });
      } else {
        dropStart = null;
        dropGroup.children.forEach((d) => { d.visible = false; });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { stepRef.current = stepIdx; }, [stepIdx]);

  const advance = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
  const reset = () => setStepIdx(-1);
  const completed = stepIdx === STEPS.length - 1;
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Photosynthesis · Need for chlorophyll">
      <Header
        title="The variegated leaf test for"
        accent="chlorophyll"
        blurb="A variegated leaf has green chlorophyll-containing regions and pale regions without chlorophyll. After the standard starch test, only the green regions go blue-black — showing chlorophyll is needed for photosynthesis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/10", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!completed ? (
              <button onClick={advance}
                className="py-2.5 px-4 text-[11px] uppercase active:scale-95 inline-flex items-center gap-2"
                style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
                {stepIdx === -1 ? "Begin procedure" : `Step ${stepIdx + 2}: ${STEPS[stepIdx + 1].label}`} <ArrowRight size={12} />
              </button>
            ) : (
              <SecondaryButton onClick={reset} icon={RotateCcw}>Reset procedure</SecondaryButton>
            )}
          </div>

          <div className="space-y-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-baseline gap-3 py-2 px-3"
                style={{
                  backgroundColor: i <= stepIdx ? "rgba(46,125,50,0.08)" : "transparent",
                  border: "1px solid rgba(26,31,46,0.1)",
                  opacity: i <= stepIdx ? 1 : 0.6,
                }}>
                <div className="text-[10px] uppercase opacity-65 shrink-0 w-12" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Step {i + 1}</div>
                <div className="text-sm" style={{ fontWeight: i <= stepIdx ? 500 : 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
        </div>
      </div>
    </Shell>
  );
}
