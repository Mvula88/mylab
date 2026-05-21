'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, RotateCcw, Check, X, ChevronRight, Tag, Play } from 'lucide-react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { LabScene, Bench, Sound } from './lab';

// ============================================================================
// REFRACTION OF LIGHT — NSSCO Physics
// Shine a ray box at a glass block at varying angles. Measure angle of
// refraction. Plot sin i vs sin r → straight line through origin, gradient = n.
// ============================================================================

const N_GLASS = 1.52;
const ANGLE_OPTIONS = [10, 20, 30, 40, 50, 60, 70];

const refractAngle = (i) => Math.asin(Math.sin(i * Math.PI / 180) / N_GLASS) * 180 / Math.PI;

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

// Glass block — rectangular slab, sitting flat on the bench. Top face at y=0.12.
function GlassBlock() {
  return (
    <group position={[0, 0.115, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.018, 0.2]} />
        <meshPhysicalMaterial color="#a8d4f5" transparent opacity={0.35} transmission={0.7} thickness={0.05} roughness={0.05} ior={1.45} />
      </mesh>
      {/* Outline edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.35, 0.018, 0.2)]} />
        <lineBasicMaterial color="#5588aa" />
      </lineSegments>
    </group>
  );
}

// Ray box on a swivel — adjustable angle
function RayBox({ angle, position = [0, 0, 0] }) {
  return (
    <group position={position} rotation={[0, angle * Math.PI / 180, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.07, 0.045, 0.1]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Aperture */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.01, 0.025]} />
        <meshBasicMaterial color="#ffe66a" />
      </mesh>
    </group>
  );
}

// Light beam — a thin cylinder from `from` to `to` (3D world positions)
function Beam({ from, to, color = '#ffd35a', radius = 0.003 }) {
  const direction = new THREE.Vector3().subVectors(new THREE.Vector3(...to), new THREE.Vector3(...from));
  const length = direction.length();
  const mid = new THREE.Vector3().addVectors(new THREE.Vector3(...from), new THREE.Vector3(...to)).multiplyScalar(0.5);
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
  const euler = new THREE.Euler().setFromQuaternion(quat);
  return (
    <mesh position={mid.toArray()} rotation={euler.toArray()}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.92} />
    </mesh>
  );
}

// Normal line — dashed vertical (rendered as a thin black cylinder for simplicity)
function NormalLine({ at = [0, 0, 0] }) {
  return (
    <mesh position={[at[0], at[1] + 0.12, at[2]]}>
      <cylinderGeometry args={[0.0008, 0.0008, 0.24, 8]} />
      <meshBasicMaterial color="#444" transparent opacity={0.6} />
    </mesh>
  );
}

function Scene({ assembly, angleDeg, showRay, showLabels }) {
  // Geometry: light enters at the +z face of the block at point (0, 0.124, 0.1).
  // The "incoming beam" is in air, makes angle i with the normal (the y-axis at that point).
  // The "refracted beam" is inside the block, makes angle r with the normal.
  // For simplicity we render the rays in the XZ plane (camera looks down at the block).
  const i = angleDeg * Math.PI / 180;
  const r = refractAngle(angleDeg) * Math.PI / 180;
  const entryPt = [0, 0.125, 0.1];
  // Incoming ray: starts above-back of the box (camera-side), comes in at angle i to the +z axis (the normal)
  const rayLen = 0.5;
  const inStart = [
    entryPt[0] - Math.sin(i) * rayLen,
    entryPt[1],
    entryPt[2] + Math.cos(i) * rayLen,
  ];
  // Refracted ray: from entry to exit (back of block 0.2 thick → exit at z=-0.1)
  const exitPt = [
    entryPt[0] + Math.sin(r) * 0.2 / Math.cos(r),
    entryPt[1],
    -0.1,
  ];
  // Emerging ray: from exit, parallel to incoming (Snell: same angle out)
  const outEnd = [
    exitPt[0] + Math.sin(i) * rayLen,
    entryPt[1],
    exitPt[2] - Math.cos(i) * rayLen,
  ];

  return (
    <>
      <Bench />
      {assembly.block && (
        <PlaceableGroup placed fromOffset={[0, 0.5, 0.3]}>
          <group>
            <GlassBlock />
            <PieceLabel position={[0, 0.13, 0]} offset={[0.22, 0, 0]} text="Glass block (rectangular)" show={showLabels} />
          </group>
        </PlaceableGroup>
      )}
      {assembly.ray && (
        <PlaceableGroup placed fromOffset={[0, 0.4, 0.5]}>
          <group position={inStart}>
            <RayBox angle={angleDeg} />
            <PieceLabel position={[0, 0.03, 0]} offset={[-0.18, 0, 0]} text="Ray box" show={showLabels} color="blue" />
          </group>
        </PlaceableGroup>
      )}
      {assembly.block && assembly.ray && showRay && (
        <>
          <Beam from={inStart} to={entryPt} color="#ffe66a" />
          <Beam from={entryPt} to={exitPt} color="#ffd35a" />
          <Beam from={exitPt} to={outEnd} color="#ffe66a" />
          <NormalLine at={entryPt} />
          <PieceLabel position={entryPt} offset={[-0.06, 0.08, 0.08]} text={`i = ${angleDeg}°`} show={showLabels} color="green" />
          <PieceLabel position={[entryPt[0], entryPt[1], entryPt[2] - 0.05]} offset={[0.08, 0.04, 0]} text={`r = ${refractAngle(angleDeg).toFixed(1)}°`} show={showLabels} color="green" />
        </>
      )}
    </>
  );
}

export default function RefractionLabR3F() {
  const [phase, setPhase] = useState('intro'); // intro | assemble | ready | running | between | results
  const [muted, setMuted] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [assembly, setAssembly] = useState({ block: false, ray: false });
  const [assemblyStep, setAssemblyStep] = useState(0);

  const [angleDeg, setAngleDeg] = useState(20);
  const [trials, setTrials] = useState([]);
  const [showRay, setShowRay] = useState(false);

  useEffect(() => Sound.setMuted(muted), [muted]);

  const ASSEMBLY_STEPS = [
    { id: 'block', label: 'Place the glass block on the paper', hint: 'Trace its outline so you can find the exit ray afterwards.', set: { block: true } },
    { id: 'ray',   label: 'Position the ray box',                hint: 'A box that produces a single narrow beam of light, aimed at the long face of the block.', set: { ray: true } },
  ];

  const begin = async () => { await Sound.ready(); setPhase('assemble'); };
  const doAssembly = () => {
    const s = ASSEMBLY_STEPS[assemblyStep];
    setAssembly((p) => ({ ...p, ...s.set }));
    if (assemblyStep + 1 >= ASSEMBLY_STEPS.length) setTimeout(() => setPhase('ready'), 800);
    else setAssemblyStep(assemblyStep + 1);
  };

  const triedAngles = new Set(trials.map((t) => t.i));

  const runTrial = () => {
    setShowRay(true);
    Sound.click();
    setTimeout(() => {
      const r = refractAngle(angleDeg) + (Math.random() - 0.5) * 0.6; // small measurement noise
      setTrials((t) => [...t, { i: angleDeg, r, sinI: Math.sin(angleDeg * Math.PI / 180), sinR: Math.sin(r * Math.PI / 180) }]);
      setPhase('between');
      Sound.chime();
    }, 1500);
  };

  const nextTrial = () => {
    setShowRay(false);
    setPhase('ready');
  };
  const finishLab = () => { setShowRay(false); setPhase('results'); };
  const reset = () => window.location.reload();

  // Best-fit: sin i = n × sin r → slope = n
  const computed = useMemo(() => {
    if (trials.length < 2) return null;
    const sx2 = trials.reduce((s, t) => s + t.sinR * t.sinR, 0);
    const sxy = trials.reduce((s, t) => s + t.sinR * t.sinI, 0);
    const n = sxy / sx2;
    return { n, error: Math.abs(n - N_GLASS) };
  }, [trials]);

  return (
    <div className="fixed inset-0 bg-stone-100">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 bg-white/85 backdrop-blur border-b">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-stone-900">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="text-sm font-semibold text-stone-800">Refraction of Light · NSSCO Physics</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${showLabels ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'}`}>
            <Tag size={14} className={showLabels ? '' : 'opacity-40'} /> Labels
          </button>
          <button onClick={() => setMuted(!muted)} className="text-stone-600 hover:text-stone-900 p-1">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <LabScene cameraPosition={[0, 1.0, 0.1]} orbitTarget={[0, 0.13, 0]}>
        <Scene assembly={assembly} angleDeg={angleDeg} showRay={showRay} showLabels={showLabels} />
      </LabScene>

      {phase === 'intro' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md">
            <div className="text-xs text-emerald-600 uppercase tracking-wider font-semibold">NSSCO Physics</div>
            <h1 className="text-2xl font-bold text-stone-800 mt-1">Refraction of Light</h1>
            <p className="text-stone-600 mt-3 text-sm leading-relaxed">
              Aim a light ray at a glass block at different angles. Measure how much it bends, then use sin i / sin r to find the refractive index n.
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
            <button onClick={doAssembly} className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              {s.label}
            </button>
          </div>
        );
      })()}

      {phase === 'ready' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl max-w-md">
          <div className="text-xs text-stone-500 uppercase tracking-wide">Trial {trials.length + 1}</div>
          <div className="text-base font-semibold text-stone-800 mt-1">Choose angle of incidence (i)</div>
          <div className="grid grid-cols-7 gap-1 mt-2">
            {ANGLE_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => setAngleDeg(a)}
                disabled={triedAngles.has(a)}
                className={`px-1 py-2 rounded text-xs font-mono ${
                  triedAngles.has(a) ? 'bg-emerald-100 text-emerald-700' : angleDeg === a ? 'bg-blue-600 text-white' : 'bg-stone-100 hover:bg-blue-100 text-stone-700'
                }`}
              >
                {a}°
              </button>
            ))}
          </div>
          <button onClick={runTrial} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
            <Play size={16} /> Switch on the ray box
          </button>
          {trials.length >= 3 && (
            <button onClick={finishLab} className="mt-2 w-full px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm">
              Finish & calculate n →
            </button>
          )}
        </div>
      )}

      {phase === 'between' && (() => {
        const t = trials[trials.length - 1];
        return (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-2xl max-w-md w-[95%]">
            <div className="text-xs text-stone-500 uppercase tracking-wide">Trial recorded</div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
              <div><div className="text-xs text-stone-500">i</div><div className="font-mono font-bold">{t.i}°</div></div>
              <div><div className="text-xs text-stone-500">r</div><div className="font-mono font-bold">{t.r.toFixed(1)}°</div></div>
              <div><div className="text-xs text-stone-500">sin i</div><div className="font-mono font-bold">{t.sinI.toFixed(3)}</div></div>
              <div><div className="text-xs text-stone-500">sin r</div><div className="font-mono font-bold">{t.sinR.toFixed(3)}</div></div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={nextTrial} disabled={triedAngles.size >= ANGLE_OPTIONS.length} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 text-white rounded-lg text-sm">
                Another angle <ChevronRight size={14} className="inline" />
              </button>
              <button onClick={finishLab} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
                <Trophy size={14} className="inline mr-1" /> Calculate n
              </button>
            </div>
          </div>
        );
      })()}

      {phase === 'results' && (
        <Results trials={trials} computed={computed} onReset={reset} />
      )}
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
        <h2 className="text-2xl font-bold text-stone-800 mt-1">sin i vs sin r</h2>
        <svg viewBox="0 0 300 200" className="w-full mt-2">
          <line x1="40" y1="180" x2="290" y2="180" stroke="#888" strokeWidth="1" />
          <line x1="40" y1="180" x2="40" y2="20" stroke="#888" strokeWidth="1" />
          <text x="160" y="195" textAnchor="middle" fontSize="9" fill="#666">sin r</text>
          <text x="10" y="100" textAnchor="middle" fontSize="9" fill="#666" transform="rotate(-90 10 100)">sin i</text>
          {trials.map((t, i) => (
            <circle key={i} cx={40 + t.sinR * 350} cy={180 - t.sinI * 200} r="4" fill="#10b981" />
          ))}
          {computed && (
            <line x1="40" y1="180" x2={40 + 0.8 * 350} y2={180 - computed.n * 0.8 * 200} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" />
          )}
        </svg>
        <table className="w-full mt-3 text-sm">
          <thead className="text-stone-500 text-xs uppercase border-b">
            <tr><th className="text-left py-1">i</th><th className="text-right py-1">r</th><th className="text-right py-1">sin i</th><th className="text-right py-1">sin r</th></tr>
          </thead>
          <tbody>
            {trials.map((t, i) => (
              <tr key={i} className="border-b border-stone-100">
                <td className="py-1 font-mono">{t.i}°</td>
                <td className="py-1 text-right font-mono">{t.r.toFixed(1)}°</td>
                <td className="py-1 text-right font-mono">{t.sinI.toFixed(3)}</td>
                <td className="py-1 text-right font-mono">{t.sinR.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {computed && (
          <div className="mt-3 p-3 rounded-lg bg-stone-50 text-sm font-mono">
            <div>Best-fit slope (sin i / sin r) = <strong className="text-emerald-700">n = {computed.n.toFixed(2)}</strong></div>
            <div className="text-stone-500 text-xs">True n(glass) ≈ {N_GLASS} · Error: {computed.error.toFixed(2)}</div>
            {computed.error < 0.05 ? (
              <div className="text-emerald-700 font-semibold flex items-center gap-1 mt-1"><Check size={14} /> Within 3% of accepted</div>
            ) : (
              <div className="text-amber-700 font-semibold mt-1">Outside 3% — try more angles</div>
            )}
          </div>
        )}
        <button onClick={onReset} className="mt-4 w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
          <RotateCcw size={16} /> New session
        </button>
      </div>
    </div>
  );
}
