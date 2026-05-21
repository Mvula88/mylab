"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw, Wind } from "lucide-react";
import { Shell, Header, QuizPanel, mono, PrimaryButton, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, glassMaterial, liquidMaterial } from "./three/SceneKit";

const QUIZ = [
  {
    q: "Which gas, present in higher concentration in exhaled air, causes limewater to go milky?",
    options: ["Oxygen (O₂)", "Nitrogen (N₂)", "Carbon dioxide (CO₂)", "Water vapour (H₂O)"],
    correct: 2,
  },
  {
    q: "Why is it important that air must bubble THROUGH the limewater (not just sit above it)?",
    options: [
      "So the gas can dissolve in and react with the calcium hydroxide solution",
      "Because limewater needs oxygen to react",
      "To keep the apparatus airtight",
      "To prevent the limewater from evaporating",
    ],
    correct: 0,
  },
  {
    q: "What is the white precipitate that forms in limewater when CO₂ passes through?",
    options: ["Calcium chloride", "Calcium carbonate (CaCO₃)", "Calcium oxide", "Calcium hydroxide"],
    correct: 1,
  },
  {
    q: "In the U-tube experiment, why does the inhaled-air side stay almost clear?",
    options: [
      "There is no CO₂ in atmospheric air",
      "Atmospheric air contains only ≈ 0.04 % CO₂, far less than exhaled air (~ 4 %)",
      "The inhaled limewater is not as concentrated",
      "The valve blocks atmospheric CO₂",
    ],
    correct: 1,
  },
];

export default function LimewaterExhaledLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [breaths, setBreaths] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | inhaling | exhaling
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // cloudiness 0..1 for each side
  const cloudRef = useRef({ inh: 0, exh: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.55, z: 1.2, lookY: 0.25 },
    });
    scene.add(makeBench({ width: 2.0, depth: 0.7 }));

    // Two big boiling tubes, side by side
    const makeBoilingTube = (x, label) => {
      const grp = new THREE.Group();
      // body
      const outer = [];
      const r = 0.03, h = 0.28;
      for (let i = 0; i <= 8; i++) {
        const a = (Math.PI / 2) + (i / 8) * (Math.PI / 2);
        outer.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a)));
      }
      for (let i = 1; i <= 16; i++) outer.push(new THREE.Vector2(r, (i / 16) * h));
      const tube = new THREE.Mesh(new THREE.LatheGeometry(outer, 28), glassMaterial());
      tube.castShadow = true;
      grp.add(tube);
      // limewater
      const fluidH = 0.18;
      const fluidR = r - 0.002;
      const fluidMat = liquidMaterial(0xfefcf3, 0.55);
      const fluid = new THREE.Mesh(
        new THREE.CylinderGeometry(fluidR, fluidR, fluidH, 24),
        fluidMat
      );
      fluid.position.y = fluidH / 2;
      grp.add(fluid);
      // delivery tube poking down inside (small straw)
      const delivery = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0035, 0.0035, 0.32, 12),
        glassMaterial({ opacity: 0.5 })
      );
      delivery.position.set(0, 0.16, 0);
      grp.add(delivery);
      grp.position.set(x, 0, 0);
      // label sprite below
      const canvas = document.createElement("canvas");
      canvas.width = 320; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(26,31,46,0.0)";
      ctx.fillRect(0, 0, 320, 64);
      ctx.fillStyle = "#1a1f2e";
      ctx.font = "bold 24px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, 160, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.24, 0.05, 1);
      sprite.position.set(0, -0.05, 0.03);
      grp.add(sprite);
      grp.userData = { fluidMat, delivery, deliveryYbase: 0.16, tube };
      return grp;
    };

    const tubeIn = makeBoilingTube(-0.22, "INHALED AIR");
    const tubeOut = makeBoilingTube(0.22, "EXHALED AIR");
    scene.add(tubeIn);
    scene.add(tubeOut);

    // Y-piece + mouthpiece above
    const yMat = new THREE.MeshStandardMaterial({ color: 0x44464a, roughness: 0.55, metalness: 0.5 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 16), yMat);
    trunk.position.set(0, 0.5, 0);
    scene.add(trunk);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 16), yMat);
    armL.rotation.z = Math.PI / 3.5;
    armL.position.set(-0.12, 0.42, 0);
    scene.add(armL);
    const armR = armL.clone();
    armR.rotation.z = -Math.PI / 3.5;
    armR.position.set(0.12, 0.42, 0);
    scene.add(armR);
    // connect arms down to deliveries
    const downL = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.22, 12), glassMaterial({ opacity: 0.4 }));
    downL.position.set(-0.22, 0.4, 0);
    scene.add(downL);
    const downR = downL.clone();
    downR.position.set(0.22, 0.4, 0);
    scene.add(downR);

    // mouthpiece
    const mouth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xc2185b, roughness: 0.5 })
    );
    mouth.position.set(0, 0.62, 0);
    scene.add(mouth);

    // Valve indicators (sprites)
    const makeValveSprite = (x, openColour = "#2e7d32") => {
      const canvas = document.createElement("canvas");
      canvas.width = 96; canvas.height = 48;
      const ctx = canvas.getContext("2d");
      const draw = (state) => {
        ctx.clearRect(0, 0, 96, 48);
        ctx.fillStyle = "#fefcf3"; ctx.fillRect(8, 8, 80, 32);
        ctx.strokeStyle = "#1a1f2e"; ctx.lineWidth = 2; ctx.strokeRect(8, 8, 80, 32);
        ctx.fillStyle = state ? openColour : "#1a1f2e";
        ctx.beginPath();
        if (state) { ctx.moveTo(48, 14); ctx.lineTo(54, 34); ctx.lineTo(42, 34); }
        else { ctx.moveTo(36, 14); ctx.lineTo(60, 14); ctx.lineTo(48, 34); }
        ctx.closePath(); ctx.fill();
      };
      draw(false);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.09, 0.045, 1);
      sprite.position.set(x, 0.46, 0.04);
      sprite.userData = { draw, tex };
      return sprite;
    };
    const valveL = makeValveSprite(-0.08);
    const valveR = makeValveSprite(0.08);
    scene.add(valveL); scene.add(valveR);

    // Bubble pool
    const makeBubbles = (tube) => {
      const bubbles = [];
      const geo = new THREE.SphereGeometry(0.0028, 8, 6);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
      for (let i = 0; i < 12; i++) {
        const b = new THREE.Mesh(geo, mat.clone());
        b.visible = false;
        b.position.set(0, 0, 0);
        tube.add(b);
        bubbles.push({ mesh: b, t: -1 });
      }
      return bubbles;
    };
    const bubblesIn = makeBubbles(tubeIn);
    const bubblesOut = makeBubbles(tubeOut);

    sceneRef.current = { scene, camera, renderer, tubeIn, tubeOut, bubblesIn, bubblesOut, valveL, valveR, dispose };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.25 });

    let raf, lastT = performance.now();
    let bubbleTimer = 0;
    const animate = (now) => {
      const t = now ?? performance.now();
      const dt = Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      bubbleTimer += dt;

      // Update bubbles for the active side based on phase via dataset
      const ph = mount.dataset.phase || "idle";
      const cloud = cloudRef.current;
      const updateBubblesOn = (bubbles, active) => {
        bubbles.forEach((b) => {
          if (b.t < 0 && active && bubbleTimer > 0.12) {
            b.t = 0;
            b.mesh.position.set((Math.random() - 0.5) * 0.04, 0.005, (Math.random() - 0.5) * 0.04);
            b.mesh.visible = true;
            bubbleTimer = 0;
          }
          if (b.t >= 0) {
            b.t += dt;
            b.mesh.position.y += dt * 0.18;
            if (b.mesh.position.y > 0.18) { b.t = -1; b.mesh.visible = false; }
          }
        });
      };
      updateBubblesOn(bubblesIn, ph === "inhaling");
      updateBubblesOn(bubblesOut, ph === "exhaling");

      // Update limewater colour (clear → milky)
      const colIn = lerpHex(0xfefcf3, 0xffffff, cloud.inh) ;
      tubeIn.userData.fluidMat.color.setHex(colIn);
      tubeIn.userData.fluidMat.opacity = 0.55 + cloud.inh * 0.4;
      tubeIn.userData.fluidMat.transmission = 0.4 - cloud.inh * 0.35;

      const colOut = lerpHex(0xfefcf3, 0xffffff, cloud.exh);
      tubeOut.userData.fluidMat.color.setHex(colOut);
      tubeOut.userData.fluidMat.opacity = 0.55 + cloud.exh * 0.4;
      tubeOut.userData.fluidMat.transmission = 0.4 - cloud.exh * 0.35;

      // Valve indicator updates
      valveL.userData.draw(ph === "inhaling");
      valveL.userData.tex.needsUpdate = true;
      valveR.userData.draw(ph === "exhaling");
      valveR.userData.tex.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  /* Update the mount's data-attribute so the animation loop knows the phase */
  useEffect(() => {
    if (mountRef.current) mountRef.current.dataset.phase = phase;
  }, [phase]);

  const breathe = () => {
    if (phase !== "idle") return;
    setPhase("inhaling");
    setTimeout(() => {
      cloudRef.current.inh = Math.min(1, cloudRef.current.inh + 0.012);
      setPhase("exhaling");
      setTimeout(() => {
        cloudRef.current.exh = Math.min(1, cloudRef.current.exh + 0.14);
        setBreaths((b) => b + 1);
        setPhase("idle");
      }, 1400);
    }, 1400);
  };

  const reset = () => {
    cloudRef.current = { inh: 0, exh: 0 };
    setBreaths(0);
    setPhase("idle");
  };

  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Respiration · Limewater test">
      <Header
        title="Comparing"
        accent="inhaled vs exhaled air for CO₂"
        blurb="Air is drawn through one boiling tube of limewater when inhaling, and pushed through another when exhaling. The exhaled tube goes milky much faster — confirming that exhaled air contains more CO₂."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <PrimaryButton onClick={breathe} disabled={phase !== "idle"} icon={Wind}>Take a breath</PrimaryButton>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
            <div className="ml-auto text-sm" style={{ fontFamily: mono }}>{breaths} breath{breaths === 1 ? "" : "s"}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4" style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Inhaled side</div>
              <div className="text-sm">
                {cloudRef.current.inh < 0.1 ? "Stays clear" : cloudRef.current.inh < 0.4 ? "Very faintly cloudy" : "Slightly cloudy"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>Exhaled side</div>
              <div className="text-sm">
                {cloudRef.current.exh < 0.1 ? "Clear" : cloudRef.current.exh < 0.4 ? "Beginning to go cloudy" : cloudRef.current.exh < 0.75 ? "Milky-white precipitate" : "Strongly milky"}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card label="Reaction">
            <div className="text-xs leading-snug" style={{ fontFamily: mono }}>
              Ca(OH)₂ (aq) + CO₂ (g) → CaCO₃ (s) + H₂O (l)
            </div>
            <div className="text-xs opacity-70 mt-2 leading-snug">
              The insoluble calcium carbonate is what makes the solution appear milky.
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
