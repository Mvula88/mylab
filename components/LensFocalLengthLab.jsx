"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, ResultsTable } from "./LabUI";
import {
  createScene, attachOrbitDrag, makeBench, makeOpticalBench, makeLensHolder,
  makeIlluminatedObject, makeScreen, makeRay,
} from "./three/SceneKit";

const F = 15;
const U_OPTIONS = [25, 30, 40, 50, 60];

const QUIZ = [
  { q: "Which equation links u, v and f?", options: ["1/u + 1/v = 1/f", "u + v = f", "u × v = f", "u² + v² = f²"], correct: 0 },
  { q: "When the object is placed at u = 2f, where is the sharp image?",
    options: ["At infinity", "Also at v = 2f, same size as the object but inverted", "At v = f", "On the lens itself"], correct: 1 },
  { q: "Why does the image on the screen appear INVERTED?",
    options: ["The lens reverses colours", "Rays from the top of the object cross those from the bottom at the focal point, flipping the image", "Gravity pulls light down", "Cameras work the same way"], correct: 1 },
  { q: "If u = 30 cm gives a sharp image at v = 30 cm, the focal length is:",
    options: ["10 cm", "15 cm  (1/30 + 1/30 = 1/15)", "30 cm", "60 cm"], correct: 1 },
];

export default function LensFocalLengthLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [u, setU] = useState(30);
  const [v, setV] = useState(30);
  const [recorded, setRecorded] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const uRef = useRef(30); const vRef = useRef(30);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.05, y: 0.55, z: 1.4, lookY: 0.2 },
    });
    scene.add(makeBench({ width: 2.6, depth: 0.8 }));
    scene.add(makeOpticalBench({ length: 1.8 }));

    // Object on left, lens fixed at centre, screen on right
    const objHolder = makeIlluminatedObject();
    scene.add(objHolder);
    const lensHolder = makeLensHolder();
    scene.add(lensHolder);
    const screen = makeScreen();
    scene.add(screen);

    // World positions: 1 unit = 1 m, but bench is ~1.8m so scale 1 cm → 0.012 m
    const SCALE = 0.012;
    const xLens = 0;
    const setXObject = (uCm) => { objHolder.position.set(xLens - uCm * SCALE, 0, 0); };
    const setXScreen = (vCm) => { screen.position.set(xLens + vCm * SCALE, 0, 0); };
    setXObject(30); setXScreen(30);

    // Rays (3 principal rays from arrow tip)
    const rayA = makeRay(0xc2185b); scene.add(rayA);
    const rayB = makeRay(0xc2185b); scene.add(rayB);
    const rayC = makeRay(0x1a8af0); scene.add(rayC);
    const rayD = makeRay(0xc2185b); scene.add(rayD);
    const rayE = makeRay(0xc2185b); scene.add(rayE);
    const rayF = makeRay(0x1a8af0); scene.add(rayF);

    sceneRef.current = {
      scene, camera, renderer, dispose,
      objHolder, lensHolder, screen, setXObject, setXScreen, SCALE,
      rays: { rayA, rayB, rayC, rayD, rayE, rayF },
    };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.2 });

    let raf;
    const animate = () => {
      const uCm = uRef.current, vCm = vRef.current;
      setXObject(uCm); setXScreen(vCm);
      const idealV = (uCm * F) / (uCm - F);
      const sharp = Math.exp(-Math.pow((vCm - idealV) / 3.5, 2));

      // Update rays
      const objTipY = objHolder.userData.arrowTopY;
      const objX = xLens - uCm * SCALE;
      const scrX = xLens + vCm * SCALE;
      // Image tip Y (inverted) on screen
      const imgTipY = objHolder.position.y + (objHolder.userData.arrowBottomY) - (objTipY - objHolder.userData.arrowBottomY) * (idealV / uCm);
      const imgScreenY = objHolder.userData.arrowBottomY - (objTipY - objHolder.userData.arrowBottomY) * (vCm / uCm);

      // Three principal rays from top of arrow
      // 1) Parallel to axis then through focal point past lens
      sceneRef.current.rays.rayA.userData.setEndpoints(objX, objTipY, 0, xLens, objTipY, 0);
      sceneRef.current.rays.rayB.userData.setEndpoints(xLens, objTipY, 0, scrX, imgScreenY, 0);
      // 2) Through center of lens (undeviated)
      sceneRef.current.rays.rayC.userData.setEndpoints(objX, objTipY, 0, scrX, imgScreenY, 0);
      // 3) From bottom of object similar
      const objBotY = objHolder.userData.arrowBottomY;
      sceneRef.current.rays.rayD.userData.setEndpoints(objX, objBotY, 0, xLens, objBotY, 0);
      sceneRef.current.rays.rayE.userData.setEndpoints(xLens, objBotY, 0, scrX, objBotY, 0);
      sceneRef.current.rays.rayF.userData.setEndpoints(objX, objBotY, 0, scrX, objBotY, 0);

      // Draw image on screen canvas — sharp arrow when sharp, blur otherwise
      const cv = screen.userData.imgCanvas;
      const cx = cv.getContext("2d");
      cx.clearRect(0, 0, cv.width, cv.height);
      const op = Math.max(0, sharp);
      if (op > 0.05) {
        cx.globalAlpha = op;
        cx.strokeStyle = "#c2185b"; cx.fillStyle = "#c2185b";
        cx.lineWidth = 6;
        cx.beginPath(); cx.moveTo(128, 200); cx.lineTo(128, 80); cx.stroke();
        cx.beginPath(); cx.moveTo(118, 80); cx.lineTo(138, 80); cx.lineTo(128, 50); cx.closePath(); cx.fill();
      }
      // Blur halo when not sharp
      const blurOp = Math.max(0, 1 - sharp) * 0.35;
      if (blurOp > 0) {
        cx.globalAlpha = blurOp;
        cx.fillStyle = "#c2185b";
        cx.beginPath(); cx.arc(128, 128, 60, 0, Math.PI * 2); cx.fill();
      }
      cx.globalAlpha = 1;
      // flip vertically (image inverted)
      const flipped = document.createElement("canvas");
      flipped.width = cv.width; flipped.height = cv.height;
      const fx = flipped.getContext("2d");
      fx.translate(0, cv.height); fx.scale(1, -1);
      fx.drawImage(cv, 0, 0);
      cx.clearRect(0, 0, cv.width, cv.height);
      cx.drawImage(flipped, 0, 0);
      screen.userData.imgTex.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => { uRef.current = u; }, [u]);
  useEffect(() => { vRef.current = v; }, [v]);

  const idealV = (u * F) / (u - F);
  const sharp = Math.exp(-Math.pow((v - idealV) / 3.5, 2));

  const record = () => {
    if (sharp < 0.92 || recorded[u] != null) return;
    setRecorded((r) => ({ ...r, [u]: v }));
  };
  const reset = () => { setU(30); setV(30); setRecorded({}); };
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  const rows = U_OPTIONS.map((uu) => {
    const vv = recorded[uu];
    const ff = vv ? (1 / (1 / uu + 1 / vv)).toFixed(2) : null;
    return [`${uu}`, vv ? vv.toFixed(0) : "—", ff || "—"];
  });

  const fValues = U_OPTIONS.map((uu) => recorded[uu] ? 1 / (1 / uu + 1 / recorded[uu]) : null).filter((x) => x != null);
  const meanF = fValues.length ? fValues.reduce((a, b) => a + b, 0) / fValues.length : null;

  return (
    <Shell back="/physics" backLabel="Back to Physics" topic="Physics · Light · Converging lens">
      <Header
        title="Focal length of a"
        accent="converging lens"
        blurb="An illuminated object is placed in front of a converging lens, with a screen on the far side. The screen is moved until a sharp, inverted image forms. From u and v, the lens formula 1/u + 1/v = 1/f gives the focal length."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-4"
            style={{ backgroundColor: "rgba(26,31,46,0.04)", border: "1px solid rgba(26,31,46,0.18)" }}>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>object distance u</div>
              <select value={u} onChange={(e) => setU(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm" style={{ fontFamily: mono, backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.25)" }}>
                {U_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt} cm</option>)}
              </select>
            </div>
            <div>
              <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>screen distance v</div>
              <input type="range" min="15" max="90" step="0.5" value={v} onChange={(e) => setV(parseFloat(e.target.value))} className="w-full" />
              <div className="text-sm" style={{ fontFamily: mono }}>{v.toFixed(1)} cm {sharp > 0.92 && <span style={{ color: "#2e7d32" }}>· sharp</span>}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={record} disabled={sharp < 0.92 || !!recorded[u]}
              className="py-2.5 px-4 text-[11px] uppercase active:scale-95 disabled:opacity-40"
              style={{ fontFamily: mono, letterSpacing: "0.22em", backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              Record (need sharp image)
            </button>
            <SecondaryButton onClick={reset} icon={RotateCcw}>Reset</SecondaryButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultsTable label="Results table" columns={["u (cm)", "v (cm)", "f (cm)"]} rows={rows} />
          {meanF && (
            <div className="mt-3 p-4 text-center" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              <div className="text-[10px] uppercase mb-1" style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#ec407a" }}>
                Mean focal length
              </div>
              <div className="text-2xl" style={{ fontFamily: mono, fontWeight: 500 }}>{meanF.toFixed(2)} cm</div>
            </div>
          )}
          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
