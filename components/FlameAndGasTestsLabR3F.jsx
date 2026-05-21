'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play, Flame as FlameIcon } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LabScene, Bench, Bunsen, Flame, Beaker, TestTube, TubeLiquid, Sound, useAnimatedColor } from './lab';

// ============================================================================
// FLAME & GAS TESTS — NSSCO Chemistry
// 1) Flame test: dip nichrome wire in unknown salt, hold in Bunsen flame,
//    identify the cation from the flame colour.
// 2) Gas test: a gas jar is filled with an unknown gas; pick the right test
//    (splint / limewater / litmus) and identify the gas.
// ============================================================================

const FLAME_SAMPLES = [
  { cation: 'Li', label: 'Li⁺ (lithium)',   colour: '#d24a2a', flameName: 'red' },
  { cation: 'Na', label: 'Na⁺ (sodium)',    colour: '#ffd54a', flameName: 'bright yellow' },
  { cation: 'K',  label: 'K⁺ (potassium)',  colour: '#b070d6', flameName: 'lilac' },
  { cation: 'Ca', label: 'Ca²⁺ (calcium)',  colour: '#d96b3a', flameName: 'brick-red' },
  { cation: 'Ba', label: 'Ba²⁺ (barium)',   colour: '#7fc674', flameName: 'green' },
];

const GASES = [
  { id: 'H2',  name: 'hydrogen',       jarTint: '#f4f7fa' },
  { id: 'O2',  name: 'oxygen',         jarTint: '#f4f7fa' },
  { id: 'CO2', name: 'carbon dioxide', jarTint: '#f4f7fa' },
  { id: 'NH3', name: 'ammonia',        jarTint: '#f4f7fa' },
  { id: 'Cl2', name: 'chlorine',       jarTint: '#deeac8' },
];

const GAS_TESTS = [
  { id: 'lighted', label: 'Lighted splint' },
  { id: 'glowing', label: 'Glowing splint' },
  { id: 'limewater', label: 'Limewater' },
  { id: 'redLitmus', label: 'Damp red litmus' },
  { id: 'blueLitmus', label: 'Damp blue litmus' },
];

const TEST_RESULT = (gas, testId) => {
  const T = { lighted: 'pops with a lighted splint', glowing: 'relights a glowing splint', limewater: 'turns limewater milky', redLitmus: 'turns red litmus blue', blueLitmus: 'bleaches blue litmus white' };
  if (testId === 'lighted' && gas === 'H2') return { text: 'Squeaky POP — hydrogen', positive: true };
  if (testId === 'glowing' && gas === 'O2') return { text: 'Splint relights — oxygen', positive: true };
  if (testId === 'limewater' && gas === 'CO2') return { text: 'Limewater turns milky — CO₂', positive: true };
  if (testId === 'redLitmus' && gas === 'NH3') return { text: 'Red litmus turns blue — ammonia', positive: true };
  if (testId === 'blueLitmus' && gas === 'Cl2') return { text: 'Blue litmus bleached — chlorine', positive: true };
  return { text: 'No characteristic change', positive: false };
};

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

// Coloured flame (replaces default blue Bunsen flame when burning a sample)
function ColouredFlame({ colour }) {
  const animColour = useAnimatedColor(colour, 0.5);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.scale.y = 1 + Math.sin(t * 17) * 0.1;
  });
  return (
    <group position={[0, 0.22, 0]}>
      <mesh ref={ref} position={[0, 0.12, 0]}>
        <coneGeometry args={[0.045, 0.24, 16]} />
        <meshBasicMaterial color={animColour} transparent opacity={0.8} depthWrite={false} />
      </mesh>
      <pointLight color={animColour} intensity={3} distance={2} decay={1.5} />
    </group>
  );
}

// Gas jar — a tall narrow cylinder, optionally tinted (Cl2 = yellow-green)
function GasJar({ position = [0, 0, 0], gasTint = '#f4f7fa', showCover = true }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 24, 1, true]} />
        <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.18} transmission={0.85} thickness={0.05} roughness={0.12} ior={1.45} side={2} />
      </mesh>
      {/* Inner gas tint */}
      <mesh>
        <cylinderGeometry args={[0.055, 0.055, 0.17, 24]} />
        <meshStandardMaterial color={gasTint} transparent opacity={0.15} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.003, 24]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.4} />
      </mesh>
      {/* Glass cover */}
      {showCover && (
        <mesh position={[0, 0.092, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.004, 24]} />
          <meshStandardMaterial color="#cfd6dd" roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Nichrome wire on a glass rod, dipped in the sample then moved into the flame
function NichromeWire({ inFlame, sampleColour }) {
  return (
    <group position={[0, 0.55, 0]} rotation={[0, 0, inFlame ? 0 : -0.5]}>
      {/* Glass rod handle */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 12]} />
        <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.3} transmission={0.7} thickness={0.05} ior={1.45} />
      </mesh>
      {/* Nichrome loop at the end */}
      <mesh position={[0, -0.005, 0]}>
        <torusGeometry args={[0.008, 0.0015, 8, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Sample on the loop */}
      {sampleColour && (
        <mesh position={[0, -0.005, 0]}>
          <sphereGeometry args={[0.006, 12, 12]} />
          <meshStandardMaterial color={sampleColour} roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

// ─── Flame test scene ─────────────────────────────────────────────────────
function FlameScene({ assembly, sample, holding, showLabels }) {
  return (
    <>
      <Bench />
      <PlaceableGroup placed={assembly.bunsen} fromOffset={[-0.5, 0.5, 0]}>
        <group position={[0, 0.105, 0]}>
          <Bunsen flameOn={assembly.bunsen && !holding} />
          {assembly.bunsen && holding && sample && <ColouredFlame colour={sample.colour} />}
          <PieceLabel position={[0, 0.1, 0]} offset={[-0.18, 0, 0]} text="Bunsen burner" show={showLabels} />
          {assembly.bunsen && holding && sample && (
            <PieceLabel position={[0, 0.42, 0]} offset={[0.22, 0, 0]} text={`${sample.flameName} flame`} show={showLabels} color="blue" />
          )}
        </group>
      </PlaceableGroup>
      {/* Hand-held nichrome wire */}
      {assembly.wire && sample && (
        <NichromeWire inFlame={holding} sampleColour={sample.colour} />
      )}
    </>
  );
}

// ─── Gas test scene ───────────────────────────────────────────────────────
function GasScene({ gas, testId, result, showLabels }) {
  // For limewater: show a tube of limewater going milky if positive
  return (
    <>
      <Bench />
      <group position={[0, 0.105, 0]}>
        <GasJar position={[-0.15, 0.09, 0]} gasTint={gas?.jarTint || '#f4f7fa'} showCover={!testId} />
        <PieceLabel position={[-0.15, 0.18, 0]} offset={[-0.18, 0, 0]} text="Gas jar (unknown gas)" show={showLabels} />
        {testId === 'limewater' && (
          <>
            <group position={[0.1, 0, 0]}>
              <TestTube height={0.25} radius={0.045}>
                <TubeLiquid level={0.5} tubeHeight={0.25} tubeRadius={0.045} color={result?.positive ? '#f0eee8' : '#e8f4ff'} />
              </TestTube>
              <PieceLabel position={[0, 0.15, 0]} offset={[0.18, 0, 0]} text="Limewater" show={showLabels} color="blue" />
            </group>
          </>
        )}
        {(testId === 'redLitmus' || testId === 'blueLitmus') && (
          <group position={[0.05, 0.18, 0]}>
            <mesh>
              <planeGeometry args={[0.04, 0.06]} />
              <meshStandardMaterial color={
                testId === 'redLitmus'
                  ? (result?.positive ? '#3a55a0' : '#c84545')
                  : (result?.positive ? '#f8f8f0' : '#3a55a0')
              } side={2} />
            </mesh>
            <PieceLabel position={[0, 0, 0]} offset={[0.18, 0, 0]} text="Litmus paper" show={showLabels} color="green" />
          </group>
        )}
        {(testId === 'lighted' || testId === 'glowing') && (
          <group position={[0.05, 0.18, 0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.005, 0.1, 0.005]} />
              <meshStandardMaterial color="#a06a36" roughness={0.7} />
            </mesh>
            {testId === 'glowing' && (
              <mesh position={[0.02, 0.05, 0]}>
                <sphereGeometry args={[0.008, 12, 12]} />
                <meshBasicMaterial color={result?.positive ? '#ff8800' : '#666'} />
              </mesh>
            )}
            {testId === 'lighted' && (
              <Flame on position={[0.02, 0.05, 0]} scale={0.5} />
            )}
            <PieceLabel position={[0, 0.04, 0]} offset={[0.18, 0, 0]} text={testId === 'lighted' ? 'Lighted splint' : 'Glowing splint'} show={showLabels} color="green" />
          </group>
        )}
      </group>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
const TRIALS = 3;

export default function FlameAndGasTestsLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | flame-assemble | flame | flame-guess | flame-result | gas-pick-test | gas-result | end
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const [assembly, setAssembly] = useState({ bunsen: false, wire: false });
  const [assemblyStep, setAssemblyStep] = useState(0);

  // Flame phase
  const [flameTrials, setFlameTrials] = useState([]); // [{actual, guess, correct}]
  const [flameSample, setFlameSample] = useState(null);
  const [holding, setHolding] = useState(false);
  const [flameGuess, setFlameGuess] = useState(null);

  // Gas phase
  const [gasTrials, setGasTrials] = useState([]); // [{actual, guess, correct}]
  const [gasIndex, setGasIndex] = useState(0);
  const [currentGas, setCurrentGas] = useState(null);
  const [testRunning, setTestRunning] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [gasGuess, setGasGuess] = useState(null);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'bunsen', label: 'Place the Bunsen burner', hint: 'A clean, blue, non-luminous flame is needed for flame tests.', set: { bunsen: true } },
    { id: 'wire',   label: 'Take the nichrome wire', hint: 'A loop of nichrome wire on a glass handle — dip it in the sample, then hold in the flame.', set: { wire: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('flame-assemble'); };
  const doAssembly = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) {
      setTimeout(() => startFlameTrial(), 800);
    } else {
      setAssemblyStep(assemblyStep + 1);
    }
  };

  const startFlameTrial = () => {
    const sample = FLAME_SAMPLES[Math.floor(Math.random() * FLAME_SAMPLES.length)];
    setFlameSample(sample);
    setFlameGuess(null);
    setHolding(false);
    setPhase('flame');
  };

  const dipAndHold = () => {
    setHolding(true);
    Sound.bunsenOn();
    setTimeout(() => Sound.whoosh(), 200);
    setTimeout(() => { setPhase('flame-guess'); Sound.bunsenOff(); }, 2500);
  };

  const submitFlameGuess = (id) => {
    setFlameGuess(id);
    const correct = id === flameSample.cation;
    if (correct) Sound.chime(); else Sound.buzz();
    setFlameTrials((t) => [...t, { actual: flameSample.cation, guess: id, correct }]);
    setTimeout(() => setPhase('flame-result'), 600);
  };

  const nextFlame = () => {
    if (flameTrials.length >= TRIALS) {
      // Move to gas tests
      setGasIndex(0);
      pickGas(0);
    } else {
      startFlameTrial();
    }
  };

  const pickGas = (idx) => {
    const gas = GASES[idx % GASES.length];
    setCurrentGas(gas);
    setTestRunning(null);
    setTestResult(null);
    setGasGuess(null);
    setPhase('gas-pick-test');
  };

  const runGasTest = (testId) => {
    const result = TEST_RESULT(currentGas.id, testId);
    setTestRunning(testId);
    setTestResult(result);
    if (result.positive) Sound.chime();
  };

  const submitGasGuess = (id) => {
    setGasGuess(id);
    const correct = id === currentGas.id;
    if (correct) Sound.chime(); else Sound.buzz();
    setGasTrials((t) => [...t, { actual: currentGas.id, guess: id, correct }]);
    setTimeout(() => setPhase('gas-result'), 600);
  };

  const nextGas = () => {
    if (gasIndex + 1 >= TRIALS) {
      setPhase('end');
    } else {
      pickGas(gasIndex + 1);
      setGasIndex(gasIndex + 1);
    }
  };

  const reset = () => window.location.reload();

  const flameScore = flameTrials.filter((t) => t.correct).length;
  const gasScore = gasTrials.filter((t) => t.correct).length;

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Flame & Gas Tests · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 0.8, 1.4]} orbitTarget={[0, 0.4, 0]}>
        {phase.startsWith('flame') || phase === 'flame-assemble'
          ? <FlameScene assembly={assembly} sample={flameSample} holding={holding} showLabels={showLabels} />
          : phase.startsWith('gas') || phase === 'end'
          ? <GasScene gas={currentGas} testId={testRunning} result={testResult} showLabels={showLabels} />
          : <Bench />}
      </LabScene>

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Flame Tests & Gas Tests</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Two-part practical. First identify 3 unknown metal cations from flame colours. Then identify 3 unknown gases by picking the right chemical test.
            </p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start building the apparatus
            </button>
          </div>
        </div>
      )}

      {phase === 'flame-assemble' && (() => {
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

      {phase === 'flame' && flameSample && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Flame trial {flameTrials.length + 1} of {TRIALS}</div>
          <div className="text-base font-semibold text-stone-800 mt-1">Unknown sample — what cation is it?</div>
          <div className="text-sm text-stone-600 mt-1">Dip the nichrome wire in the sample and hold it in the flame.</div>
          <button onClick={dipAndHold} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <FlameIcon size={16} /> Hold sample in flame
          </button>
        </div>
      )}

      {phase === 'flame-guess' && flameSample && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">You saw a <strong>{flameSample.flameName}</strong> flame</div>
          <div className="text-base font-semibold text-stone-800 mt-1 mb-2">Which cation is it?</div>
          <div className="grid grid-cols-1 gap-1.5">
            {FLAME_SAMPLES.map((s) => (
              <button key={s.cation} onClick={() => submitFlameGuess(s.cation)} className="px-3 py-2 bg-stone-100 hover:bg-blue-100 text-stone-700 rounded-lg text-sm text-left">
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'flame-result' && (() => {
        const t = flameTrials[flameTrials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="flex items-center gap-2">
              {t.correct ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-500" />}
              <div className="font-semibold text-stone-800">
                Actual: <strong>{t.actual}</strong> · Your guess: <strong>{t.guess}</strong>
              </div>
            </div>
            <button onClick={nextFlame} className="mt-3 w-full px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm">
              {flameTrials.length >= TRIALS ? 'Continue to gas tests' : 'Next flame trial'} <ChevronRight size={14} className="inline" />
            </button>
          </div>
        );
      })()}

      {phase === 'gas-pick-test' && currentGas && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Gas trial {gasIndex + 1} of {TRIALS}</div>
          <div className="text-base font-semibold text-stone-800 mt-1 mb-2">Pick a test to identify the gas:</div>
          <div className="grid grid-cols-1 gap-1.5">
            {GAS_TESTS.map((t) => (
              <button key={t.id} onClick={() => runGasTest(t.id)} disabled={testRunning} className={`px-3 py-2 rounded-lg text-sm text-left ${testRunning === t.id ? 'bg-blue-600 text-white' : testRunning ? 'bg-stone-100 text-stone-400' : 'bg-stone-100 hover:bg-blue-100 text-stone-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {testResult && (
            <>
              <div className={`mt-3 p-3 rounded-lg ${testResult.positive ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-700'} text-sm`}>
                {testResult.text}
              </div>
              <div className="mt-2 text-xs text-stone-500">Now identify the gas:</div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {GASES.map((g) => (
                  <button key={g.id} onClick={() => submitGasGuess(g.id)} className="px-2 py-1.5 bg-stone-100 hover:bg-blue-100 text-stone-700 rounded text-xs">
                    {g.id}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'gas-result' && (() => {
        const t = gasTrials[gasTrials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="flex items-center gap-2">
              {t.correct ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-500" />}
              <div className="font-semibold text-stone-800">Actual: <strong>{t.actual}</strong> · Your guess: <strong>{t.guess}</strong></div>
            </div>
            <button onClick={nextGas} className="mt-3 w-full px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm">
              {gasIndex + 1 >= TRIALS ? 'See final score' : 'Next gas trial'} <ChevronRight size={14} className="inline" />
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
            <h2 className="text-2xl font-bold text-stone-800 mt-1">Flame: {flameScore}/{TRIALS} · Gas: {gasScore}/{TRIALS}</h2>
            <button onClick={reset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
              <RotateCcw size={16} /> Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
