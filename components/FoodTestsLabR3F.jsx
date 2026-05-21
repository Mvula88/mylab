'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Flame as FlameIcon, Droplet, Trophy, RotateCcw, Check, X, Tag } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene,
  Bench,
  TubeRack,
  TestTube,
  TubeLiquid,
  Bunsen,
  Tripod,
  Beaker,
  Bubbles,
  Sound,
  useAnimatedColor,
  useAnimatedValue,
} from './lab';

function PieceLabel({ position = [0, 0, 0], offset = [0.18, 0, 0], text, show = true, color = 'amber' }) {
  if (!show) return null;
  const colorClass = {
    amber: 'bg-amber-100 border-amber-400 text-amber-900',
    blue: 'bg-blue-100 border-blue-400 text-blue-900',
    green: 'bg-emerald-100 border-emerald-400 text-emerald-900',
    red: 'bg-red-100 border-red-400 text-red-900',
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

// ============================================================================
// FOOD TESTS LAB — NSSCO Biology Paper 5
// R3F port using shared apparatus library.
// ============================================================================

const FOOD_COLOR = '#efe6c8';
const FOODS = [
  { name: 'Milk',          contains: { starch: false, sugar: true,  protein: true,  lipid: true  } },
  { name: 'Bread',         contains: { starch: true,  sugar: false, protein: true,  lipid: false } },
  { name: 'Apple juice',   contains: { starch: false, sugar: true,  protein: false, lipid: false } },
  { name: 'Egg white',     contains: { starch: false, sugar: false, protein: true,  lipid: false } },
  { name: 'Sunflower oil', contains: { starch: false, sugar: false, protein: false, lipid: true  } },
  { name: 'Rice water',    contains: { starch: true,  sugar: false, protein: false, lipid: false } },
  { name: 'Sweet potato',  contains: { starch: true,  sugar: true,  protein: false, lipid: false } },
];

const TESTS = {
  iodine: {
    id: 'iodine', name: 'Iodine Test', bio: 'starch', tubeIndex: 0,
    reagents: [{ name: 'iodine', color: '#5a3a1a', optimal: [3, 6] }],
    needsHeat: false,
    positiveColor: '#1a1a2e', negativeColor: FOOD_COLOR,
    observations: [
      { label: 'Blue-black colour formed', positive: true, correct: true },
      { label: 'Stayed orange-brown', positive: false, correct: true },
      { label: 'Turned blue (not blue-black)', positive: true, correct: false },
      { label: 'Turned red', positive: null, correct: false },
    ],
    inferences: [
      { label: 'Starch is present', whenPositive: true },
      { label: 'Starch is absent', whenPositive: false },
      { label: 'Reducing sugar is present', whenPositive: null },
      { label: 'Test is inconclusive', whenPositive: null },
    ],
  },
  benedicts: {
    id: 'benedicts', name: "Benedict's Test", bio: 'sugar', tubeIndex: 1,
    reagents: [{ name: "Benedict's", color: '#3a86c8', optimal: [8, 12] }],
    needsHeat: true, optimalHeatSeconds: [5, 7],
    positiveColor: '#b94a1f', negativeColor: '#3a86c8', burntColor: '#5a3a1a',
    observations: [
      { label: 'Brick-red precipitate formed', positive: true, correct: true, requiresHeat: 'optimal' },
      { label: 'Solution turned red', positive: true, correct: false },
      { label: 'Stayed blue', positive: false, correct: true },
      { label: 'Turned dark brown (burnt)', positive: null, correct: true, requiresHeat: 'over' },
    ],
    inferences: [
      { label: 'Reducing sugar is present', whenPositive: true },
      { label: 'Reducing sugar is absent', whenPositive: false },
      { label: 'Test is inconclusive (overheated)', whenPositive: null },
      { label: 'Protein is present', whenPositive: null },
    ],
  },
  biuret: {
    id: 'biuret', name: 'Biuret Test', bio: 'protein', tubeIndex: 2,
    reagents: [
      { name: 'NaOH', color: '#cfe9ff', optimal: [4, 7] },
      { name: 'CuSO4', color: '#1e88e5', optimal: [3, 5] },
    ],
    needsHeat: false,
    positiveColor: '#6b3aa0', negativeColor: '#7fc8ff',
    observations: [
      { label: 'Solution turned violet/purple', positive: true, correct: true },
      { label: 'Stayed pale blue', positive: false, correct: true },
      { label: 'Turned blue then violet', positive: true, correct: false },
      { label: 'Turned green', positive: null, correct: false },
    ],
    inferences: [
      { label: 'Protein is present', whenPositive: true },
      { label: 'Protein is absent', whenPositive: false },
      { label: 'Starch is present', whenPositive: null },
      { label: 'Lipid is present', whenPositive: null },
    ],
  },
  emulsion: {
    id: 'emulsion', name: 'Emulsion Test', bio: 'lipid', tubeIndex: 3,
    reagents: [
      { name: 'ethanol', color: '#e8e8ff', optimal: [6, 10] },
      { name: 'water', color: '#cfe9ff', optimal: [4, 8] },
    ],
    needsHeat: false, needsShake: true,
    positiveColor: '#f0f0f0', negativeColor: '#e8e8e8',
    observations: [
      { label: 'Cloudy white emulsion formed', positive: true, correct: true },
      { label: 'Stayed clear', positive: false, correct: true },
      { label: 'Slightly cloudy', positive: true, correct: false },
      { label: 'Turned yellow', positive: null, correct: false },
    ],
    inferences: [
      { label: 'Lipid is present', whenPositive: true },
      { label: 'Lipid is absent', whenPositive: false },
      { label: 'Protein is present', whenPositive: null },
      { label: 'Test is inconclusive', whenPositive: null },
    ],
  },
};

// ─── 3D scene ──────────────────────────────────────────────────────────────
function FoodTestsScene({ tubeStates, flameOn, bubblesOn, assembly, showLabels }) {
  return (
    <>
      <Bench />

      {/* Bunsen (left side, plus tripod, gauze, water bath) */}
      <PlaceableGroup placed={assembly.bunsen} fromOffset={[-0.8, 0.5, 0.3]}>
        <group position={[-0.5, 0.105, 0]}>
          <Bunsen position={[0, 0, 0]} flameOn={flameOn} />
          <PieceLabel position={[0, 0.15, 0]} offset={[-0.18, 0, 0]} text="Bunsen burner" show={showLabels} />
        </group>
      </PlaceableGroup>

      <PlaceableGroup placed={assembly.tripod} fromOffset={[-0.8, 0.5, -0.3]}>
        <group position={[-0.5, 0.105, 0]}>
          <Tripod position={[0, 0, 0]} height={0.42} />
          <PieceLabel position={[0, 0.42, 0]} offset={[-0.18, 0, 0]} text="Tripod + gauze" show={showLabels} color="blue" />
        </group>
      </PlaceableGroup>

      <PlaceableGroup placed={assembly.waterBath} fromOffset={[-0.8, 0.5, 0]}>
        <group position={[-0.5, 0.105 + 0.425, 0]}>
          <Beaker liquidLevel={0.7} liquidColor="#a8d8ff" />
          <group position={[0, 0.01, 0]}>
            <Bubbles on={bubblesOn} radius={0.09} bottomY={0} topY={0.14} />
          </group>
          <PieceLabel position={[0, 0.1, 0]} offset={[0.22, 0, 0]} text="Water bath (250 cm³)" show={showLabels} color="green" />
        </group>
      </PlaceableGroup>

      {/* Test tube rack on the right */}
      <PlaceableGroup placed={assembly.rack} fromOffset={[0.8, 0.5, 0]}>
        <TubeRack position={[0.4, 0.105, 0]} slots={4} spacing={0.18}>
          {assembly.tubes && tubeStates.map((t, i) => (
            <AnimatedTube
              key={i}
              slotIndex={i}
              color={t.color}
              level={t.level}
              label={['A', 'B', 'C', 'D'][i]}
            />
          ))}
        </TubeRack>
        {assembly.rack && (
          <PieceLabel position={[0.4, 0.2, 0]} offset={[0, 0.08, 0]} text="Test tube rack" show={showLabels} />
        )}
        {assembly.tubes && (
          <PieceLabel position={[0.4, 0.45, 0]} offset={[0, 0.08, 0]} text="Test tubes A, B, C, D (with food sample)" show={showLabels} color="blue" />
        )}
      </PlaceableGroup>
    </>
  );
}

function AnimatedTube({ slotIndex, color, level, label }) {
  const animatedColor = useAnimatedColor(color, 1.5);
  const animatedLevel = useAnimatedValue(level, 0.6);
  const x = (slotIndex - 1.5) * 0.18;
  return (
    <group position={[x, 0.115, 0]}>
      <TestTube label={label}>
        <TubeLiquid level={animatedLevel} color={animatedColor} />
      </TestTube>
    </group>
  );
}

// ─── Drop counter overlay (UI inside test) ────────────────────────────────
function DropCounter({ reagent, drops, onAddDrop, onDone, onCancel }) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
      <div className="text-xs text-stone-500 uppercase tracking-wide">Add reagent</div>
      <div className="text-lg font-semibold text-stone-800 mb-2">
        Add {reagent.name} drops to the tube
      </div>
      <div className="flex items-center gap-3 my-3">
        <div className="text-4xl font-bold text-stone-800 tabular-nums">{drops}</div>
        <div className="text-sm text-stone-500">drops added</div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onAddDrop}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          <Droplet size={16} /> Add drop
        </button>
        <button
          onClick={onDone}
          disabled={drops === 0}
          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg font-medium"
        >
          Done
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-3 bg-stone-200 hover:bg-stone-300 text-stone-600 rounded-lg"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Heat panel (Benedict's only) ─────────────────────────────────────────
function HeatPanel({ seconds, onRemoveWithHand, onRemoveWithTongs }) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
      <div className="text-xs text-stone-500 uppercase tracking-wide">Heating in water bath</div>
      <div className="text-lg font-semibold text-stone-800 mb-2">Watch the colour change</div>
      <div className="flex items-center gap-3 my-3">
        <FlameIcon className="text-orange-500" size={24} />
        <div className="text-4xl font-bold text-stone-800 tabular-nums">{seconds.toFixed(1)}s</div>
      </div>
      <div className="text-sm text-stone-600 mb-3">Remove the tube when you're satisfied. How will you take it out?</div>
      <div className="flex gap-2">
        <button
          onClick={onRemoveWithHand}
          className="flex-1 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm"
        >
          With my hand
        </button>
        <button
          onClick={onRemoveWithTongs}
          className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
        >
          Use test-tube tongs
        </button>
      </div>
    </div>
  );
}

// ─── Observation / Inference picker ───────────────────────────────────────
function ChoicePanel({ title, prompt, options, onPick }) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md w-[95%]">
      <div className="text-xs text-stone-500 uppercase tracking-wide">{title}</div>
      <div className="text-base font-semibold text-stone-800 mb-3">{prompt}</div>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onPick(opt, i)}
            className="w-full text-left px-3 py-2 bg-stone-100 hover:bg-blue-100 rounded-lg text-sm text-stone-700"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function FoodTestsLabR3F() {
  const food = useMemo(() => FOODS[Math.floor(Math.random() * FOODS.length)], []);
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({
    rack: false, tubes: false, bunsen: false, tripod: false, waterBath: false,
  });
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | assemble | menu | running | done
  const [activeTestId, setActiveTestId] = useState(null);
  const [subStep, setSubStep] = useState('pour'); // pour | heat | observe | infer | result
  const [reagentIndex, setReagentIndex] = useState(0);
  const [drops, setDrops] = useState(0);
  const [heatSeconds, setHeatSeconds] = useState(0);
  const [heatStartedAt, setHeatStartedAt] = useState(null);
  const [usedTongs, setUsedTongs] = useState(true);
  const [tubeStates, setTubeStates] = useState([
    { color: FOOD_COLOR, level: 0.35 },
    { color: FOOD_COLOR, level: 0.35 },
    { color: FOOD_COLOR, level: 0.35 },
    { color: FOOD_COLOR, level: 0.35 },
  ]);
  const [flameOn, setFlameOn] = useState(false);
  const [bubblesOn, setBubblesOn] = useState(false);
  const [results, setResults] = useState({}); // { testId: { reagentVolumes:[], observationCorrect, inferenceCorrect, safetyOk, positive } }
  const [identification, setIdentification] = useState(null);

  // Mute toggling stops continuous noises immediately
  useEffect(() => {
    Sound.setMuted(muted);
  }, [muted]);

  // Heat timer for Benedict's
  useEffect(() => {
    if (subStep !== 'heat' || heatStartedAt === null) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - heatStartedAt) / 1000;
      setHeatSeconds(elapsed);
      const test = TESTS[activeTestId];
      // Animate color cascade if test is positive
      if (test.bio && food.contains[test.bio]) {
        const stops = ['#3a86c8', '#7fb86b', '#d8c54a', '#e88c3a', '#b94a1f'];
        const idx = Math.min(stops.length - 1, Math.floor((elapsed / 7) * stops.length));
        setTube(test.tubeIndex, { color: stops[idx] });
      }
      // Burn if held too long
      if (elapsed > 10) {
        setTube(test.tubeIndex, { color: test.burntColor });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [subStep, heatStartedAt, activeTestId]); // eslint-disable-line

  const setTube = (i, patch) => {
    setTubeStates((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  };

  const ASSEMBLY_STEPS = [
    { id: 'rack',      label: 'Place the test tube rack', hint: 'A wooden rack with 4 sockets for test tubes.', set: { rack: true } },
    { id: 'tubes',     label: 'Place 4 test tubes (A, B, C, D) with food sample', hint: 'Each tube gets a small amount of your unknown food sample (already added).', set: { tubes: true } },
    { id: 'bunsen',    label: 'Set up the Bunsen burner', hint: 'Heat source — used for Benedict\'s sugar test.', set: { bunsen: true } },
    { id: 'tripod',    label: 'Place the tripod + wire gauze', hint: 'Holds the water bath above the flame.', set: { tripod: true } },
    { id: 'waterBath', label: 'Place the beaker (water bath)', hint: 'Holds water that gets heated — safer than direct flame for boiling test tubes.', set: { waterBath: true } },
  ];

  const doAssemblyStep = async () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) {
      setTimeout(() => setPhase('menu'), 900);
    } else {
      setAssemblyStep(assemblyStep + 1);
    }
  };

  const start = async () => {
    await Sound.ready();
    setPhase('assemble');
  };

  const beginTest = (testId) => {
    setActiveTestId(testId);
    setSubStep('pour');
    setReagentIndex(0);
    setDrops(0);
    setHeatSeconds(0);
    setUsedTongs(true);
    setPhase('running');
  };

  const addDrop = async () => {
    await Sound.drop();
    const test = TESTS[activeTestId];
    const reagent = test.reagents[reagentIndex];
    setDrops((d) => d + 1);
    // Tint tube toward reagent color slightly
    setTube(test.tubeIndex, { color: blend(tubeStates[test.tubeIndex].color, reagent.color, 0.08) });
  };

  const finishPouring = async () => {
    const test = TESTS[activeTestId];
    const reagent = test.reagents[reagentIndex];
    const inRange = drops >= reagent.optimal[0] && drops <= reagent.optimal[1];
    const reagentResult = { name: reagent.name, drops, optimal: reagent.optimal, correctVolume: inRange };
    setResults((prev) => ({
      ...prev,
      [activeTestId]: {
        ...(prev[activeTestId] || { reagentResults: [] }),
        reagentResults: [...((prev[activeTestId] || {}).reagentResults || []), reagentResult],
      },
    }));

    // Move to next reagent if any
    if (reagentIndex + 1 < test.reagents.length) {
      setReagentIndex((r) => r + 1);
      setDrops(0);
      return;
    }

    // Otherwise determine next sub-step
    if (test.needsHeat) {
      setSubStep('heat');
      setHeatStartedAt(Date.now());
      setFlameOn(true);
      setBubblesOn(true);
      Sound.whoosh();
      setTimeout(() => Sound.bunsenOn(), 300);
      Sound.bubblesOn();
    } else if (test.needsShake) {
      // Quick shake animation: tint to positive/negative based on food
      const isPositive = food.contains[test.bio];
      setTube(test.tubeIndex, { color: isPositive ? test.positiveColor : test.negativeColor });
      Sound.click();
      setTimeout(() => setSubStep('observe'), 800);
    } else {
      // Immediate reaction
      const isPositive = food.contains[test.bio];
      setTube(test.tubeIndex, { color: isPositive ? test.positiveColor : test.negativeColor });
      setTimeout(() => setSubStep('observe'), 600);
    }
  };

  const removeFromHeat = async (withTongs) => {
    setUsedTongs(withTongs);
    setFlameOn(false);
    setBubblesOn(false);
    Sound.bunsenOff();
    Sound.bubblesOff();
    if (!withTongs) Sound.buzz();
    else Sound.click();
    setHeatStartedAt(null);
    // Record final tube color for observation step
    setSubStep('observe');
  };

  const pickObservation = (opt) => {
    const test = TESTS[activeTestId];
    const isPositive = food.contains[test.bio];
    const overheated = test.needsHeat && heatSeconds > 10;
    const optimalHeat = test.needsHeat && heatSeconds >= test.optimalHeatSeconds[0] && heatSeconds <= test.optimalHeatSeconds[1];

    let observationCorrect = false;
    if (overheated) observationCorrect = opt.requiresHeat === 'over';
    else if (isPositive && optimalHeat !== false) observationCorrect = opt.positive === true && opt.correct === true;
    else if (isPositive) observationCorrect = opt.positive === true && opt.correct === true;
    else observationCorrect = opt.positive === false && opt.correct === true;

    setResults((prev) => ({
      ...prev,
      [activeTestId]: { ...prev[activeTestId], observation: opt.label, observationCorrect, isPositive, overheated, safetyOk: usedTongs },
    }));
    setSubStep('infer');
  };

  const pickInference = (opt) => {
    const test = TESTS[activeTestId];
    const r = results[activeTestId];
    const overheated = r.overheated;
    let inferenceCorrect = false;
    if (overheated) inferenceCorrect = opt.whenPositive === null && opt.label.toLowerCase().includes('inconclusive');
    else inferenceCorrect = opt.whenPositive === r.isPositive;

    setResults((prev) => ({
      ...prev,
      [activeTestId]: { ...prev[activeTestId], inference: opt.label, inferenceCorrect, complete: true },
    }));
    setSubStep('result');
  };

  const finishTest = () => {
    setActiveTestId(null);
    setPhase('menu');
    setSubStep('pour');
  };

  const allDone = Object.keys(TESTS).every((tid) => results[tid]?.complete);

  const identify = (foodName) => {
    setIdentification({ guess: foodName, correct: foodName === food.name });
    setPhase('done');
    Sound.chime();
  };

  const reset = () => window.location.reload();

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-stone-100">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Food Tests Lab · NSSCO Biology</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <LabScene cameraPosition={[0, 0.8, 1.6]} orbitTarget={[0, 0.4, 0]}>
        <FoodTestsScene
          tubeStates={tubeStates}
          flameOn={flameOn}
          bubblesOn={bubblesOn}
          assembly={assembly}
          showLabels={showLabels}
        />
      </LabScene>

      {/* Overlays per phase */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Biology · Paper 5</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Food Tests Practical</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              You have been given an unknown food sample. Run the four food tests, record your observations, and identify what biomolecules the sample contains. Marks are awarded for technique, observations, inferences, and final identification — not just for getting a reaction.
            </p>
            <button
              onClick={start}
              className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Start building the apparatus
            </button>
          </div>
        </div>
      )}

      {phase === 'assemble' && (() => {
        const s = ASSEMBLY_STEPS[assemblyStep];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">
              Build the apparatus · step {assemblyStep + 1} of {ASSEMBLY_STEPS.length}
            </div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{s.label}</div>
            <div className="text-sm text-stone-600 mt-1">{s.hint}</div>
            <button
              onClick={doAssemblyStep}
              className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              {s.label}
            </button>
            <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(assemblyStep / ASSEMBLY_STEPS.length) * 100}%` }} />
            </div>
          </div>
        );
      })()}

      {phase === 'menu' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-4xl w-[95%]">
          <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-2">Choose a test</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.values(TESTS).map((test) => {
                const done = results[test.id]?.complete;
                return (
                  <button
                    key={test.id}
                    onClick={() => beginTest(test.id)}
                    disabled={done}
                    className={`p-3 rounded-lg text-left text-sm transition ${
                      done
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 hover:bg-blue-100 text-stone-800'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1">
                      {done && <Check size={14} />} Tube {['A', 'B', 'C', 'D'][test.tubeIndex]}
                    </div>
                    <div className="text-xs opacity-80">{test.name}</div>
                  </button>
                );
              })}
            </div>
            {allDone && (
              <button
                onClick={() => setPhase('identify')}
                className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
              >
                All tests complete — identify the food →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'running' && subStep === 'pour' && (
        <DropCounter
          reagent={TESTS[activeTestId].reagents[reagentIndex]}
          drops={drops}
          onAddDrop={addDrop}
          onDone={finishPouring}
          onCancel={() => { setPhase('menu'); setActiveTestId(null); }}
        />
      )}

      {phase === 'running' && subStep === 'heat' && (
        <HeatPanel
          seconds={heatSeconds}
          onRemoveWithHand={() => removeFromHeat(false)}
          onRemoveWithTongs={() => removeFromHeat(true)}
        />
      )}

      {phase === 'running' && subStep === 'observe' && (
        <ChoicePanel
          title="Observation"
          prompt="Describe exactly what you observed."
          options={TESTS[activeTestId].observations}
          onPick={pickObservation}
        />
      )}

      {phase === 'running' && subStep === 'infer' && (
        <ChoicePanel
          title="Inference"
          prompt="What does your observation tell you?"
          options={TESTS[activeTestId].inferences}
          onPick={pickInference}
        />
      )}

      {phase === 'running' && subStep === 'result' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <ResultCard test={TESTS[activeTestId]} result={results[activeTestId]} />
          <button
            onClick={finishTest}
            className="mt-3 w-full px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg"
          >
            Back to menu
          </button>
        </div>
      )}

      {phase === 'identify' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Identification</div>
            <h2 className="text-xl font-bold text-stone-800 mb-3">Based on your tests, what was the food sample?</h2>
            <div className="grid grid-cols-2 gap-2">
              {FOODS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => identify(f.name)}
                  className="px-3 py-2 bg-stone-100 hover:bg-blue-100 rounded-lg text-sm text-stone-800"
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <FinalReport
          food={food}
          identification={identification}
          results={results}
          onReset={reset}
        />
      )}
    </div>
  );
}

function ResultCard({ test, result }) {
  return (
    <div>
      <div className="text-xs text-stone-500 uppercase tracking-wide">{test.name} — recorded</div>
      <div className="mt-2 space-y-1 text-sm">
        {result.reagentResults?.map((r, i) => (
          <div key={i} className="flex justify-between">
            <span>{r.name}: {r.drops} drops</span>
            {r.correctVolume ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
          </div>
        ))}
        <div className="flex justify-between">
          <span>Observation</span>
          {result.observationCorrect ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
        </div>
        <div className="flex justify-between">
          <span>Inference</span>
          {result.inferenceCorrect ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
        </div>
        {test.needsHeat && (
          <div className="flex justify-between">
            <span>Safety (tongs)</span>
            {result.safetyOk ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
          </div>
        )}
      </div>
    </div>
  );
}

function FinalReport({ food, identification, results, onReset }) {
  const score = useMemo(() => {
    let earned = 0;
    let total = 0;
    Object.values(results).forEach((r) => {
      r.reagentResults?.forEach((rg) => {
        total += 1;
        if (rg.correctVolume) earned += 1;
      });
      total += 1;
      if (r.observationCorrect) earned += 1;
      total += 1;
      if (r.inferenceCorrect) earned += 1;
      if (r.safetyOk !== undefined) {
        total += 1;
        if (r.safetyOk) earned += 1;
      }
    });
    total += 1;
    if (identification.correct) earned += 1;
    return { earned, total, pct: Math.round((earned / total) * 100) };
  }, [results, identification]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={22} />
          <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mt-1">
          {score.earned} / {score.total} marks · {score.pct}%
        </h2>
        <div className="text-sm text-stone-600 mt-1">
          The unknown sample was <strong>{food.name}</strong>. You identified it as{' '}
          <strong>{identification.guess}</strong> — {identification.correct ? '✓ correct' : '✗ incorrect'}.
        </div>

        <div className="mt-4 space-y-2">
          {Object.entries(results).map(([testId, r]) => {
            const test = TESTS[testId];
            const testScore =
              (r.reagentResults?.filter((rg) => rg.correctVolume).length || 0) +
              (r.observationCorrect ? 1 : 0) +
              (r.inferenceCorrect ? 1 : 0) +
              (r.safetyOk ? 1 : 0);
            const testTotal =
              (r.reagentResults?.length || 0) + 2 + (r.safetyOk !== undefined ? 1 : 0);
            return (
              <div key={testId} className="border rounded-lg p-3 bg-stone-50">
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-stone-800 text-sm">{test.name}</div>
                  <div className="text-sm tabular-nums">{testScore}/{testTotal}</div>
                </div>
                <ResultCard test={test} result={r} />
              </div>
            );
          })}
        </div>

        <button
          onClick={onReset}
          className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> Try another sample
        </button>
      </div>
    </div>
  );
}

// Tiny color blender for incremental tube tinting
function blend(hexA, hexB, t) {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  return (
    '#' +
    [
      Math.round(a.r + (b.r - a.r) * t),
      Math.round(a.g + (b.g - a.g) * t),
      Math.round(a.b + (b.b - a.b) * t),
    ]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}
function parseHex(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
