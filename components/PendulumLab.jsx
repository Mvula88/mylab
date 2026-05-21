'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// PENDULUM LAB · v1
// NSSCO Physics Practical — Investigating how the period of a simple pendulum
// depends on its length, and using the result to estimate g.
// T = 2π √(L/g)   ⇒   T² = (4π² / g) · L
// Plot T² vs L → straight line, slope = 4π²/g
// ============================================================================

const g = 9.81; // m/s²

const LENGTH_OPTIONS = [10, 20, 30, 40, 60, 80]; // cm
const OSCILLATIONS_PER_TRIAL = 10;
const TIME_COMPRESSION = 1; // real-time swing, no compression
const INITIAL_ANGLE_DEG = 12;

// Period for a given length (cm). Small-angle approx.
const periodAt = (lengthCm) => 2 * Math.PI * Math.sqrt((lengthCm / 100) / g);

export default function PendulumLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'setup' → 'swinging' → 'finished' → 'results'
  const [phase, setPhase] = useState('intro');
  const [lengthCm, setLengthCm] = useState(40);
  const [oscillations, setOscillations] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds since start
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Animation-loop mirror state
  const swingRef = useRef({
    running: false,
    startTime: 0,
    period: 1,
    lengthM: 0.4,
    oscillationCount: 0,
    lastZeroCross: 0,
    lastDirection: 0, // +1 if angle positive, -1 if negative
    capturedLength: 40,
    capturedPeriod: periodAt(40),
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.85).toDestination();

      const click = new Tone.MetalSynth({
        frequency: 250, envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;

      // Tock for each pendulum extreme (a soft wooden knock)
      const tock = new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 5,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 },
      }).connect(master);
      tock.volume.value = -16;

      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;

      audioRef.current = { initialized: true, master, click, tock, chime };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playTock = (high) => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.tock.triggerAttackRelease(high ? 'C2' : 'A1', '32n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };

  useEffect(() => {
    if (!audioRef.current.initialized) return;
    audioRef.current.master.gain.rampTo(muted ? 0 : 0.85, 0.15);
  }, [muted]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FONTS
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setReadyToInit(true);
    return () => { try { document.head.removeChild(link); } catch (e) {} };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // THREE.JS SCENE
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!readyToInit || !mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e4d8);
    scene.fog = new THREE.Fog(0xe8e4d8, 6, 18);

    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0.3, 1.0, 2.6);
    camera.lookAt(0, 0.55, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ─── Lighting ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff0d4, 0.55));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    // ─── Bench + tile ─────────────────────────────────────────────────────
    const bench = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 6),
      new THREE.MeshStandardMaterial({ color: 0x3d2d1f, roughness: 0.9 })
    );
    bench.rotation.x = -Math.PI / 2;
    bench.receiveShadow = true;
    scene.add(bench);

    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.025, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xf8f5ec, roughness: 0.5 })
    );
    tile.position.y = 0.0125;
    tile.castShadow = true; tile.receiveShadow = true;
    scene.add(tile);

    // ═══ STAND ═══════════════════════════════════════════════════════════
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x383a3e, metalness: 0.7, roughness: 0.35 });

    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.025, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    standBase.position.set(0, 0.0375, -0.3);
    standBase.castShadow = true; standBase.receiveShadow = true;
    scene.add(standBase);

    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 1.1, 12), metalMat
    );
    standRod.position.set(-0.12, 0.6, -0.3);
    standRod.castShadow = true;
    scene.add(standRod);

    const standArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.014, 0.018), metalMat
    );
    standArm.position.set(0.05, 1.04, -0.3);
    standArm.castShadow = true;
    scene.add(standArm);

    // The pivot point at the right end of the arm
    const pivotWorld = new THREE.Vector3(0.18, 1.04, -0.3);

    // ═══ PROTRACTOR (decorative semicircle behind the pivot) ═══════════════
    const protractor = new THREE.Mesh(
      new THREE.RingGeometry(0.07, 0.085, 32, 1, Math.PI, Math.PI),
      new THREE.MeshStandardMaterial({
        color: 0xefd690, roughness: 0.7, side: THREE.DoubleSide,
      })
    );
    protractor.position.copy(pivotWorld);
    protractor.position.z -= 0.01;
    protractor.rotation.y = Math.PI / 2; // Face the camera
    scene.add(protractor);

    // ═══ PENDULUM ═══════════════════════════════════════════════════════════
    // The pendulum is a Group pivoted at pivotWorld. The string + bob hang
    // straight down. We rotate the whole group about its X axis (which here
    // points along world Z) to swing it.
    const pendulum = new THREE.Group();
    pendulum.position.copy(pivotWorld);
    scene.add(pendulum);

    const stringMat = new THREE.MeshStandardMaterial({ color: 0xc4a06a, roughness: 0.85 });
    // The string geometry is built/rebuilt when length changes
    const stringMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.4, 8), stringMat
    );
    stringMesh.position.y = -0.2;
    pendulum.add(stringMesh);

    const bobMat = new THREE.MeshStandardMaterial({
      color: 0x8a4a3a, roughness: 0.4, metalness: 0.55,
    });
    const bob = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 24, 16), bobMat
    );
    bob.position.y = -0.4;
    bob.castShadow = true;
    pendulum.add(bob);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      pendulum, stringMesh, bob,
      pivotWorld,
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.55;
    let azimuth = Math.atan2(camera.position.x, camera.position.z);
    let elevation = Math.atan2(camera.position.y - lookAtY,
                               Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2));
    const radius = Math.sqrt(camera.position.x ** 2 +
                             (camera.position.y - lookAtY) ** 2 +
                             camera.position.z ** 2);
    const onDown = (e) => {
      isDragging = true;
      const pt = e.touches ? e.touches[0] : e;
      prevX = pt.clientX; prevY = pt.clientY;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const dx = pt.clientX - prevX, dy = pt.clientY - prevY;
      prevX = pt.clientX; prevY = pt.clientY;
      azimuth -= dx * 0.008;
      elevation = Math.max(-0.1, Math.min(0.7, elevation + dy * 0.005));
      const r = radius * Math.cos(elevation);
      camera.position.x = Math.sin(azimuth) * r;
      camera.position.z = Math.cos(azimuth) * r;
      camera.position.y = lookAtY + radius * Math.sin(elevation);
      camera.lookAt(0, lookAtY, 0);
    };
    const onUp = () => { isDragging = false; };
    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('touchend', onUp);

    // ═══ ANIMATION LOOP ════════════════════════════════════════════════════
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      const sw = swingRef.current;
      if (sw.running) {
        const t = so.time - sw.startTime;
        const omega = 2 * Math.PI / sw.period;
        const angle = (INITIAL_ANGLE_DEG * Math.PI / 180) * Math.cos(omega * t);
        so.pendulum.rotation.x = angle;
        // Update elapsed
        setElapsedTime(t);

        // Count zero crossings: each half-oscillation when sign of velocity
        // changes through the bottom. We use sign of angle compared to last frame.
        const direction = Math.sign(angle);
        if (direction !== 0 && direction !== sw.lastDirection) {
          if (sw.lastDirection !== 0) {
            // crossed the equilibrium → one half-oscillation
            // (a full oscillation = 2 zero crossings + 2 extrema; let's count
            // by tock at extremes instead)
          }
          sw.lastDirection = direction;
        }
        // Tock at extremes (where angle reaches near ±max)
        const maxAngle = (INITIAL_ANGLE_DEG * Math.PI / 180) * 0.97;
        if (Math.abs(angle) > maxAngle && Math.sign(angle) !== sw.lastExtremeSign) {
          sw.lastExtremeSign = Math.sign(angle);
          playTock(sw.lastExtremeSign > 0);
          sw.oscillationCount += 0.5; // half-oscillation per extreme
          setOscillations(Math.floor(sw.oscillationCount));
        }

        if (sw.oscillationCount >= OSCILLATIONS_PER_TRIAL * 2) {
          // We counted in half-oscillations; reach 2N for N full oscillations.
          sw.running = false;
          // Final period from elapsed
          setTimeout(() => finalizeTrial(t), 100);
        }
      } else {
        // Damped settling toward rest when not running
        if (Math.abs(so.pendulum.rotation.x) > 0.001) {
          so.pendulum.rotation.x *= 0.92;
        }
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      try { if (canvas.parentNode === mount) mount.removeChild(canvas); } catch (e) {}
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToInit]);

  // ─── Re-build the string geometry whenever length changes ───────────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.stringMesh || !so.bob) return;
    const lengthM = lengthCm / 100;
    // String runs from pivot (y=0 in pendulum frame) downward to -lengthM
    so.stringMesh.geometry.dispose();
    so.stringMesh.geometry = new THREE.CylinderGeometry(0.002, 0.002, lengthM, 8);
    so.stringMesh.position.y = -lengthM / 2;
    so.bob.position.y = -lengthM;
  }, [lengthCm]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const startSwing = () => {
    playClick();
    const so = sceneObjects.current;
    const T = periodAt(lengthCm);
    swingRef.current = {
      running: true,
      startTime: so.time,
      period: T,
      lengthM: lengthCm / 100,
      oscillationCount: 0,
      lastDirection: 0,
      lastExtremeSign: 0,
      capturedLength: lengthCm,
      capturedPeriod: T,
    };
    setOscillations(0);
    setElapsedTime(0);
    setPhase('swinging');
  };

  const stopEarly = () => {
    if (swingRef.current.running) {
      swingRef.current.running = false;
      const so = sceneObjects.current;
      const t = so.time - swingRef.current.startTime;
      finalizeTrial(t);
    }
  };

  const finalizeTrial = (elapsed) => {
    const sw = swingRef.current;
    const N = Math.max(1, Math.floor(sw.oscillationCount / 2));
    const measuredPeriod = elapsed / N;
    const rec = {
      length: sw.capturedLength,
      oscillations: N,
      elapsed,
      period: measuredPeriod,
      expectedPeriod: sw.capturedPeriod,
    };
    playChime();
    setTrials(prev => [...prev, rec]);
    setPhase('finished');
  };

  const nextTrial = () => {
    setPhase('setup');
  };

  const showResults = () => {
    setPhase('results');
  };

  // Calculate g from the trials using a linear regression of T² vs L (in m).
  // T² = (4π²/g) · L
  const fitG = () => {
    if (trials.length < 2) return null;
    const xs = trials.map(t => t.length / 100);
    const ys = trials.map(t => t.period * t.period);
    const n = xs.length;
    const xMean = xs.reduce((a, b) => a + b, 0) / n;
    const yMean = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - xMean) * (ys[i] - yMean);
      den += (xs[i] - xMean) ** 2;
    }
    if (den === 0) return null;
    const slope = num / den;
    if (slope <= 0) return null;
    const gEst = 4 * Math.PI * Math.PI / slope;
    return gEst;
  };

  const resetSession = () => {
    setTrials([]);
    setOscillations(0);
    setElapsedTime(0);
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const renderGraph = () => {
    if (trials.length < 2) return null;
    const pts = trials.map(t => ({ x: t.length / 100, y: t.period * t.period }));
    const xMax = Math.max(...pts.map(p => p.x));
    const yMax = Math.max(...pts.map(p => p.y));
    const W = 240, H = 100, pad = 10;
    const toX = (x) => pad + (x / xMax) * (W - 2 * pad);
    const toY = (y) => H - pad - (y / yMax) * (H - 2 * pad);
    return (
      <svg width={W} height={H} className="block">
        <rect x="0" y="0" width={W} height={H} fill="rgba(232,228,216,0.05)" />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" strokeWidth="1" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" strokeWidth="1" />
        {pts.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="3" fill="#ec407a" />
        ))}
        <text x={W - pad} y={H - 2} fontSize="9" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>L (m)</text>
        <text x={pad + 2} y={pad + 7} fontSize="9" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>T² (s²)</text>
      </svg>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden"
         style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e', fontFamily: serif }}>

      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
           style={{
             backgroundImage:
               'linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)',
             backgroundSize: '28px 28px',
           }} />

      <header className="relative px-5 pt-5 pb-3 flex items-start justify-between z-10">
        <div>
          <div className="text-[10px] uppercase text-stone-500"
               style={{ fontFamily: mono, letterSpacing: '0.28em' }}>
            NSSCO · Physics Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Pendulum</span> · Period and g
          </h1>
        </div>
        <button onClick={() => setMuted(m => !m)}
                className="p-2 text-stone-700 active:scale-95">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </header>

      <div className="flex-1 relative z-0">
        <div ref={mountRef} className="absolute inset-0" />
        {phase !== 'intro' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-stone-500 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
            drag to rotate
          </div>
        )}
        {phase === 'swinging' && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>oscillations : {oscillations} / {OSCILLATIONS_PER_TRIAL}</div>
            <div>elapsed      : {elapsedTime.toFixed(2)} s</div>
            <div>length       : {lengthCm} cm</div>
          </div>
        )}
        {phase !== 'intro' && trials.length > 0 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">Trials · {trials.length}</div>
          </div>
        )}
      </div>

      <div className="relative z-10"
           style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                    boxShadow: '0 -10px 30px -10px rgba(26,31,46,0.4)' }}>

        {phase === 'intro' && (
          <div className="px-5 pt-5 pb-6">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Aim</div>
            <p className="text-base leading-snug mb-3">
              How does the period of a <span style={{ fontStyle: 'italic' }}>simple pendulum</span> depend on its length? Use the result to deduce the local acceleration due to gravity.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Time {OSCILLATIONS_PER_TRIAL} oscillations at several lengths. Plot T² against L. The slope should equal 4π² / g.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'setup' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-3"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Trial setup · {trials.length} recorded
            </div>
            <div className="mb-3">
              <div className="text-[10px] opacity-65 uppercase mb-1"
                   style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                Pendulum length · {lengthCm} cm
              </div>
              <div className="grid grid-cols-6 gap-1">
                {LENGTH_OPTIONS.map(L => (
                  <button key={L} onClick={() => setLengthCm(L)}
                          className="py-2 text-xs active:scale-95"
                          style={{
                            background: L === lengthCm
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    {L}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={startSwing}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Release
              </button>
              <button onClick={showResults} disabled={trials.length < 2}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                See Graph
              </button>
            </div>
            {trials.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto pr-1"
                   style={{ fontFamily: mono, fontSize: '10px' }}>
                <div className="opacity-50 mb-1 grid grid-cols-4 gap-1"
                     style={{ letterSpacing: '0.1em' }}>
                  <div>L (cm)</div><div>10T (s)</div><div>T (s)</div><div>T² (s²)</div>
                </div>
                {trials.map((t, i) => (
                  <div key={i} className="grid grid-cols-4 gap-1 py-0.5">
                    <div>{t.length}</div>
                    <div>{t.elapsed.toFixed(2)}</div>
                    <div>{t.period.toFixed(3)}</div>
                    <div style={{ fontWeight: 600 }}>{(t.period * t.period).toFixed(3)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'swinging' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Timing in progress · target {OSCILLATIONS_PER_TRIAL} oscillations
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              {oscillations}<span className="opacity-50 text-base"> / {OSCILLATIONS_PER_TRIAL}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${(oscillations / OSCILLATIONS_PER_TRIAL) * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <button onClick={stopEarly}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(232,228,216,0.1)', color: '#e8e4d8',
                             border: '1px solid rgba(232,228,216,0.25)',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <Square size={11} /> Stop Now
            </button>
          </div>
        )}

        {phase === 'finished' && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const last = trials[trials.length - 1];
              if (!last) return null;
              return (
                <>
                  <div className="text-[10px] uppercase opacity-55 mb-2"
                       style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
                    Trial complete · {last.length} cm
                  </div>
                  <div className="text-sm leading-snug opacity-85 mb-3" style={{ fontFamily: mono }}>
                    {last.oscillations} oscillations in {last.elapsed.toFixed(2)} s →
                    T = <span style={{ fontWeight: 600 }}>{last.period.toFixed(3)} s</span>
                    {' '}(expected {last.expectedPeriod.toFixed(3)} s).
                  </div>
                  <button onClick={nextTrial}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    Next Trial <ChevronRight size={14} />
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {phase === 'results' && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {(() => {
              const gEst = fitG();
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase text-stone-500"
                           style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Linear fit</div>
                      <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                        Estimating <span style={{ fontStyle: 'italic' }}>g</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full"
                         style={{ backgroundColor: '#c2185b', color: 'white' }}>
                      <Trophy size={18} />
                    </div>
                  </div>

                  <div className="bg-stone-900 text-stone-100 p-3 mb-4 rounded-sm">
                    {renderGraph()}
                    <div className="text-[9px] opacity-55 mt-1"
                         style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
                      T² vs L — slope = 4π²/g
                    </div>
                  </div>

                  {gEst ? (
                    <div className="bg-stone-100 p-3 mb-4 text-sm" style={{ fontFamily: mono }}>
                      <div className="opacity-55 text-[10px] uppercase mb-1"
                           style={{ letterSpacing: '0.2em' }}>
                        Your estimate
                      </div>
                      <div className="text-2xl" style={{ fontWeight: 600 }}>
                        g ≈ {gEst.toFixed(2)} m/s²
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        Accepted value: 9.81 m/s² &nbsp;·&nbsp; error: {Math.abs(gEst - 9.81).toFixed(2)} m/s²
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-100 p-3 mb-4 text-xs text-stone-600">
                      Need at least 2 trials with different lengths to fit g.
                    </div>
                  )}

                  <button onClick={resetSession}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                                   fontFamily: mono, letterSpacing: '0.25em' }}>
                    <RotateCcw size={13} /> New Session
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
