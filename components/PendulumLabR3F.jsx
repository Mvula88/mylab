'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Play, Square, Trophy, RotateCcw, Check, ChevronRight, Tag } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LabScene, Bench, Sound } from './lab';

// ============================================================================
// SIMPLE PENDULUM — NSSCO Physics
// Assembly: place stand → attach clamp → tie string → attach bob → release.
// Time 20 oscillations, plot T² vs L → solve for g.
// ============================================================================

const G = 9.81;
const periodAt = (lengthCm) => 2 * Math.PI * Math.sqrt(lengthCm / 100 / G);

function PieceLabel({ position = [0, 0, 0], offset = [0.18, 0, 0], text, show = true, color = 'amber' }) {
  if (!show) return null;
  const colorClass = {
    amber: 'bg-amber-100 border-amber-400 text-amber-900',
    blue:  'bg-blue-100 border-blue-400 text-blue-900',
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

// ─── Apparatus ────────────────────────────────────────────────────────────
function PendulumStand({ pivotHeight = 1.0 }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0.05, 0.012, 0]}>
        <boxGeometry args={[0.32, 0.024, 0.22]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[-0.1, pivotHeight / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, pivotHeight, 16]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function PivotClamp({ pivotHeight = 1.0 }) {
  return (
    <group position={[0, pivotHeight - 0.01, 0]}>
      <mesh castShadow position={[-0.04, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.06]} />
        <meshStandardMaterial color="#222" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[-0.04 + 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 12]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function SwingingPendulum({ lengthCm, running, paused, onEdge }) {
  const groupRef = useRef();
  const cordRef = useRef();
  const startTime = useRef(null);
  const lastSign = useRef(0);
  const initialAngle = 0.3;

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!running) {
      groupRef.current.rotation.z = running === null ? 0 : initialAngle;
      startTime.current = null;
      return;
    }
    if (paused) return;
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
      lastSign.current = 1;
    }
    const t = state.clock.elapsedTime - startTime.current;
    const T = periodAt(lengthCm);
    const damping = Math.exp(-0.02 * t);
    const angle = initialAngle * damping * Math.cos((2 * Math.PI * t) / T);
    groupRef.current.rotation.z = angle;
    if (cordRef.current) {
      const L = lengthCm / 100;
      cordRef.current.scale.y = L / 0.5;
      cordRef.current.position.y = -L / 2;
    }
    const sign = Math.sign(angle);
    if (sign !== 0 && sign !== lastSign.current && lastSign.current !== 0) {
      onEdge && onEdge(t);
      lastSign.current = sign;
    }
  });

  const L = lengthCm / 100;
  return (
    <group ref={groupRef} position={[-0.04, 0.105 + 1.0 - 0.01, 0.06]}>
      <mesh ref={cordRef} position={[0, -L / 2, 0]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.5, 8]} />
        <meshStandardMaterial color="#e8e2c8" roughness={0.8} />
      </mesh>
      <mesh position={[0, -L, 0]} castShadow>
        <sphereGeometry args={[0.025, 32, 16]} />
        <meshStandardMaterial color="#9a4f1a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function PendulumScene({ assembly, lengthCm, running, paused, onEdge, showLabels }) {
  return (
    <>
      <Bench />
      <PlaceableGroup placed={assembly.stand} fromOffset={[-0.4, 0.5, 0.3]}>
        <group position={[0, 0.105, 0]}>
          <PendulumStand pivotHeight={1.0} />
          <PieceLabel position={[-0.1, 0.5, 0]} offset={[-0.2, 0, 0]} text="Retort stand" show={showLabels} />
        </group>
      </PlaceableGroup>

      <PlaceableGroup placed={assembly.clamp} fromOffset={[0.3, 0.3, 0.3]}>
        <group position={[0, 0.105, 0]}>
          <PivotClamp pivotHeight={1.0} />
          <PieceLabel position={[0, 1.0, 0]} offset={[0.2, 0.04, 0]} text="Pivot clamp" show={showLabels} color="blue" />
        </group>
      </PlaceableGroup>

      {assembly.bob && (
        <>
          <SwingingPendulum
            lengthCm={lengthCm}
            running={running}
            paused={paused}
            onEdge={onEdge}
          />
          {showLabels && (
            <>
              <PieceLabel
                position={[-0.04, 0.105 + 1.0 - 0.5, 0.06]}
                offset={[-0.25, 0, 0]}
                text="String"
                color="green"
              />
              <PieceLabel
                position={[-0.04, 0.105 + 1.0 - 0.01 - (lengthCm / 100), 0.06]}
                offset={[0.2, 0, 0]}
                text="Bob (mass)"
              />
            </>
          )}
        </>
      )}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function PendulumLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | setup | swinging | finished | results
  const [step, setStep] = useState(0);
  const [assembly, setAssembly] = useState({ stand: false, clamp: false, bob: false });

  const [lengthCm, setLengthCm] = useState(40);
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [trials, setTrials] = useState([]);
  const [oscCount, setOscCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const oscRef = useRef(0);
  const targetOsc = 20;

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'stand', label: 'Place the retort stand', hint: 'A heavy base with a vertical rod — holds the pendulum up.', set: { stand: true } },
    { id: 'clamp', label: 'Fix the pivot clamp at the top', hint: 'The clamp lets the string swing freely from a fixed point.', set: { clamp: true } },
    { id: 'bob',   label: 'Tie the string + attach the bob', hint: 'A small heavy ball (the "bob") swings on a length of string.', set: { bob: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); setStep(0); };
  const doStep = () => {
    const s = ASSEMBLY_STEPS[step];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (step + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('setup'), 900);
    else setStep(step + 1);
  };

  const startSwing = () => {
    setOscCount(0);
    setElapsed(0);
    oscRef.current = 0;
    setPaused(false);
    setPhase('swinging');
  };

  const handleEdge = (t) => {
    oscRef.current += 0.5;
    const newCount = Math.floor(oscRef.current);
    setElapsed(t);
    if (newCount !== oscCount) {
      setOscCount(newCount);
      Sound.click();
      if (newCount >= targetOsc) {
        setPaused(true);
        const period = t / targetOsc;
        setTrials((tr) => [...tr, { id: tr.length + 1, lengthCm, elapsed: t, period, periodSq: period * period }]);
        setPhase('finished');
        Sound.chime();
      }
    }
  };

  const stopEarly = () => {
    setPaused(true);
    if (oscCount > 0) {
      const period = elapsed / oscCount;
      setTrials((tr) => [...tr, { id: tr.length + 1, lengthCm, elapsed, period, periodSq: period * period }]);
    }
    setPhase('finished');
  };

  const nextTrial = () => setPhase('setup');

  const computeG = () => {
    if (trials.length < 2) return null;
    const xs = trials.map((t) => t.lengthCm / 100);
    const ys = trials.map((t) => t.periodSq);
    const n = xs.length;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumXX = xs.reduce((s, x) => s + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const g = (4 * Math.PI * Math.PI) / slope;
    return { slope, g, error: Math.abs(g - G) };
  };

  const reset = () => window.location.reload();

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Simple Pendulum · NSSCO Physics</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0.4, 0.9, 1.6]} orbitTarget={[0, 0.6, 0]}>
        <PendulumScene
          assembly={assembly}
          lengthCm={lengthCm}
          running={phase === 'swinging'}
          paused={paused}
          onEdge={handleEdge}
          showLabels={showLabels}
        />
      </LabScene>

      {phase === 'swinging' && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-56 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Length L</div>
          <div className="text-xl font-mono font-bold">{lengthCm} cm</div>
          <div className="mt-2 text-xs text-stone-500 uppercase tracking-wide">Oscillations</div>
          <div className="text-2xl font-mono font-bold">{oscCount} / {targetOsc}</div>
          <div className="mt-2 text-xs text-stone-500 uppercase tracking-wide">Time</div>
          <div className="text-xl font-mono font-bold">{elapsed.toFixed(2)} s</div>
        </div>
      )}

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Physics</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Simple Pendulum</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              You'll build a pendulum, then time 20 swings at different string lengths. Plot T² vs L to calculate g — the acceleration of gravity.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start building the pendulum
            </button>
          </div>
        </div>
      )}

      {phase === 'assemble' && (() => {
        const s = ASSEMBLY_STEPS[step];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">Step {step + 1} of {ASSEMBLY_STEPS.length}</div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{s.label}</div>
            <div className="text-sm text-stone-600 mt-1">{s.hint}</div>
            <button onClick={doStep} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              {s.label}
            </button>
            <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(step / ASSEMBLY_STEPS.length) * 100}%` }} />
            </div>
          </div>
        );
      })()}

      {phase === 'setup' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Trial {trials.length + 1}</div>
          <div className="text-base font-semibold text-stone-800 mb-2">Set the string length</div>
          <div className="flex items-center gap-2">
            <input type="range" min="20" max="100" step="5" value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} className="flex-1" />
            <div className="text-xl font-mono font-bold w-20 text-right">{lengthCm} cm</div>
          </div>
          <button onClick={startSwing} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Release the bob
          </button>
          {trials.length >= 2 && (
            <button onClick={() => setPhase('results')} className="mt-2 w-full px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm">
              Or finish & calculate g →
            </button>
          )}
        </div>
      )}

      {phase === 'swinging' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-xl">
          <button onClick={stopEarly} className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-800 text-white rounded-lg text-sm">
            <Square size={14} /> Stop early
          </button>
        </div>
      )}

      {phase === 'finished' && (() => {
        const t = trials[trials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Trial {t.id} recorded</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div><div className="text-xs text-stone-500">Length L</div><div className="font-mono font-bold">{t.lengthCm} cm</div></div>
              <div><div className="text-xs text-stone-500">Time</div><div className="font-mono font-bold">{t.elapsed.toFixed(2)} s</div></div>
              <div><div className="text-xs text-stone-500">Period T</div><div className="font-mono font-bold">{t.period.toFixed(3)} s</div></div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={nextTrial} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Another length <ChevronRight size={14} className="inline" />
              </button>
              {trials.length >= 2 && (
                <button onClick={() => setPhase('results')} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">
                  <Trophy size={14} className="inline mr-1" /> Calculate g
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {phase === 'results' && <Results trials={trials} computed={computeG()} onReset={reset} />}
    </div>
  );
}

function Results({ trials, computed, onReset }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={22} />
          <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mt-1">Your data</h2>
        <table className="w-full mt-3 text-sm">
          <thead className="text-stone-500 text-xs uppercase border-b">
            <tr><th className="text-left py-1">#</th><th className="text-right py-1">L (m)</th><th className="text-right py-1">T (s)</th><th className="text-right py-1">T² (s²)</th></tr>
          </thead>
          <tbody>
            {trials.map((t) => (
              <tr key={t.id} className="border-b border-stone-100">
                <td className="py-2">{t.id}</td>
                <td className="py-2 text-right font-mono">{(t.lengthCm / 100).toFixed(2)}</td>
                <td className="py-2 text-right font-mono">{t.period.toFixed(3)}</td>
                <td className="py-2 text-right font-mono">{t.periodSq.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {computed ? (
          <div className="mt-4 p-3 rounded-lg bg-stone-50 text-sm space-y-1 font-mono text-stone-700">
            <div>Best-fit slope of T² vs L: <strong>{computed.slope.toFixed(3)} s²/m</strong></div>
            <div>g = 4π² ÷ slope = <strong className="text-emerald-700">{computed.g.toFixed(2)} m/s²</strong></div>
            <div className="text-stone-500 text-xs">True: 9.81 m/s² · Error: {computed.error.toFixed(2)} m/s² ({((computed.error / G) * 100).toFixed(1)}%)</div>
            {computed.error < 0.5 ? (
              <div className="text-emerald-700 font-semibold flex items-center gap-1"><Check size={14} /> Within 5% of accepted value</div>
            ) : (
              <div className="text-amber-700 font-semibold">Outside 5% — try more trials</div>
            )}
          </div>
        ) : (<div className="mt-4 text-sm text-stone-500">Need ≥2 trials.</div>)}
        <button onClick={onReset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          <RotateCcw size={16} /> New session
        </button>
      </div>
    </div>
  );
}
