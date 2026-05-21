'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play, Timer } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, Beaker, StirringRod, Sound,
  useAnimatedColor,
  StirringRodAnimated, SwirlIndicator,
} from './lab';

// ============================================================================
// IODINE CLOCK — NSSCAS Chemistry
// 5 experiments with different volumes of solution B (iodide). Time the
// reaction to blue-black. Plot rate vs [I⁻] → straight line through origin.
// ============================================================================

const EXPERIMENTS = [
  { id: 1, volB: 25.0, volWater: 0.0 },
  { id: 2, volB: 20.0, volWater: 5.0 },
  { id: 3, volB: 15.0, volWater: 10.0 },
  { id: 4, volB: 10.0, volWater: 15.0 },
  { id: 5, volB:  5.0, volWater: 20.0 },
];
const REFERENCE_TIMES = { 25: 20, 20: 25, 15: 33, 10: 50, 5: 100 };
const TIME_COMP_SEC = 4; // 4 real seconds per experiment

const QUESTIONS = [
  {
    q: 'From the graph (rate vs volume of B), what is the relationship between rate and [I⁻]?',
    options: ['Inversely proportional', 'Directly proportional', 'Independent', 'Proportional to [I⁻]²'],
    correct: 1,
    explain: 'Straight line through origin → rate ∝ [I⁻].',
  },
  {
    q: 'A fresh batch of thiosulfate Na₂S₂O₃·5H₂O made and used immediately gave a much LONGER reaction time. Why?',
    options: [
      'The hydrated salt is impure',
      'Dissolving it is endothermic — the solution was cooler, so the reaction was slower',
      'The water was contaminated',
      'Starch stopped working',
    ],
    correct: 1,
    explain: 'Dissolving Na₂S₂O₃·5H₂O is endothermic — colder solution → slower reaction.',
  },
  {
    q: 'How could you improve the experiment for more accurate rate measurements?',
    options: [
      'Use a measuring cylinder for H₂O₂',
      'Use a pipette or burette for H₂O₂ — more precise than a measuring cylinder',
      'Mix faster',
      'Use less starch',
    ],
    correct: 1,
    explain: 'Pipettes/burettes have better precision than measuring cylinders.',
  },
];

const COLOR_CLEAR = '#eef3f0';
const COLOR_BLUE_BLACK = '#18204a';

function PieceLabel({ position = [0, 0, 0], offset = [0.18, 0, 0], text, show = true, color = 'amber' }) {
  if (!show) return null;
  const colorClass = { amber: 'bg-amber-100 border-amber-400 text-amber-900', blue: 'bg-blue-100 border-blue-400 text-blue-900', green: 'bg-emerald-100 border-emerald-400 text-emerald-900' }[color] || '';
  return (
    <group position={position}>
      <Html position={offset} center distanceFactor={2.5} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        <div className={`${colorClass} text-xs font-semibold px-2 py-1 rounded border shadow-sm`}>{text}</div>
      </Html>
    </group>
  );
}

function PlaceableGroup({ placed, fromOffset = [0, 0.5, 0], children }) {
  const ref = useRef();
  const [progress, setProgress] = useState(placed ? 1 : 0);
  const landed = useRef(false);
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (placed && progress < 1) {
      const next = Math.min(1, progress + delta * 1.4);
      setProgress(next);
      const eased = 1 - Math.pow(1 - next, 3);
      ref.current.position.set(fromOffset[0] * (1 - eased), fromOffset[1] * (1 - eased), fromOffset[2] * (1 - eased));
      if (next >= 1 && !landed.current) { landed.current = true; Sound.click(); }
    } else if (placed) {
      ref.current.position.set(0, 0, 0);
    }
  });
  if (!placed) return null;
  return <group ref={ref} position={fromOffset}>{children}</group>;
}

function IodineClockScene({ assembly, liquidColour, showLabels, stirring }) {
  const animColour = useAnimatedColor(liquidColour, 0.8);
  return (
    <>
      <Bench />
      <PlaceableGroup placed={assembly.beaker} fromOffset={[0, 0.5, 0.3]}>
        <group position={[0, 0.105, 0]}>
          <Beaker height={0.18} radius={0.1} liquidLevel={assembly.solution ? 0.65 : 0} liquidColor={animColour}>
            {assembly.solution && <SwirlIndicator stirring={stirring} color={animColour} />}
          </Beaker>
          {assembly.stirrer && <StirringRodAnimated stirring={stirring} />}
          <PieceLabel position={[0, 0.1, 0]} offset={[-0.22, 0, 0]} text="Beaker (250 cm³)" show={showLabels} />
          {assembly.solution && (
            <PieceLabel position={[0, 0.05, 0]} offset={[0.22, 0, 0]} text="A + B + C + starch" show={showLabels} color="blue" />
          )}
          {assembly.stirrer && (
            <PieceLabel position={[0.06, 0.22, 0]} offset={[0.22, 0, 0]} text="Stirring rod" show={showLabels} color="green" />
          )}
        </group>
      </PlaceableGroup>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function IodineClockLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | ready | running | between | analysis | quiz | result
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({ beaker: false, solution: false, stirrer: false });
  const [assemblyStep, setAssemblyStep] = useState(0);

  const [expIndex, setExpIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [liquidColour, setLiquidColour] = useState(COLOR_CLEAR);
  const [results, setResults] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const runTimer = useRef(null);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'beaker',   label: 'Place the beaker',            hint: 'A 250 cm³ beaker holds the reagents.', set: { beaker: true } },
    { id: 'solution', label: 'Add A + B + C + starch',      hint: 'A = H₂O₂, B = iodide (varies per exp), C = thiosulfate, plus starch indicator.', set: { solution: true }, sound: 'pour' },
    { id: 'stirrer',  label: 'Place the stirring rod',      hint: 'Used to mix the reagents quickly and uniformly.', set: { stirrer: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); setAssemblyStep(0); };

  const doAssemblyStep = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (s.sound === 'pour') Sound.pour();
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const startExperiment = () => {
    setElapsed(0);
    setLiquidColour(COLOR_CLEAR);
    setPhase('running');
    Sound.click();

    const exp = EXPERIMENTS[expIndex];
    const realTime = TIME_COMP_SEC;
    const fakeTime = REFERENCE_TIMES[exp.volB] + (Math.random() - 0.5) * 2; // add some noise
    const start = Date.now();
    runTimer.current = setInterval(() => {
      const realElapsed = (Date.now() - start) / 1000;
      const ratio = Math.min(1, realElapsed / realTime);
      const simulated = fakeTime * ratio;
      setElapsed(simulated);
      // Two-stage colour cascade so the student can SEE the change happening:
      //   Stage 1 (0..70%): gradually darken from clear → faint grey-blue
      //   Stage 2 (70..100%): rapid jump to full blue-black (the "clock" character)
      // This keeps the iconic sudden-change feel of an iodine clock while still
      // making it visible that the reaction is progressing the whole time.
      let blend;
      if (ratio < 0.7) {
        blend = (ratio / 0.7) * 0.18; // gentle ramp to ~18% darkness
      } else {
        const late = (ratio - 0.7) / 0.3;
        blend = 0.18 + (1 - 0.18) * (1 / (1 + Math.exp(-(late - 0.5) * 10)));
      }
      setLiquidColour(mix(COLOR_CLEAR, COLOR_BLUE_BLACK, blend));
      if (ratio >= 1) {
        clearInterval(runTimer.current);
        runTimer.current = null;
        const time = fakeTime;
        const rate = 1 / time;
        setResults((r) => [...r, { exp: exp.id, volB: exp.volB, volWater: exp.volWater, time, rate }]);
        Sound.chime();
        setPhase('between');
      }
    }, 50);
  };

  const nextExperiment = () => {
    if (expIndex + 1 >= EXPERIMENTS.length) {
      setPhase('analysis');
    } else {
      setExpIndex(expIndex + 1);
      setLiquidColour(COLOR_CLEAR);
      setPhase('ready');
    }
  };

  const answerQuiz = (i) => {
    const q = QUESTIONS[quizIndex];
    const correct = i === q.correct;
    setAnswers((a) => [...a, { index: i, correct }]);
    if (correct) Sound.chime(); else Sound.buzz();
    setTimeout(() => {
      if (quizIndex + 1 >= QUESTIONS.length) setPhase('result');
      else setQuizIndex(quizIndex + 1);
    }, 800);
  };

  const reset = () => window.location.reload();

  const score = answers.filter((a) => a.correct).length;
  const currentExp = EXPERIMENTS[expIndex];

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Iodine Clock · NSSCAS Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.7, 1.4]} orbitTarget={[0, 0.3, 0]}>
        <IodineClockScene
          assembly={assembly}
          liquidColour={liquidColour}
          showLabels={showLabels}
          stirring={phase === 'running'}
        />
      </LabScene>

      {/* Stopwatch HUD */}
      {(phase === 'running' || phase === 'between') && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-56 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Experiment {currentExp.id}/5</div>
          <div className="text-xs text-stone-500 mt-1">Vol B = <strong>{currentExp.volB} cm³</strong> · H₂O = {currentExp.volWater}</div>
          <div className="mt-2 text-xs text-stone-500 uppercase tracking-wide">Time</div>
          <div className="text-2xl font-mono font-bold text-stone-800 flex items-center gap-1">
            <Timer size={18} /> {elapsed.toFixed(1)} s
          </div>
        </div>
      )}

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCAS Chemistry</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">The Iodine Clock</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Run 5 experiments with different iodide concentrations. Time how long each takes to turn blue-black. Then plot rate vs [I⁻] to see the rate law and answer 3 short questions.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start building the apparatus
            </button>
          </div>
        </div>
      )}

      {phase === 'assemble' && (() => {
        const s = ASSEMBLY_STEPS[assemblyStep];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">Build · step {assemblyStep + 1}/{ASSEMBLY_STEPS.length}</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{s.label}</div>
            <div className="text-sm text-stone-600 mt-1">{s.hint}</div>
            <button onClick={doAssemblyStep} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              {s.label}
            </button>
          </div>
        );
      })()}

      {phase === 'ready' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Experiment {currentExp.id} of {EXPERIMENTS.length}</div>
          <div className="text-base font-semibold text-stone-800 mt-1">
            {currentExp.volB} cm³ of B (iodide) + {currentExp.volWater} cm³ water
          </div>
          <div className="text-sm text-stone-600 mt-1">Mix all reagents, then start the stopwatch. Watch for the sudden blue-black colour.</div>
          <button onClick={startExperiment} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Mix & start
          </button>
        </div>
      )}

      {phase === 'between' && (() => {
        const r = results[results.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Experiment {r.exp} recorded</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-stone-500">Vol B</div><div className="font-mono font-bold">{r.volB} cm³</div></div>
              <div><div className="text-xs text-stone-500">Time</div><div className="font-mono font-bold">{r.time.toFixed(1)} s</div></div>
              <div><div className="text-xs text-stone-500">Rate (1/t)</div><div className="font-mono font-bold">{r.rate.toFixed(4)} s⁻¹</div></div>
            </div>
            <button onClick={nextExperiment} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1">
              {expIndex + 1 >= EXPERIMENTS.length ? 'See the graph' : 'Next experiment'} <ChevronRight size={16} />
            </button>
          </div>
        );
      })()}

      {phase === 'analysis' && (
        <AnalysisPanel results={results} onContinue={() => setPhase('quiz')} />
      )}

      {phase === 'quiz' && (() => {
        const q = QUESTIONS[quizIndex];
        const lastAnswer = answers[quizIndex];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-2xl max-w-lg w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Question {quizIndex + 1} of {QUESTIONS.length}</div>
            <div className="text-base font-semibold text-stone-800 mt-1 mb-3">{q.q}</div>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !lastAnswer && answerQuiz(i)}
                  disabled={!!lastAnswer}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                    lastAnswer
                      ? i === q.correct ? 'bg-emerald-100 text-emerald-900'
                        : lastAnswer.index === i ? 'bg-red-100 text-red-900'
                        : 'bg-stone-100 text-stone-500'
                      : 'bg-stone-100 hover:bg-blue-100 text-stone-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {lastAnswer && (
              <div className="mt-3 text-xs text-stone-600 italic">{q.explain}</div>
            )}
          </div>
        );
      })()}

      {phase === 'result' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-emerald-600">
              <Trophy size={22} />
              <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mt-1">Quiz: {score}/{QUESTIONS.length} · Data: {results.length}/{EXPERIMENTS.length} experiments</h2>
            <table className="w-full mt-4 text-sm">
              <thead className="text-stone-500 text-xs uppercase border-b">
                <tr><th className="text-left py-1">#</th><th className="text-right py-1">Vol B</th><th className="text-right py-1">Time (s)</th><th className="text-right py-1">Rate</th></tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.exp} className="border-b border-stone-100">
                    <td className="py-2">{r.exp}</td>
                    <td className="py-2 text-right font-mono">{r.volB}</td>
                    <td className="py-2 text-right font-mono">{r.time.toFixed(1)}</td>
                    <td className="py-2 text-right font-mono">{r.rate.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={reset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
              <RotateCcw size={16} /> New session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalysisPanel({ results, onContinue }) {
  // Simple rate-vs-volB graph as SVG
  const maxRate = Math.max(...results.map((r) => r.rate));
  const maxVolB = 25;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="text-xs text-stone-500 uppercase tracking-wide">Analysis</div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Rate vs Volume of B (∝ [I⁻])</h2>
        <svg viewBox="0 0 300 200" className="w-full">
          <line x1="40" y1="180" x2="290" y2="180" stroke="#888" strokeWidth="1" />
          <line x1="40" y1="180" x2="40" y2="20" stroke="#888" strokeWidth="1" />
          <text x="160" y="195" textAnchor="middle" fontSize="9" fill="#666">Volume of B (cm³)</text>
          <text x="10" y="100" textAnchor="middle" fontSize="9" fill="#666" transform="rotate(-90 10 100)">Rate (s⁻¹)</text>
          {results.map((r) => {
            const x = 40 + (r.volB / maxVolB) * 250;
            const y = 180 - (r.rate / maxRate) * 150;
            return <circle key={r.exp} cx={x} cy={y} r="4" fill="#10b981" />;
          })}
          {/* Best-fit line through origin */}
          {(() => {
            const slope = results.reduce((s, r) => s + r.rate * r.volB, 0) / results.reduce((s, r) => s + r.volB * r.volB, 0);
            const x1 = 40, y1 = 180;
            const x2 = 290, y2 = 180 - (slope * maxVolB / maxRate) * 150;
            return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />;
          })()}
        </svg>
        <div className="text-sm text-stone-600 mt-2 leading-relaxed">
          The graph is a straight line through the origin — rate is <strong>directly proportional</strong> to [I⁻].
        </div>
        <button onClick={onContinue} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          Continue to questions
        </button>
      </div>
    </div>
  );
}

function mix(a, b, t) {
  const p = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });
  const A = p(a), B = p(b);
  const ch = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${ch(A.r, B.r)}${ch(A.g, B.g)}${ch(A.b, B.b)}`;
}
