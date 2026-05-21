"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, StatGrid } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, makeClampStand } from "./three/SceneKit";

const Mr_NH3 = 17;
const Mr_HCl = 36.5;
const TUBE_LENGTH_CM = 30;
const RATIO = Math.sqrt(Mr_HCl / Mr_NH3);
const NH3_DISTANCE = TUBE_LENGTH_CM * RATIO / (1 + RATIO);
const HCl_DISTANCE = TUBE_LENGTH_CM - NH3_DISTANCE;

const QUIZ = [
  { q: "The white ring forms CLOSER to the HCl end. Why?",
    options: ["HCl is more reactive", "NH₃ has a smaller relative molecular mass (Mr 17) than HCl (Mr 36.5), so NH₃ molecules move faster on average and diffuse further before they meet", "Cotton wool absorbs HCl", "Ammonia reacts with the glass"], correct: 1 },
  { q: "What is the white solid that forms in the ring?",
    options: ["Ammonia ice", "Hydrochloric acid", "Ammonium chloride, NH₄Cl", "Sodium chloride"], correct: 2 },
  { q: "Graham's law predicts the ratio of rates. Using rate ∝ 1/√Mr, the ratio NH₃ : HCl is:",
    options: ["√(36.5 ÷ 17) ≈ 1.47", "36.5 ÷ 17 ≈ 2.15", "17 ÷ 36.5 ≈ 0.47", "Exactly 2"], correct: 0 },
  { q: "Why is concentrated ammonia and concentrated HCl used?",
    options: ["Dilute solutions are dangerous", "Concentrated solutions release plenty of gas molecules quickly, so the experiment works in a reasonable time", "It changes the relative molecular mass", "Dilute solutions diffuse the wrong way"], correct: 1 },
];

export default function GasDiffusionLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const tRef = useRef(0);
  const runRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.0, lookY: 0.25 },
    });
    scene.add(makeBench({ width: 2.4, depth: 0.7 }));

    // Two clamp stands at each end
    const standL = makeClampStand({ rodHeight: 0.4 });
    standL.position.set(-0.5, 0, -0.05);
    scene.add(standL);
    const standR = makeClampStand({ rodHeight: 0.4 });
    standR.position.set(0.5, 0, -0.05);
    scene.add(standR);

    // Glass tube (long horizontal cylinder)
    const tubeLen = 0.9;  // metres
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, tubeLen, 32, 1, true),
      glassMaterial({ opacity: 0.35 })
    );
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, 0.28, 0);
    scene.add(tube);
    // end caps (clear stoppers)
    const stopperMat = new THREE.MeshStandardMaterial({ color: 0xfaf0d4, roughness: 0.8 });
    const stopL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.012, 24), stopperMat);
    stopL.rotation.z = Math.PI / 2;
    stopL.position.set(-tubeLen / 2 - 0.006, 0.28, 0);
    scene.add(stopL);
    const stopR = stopL.clone();
    stopR.position.set(tubeLen / 2 + 0.006, 0.28, 0);
    scene.add(stopR);

    // Cotton-wool plugs
    const woolMat = new THREE.MeshStandardMaterial({ color: 0xfdfbf3, roughness: 0.95 });
    const woolL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), woolMat);
    woolL.scale.set(0.5, 1, 1);
    woolL.position.set(-tubeLen / 2 + 0.025, 0.28, 0);
    scene.add(woolL);
    const woolR = woolL.clone();
    woolR.position.set(tubeLen / 2 - 0.025, 0.28, 0);
    scene.add(woolR);

    // NH3 cloud (purple) — grows from left
    const cloudGeo = new THREE.CylinderGeometry(0.023, 0.023, 0.05, 24, 1, true);
    const nh3Mat = new THREE.MeshBasicMaterial({ color: 0xb76ad4, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const nh3Cloud = new THREE.Mesh(cloudGeo, nh3Mat);
    nh3Cloud.rotation.z = Math.PI / 2;
    nh3Cloud.position.set(-tubeLen / 2 + 0.04, 0.28, 0);
    scene.add(nh3Cloud);
    // HCl cloud (green) — from right
    const hclMat = new THREE.MeshBasicMaterial({ color: 0xa3c84a, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const hclCloud = new THREE.Mesh(cloudGeo, hclMat);
    hclCloud.rotation.z = Math.PI / 2;
    hclCloud.position.set(tubeLen / 2 - 0.04, 0.28, 0);
    scene.add(hclCloud);

    // White ring (NH4Cl)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.024, 0.005, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(0, 0.28, 0);
    ring.visible = false;
    scene.add(ring);

    // Floating labels
    const makeLabel = (text, x) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e";
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 24px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.16, 0.04, 1);
      sprite.position.set(x, 0.35, 0);
      return sprite;
    };
    scene.add(makeLabel("NH₃ · Mr 17", -tubeLen / 2 + 0.04));
    scene.add(makeLabel("HCl · Mr 36.5", tubeLen / 2 - 0.04));

    sceneRef.current = { scene, camera, renderer, dispose, nh3Cloud, hclCloud, ring, tubeLen };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.25 });

    let raf, lastT = performance.now();
    const animate = (now) => {
      const dt = Math.min(0.1, ((now ?? performance.now()) - lastT) / 1000);
      lastT = now ?? performance.now();
      if (runRef.current) tRef.current = Math.min(1, tRef.current + dt / 5.5);

      const tt = tRef.current;
      // NH3 spreads from left to NH3_DISTANCE cm of tube. HCl from right to HCl_DISTANCE.
      const tubeLen = sceneRef.current.tubeLen;
      const startX = -tubeLen / 2 + 0.04;
      const endX = tubeLen / 2 - 0.04;
      const usableLen = endX - startX;
      const nh3Frac = (NH3_DISTANCE / TUBE_LENGTH_CM);
      const hclFrac = (HCl_DISTANCE / TUBE_LENGTH_CM);
      const nh3Len = nh3Frac * usableLen * tt;
      const hclLen = hclFrac * usableLen * tt;
      sceneRef.current.nh3Cloud.geometry.dispose();
      sceneRef.current.nh3Cloud.geometry = new THREE.CylinderGeometry(0.023, 0.023, nh3Len, 24, 1, true);
      sceneRef.current.nh3Cloud.position.x = startX + nh3Len / 2;
      sceneRef.current.hclCloud.geometry.dispose();
      sceneRef.current.hclCloud.geometry = new THREE.CylinderGeometry(0.023, 0.023, hclLen, 24, 1, true);
      sceneRef.current.hclCloud.position.x = endX - hclLen / 2;

      // Ring appears at meeting point near end
      if (tt > 0.95) {
        sceneRef.current.ring.visible = true;
        sceneRef.current.ring.material = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: Math.min(1, (tt - 0.95) * 20), roughness: 0.6 });
        // position at meeting point
        sceneRef.current.ring.position.x = startX + nh3Frac * usableLen;
      } else {
        sceneRef.current.ring.visible = false;
      }

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
      if (tRef.current >= 1) { clearInterval(id); setRunning(false); }
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const reset = () => { tRef.current = 0; setT(0); setRunning(false); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Matter · Diffusion">
      <Header
        title="Diffusion of"
        accent="NH₃ and HCl gases"
        blurb="Concentrated ammonia and concentrated hydrochloric acid are placed at opposite ends of a glass tube on cotton-wool plugs. Both gases diffuse along the tube. Where they meet, a white smoke of ammonium chloride forms — and the position of this ring tells you the relative speed of the two gases."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/8", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {!running && t < 1 && <PrimaryButton onClick={start} icon={Play}>{t === 0 ? "Start" : "Resume"}</PrimaryButton>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>elapsed: {(t * 5).toFixed(1)} min</div>
          </div>

          <StatGrid cols={3}>
            <Stat label="from NH₃ end" value={`${(NH3_DISTANCE * t).toFixed(1)} cm`} highlight={t >= 1} />
            <Stat label="from HCl end" value={`${(HCl_DISTANCE * t).toFixed(1)} cm`} highlight={t >= 1} />
            <Stat label="ratio" value={t >= 1 ? `${RATIO.toFixed(2)} : 1` : "—"} />
          </StatGrid>
        </div>
        <div className="lg:col-span-5">
          <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
        </div>
      </div>
    </Shell>
  );
}
