"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import { Shell, Header, QuizPanel, mono, SecondaryButton, Card } from "./LabUI";
import { createScene, attachOrbitDrag, makeBench, makeTestTube } from "./three/SceneKit";

const FOODS = [
  { id: "bread",  name: "White bread",       sample: "5 mm cube, mashed in water", swatch: 0xe8d6a8, truth: { starch: true,  sugar: false, protein: false, lipid: false } },
  { id: "egg",    name: "Boiled egg white",  sample: "5 mm piece, ground in water", swatch: 0xf4f1e6, truth: { starch: false, sugar: false, protein: true,  lipid: false } },
  { id: "milk",   name: "Whole cow's milk",  sample: "2 cm³ direct from sample",    swatch: 0xf8f6ef, truth: { starch: false, sugar: true,  protein: true,  lipid: true  } },
  { id: "peanut", name: "Peanut paste",      sample: "Pea-sized smear in water",    swatch: 0xb88860, truth: { starch: false, sugar: false, protein: true,  lipid: true  } },
  { id: "banana", name: "Ripe banana",       sample: "Mashed flesh, 1 g",           swatch: 0xf4e58a, truth: { starch: false, sugar: true,  protein: false, lipid: false } },
  { id: "oil",    name: "Sunflower oil",     sample: "Two drops",                   swatch: 0xf6c945, truth: { starch: false, sugar: false, protein: false, lipid: true  } },
];

const TESTS = {
  starch:  { name: "Iodine test",     short: "Iodine",     pos: { label: "blue-black",            colour: 0x1c2548 }, neg: { label: "stays orange-brown",     colour: 0xb76a1c } },
  sugar:   { name: "Benedict's test", short: "Benedict's", pos: { label: "brick-red precipitate", colour: 0xa83215 }, neg: { label: "stays blue",             colour: 0x187fab } },
  protein: { name: "Biuret test",     short: "Biuret",     pos: { label: "violet / purple",       colour: 0x6b1a8c }, neg: { label: "stays blue",             colour: 0x187fab } },
  lipid:   { name: "Emulsion test",   short: "Ethanol",    pos: { label: "cloudy white emulsion", colour: 0xe9e4d6 }, neg: { label: "stays clear",            colour: 0xcbe1f0 } },
};
const NUTRIENTS = ["starch", "sugar", "protein", "lipid"];
const NUTRIENT_LABELS = { starch: "Starch", sugar: "Reducing sugar", protein: "Protein", lipid: "Lipid" };

export default function NutrientsInFoodsLab() {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const [foodId, setFoodId] = useState(FOODS[0].id);
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const foodRef = useRef(FOODS[0]);
  const activeRef = useRef(null);
  const resultsRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const { scene, camera, renderer, dispose } = createScene(mount, {
      background: 0xf5f1e3,
      camera: { x: 0.0, y: 0.4, z: 0.85, lookY: 0.12 },
    });
    scene.add(makeBench({ width: 1.4, depth: 0.65 }));

    // 4 test tubes in a row — one per test
    const tubes = NUTRIENTS.map((n, i) => {
      const tube = makeTestTube({ radius: 0.018, height: 0.16 });
      tube.position.set((i - 1.5) * 0.08, 0.04, 0);
      tube.userData.setFill(0.55, 0xe8d6a8, 0.85);
      scene.add(tube);
      // label
      const canvas = document.createElement("canvas");
      canvas.width = 192; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1f2e"; ctx.fillRect(0, 0, 192, 64);
      ctx.fillStyle = "#e8e4d8";
      ctx.font = "bold 20px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(TESTS[n].short, 96, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sprite.scale.set(0.075, 0.022, 1);
      sprite.position.set((i - 1.5) * 0.08, 0.235, 0);
      scene.add(sprite);
      return { tube, n };
    });

    sceneRef.current = { scene, camera, renderer, dispose, tubes };

    const detach = attachOrbitDrag(camera, renderer.domElement, { lookY: 0.12 });

    let raf;
    const animate = () => {
      const food = foodRef.current;
      tubes.forEach(({ tube, n }) => {
        const result = resultsRef.current[n];
        const isActive = activeRef.current === n;
        let colour, opacity;
        if (result !== undefined) {
          const t = TESTS[n];
          colour = result ? t.pos.colour : t.neg.colour;
          opacity = 0.85;
        } else if (isActive) {
          colour = 0xc0a060;
          opacity = 0.85;
        } else {
          colour = food.swatch;
          opacity = 0.85;
        }
        tube.userData.setFill(0.55, colour, opacity);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); detach(); dispose(); };
  }, []);

  useEffect(() => {
    foodRef.current = FOODS.find((f) => f.id === foodId);
    activeRef.current = activeTest;
    resultsRef.current = results[foodId] || {};
  }, [foodId, activeTest, results]);

  const food = FOODS.find((f) => f.id === foodId);
  const foodPred = predictions[foodId] || {};
  const foodRes = results[foodId] || {};

  const togglePred = (nut) => {
    setPredictions((p) => ({ ...p, [foodId]: { ...(p[foodId] || {}), [nut]: !(p[foodId] || {})[nut] } }));
  };
  const runTest = (nutrient) => {
    if (foodRes[nutrient] !== undefined) return;
    setActiveTest(nutrient);
    const positive = food.truth[nutrient];
    setTimeout(() => {
      setResults((r) => ({ ...r, [foodId]: { ...(r[foodId] || {}), [nutrient]: positive } }));
      setActiveTest(null);
    }, 1400);
  };
  const resetFood = () => {
    setResults((r) => ({ ...r, [foodId]: {} }));
    setPredictions((p) => ({ ...p, [foodId]: {} }));
  };

  const foodTested = Object.keys(foodRes).length;
  const allDone = foodTested === 4;
  const predScore = allDone ? NUTRIENTS.filter((n) => !!foodPred[n] === !!food.truth[n]).length : 0;
  const foodsCompleted = FOODS.filter((f) => Object.keys(results[f.id] || {}).length === 4).length;
  const QUIZ = [
    { q: "What does the iodine test detect?", options: ["Reducing sugar", "Protein", "Starch", "Lipid"], correct: 2 },
    { q: "Benedict's reagent gives a brick-red precipitate with:", options: ["Starch", "Reducing sugar", "Lipid", "Distilled water"], correct: 1 },
    { q: "Biuret reagent turns violet in the presence of:", options: ["Lipids", "Proteins", "Starch", "Carbohydrate"], correct: 1 },
    { q: "Why does the emulsion test indicate a lipid?", options: ["Lipid dissolves in ethanol; when poured into water, fine droplets form a milky emulsion", "Lipids absorb water", "Lipids turn ethanol pink", "Lipid floats on top"], correct: 0 },
  ];
  const score = QUIZ.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);

  return (
    <Shell back="/biology" backLabel="Back to Biology" topic="Biology · Food & nutrition · Investigation">
      <Header
        title="Identifying nutrients in"
        accent="real foods"
        blurb="Use the four standard food tests on six real food samples. For each food, predict which nutrients are present, run all four tests, then check your prediction against the mark scheme."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-4">
            {FOODS.map((f) => {
              const done = Object.keys(results[f.id] || {}).length === 4;
              const isActive = f.id === foodId;
              return (
                <button key={f.id} onClick={() => setFoodId(f.id)}
                  className="relative flex flex-col items-center p-2 transition active:scale-95"
                  style={{
                    backgroundColor: isActive ? "#1a1f2e" : "rgba(26,31,46,0.05)",
                    border: `1px solid ${isActive ? "#1a1f2e" : "rgba(26,31,46,0.15)"}`,
                    color: isActive ? "#e8e4d8" : "#1a1f2e",
                  }}>
                  <div className="w-7 h-7 rounded-full mb-1" style={{ backgroundColor: `#${f.swatch.toString(16).padStart(6, "0")}`, border: "1px solid rgba(26,31,46,0.3)" }} />
                  <div className="text-[10px] leading-tight text-center">{f.name}</div>
                  {done && (
                    <div className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ backgroundColor: "#2e7d32" }}>
                      <CheckCircle2 size={11} color="#e8e4d8" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div ref={mountRef} className="relative mb-4"
            style={{ aspectRatio: "16/9", backgroundColor: "#f5f1e3", border: "1px solid rgba(26,31,46,0.2)", overflow: "hidden" }} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {NUTRIENTS.map((n) => {
              const t = TESTS[n];
              const done = foodRes[n] !== undefined;
              const result = foodRes[n];
              const running = activeTest === n;
              return (
                <button key={n} onClick={() => runTest(n)} disabled={done || activeTest !== null}
                  className="p-3 text-left transition active:scale-95 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: done ? (result ? "rgba(46,125,50,0.12)" : "rgba(26,31,46,0.05)") : running ? "rgba(236,64,122,0.15)" : "rgba(26,31,46,0.06)",
                    border: `1px solid ${done ? (result ? "#2e7d32" : "rgba(26,31,46,0.2)") : "rgba(26,31,46,0.2)"}`,
                  }}>
                  <div className="text-[10px] uppercase opacity-60 mb-1" style={{ fontFamily: mono, letterSpacing: "0.18em" }}>{t.short}</div>
                  <div className="text-sm leading-snug" style={{ fontWeight: 500 }}>{t.name}</div>
                  {done && (
                    <div className="text-[10px] uppercase mt-2" style={{ fontFamily: mono, letterSpacing: "0.18em", color: result ? "#2e7d32" : "rgba(26,31,46,0.55)" }}>
                      {result ? "+ " + t.pos.label : "− " + t.neg.label}
                    </div>
                  )}
                  {running && <div className="text-[10px] uppercase mt-2" style={{ fontFamily: mono, letterSpacing: "0.18em", color: "#c2185b" }}>Running…</div>}
                </button>
              );
            })}
          </div>

          <SecondaryButton onClick={resetFood} icon={RotateCcw}>Reset this food</SecondaryButton>
        </div>

        <div className="lg:col-span-5">
          <Card label="Step 1 · Predict">
            <div className="text-base mb-3" style={{ fontWeight: 500 }}>Which nutrients in {food.name.toLowerCase()}?</div>
            <div className="grid grid-cols-2 gap-2">
              {NUTRIENTS.map((n) => {
                const sel = !!foodPred[n];
                return (
                  <button key={n} onClick={() => togglePred(n)}
                    className="px-3 py-2 text-sm text-left transition active:scale-95"
                    style={{
                      backgroundColor: sel ? "#1a1f2e" : "rgba(232,228,216,0.5)",
                      color: sel ? "#e8e4d8" : "#1a1f2e",
                      border: "1px solid rgba(26,31,46,0.25)",
                    }}>
                    {NUTRIENT_LABELS[n]}
                  </button>
                );
              })}
            </div>
          </Card>

          {allDone && (
            <div className="mt-4 p-5" style={{ backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} color="#ec407a" />
                <div className="text-[10px] uppercase" style={{ fontFamily: mono, letterSpacing: "0.22em", color: "#ec407a" }}>
                  Score · {food.name}
                </div>
              </div>
              <div className="text-2xl mb-2" style={{ fontWeight: 500 }}>{predScore} / 4 predictions correct</div>
              <div className="space-y-1.5 mt-3">
                {NUTRIENTS.map((n) => {
                  const predicted = !!foodPred[n];
                  const actual = food.truth[n];
                  const correct = predicted === actual;
                  return (
                    <div key={n} className="flex items-center gap-2 text-xs">
                      {correct ? <CheckCircle2 size={14} color="#7ad59d" /> : <XCircle size={14} color="#ec407a" />}
                      <span style={{ fontFamily: mono }}>{NUTRIENT_LABELS[n].padEnd(15)}</span>
                      <span className="opacity-65" style={{ fontFamily: mono, fontSize: 11 }}>predicted {predicted ? "yes" : "no"} · actual {actual ? "yes" : "no"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4">
            <QuizPanel quiz={QUIZ} answers={answers} setAnswers={setAnswers} submitted={submitted} setSubmitted={setSubmitted} score={score} />
          </div>

          <div className="mt-4 p-4" style={{ backgroundColor: "rgba(232,228,216,0.5)", border: "1px solid rgba(26,31,46,0.15)" }}>
            <div className="text-[10px] uppercase opacity-60 mb-2" style={{ fontFamily: mono, letterSpacing: "0.22em" }}>Progress</div>
            <div className="text-sm"><span style={{ fontWeight: 500 }}>{foodsCompleted} / 6</span> foods completed</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
