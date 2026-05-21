'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LabScene, Bench, Sound, useAnimatedColor } from './lab';

// ============================================================================
// CO2 INVESTIGATION — NSSCO Biology
// Three destarched leaves are sealed in clear bags with:
//   (A) Soda lime — absorbs CO₂ → no photosynthesis → no starch
//   (B) Sodium bicarbonate — releases CO₂ → photosynthesis → starch
//   (C) Water (control) — atmospheric CO₂ → photosynthesis → starch
// After 24 h in sunlight, test each leaf for starch with iodine.
// ============================================================================

const SUBSTANCES = [
  { id: 'sodaLime', label: 'Soda lime',          note: 'Absorbs CO₂', hasStarch: false, bagTint: '#ece6d2' },
  { id: 'bicarb',   label: 'Sodium bicarbonate', note: 'Releases CO₂', hasStarch: true,  bagTint: '#e8f0ff' },
  { id: 'water',    label: 'Water (control)',    note: 'Normal CO₂',   hasStarch: true,  bagTint: '#eaf6f6' },
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

// Leaf — simple plane with vein detail
function Leaf({ position = [0, 0, 0], iodineApplied = false, hasStarch = false }) {
  const colour = !iodineApplied ? '#3a8a3a' : (hasStarch ? '#1a1a2e' : '#9c7a4a');
  const animColour = useAnimatedColor(colour, 3);
  return (
    <group position={position} rotation={[-Math.PI / 2.4, 0, 0]}>
      <mesh>
        <coneGeometry args={[0.06, 0.13, 6, 1, false]} />
        <meshStandardMaterial color={animColour} roughness={0.7} side={2} />
      </mesh>
    </group>
  );
}

// Clear plastic bag — a translucent sphere/box around the leaf
function Bag({ position = [0, 0, 0], tint = '#f0f0f0', children }) {
  return (
    <group position={position}>
      {/* Bag — slightly tinted, transparent */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshPhysicalMaterial color={tint} transparent opacity={0.25} transmission={0.4} thickness={0.05} roughness={0.5} side={2} />
      </mesh>
      {children}
    </group>
  );
}

function Scene({ assembly, current, iodineApplied, showLabels }) {
  return (
    <>
      <Bench />
      {SUBSTANCES.map((sub, i) => {
        const x = (i - 1) * 0.35;
        const placed = assembly[sub.id];
        const isCurrent = current?.id === sub.id;
        return (
          <PlaceableGroup key={sub.id} placed={placed} fromOffset={[0, 0.5, 0.3]}>
            <group position={[x, 0.105, 0]}>
              <Bag position={[0, 0.12, 0]} tint={sub.bagTint}>
                <Leaf position={[0, -0.02, 0]} iodineApplied={isCurrent && iodineApplied} hasStarch={sub.hasStarch} />
              </Bag>
              <PieceLabel position={[0, 0.25, 0]} offset={[0, 0.04, 0]} text={sub.label} show={showLabels} color={i === 0 ? 'amber' : i === 1 ? 'blue' : 'green'} />
              {/* The substance lying at the bottom inside the bag */}
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
                <meshStandardMaterial color={i === 0 ? '#e8dab4' : i === 1 ? '#f8f8f0' : '#cfe9ff'} roughness={0.7} />
              </mesh>
            </group>
          </PlaceableGroup>
        );
      })}
    </>
  );
}

export default function CO2InvestigationLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | wait | test | predict | result | end
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({});
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [current, setCurrent] = useState(null);
  const [iodineApplied, setIodineApplied] = useState(false);
  const [predictions, setPredictions] = useState({}); // {id: 'starch' | 'noStarch'}
  const [testedCount, setTestedCount] = useState(0);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = SUBSTANCES.map((s) => ({
    id: s.id,
    label: `Set up bag ${s.id === 'sodaLime' ? 'A' : s.id === 'bicarb' ? 'B' : 'C'} with ${s.label}`,
    hint: `A destarched leaf is sealed in a clear bag with ${s.label.toLowerCase()}. ${s.note}.`,
    set: { [s.id]: true },
  }));

  const begin = async () => { await Sound.ready(); setPhase('assemble'); };
  const doAssembly = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('wait'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const startTesting = () => {
    setCurrent(SUBSTANCES[0]);
    setPhase('predict');
  };

  const predict = (val) => {
    setPredictions((p) => ({ ...p, [current.id]: val }));
    Sound.click();
    // Run iodine test
    setPhase('test');
    setIodineApplied(false);
    setTimeout(() => { setIodineApplied(true); Sound.pour(); }, 600);
    setTimeout(() => setPhase('result'), 4500);
  };

  const next = () => {
    const idx = SUBSTANCES.findIndex((s) => s.id === current.id);
    if (idx + 1 >= SUBSTANCES.length) {
      setPhase('end');
    } else {
      setCurrent(SUBSTANCES[idx + 1]);
      setIodineApplied(false);
      setPhase('predict');
    }
  };

  const reset = () => window.location.reload();
  const correctCount = SUBSTANCES.filter((s) => {
    const p = predictions[s.id];
    return p && ((p === 'starch') === s.hasStarch);
  }).length;

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">CO₂ Investigation · NSSCO Biology</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.75, 1.5]} orbitTarget={[0, 0.25, 0]}>
        <Scene assembly={assembly} current={current} iodineApplied={iodineApplied} showLabels={showLabels} />
      </LabScene>

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Biology</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Is CO₂ needed for photosynthesis?</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Three destarched leaves are sealed in bags with different CO₂ conditions. After 24 h in sunlight, predict which leaves will test positive for starch with iodine.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start building the setup
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
            <button onClick={doAssembly} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              {s.label}
            </button>
          </div>
        );
      })()}

      {phase === 'wait' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Wait 24 hours in sunlight</div>
          <div className="text-sm text-stone-700 mt-1">Each leaf has had 24 h to use (or not use) the available CO₂. Now test each one for starch with iodine.</div>
          <button onClick={startTesting} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Begin iodine tests
          </button>
        </div>
      )}

      {phase === 'predict' && current && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Bag: {current.label}</div>
          <div className="text-base font-semibold text-stone-800 mt-1 mb-2">Predict: will this leaf turn blue-black with iodine?</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => predict('starch')} className="px-3 py-2 bg-stone-100 hover:bg-blue-100 text-stone-800 rounded-lg text-sm">
              Yes — starch present (blue-black)
            </button>
            <button onClick={() => predict('noStarch')} className="px-3 py-2 bg-stone-100 hover:bg-blue-100 text-stone-800 rounded-lg text-sm">
              No — no starch (stays brown)
            </button>
          </div>
        </div>
      )}

      {phase === 'test' && current && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl">
          <div className="text-sm text-stone-700">Applying iodine to the {current.label} leaf…</div>
        </div>
      )}

      {phase === 'result' && current && (() => {
        const correct = (predictions[current.id] === 'starch') === current.hasStarch;
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="flex items-center gap-2">
              {correct ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-500" />}
              <div className="font-semibold text-stone-800">
                The {current.label} leaf {current.hasStarch ? 'has starch (blue-black)' : 'has no starch (brown)'}.
              </div>
            </div>
            <div className="text-xs text-stone-600 mt-1">{current.note} — so photosynthesis {current.hasStarch ? 'happened' : 'could NOT happen'}.</div>
            <button onClick={next} className="mt-3 w-full px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm">
              {SUBSTANCES.findIndex((s) => s.id === current.id) + 1 >= SUBSTANCES.length ? 'See final score' : 'Next bag'} <ChevronRight size={14} className="inline" />
            </button>
          </div>
        );
      })()}

      {phase === 'end' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-2 text-emerald-600">
              <Trophy size={22} />
              <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mt-1">Predictions: {correctCount} / {SUBSTANCES.length}</h2>
            <p className="text-sm text-stone-700 mt-2">CO₂ is needed for photosynthesis — only the leaves with available CO₂ made starch.</p>
            <button onClick={reset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
