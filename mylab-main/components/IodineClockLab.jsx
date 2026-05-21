'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Play,
} from 'lucide-react';

// ============================================================================
// IODINE CLOCK LAB · v1
// NSSCAS Chemistry Practical (Advanced Subsidiary) — Iodine clock kinetics.
// Maps directly to NSSCAS 2024 Paper 3 Q1: a 5-experiment investigation of
// how the rate of reaction between H₂O₂ and I⁻ varies with [I⁻].
//
//   H₂O₂(aq) + 2H⁺(aq) + 2I⁻(aq) → I₂(aq) + 2H₂O(l)
//   2S₂O₃²⁻(aq) + I₂(aq) → 2I⁻(aq) + S₄O₆²⁻(aq)        (immediate)
// Once the fixed amount of thiosulfate is consumed, the next I₂ produced
// reacts with starch and the mixture turns blue-black. Time to blue-black is
// the inverse of rate: rate = 1000 / reaction time.
// ============================================================================

// The five experiments from NSSCO/NSSCAS Q1 — different volumes of B (KI)
// and water, keeping total B + water = 25.00 cm³.
const EXPERIMENTS = [
  { id: 1, volB: 25.0, volWater: 0.0 },
  { id: 2, volB: 20.0, volWater: 5.0 },
  { id: 3, volB: 15.0, volWater: 10.0 },
  { id: 4, volB: 10.0, volWater: 15.0 },
  { id: 5, volB:  5.0, volWater: 20.0 },
];

// Reference reaction times (s) — calibrated so rate ∝ [I⁻] passes through origin
// At volB=25 the time is ~20 s; at volB=5 the time is ~100 s.
const REFERENCE_TIMES = {
  25: 20, 20: 25, 15: 33, 10: 50, 5: 100,
};

// Real-time compression — each experiment runs in TIME_COMP seconds of wall time
const TIME_COMP_SEC = 4;  // 4 real seconds per experiment

// Analysis questions (from NSSCAS 2024 Q1 mark scheme)
const QUESTIONS = [
  {
    q: 'From the graph (rate vs volume of B), what is the relationship between rate of reaction and concentration of iodide ions?',
    options: [
      'Rate is inversely proportional to [I⁻]',
      'Rate is directly proportional to [I⁻]',
      'Rate does not depend on [I⁻]',
      'Rate is proportional to [I⁻]²',
    ],
    correct: 1,
    explain: 'The graph is a straight line passing (very nearly) through the origin, so rate ∝ [I⁻].',
  },
  {
    q: 'A student carrying out experiment 1 ran out of thiosulfate solution C. The student made up a FRESH sample of C of the correct concentration by dissolving hydrated sodium thiosulfate, Na₂S₂O₃·5H₂O, in water and used it immediately. The time taken was MUCH GREATER than measured previously. Why?',
    options: [
      'The hydrated salt is impure',
      'Dissolving an ionic solid in water is endothermic, so the solution was colder. Lower temperature gives a slower reaction and longer time.',
      'The water was contaminated',
      'The starch indicator no longer worked',
    ],
    correct: 1,
    explain: 'Dissolving Na₂S₂O₃·5H₂O is endothermic — the fresh solution is colder, so the H₂O₂/I⁻ reaction is slower and time to blue-black is longer.',
  },
  {
    q: 'Suggest ONE way to improve this experiment for more accurate rate measurements.',
    options: [
      'Use a measuring cylinder for the H₂O₂ instead of a pipette',
      'Use a pipette or burette to measure the H₂O₂ (rather than a measuring cylinder) — improves volume precision',
      'Mix the solutions faster',
      'Use less starch indicator',
    ],
    correct: 1,
    explain: 'A pipette / burette has greater precision than a measuring cylinder; reading times to 0.1 s also reduces uncertainty.',
  },
];

const TARGET_BLUE_BLACK = 0x18204a; // blue-black colour the mixture turns
const COLORLESS = 0xeef3f0;          // starting near-colourless solution
const STARCH_TINT = 0xeef3f0;        // starting (with starch added, still ~colourless)

export default function IodineClockLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → running (auto runs all 5 exps) → analysis → result
  const [phase, setPhase] = useState('intro');
  const [expIndex, setExpIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState([]);  // [{exp, volB, volWater, time, rate}]
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const runRef = useRef({ running: false, expIdx: 0, simElapsed: 0, targetT: 0 });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.85).toDestination();
      const click = new Tone.MetalSynth({
        frequency: 240, envelope: { attack: 0.001, decay: 0.06, release: 0.02 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;
      const drip = new Tone.PluckSynth({
        attackNoise: 0.6, dampening: 4500, resonance: 0.88,
      }).connect(master);
      drip.volume.value = -10;
      const tick = new Tone.MembraneSynth({
        pitchDecay: 0.02, octaves: 3,
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.04 },
      }).connect(master);
      tick.volume.value = -22;
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      const wrong = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 },
      }).connect(master);
      wrong.volume.value = -10;
      audioRef.current = { initialized: true, master, click, drip, tick, chime, wrong };
    } catch (e) { console.warn('Audio init failed', e); }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playTick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.tick.triggerAttackRelease('C3', '32n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  const playWrong = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.wrong.triggerAttackRelease('A3', '8n');
    setTimeout(() => audioRef.current.wrong.triggerAttackRelease('F3', '8n'), 180);
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
    scene.fog = new THREE.Fog(0xe8e4d8, 6, 16);
    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0.2, 1.0, 2.5);
    camera.lookAt(0, 0.35, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0d4, 0.6));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x383a3e, metalness: 0.7, roughness: 0.35 });

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

    // ─── 250 cm³ beaker (centre) — the reaction vessel ─────────────────
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(0, 0.025, 0);
    const beakerH = 0.22, beakerR = 0.11;
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR, beakerR, beakerH, 32, 1, true), glassMat
    );
    beaker.position.y = beakerH / 2;
    beaker.renderOrder = 2;
    beakerGroup.add(beaker);
    const beakerFloor = new THREE.Mesh(
      new THREE.CircleGeometry(beakerR, 32), glassMat
    );
    beakerFloor.rotation.x = -Math.PI / 2;
    beakerFloor.position.y = 0.001;
    beakerGroup.add(beakerFloor);
    // Reaction mixture
    const liquidH = 0.13;
    const reactionLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR * 0.96, beakerR * 0.96, liquidH, 32),
      new THREE.MeshPhysicalMaterial({
        color: COLORLESS, transparent: true, opacity: 0.85,
        roughness: 0.15, clearcoat: 0.5,
      })
    );
    reactionLiquid.position.y = liquidH / 2 + 0.005;
    beakerGroup.add(reactionLiquid);
    const reactionSurface = new THREE.Mesh(
      new THREE.CircleGeometry(beakerR * 0.96, 32),
      new THREE.MeshStandardMaterial({
        color: COLORLESS, roughness: 0.2, transparent: true, opacity: 0.9,
        side: THREE.DoubleSide,
      })
    );
    reactionSurface.rotation.x = -Math.PI / 2;
    reactionSurface.position.y = liquidH + 0.006;
    beakerGroup.add(reactionSurface);
    scene.add(beakerGroup);

    // ─── Two burettes (B = KI, C = Na₂S₂O₃) on a clamp stand ───────────
    const standGroup = new THREE.Group();
    standGroup.position.set(-0.6, 0.025, -0.1);
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.025, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    standBase.position.y = 0.0125;
    standBase.castShadow = true; standBase.receiveShadow = true;
    standGroup.add(standBase);
    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 1.0, 12), metalMat
    );
    standRod.position.set(-0.13, 0.5, 0);
    standGroup.add(standRod);
    scene.add(standGroup);

    // Burette geometry: a thin tall glass cylinder + tapered tip
    const buretteH = 0.65, buretteR = 0.015;
    const makeBurette = (label, x, color) => {
      const g = new THREE.Group();
      g.position.set(x, 0.025 + 0.18, -0.1);
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(buretteR, buretteR, buretteH, 16, 1, true), glassMat
      );
      cylinder.position.y = buretteH / 2;
      g.add(cylinder);
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.0015, 0.04, 8),
        glassMat
      );
      tip.position.y = -0.02;
      g.add(tip);
      const stopcock = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x9d4f1a, roughness: 0.5 })
      );
      stopcock.position.y = -0.005;
      g.add(stopcock);
      // Liquid inside (placeholder colour)
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(buretteR * 0.9, buretteR * 0.9, buretteH * 0.85, 16),
        new THREE.MeshPhysicalMaterial({
          color, transparent: true, opacity: 0.78,
          roughness: 0.15, clearcoat: 0.4,
        })
      );
      liquid.position.y = buretteH * 0.5 - 0.02;
      g.add(liquid);
      // Label patch
      const labelMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.9 });
      const labelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.024, 0.04), labelMat
      );
      labelMesh.position.set(0, 0.4, buretteR + 0.002);
      g.add(labelMesh);
      return g;
    };
    const buretteB = makeBurette('B', -0.45, 0xf0f4fa);  // KI (pale)
    const buretteC = makeBurette('C', -0.36, 0xeaedf2);  // Na₂S₂O₃ (pale)
    scene.add(buretteB);
    scene.add(buretteC);

    sceneObjects.current = {
      scene, camera, renderer,
      beakerGroup, reactionLiquid, reactionSurface,
      buretteB, buretteC,
      tweens: [],
      time: 0,
    };

    // Camera controls
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.4;
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

    // Animation loop
    const clock = new THREE.Clock();
    let lastTickAt = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // Run a single experiment when running
      const run = runRef.current;
      if (run.running) {
        const compRate = run.targetT / TIME_COMP_SEC; // simulated s per real s
        run.simElapsed = Math.min(run.targetT, run.simElapsed + dt * compRate);
        setElapsed(run.simElapsed);
        // Tick sound every simulated second
        if (run.simElapsed - lastTickAt >= 1) {
          lastTickAt = Math.floor(run.simElapsed);
          playTick();
        }
        // Check for blue-black moment — snap colour over the last 0.3 simulated s
        const fadeStart = run.targetT - 0.3;
        if (run.simElapsed >= fadeStart) {
          const t = Math.min(1, (run.simElapsed - fadeStart) / 0.3);
          const blend = (a, b, f) => Math.round(a + (b - a) * f);
          const fr = ((COLORLESS >> 16) & 0xff);
          const fg = ((COLORLESS >> 8) & 0xff);
          const fb = (COLORLESS & 0xff);
          const tr = ((TARGET_BLUE_BLACK >> 16) & 0xff);
          const tg = ((TARGET_BLUE_BLACK >> 8) & 0xff);
          const tb = (TARGET_BLUE_BLACK & 0xff);
          const r = blend(fr, tr, t) / 255;
          const g = blend(fg, tg, t) / 255;
          const b = blend(fb, tb, t) / 255;
          so.reactionLiquid.material.color.setRGB(r, g, b);
          so.reactionSurface.material.color.setRGB(r * 0.85, g * 0.85, b * 0.85);
        }
        if (run.simElapsed >= run.targetT) {
          run.running = false;
          playChime();
          // Record result
          const exp = EXPERIMENTS[run.expIdx];
          const time = run.targetT;
          const rate = 1000 / time;
          setResults(prev => [...prev, {
            id: exp.id, volB: exp.volB, volWater: exp.volWater,
            time: parseFloat(time.toFixed(1)),
            rate: parseFloat(rate.toFixed(3)),
          }]);
          setTimeout(() => {
            if (run.expIdx + 1 < EXPERIMENTS.length) {
              startExperiment(run.expIdx + 1);
            } else {
              setPhase('finished');
            }
          }, 700);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIMENT FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const startExperiment = (idx) => {
    const exp = EXPERIMENTS[idx];
    setExpIndex(idx);
    setElapsed(0);
    // Reset the beaker colour
    const so = sceneObjects.current;
    if (so.reactionLiquid) {
      so.reactionLiquid.material.color.setHex(COLORLESS);
      so.reactionSurface.material.color.setHex(COLORLESS);
    }
    // Add slight noise to the reference time for realism (±5%)
    const baseT = REFERENCE_TIMES[exp.volB] ?? 30;
    const targetT = baseT * (0.95 + Math.random() * 0.1);
    runRef.current = { running: true, expIdx: idx, simElapsed: 0, targetT };
  };

  const beginLab = async () => {
    await initAudio();
    setResults([]);
    setQuestionIndex(0);
    setAnswers([]);
    setPhase('running');
    startExperiment(0);
  };

  const submitAnswer = (idx) => {
    playClick();
    const next = [...answers, idx];
    setAnswers(next);
    if (next.length >= QUESTIONS.length) {
      setTimeout(() => setPhase('result'), 400);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const resetLab = () => {
    const so = sceneObjects.current;
    if (so.reactionLiquid) {
      so.reactionLiquid.material.color.setHex(COLORLESS);
      so.reactionSurface.material.color.setHex(COLORLESS);
    }
    setResults([]);
    setQuestionIndex(0);
    setAnswers([]);
    setElapsed(0);
    setExpIndex(0);
    setPhase('intro');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const score = answers.reduce((acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0), 0);
  const currentExp = EXPERIMENTS[expIndex];

  const renderGraph = () => {
    if (results.length < 2) return null;
    const W = 240, H = 110, pad = 12;
    const xMax = Math.max(...results.map(r => r.volB));
    const yMax = Math.max(...results.map(r => r.rate));
    const toX = (v) => pad + (v / xMax) * (W - 2 * pad);
    const toY = (r) => H - pad - (r / yMax) * (H - 2 * pad);
    const sortedByB = [...results].sort((a, b) => a.volB - b.volB);
    const path = sortedByB.map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.volB)} ${toY(r.rate)}`).join(' ');
    return (
      <svg width={W} height={H} className="block">
        <rect x="0" y="0" width={W} height={H} fill="rgba(232,228,216,0.05)" />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <path d={path} stroke="rgba(236,64,122,0.5)" strokeWidth="1.2" fill="none" />
        {results.map((r, i) => (
          <circle key={i} cx={toX(r.volB)} cy={toY(r.rate)} r="3" fill="#ec407a" />
        ))}
        <text x={W - pad} y={H - 2} fontSize="9" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>vol B (cm³)</text>
        <text x={pad + 2} y={pad + 7} fontSize="9" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>rate (1000/t)</text>
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
            NSSCAS · Chemistry · Advanced Practical Skills
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Iodine</span> Clock
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
        {phase === 'running' && currentExp && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div className="font-semibold mb-0.5">Experiment {currentExp.id} of {EXPERIMENTS.length}</div>
            <div>B: {currentExp.volB.toFixed(2)} cm³</div>
            <div>water: {currentExp.volWater.toFixed(1)} cm³</div>
            <div>t = {elapsed.toFixed(1)} s</div>
          </div>
        )}
        {results.length > 0 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div className="opacity-55 mb-0.5 uppercase" style={{ letterSpacing: '0.16em' }}>Results</div>
            <div className="grid grid-cols-4 gap-x-2">
              <span className="opacity-50">B</span>
              <span className="opacity-50">H₂O</span>
              <span className="opacity-50">t (s)</span>
              <span className="opacity-50">rate</span>
              {results.map((r, i) => (
                <span key={`r${i}`} className="contents">
                  <span>{r.volB.toFixed(0)}</span>
                  <span>{r.volWater.toFixed(0)}</span>
                  <span>{r.time.toFixed(1)}</span>
                  <span style={{ fontWeight: 600 }}>{r.rate.toFixed(2)}</span>
                </span>
              ))}
            </div>
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
              Investigate how the <span style={{ fontStyle: 'italic' }}>concentration of iodide ions</span> affects the rate of the reaction with hydrogen peroxide.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Five experiments, varying the volume of B (aqueous KI) from 25 down to 5 cm³ with water making up to 25 cm³. Time until the mixture turns blue-black is measured. rate = 1000 / t.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Play size={12} /> Begin Investigation
            </button>
          </div>
        )}

        {phase === 'running' && currentExp && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Experiment {currentExp.id} of {EXPERIMENTS.length} running
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${((expIndex + (runRef.current.targetT > 0 ? elapsed / runRef.current.targetT : 0)) / EXPERIMENTS.length) * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <p className="text-xs opacity-65 leading-snug">
              Mixed: 25 cm³ acid + starch + {currentExp.volB.toFixed(2)} cm³ B + 5 cm³ C + {currentExp.volWater.toFixed(1)} cm³ water + 10 cm³ D. Timing until blue-black.
            </p>
          </div>
        )}

        {phase === 'finished' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              All 5 experiments complete · plot rate vs volume of B
            </div>
            <div className="bg-stone-900/40 p-2 mb-3 rounded-sm">
              {renderGraph()}
            </div>
            <button onClick={() => setPhase('analysis')}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Answer Exam Questions <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'analysis' && QUESTIONS[questionIndex] && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Question {questionIndex + 1} of {QUESTIONS.length}
            </div>
            <p className="text-sm leading-snug mb-3">{QUESTIONS[questionIndex].q}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {QUESTIONS[questionIndex].options.map((opt, i) => (
                <button key={i} onClick={() => submitAnswer(i)}
                        className="py-2 px-3 text-[10px] text-left active:scale-[0.99]"
                        style={{
                          background: 'rgba(232,228,216,0.07)',
                          border: '1px solid rgba(232,228,216,0.18)',
                          fontFamily: mono,
                        }}>
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {phase === 'result' && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase text-stone-500"
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Score</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Iodine clock <span style={{ fontStyle: 'italic' }}>kinetics</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: score === QUESTIONS.length ? '#2e7d32' : '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>
            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {score} <span className="text-stone-400 text-lg">/ {QUESTIONS.length}</span>
            </div>
            <div className="space-y-2 text-xs mb-4" style={{ fontFamily: mono }}>
              {QUESTIONS.map((q, i) => {
                const correct = answers[i] === q.correct;
                return (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-stone-700 flex-1">{q.q.slice(0, 80)}...</span>
                      <span style={{ color: correct ? '#2e7d32' : '#c2185b', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {correct ? '✓' : `✗ ${String.fromCharCode(65 + q.correct)}`}
                      </span>
                    </div>
                    {!correct && (
                      <div className="text-[10px] opacity-65 mt-0.5 leading-snug">{q.explain}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={resetLab}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> Run Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
