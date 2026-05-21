'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play, Timer } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, Bunsen, RetortStand, BossClamp, TestTube,
  DeliveryTube, Bubbles, Sound, useAnimatedValue,
} from './lab';

// ============================================================================
// GAS COLLECTION RATE — NSSCO Chemistry, Paper 3 Q3
// Heat KClO₃ + MnO₂ catalyst in a test tube; collect O₂ in a gas syringe.
// Record V(t), plot V vs t, answer 4 questions.
//   2 KClO₃ → 2 KCl + 3 O₂
// ============================================================================

const CRYSTAL_SERIES = [[0, 0], [20, 30], [40, 50], [60, 66], [80, 78], [100, 86], [120, 86]];
const POWDER_SERIES  = [[0, 0], [20, 50], [40, 72], [60, 84], [80, 86], [100, 86], [120, 86]];
const TIME_COMPRESSION = 8;
const MAX_TIME = 120;
const MAX_VOLUME = 100;

function interpVolume(series, t) {
  if (t <= series[0][0]) return series[0][1];
  if (t >= series[series.length - 1][0]) return series[series.length - 1][1];
  for (let i = 0; i < series.length - 1; i++) {
    const [t1, v1] = series[i];
    const [t2, v2] = series[i + 1];
    if (t >= t1 && t <= t2) return v1 + (v2 - v1) * ((t - t1) / (t2 - t1));
  }
  return series[series.length - 1][1];
}

const QUESTIONS = [
  { q: 'From the graph, predict the volume of O₂ at 45 seconds.', options: ['~30 cm³', '~45 cm³', '~55 cm³', '~70 cm³'], correct: 2 },
  { q: 'Why are the readings at 100 s and 120 s the same?', options: ['Thermometer broke', 'Reaction is complete — all KClO₃ decomposed', 'Syringe is full', 'Bunsen went out'], correct: 1 },
  { q: 'If you repeated with POWDER instead of crystals:', options: ['Higher final volume', 'Lower final volume', 'Steeper initial rise, same final volume', 'Shallower rise, lower final volume'], correct: 2 },
  { q: 'Which test confirms the gas is oxygen?', options: ['Pops with lighted splint', 'Relights a glowing splint', 'Turns limewater milky', 'Bleaches blue litmus'], correct: 1 },
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

// Gas syringe — horizontal glass cylinder with a sliding plunger.
// Volume in cm³, max 100. Plunger position lerps from 0 (empty) to capacity.
function GasSyringe({ position = [0, 0, 0], volumeCm3 = 0 }) {
  const length = 0.32;
  const radius = 0.025;
  const plungerOffset = -length / 2 + (volumeCm3 / 100) * length;
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Glass barrel */}
      <mesh>
        <cylinderGeometry args={[radius, radius, length, 24, 1, true]} />
        <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.2} transmission={0.85} thickness={0.05} roughness={0.12} ior={1.45} clearcoat={0.4} side={2} />
      </mesh>
      {/* Sealed end (gas inlet) at +y */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, 0.005, 24]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.4} />
      </mesh>
      {/* Plunger — slides from -y toward +y as gas fills */}
      <mesh position={[0, plungerOffset, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.012, 24]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Plunger pull handle */}
      <mesh position={[0, plungerOffset - 0.04, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.012]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* Volume graduations every 10 cm³ (5 major marks) */}
      {[10, 25, 50, 75, 100].map((mark, i) => {
        const x = -length / 2 + (mark / 100) * length;
        return (
          <Html
            key={mark}
            position={[radius + 0.005, x, 0]}
            center
            distanceFactor={3.5}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-[7px] font-mono text-stone-700 select-none">{mark}</div>
          </Html>
        );
      })}
    </group>
  );
}

function Scene({ assembly, heating, volume, showLabels }) {
  const animVolume = useAnimatedValue(volume, 0.5);
  return (
    <>
      <Bench />
      {/* Retort stand holding the test tube above the Bunsen */}
      <PlaceableGroup placed={assembly.stand} fromOffset={[-0.5, 0.5, 0.3]}>
        <group position={[-0.35, 0.105, 0]}>
          <RetortStand rodHeight={0.7}>
            {assembly.clamp && <BossClamp position={[0, 0.55, 0]} ringRadius={0.025} />}
          </RetortStand>
          <PieceLabel position={[0, 0.4, 0]} offset={[-0.18, 0, 0]} text="Retort stand" show={showLabels} />
        </group>
      </PlaceableGroup>

      {/* Test tube tilted slightly, contents: KClO₃ + MnO₂ */}
      {assembly.tube && (
        <PlaceableGroup placed fromOffset={[0.2, 0.5, 0]}>
          <group position={[-0.25, 0.45, 0]} rotation={[0, 0, -0.35]}>
            <TestTube height={0.3} radius={0.045}>
              {/* Solid reagent at the bottom */}
              {assembly.reagent && (
                <mesh position={[0, 0.07, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
                  <meshStandardMaterial color="#e8e2c0" roughness={0.85} />
                </mesh>
              )}
            </TestTube>
            <PieceLabel position={[0, 0.18, 0]} offset={[-0.18, 0, 0]} text="Test tube + KClO₃ + MnO₂" show={showLabels} color="blue" />
          </group>
        </PlaceableGroup>
      )}

      {/* Bunsen below the test tube */}
      {assembly.bunsen && (
        <PlaceableGroup placed fromOffset={[-0.3, 0.5, -0.3]}>
          <group position={[-0.3, 0.105, 0]}>
            <Bunsen flameOn={heating} />
            <PieceLabel position={[0, 0.1, 0]} offset={[-0.18, 0, 0]} text="Bunsen burner" show={showLabels} />
          </group>
        </PlaceableGroup>
      )}

      {/* Delivery tube from test tube to gas syringe */}
      {assembly.delivery && (
        <PlaceableGroup placed fromOffset={[0.3, 0.5, 0]}>
          <group position={[-0.18, 0.5, 0]}>
            <DeliveryTube vertical={0.05} horizontal={0.4} />
            <PieceLabel position={[0.2, 0.05, 0]} offset={[0, 0.06, 0]} text="Delivery tube" show={showLabels} color="green" />
          </group>
        </PlaceableGroup>
      )}

      {/* Gas syringe at the right end of the delivery tube */}
      {assembly.syringe && (
        <PlaceableGroup placed fromOffset={[0.5, 0.4, 0]}>
          <group position={[0.4, 0.55, 0]}>
            <GasSyringe position={[0, 0, 0]} volumeCm3={animVolume} />
            <PieceLabel position={[0, 0.07, 0]} offset={[0, 0.06, 0]} text="Gas syringe (100 cm³)" show={showLabels} color="blue" />
          </group>
        </PlaceableGroup>
      )}
    </>
  );
}

export default function GasCollectionRateLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | ready | running | between | analysis | quiz | result
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({});
  const [assemblyStep, setAssemblyStep] = useState(0);

  const [useCrystals, setUseCrystals] = useState(true);
  const [simTime, setSimTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [trials, setTrials] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'stand',    label: 'Place the retort stand',           hint: 'Holds the test tube at the right angle above the flame.', set: { stand: true } },
    { id: 'clamp',    label: 'Attach the boss clamp',            hint: 'Clamp grips the test tube horizontally.', set: { clamp: true } },
    { id: 'tube',     label: 'Place the test tube',              hint: 'Slightly tilted, so any liquid runs back into the tube.', set: { tube: true } },
    { id: 'reagent',  label: 'Add KClO₃ + MnO₂ catalyst',       hint: 'The MnO₂ doesn\'t take part in the reaction — it just speeds it up.', set: { reagent: true } },
    { id: 'bunsen',   label: 'Place the Bunsen burner below',    hint: 'Heat will decompose the chlorate to release oxygen.', set: { bunsen: true } },
    { id: 'delivery', label: 'Connect the delivery tube',        hint: 'Carries the O₂ from the test tube to the gas syringe.', set: { delivery: true } },
    { id: 'syringe',  label: 'Attach the gas syringe',           hint: 'Gas pushes the plunger out; you read volume directly from the scale.', set: { syringe: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); setAssemblyStep(0); };
  const doAssemblyStep = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const startHeating = () => {
    setSimTime(0);
    setVolume(0);
    setRecordings([]);
    setPhase('running');
    Sound.bunsenOn();

    const series = useCrystals ? CRYSTAL_SERIES : POWDER_SERIES;
    const start = Date.now();
    const realTotal = MAX_TIME / TIME_COMPRESSION;
    timerRef.current = setInterval(() => {
      const realE = (Date.now() - start) / 1000;
      const t = Math.min(MAX_TIME, realE * TIME_COMPRESSION);
      const v = interpVolume(series, t);
      setSimTime(t);
      setVolume(v);
      // Auto-record every 20 simulated seconds
      const newReadings = [];
      for (let mark = 0; mark <= 120; mark += 20) {
        if (t >= mark) newReadings.push({ t: mark, v: interpVolume(series, mark) });
      }
      setRecordings(newReadings);
      if (realE >= realTotal) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        Sound.bunsenOff();
        Sound.chime();
        setTrials((tr) => [...tr, { useCrystals, recordings: newReadings, finalV: v }]);
        setPhase('between');
      }
    }, 80);
  };

  const nextTrial = () => {
    setUseCrystals(!useCrystals);
    setAssembly((p) => ({ ...p, syringe: true })); // keep syringe; just reset volume
    setVolume(0);
    setPhase('ready');
  };
  const finishLab = () => setPhase('analysis');

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
        <div className="text-sm font-semibold text-stone-800">Gas Collection Rate · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0.2, 0.95, 1.8]} orbitTarget={[0, 0.45, 0]}>
        <Scene assembly={assembly} heating={phase === 'running'} volume={volume} showLabels={showLabels} />
      </LabScene>

      {(phase === 'running' || phase === 'between') && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-56 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Trial: {useCrystals ? 'crystals' : 'powder'}</div>
          <div className="mt-1 text-xs text-stone-500 uppercase tracking-wide">Time</div>
          <div className="text-xl font-mono font-bold flex items-center gap-1"><Timer size={16} /> {simTime.toFixed(0)} s</div>
          <div className="mt-1 text-xs text-stone-500 uppercase tracking-wide">Volume O₂</div>
          <div className="text-2xl font-mono font-bold text-stone-800">{volume.toFixed(0)} cm³</div>
        </div>
      )}

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry · Paper 3</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Rate of Oxygen Production</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Heat potassium chlorate(V) with a manganese(IV) oxide catalyst. Oxygen gas pushes a syringe plunger out — measure V vs t. Repeat with powder to see how surface area changes the rate.
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
          <div className="text-xs text-stone-500 uppercase tracking-wide">Form of KClO₃: {useCrystals ? 'crystals' : 'powder'}</div>
          <div className="text-sm text-stone-700 mt-1">Light the Bunsen and start the stopwatch. The syringe will fill over ~120 simulated seconds.</div>
          <button onClick={startHeating} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Heat & start collecting
          </button>
        </div>
      )}

      {phase === 'between' && (() => {
        const r = trials[trials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Trial recorded — {r.useCrystals ? 'crystals' : 'powder'}</div>
            <div className="mt-2 text-sm text-stone-700">Final volume: <strong>{r.finalV.toFixed(0)} cm³</strong></div>
            <table className="w-full mt-2 text-xs">
              <thead className="text-stone-500 text-[10px] uppercase border-b">
                <tr><th className="text-left py-1">t (s)</th>{r.recordings.map((rec, i) => <th key={i} className="text-right">{rec.t}</th>)}</tr>
              </thead>
              <tbody>
                <tr><td className="py-1 font-mono">V (cm³)</td>{r.recordings.map((rec, i) => <td key={i} className="text-right font-mono">{rec.v.toFixed(0)}</td>)}</tr>
              </tbody>
            </table>
            <div className="mt-3 flex gap-2">
              {trials.length < 2 && (
                <button onClick={nextTrial} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                  Try {useCrystals ? 'powder' : 'crystals'} <ChevronRight size={14} className="inline" />
                </button>
              )}
              <button onClick={finishLab} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">
                <Trophy size={14} className="inline mr-1" /> See graph
              </button>
            </div>
          </div>
        );
      })()}

      {phase === 'analysis' && <Analysis trials={trials} onContinue={() => setPhase('quiz')} />}

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
                    lastAnswer ? i === q.correct ? 'bg-emerald-100 text-emerald-900'
                      : lastAnswer.index === i ? 'bg-red-100 text-red-900' : 'bg-stone-100 text-stone-500'
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
            <button onClick={reset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Analysis({ trials, onContinue }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Volume vs Time</h2>
        <svg viewBox="0 0 300 200" className="w-full">
          <line x1="40" y1="180" x2="290" y2="180" stroke="#888" strokeWidth="1" />
          <line x1="40" y1="180" x2="40" y2="20" stroke="#888" strokeWidth="1" />
          <text x="160" y="195" textAnchor="middle" fontSize="9" fill="#666">Time (s)</text>
          <text x="10" y="100" textAnchor="middle" fontSize="9" fill="#666" transform="rotate(-90 10 100)">V (cm³)</text>
          {trials.map((tr, ti) => {
            const colour = tr.useCrystals ? '#10b981' : '#3b82f6';
            const path = tr.recordings.map((r, i) => `${i === 0 ? 'M' : 'L'} ${40 + (r.t / 120) * 250} ${180 - (r.v / 100) * 150}`).join(' ');
            return (
              <g key={ti}>
                <path d={path} stroke={colour} strokeWidth="2" fill="none" />
                {tr.recordings.map((r, i) => (
                  <circle key={i} cx={40 + (r.t / 120) * 250} cy={180 - (r.v / 100) * 150} r="3" fill={colour} />
                ))}
              </g>
            );
          })}
        </svg>
        <div className="text-xs text-stone-600 flex gap-3 mt-1">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Crystals</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Powder</span>
        </div>
        <p className="text-sm text-stone-700 mt-3">Both curves level off at the same plateau (~86 cm³) — same mass of KClO₃ produces the same total O₂. Powder reacts faster because of larger surface area.</p>
        <button onClick={onContinue} className="mt-4 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          Continue to questions
        </button>
      </div>
    </div>
  );
}
