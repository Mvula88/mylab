"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Play, RotateCcw } from "lucide-react";
import { Shell, Header, Stat, QuizPanel, mono, PrimaryButton, SecondaryButton, StatGrid } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBunsen, makeTripod, glassMaterial, liquidMaterial } from "./three/SceneKit";

const QUIZ = [
  { q: "When the thermometer reads a STEADY 78 °C, what is condensing in the receiver?",
    options: ["Pure water", "Ethanol (bp 78 °C) — the lower-boiling component separates first", "A water/ethanol mixture in the same ratio as wine", "Methanol"], correct: 1 },
  { q: "What is the function of the GLASS BEADS / packing in the column?",
    options: ["Filter colour", "Large surface area on which vapour repeatedly condenses & re-evaporates, giving cleaner separation", "Absorb water vapour", "Raise the boiling point"], correct: 1 },
  { q: "Why does the temperature SHOOT UP toward 100 °C once ethanol is collected?",
    options: ["The Bunsen has been turned up", "The remaining liquid is mostly water; bp of the mixture rises toward water's", "Thermometer is broken", "Condenser has stopped"], correct: 1 },
  { q: "Why is fractional (not simple) distillation used?",
    options: ["Simple is too expensive", "Ethanol and water have close (but different) boiling points; the column re-distils vapour several times for a purer fraction", "Simple doesn't heat enough", "Wine contains solids"], correct: 1 },
];

export default function FractionalDistillationLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [phase, setPhase] = useState("idle");
  const [temp, setTemp] = useState(20);
  const [distilled, setDistilled] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const phaseRef = useRef("idle");
  const tempRef = useRef(20);
  const distRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.4, y: 0.7, z: 1.4, lookY: 0.4 },
    });
    scene.add(makeBench({ width: 2.4, depth: 0.7 }));

    /* Round-bottom flask + bunsen + tripod */
    const tripod = makeTripod();
    tripod.position.set(-0.6, 0, 0);
    scene.add(tripod);
    const bunsen = makeBunsen();
    bunsen.position.set(-0.6, 0, 0);
    scene.add(bunsen);
    const rbf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 18), glassMaterial());
    rbf.position.set(-0.6, 0.24, 0);
    scene.add(rbf);
    // wine in flask (shrinks over time)
    const wineMat = liquidMaterial(0xa61e28, 0.85);
    const wine = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 18, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), wineMat);
    wine.position.set(-0.6, 0.24, 0);
    scene.add(wine);
    // anti-bumping granules
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Mesh(
        new THREE.SphereGeometry(0.003, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0x222, roughness: 0.9 })
      );
      g.position.set(-0.6 + (Math.random() - 0.5) * 0.05, 0.195, (Math.random() - 0.5) * 0.05);
      scene.add(g);
    }

    /* Fractionating column with glass beads */
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 16), glassMaterial());
    column.position.set(-0.6, 0.41, 0);
    scene.add(column);
    // beads
    for (let i = 0; i < 18; i++) {
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.005, 12, 10),
        glassMaterial({ opacity: 0.55, color: 0xcbe6f5 })
      );
      bead.position.set(-0.6 + ((i % 3) - 1) * 0.004, 0.32 + (i * 0.011), ((i % 2) - 0.5) * 0.005);
      scene.add(bead);
    }

    /* Thermometer at top of column */
    const thMat = glassMaterial({ opacity: 0.55 });
    const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.08, 12), thMat);
    thermo.position.set(-0.6, 0.55, 0);
    scene.add(thermo);
    const merc = new THREE.Mesh(new THREE.CylinderGeometry(0.0023, 0.0023, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xc2185b }));
    merc.position.set(-0.6, 0.51, 0);
    scene.add(merc);

    /* Side arm down to condenser */
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.3, 12), glassMaterial({ opacity: 0.45 }));
    arm.rotation.z = -Math.PI / 4;
    arm.position.set(-0.45, 0.55, 0);
    scene.add(arm);

    /* Liebig condenser */
    const cond = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 24), glassMaterial({ opacity: 0.35 }));
    cond.position.set(-0.18, 0.45, 0);
    cond.rotation.z = -Math.PI / 6;
    scene.add(cond);
    // water jacket fluid (slight blue tint)
    const jacket = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.29, 24), liquidMaterial(0xa7d4ec, 0.25));
    jacket.position.set(-0.18, 0.45, 0);
    jacket.rotation.z = -Math.PI / 6;
    scene.add(jacket);
    // inner tube
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.3, 12), glassMaterial({ opacity: 0.45 }));
    inner.position.set(-0.18, 0.45, 0);
    inner.rotation.z = -Math.PI / 6;
    scene.add(inner);

    /* Receiver flask (small conical) */
    const recvGeom = new THREE.LatheGeometry([
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.045, 0),
      new THREE.Vector2(0.045, 0.012),
      new THREE.Vector2(0.02, 0.05),
      new THREE.Vector2(0.022, 0.06),
    ], 28);
    const recv = new THREE.Mesh(recvGeom, glassMaterial());
    recv.position.set(0.15, 0, 0);
    scene.add(recv);
    const distillateMat = liquidMaterial(0xf5e8c4, 0.7);
    const distillate = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 24), distillateMat);
    distillate.position.set(0.15, 0.012, 0);
    scene.add(distillate);

    // drip animation
    const drip = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf5e8c4 })
    );
    drip.position.set(0.07, 0.3, 0);
    drip.visible = false;
    scene.add(drip);

    // rising vapour particles in column
    const vapours = [];
    for (let i = 0; i < 6; i++) {
      const v = new THREE.Mesh(
        new THREE.SphereGeometry(0.005, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
      );
      v.visible = false;
      v.userData = { t: Math.random() };
      scene.add(v);
      vapours.push(v);
    }

    sceneRef.current = { scene, camera, renderer, dispose, wine, merc, distillate, drip, vapours, bunsen };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.4 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = ((now ?? performance.now()) - last) / 1000;
      last = now ?? performance.now();
      const p = phaseRef.current;

      bunsen.userData.setFlame(p !== "idle", 1.0);

      // thermometer mercury
      const tFrac = Math.max(0, Math.min(1, (tempRef.current - 0) / 110));
      merc.scale.y = tFrac * 5;
      merc.position.y = 0.49 + (tFrac * 0.04) / 2;

      // wine shrinks based on distilled
      const wineScale = Math.max(0.4, 1 - distRef.current / 30);
      wine.scale.set(wineScale, wineScale, wineScale);

      // distillate fills
      const fillScale = distRef.current / 19;
      distillate.scale.y = Math.max(0.05, fillScale * 6);
      distillate.position.y = 0.012 + (distillate.scale.y * 0.01 - 0.005);

      // drip animation when distilling
      if (p === "distilling") {
        drip.visible = true;
        const phase = ((now ?? performance.now()) / 1000 * 1.2) % 1;
        drip.position.set(0.15, 0.12 - phase * 0.1, 0);
        drip.material.opacity = 1 - phase;
        drip.material.transparent = true;
      } else {
        drip.visible = false;
      }

      // vapours rising
      if (p !== "idle") {
        vapours.forEach((v) => {
          if (!v.visible && Math.random() < 0.04) {
            v.visible = true;
            v.userData.t = 0;
            v.position.set(-0.6 + (Math.random() - 0.5) * 0.012, 0.32, 0);
          }
          if (v.visible) {
            v.userData.t += dt * 0.7;
            v.position.y += dt * 0.08;
            v.material.opacity = 0.5 * (1 - v.userData.t);
            if (v.userData.t > 1) v.visible = false;
          }
        });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  /* Phase driver */
  useEffect(() => {
    phaseRef.current = phase;
    if (phase === "idle" || phase === "done") return;
    const start = performance.now();
    const startTemp = tempRef.current;
    const startDist = distRef.current;
    let dur, targetTemp, targetDist, next;
    if (phase === "heating") { dur = 2500; targetTemp = 78; targetDist = 0; next = "distilling"; }
    else if (phase === "distilling") { dur = 4500; targetTemp = 78; targetDist = 18; next = "finishing"; }
    else if (phase === "finishing") { dur = 2500; targetTemp = 99; targetDist = 19; next = "done"; }
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 2);
      tempRef.current = startTemp + (targetTemp - startTemp) * eased;
      distRef.current = startDist + (targetDist - startDist) * eased;
      setTemp(tempRef.current);
      setDistilled(distRef.current);
      if (k < 1) requestAnimationFrame(tick);
      else setPhase(next);
    };
    requestAnimationFrame(tick);
  }, [phase]);

  const start = () => setPhase("heating");
  const reset = () => { setPhase("idle"); setTemp(20); setDistilled(0); tempRef.current = 20; distRef.current = 0; };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Separation techniques">
      <Header
        title="Fractional distillation of"
        accent="wine"
        blurb="Wine is roughly 12 % ethanol in water. By heating it in a flask fitted with a fractionating column, the ethanol can be separated and collected because it has a lower boiling point (78 °C) than water (100 °C)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/10", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {phase === "idle" && <PrimaryButton onClick={start} icon={Play}>Light the Bunsen</PrimaryButton>}
            {phase !== "idle" && (
              <div className="py-2.5 px-4 text-[11px] uppercase inline-flex items-center gap-2"
                style={{ fontFamily: mono, letterSpacing: "0.22em", border: "1px solid rgba(26,31,46,0.3)" }}>
                {phase === "heating" && "Phase: heating wine"}
                {phase === "distilling" && "Phase: collecting ethanol fraction"}
                {phase === "finishing" && "Phase: ethanol exhausted — temp climbing"}
                {phase === "done" && "Phase: complete"}
              </div>
            )}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>

          <StatGrid cols={2}>
            <Stat label="Thermometer" value={`${temp.toFixed(1)} °C`} highlight={Math.abs(temp - 78) < 1 && phase === "distilling"} />
            <Stat label="Distillate collected" value={`${distilled.toFixed(1)} mL`} />
          </StatGrid>
        </div>
        <div className="lg:col-span-5">
          <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
        </div>
      </div>
    </Shell>
  );
}
