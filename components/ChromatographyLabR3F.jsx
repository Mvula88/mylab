'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, Beaker, Sound, useAnimatedValue,
} from './lab';

// ============================================================================
// CHROMATOGRAPHY — NSSCO Chemistry, Paper 3 Q1
// Spot 7 different inks on a paper baseline, dip in solvent, watch dyes
// separate as the solvent rises. Then identify dyes and answer questions.
// ============================================================================

const INKS = [
  { id: 'red',    name: 'Red',    dyes: [{ colour: '#d23a3a', rf: 0.20 }] },
  { id: 'orange', name: 'Orange', dyes: [{ colour: '#e76a2a', rf: 0.20 }, { colour: '#f2c046', rf: 0.50 }, { colour: '#ec8a35', rf: 0.70 }] },
  { id: 'yellow', name: 'Yellow', dyes: [{ colour: '#f2c046', rf: 0.50 }, { colour: '#d6b04e', rf: 0.70 }] },
  { id: 'green',  name: 'Green',  dyes: [{ colour: '#3a8a5c', rf: 0.20 }, { colour: '#2a6f96', rf: 0.50 }, { colour: '#5fa84a', rf: 0.70 }] },
  { id: 'blue',   name: 'Blue',   dyes: [{ colour: '#2a4ea6', rf: 0.60 }] },
  { id: 'purple', name: 'Purple', dyes: [{ colour: '#7a3aa6', rf: 0.50 }, { colour: '#a23a8f', rf: 0.70 }] },
  { id: 'black',  name: 'Black',  dyes: [{ colour: '#1a1a1a', rf: 0.20 }, { colour: '#3a4a6e', rf: 0.70 }] },
];

const QUESTIONS = [
  { q: 'Name line A — the upper line the solvent has reached.', options: ['Baseline', 'Solvent front', 'Rf line', 'Origin'], correct: 1 },
  { q: 'Why is the baseline drawn in pencil, not pen?', options: ['Pencil is darker', 'Pen ink dissolves in the solvent and interferes', 'Pencil dries faster', 'Pen damages the paper'], correct: 1 },
  { q: 'Which ink contains the greatest number of dyes (after the run)?', options: ['Red', 'Blue', 'Orange', 'Yellow'], correct: 2 },
  { q: 'Which TWO inks are made of a single dye?', options: ['Red and orange', 'Red and blue', 'Yellow and green', 'Black and purple'], correct: 1 },
  { q: 'How would you check if the blue ink really contains a single dye?', options: ['Use a longer piece of paper', 'Wait longer for the experiment', 'Repeat with a different solvent', 'Use a bigger spot'], correct: 2 },
];

const ERROR_OPTIONS = [
  'The pencil baseline is below the solvent level',
  'There are too many ink spots on the paper',
  'The paper is too wide for the beaker',
  'There is not enough solvent in the beaker',
];

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

// ─── Chromatography paper ─────────────────────────────────────────────────
// A vertical strip standing in the beaker. Renders 7 ink spots at the
// baseline; each spot's dyes "streak" upward as `progress` (0..1) increases.
// Also renders a darker "wet front" rectangle showing how far the solvent
// has wicked up.
function ChromPaper({ progress = 0, height = 0.35, width = 0.22 }) {
  // Geometry: paper is at z=0, ink spots are slightly forward at z=0.001
  const baselineY = -height / 2 + 0.04; // a bit above the bottom
  const topY = height / 2;
  const runHeight = topY - baselineY;
  const solventY = baselineY + runHeight * progress;
  const spotX = (i) => -width / 2 + (i + 0.5) * (width / INKS.length);

  return (
    <group>
      {/* Paper backing */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f9f6ec" roughness={0.95} side={2} />
      </mesh>
      {/* Wet front — slightly darker, semi-transparent */}
      {progress > 0 && (
        <mesh position={[0, (baselineY + solventY) / 2, 0.0005]}>
          <planeGeometry args={[width, solventY - baselineY]} />
          <meshStandardMaterial color="#b8d4ea" transparent opacity={0.28} side={2} />
        </mesh>
      )}
      {/* Pencil baseline */}
      <mesh position={[0, baselineY, 0.001]}>
        <planeGeometry args={[width, 0.0015]} />
        <meshStandardMaterial color="#888" side={2} />
      </mesh>
      {/* Ink spots — each dye renders as a streak from baseline up to its current band */}
      {INKS.map((ink, i) =>
        ink.dyes.map((dye, j) => {
          const dyeProgress = Math.min(progress * 1.0, dye.rf);
          const dyeBandY = baselineY + runHeight * dyeProgress;
          const dyeBandHeight = Math.max(0.005, runHeight * dyeProgress * 0.6);
          const dyeOpacity = progress < 0.1 ? 1 : 0.85; // initial spot then streak
          return (
            <group key={`${i}-${j}`}>
              {/* Original spot at baseline */}
              {progress < 0.05 && (
                <mesh position={[spotX(i), baselineY + 0.002, 0.002]}>
                  <circleGeometry args={[0.012, 16]} />
                  <meshStandardMaterial color={dye.colour} side={2} />
                </mesh>
              )}
              {/* The migrated band — only show if progress has moved this dye */}
              {dyeProgress > 0.02 && (
                <mesh position={[spotX(i), dyeBandY - dyeBandHeight / 2, 0.002]}>
                  <planeGeometry args={[0.022, dyeBandHeight]} />
                  <meshStandardMaterial color={dye.colour} transparent opacity={dyeOpacity} side={2} />
                </mesh>
              )}
            </group>
          );
        }),
      )}
      {/* Tiny labels under each spot */}
      {INKS.map((ink, i) => (
        <Html
          key={`label-${i}`}
          position={[spotX(i), -height / 2 - 0.01, 0]}
          center
          distanceFactor={2.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-[8px] font-mono text-stone-700 select-none">{ink.name[0]}</div>
        </Html>
      ))}
    </group>
  );
}

function Scene({ assembly, progress, showLabels }) {
  const animProgress = useAnimatedValue(progress, 0.5);
  return (
    <>
      <Bench />
      {/* Tall beaker */}
      <PlaceableGroup placed={assembly.beaker} fromOffset={[0, 0.5, 0.3]}>
        <group position={[0, 0.105, 0]}>
          <Beaker height={0.5} radius={0.14} liquidLevel={assembly.solvent ? 0.07 : 0} liquidColor="#cfe9ff" />
          <PieceLabel position={[0, 0.18, 0]} offset={[-0.22, 0, 0]} text="Beaker (tall)" show={showLabels} />
          {assembly.solvent && (
            <PieceLabel position={[0, 0.03, 0]} offset={[-0.22, 0, 0]} text="Solvent" show={showLabels} color="blue" />
          )}
        </group>
      </PlaceableGroup>

      {/* Filter paper inside the beaker */}
      {assembly.paper && (
        <PlaceableGroup placed fromOffset={[0, 0.4, 0]}>
          <group position={[0, 0.32, 0]}>
            <ChromPaper progress={animProgress} />
            <PieceLabel position={[0.14, 0.05, 0]} offset={[0.22, 0, 0]} text="Chromatography paper" show={showLabels} color="green" />
            {animProgress > 0.05 && (
              <PieceLabel position={[0.14, -0.17 + 0.41 * animProgress, 0]} offset={[0.22, 0, 0]} text="Solvent front" show={showLabels} />
            )}
            {animProgress > 0.05 && (
              <PieceLabel position={[0.14, -0.17 + 0.04, 0]} offset={[0.22, 0, 0]} text="Baseline (pencil)" show={showLabels} color="green" />
            )}
          </group>
        </PlaceableGroup>
      )}
    </>
  );
}

export default function ChromatographyLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | ready | running | error | quiz | result
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({ beaker: false, solvent: false, paper: false });
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorGuess, setErrorGuess] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const intervalRef = useRef(null);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'beaker',  label: 'Place the tall beaker',          hint: 'A tall 250 cm³ beaker holds the solvent and supports the paper.', set: { beaker: true } },
    { id: 'solvent', label: 'Pour the solvent (~ 1 cm deep)', hint: 'Must be BELOW the pencil baseline — otherwise the ink dissolves into the solvent.', set: { solvent: true }, sound: 'pour' },
    { id: 'paper',   label: 'Spot the inks + lower the paper', hint: '7 ink spots on a pencil baseline. Hang the paper so just the bottom edge dips into the solvent.', set: { paper: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); setAssemblyStep(0); };

  const doAssemblyStep = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (s.sound === 'pour') Sound.pour();
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const startRun = () => {
    setPhase('running');
    setProgress(0);
    Sound.streamOn();
    const start = Date.now();
    const total = 12; // 12 s for solvent to rise to the top
    intervalRef.current = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      const p = Math.min(1, t / total);
      setProgress(p);
      if (p >= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        Sound.streamOff();
        Sound.chime();
        setPhase('error');
      }
    }, 80);
  };

  const submitError = (i) => {
    setErrorGuess(i);
    setTimeout(() => setPhase('quiz'), 800);
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

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Chromatography · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.85, 1.7]} orbitTarget={[0, 0.35, 0]}>
        <Scene assembly={assembly} progress={progress} showLabels={showLabels} />
      </LabScene>

      {phase === 'running' && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-56 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Solvent front</div>
          <div className="text-2xl font-mono font-bold">{Math.round(progress * 100)}%</div>
          <div className="text-xs text-stone-500 mt-1">Watch the dyes separate</div>
        </div>
      )}

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry · Paper 3</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Paper Chromatography</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Separate the dyes in 7 different inks. Set up the beaker + solvent + filter paper, then watch the solvent rise and pull each dye to a different height. The end-of-lab questions match NSSCO 2024 Paper 3 Q1.
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
          <div className="text-xs text-stone-500 uppercase tracking-wide">Apparatus ready</div>
          <div className="text-base font-semibold text-stone-800 mt-1">Cover the beaker and let the solvent rise.</div>
          <button onClick={startRun} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Start the chromatogram
          </button>
        </div>
      )}

      {phase === 'error' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-lg w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">First — a common mistake</div>
          <div className="text-base font-semibold text-stone-800 mt-1 mb-3">If the spots disappear immediately when the paper is dipped, what is the most likely cause?</div>
          <div className="grid grid-cols-1 gap-2">
            {ERROR_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => !errorGuess && submitError(i)}
                disabled={errorGuess !== null}
                className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                  errorGuess !== null
                    ? i === 0 ? 'bg-emerald-100 text-emerald-900'
                      : errorGuess === i ? 'bg-red-100 text-red-900'
                      : 'bg-stone-100 text-stone-500'
                    : 'bg-stone-100 hover:bg-blue-100 text-stone-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
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
          </div>
        );
      })()}

      {phase === 'result' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-2 text-emerald-600">
              <Trophy size={22} />
              <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mt-1">Quiz: {score} / {QUESTIONS.length}</h2>
            <div className="mt-4 space-y-1">
              {QUESTIONS.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-sm border-b py-1.5">
                  {answers[i]?.correct ? <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" /> : <X size={16} className="text-red-500 mt-0.5 shrink-0" />}
                  <span className="text-stone-700">{q.q}</span>
                </div>
              ))}
            </div>
            <button onClick={reset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
