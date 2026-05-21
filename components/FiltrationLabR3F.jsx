'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, Beaker, Bunsen, Tripod, Sound,
  Funnel, FilterPaper, Mortar, Pestle, StirringRod, EvaporatingBasin,
  useAnimatedColor, useAnimatedValue,
  StirringRodAnimated, SwirlIndicator, Bubbles, FallingDrop,
} from './lab';

// ============================================================================
// FILTRATION / CRYSTALLISATION — NSSCO Chemistry, Paper 3 Q2
// Obtain a sample of dry sodium chloride from rock salt (NaCl + sand).
// Steps: grind → dissolve → filter → evaporate → crystals.
// ============================================================================

const QUIZ = [
  { q: 'What apparatus grinds the rock salt?', options: ['Mortar and pestle', 'Crucible and tongs', 'Test tube and stopper', 'Beaker and stirring rod'], correct: 0 },
  { q: 'What is the sand left in the filter paper called?', options: ['Filtrate', 'Solvent', 'Residue', 'Solution'], correct: 2 },
  { q: 'What is the salt solution that passes through the paper called?', options: ['Residue', 'Filtrate', 'Precipitate', 'Decant'], correct: 1 },
  { q: 'Why is the water heated when dissolving?', options: ['To kill bacteria', 'To make the sand dissolve', 'To increase solubility of NaCl', 'To sterilise apparatus'], correct: 2 },
  { q: 'How do you get dry salt crystals from the filtrate?', options: ['Filter again', 'Cool it', 'Evaporate the water', 'Add more rock salt'], correct: 2 },
];

function PieceLabel({ position = [0, 0, 0], offset = [0.18, 0, 0], text, show = true, color = 'amber' }) {
  if (!show) return null;
  const colorClass = {
    amber: 'bg-amber-100 border-amber-400 text-amber-900',
    blue: 'bg-blue-100 border-blue-400 text-blue-900',
    green: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  }[color] || '';
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
      if (next >= 1 && !landed.current) {
        landed.current = true;
        Sound.click();
      }
    } else if (placed) {
      ref.current.position.set(0, 0, 0);
    }
  });
  if (!placed) return null;
  return <group ref={ref} position={fromOffset}>{children}</group>;
}

// Pestle that wiggles during grinding
function GrindingPestle({ grinding }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current || !grinding) {
      if (ref.current) {
        ref.current.position.x = 0;
        ref.current.rotation.z = 0;
      }
      return;
    }
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 14) * 0.015;
    ref.current.position.z = Math.cos(t * 14) * 0.01;
    ref.current.rotation.z = Math.sin(t * 14) * 0.15;
  });
  return (
    <group ref={ref} position={[0, 0.1, 0]}>
      <Pestle length={0.14} />
    </group>
  );
}

// Filter scene: continuous stream from upper beaker into the funnel,
// PLUS drips coming out of the funnel stem into the receiver beaker.
function PouringMixture({ pouring, filtrateLevel }) {
  const [drips, setDrips] = useState([]);
  const counter = useRef(0);
  // Spawn drips while pouring
  useFrame((state) => {
    if (!pouring) return;
    if (Math.random() < 0.18) {
      counter.current += 1;
      const id = counter.current;
      setDrips((d) => [...d.slice(-6), { id, born: state.clock.elapsedTime }]);
    }
    setDrips((d) => d.filter((dr) => state.clock.elapsedTime - dr.born < 0.8));
  });
  if (!pouring) return null;
  // Visible pouring stream from upper beaker into the funnel mouth
  return (
    <>
      {/* Stream entering funnel from above */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.003, 0.006, 0.16, 8]} />
        <meshPhysicalMaterial color="#a89070" transparent opacity={0.75} transmission={0.3} roughness={0.1} ior={1.33} />
      </mesh>
      {/* Drips falling from funnel stem into receiver beaker */}
      {drips.map((d) => (
        <FallingDrop
          key={d.id}
          from={[0, 0.27, 0]}
          to={[0, 0.04 + filtrateLevel * 0.16, 0]}
          duration={0.55}
          color="#a89070"
          radius={0.008}
        />
      ))}
    </>
  );
}

function FiltrationScene({ assembly, step, grinding, pouring, dissolving, evaporating, dissolveColour, crystalGrowth, showLabels }) {
  const animDissolveColour = useAnimatedColor(dissolveColour, 4);
  const animCrystal = useAnimatedValue(crystalGrowth, 6);

  return (
    <>
      <Bench />

      {/* Step 1: Mortar + pestle on the LEFT */}
      <PlaceableGroup placed={assembly.mortar} fromOffset={[-0.6, 0.5, 0.3]}>
        <group position={[-0.6, 0.105, 0]}>
          <Mortar position={[0, 0.08, 0]} contains={assembly.mortar && !assembly.dissolveSetup ? '#bfa074' : null} />
          <PieceLabel position={[0, 0.08, 0]} offset={[-0.18, 0.05, 0]} text="Mortar + pestle" show={showLabels && step <= 1} />
          {step === 1 && <GrindingPestle grinding={grinding} />}
        </group>
      </PlaceableGroup>

      {/* Step 2: Dissolving setup — Bunsen + tripod + beaker + stirring rod (CENTER-LEFT) */}
      <PlaceableGroup placed={assembly.dissolveSetup} fromOffset={[-0.3, 0.5, 0]}>
        <group position={[-0.2, 0.105, 0]}>
          <Bunsen flameOn={step === 2 && dissolving} />
          <Tripod height={0.42} />
          <group position={[0, 0.425, 0]}>
            <Beaker height={0.16} radius={0.08} liquidLevel={0.7} liquidColor={animDissolveColour}>
              {/* Visible swirl in the water while stirring */}
              <SwirlIndicator stirring={step === 2 && dissolving} color={animDissolveColour} radius={0.06} y={0.06} />
              {/* Rising bubbles as the water heats */}
              <Bubbles on={step === 2 && dissolving} radius={0.07} bottomY={0.005} topY={0.12} count={6} color="#f0f6ff" />
            </Beaker>
            {/* Stirring rod actually circles around */}
            <StirringRodAnimated stirring={step === 2 && dissolving} radius={0.04} rodLength={0.2} parkX={0.04} parkY={0.15} />
          </group>
          <PieceLabel position={[0, 0.7, 0]} offset={[-0.22, 0, 0]} text="Beaker with water" show={showLabels && step === 2} color="blue" />
          <PieceLabel position={[0, 0.05, 0]} offset={[-0.22, 0, 0]} text="Bunsen + tripod" show={showLabels && step === 2} />
          <PieceLabel position={[0.04, 0.65, 0]} offset={[0.22, 0, 0]} text="Stirring rod" show={showLabels && step === 2} color="green" />
        </group>
      </PlaceableGroup>

      {/* Step 3: Filter setup — retort with funnel + filter paper + receiver beaker (CENTER) */}
      <PlaceableGroup placed={assembly.filterSetup} fromOffset={[0.2, 0.5, 0.3]}>
        <group position={[0.15, 0.105, 0]}>
          {/* Receiver beaker on the bench — level animates as filtrate accumulates */}
          <Beaker height={0.16} radius={0.07} liquidLevel={useAnimatedValue(pouring ? 0.55 : (step >= 4 ? 0.55 : 0.05), 3.5)} liquidColor="#cfe9ff" />
          {/* Funnel held above */}
          <group position={[0, 0.3, 0]}>
            <Funnel position={[0, 0, 0]} radius={0.07} height={0.12} stemLength={0.08} />
            <FilterPaper position={[0, 0.08, 0]} radius={0.064} height={0.1} />
          </group>
          <PouringMixture pouring={pouring} filtrateLevel={pouring ? 0.55 : 0.05} />
          <PieceLabel position={[0, 0.5, 0]} offset={[0.22, 0, 0]} text="Funnel" show={showLabels && step === 3} />
          <PieceLabel position={[0, 0.45, 0]} offset={[0.22, -0.04, 0]} text="Filter paper" show={showLabels && step === 3} color="green" />
          <PieceLabel position={[0, 0.07, 0]} offset={[-0.22, 0, 0]} text="Receiving beaker (filtrate)" show={showLabels && step === 3} color="blue" />
        </group>
      </PlaceableGroup>

      {/* Step 4: Evaporation — Bunsen + tripod + evaporating basin (RIGHT) */}
      <PlaceableGroup placed={assembly.evaporateSetup} fromOffset={[0.6, 0.5, 0]}>
        <group position={[0.55, 0.105, 0]}>
          <Bunsen flameOn={step === 4 && evaporating} />
          <Tripod height={0.42} />
          <group position={[0, 0.425, 0]}>
            <EvaporatingBasin position={[0, 0.012, 0]} crystalGrowth={animCrystal} />
          </group>
          <PieceLabel position={[0, 0.5, 0]} offset={[0.22, 0, 0]} text="Evaporating basin" show={showLabels && step === 4} />
          <PieceLabel position={[0, 0.05, 0]} offset={[0.22, 0, 0]} text="Bunsen burner" show={showLabels && step === 4} />
        </group>
      </PlaceableGroup>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function FiltrationLabR3F() {
  const [phase, setPhase] = useState('intro');  // intro | running | quiz | result
  const [step, setStep] = useState(0);          // 0..4 (0 = none yet, 1..4 = step number)
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const [assembly, setAssembly] = useState({
    mortar: false, dissolveSetup: false, filterSetup: false, evaporateSetup: false,
  });
  const [grinding, setGrinding] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [evaporating, setEvaporating] = useState(false);
  const [dissolveColour, setDissolveColour] = useState('#cfe9ff'); // → light yellow when salt dissolves
  const [crystalGrowth, setCrystalGrowth] = useState(0);
  const [completed, setCompleted] = useState({});  // {1:true,...}

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const STEPS = [
    {
      n: 1,
      apparatusLabel: 'Place the mortar + pestle',
      apparatusHint: 'A heavy bowl (mortar) with a grinding tool (pestle) — used to crush rock salt.',
      apparatusKey: 'mortar',
      actionLabel: 'Grind the rock salt',
      actionHint: 'Crush the rock salt into a powder so it dissolves faster.',
      run: () => {
        setGrinding(true);
        Sound.click();
        setTimeout(() => { setGrinding(false); setCompleted((c) => ({ ...c, 1: true })); }, 3500);
      },
    },
    {
      n: 2,
      apparatusLabel: 'Set up the Bunsen, tripod, beaker with water and stirring rod',
      apparatusHint: 'Heat the water and stir to dissolve the NaCl. The sand will not dissolve.',
      apparatusKey: 'dissolveSetup',
      actionLabel: 'Heat & stir to dissolve',
      actionHint: 'Watch the water clear up as the salt dissolves — sand stays at the bottom.',
      run: () => {
        setDissolving(true);
        Sound.bunsenOn();
        setDissolveColour('#ede2c0'); // slightly cloudy beige
        setTimeout(() => {
          setDissolving(false);
          Sound.bunsenOff();
          setCompleted((c) => ({ ...c, 2: true }));
        }, 4000);
      },
    },
    {
      n: 3,
      apparatusLabel: 'Set up the funnel + filter paper + receiver beaker',
      apparatusHint: 'The funnel holds the filter paper. The sand will stay in the paper (residue); the salt solution will pass through (filtrate).',
      apparatusKey: 'filterSetup',
      actionLabel: 'Pour mixture through the filter',
      actionHint: 'Watch the salt solution drip into the receiver beaker. The sand stays in the paper.',
      run: () => {
        setPouring(true);
        Sound.pour();
        setTimeout(() => { setPouring(false); setCompleted((c) => ({ ...c, 3: true })); }, 4000);
      },
    },
    {
      n: 4,
      apparatusLabel: 'Set up the evaporating basin over the Bunsen',
      apparatusHint: 'A shallow ceramic dish over the flame. As water evaporates, salt crystals form.',
      apparatusKey: 'evaporateSetup',
      actionLabel: 'Evaporate the filtrate',
      actionHint: 'Heat the filtrate gently. Crystals appear as water boils off.',
      run: () => {
        setEvaporating(true);
        Sound.bunsenOn();
        setCrystalGrowth(1);
        setTimeout(() => {
          setEvaporating(false);
          Sound.bunsenOff();
          setCompleted((c) => ({ ...c, 4: true }));
        }, 6000);
      },
    },
  ];

  const begin = async () => { await Sound.ready(); setPhase('running'); setStep(1); };
  const placeApparatus = () => {
    const s = STEPS[step - 1];
    setAssembly((p) => ({ ...p, [s.apparatusKey]: true }));
  };
  const runStep = () => {
    const s = STEPS[step - 1];
    s.run();
  };
  const nextStep = () => {
    if (step >= STEPS.length) {
      setPhase('quiz');
    } else {
      setStep(step + 1);
    }
  };
  const answerQuiz = (i) => {
    const q = QUIZ[quizIndex];
    const correct = i === q.correct;
    setQuizAnswers((a) => [...a, { index: i, correct }]);
    if (correct) Sound.chime();
    else Sound.buzz();
    setTimeout(() => {
      if (quizIndex + 1 >= QUIZ.length) setPhase('result');
      else setQuizIndex(quizIndex + 1);
    }, 700);
  };
  const reset = () => window.location.reload();

  const currentStep = step > 0 ? STEPS[step - 1] : null;
  const apparatusPlaced = currentStep ? assembly[currentStep.apparatusKey] : false;
  const stepDone = step > 0 ? !!completed[step] : false;
  const score = quizAnswers.filter((a) => a.correct).length;

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Filtration & Crystallisation · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.95, 1.8]} orbitTarget={[0, 0.4, 0]}>
        <FiltrationScene
          assembly={assembly}
          step={step}
          grinding={grinding}
          pouring={pouring}
          dissolving={dissolving}
          evaporating={evaporating}
          dissolveColour={dissolveColour}
          crystalGrowth={crystalGrowth}
          showLabels={showLabels}
        />
      </LabScene>

      {/* Intro */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry · Paper 3</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Obtaining Dry Sodium Chloride from Rock Salt</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Rock salt is a mixture of sodium chloride (NaCl) and sand. You'll separate the pure salt using four classic techniques: grinding, dissolving, filtering, and evaporating. A short quiz follows.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start step 1
            </button>
          </div>
        </div>
      )}

      {/* Running — per step */}
      {phase === 'running' && currentStep && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
          <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">
            Step {currentStep.n} of {STEPS.length}
          </div>
          {!apparatusPlaced ? (
            <>
              <div className="text-base font-bold text-stone-800 mt-0.5">{currentStep.apparatusLabel}</div>
              <div className="text-sm text-stone-600 mt-1">{currentStep.apparatusHint}</div>
              <button onClick={placeApparatus} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
                {currentStep.apparatusLabel}
              </button>
            </>
          ) : !stepDone ? (
            <>
              <div className="text-base font-bold text-stone-800 mt-0.5">{currentStep.actionLabel}</div>
              <div className="text-sm text-stone-600 mt-1">{currentStep.actionHint}</div>
              <button
                onClick={runStep}
                disabled={grinding || dissolving || pouring || evaporating}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white rounded-lg font-semibold"
              >
                <Play size={16} /> {currentStep.actionLabel}
              </button>
            </>
          ) : (
            <>
              <div className="text-base font-bold text-emerald-700 mt-0.5 flex items-center gap-2">
                <Check size={18} /> Step {currentStep.n} complete
              </div>
              <button onClick={nextStep} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1">
                {step >= STEPS.length ? 'Take the quiz' : `Continue to step ${step + 1}`}
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Quiz */}
      {phase === 'quiz' && (() => {
        const q = QUIZ[quizIndex];
        const lastAnswer = quizAnswers[quizIndex];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-2xl max-w-lg w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Question {quizIndex + 1} of {QUIZ.length}</div>
            <div className="text-base font-semibold text-stone-800 mt-1 mb-3">{q.q}</div>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !lastAnswer && answerQuiz(i)}
                  disabled={!!lastAnswer}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition ${
                    lastAnswer
                      ? i === q.correct
                        ? 'bg-emerald-100 text-emerald-900'
                        : lastAnswer.index === i
                        ? 'bg-red-100 text-red-900'
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

      {/* Result */}
      {phase === 'result' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-2 text-emerald-600">
              <Trophy size={22} />
              <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mt-1">Quiz score: {score} / {QUIZ.length}</h2>
            <div className="mt-4 space-y-1">
              {QUIZ.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-sm border-b py-1.5">
                  {quizAnswers[i]?.correct ? <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" /> : <X size={16} className="text-red-500 mt-0.5 shrink-0" />}
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
