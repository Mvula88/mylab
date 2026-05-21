'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// HILL REACTION LAB · v1
// A-level extension — Investigating the rate of the light-dependent reactions
// using isolated chloroplasts and DCPIP. DCPIP is a blue dye that becomes
// colourless when reduced; the rate of decolourisation tracks the rate of
// electron production in photosystem II.
// ============================================================================

const DISTANCE_OPTIONS = [10, 15, 20, 30, 45, 70]; // cm
const TIME_COMPRESSION = 4; // 1 real second ≈ 4 simulated seconds
const MAX_SIMULATED_SECONDS = 600; // give up after 10 simulated minutes

// Convert distance to a rate constant (1/s). Inverse-square law with a small floor.
function decolorRateAt(distance) {
  return 0.02 + 100 / (distance * distance) * 0.16; // calibrated so d=20 → ~0.06/s
}

// Build a cuvette geometry (small rectangular glass container)
function buildCuvetteGroup() {
  const g = new THREE.Group();
  const w = 0.10, h = 0.18, d = 0.05;
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfafffe, metalness: 0, roughness: 0.04,
    transparent: true, opacity: 0.15, side: THREE.DoubleSide,
    clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
  });
  // Four side panes
  const sideGeo = new THREE.PlaneGeometry(w, h);
  const front = new THREE.Mesh(sideGeo, glassMat);
  front.position.set(0, h / 2, d / 2);
  g.add(front);
  const back = new THREE.Mesh(sideGeo, glassMat);
  back.position.set(0, h / 2, -d / 2);
  back.rotation.y = Math.PI;
  g.add(back);
  const sideGeo2 = new THREE.PlaneGeometry(d, h);
  const left = new THREE.Mesh(sideGeo2, glassMat);
  left.position.set(-w / 2, h / 2, 0);
  left.rotation.y = -Math.PI / 2;
  g.add(left);
  const right = new THREE.Mesh(sideGeo2, glassMat);
  right.position.set(w / 2, h / 2, 0);
  right.rotation.y = Math.PI / 2;
  g.add(right);
  // Bottom
  const bottom = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d), glassMat
  );
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.001;
  g.add(bottom);
  // Liquid (filled to 80% height)
  const liqMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e3050, transparent: true, opacity: 0.85,
    roughness: 0.15, clearcoat: 0.5, metalness: 0,
  });
  const liqGeo = new THREE.BoxGeometry(w * 0.93, h * 0.78, d * 0.85);
  const liquid = new THREE.Mesh(liqGeo, liqMat);
  liquid.position.y = h * 0.78 / 2 + 0.005;
  g.add(liquid);
  // Meniscus
  const meniscusMat = new THREE.MeshStandardMaterial({
    color: 0x152540, roughness: 0.25, transparent: true, opacity: 0.85,
    side: THREE.DoubleSide,
  });
  const meniscus = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.92, d * 0.84),
    meniscusMat
  );
  meniscus.rotation.x = -Math.PI / 2;
  meniscus.position.y = h * 0.78 + 0.006;
  g.add(meniscus);

  g.userData = { liquid, meniscus, liquidMat: liqMat, meniscusMat };
  return g;
}

export default function HillReactionLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'setup' → 'running' → 'finished' → 'results'
  const [phase, setPhase] = useState('intro');
  const [distance, setDistance] = useState(20);
  const [simulatedTime, setSimulatedTime] = useState(0);
  const [decolorPct, setDecolorPct] = useState(0); // 0..100 (% reduced)
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Mirror state into a ref so the animation loop can update efficiently.
  const reactionRef = useRef({
    running: false,
    color: 1.0, // 1 = full blue, 0 = colorless
    simulatedTime: 0,
    distance: 20,
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

      // Lamp hum
      const hum = new Tone.Oscillator(60, 'sawtooth').toDestination();
      const humFilter = new Tone.Filter(180, 'lowpass');
      const humGain = new Tone.Gain(0);
      hum.disconnect();
      hum.chain(humFilter, humGain, master);
      hum.start();

      audioRef.current = {
        initialized: true, master, click, tick, chime, humGain,
      };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
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
  const setHum = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.humGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.01 : 0, 0.2);
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
    camera.position.set(0.2, 0.85, 2.3);
    camera.lookAt(0, 0.3, 0);

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
    scene.add(new THREE.AmbientLight(0xfff0d4, 0.5));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    // Lamp light (moves with the lamp group)
    const lampLight = new THREE.PointLight(0xfff4c8, 0.5, 1.6, 2);
    scene.add(lampLight);

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

    // ═══ CUVETTE in the centre ═════════════════════════════════════════════
    const cuvette = buildCuvetteGroup();
    cuvette.position.set(0, 0.025, 0);
    scene.add(cuvette);

    // ═══ LAMP on the left ══════════════════════════════════════════════════
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.4, 0.025, 0);

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.085, 0.028, 24),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    lampBase.position.y = 0.014;
    lampBase.castShadow = true; lampBase.receiveShadow = true;
    lampGroup.add(lampBase);
    const lampPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.32, 12),
      new THREE.MeshStandardMaterial({ color: 0x383a3e, metalness: 0.6, roughness: 0.4 })
    );
    lampPost.position.y = 0.19;
    lampPost.castShadow = true;
    lampGroup.add(lampPost);
    const lampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x2a2c2e, metalness: 0.4, roughness: 0.45, side: THREE.DoubleSide })
    );
    lampShade.position.y = 0.35;
    lampShade.rotation.z = -Math.PI / 2;
    lampShade.castShadow = true;
    lampGroup.add(lampShade);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 18, 14),
      new THREE.MeshBasicMaterial({ color: 0xfff2c0 })
    );
    bulb.position.set(0.02, 0.35, 0);
    lampGroup.add(bulb);
    scene.add(lampGroup);

    // Ruler underneath, between lamp base and cuvette
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.004, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xf2e8c8, roughness: 0.8 })
    );
    ruler.position.set(-0.2, 0.027, 0.18);
    ruler.castShadow = true; ruler.receiveShadow = true;
    scene.add(ruler);
    const tickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    for (let i = 0; i <= 8; i++) {
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.002, 0.001, 0.018), tickMat
      );
      tick.position.set(-0.2 - 0.4 + i * 0.1, 0.029, 0.18 + 0.014);
      scene.add(tick);
    }

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      cuvette, lampGroup, lampLight, bulb,
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.3;
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
    let lastTickAt = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      const rxn = reactionRef.current;
      if (rxn.running) {
        const simDt = dt * TIME_COMPRESSION;
        rxn.simulatedTime += simDt;
        // First-order decay: dC/dt = -k C
        const k = decolorRateAt(rxn.distance);
        rxn.color = Math.max(0, rxn.color * Math.exp(-k * simDt));
        setSimulatedTime(rxn.simulatedTime);
        setDecolorPct(Math.round((1 - rxn.color) * 100));

        // Update cuvette liquid color: blue (1e3050) → chloroplast green (3d6a2a)
        // We interpolate the two and adjust alpha
        const blueR = 0x1e / 255, blueG = 0x30 / 255, blueB = 0x50 / 255;
        const greenR = 0x3d / 255, greenG = 0x6a / 255, greenB = 0x2a / 255;
        const t = 1 - rxn.color;
        const cr = blueR + (greenR - blueR) * t;
        const cg = blueG + (greenG - blueG) * t;
        const cb = blueB + (greenB - blueB) * t;
        so.cuvette.userData.liquidMat.color.setRGB(cr, cg, cb);
        so.cuvette.userData.meniscusMat.color.setRGB(cr * 0.85, cg * 0.85, cb * 0.85);

        // Stopwatch tick every simulated second
        if (rxn.simulatedTime - lastTickAt >= 1) {
          lastTickAt += 1;
          playTick();
        }

        // End condition: 90% decolorised, or hit max simulated time
        if (rxn.color <= 0.10 || rxn.simulatedTime >= MAX_SIMULATED_SECONDS) {
          rxn.running = false;
          setTimeout(() => finalizeTrial(), 60);
        }
      }

      // Lamp bulb glow modulates with light intensity / on state
      if (so.bulb && so.bulb.material) {
        const intensity = so.lampLight.intensity;
        const flickerR = 1;
        const flickerG = 0.92 + Math.sin(so.time * 18) * 0.02 * intensity;
        const flickerB = 0.72 + Math.sin(so.time * 13) * 0.02 * intensity;
        so.bulb.material.color.setRGB(flickerR, flickerG, flickerB);
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

  // ─── Lamp distance reflection ────────────────────────────────────────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.lampGroup) return;
    const sceneX = -(distance / 80); // 10cm → -0.125 unit, 70cm → -0.875
    so.lampGroup.position.x = sceneX;
    so.lampLight.position.set(sceneX + 0.05, 0.35, 0);
    const lightOn = phase === 'running';
    const intensity = lightOn ? Math.min(1.4, 20 / (distance * distance) * 30) : 0.05;
    so.lampLight.intensity = intensity;
  }, [distance, phase]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const startTrial = () => {
    playClick();
    setHum(true);
    reactionRef.current = {
      running: true, color: 1.0, simulatedTime: 0, distance,
    };
    // Reset cuvette color to deep blue
    const so = sceneObjects.current;
    if (so.cuvette) {
      so.cuvette.userData.liquidMat.color.setHex(0x1e3050);
      so.cuvette.userData.meniscusMat.color.setHex(0x152540);
    }
    setSimulatedTime(0);
    setDecolorPct(0);
    setPhase('running');
  };

  const stopEarly = () => {
    if (reactionRef.current.running) {
      reactionRef.current.running = false;
      finalizeTrial();
    }
  };

  const finalizeTrial = () => {
    setHum(false);
    // Read from the ref (not React state) so a stale-closure call from the
    // animation-loop setTimeout still records the trial's actual distance.
    const rxn = reactionRef.current;
    const sim = rxn.simulatedTime;
    const reached90 = rxn.color <= 0.10 + 0.001;
    const record = {
      distance: rxn.distance,
      time: sim,
      reached90,
      rate: reached90 && sim > 0 ? 1 / sim : null,
    };
    playChime();
    setTrials(prev => [...prev, record]);
    setPhase('finished');
  };

  const nextTrial = () => {
    setPhase('setup');
  };

  const showResults = () => {
    setPhase('results');
  };

  const resetSession = () => {
    setTrials([]);
    setSimulatedTime(0);
    setDecolorPct(0);
    // Reset cuvette color
    const so = sceneObjects.current;
    if (so.cuvette) {
      so.cuvette.userData.liquidMat.color.setHex(0x1e3050);
      so.cuvette.userData.meniscusMat.color.setHex(0x152540);
    }
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
    const pts = valid.map(t => ({ x: 1 / (t.distance * t.distance), y: t.rate }));
    const xMax = Math.max(...pts.map(p => p.x));
    const yMax = Math.max(...pts.map(p => p.y));
    const W = 240, H = 90, pad = 8;
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
        <text x={W - pad} y={H - 2} fontSize="8" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>1/d²</text>
        <text x={pad + 2} y={pad + 6} fontSize="8" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>1/t</text>
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
            Biology Practical · A-level extension
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Hill Reaction</span> · DCPIP Assay
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
            <div>time      : {simulatedTime.toFixed(1)}s</div>
            <div>decoloured : {decolorPct}%</div>
            <div>distance  : {distance} cm</div>
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
              Measure the rate of the <span style={{ fontStyle: 'italic' }}>light-dependent reactions</span> using the Hill reaction. DCPIP is a blue redox indicator that becomes colourless when reduced by chloroplasts in the light.
            </p>
            <p className="text-xs opacity-65 mb-4">
              You'll time how long DCPIP takes to decolorise (target: 90% reduced) at different lamp distances. Each run is timed in simulated seconds, compressed ×{TIME_COMPRESSION} so wall-clock waits stay short. Plot rate (1/time) vs light intensity (1/distance²).
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
                Lamp distance · {distance} cm
              </div>
              <div className="grid grid-cols-6 gap-1">
                {DISTANCE_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDistance(d)}
                          className="py-2 text-xs active:scale-95"
                          style={{
                            background: d === distance
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={startTrial}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Switch Lamp On
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
                <div className="opacity-50 mb-1 grid grid-cols-3 gap-1"
                     style={{ letterSpacing: '0.1em' }}>
                  <div>d (cm)</div><div>time (s)</div><div>1/t</div>
                </div>
                {trials.map((t, i) => (
                  <div key={i} className="grid grid-cols-3 gap-1 py-0.5">
                    <div>{t.distance}</div>
                    <div>{t.reached90 ? t.time.toFixed(1) : '—'}</div>
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
              Reaction in progress · {distance} cm
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              {decolorPct}<span className="opacity-50 text-base">% decoloured</span>
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${decolorPct}%`,
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
                    Trial complete · {last.distance} cm
                  </div>
                  <div className="text-sm leading-snug opacity-85 mb-3">
                    {last.reached90
                      ? <>Reached 90 % decolourisation in <span style={{ fontWeight: 600 }}>{last.time.toFixed(1)} s</span>. Rate ≈ <span style={{ fontWeight: 600 }}>{last.rate.toFixed(3)} s⁻¹</span>.</>
                      : <>Hit the {MAX_SIMULATED_SECONDS}-second cap without reaching 90 %. Light intensity may be too low to drive the reaction quickly — try a closer lamp.</>
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
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Session graph</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Hill <span style={{ fontStyle: 'italic' }}>kinetics</span>
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
                <div>d (cm)</div><div>t (s)</div><div>rate</div>
              </div>
              {trials.map((t, i) => (
                <div key={i} className="grid grid-cols-3 gap-1">
                  <div>{t.distance}</div>
                  <div>{t.reached90 ? t.time.toFixed(1) : '— (cap)'}</div>
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
                1/t vs 1/d² — slope ∝ chloroplast activity
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
