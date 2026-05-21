'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, ChevronRight, Tag, Play, Timer } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LabScene, Bench, Beaker, Bubbles, Sound, useAnimatedValue, SwirlIndicator } from './lab';

// ============================================================================
// RATE OF REACTION — NSSCO Chemistry
// Mg + 2 HCl → MgCl₂ + H₂. Vary [HCl], time the Mg dissolving.
// Plot rate (1/t) vs concentration → straight line through origin.
// ============================================================================

const CONC_OPTIONS = [0.5, 1.0, 1.5, 2.0];
const TIME_COMPRESSION = 5;
const T_REF_SIMULATED = 40;

function timeToDissolve(concM) {
  return T_REF_SIMULATED * (1.0 / concM) * (0.9 + Math.random() * 0.2);
}

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

// Magnesium ribbon: thin metal strip that shrinks as it dissolves
function MgRibbon({ remainingPct = 100, position = [0, 0, 0] }) {
  const animLen = useAnimatedValue(0.08 * (remainingPct / 100), 0.3);
  if (animLen < 0.001) return null;
  return (
    <mesh position={[position[0], position[1] - 0.04 + animLen / 2, position[2]]}>
      <boxGeometry args={[0.015, animLen, 0.002]} />
      <meshStandardMaterial color="#c8c8d0" metalness={0.85} roughness={0.3} />
    </mesh>
  );
}

function ScenePiece({ assembly, running, mgPct, showLabels }) {
  return (
    <>
      <Bench />
      <PlaceableGroup placed={assembly.beaker} fromOffset={[0, 0.5, 0.3]}>
        <group position={[0, 0.105, 0]}>
          <Beaker height={0.18} radius={0.1} liquidLevel={assembly.hcl ? 0.7 : 0} liquidColor="#e8f0ff">
            {/* Visible swirl in the acid as the reaction releases H2 — the agitation */}
            {assembly.hcl && (
              <SwirlIndicator stirring={running && mgPct > 0} color="#a0c8e0" radius={0.07} y={0.04} />
            )}
          </Beaker>
          {assembly.mg && (
            <group position={[0, 0.05, 0]}>
              <MgRibbon remainingPct={mgPct} />
            </group>
          )}
          {/* H₂ bubbles rising while reacting */}
          <group position={[0, 0.005, 0]}>
            <Bubbles on={running && mgPct > 0} radius={0.08} bottomY={0.01} topY={0.13} count={10} color="#f0f6ff" />
          </group>
          <PieceLabel position={[0, 0.1, 0]} offset={[-0.22, 0, 0]} text="Beaker (250 cm³)" show={showLabels} />
          {assembly.hcl && (
            <PieceLabel position={[0, 0.05, 0]} offset={[0.22, 0, 0]} text="HCl solution" show={showLabels} color="blue" />
          )}
          {assembly.mg && mgPct > 0 && (
            <PieceLabel position={[0, 0.06, 0]} offset={[0.22, -0.05, 0]} text="Magnesium ribbon" show={showLabels} color="green" />
          )}
        </group>
      </PlaceableGroup>
    </>
  );
}

export default function RateOfReactionLabR3F() {
  const [phase, setPhase] = useState('intro');  // intro | assemble | ready | running | between | results
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({ beaker: false, hcl: false, mg: false });
  const [assemblyStep, setAssemblyStep] = useState(0);

  const [concentration, setConcentration] = useState(1.0);
  const [simElapsed, setSimElapsed] = useState(0);
  const [mgPct, setMgPct] = useState(100);
  const [trials, setTrials] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'beaker', label: 'Place the beaker',          hint: 'A 250 cm³ glass beaker.', set: { beaker: true } },
    { id: 'hcl',    label: 'Pour in the HCl solution',  hint: '100 cm³ of HCl — concentration is chosen per trial.', set: { hcl: true }, sound: 'pour' },
    { id: 'mg',     label: 'Add the magnesium ribbon',  hint: 'A measured strip (3 cm) of polished Mg ribbon.', set: { mg: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); setAssemblyStep(0); };
  const doAssemblyStep = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (s.sound === 'pour') Sound.pour();
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const startTrial = () => {
    setSimElapsed(0);
    setMgPct(100);
    setPhase('running');
    Sound.bubblesOn();

    const simTotal = timeToDissolve(concentration);
    const realTotal = simTotal / TIME_COMPRESSION;
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const realE = (Date.now() - start) / 1000;
      const ratio = Math.min(1, realE / realTotal);
      setSimElapsed(simTotal * ratio);
      setMgPct(Math.max(0, 100 - ratio * 100));
      if (ratio >= 1) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        Sound.bubblesOff();
        Sound.chime();
        setTrials((t) => [...t, { conc: concentration, time: simTotal, rate: 1 / simTotal }]);
        setPhase('between');
      }
    }, 50);
  };

  const nextTrial = () => {
    setAssembly((p) => ({ ...p, mg: false }));
    setMgPct(100);
    setPhase('ready');
  };

  const finishLab = () => setPhase('results');
  const reset = () => window.location.reload();

  const triedConcs = new Set(trials.map((t) => t.conc));

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Rate of Reaction · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.7, 1.3]} orbitTarget={[0, 0.3, 0]}>
        <ScenePiece assembly={assembly} running={phase === 'running'} mgPct={mgPct} showLabels={showLabels} />
      </LabScene>

      {phase === 'running' && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-56 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">[HCl]</div>
          <div className="text-xl font-mono font-bold">{concentration.toFixed(1)} mol/dm³</div>
          <div className="mt-2 text-xs text-stone-500 uppercase tracking-wide">Time</div>
          <div className="text-2xl font-mono font-bold flex items-center gap-1"><Timer size={18} /> {simElapsed.toFixed(1)} s</div>
          <div className="mt-2 text-xs text-stone-500 uppercase tracking-wide">Mg remaining</div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${mgPct}%` }} />
          </div>
        </div>
      )}

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Rate of Reaction</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Mg + 2 HCl → MgCl₂ + H₂. Run this reaction at 4 different acid concentrations and time how long the Mg ribbon takes to disappear. Plot rate vs [HCl] to see the rate law.
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
          <div className="text-xs text-stone-500 uppercase tracking-wide">Trial {trials.length + 1}</div>
          <div className="text-base font-semibold text-stone-800 mt-1">Choose acid concentration</div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {CONC_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConcentration(c)}
                disabled={triedConcs.has(c)}
                className={`px-2 py-2 rounded text-sm font-mono transition ${
                  triedConcs.has(c) ? 'bg-emerald-100 text-emerald-700'
                    : concentration === c ? 'bg-blue-600 text-white'
                    : 'bg-stone-100 hover:bg-blue-100 text-stone-700'
                }`}
              >
                {c} M {triedConcs.has(c) && '✓'}
              </button>
            ))}
          </div>
          <button onClick={startTrial} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Drop in the Mg and start
          </button>
          {trials.length >= 2 && (
            <button onClick={finishLab} className="mt-2 w-full px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm">
              Finish & see graph →
            </button>
          )}
        </div>
      )}

      {phase === 'between' && (() => {
        const r = trials[trials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Trial recorded</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-stone-500">[HCl]</div><div className="font-mono font-bold">{r.conc} M</div></div>
              <div><div className="text-xs text-stone-500">Time</div><div className="font-mono font-bold">{r.time.toFixed(1)} s</div></div>
              <div><div className="text-xs text-stone-500">Rate (1/t)</div><div className="font-mono font-bold">{r.rate.toFixed(4)} s⁻¹</div></div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={nextTrial} disabled={triedConcs.size >= CONC_OPTIONS.length} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white rounded-lg text-sm font-medium">
                Another concentration <ChevronRight size={14} className="inline" />
              </button>
              <button onClick={finishLab} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">
                <Trophy size={14} className="inline mr-1" /> See graph
              </button>
            </div>
          </div>
        );
      })()}

      {phase === 'results' && <Results trials={trials} onReset={reset} />}
    </div>
  );
}

function Results({ trials, onReset }) {
  const maxRate = Math.max(...trials.map((t) => t.rate), 0.001);
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={22} />
          <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mt-1">Rate vs Concentration</h2>
        <svg viewBox="0 0 300 200" className="w-full mt-3">
          <line x1="40" y1="180" x2="290" y2="180" stroke="#888" strokeWidth="1" />
          <line x1="40" y1="180" x2="40" y2="20" stroke="#888" strokeWidth="1" />
          <text x="160" y="195" textAnchor="middle" fontSize="9" fill="#666">[HCl] (mol/dm³)</text>
          <text x="10" y="100" textAnchor="middle" fontSize="9" fill="#666" transform="rotate(-90 10 100)">Rate (s⁻¹)</text>
          {trials.map((t, i) => {
            const x = 40 + (t.conc / 2.0) * 250;
            const y = 180 - (t.rate / maxRate) * 150;
            return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />;
          })}
          {(() => {
            const slope = trials.reduce((s, t) => s + t.rate * t.conc, 0) / trials.reduce((s, t) => s + t.conc * t.conc, 0);
            return <line x1="40" y1="180" x2="290" y2={180 - (slope * 2.0 / maxRate) * 150} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />;
          })()}
        </svg>
        <table className="w-full mt-3 text-sm">
          <thead className="text-stone-500 text-xs uppercase border-b">
            <tr><th className="text-left py-1">[HCl]</th><th className="text-right py-1">Time (s)</th><th className="text-right py-1">Rate</th></tr>
          </thead>
          <tbody>
            {trials.map((t, i) => (
              <tr key={i} className="border-b border-stone-100">
                <td className="py-2 font-mono">{t.conc} M</td>
                <td className="py-2 text-right font-mono">{t.time.toFixed(1)}</td>
                <td className="py-2 text-right font-mono">{t.rate.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 p-3 rounded-lg bg-stone-50 text-sm text-stone-700">
          The graph is a straight line through the origin — <strong>rate ∝ [HCl]</strong>. The reaction is first order with respect to acid.
        </div>
        <button onClick={onReset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          <RotateCcw size={16} /> New session
        </button>
      </div>
    </div>
  );
}
