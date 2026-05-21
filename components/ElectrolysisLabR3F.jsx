'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Zap, Trophy, RotateCcw, Check, X, ChevronRight, Tag } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, Beaker, Bubbles, Electrode, Battery, Wire,
  Sound, useAnimatedColor, useAnimatedValue,
} from './lab';

// ============================================================================
// ELECTROLYSIS — NSSCO Chemistry, Topic 5.1
// Pick electrolyte → assemble cell (beaker → electrolyte → cathode → anode →
// wires → battery) → switch on → identify products at each electrode.
// ============================================================================

const ELECTROLYTES = [
  {
    id: 'pbbr2', label: 'Molten PbBr₂', description: 'Molten lead(II) bromide, carbon electrodes.',
    liquidColour: '#9a5028', finalLiquidColour: '#9a5028', electrodes: 'carbon',
    cathodeProduct: 'Pb', anodeProduct: 'Br2',
    cathodeBubble: false, anodeBubble: true,
    cathodeBubbleColour: '#ddd', anodeBubbleColour: '#b94a1f',
    cathodeDeposit: '#6b6b75',
    cathodeHalfEq: 'Pb²⁺ + 2e⁻ → Pb', anodeHalfEq: '2Br⁻ → Br₂ + 2e⁻',
  },
  {
    id: 'dilute-h2so4', label: 'Dilute H₂SO₄', description: 'Dilute sulfuric acid, carbon electrodes.',
    liquidColour: '#d8e8f5', finalLiquidColour: '#d8e8f5', electrodes: 'carbon',
    cathodeProduct: 'H2', anodeProduct: 'O2',
    cathodeBubble: true, anodeBubble: true,
    cathodeBubbleColour: '#f0f6ff', anodeBubbleColour: '#f0f6ff',
    cathodeHalfEq: '2H⁺ + 2e⁻ → H₂', anodeHalfEq: '4OH⁻ → 2H₂O + O₂ + 4e⁻',
  },
  {
    id: 'conc-hcl', label: 'Conc. HCl', description: 'Concentrated hydrochloric acid.',
    liquidColour: '#eaf0e8', finalLiquidColour: '#eaf0e8', electrodes: 'carbon',
    cathodeProduct: 'H2', anodeProduct: 'Cl2',
    cathodeBubble: true, anodeBubble: true,
    cathodeBubbleColour: '#f0f6ff', anodeBubbleColour: '#d4d878',
    cathodeHalfEq: '2H⁺ + 2e⁻ → H₂', anodeHalfEq: '2Cl⁻ → Cl₂ + 2e⁻',
  },
  {
    id: 'conc-nacl', label: 'Conc. NaCl (brine)', description: 'Concentrated brine.',
    liquidColour: '#f0f0e8', finalLiquidColour: '#f0f0e8', electrodes: 'carbon',
    cathodeProduct: 'H2', anodeProduct: 'Cl2',
    cathodeBubble: true, anodeBubble: true,
    cathodeBubbleColour: '#f0f6ff', anodeBubbleColour: '#d4d878',
    cathodeHalfEq: '2H₂O + 2e⁻ → H₂ + 2OH⁻', anodeHalfEq: '2Cl⁻ → Cl₂ + 2e⁻',
  },
  {
    id: 'cuso4-carbon', label: 'CuSO₄ / carbon', description: 'Copper(II) sulfate, carbon electrodes.',
    liquidColour: '#1e88e5', finalLiquidColour: '#7fb8e5', electrodes: 'carbon',
    cathodeProduct: 'Cu', anodeProduct: 'O2',
    cathodeBubble: false, anodeBubble: true,
    cathodeBubbleColour: '#fff', anodeBubbleColour: '#f0f6ff',
    cathodeDeposit: '#c87533',
    cathodeHalfEq: 'Cu²⁺ + 2e⁻ → Cu', anodeHalfEq: '4OH⁻ → 2H₂O + O₂ + 4e⁻',
  },
  {
    id: 'cuso4-copper', label: 'CuSO₄ / copper', description: 'Electroplating: copper electrodes.',
    liquidColour: '#1e88e5', finalLiquidColour: '#1e88e5', electrodes: 'copper',
    cathodeProduct: 'Cu', anodeProduct: 'Cu²⁺ (dissolves)',
    cathodeBubble: false, anodeBubble: false,
    cathodeBubbleColour: '#fff', anodeBubbleColour: '#fff',
    cathodeDeposit: '#c87533',
    cathodeHalfEq: 'Cu²⁺ + 2e⁻ → Cu', anodeHalfEq: 'Cu → Cu²⁺ + 2e⁻',
  },
];

const PRODUCT_OPTIONS = [
  { id: 'H2', label: 'Hydrogen gas (H₂)' },
  { id: 'O2', label: 'Oxygen gas (O₂)' },
  { id: 'Cl2', label: 'Chlorine gas (Cl₂)' },
  { id: 'Br2', label: 'Bromine vapour (Br₂)' },
  { id: 'Cu', label: 'Copper metal (Cu)' },
  { id: 'Pb', label: 'Lead metal (Pb)' },
  { id: 'Cu²⁺ (dissolves)', label: 'Anode dissolves into solution' },
];

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

function CellScene({ electrolyte, assembly, current, running, depositGrowth, showLabels }) {
  const liquidColour = useAnimatedColor(
    running ? electrolyte.finalLiquidColour : electrolyte.liquidColour, 8,
  );
  const animDeposit = useAnimatedValue(depositGrowth, 1);

  return (
    <>
      <Bench />
      {/* Beaker */}
      <PlaceableGroup placed={assembly.beaker} fromOffset={[0, 0.5, 0.4]}>
        <group position={[0, 0.105, 0]}>
          <Beaker
            height={0.22}
            radius={0.13}
            liquidLevel={assembly.electrolyte ? 0.75 : 0}
            liquidColor={liquidColour}
          />
          <PieceLabel position={[0, 0.12, 0]} offset={[-0.22, 0, 0]} text="Beaker (250 cm³)" show={showLabels} />
          {assembly.electrolyte && (
            <PieceLabel position={[0, 0.06, 0]} offset={[0.22, 0, 0]} text={electrolyte.label} show={showLabels} color="blue" />
          )}
        </group>
      </PlaceableGroup>

      {/* Cathode */}
      {assembly.cathode && (
        <PlaceableGroup placed fromOffset={[-0.3, 0.3, 0.3]}>
          <group position={[-0.05, 0.5, 0]}>
            <Electrode
              material={electrolyte.electrodes}
              deposit={electrolyte.cathodeDeposit}
              depositThickness={electrolyte.cathodeDeposit && current ? animDeposit * 0.005 : 0}
            />
            <group position={[0, -0.28, 0]}>
              <Bubbles
                on={running && electrolyte.cathodeBubble}
                radius={0.015} bottomY={0} topY={0.18}
                color={electrolyte.cathodeBubbleColour} count={6}
              />
            </group>
            <PieceLabel position={[0, 0.05, 0]} offset={[-0.18, 0, 0]} text="Cathode (−)" show={showLabels} color="red" />
          </group>
        </PlaceableGroup>
      )}

      {/* Anode */}
      {assembly.anode && (
        <PlaceableGroup placed fromOffset={[0.3, 0.3, 0.3]}>
          <group position={[0.05, 0.5, 0]}>
            <Electrode material={electrolyte.electrodes} />
            <group position={[0, -0.28, 0]}>
              <Bubbles
                on={running && electrolyte.anodeBubble}
                radius={0.015} bottomY={0} topY={0.18}
                color={electrolyte.anodeBubbleColour} count={6}
              />
            </group>
            <PieceLabel position={[0, 0.05, 0]} offset={[0.18, 0, 0]} text="Anode (+)" show={showLabels} color="red" />
          </group>
        </PlaceableGroup>
      )}

      {/* Battery + wires */}
      {assembly.battery && (
        <PlaceableGroup placed fromOffset={[0, 0.3, -0.5]}>
          <group>
            <Battery position={[0, 0.16, -0.35]} on={current} />
            {assembly.cathode && <Wire from={[-0.08, 0.21, -0.35]} to={[-0.05, 0.5, 0]} color="#111" sag={0.06} />}
            {assembly.anode && <Wire from={[0.08, 0.21, -0.35]} to={[0.05, 0.5, 0]} color="#b8392c" sag={0.06} />}
            <PieceLabel position={[0, 0.21, -0.35]} offset={[0, 0.06, 0]} text="Battery (DC)" show={showLabels} />
          </group>
        </PlaceableGroup>
      )}
    </>
  );
}

export default function ElectrolysisLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | menu | assemble | ready | running | observe | result | finished
  const [currentId, setCurrentId] = useState(null);
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [results, setResults] = useState({});
  const [currentOn, setCurrentOn] = useState(false);
  const [depositGrowth, setDepositGrowth] = useState(0);
  const [cathodeGuess, setCathodeGuess] = useState(null);
  const [anodeGuess, setAnodeGuess] = useState(null);
  const [assembly, setAssembly] = useState({});

  const electrolyte = currentId ? ELECTROLYTES.find((e) => e.id === currentId) : null;
  const completedIds = new Set(Object.keys(results));

  useEffect(() => Sound.setMuted(muted), [muted]);

  const begin = async () => { await Sound.ready(); setPhase('menu'); };

  const pickElectrolyte = (id) => {
    setCurrentId(id);
    setCathodeGuess(null);
    setAnodeGuess(null);
    setDepositGrowth(0);
    setAssembly({});
    setStep(0);
    setPhase('assemble');
  };

  const ASSEMBLY_STEPS = [
    { id: 'beaker',      label: 'Place the beaker',           hint: 'The electrolytic cell holds the electrolyte solution.', set: { beaker: true } },
    { id: 'electrolyte', label: 'Pour the electrolyte',       hint: () => electrolyte ? `Fill the beaker with ${electrolyte.label}.` : '', set: { electrolyte: true }, sound: 'pour' },
    { id: 'cathode',     label: 'Place the cathode (−)',      hint: () => `${electrolyte?.electrodes === 'copper' ? 'A copper rod' : 'A carbon rod'} — wired to the negative terminal.`, set: { cathode: true } },
    { id: 'anode',       label: 'Place the anode (+)',        hint: () => `${electrolyte?.electrodes === 'copper' ? 'A copper rod' : 'A carbon rod'} — wired to the positive terminal.`, set: { anode: true } },
    { id: 'battery',     label: 'Connect to battery',         hint: 'A DC supply drives the ions in the electrolyte.', set: { battery: true } },
  ];

  const doStep = () => {
    const s = ASSEMBLY_STEPS[step];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (s.sound === 'pour') Sound.pour();
    if (step + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setStep(step + 1);
  };

  const runCurrent = () => {
    setCurrentOn(true);
    setPhase('running');
    Sound.bubblesOn();
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      setDepositGrowth(Math.min(1, t / 8));
      if (t >= 8) clearInterval(interval);
    }, 100);
  };

  const stopCurrent = () => {
    setCurrentOn(false);
    Sound.bubblesOff();
    setPhase('observe');
  };

  const submitGuess = () => {
    const cathodeCorrect = cathodeGuess === electrolyte.cathodeProduct;
    const anodeCorrect = anodeGuess === electrolyte.anodeProduct;
    setResults((prev) => ({
      ...prev,
      [currentId]: { cathodeCorrect, anodeCorrect, fullyCorrect: cathodeCorrect && anodeCorrect },
    }));
    if (cathodeCorrect && anodeCorrect) Sound.chime();
    else Sound.buzz();
    setPhase('result');
  };

  const backToMenu = () => {
    setCurrentId(null);
    setCurrentOn(false);
    setPhase(completedIds.size + 1 === ELECTROLYTES.length ? 'finished' : 'menu');
  };

  const reset = () => window.location.reload();

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Electrolysis · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.7, 1.4]} orbitTarget={[0, 0.35, 0]}>
        {electrolyte ? (
          <CellScene
            electrolyte={electrolyte}
            assembly={assembly}
            current={currentOn}
            running={currentOn}
            depositGrowth={depositGrowth}
            showLabels={showLabels}
          />
        ) : (<Bench />)}
      </LabScene>

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry · Topic 5.1</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Electrolysis</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Choose an electrolyte, build the cell yourself (beaker → electrolyte → electrodes → battery), switch on the current, then identify what forms at each electrode. Six electrolytes — each tests a different concept.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Begin
            </button>
          </div>
        </div>
      )}

      {phase === 'menu' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-3xl w-[96%]">
          <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-2">Choose electrolyte ({completedIds.size}/{ELECTROLYTES.length} complete)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ELECTROLYTES.map((e) => {
                const done = completedIds.has(e.id);
                const result = results[e.id];
                return (
                  <button
                    key={e.id}
                    onClick={() => pickElectrolyte(e.id)}
                    disabled={done}
                    className={`p-3 rounded-lg text-left transition ${
                      done ? (result.fullyCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900')
                        : 'bg-stone-100 hover:bg-blue-100 text-stone-800'
                    }`}
                  >
                    <div className="font-semibold text-sm flex items-center gap-1">
                      {done && (result.fullyCorrect ? <Check size={14} /> : <X size={14} />)} {e.label}
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">{e.description}</div>
                  </button>
                );
              })}
            </div>
            {completedIds.size === ELECTROLYTES.length && (
              <button onClick={() => setPhase('finished')} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
                See final results →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'assemble' && electrolyte && (() => {
        const s = ASSEMBLY_STEPS[step];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">Build the cell · step {step + 1}/{ASSEMBLY_STEPS.length}</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{s.label}</div>
            <div className="text-sm text-stone-600 mt-1">{typeof s.hint === 'function' ? s.hint() : s.hint}</div>
            <button onClick={doStep} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              {s.label}
            </button>
            <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(step / ASSEMBLY_STEPS.length) * 100}%` }} />
            </div>
          </div>
        );
      })()}

      {phase === 'ready' && electrolyte && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Cell ready: {electrolyte.label}</div>
          <div className="text-sm text-stone-700 mt-1">Switch on the current to start electrolysis. Watch each electrode carefully.</div>
          <button onClick={runCurrent} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Zap size={16} /> Switch on current
          </button>
        </div>
      )}

      {phase === 'running' && electrolyte && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Current flowing: {electrolyte.label}</div>
          <div className="text-sm text-stone-700 mt-1">Observe colour changes, bubbles and any deposits at each electrode.</div>
          <button onClick={stopCurrent} className="mt-3 w-full px-4 py-3 bg-stone-700 hover:bg-stone-800 text-white rounded-lg font-semibold">
            Switch off & identify products
          </button>
        </div>
      )}

      {phase === 'observe' && electrolyte && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-lg w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Identify products</div>
          <div className="text-sm font-semibold text-stone-800 mb-3">{electrolyte.label}</div>
          <div className="text-xs text-stone-500 mb-1">At the cathode (−):</div>
          <div className="grid grid-cols-2 gap-1 mb-3">
            {PRODUCT_OPTIONS.map((p) => (
              <button key={p.id} onClick={() => setCathodeGuess(p.id)} className={`px-2 py-1.5 rounded text-xs text-left transition ${cathodeGuess === p.id ? 'bg-blue-600 text-white' : 'bg-stone-100 hover:bg-blue-100 text-stone-700'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-stone-500 mb-1">At the anode (+):</div>
          <div className="grid grid-cols-2 gap-1 mb-3">
            {PRODUCT_OPTIONS.map((p) => (
              <button key={p.id} onClick={() => setAnodeGuess(p.id)} className={`px-2 py-1.5 rounded text-xs text-left transition ${anodeGuess === p.id ? 'bg-blue-600 text-white' : 'bg-stone-100 hover:bg-blue-100 text-stone-700'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={submitGuess} disabled={!cathodeGuess || !anodeGuess} className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg text-sm font-medium">
            Submit
          </button>
        </div>
      )}

      {phase === 'result' && electrolyte && results[currentId] && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Result · {electrolyte.label}</div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Cathode: <strong>{electrolyte.cathodeProduct}</strong></span>
              {results[currentId].cathodeCorrect ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
            </div>
            <div className="flex items-center justify-between">
              <span>Anode: <strong>{electrolyte.anodeProduct}</strong></span>
              {results[currentId].anodeCorrect ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-stone-600 font-mono space-y-0.5">
              <div>Cathode: {electrolyte.cathodeHalfEq}</div>
              <div>Anode:   {electrolyte.anodeHalfEq}</div>
            </div>
          </div>
          <button onClick={backToMenu} className="mt-3 w-full px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm">
            {completedIds.size + 1 === ELECTROLYTES.length ? 'See final results' : 'Next electrolyte'}
            <ChevronRight size={14} className="inline ml-1" />
          </button>
        </div>
      )}

      {phase === 'finished' && <FinalResults results={results} onReset={reset} />}
    </div>
  );
}

function FinalResults({ results, onReset }) {
  const fullyCorrect = Object.values(results).filter((r) => r.fullyCorrect).length;
  const total = ELECTROLYTES.length;
  const score = Object.values(results).reduce((s, r) => s + (r.cathodeCorrect ? 1 : 0) + (r.anodeCorrect ? 1 : 0), 0);
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={22} />
          <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mt-1">{score} / {total * 2} products · {fullyCorrect}/{total} cells fully right</h2>
        <div className="mt-4 space-y-1">
          {ELECTROLYTES.map((e) => {
            const r = results[e.id];
            return (
              <div key={e.id} className="flex items-center justify-between text-sm border-b py-1.5">
                <span className="text-stone-700">{e.label}</span>
                <span>
                  {r.cathodeCorrect ? <Check size={14} className="text-emerald-600 inline" /> : <X size={14} className="text-red-500 inline" />}
                  <span className="text-xs text-stone-400 mx-1">cathode</span>
                  {r.anodeCorrect ? <Check size={14} className="text-emerald-600 inline" /> : <X size={14} className="text-red-500 inline" />}
                  <span className="text-xs text-stone-400 mx-1">anode</span>
                </span>
              </div>
            );
          })}
        </div>
        <button onClick={onReset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Try again
        </button>
      </div>
    </div>
  );
}
