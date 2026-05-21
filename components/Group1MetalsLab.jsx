"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const METALS = [
  { id: "Li", name: "Lithium",   duration: 6000, vigor: 1, fire: null,       obs: [
    "Floats on the water (less dense than water)",
    "Fizzes gently — hydrogen gas released steadily",
    "Moves slowly across the surface as gas pushes it",
    "Phenolphthalein turns pink (LiOH formed)",
  ] },
  { id: "Na", name: "Sodium",    duration: 4000, vigor: 3, fire: null,       obs: [
    "Floats on the water",
    "Exothermic reaction MELTS sodium into a silver SPHERE",
    "Sphere fizzes vigorously and zooms across the surface",
    "Disappears in seconds; phenolphthalein turns pink (NaOH)",
  ] },
  { id: "K",  name: "Potassium", duration: 2500, vigor: 6, fire: 0xc97edc,   obs: [
    "Floats on the water",
    "Extremely vigorous, exothermic",
    "Hydrogen IGNITES — LILAC FLAME (K⁺ flame test colour)",
    "Crackles or pops; KOH solution strongly alkaline",
  ] },
];

const QUIZ = [
  { q: "What is the general equation for a Group I metal reacting with water?",
    options: ["2M + 2H₂O → 2MOH + H₂", "M + 2H₂O → M(OH)₂ + H₂", "M + H₂O → MOH + O₂", "2M + O₂ → 2MO"], correct: 0 },
  { q: "Why does potassium burn with a lilac flame but lithium does not?",
    options: ["Lithium is too cold", "Potassium is much more reactive — heat from the reaction is enough to ignite the H₂; the K⁺ ion gives a lilac flame colour", "Potassium absorbs water faster", "Lithium does not produce hydrogen"], correct: 1 },
  { q: "Phenolphthalein indicator was added to the water at the start. After the reaction, why does it turn PINK?",
    options: ["The water becomes acidic", "An alkaline metal hydroxide has dissolved in the water — phenolphthalein is pink in alkali", "The water has been heated", "Hydrogen gas turns phenolphthalein pink"], correct: 1 },
  { q: "Why does reactivity INCREASE going DOWN Group I?",
    options: ["Atoms get smaller", "Outer-shell electron is further from the nucleus and more shielded — it is held less tightly and is more easily lost", "Higher melting point", "More protons in the nucleus"], correct: 1 },
];

export default function Group1MetalsLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [running, setRunning] = useState({});  // metalId → start time
  const [done, setDone] = useState({});        // metalId → true
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const runRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.45, z: 1.0, lookY: 0.1 },
    });
    scene.add(makeBench({ width: 2.2, depth: 0.7 }));

    const tubs = [];
    METALS.forEach((m, i) => {
      const grp = new THREE.Group();
      grp.position.set((i - 1) * 0.35, 0, 0);

      // tub (glass beaker)
      const tub = new THREE.Mesh(
        new THREE.LatheGeometry([
          new THREE.Vector2(0.0001, 0),
          new THREE.Vector2(0.085, 0),
          new THREE.Vector2(0.085, 0.08),
          new THREE.Vector2(0.088, 0.08),
          new THREE.Vector2(0.088, 0),
          new THREE.Vector2(0.0001, 0),
        ], 36),
        glassMaterial()
      );
      tub.castShadow = true;
      grp.add(tub);

      // water (turns pink as reaction completes)
      const waterMat = liquidMaterial(0xfefcf3, 0.45);
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(0.083, 0.083, 0.06, 36),
        waterMat
      );
      water.position.y = 0.03;
      grp.add(water);

      // metal piece (silvery sphere bobbing on the surface)
      const metal = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 16, 12),
        new THREE.MeshStandardMaterial({
          color: m.id === "Li" ? 0xb8b8b8 : m.id === "Na" ? 0xd8d8d8 : 0xbcbcce,
          roughness: 0.3, metalness: 0.7,
        })
      );
      metal.position.set(0, 0.062, 0);
      metal.visible = false;
      grp.add(metal);

      // bubbles
      const bubbles = [];
      for (let j = 0; j < 12; j++) {
        const b = new THREE.Mesh(
          new THREE.SphereGeometry(0.003, 6, 4),
          new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
        );
        b.visible = false;
        b.userData = { t: -1 };
        grp.add(b);
        bubbles.push(b);
      }

      // flame (only K)
      const flame = m.fire ? new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.06, 12),
        new THREE.MeshBasicMaterial({ color: m.fire, transparent: true, opacity: 0.85 })
      ) : null;
      if (flame) {
        flame.position.set(0, 0.092, 0);
        flame.visible = false;
        grp.add(flame);
      }

      // label sprite
      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e";
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 28px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(m.id, 60, 32);
      ctx.font = "16px 'IBM Plex Mono', monospace";
      ctx.fillText(m.name, 170, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.22, 0.055, 1);
      sprite.position.set(0, -0.04, 0);
      grp.add(sprite);

      scene.add(grp);
      tubs.push({ grp, metal, bubbles, flame, waterMat, metalSpec: m });
    });

    sceneRef.current = { scene, camera, renderer, tubs, dispose };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.1 });

    let raf, last = performance.now();
    const animate = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const run = runRef.current;
      tubs.forEach((t) => {
        const startedAt = run[t.metalSpec.id];
        if (!startedAt) {
          t.metal.visible = false;
          t.bubbles.forEach((b) => { b.visible = false; });
          if (t.flame) t.flame.visible = false;
          return;
        }
        const elapsed = (now - startedAt) / t.metalSpec.duration;
        if (elapsed >= 1) {
          // done state: pink water, metal gone
          t.metal.visible = false;
          t.bubbles.forEach((b) => { b.visible = false; b.userData.t = -1; });
          if (t.flame) t.flame.visible = false;
          const target = new THREE.Color(0xfdc2dc);
          t.waterMat.color.lerp(target, 0.05);
          return;
        }

        t.metal.visible = true;
        const wobble = Math.sin(now / 60 * t.metalSpec.vigor) * (0.02 * (1 + t.metalSpec.vigor * 0.4));
        t.metal.position.x = wobble;
        t.metal.position.z = Math.cos(now / 70 * t.metalSpec.vigor) * 0.015;
        t.metal.scale.setScalar(Math.max(0.05, 1 - elapsed));
        // gentle pink tint as alkali forms
        const target = new THREE.Color(0xfdc2dc);
        t.waterMat.color.lerp(target, elapsed * 0.02);

        // bubble emission
        t.bubbles.forEach((b, idx) => {
          if (b.userData.t < 0 && Math.random() < 0.04 * t.metalSpec.vigor) {
            b.userData.t = 0;
            b.position.set(t.metal.position.x + (Math.random() - 0.5) * 0.02, 0.062, t.metal.position.z + (Math.random() - 0.5) * 0.02);
            b.visible = true;
          }
          if (b.userData.t >= 0) {
            b.userData.t += dt * (0.8 + t.metalSpec.vigor * 0.2);
            b.position.y += dt * 0.1 * (1 + t.metalSpec.vigor * 0.15);
            b.material.opacity = 0.85 * (1 - b.userData.t);
            if (b.userData.t > 1) { b.userData.t = -1; b.visible = false; }
          }
        });

        if (t.flame) {
          t.flame.visible = true;
          t.flame.position.x = t.metal.position.x;
          t.flame.position.z = t.metal.position.z;
          t.flame.scale.setScalar(0.7 + Math.sin(now / 50) * 0.25);
        }
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  const drop = (id) => {
    if (running[id] || done[id]) return;
    const start = performance.now();
    setRunning((r) => ({ ...r, [id]: start }));
    runRef.current[id] = start;
    const dur = METALS.find((m) => m.id === id).duration;
    setTimeout(() => {
      setDone((d) => ({ ...d, [id]: true }));
      setRunning((r) => {
        const next = { ...r };
        delete next[id];
        return next;
      });
    }, dur);
  };

  const reset = () => {
    setRunning({}); setDone({});
    runRef.current = {};
    // reset water colours
    sceneRef.current.tubs?.forEach((t) => t.waterMat.color.setHex(0xfefcf3));
  };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/chemistry" backLabel="Back to Chemistry" topic="Chemistry · Periodic table · Group I">
      <Header
        title="Reactivity of"
        accent="Group I metals with water"
        blurb="Pieces of lithium, sodium and potassium are dropped onto water containing phenolphthalein indicator. Each metal reacts to give a metal hydroxide and hydrogen — but reactivity increases sharply going DOWN the group."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {METALS.map((m) => (
              <button key={m.id} onClick={() => drop(m.id)}
                disabled={!!running[m.id] || !!done[m.id]}
                className="relative p-3 transition active:scale-95 text-left"
                style={{
                  backgroundColor: done[m.id] ? "rgba(46,125,50,0.1)" : running[m.id] ? "rgba(236,64,122,0.15)" : "rgba(26,31,46,0.05)",
                  border: `1px solid ${done[m.id] ? "#2e7d32" : "rgba(26,31,46,0.18)"}`,
                }}>
                <div className="text-2xl" style={{ fontFamily: mono, fontWeight: 700 }}>{m.id}</div>
                <div className="text-sm" style={{ fontWeight: 500 }}>{m.name}</div>
                {done[m.id] && (
                  <div className="absolute top-2 right-2"><CheckCircle2 size={14} color="#2e7d32" /></div>
                )}
              </button>
            ))}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset all</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Observations">
            {METALS.map((m) => (
              <div key={m.id} className="mb-3 last:mb-0">
                <div className="text-xs uppercase mb-1" style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#c2185b", fontWeight: 600 }}>
                  {m.name}
                </div>
                {done[m.id] ? (
                  <ul className="text-xs space-y-0.5 opacity-85">
                    {m.obs.map((o, i) => <li key={i}>· {o}</li>)}
                  </ul>
                ) : (
                  <div className="text-[11px] opacity-50">Drop the metal to observe.</div>
                )}
              </div>
            ))}
          </Card>

          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
