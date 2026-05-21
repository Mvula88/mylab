'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Eye, EyeOff, Tag, Droplet, Square, Play } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  LabScene, Bench, RetortStand, BossClamp, Burette, ConicalFlask,
  Sound, useAnimatedColor, useAnimatedValue,
  WaterStream, FallingDrop,
} from './lab';

// ============================================================================
// TITRATION — NSSCO Chemistry, full assembly experience.
// The student BUILDS the apparatus piece by piece (learning the names of
// each part), then operates it with simple buttons. Labels can be shown
// at any time via the "Show labels" toggle.
// ============================================================================

const NAOH_CONC = 0.100;
const ACID_VOL_ML = 25.0;
const BURETTE_CAPACITY_ML = 50.0;

function pinkness(addedMl, equivMl) {
  return 1 / (1 + Math.exp(-(addedMl - equivMl) * 18 / 0.5));
}
function mix(a, b, t) {
  const p = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });
  const A = p(a), B = p(b);
  const ch = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${ch(A.r, B.r)}${ch(A.g, B.g)}${ch(A.b, B.b)}`;
}

const FLASK_CLEAR = '#f6f8ff';
const FLASK_PINK = '#e63a82';
const NAOH_COLOUR = '#1e88e5';

// ─── Floating label ──────────────────────────────────────────────────────
// Always faces camera; thin line connects to the apparatus piece.
function PieceLabel({ position = [0, 0, 0], offset = [0.2, 0.08, 0], text, show = true, color = 'amber' }) {
  if (!show) return null;
  const colorClass = {
    amber: 'bg-amber-100 border-amber-400 text-amber-900',
    blue:  'bg-blue-100 border-blue-400 text-blue-900',
    green: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  }[color] || '';
  return (
    <group position={position}>
      <Html
        position={offset}
        center
        distanceFactor={2.5}
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        <div className={`${colorClass} text-xs font-semibold px-2 py-1 rounded border shadow-sm`}>
          {text}
        </div>
      </Html>
    </group>
  );
}

// ─── Assembly animator ───────────────────────────────────────────────────
// Renders a child group that animates from a starting offset down to its
// final position when `placed` becomes true. Triggers a click sound on land.
function PlaceableGroup({ placed, fromOffset = [0, 0.6, 0], children, onLanded }) {
  const groupRef = useRef();
  const [progress, setProgress] = useState(placed ? 1 : 0);
  const startedRef = useRef(false);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (placed && progress < 1) {
      const next = Math.min(1, progress + delta * 1.4);
      setProgress(next);
      const eased = 1 - Math.pow(1 - next, 3);
      groupRef.current.position.set(
        fromOffset[0] * (1 - eased),
        fromOffset[1] * (1 - eased),
        fromOffset[2] * (1 - eased),
      );
      if (next >= 1 && !startedRef.current) {
        startedRef.current = true;
        Sound.click();
        if (onLanded) onLanded();
      }
    } else if (placed) {
      groupRef.current.position.set(0, 0, 0);
    }
  });
  if (!placed) return null;
  return <group ref={groupRef} position={fromOffset}>{children}</group>;
}

// ─── Swirl wrapper ───────────────────────────────────────────────────────
function SwirlingFlask({ swirl, children }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    if (swirl > 0) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.z = Math.sin(t * 12) * 0.12 * swirl;
    } else {
      ref.current.rotation.z *= 0.9;
    }
  });
  return <group ref={ref}>{children}</group>;
}

// ─── Scene ───────────────────────────────────────────────────────────────
function TitrationScene({
  assembly, addedMl, equivMl, stopcockAngle, swirl, showLabels, tapOpen, recentDropId,
}) {
  const buretteFill = 1 - addedMl / BURETTE_CAPACITY_ML;
  const flaskPink = pinkness(addedMl, equivMl);
  const flaskColour = mix(FLASK_CLEAR, FLASK_PINK, Math.min(1, flaskPink * 1.1));
  const animFlaskColour = useAnimatedColor(flaskColour, 0.4);
  const animBuretteFill = useAnimatedValue(buretteFill, 0.2);
  const flaskLevel = Math.min(0.95, 0.4 + addedMl / 100);
  const animFlaskLevel = useAnimatedValue(flaskLevel, 0.3);
  const animStopcock = useAnimatedValue(stopcockAngle, 0.2);

  return (
    <>
      <Bench />

      {/* Retort stand */}
      <PlaceableGroup placed={assembly.stand} fromOffset={[-0.4, 0.6, 0.4]}>
        <RetortStand position={[0.18, 0.105, 0]} rodHeight={1.0}>
          {/* Clamp (placed separately) */}
          {assembly.clamp && (
            <PlaceableGroup placed fromOffset={[0.4, 0.3, 0.3]}>
              <BossClamp position={[0, 0.85, 0]} ringRadius={0.022} />
            </PlaceableGroup>
          )}
        </RetortStand>
        <PieceLabel position={[0.06, 0.5, 0]} offset={[0.22, 0, 0]} text="Retort stand" show={showLabels} />
        {assembly.clamp && (
          <PieceLabel position={[0.1, 0.96, 0]} offset={[0.22, 0, 0]} text="Boss clamp" show={showLabels} color="blue" />
        )}
      </PlaceableGroup>

      {/* Burette */}
      {assembly.burette && (
        <PlaceableGroup placed fromOffset={[0, 0.5, 0]}>
          <group position={[0.1, 0.45, 0]}>
            <Burette
              length={0.7}
              liquidLevel={assembly.naohPoured ? animBuretteFill : 0}
              liquidColor={NAOH_COLOUR}
              stopcockAngle={animStopcock}
            />
            <PieceLabel position={[0, 0.4, 0]} offset={[-0.22, 0, 0]} text="Burette (50 cm³)" show={showLabels} />
            <PieceLabel position={[0, 0.05, 0]} offset={[0.22, 0, 0]} text="Stopcock (tap)" show={showLabels} color="blue" />
          </group>
        </PlaceableGroup>
      )}

      {/* Conical flask */}
      {assembly.flask && (
        <PlaceableGroup placed fromOffset={[0.5, 0.3, 0.3]}>
          <group position={[0.1, 0.105, 0]}>
            <SwirlingFlask swirl={swirl}>
              <ConicalFlask
                liquidLevel={assembly.acidPoured ? animFlaskLevel : 0}
                liquidColor={animFlaskColour}
              />
            </SwirlingFlask>
            <PieceLabel position={[0, 0.15, 0]} offset={[0.22, 0, 0]} text="Conical flask (250 cm³)" show={showLabels} />
          </group>
        </PlaceableGroup>
      )}

      {/* Visible water flow from burette tip into flask */}
      {assembly.burette && assembly.flask && assembly.naohPoured && (
        <>
          {/* Continuous stream when tap is fully open */}
          <WaterStream
            from={[0.1, 0.462, 0]}
            to={[0.1, 0.105 + animFlaskLevel * 0.14 + 0.005, 0]}
            color={NAOH_COLOUR}
            on={tapOpen}
            radius={0.0035}
          />
          {/* Single drop animation when "Add 1 drop" is tapped */}
          {recentDropId !== null && (
            <FallingDrop
              key={recentDropId}
              from={[0.1, 0.462, 0]}
              to={[0.1, 0.105 + animFlaskLevel * 0.14 + 0.005, 0]}
              duration={0.45}
              color={NAOH_COLOUR}
              radius={0.01}
            />
          )}
        </>
      )}

      {/* White tile under the flask */}
      {assembly.tile && (
        <PieceLabel position={[0.1, 0.11, 0]} offset={[0, -0.05, 0.3]} text="White tile (to see colour)" show={showLabels} color="green" />
      )}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────
export default function TitrationLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | titrate | finished | results
  const [step, setStep] = useState(0);
  const [assembly, setAssembly] = useState({
    tile: true,    // white tile always there
    stand: false,
    clamp: false,
    burette: false,
    naohPoured: false,
    flask: false,
    acidPoured: false,
  });

  const [addedMl, setAddedMl] = useState(0);
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [stopcockAngle, setStopcockAngle] = useState(0);
  const [tapOpen, setTapOpen] = useState(false);
  const [swirl, setSwirl] = useState(0);
  const [recentDropId, setRecentDropId] = useState(null);

  const trueAcidM = useMemo(() => 0.080 + Math.random() * 0.040, []);
  const equivMl = useMemo(() => (trueAcidM * ACID_VOL_ML) / NAOH_CONC, [trueAcidM]);
  const streamingRef = useRef(false);

  useEffect(() => Sound.setMuted(muted), [muted]);

  // Continuous flow when tap is open
  useEffect(() => {
    if (!tapOpen) {
      setStopcockAngle(0);
      if (streamingRef.current) {
        Sound.streamOff();
        streamingRef.current = false;
      }
      return;
    }
    setStopcockAngle(Math.PI / 2);
    if (!streamingRef.current) {
      Sound.streamOn();
      streamingRef.current = true;
    }
    const interval = setInterval(() => {
      setAddedMl((v) => Math.min(BURETTE_CAPACITY_ML, v + 0.15));
    }, 100);
    return () => clearInterval(interval);
  }, [tapOpen]);

  // Swirl decay
  useEffect(() => {
    if (swirl <= 0) return;
    const t = setTimeout(() => setSwirl(Math.max(0, swirl - 0.1)), 100);
    return () => clearTimeout(t);
  }, [swirl]);

  const begin = async () => {
    await Sound.ready();
    setPhase('assemble');
    setStep(0);
  };

  // Ordered assembly steps with friendly labels
  const ASSEMBLY_STEPS = [
    { id: 'stand',       label: 'Place the retort stand',  hint: 'The metal stand holds everything upright.', set: { stand: true } },
    { id: 'clamp',       label: 'Attach the boss clamp',   hint: 'Clamp goes on the rod — it will hold the burette.', set: { clamp: true } },
    { id: 'burette',     label: 'Insert the burette',      hint: 'A long graduated tube with a tap at the bottom. Reads 0–50 cm³.', set: { burette: true } },
    { id: 'naohPoured',  label: 'Fill burette with NaOH',  hint: 'You\'ll pour the alkali solution (0.100 mol/dm³) into the top.', set: { naohPoured: true }, sound: 'pour' },
    { id: 'flask',       label: 'Place the conical flask', hint: 'Erlenmeyer shape — its narrow neck stops splashes.', set: { flask: true } },
    { id: 'acidPoured',  label: 'Add HCl + indicator',     hint: '25 cm³ of unknown HCl plus 3 drops of phenolphthalein.', set: { acidPoured: true }, sound: 'pour' },
  ];

  const doStep = async () => {
    const s = ASSEMBLY_STEPS[step];
    setAssembly((prev) => ({ ...prev, ...s.set }));
    if (s.sound === 'pour') Sound.pour();
    if (step + 1 >= ASSEMBLY_STEPS.length) {
      setTimeout(() => setPhase('titrate'), 900);
    } else {
      setStep(step + 1);
    }
  };

  const dropOnce = () => {
    setAddedMl((v) => Math.min(BURETTE_CAPACITY_ML, v + 0.05));
    Sound.drop();
    // Spawn a fresh falling-drop animation
    setRecentDropId(Date.now());
    setTimeout(() => setRecentDropId(null), 500);
  };
  const toggleTap = () => setTapOpen((o) => !o);
  const swirlFlask = () => { setSwirl(1); Sound.swirl(); };

  const recordTrial = () => {
    setTapOpen(false);
    const trial = {
      id: trials.length + 1,
      addedMl,
      computedM: (NAOH_CONC * addedMl) / ACID_VOL_ML,
      error: Math.abs(addedMl - equivMl),
      accurate: Math.abs(addedMl - equivMl) <= 0.5,
    };
    setTrials((t) => [...t, trial]);
    setPhase('finished');
    Sound.chime();
  };
  const nextTrial = () => {
    setAddedMl(0);
    setPhase('titrate');
  };
  const finishLab = () => setPhase('results');
  const reset = () => window.location.reload();

  const flaskPink = pinkness(addedMl, equivMl);
  const colourLabel =
    flaskPink < 0.1 ? 'Colourless'
      : flaskPink < 0.4 ? 'Faint pink'
        : flaskPink < 0.7 ? 'Pink'
          : flaskPink < 0.92 ? 'Persistent pink — endpoint!'
            : 'Dark pink — overshot';

  return (
    <div className="fixed inset-0 bg-stone-100">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Titration · NSSCO Chemistry</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}
            title="Show / hide apparatus names"
          >
            {showLabels ? <Tag size={14} /> : <Tag size={14} className="opacity-40" />}
            Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* 3D scene */}
      <LabScene cameraPosition={[0.3, 0.85, 1.7]} orbitTarget={[0.1, 0.55, 0]}>
        <TitrationScene
          assembly={assembly}
          addedMl={addedMl}
          equivMl={equivMl}
          stopcockAngle={stopcockAngle}
          swirl={swirl}
          showLabels={showLabels}
          tapOpen={tapOpen}
          recentDropId={recentDropId}
        />
      </LabScene>

      {/* Intro */}
      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Chemistry · Paper 5</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Acid–Base Titration</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              In this practical you will:
            </p>
            <ol className="text-stone-700 mt-2 text-sm list-decimal list-inside space-y-1">
              <li>Build the apparatus yourself, piece by piece</li>
              <li>Learn the name of each part as you place it</li>
              <li>Add NaOH to the HCl until the indicator turns persistent pink</li>
              <li>Calculate the unknown acid concentration</li>
            </ol>
            <p className="text-xs text-stone-500 mt-3">Tip: drag the scene to rotate the camera. Tap the "Labels" button at the top to see what each part is called.</p>
            <button onClick={begin} className="mt-5 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Start building the apparatus
            </button>
          </div>
        </div>
      )}

      {/* Assembly panel */}
      {phase === 'assemble' && (() => {
        const s = ASSEMBLY_STEPS[step];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">
              Step {step + 1} of {ASSEMBLY_STEPS.length}
            </div>
            <div className="text-lg font-bold text-stone-800 mt-0.5">{s.label}</div>
            <div className="text-sm text-stone-600 mt-1">{s.hint}</div>
            <button
              onClick={doStep}
              className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              {s.label}
            </button>
            <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${((step) / ASSEMBLY_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Titration HUD */}
      {phase === 'titrate' && (
        <div className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg w-60 text-sm">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Burette reading</div>
          <div className="text-2xl font-mono font-bold text-stone-800">{addedMl.toFixed(2)} cm³</div>
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border border-stone-400"
              style={{ background: mix(FLASK_CLEAR, FLASK_PINK, Math.min(1, flaskPink * 1.1)) }}
            />
            <div className="text-xs text-stone-700">{colourLabel}</div>
          </div>
          <div className="mt-3 text-xs text-stone-400">Trial {trials.length + 1}</div>
        </div>
      )}

      {/* Titration controls — clear buttons, no drag */}
      {phase === 'titrate' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-3 rounded-2xl shadow-2xl flex flex-wrap gap-2 justify-center max-w-2xl">
          <button
            onClick={dropOnce}
            disabled={tapOpen}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white rounded-lg font-medium"
          >
            <Droplet size={16} /> Add 1 drop
          </button>
          <button
            onClick={toggleTap}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-white ${
              tapOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {tapOpen ? <><Square size={16} /> Close tap</> : <><Play size={16} /> Open tap</>}
          </button>
          <button
            onClick={swirlFlask}
            className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            <RotateCcw size={16} /> Swirl flask
          </button>
          <div className="mx-1 w-px self-stretch bg-stone-200" />
          <button
            onClick={recordTrial}
            disabled={addedMl === 0}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg font-semibold"
          >
            <Check size={16} /> Record titre
          </button>
        </div>
      )}

      {/* Glossary tip — visible only in titrate phase to remind student */}
      {phase === 'titrate' && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg max-w-xs text-xs text-stone-600">
          <div className="font-semibold text-stone-800 mb-1">Quick reference</div>
          <ul className="space-y-0.5">
            <li><strong>Burette:</strong> measures the alkali (NaOH) you add</li>
            <li><strong>Conical flask:</strong> holds the acid (HCl) + indicator</li>
            <li><strong>Stopcock:</strong> the tap you open/close</li>
            <li><strong>Endpoint:</strong> first persistent pink colour</li>
          </ul>
        </div>
      )}

      {/* Finished trial */}
      {phase === 'finished' && (() => {
        const t = trials[trials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Trial {t.id} recorded</div>
            <div className="mt-1 text-sm text-stone-700">
              Titre: <strong>{t.addedMl.toFixed(2)} cm³</strong> · Error: {t.error.toFixed(2)} cm³{' '}
              {t.accurate ? (
                <span className="text-emerald-600 inline-flex items-center"><Check size={14} /> within ±0.5</span>
              ) : (
                <span className="text-amber-600 inline-flex items-center"><X size={14} /> outside tolerance</span>
              )}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-stone-50 text-sm space-y-1 font-mono text-stone-700">
              <div>n(NaOH) = {NAOH_CONC.toFixed(3)} × {t.addedMl.toFixed(2)} ÷ 1000 = {(NAOH_CONC * t.addedMl / 1000).toExponential(3)} mol</div>
              <div>n(HCl) = n(NaOH) (1:1 ratio)</div>
              <div className="text-emerald-700 font-semibold">c(HCl) = {t.computedM.toFixed(4)} mol/dm³</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={nextTrial} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Another trial <ChevronRight size={14} className="inline" />
              </button>
              <button onClick={finishLab} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">
                <Trophy size={14} className="inline mr-1" /> Finish
              </button>
            </div>
          </div>
        );
      })()}

      {phase === 'results' && <Results trials={trials} trueAcidM={trueAcidM} onReset={reset} />}
    </div>
  );
}

function Results({ trials, trueAcidM, onReset }) {
  const mean = trials.reduce((s, t) => s + t.computedM, 0) / trials.length;
  const meanError = Math.abs(mean - trueAcidM);
  const accurate = meanError < 0.005;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={22} />
          <div className="text-xs uppercase tracking-wider font-semibold">Practical complete</div>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mt-1">Your results</h2>
        <table className="w-full mt-4 text-sm">
          <thead className="text-stone-500 text-xs uppercase border-b">
            <tr>
              <th className="text-left py-1">#</th>
              <th className="text-right py-1">Titre (cm³)</th>
              <th className="text-right py-1">c(HCl)</th>
              <th className="text-right py-1"> </th>
            </tr>
          </thead>
          <tbody>
            {trials.map((t) => (
              <tr key={t.id} className="border-b border-stone-100">
                <td className="py-2">#{t.id}</td>
                <td className="py-2 text-right font-mono">{t.addedMl.toFixed(2)}</td>
                <td className="py-2 text-right font-mono">{t.computedM.toFixed(4)}</td>
                <td className="py-2 text-right">{t.accurate ? <Check size={14} className="text-emerald-600 inline" /> : <X size={14} className="text-amber-600 inline" />}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-2">Mean</td>
              <td className="py-2 text-right font-mono">{(trials.reduce((s, t) => s + t.addedMl, 0) / trials.length).toFixed(2)}</td>
              <td className="py-2 text-right font-mono">{mean.toFixed(4)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 p-3 rounded-lg bg-stone-50 text-sm">
          <div className="text-stone-600">True acid: <strong>{trueAcidM.toFixed(4)} mol/dm³</strong></div>
          <div className="text-stone-600">Your mean: <strong>{mean.toFixed(4)} mol/dm³</strong></div>
          <div className={accurate ? 'text-emerald-700 font-semibold mt-1' : 'text-amber-700 font-semibold mt-1'}>
            {accurate ? '✓ Accurate (within 0.005 mol/dm³)' : `Error: ${meanError.toFixed(4)} mol/dm³`}
          </div>
        </div>
        <button onClick={onReset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          <RotateCcw size={16} /> New session
        </button>
      </div>
    </div>
  );
}
