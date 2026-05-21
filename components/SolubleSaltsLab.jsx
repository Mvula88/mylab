"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeBeaker, makeTripod, makeBunsen, glassMaterial, liquidMaterial } from "./three/SceneKit";

const RECIPES = [
  { id: "CuSO4", target: "CuSO₄ · 5H₂O", name: "Copper(II) sulfate",
    acid: "H₂SO₄", base: "CuO (copper(II) oxide — black)",
    solnHex: 0x2476b3, crystalHex: 0x2476b3,
    eq: "CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)", fizz: false },
  { id: "ZnSO4", target: "ZnSO₄ · 7H₂O", name: "Zinc sulfate",
    acid: "H₂SO₄", base: "ZnCO₃ (zinc carbonate — white)",
    solnHex: 0xfafafa, crystalHex: 0xfafafa,
    eq: "ZnCO₃(s) + H₂SO₄(aq) → ZnSO₄(aq) + CO₂(g) + H₂O(l)", fizz: true },
  { id: "CuCl2", target: "CuCl₂ · 2H₂O", name: "Copper(II) chloride",
    acid: "HCl", base: "CuCO₃ (copper carbonate — green)",
    solnHex: 0x39a3a3, crystalHex: 0x39a3a3,
    eq: "CuCO₃(s) + 2HCl(aq) → CuCl₂(aq) + CO₂(g) + H₂O(l)", fizz: true },
  { id: "MgSO4", target: "MgSO₄ · 7H₂O", name: "Magnesium sulfate",
    acid: "H₂SO₄", base: "MgO (magnesium oxide — white)",
    solnHex: 0xfdfdfd, crystalHex: 0xfafaf0,
    eq: "MgO(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂O(l)", fizz: false },
];

const STEPS = [
  { label: "Add the solid to warm acid in a beaker, stir" },
  { label: "Keep adding until no more dissolves (excess)" },
  { label: "Filter to remove unreacted solid" },
  { label: "Heat filtrate to evaporate half the water" },
  { label: "Allow to cool and crystallise" },
  { label: "Filter and dry the crystals" },
];

const QUIZ = [
  { q: "Why is EXCESS solid added to the acid?",
    options: ["To make the reaction faster", "So that ALL the acid reacts — the unreacted solid is filtered off, leaving a pure salt solution with no acid", "Because it looks more impressive", "Excess increases the temperature"],
    correct: 1 },
  { q: "When making CuCl₂ from CuCO₃ + HCl, you observe fizzing. What is the gas?",
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Chlorine"], correct: 2 },
  { q: "Why is the filtrate EVAPORATED only PART of the way (not boiled to dryness)?",
    options: ["To save energy", "To allow large, well-shaped CRYSTALS to grow as the saturated solution slowly cools", "Because the salt evaporates with water", "To remove the salt"],
    correct: 1 },
  { q: "The 'acid + carbonate / oxide' route is suitable for the salts of which kinds of metal?",
    options: ["Group I metals", "Any less-reactive metal whose own oxide/carbonate is solid and INSOLUBLE in water", "Only metals above hydrogen", "Only sodium and potassium"],
    correct: 1 },
];

export default function SolubleSaltsLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [recipeId, setRecipeId] = useState(RECIPES[0].id);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const recipeRef = useRef(RECIPES[0]);
  const stepRef = useRef(-1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.45, y: 0.5, z: 1.0, lookY: 0.18 },
    });
    scene.add(makeBench({ width: 2.0, depth: 0.7 }));

    /* ─── Stage 0: beaker on tripod with bunsen ─── */
    const stage0 = new THREE.Group();
    const tripod = makeTripod();
    tripod.position.set(-0.4, 0, 0);
    stage0.add(tripod);
    const bunsen = makeBunsen();
    bunsen.position.set(-0.4, 0, 0);
    stage0.add(bunsen);
    const beaker0 = makeBeaker({ radius: 0.045, height: 0.08 });
    beaker0.position.set(-0.4, 0.165, 0);
    beaker0.userData.setFill(0.7, 0xa7d4ec, 0.55);
    stage0.add(beaker0);
    // excess solid as little box pile inside
    const solidPile = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.006, 0.006, 0.006),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 })
      );
      m.position.set((Math.random() - 0.5) * 0.06, 0.005 * i, (Math.random() - 0.5) * 0.06);
      m.rotation.set(Math.random(), Math.random(), Math.random());
      solidPile.add(m);
    }
    solidPile.position.set(-0.4, 0.165 + 0.005, 0);
    stage0.add(solidPile);
    // CO2 bubbles for carbonate fizz
    const fizzGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
      );
      b.position.set((Math.random() - 0.5) * 0.06, 0.005, (Math.random() - 0.5) * 0.06);
      b.userData = { t: Math.random() };
      fizzGroup.add(b);
    }
    fizzGroup.position.set(-0.4, 0.17, 0);
    fizzGroup.visible = false;
    stage0.add(fizzGroup);
    scene.add(stage0);

    /* ─── Stage 2 (filter): funnel + filtrate flask ─── */
    const stage2 = new THREE.Group();
    const standMat = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.5, metalness: 0.6 });
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.13), standMat);
    standBase.position.set(0, 0.006, 0);
    stage2.add(standBase);
    const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.45, 12), standMat);
    standRod.position.set(-0.075, 0.235, 0);
    stage2.add(standRod);
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 12), standMat);
    arm2.rotation.z = Math.PI / 2;
    arm2.position.set(-0.02, 0.31, 0);
    stage2.add(arm2);
    // funnel (cone open at bottom)
    const funnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.04, 0.07, 24, 1, true),
      glassMaterial({ opacity: 0.45 })
    );
    funnel.rotation.x = Math.PI;
    funnel.position.set(0.0, 0.3, 0);
    stage2.add(funnel);
    // stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.08, 12),
      glassMaterial({ opacity: 0.45 })
    );
    stem.position.set(0, 0.225, 0);
    stage2.add(stem);
    // residue blob (excess solid trapped on filter paper)
    const residue = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 })
    );
    residue.scale.set(1, 0.4, 1);
    residue.position.set(0, 0.285, 0);
    stage2.add(residue);
    // conical receiver flask
    const flaskMat = glassMaterial({ opacity: 0.4 });
    const flaskGeo = new THREE.LatheGeometry([
      new THREE.Vector2(0.022, 0),
      new THREE.Vector2(0.04, 0),
      new THREE.Vector2(0.04, 0.012),
      new THREE.Vector2(0.018, 0.06),
      new THREE.Vector2(0.022, 0.075),
    ], 28);
    const flask = new THREE.Mesh(flaskGeo, flaskMat);
    flask.position.set(0, 0.085, 0);
    stage2.add(flask);
    // filtrate fluid
    const filtrate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.04, 24),
      liquidMaterial(0xa7d4ec, 0.7)
    );
    filtrate.position.set(0, 0.105, 0);
    stage2.add(filtrate);
    // dripping droplet
    const drip = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xa7d4ec, roughness: 0.2 })
    );
    drip.position.set(0, 0.18, 0);
    stage2.add(drip);
    stage2.position.set(0.15, 0, 0);
    stage2.visible = false;
    scene.add(stage2);

    /* ─── Stage 3 (evaporation): dish on tripod with steam ─── */
    const stage3 = new THREE.Group();
    const tripod3 = makeTripod();
    tripod3.position.set(0.55, 0, 0);
    stage3.add(tripod3);
    const bunsen3 = makeBunsen();
    bunsen3.position.set(0.55, 0, 0);
    stage3.add(bunsen3);
    // evaporating dish (shallow lathe)
    const dish = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0),
        new THREE.Vector2(0.06, 0),
        new THREE.Vector2(0.06, 0.018),
        new THREE.Vector2(0.058, 0.018),
        new THREE.Vector2(0.058, 0.003),
        new THREE.Vector2(0.0001, 0.003),
      ], 32),
      new THREE.MeshStandardMaterial({ color: 0xe8e4d8, roughness: 0.6 })
    );
    dish.position.set(0.55, 0.165, 0);
    stage3.add(dish);
    // shallow fluid in dish
    const dishFluid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.054, 0.054, 0.008, 32),
      liquidMaterial(0xa7d4ec, 0.7)
    );
    dishFluid.position.set(0.55, 0.169, 0);
    stage3.add(dishFluid);
    // steam plumes
    const steamGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 })
      );
      s.userData = { t: Math.random(), x: (i - 3) * 0.015 };
      steamGroup.add(s);
    }
    steamGroup.position.set(0.55, 0.2, 0);
    stage3.add(steamGroup);
    stage3.visible = false;
    scene.add(stage3);

    /* ─── Stage 5 (crystals): watch glass with shaped crystals ─── */
    const stage5 = new THREE.Group();
    const watchGlass = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.0001, 0),
        new THREE.Vector2(0.08, 0),
        new THREE.Vector2(0.08, 0.008),
        new THREE.Vector2(0.0001, 0.012),
      ], 32),
      glassMaterial({ opacity: 0.3 })
    );
    watchGlass.position.set(0.0, 0.005, 0);
    stage5.add(watchGlass);
    const crystals = new THREE.Group();
    for (let i = 0; i < 25; i++) {
      const sz = 0.005 + Math.random() * 0.005;
      const c = new THREE.Mesh(
        new THREE.OctahedronGeometry(sz, 0),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 })
      );
      c.position.set((Math.random() - 0.5) * 0.12, 0.012 + Math.random() * 0.005, (Math.random() - 0.5) * 0.12);
      c.rotation.set(Math.random(), Math.random(), Math.random());
      crystals.add(c);
    }
    stage5.add(crystals);
    stage5.position.set(0.0, 0, 0);
    stage5.visible = false;
    scene.add(stage5);

    sceneRef.current = {
      scene, camera, renderer, dispose,
      stage0, stage2, stage3, stage5,
      beaker0, solidPile, fizzGroup, dishFluid, steamGroup, drip,
      crystals,
      flaskFluid: filtrate, residueMesh: residue,
    };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.18 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const t = now / 1000;
      const r = recipeRef.current;
      const s = stepRef.current;

      // Update colour of fluids based on recipe (solution colour develops as solid dissolves)
      const beakerCol = s >= 1 ? r.solnHex : 0xa7d4ec;
      const liq = beaker0.children.find((c) => c.material && c.material.color && c.material.transmission);
      // (beaker liquid is recreated by setFill, easier just to call setFill)
      if (s === -1 || s === 0 || s === 1) {
        const blendT = s === -1 ? 0 : s === 0 ? 0.4 : 1;
        const col = lerpHex(0xa7d4ec, r.solnHex, blendT);
        beaker0.userData.setFill(0.7, col, 0.65);
      }

      // Animate fizz bubbles when reaction is fizzy
      if (r.fizz && (s === 0 || s === 1) && fizzGroup) {
        fizzGroup.visible = true;
        fizzGroup.children.forEach((b) => {
          b.userData.t += dt * 1.5;
          if (b.userData.t > 1) b.userData.t = 0;
          b.position.y = b.userData.t * 0.05;
          b.material.opacity = 0.85 * (1 - b.userData.t);
        });
      } else if (fizzGroup) {
        fizzGroup.visible = false;
      }

      // Show/hide stages
      stage0.visible = s < 2;
      stage2.visible = s === 2;
      stage3.visible = s === 3;
      stage5.visible = s >= 4;

      // Stage 2: drip animation
      if (s === 2) {
        const phase = (t * 1.2) % 1;
        drip.position.y = 0.18 - phase * 0.07;
        drip.material.opacity = 1 - phase;
      }
      // Stage 3: steam animation
      if (s === 3) {
        steamGroup.children.forEach((sp) => {
          sp.userData.t += dt * 0.4;
          if (sp.userData.t > 1) sp.userData.t = 0;
          sp.position.set(sp.userData.x, sp.userData.t * 0.3, 0);
          sp.material.opacity = 0.55 * (1 - sp.userData.t);
        });
        // shrink dish fluid
        dishFluid.scale.y = Math.max(0.1, 1 - (now / 1000 % 5) * 0.1);
      }

      // Stage 5+: tint crystals to recipe colour
      crystals.children.forEach((c) => {
        c.material.color.setHex(r.crystalHex);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { recipeRef.current = RECIPES.find((r) => r.id === recipeId); }, [recipeId]);
  useEffect(() => { stepRef.current = step; }, [step]);

  const recipe = RECIPES.find((r) => r.id === recipeId);
  const advance = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const reset = () => setStep(-1);
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Salts · Acid + base/carbonate">
      <Header
        title="Preparing a"
        accent="soluble salt"
        blurb="When the metal is less reactive than zinc, its oxide or carbonate is added in excess to a warm acid. The acid is fully neutralised; the remaining solid is filtered off; the salt solution is then evaporated and crystallised."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4">
            {RECIPES.map((r) => (
              <button key={r.id} onClick={() => { setRecipeId(r.id); setStep(-1); }}
                className="p-2 transition active:scale-95 text-left"
                style={{
                  backgroundColor: r.id === recipeId ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${r.id === recipeId ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                  color: r.id === recipeId ? "#e8e4d8" : "#1a1f2e",
                }}>
                <div className="text-sm" style={{ fontFamily: mono, fontWeight: 600 }}>{r.target}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{r.name}</div>
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {step < STEPS.length - 1 && (
              <PrimaryButton onClick={advance} icon={ArrowRight}>
                {step === -1 ? "Begin procedure" : `Step ${step + 2}: ${STEPS[step + 1].label.slice(0, 30)}…`}
              </PrimaryButton>
            )}
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>

          <div className="space-y-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-baseline gap-3 py-1.5 px-2"
                style={{
                  backgroundColor: i <= step ? "rgba(46,125,50,0.08)" : "transparent",
                  border: "1px solid rgba(26,31,46,0.1)",
                  opacity: i <= step ? 1 : 0.6,
                }}>
                <div className="text-[10px] uppercase opacity-65 shrink-0 w-12" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>{i + 1}</div>
                <div className="text-sm" style={{ fontWeight: i <= step ? 500 : 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label={`${recipe.name}: recipe`}>
            <div className="text-xs space-y-2" style={{ fontFamily: mono }}>
              <div>acid: <span style={{ fontWeight: 600 }}>{recipe.acid}(aq)</span></div>
              <div>base/carbonate: <span style={{ fontWeight: 600 }}>{recipe.base}</span></div>
              <div className="border-t border-stone-900/15 pt-2">{recipe.eq}</div>
              {step >= 0 && recipe.fizz && (
                <div className="text-[11px] opacity-80 leading-snug border-t border-stone-900/15 pt-2">
                  <span style={{ color: "#c2185b", fontWeight: 600 }}>OBSERVATION:</span> Fizzing (CO₂ released).
                </div>
              )}
              {step >= STEPS.length - 1 && (
                <div className="text-[11px] opacity-80 leading-snug border-t border-stone-900/15 pt-2">
                  Crystals of <span style={{ fontWeight: 600 }}>{recipe.target}</span> form on cooling.
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

function lerpHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
