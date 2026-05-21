"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBeaker, glassMaterial, liquidMaterial } from "./three/SceneKit";

const TARGETS = [
  { id: "PbI2", name: "Lead iodide", formula: "PbI₂", cation: "Pb(NO₃)₂", anion: "KI",
    colour: 0xf0d640, sol1: 0xf0f4f9, sol2: 0xf6f3df,
    obs: "Bright yellow precipitate of PbI₂. Often described as 'shining gold'.",
    eq: "Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)" },
  { id: "BaSO4", name: "Barium sulfate", formula: "BaSO₄", cation: "Ba(NO₃)₂", anion: "Na₂SO₄",
    colour: 0xfafafa, sol1: 0xeaf1f4, sol2: 0xeef0f4,
    obs: "Dense white precipitate of BaSO₄ (positive test for sulfate ions).",
    eq: "Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)" },
  { id: "AgCl", name: "Silver chloride", formula: "AgCl", cation: "AgNO₃", anion: "NaCl",
    colour: 0xededed, sol1: 0xf2f2ec, sol2: 0xeaeef2,
    obs: "White precipitate of AgCl that darkens on standing in light.",
    eq: "Ag⁺(aq) + Cl⁻(aq) → AgCl(s)" },
  { id: "FeOH3", name: "Iron(III) hydroxide", formula: "Fe(OH)₃", cation: "FeCl₃", anion: "NaOH",
    colour: 0xb04a26, sol1: 0xf4d99d, sol2: 0xeaf0f5,
    obs: "Red-brown gelatinous precipitate of Fe(OH)₃.",
    eq: "Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)" },
];

const STEPS = [
  { id: "mix",    label: "Mix the two solutions in a beaker" },
  { id: "filter", label: "Filter the mixture (filter paper in funnel)" },
  { id: "wash",   label: "Wash residue with distilled water" },
  { id: "dry",    label: "Dry the residue (oven or air)" },
];

const QUIZ = [
  { q: "When making an insoluble salt by precipitation, why are TWO SOLUBLE salts mixed?",
    options: ["So that the salt forms easily — both ions are already in solution, they collide and the insoluble salt drops out as a precipitate", "Soluble salts react faster", "Solubility is irrelevant", "To dilute the acid"], correct: 0 },
  { q: "After filtering, the RESIDUE on the filter paper is washed with distilled water. Why?",
    options: ["To dissolve more salt", "To remove the soluble salt that was the BY-PRODUCT — leaving only the desired insoluble salt", "To cool the residue", "Distilled water removes colour"], correct: 1 },
  { q: "Lead iodide forms a yellow precipitate. What is the ionic equation?",
    options: ["Pb + 2I → PbI₂", "Pb²⁺ + 2I⁻ → PbI₂(s)", "PbI₂ + KNO₃ → KI + Pb(NO₃)₂", "Pb(NO₃)₂ → Pb²⁺ + 2NO₃⁻"], correct: 1 },
  { q: "Why CAN'T the 'acid + insoluble base' method be used to make lead iodide?",
    options: ["Lead iodide is unstable", "There is no available 'iodide base'; precipitation between two soluble salts is the standard route", "Lead is toxic", "Iodide is too expensive"], correct: 1 },
];

export default function InsolubleSaltsLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [targetId, setTargetId] = useState(TARGETS[0].id);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const targetRef = useRef(TARGETS[0]);
  const stepRef = useRef(-1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.5, z: 1.1, lookY: 0.15 },
    });
    scene.add(makeBench({ width: 2.0, depth: 0.7 }));

    /* Stage -1: two unmixed beakers side by side */
    const stageStart = new THREE.Group();
    const beakerA = makeBeaker({ radius: 0.05, height: 0.085 });
    beakerA.position.set(-0.18, 0, 0);
    beakerA.userData.setFill(0.8, 0xa7d4ec, 0.55);
    stageStart.add(beakerA);
    const beakerB = makeBeaker({ radius: 0.05, height: 0.085 });
    beakerB.position.set(0.18, 0, 0);
    beakerB.userData.setFill(0.8, 0xfdf4d8, 0.55);
    stageStart.add(beakerB);
    scene.add(stageStart);

    /* Stage 0: mixed beaker with precipitate cloud */
    const stageMix = new THREE.Group();
    const mixBeaker = makeBeaker({ radius: 0.055, height: 0.09 });
    mixBeaker.userData.setFill(0.85, 0xfff0c0, 0.85);
    stageMix.add(mixBeaker);
    // suspended precipitate particles
    const precipGroup = new THREE.Group();
    for (let i = 0; i < 60; i++) {
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.002, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0xf0d640, roughness: 0.6 })
      );
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.045;
      p.position.set(Math.cos(ang) * r, 0.005 + Math.random() * 0.06, Math.sin(ang) * r);
      precipGroup.add(p);
    }
    stageMix.add(precipGroup);
    stageMix.visible = false;
    scene.add(stageMix);

    /* Stage 1: filtration setup */
    const stageFilter = new THREE.Group();
    const standMat = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 });
    const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.5, 12), standMat);
    standRod.position.set(-0.1, 0.25, 0);
    stageFilter.add(standRod);
    const stdBase = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.13), standMat);
    stdBase.position.set(-0.1, 0.006, 0);
    stageFilter.add(stdBase);
    // funnel
    const funnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.045, 0.075, 28, 1, true),
      glassMaterial({ opacity: 0.4 })
    );
    funnel.rotation.x = Math.PI;
    funnel.position.set(0.0, 0.34, 0);
    stageFilter.add(funnel);
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.08, 12),
      glassMaterial({ opacity: 0.4 })
    );
    stem.position.set(0, 0.26, 0);
    stageFilter.add(stem);
    // residue on filter
    const residue = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 18, 12),
      new THREE.MeshStandardMaterial({ color: 0xf0d640, roughness: 0.55 })
    );
    residue.scale.set(1, 0.4, 1);
    residue.position.set(0, 0.32, 0);
    stageFilter.add(residue);
    // receiver flask
    const flask = makeBeaker({ radius: 0.045, height: 0.07 });
    flask.position.set(0, 0.115, 0);
    flask.userData.setFill(0.5, 0xeeeae0, 0.5);
    stageFilter.add(flask);
    // drip
    const drip = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xeeeae0, transparent: true, opacity: 0.85 })
    );
    drip.position.set(0, 0.22, 0);
    stageFilter.add(drip);
    stageFilter.visible = false;
    scene.add(stageFilter);

    /* Stage 2: wash bottle dripping water */
    const stageWash = new THREE.Group();
    // wash bottle (rounded with bent spout)
    const bottleMat = glassMaterial({ opacity: 0.5 });
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.07, 24),
      bottleMat
    );
    bottle.position.set(-0.18, 0.075, 0);
    stageWash.add(bottle);
    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.12, 12),
      bottleMat
    );
    spout.position.set(-0.13, 0.13, 0);
    spout.rotation.z = -Math.PI / 4;
    stageWash.add(spout);
    // jet of water
    const jet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0015, 0.0015, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xa7d4ec, transparent: true, opacity: 0.8 })
    );
    jet.position.set(-0.05, 0.18, 0);
    jet.rotation.z = -Math.PI / 4;
    stageWash.add(jet);
    // funnel & residue (same as filter stage, smaller)
    const funnel2 = funnel.clone();
    stageWash.add(funnel2);
    const stem2 = stem.clone();
    stageWash.add(stem2);
    const residue2 = residue.clone();
    stageWash.add(residue2);
    const flask2 = makeBeaker({ radius: 0.045, height: 0.07 });
    flask2.position.set(0, 0.115, 0);
    flask2.userData.setFill(0.55, 0xa7d4ec, 0.55);
    stageWash.add(flask2);
    stageWash.visible = false;
    scene.add(stageWash);

    /* Stage 3: dried product on watch glass */
    const stageDry = new THREE.Group();
    const watchGlass = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0),
        new THREE.Vector2(0.08, 0),
        new THREE.Vector2(0.08, 0.008),
        new THREE.Vector2(0.0001, 0.012),
      ], 32),
      glassMaterial({ opacity: 0.3 })
    );
    stageDry.add(watchGlass);
    // pile of fine precipitate
    const pile = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0xf0d640, roughness: 0.7 })
    );
    pile.scale.set(1, 0.35, 1);
    pile.position.y = 0.012;
    stageDry.add(pile);
    stageDry.visible = false;
    scene.add(stageDry);

    sceneRef.current = {
      scene, camera, renderer, dispose,
      stageStart, stageMix, stageFilter, stageWash, stageDry,
      mixBeaker, precipGroup, beakerA, beakerB,
      residue, residue2, pile, drip,
    };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.15 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const s = stepRef.current;
      const target = targetRef.current;

      // Recipe colour propagation: precipitate, residue, pile
      precipGroup.children.forEach((p) => p.material.color.setHex(target.colour));
      residue.material.color.setHex(target.colour);
      residue2.material.color.setHex(target.colour);
      pile.material.color.setHex(target.colour);
      // input solutions colours
      beakerA.userData.setFill(0.8, target.sol1, 0.55);
      beakerB.userData.setFill(0.8, target.sol2, 0.55);

      // Stage switching
      stageStart.visible = s === -1;
      stageMix.visible = s === 0;
      stageFilter.visible = s === 1;
      stageWash.visible = s === 2;
      stageDry.visible = s === 3;

      // Subtle drift of precipitate particles when in mix stage
      if (s === 0) {
        precipGroup.children.forEach((p, i) => {
          p.position.y += Math.sin(now / 1000 + i) * 0.0002;
        });
      }

      // Filter drip
      if (s === 1) {
        const phase = (now / 1000 * 1.5) % 1;
        drip.position.y = 0.22 - phase * 0.1;
        drip.material.opacity = 1 - phase;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { targetRef.current = TARGETS.find((t) => t.id === targetId); }, [targetId]);
  useEffect(() => { stepRef.current = step; }, [step]);

  const target = TARGETS.find((t) => t.id === targetId);
  const advance = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const reset = () => setStep(-1);
  const switchTarget = (id) => { setStep(-1); setTargetId(id); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Salts · Precipitation method">
      <Header
        title="Preparing an"
        accent="insoluble salt"
        blurb="Two soluble salt solutions are mixed. Their ions exchange partners; the insoluble salt drops out as a solid (a precipitate). Filter, wash, dry — and you have the pure insoluble salt."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {TARGETS.map((t) => (
              <button key={t.id} onClick={() => switchTarget(t.id)}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: t.id === targetId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${t.id === targetId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: t.id === targetId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-sm" style={{ fontFamily: mono, fontWeight: 600 }}>{t.formula}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{t.name}</div>
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {step < STEPS.length - 1 && (
              <PrimaryButton onClick={advance} icon={ArrowRight}>
                {step === -1 ? "Pour both solutions into beaker" : `Step ${step + 2}: ${STEPS[step + 1].label}`}
              </PrimaryButton>
            )}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>

          <div className="space-y-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-baseline gap-3 py-1.5 px-2"
                style={{
                  backgroundColor: i <= step ? "rgba(46,125,50,0.08)" : "transparent",
                  border: "1px solid rgba(26,31,46,0.1)",
                  opacity: i <= step ? 1 : 0.6,
                }}>
                <div className="text-[10px] uppercase opacity-65 shrink-0 w-12" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Step {i + 1}</div>
                <div className="text-sm" style={{ fontWeight: i <= step ? 500 : 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label={`${target.name}: recipe`}>
            <div className="text-xs space-y-2" style={{ fontFamily: mono }}>
              <div>cation source: <span style={{ fontWeight: 600 }}>{target.cation}(aq)</span></div>
              <div>anion source: <span style={{ fontWeight: 600 }}>{target.anion}(aq)</span></div>
              <div className="border-t border-stone-900/15 pt-2">{target.eq}</div>
              {step >= 0 && (
                <div className="border-t border-stone-900/15 pt-2 text-[11px] leading-snug">
                  <span style={{ color: "#c2185b", fontWeight: 600 }}>OBSERVATION:</span> {target.obs}
                </div>
              )}
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
