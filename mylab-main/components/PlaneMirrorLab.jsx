"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, ResultsTable } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeMirror, makeRay } from "./three/SceneKit";

const QUIZ = [
  { q: "What is the relationship between angle of incidence (i) and angle of reflection (r)?",
    options: ["i + r = 90°", "i = r — both measured from the NORMAL at the point of incidence", "i = 2r", "They are unrelated"], correct: 1 },
  { q: "What is the 'normal' in a reflection diagram?",
    options: ["An ordinary average ray", "An imaginary line PERPENDICULAR to the mirror surface at the point where the ray hits", "The bright reflected ray", "The plane of the mirror"], correct: 1 },
  { q: "Image formed by a plane mirror is described as:",
    options: ["Real, inverted, magnified", "Virtual, upright, same size, LATERALLY INVERTED, same distance behind as object in front", "Real, behind the mirror", "Inverted, smaller"], correct: 1 },
  { q: "Why must locating pins be observed from a low angle, lined up exactly?",
    options: ["So the line through the pins really is along the reflected ray (parallax-free) — accuracy depends on careful sighting", "Because the pins are far away", "To save time", "Decoration"], correct: 0 },
];

const RECORD_ANGLES = [20, 30, 40, 50, 60];

export default function PlaneMirrorLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [angle, setAngle] = useState(30);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const angleRef = useRef(30);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.6, z: 0.8, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 1.6, depth: 0.6 }));

    // Mirror lying horizontally on bench
    const mirror = makeMirror({ width: 0.35, height: 0.005, depth: 0.07 });
    scene.add(mirror);

    // Normal (vertical dashed line) — use a dashed line via a series of short segments
    const normalGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const seg = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.018, 0.001),
        new THREE.MeshStandardMaterial({ color: 0x1a1f2e })
      );
      seg.position.y = 0.025 + i * 0.025;
      normalGroup.add(seg);
    }
    scene.add(normalGroup);

    // Incident ray (red), reflected ray (blue)
    const rayIn = makeRay(0xc2185b);
    rayIn.material.linewidth = 3;
    scene.add(rayIn);
    const rayOut = makeRay(0x1a8af0);
    rayOut.material.linewidth = 3;
    scene.add(rayOut);

    // Pins along incident and reflected rays
    const pinMat = new THREE.MeshStandardMaterial({ color: 0x1a1f2e });
    const pinHeadMat = new THREE.MeshStandardMaterial({ color: 0xc2185b });
    const makePin = (head) => {
      const grp = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.05, 8), pinMat);
      shaft.position.y = 0.025;
      grp.add(shaft);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 12, 10), head);
      cap.position.y = 0.05;
      grp.add(cap);
      return grp;
    };
    const pins = [];
    for (let i = 0; i < 4; i++) {
      const p = makePin(i < 2 ? pinHeadMat : new THREE.MeshStandardMaterial({ color: 0x1a8af0 }));
      pins.push(p);
      scene.add(p);
    }

    // Angle markers (arcs)
    const arcGroup = new THREE.Group();
    const arcIn = new THREE.Mesh(
      new THREE.RingGeometry(0.04, 0.041, 16, 1, 0, Math.PI / 4),
      new THREE.MeshBasicMaterial({ color: 0xc2185b, side: THREE.DoubleSide })
    );
    arcIn.rotation.x = -Math.PI / 2;
    arcGroup.add(arcIn);
    const arcOut = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.051, 16, 1, 0, Math.PI / 4),
      new THREE.MeshBasicMaterial({ color: 0x1a8af0, side: THREE.DoubleSide })
    );
    arcOut.rotation.x = -Math.PI / 2;
    arcGroup.add(arcOut);
    arcGroup.position.y = 0.01;
    scene.add(arcGroup);

    sceneRef.current = { scene, camera, renderer, dispose, rayIn, rayOut, pins, arcIn, arcOut };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf;
    const animate = () => {
      const θdeg = angleRef.current;
      const θ = θdeg * Math.PI / 180;
      const L = 0.35;
      const cx = 0, cy = 0.005, cz = 0;
      const inX = cx - L * Math.sin(θ);
      const inY = cy + L * Math.cos(θ);
      const outX = cx + L * Math.sin(θ);
      const outY = cy + L * Math.cos(θ);
      sceneRef.current.rayIn.userData.setEndpoints(inX, inY, cz, cx, cy, cz);
      sceneRef.current.rayOut.userData.setEndpoints(cx, cy, cz, outX, outY, cz);

      // Pins
      sceneRef.current.pins[0].position.set(cx - 0.13 * Math.sin(θ), 0, cz);
      sceneRef.current.pins[1].position.set(cx - 0.27 * Math.sin(θ), 0, cz);
      sceneRef.current.pins[2].position.set(cx + 0.13 * Math.sin(θ), 0, cz);
      sceneRef.current.pins[3].position.set(cx + 0.27 * Math.sin(θ), 0, cz);
      // Lift pins so their bases touch the bench, tops follow rays
      sceneRef.current.pins.forEach((p, i) => {
        const along = (i === 0 || i === 1) ? -1 : 1;
        const d = (i === 0 || i === 2) ? 0.13 : 0.27;
        const x = cx + along * d * Math.sin(θ);
        const y = cy + d * Math.cos(θ);
        p.position.set(x, 0, cz);
        // tilt pin to lie along ray
        p.rotation.z = along * (θ);
      });

      // Update arc geometries (recreate ring)
      sceneRef.current.arcIn.geometry.dispose();
      sceneRef.current.arcIn.geometry = new THREE.RingGeometry(0.05, 0.052, 24, 1, -Math.PI / 2 + 0, -Math.PI / 2 + θ);
      sceneRef.current.arcOut.geometry.dispose();
      sceneRef.current.arcOut.geometry = new THREE.RingGeometry(0.058, 0.06, 24, 1, -Math.PI / 2 - θ, θ);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { angleRef.current = angle; }, [angle]);

  const record = () => {
    const nearest = RECORD_ANGLES.reduce((best, a) => Math.abs(a - angle) < Math.abs(best - angle) ? a : best, RECORD_ANGLES[0]);
    if (Math.abs(nearest - angle) > 4) return;
    setRecorded((r) => ({ ...r, [nearest]: angle }));
  };
  const reset = () => { setAngle(30); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = RECORD_ANGLES.map((a) => {
    const r = recorded[a];
    return [`${a}`, r ? r.toFixed(1) : "—", r ? r.toFixed(1) : "—"];
  });

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Light · Plane mirror">
      <Header
        title="Reflection from a"
        accent="plane mirror"
        blurb="A ray of light strikes a plane mirror. Locating pins trace the reflected ray. Measure the angle of incidence and the angle of reflection from the normal — they should be equal. Repeat for five different angles to confirm the law of reflection."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="p-4 mb-3" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>angle of incidence (from normal)</div>
            <input type="range" min="0" max="80" step="0.5" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full" />
            <div className="text-lg" style={{ fontFamily: mono }}>{angle.toFixed(1)}° &nbsp; → &nbsp; reflected: {angle.toFixed(1)}°</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record at nearest {RECORD_ANGLES.join("°/")}°
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["i target (°)", "i measured (°)", "r measured (°)"]} rows={rows} />
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
