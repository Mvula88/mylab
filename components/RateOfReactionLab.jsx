'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// RATE OF REACTION LAB · v1
// NSSCO Chemistry Practical — Mg + 2 HCl → MgCl₂ + H₂
// Investigate how the concentration of HCl affects the time for a fixed mass
// of magnesium ribbon to fully dissolve. Plot rate (1/t) vs concentration.
// ============================================================================

const CONC_OPTIONS = [0.5, 1.0, 1.5, 2.0]; // mol/dm³
const TIME_COMPRESSION = 5; // 1 real second ≈ 5 simulated seconds
// Time to dissolve at 1.0 M HCl (reference)
const T_REF_SIMULATED = 40; // s

// Approximate: time ∝ 1 / [HCl], with a small floor so very high conc still takes time
function timeToDissolve(concM) {
  return T_REF_SIMULATED * (1.0 / concM) * (0.9 + Math.random() * 0.2); // ±10% noise
}

export default function RateOfReactionLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  const [phase, setPhase] = useState('intro');
  const [concentration, setConcentration] = useState(1.0);
  const [simulatedTime, setSimulatedTime] = useState(0);
  const [mgRemainingPct, setMgRemainingPct] = useState(100);
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Animation-loop state
  const rxnRef = useRef({
    running: false,
    totalSimTime: 0,    // simulated seconds when ribbon will finish dissolving
    elapsedSim: 0,
    capturedConc: 1.0,
    bubbleSpawnAccum: 0,
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
      const bubblePop = new Tone.MembraneSynth({
        pitchDecay: 0.04, octaves: 4,
        envelope: { attack: 0.001, decay: 0.07, sustain: 0, release: 0.06 },
      }).connect(master);
      bubblePop.volume.value = -22;
      // Fizz noise
      const fizz = new Tone.Noise('pink');
      const fizzLP = new Tone.Filter(700, 'lowpass');
      const fizzGain = new Tone.Gain(0).connect(master);
      fizz.chain(fizzLP, fizzGain);
      fizz.start();
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      audioRef.current = { initialized: true, master, click, bubblePop, fizzGain, chime };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playPop = () => {
    if (muted || !audioRef.current.initialized) return;
    const note = 180 + Math.random() * 120;
    audioRef.current.bubblePop.triggerAttackRelease(note, '32n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  const setFizz = (on, intensity = 0.18) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.fizzGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? intensity : 0, 0.2);
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
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0.1, 0.85, 2.3);
    camera.lookAt(0, 0.25, 0);

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

    // ─── Materials ────────────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });

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

    // ═══ CONICAL FLASK with HCl ═══════════════════════════════════════════
    const flaskProfile = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.085, 0.001),
      new THREE.Vector2(0.085, 0.015),
      new THREE.Vector2(0.078, 0.05),
      new THREE.Vector2(0.065, 0.08),
      new THREE.Vector2(0.04, 0.13),
      new THREE.Vector2(0.018, 0.18),
      new THREE.Vector2(0.018, 0.28),
      new THREE.Vector2(0.022, 0.29),
    ];
    const flask = new THREE.Mesh(
      new THREE.LatheGeometry(flaskProfile, 32), glassMat
    );
    flask.position.set(0, 0.025, 0);
    flask.castShadow = true;
    flask.renderOrder = 2;
    scene.add(flask);

    // Liquid inside (HCl — nearly clear, slight tint based on concentration)
    const acidProfile = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.082, 0.001),
      new THREE.Vector2(0.082, 0.015),
      new THREE.Vector2(0.075, 0.05),
      new THREE.Vector2(0.062, 0.08),
      new THREE.Vector2(0.04, 0.12),
      new THREE.Vector2(0.001, 0.12),
    ];
    const acidMat = new THREE.MeshPhysicalMaterial({
      color: 0xeefaf6, transparent: true, opacity: 0.65,
      roughness: 0.15, clearcoat: 0.5,
    });
    const acid = new THREE.Mesh(
      new THREE.LatheGeometry(acidProfile, 32), acidMat
    );
    acid.position.copy(flask.position);
    acid.renderOrder = 1;
    scene.add(acid);
    const acidMeniscus = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 24),
      new THREE.MeshStandardMaterial({
        color: 0xddeeee, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    acidMeniscus.rotation.x = -Math.PI / 2;
    acidMeniscus.position.set(0, flask.position.y + 0.12, 0);
    scene.add(acidMeniscus);

    // ═══ MAGNESIUM RIBBON (initially hidden — appears on "drop") ══════════
    const ribbonGroup = new THREE.Group();
    ribbonGroup.visible = false;
    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.003, 0.01),
      new THREE.MeshStandardMaterial({
        color: 0xc8cdd0, metalness: 0.55, roughness: 0.6,
      })
    );
    ribbon.castShadow = true;
    ribbonGroup.add(ribbon);
    // Place where it'll fall into the flask
    ribbonGroup.position.set(0, flask.position.y + 0.08, 0);
    scene.add(ribbonGroup);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      flask, acid, acidMat, acidMeniscus, ribbonGroup, ribbon,
      flaskCenter: flask.position.clone(),
      bubbles: [],
      time: 0,
      ribbonInitialScale: 1.0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.25;
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

      const rxn = rxnRef.current;
      if (rxn.running) {
        const simDt = dt * TIME_COMPRESSION;
        rxn.elapsedSim += simDt;
        const frac = Math.min(1, rxn.elapsedSim / rxn.totalSimTime);
        // Shrink ribbon
        const remain = 1 - frac;
        so.ribbon.scale.set(remain, 1, remain);
        // Slight wobble in y as it dissolves
        so.ribbonGroup.position.y = so.flaskCenter.y + 0.025 + Math.sin(so.time * 4) * 0.005;
        so.ribbonGroup.rotation.y = Math.sin(so.time * 1.5) * 0.4;

        setMgRemainingPct(Math.round(remain * 100));
        setSimulatedTime(rxn.elapsedSim);

        // Spawn bubbles at a rate proportional to concentration × remaining ribbon
        const spawnRate = 25 * rxn.capturedConc * Math.max(0.05, remain); // bubbles/sec sim
        rxn.bubbleSpawnAccum += simDt * spawnRate;
        while (rxn.bubbleSpawnAccum >= 1) {
          rxn.bubbleSpawnAccum -= 1;
          // Spawn bubble at ribbon position
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.022;
          const bx = so.ribbonGroup.position.x + Math.cos(a) * r;
          const bz = so.ribbonGroup.position.z + Math.sin(a) * r;
          const bubble = new THREE.Mesh(
            new THREE.SphereGeometry(0.006 + Math.random() * 0.004, 8, 8),
            new THREE.MeshPhysicalMaterial({
              color: 0xffffff, transparent: true, opacity: 0.7,
              roughness: 0.05, clearcoat: 0.7,
            })
          );
          bubble.position.set(bx, so.ribbonGroup.position.y - 0.005, bz);
          so.scene.add(bubble);
          so.bubbles.push({
            mesh: bubble,
            vy: 0.18 + Math.random() * 0.1,
            targetY: so.flaskCenter.y + 0.13 + Math.random() * 0.01,
            wobble: Math.random() * Math.PI * 2,
          });
          if (Math.random() < 0.05) playPop();
        }

        if (rxn.elapsedSim >= rxn.totalSimTime) {
          rxn.running = false;
          so.ribbonGroup.visible = false;
          setFizz(false);
          setTimeout(() => finalizeTrial(), 60);
        }
      }

      // Update bubbles
      for (let i = so.bubbles.length - 1; i >= 0; i--) {
        const b = so.bubbles[i];
        b.wobble += dt * 4;
        b.mesh.position.y += b.vy * dt;
        b.mesh.position.x += Math.sin(b.wobble) * 0.0015;
        if (b.mesh.position.y > b.targetY) {
          if (Math.random() < 0.4) playPop();
          so.scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          so.bubbles.splice(i, 1);
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

  // ─── Update acid tint when concentration changes ────────────────────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.acidMat) return;
    // Higher conc → slightly more yellow tint
    const t = (concentration - 0.5) / 1.5; // 0..1
    const r = 0xee / 255;
    const g = (0xfa - t * 20) / 255;
    const b = (0xf6 - t * 40) / 255;
    so.acidMat.color.setRGB(r, g, b);
  }, [concentration]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const startTrial = () => {
    playClick();
    const so = sceneObjects.current;
    const T = timeToDissolve(concentration);
    rxnRef.current = {
      running: true,
      totalSimTime: T,
      elapsedSim: 0,
      capturedConc: concentration,
      bubbleSpawnAccum: 0,
    };
    // Reveal ribbon at top of flask, full size
    if (so.ribbonGroup) {
      so.ribbonGroup.visible = true;
      so.ribbonGroup.position.set(0, so.flaskCenter.y + 0.025, 0);
      so.ribbon.scale.set(1, 1, 1);
    }
    setFizz(true, 0.06 + concentration * 0.08);
    setSimulatedTime(0);
    setMgRemainingPct(100);
    setPhase('running');
  };

  const stopEarly = () => {
    if (rxnRef.current.running) {
      rxnRef.current.running = false;
      finalizeTrial();
    }
  };

  const finalizeTrial = () => {
    setFizz(false);
    const rxn = rxnRef.current;
    const so = sceneObjects.current;
    if (so.ribbonGroup) so.ribbonGroup.visible = false;
    // If user didn't stop early, the ribbon dissolved fully
    const finished = rxn.elapsedSim >= rxn.totalSimTime - 0.001;
    const rec = {
      concentration: rxn.capturedConc,
      time: rxn.elapsedSim,
      finished,
      rate: finished ? 1 / rxn.elapsedSim : null,
    };
    playChime();
    setTrials(prev => [...prev, rec]);
    setPhase('finished');
  };

  const nextTrial = () => {
    setPhase('setup');
  };
  const showResults = () => setPhase('results');
  const resetSession = () => {
    setTrials([]);
    setSimulatedTime(0);
    setMgRemainingPct(100);
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const renderGraph = () => {
    const valid = trials.filter(t => t.rate != null);
    if (valid.length < 2) return null;
    const pts = valid.map(t => ({ x: t.concentration, y: t.rate }));
    const xMax = Math.max(...pts.map(p => p.x));
    const yMax = Math.max(...pts.map(p => p.y));
    const W = 240, H = 100, pad = 10;
    const toX = (x) => pad + (x / xMax) * (W - 2 * pad);
    const toY = (y) => H - pad - (y / yMax) * (H - 2 * pad);
    return (
      <svg width={W} height={H} className="block">
        <rect x="0" y="0" width={W} height={H} fill="rgba(232,228,216,0.05)" />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        {pts.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="3" fill="#ec407a" />
        ))}
        <text x={W - pad} y={H - 2} fontSize="9" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>[HCl] (M)</text>
        <text x={pad + 2} y={pad + 7} fontSize="9" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>rate 1/t</text>
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
            NSSCO · Chemistry Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Rate</span> · Mg + HCl
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
        {(phase === 'running' || phase === 'finished') && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>[HCl]      : {concentration.toFixed(1)} M</div>
            <div>time      : {simulatedTime.toFixed(1)} s</div>
            <div>Mg left   : {mgRemainingPct} %</div>
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
              Investigate how the <span style={{ fontStyle: 'italic' }}>concentration of HCl</span> affects the rate at which magnesium ribbon dissolves.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Pick an acid concentration, drop the ribbon in, and time how long until it fully dissolves. Plot rate (1/t) against concentration — collision theory predicts a linear relationship.
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
                Acid concentration · {concentration.toFixed(1)} M
              </div>
              <div className="grid grid-cols-4 gap-1">
                {CONC_OPTIONS.map(c => (
                  <button key={c} onClick={() => setConcentration(c)}
                          className="py-2 text-xs active:scale-95"
                          style={{
                            background: c === concentration
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    {c.toFixed(1)} M
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={startTrial}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Drop Magnesium
              </button>
              <button onClick={showResults} disabled={trials.filter(t => t.rate != null).length < 2}
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
                <div className="opacity-50 mb-1 grid grid-cols-3 gap-1"
                     style={{ letterSpacing: '0.1em' }}>
                  <div>[HCl]</div><div>t (s)</div><div>rate 1/t</div>
                </div>
                {trials.map((t, i) => (
                  <div key={i} className="grid grid-cols-3 gap-1 py-0.5">
                    <div>{t.concentration.toFixed(1)}</div>
                    <div>{t.finished ? t.time.toFixed(1) : '—'}</div>
                    <div style={{ fontWeight: 600 }}>{t.rate ? t.rate.toFixed(3) : '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Reaction in progress · {concentration.toFixed(1)} M HCl
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              {mgRemainingPct}<span className="opacity-50 text-base">% Mg left</span>
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${100 - mgRemainingPct}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <button onClick={stopEarly}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(232,228,216,0.1)', color: '#e8e4d8',
                             border: '1px solid rgba(232,228,216,0.25)',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <Square size={11} /> Stop Early
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
                    Trial complete · {last.concentration.toFixed(1)} M
                  </div>
                  <div className="text-sm leading-snug opacity-90 mb-3" style={{ fontFamily: mono }}>
                    {last.finished
                      ? <>Ribbon fully dissolved in <span style={{ fontWeight: 600 }}>{last.time.toFixed(1)} s</span>. Rate ≈ {last.rate.toFixed(3)} s⁻¹.</>
                      : <>Stopped early — Mg not fully consumed.</>
                    }
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase text-stone-500"
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Reaction kinetics</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Rate vs <span style={{ fontStyle: 'italic' }}>concentration</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>

            <div className="space-y-1 text-xs mb-3" style={{ fontFamily: mono }}>
              <div className="opacity-50 grid grid-cols-3 gap-1"
                   style={{ letterSpacing: '0.1em' }}>
                <div>[HCl]</div><div>t (s)</div><div>rate</div>
              </div>
              {trials.map((t, i) => (
                <div key={i} className="grid grid-cols-3 gap-1">
                  <div>{t.concentration.toFixed(1)}</div>
                  <div>{t.finished ? t.time.toFixed(1) : '—'}</div>
                  <div style={{ fontWeight: 600 }}>{t.rate ? t.rate.toFixed(3) : '—'}</div>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 text-stone-100 p-3 mb-4 rounded-sm">
              {renderGraph() || (
                <div className="text-[10px] opacity-50" style={{ fontFamily: mono }}>
                  Need at least 2 completed trials to plot.
                </div>
              )}
              <div className="text-[9px] opacity-55 mt-1"
                   style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
                rate vs [HCl] — collision-theory linear at low concentration
              </div>
            </div>

            <button onClick={resetSession}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
