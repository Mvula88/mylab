"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw, ArrowRight } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBunsen, makeTripod, glassMaterial, liquidMaterial } from "./three/SceneKit";

const QUIZ = [
  { q: "Word equation for fermentation:",
    options: ["Glucose → ethanol + carbon dioxide (anaerobic, catalysed by yeast enzymes)", "Glucose + oxygen → carbon dioxide + water", "Sucrose + water → glucose + fructose", "Glucose → starch"], correct: 0 },
  { q: "Why must AIR be EXCLUDED from the fermentation vessel?",
    options: ["So that respiration is ANAEROBIC — in air, yeast respires aerobically and produces CO₂ and water only (no ethanol)", "Air evaporates the glucose", "Air kills the yeast immediately", "Air makes the limewater go pink"], correct: 0 },
  { q: "After fermentation, dilute ethanol can be concentrated by distillation. Why does the ETHANOL come off FIRST?",
    options: ["Ethanol is heavier", "Ethanol has a lower boiling point (78 °C) than water (100 °C)", "Ethanol does not react with water", "Random order"], correct: 1 },
  { q: "Fermentation stops once the alcohol concentration in the mixture reaches about 15 %. Why?",
    options: ["The yeast runs out of glucose", "Ethanol is TOXIC to yeast above ~15 % — high concentrations of its own product kill the yeast cells", "The temperature drops", "CO₂ pressure prevents further reaction"], correct: 1 },
];

export default function FermentationLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const stageRef = useRef("idle");
  const progRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.2, lookY: 0.2 },
    });
    scene.add(makeBench({ width: 2.2, depth: 0.7 }));

    /* ── Stage A: Fermentation setup ── */
    const stageA = new THREE.Group();
    // conical flask
    const flaskGeom = new THREE.LatheGeometry([
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.07, 0),
      new THREE.Vector2(0.07, 0.02),
      new THREE.Vector2(0.028, 0.13),
      new THREE.Vector2(0.026, 0.17),
      new THREE.Vector2(0.028, 0.18),
    ], 32);
    const flask = new THREE.Mesh(flaskGeom, glassMaterial());
    flask.position.set(-0.3, 0, 0);
    flask.castShadow = true;
    stageA.add(flask);
    // glucose+yeast solution
    const solnMat = liquidMaterial(0xe8d28a, 0.7);
    const soln = new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.063, 0.08, 32), solnMat);
    soln.position.set(-0.3, 0.04, 0);
    stageA.add(soln);
    // yeast specks
    for (let i = 0; i < 20; i++) {
      const sp = new THREE.Mesh(
        new THREE.SphereGeometry(0.002, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0xc09858, roughness: 0.7 })
      );
      sp.position.set(-0.3 + (Math.random() - 0.5) * 0.1, 0.02 + Math.random() * 0.06, (Math.random() - 0.5) * 0.1);
      stageA.add(sp);
    }
    // bung & delivery tube
    const bungMat = new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.6 });
    const bung = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.018, 16), bungMat);
    bung.position.set(-0.3, 0.19, 0);
    stageA.add(bung);
    const dt = glassMaterial({ opacity: 0.45 });
    const dtVert = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.07, 12), dt);
    dtVert.position.set(-0.3, 0.232, 0);
    stageA.add(dtVert);
    const dtHorz = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.35, 12), dt);
    dtHorz.rotation.z = Math.PI / 2;
    dtHorz.position.set(-0.12, 0.265, 0);
    stageA.add(dtHorz);
    const dtDown = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.13, 12), dt);
    dtDown.position.set(0.06, 0.2, 0);
    stageA.add(dtDown);

    // limewater test tube
    const tubeGeom = new THREE.LatheGeometry([
      new THREE.Vector2(0.0001, 0),
      new THREE.Vector2(0.015, 0.01),
      new THREE.Vector2(0.015, 0.13),
      new THREE.Vector2(0.017, 0.13),
      new THREE.Vector2(0.017, 0),
    ], 24);
    const lwTube = new THREE.Mesh(tubeGeom, glassMaterial());
    lwTube.position.set(0.06, 0.05, 0);
    stageA.add(lwTube);
    const limewaterMat = liquidMaterial(0xfefcf3, 0.5);
    const limewater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.07, 24),
      limewaterMat
    );
    limewater.position.set(0.06, 0.085, 0);
    stageA.add(limewater);

    // CO2 bubbles in flask and limewater
    const fermentBubbles = [];
    for (let i = 0; i < 12; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.0025, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
      );
      b.visible = false;
      b.userData = { t: -1 };
      stageA.add(b);
      fermentBubbles.push(b);
    }
    const lwBubbles = [];
    for (let i = 0; i < 10; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.002, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
      );
      b.visible = false;
      b.userData = { t: -1 };
      stageA.add(b);
      lwBubbles.push(b);
    }
    scene.add(stageA);

    /* ── Stage B: Distillation ── */
    const stageB = new THREE.Group();
    // tripod + bunsen for round-bottom flask
    const tripodB = makeTripod();
    tripodB.position.set(-0.4, 0, 0);
    stageB.add(tripodB);
    const bunsenB = makeBunsen();
    bunsenB.position.set(-0.4, 0, 0);
    stageB.add(bunsenB);
    // round-bottom flask
    const rbf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 18), glassMaterial());
    rbf.position.set(-0.4, 0.225, 0);
    stageB.add(rbf);
    const rbfNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 16), glassMaterial());
    rbfNeck.position.set(-0.4, 0.305, 0);
    stageB.add(rbfNeck);
    // wine inside (shrinking)
    const wineMat = liquidMaterial(0xa61e28, 0.85);
    const wine = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 18, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), wineMat);
    wine.position.set(-0.4, 0.225, 0);
    stageB.add(wine);
    // condenser arm
    const condArm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.25, 12), glassMaterial({ opacity: 0.45 }));
    condArm.position.set(-0.27, 0.36, 0);
    condArm.rotation.z = -Math.PI / 4;
    stageB.add(condArm);
    // condenser jacket (cylinder around an inner tube)
    const cond = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 24), glassMaterial({ opacity: 0.35 }));
    cond.position.set(0.06, 0.28, 0);
    cond.rotation.z = -Math.PI / 4;
    stageB.add(cond);
    // receiver flask
    const recv = new THREE.Mesh(flaskGeom, glassMaterial());
    recv.scale.set(0.7, 0.7, 0.7);
    recv.position.set(0.36, 0, 0);
    stageB.add(recv);
    const ethanolMat = liquidMaterial(0xfaf3da, 0.65);
    const ethanol = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 32), ethanolMat);
    ethanol.position.set(0.36, 0.018, 0);
    stageB.add(ethanol);
    // thermometer at neck
    const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.07, 8), glassMaterial({ opacity: 0.45 }));
    thermo.position.set(-0.4, 0.355, 0);
    stageB.add(thermo);
    stageB.visible = false;
    scene.add(stageB);

    sceneRef.current = {
      scene, camera, renderer, dispose,
      stageA, stageB,
      fermentBubbles, lwBubbles,
      limewaterMat,
      wine, ethanol, wineMat, ethanolMat,
    };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.2 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      const st = stageRef.current;
      const prog = progRef.current;

      stageA.visible = st === "idle" || st === "fermenting";
      stageB.visible = st === "fermented" || st === "distilling" || st === "done";

      // fermentation bubbles (active while st === "fermenting")
      if (st === "fermenting" || st === "fermented") {
        fermentBubbles.forEach((b, i) => {
          if (b.userData.t < 0 && Math.random() < 0.04) {
            b.userData.t = 0;
            b.position.set(-0.3 + (Math.random() - 0.5) * 0.08, 0.02, (Math.random() - 0.5) * 0.08);
            b.visible = true;
          }
          if (b.userData.t >= 0) {
            b.userData.t += dt * 0.8;
            b.position.y += dt * 0.07;
            b.material.opacity = 0.85 * (1 - b.userData.t);
            if (b.userData.t > 1) { b.userData.t = -1; b.visible = false; }
          }
        });
        lwBubbles.forEach((b) => {
          if (b.userData.t < 0 && Math.random() < 0.03) {
            b.userData.t = 0;
            b.position.set(0.06 + (Math.random() - 0.5) * 0.015, 0.05, (Math.random() - 0.5) * 0.015);
            b.visible = true;
          }
          if (b.userData.t >= 0) {
            b.userData.t += dt * 1.0;
            b.position.y += dt * 0.04;
            b.material.opacity = 0.85 * (1 - b.userData.t);
            if (b.userData.t > 1) { b.userData.t = -1; b.visible = false; }
          }
        });
        // limewater goes milky
        const cloud = st === "fermenting" ? prog : 1;
        limewaterMat.color.setHex(lerpHex(0xfefcf3, 0xffffff, cloud));
        limewaterMat.opacity = 0.5 + cloud * 0.45;
        limewaterMat.transmission = 0.4 - cloud * 0.35;
      }

      // Distillation: shrink wine, fill receiver
      if (st === "distilling" || st === "done") {
        const k = st === "done" ? 1 : prog;
        wine.scale.y = Math.max(0.05, 1 - k);
        ethanol.scale.y = 0.05 + k * 4;
        ethanol.position.y = 0.018 + ((0.05 + k * 4 - 1) * 0.005);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  // Stage-progression ticks
  useEffect(() => {
    stageRef.current = stage;
    if (stage !== "fermenting" && stage !== "distilling") return;
    progRef.current = 0;
    setProgress(0);
    const start = performance.now();
    const dur = stage === "fermenting" ? 5000 : 4500;
    const tick = () => {
      const k = Math.min(1, (performance.now() - start) / dur);
      progRef.current = k;
      setProgress(k);
      if (k < 1) requestAnimationFrame(tick);
      else {
        if (stage === "fermenting") setStage("fermented");
        else setStage("done");
      }
    };
    requestAnimationFrame(tick);
  }, [stage]);

  const advance = () => {
    if (stage === "idle") setStage("fermenting");
    else if (stage === "fermented") setStage("distilling");
  };
  const reset = () => { setStage("idle"); setProgress(0); progRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Organic · Fermentation">
      <Header
        title="Fermentation of glucose to"
        accent="ethanol"
        blurb="Yeast cells digest glucose ANAEROBICALLY to make ethanol and carbon dioxide. CO₂ is detected as it bubbles through limewater. After a week, the mixture is distilled to concentrate the ethanol."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {stage === "idle" && <PrimaryButton onClick={advance} icon={Play}>Set up &amp; begin fermentation</PrimaryButton>}
            {stage === "fermenting" && <div className="py-2.5 px-4 text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>Fermenting · day {Math.floor(progress * 7) + 1} / 7</div>}
            {stage === "fermented" && <PrimaryButton onClick={advance} icon={ArrowRight}>Distill the mixture</PrimaryButton>}
            {stage === "distilling" && <div className="py-2.5 px-4 text-[11px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>Distilling…</div>}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Word equation">
            <div className="text-sm mb-3" style={{ fontFamily: mono, fontWeight: 500 }}>
              C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂
            </div>
            <div className="text-xs opacity-80 leading-snug">
              Catalysed by enzymes (zymase) in yeast. Optimum 25–37 °C. No oxygen allowed — keep the air-lock sealed.
            </div>
            {stage === "fermenting" && (
              <div className="text-xs opacity-80 leading-snug mt-2 border-t border-stone-900/15 pt-2">
                Bubbles continuously through the limewater — confirming CO₂ release.
              </div>
            )}
            {(stage === "fermented" || stage === "distilling" || stage === "done") && (
              <div className="text-xs opacity-80 leading-snug mt-2 border-t border-stone-900/15 pt-2">
                Limewater has gone milky. Fermented mixture is ~12 % ethanol.
              </div>
            )}
            {stage === "done" && (
              <div className="text-xs opacity-80 leading-snug mt-2 border-t border-stone-900/15 pt-2">
                Distillate is clear and burns with a blue flame — concentrated ethanol collected.
              </div>
            )}
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
