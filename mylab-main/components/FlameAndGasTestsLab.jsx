'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Flame,
} from 'lucide-react';

// ============================================================================
// FLAME TESTS & GAS TESTS LAB · v1
// NSSCO Chemistry Practical drill — Two short rounds:
//   Round A: flame tests. Identify the cation in an unknown salt by flame
//            colour (Li⁺ red, Na⁺ bright yellow, K⁺ lilac, Ca²⁺ brick-red,
//            Ba²⁺ green).
//   Round B: gas tests. Identify an unknown gas by choosing a test
//            (lighted splint, glowing splint, limewater, damp red litmus,
//            damp blue litmus).
// Observation wording matches NSSCO Annexe B.
// ============================================================================

const FLAME_SAMPLES = [
  { cation: 'Li', name: 'lithium compound',   colour: 0xd24a2a, flameName: 'red' },
  { cation: 'Na', name: 'sodium compound',    colour: 0xffd54a, flameName: 'bright yellow' },
  { cation: 'K',  name: 'potassium compound', colour: 0xb070d6, flameName: 'lilac' },
  { cation: 'Ca', name: 'calcium compound',   colour: 0xd96b3a, flameName: 'brick-red' },
  { cation: 'Ba', name: 'barium compound',    colour: 0x7fc674, flameName: 'green' },
];

const FLAME_OPTIONS = [
  { id: 'Li', label: 'Li⁺ (lithium)' },
  { id: 'Na', label: 'Na⁺ (sodium)' },
  { id: 'K',  label: 'K⁺ (potassium)' },
  { id: 'Ca', label: 'Ca²⁺ (calcium)' },
  { id: 'Ba', label: 'Ba²⁺ (barium)' },
];

const GASES = [
  { id: 'H2',  name: 'hydrogen',       jarTint: 0xf2f5fa, jarOpacity: 0.05 },
  { id: 'O2',  name: 'oxygen',         jarTint: 0xf2f5fa, jarOpacity: 0.05 },
  { id: 'CO2', name: 'carbon dioxide', jarTint: 0xf2f5fa, jarOpacity: 0.05 },
  { id: 'NH3', name: 'ammonia',        jarTint: 0xf2f5fa, jarOpacity: 0.05 },
  { id: 'Cl2', name: 'chlorine',       jarTint: 0xdeeac8, jarOpacity: 0.30 },  // yellow-green tint
];

const GAS_TESTS = [
  { id: 'lighted-splint', label: 'Test with a lighted splint',  short: 'lighted splint' },
  { id: 'glowing-splint', label: 'Test with a glowing splint',  short: 'glowing splint' },
  { id: 'limewater',      label: 'Bubble through limewater',     short: 'limewater' },
  { id: 'red-litmus',     label: 'Test with damp red litmus',    short: 'damp red litmus' },
  { id: 'blue-litmus',    label: 'Test with damp blue litmus',   short: 'damp blue litmus' },
];

// Returns observation text + which gas is uniquely identified by a positive result
function gasObservation(gas, testId) {
  if (testId === 'lighted-splint') {
    if (gas === 'H2') return { text: 'Gas pops with a lighted splint.', positive: true };
    if (gas === 'NH3') return { text: 'Splint is extinguished. No characteristic reaction.', positive: false };
    if (gas === 'CO2') return { text: 'Splint is extinguished.', positive: false };
    if (gas === 'O2') return { text: 'Splint burns more vigorously but no pop.', positive: false };
    if (gas === 'Cl2') return { text: 'Splint is extinguished.', positive: false };
  }
  if (testId === 'glowing-splint') {
    if (gas === 'O2') return { text: 'Glowing splint relights — oxygen.', positive: true };
    if (gas === 'CO2') return { text: 'Glowing splint is extinguished.', positive: false };
    if (gas === 'H2') return { text: 'Glowing splint pops briefly.', positive: false };
    if (gas === 'NH3') return { text: 'Glowing splint is extinguished.', positive: false };
    if (gas === 'Cl2') return { text: 'Glowing splint is extinguished.', positive: false };
  }
  if (testId === 'limewater') {
    if (gas === 'CO2') return { text: 'Limewater turns milky — carbon dioxide.', positive: true };
    return { text: 'Limewater does not change.', positive: false };
  }
  if (testId === 'red-litmus') {
    if (gas === 'NH3') return { text: 'Damp red litmus paper turns blue — ammonia.', positive: true };
    if (gas === 'Cl2') return { text: 'Damp red litmus paper is bleached (turns white).', positive: false };
    return { text: 'Damp red litmus paper does not change.', positive: false };
  }
  if (testId === 'blue-litmus') {
    if (gas === 'Cl2') return { text: 'Damp blue litmus paper is bleached (turns white) — chlorine.', positive: true };
    if (gas === 'NH3') return { text: 'Damp blue litmus paper stays blue.', positive: false };
    if (gas === 'CO2') return { text: 'Damp blue litmus paper turns slightly red (weakly acidic).', positive: false };
    return { text: 'Damp blue litmus paper does not change.', positive: false };
  }
  return { text: 'No change.', positive: false };
}

const TRIALS_PER_ROUND = 3;
const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function FlameAndGasTestsLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → flame-trial → flame-guess → flame-result → ... → gas-trial → gas-guess → gas-result → end
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState('flame'); // 'flame' or 'gas'
  const [flameTrials, setFlameTrials] = useState([]);
  const [gasTrials, setGasTrials] = useState([]);
  const [trialIndex, setTrialIndex] = useState(0);
  const [gasObservations, setGasObservations] = useState([]);
  const [busy, setBusy] = useState(false);
  const [guess, setGuess] = useState(null);
  const [results, setResults] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const current = round === 'flame'
    ? flameTrials[trialIndex]
    : gasTrials[trialIndex];

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
      const hissNoise = new Tone.Noise('white');
      const hissHP = new Tone.Filter(1800, 'highpass');
      const hissGain = new Tone.Gain(0).connect(master);
      hissNoise.chain(hissHP, hissGain);
      hissNoise.start();
      const pop = new Tone.MembraneSynth({
        pitchDecay: 0.04, octaves: 5,
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.06 },
      }).connect(master);
      pop.volume.value = -10;
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
      const whooshNoise = new Tone.Noise('pink');
      const whooshFilter = new Tone.AutoFilter({ frequency: 0.5, baseFrequency: 200, octaves: 4 });
      const whooshGain = new Tone.Gain(0).connect(master);
      whooshNoise.chain(whooshFilter, whooshGain);
      whooshNoise.start();
      whooshFilter.start();
      audioRef.current = { initialized: true, master, click, hissGain, pop, chime, wrong, whooshGain };
    } catch (e) { console.warn('Audio init failed', e); }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playPop = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.pop.triggerAttackRelease('A2', '32n');
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
  const playWhoosh = () => {
    if (muted || !audioRef.current.initialized) return;
    const g = audioRef.current.whooshGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(0.32, 0.1);
    setTimeout(() => g.linearRampTo(0, 0.4), 400);
  };
  const setHiss = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.hissGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.08 : 0, 0.2);
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
    camera.position.set(0, 1.0, 2.4);
    camera.lookAt(0, 0.4, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0d4, 0.55));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);
    const flameLight = new THREE.PointLight(0xff7733, 0, 1.5, 2);
    scene.add(flameLight);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x26282d, metalness: 0.88, roughness: 0.32 });

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

    // ─── Bunsen + flame (centre) ───────────────────────────────────────
    const bunsenGroup = new THREE.Group();
    bunsenGroup.position.set(0, 0.025, 0);
    const bunsenBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.04, 24), metalMat
    );
    bunsenBase.castShadow = true; bunsenBase.receiveShadow = true;
    bunsenGroup.add(bunsenBase);
    const bunsenBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.32, 16), metalMat
    );
    bunsenBarrel.position.y = 0.18;
    bunsenBarrel.castShadow = true;
    bunsenGroup.add(bunsenBarrel);
    const bunsenTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.045, 0.02, 16), metalMat
    );
    bunsenTop.position.y = 0.35;
    bunsenGroup.add(bunsenTop);
    scene.add(bunsenGroup);

    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 0.36, 0);
    flameGroup.visible = false;
    const outerFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.065, 0.32, 12, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xffa84a, transparent: true, opacity: 0.55,
        side: THREE.DoubleSide, depthWrite: false,
      })
    );
    outerFlame.position.y = 0.16;
    flameGroup.add(outerFlame);
    const midFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.24, 12, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xff6622, transparent: true, opacity: 0.75,
        side: THREE.DoubleSide, depthWrite: false,
      })
    );
    midFlame.position.y = 0.12;
    flameGroup.add(midFlame);
    const innerFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.022, 0.13, 12, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x4499ff, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide, depthWrite: false,
      })
    );
    innerFlame.position.y = 0.065;
    flameGroup.add(innerFlame);
    scene.add(flameGroup);

    // ─── Nichrome wire loop (for flame round) ──────────────────────────
    const wireGroup = new THREE.Group();
    wireGroup.position.set(0.5, 0.5, 0);
    wireGroup.visible = false;
    const wireHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x9a7038, roughness: 0.7 })
    );
    wireHandle.position.y = 0.08;
    wireGroup.add(wireHandle);
    const wireRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.5 })
    );
    wireRod.position.y = -0.06;
    wireGroup.add(wireRod);
    const wireLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.012, 0.0015, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.3 })
    );
    wireLoop.position.y = -0.145;
    wireLoop.rotation.x = Math.PI / 2;
    wireGroup.add(wireLoop);
    scene.add(wireGroup);

    // ─── Sample watch glass (for flame round) ──────────────────────────
    const watchGlassGroup = new THREE.Group();
    watchGlassGroup.position.set(0.5, 0.04, 0);
    watchGlassGroup.visible = false;
    const watchGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.012, 32),
      glassMat
    );
    watchGlass.castShadow = true;
    watchGlassGroup.add(watchGlass);
    // Sample as a powder lump on the watch glass
    const sample = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 })
    );
    sample.position.y = 0.015;
    sample.scale.y = 0.4;
    watchGlassGroup.add(sample);
    scene.add(watchGlassGroup);

    // ─── Gas jar (for gas round) — appears on tile ─────────────────────
    const gasJarGroup = new THREE.Group();
    gasJarGroup.position.set(0, 0.025, 0);
    gasJarGroup.visible = false;
    const jarH = 0.32, jarR = 0.075;
    const jarGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(jarR, jarR, jarH, 32, 1, true), glassMat
    );
    jarGlass.position.y = jarH / 2;
    jarGlass.renderOrder = 2;
    gasJarGroup.add(jarGlass);
    const jarFloor = new THREE.Mesh(
      new THREE.CircleGeometry(jarR, 32), glassMat
    );
    jarFloor.rotation.x = -Math.PI / 2;
    jarFloor.position.y = 0.001;
    gasJarGroup.add(jarFloor);
    // Gas tint (a faint coloured cloud inside)
    const gasTint = new THREE.Mesh(
      new THREE.CylinderGeometry(jarR * 0.92, jarR * 0.92, jarH * 0.95, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf2f5fa, transparent: true, opacity: 0.05,
      })
    );
    gasTint.position.y = jarH / 2;
    gasJarGroup.add(gasTint);
    scene.add(gasJarGroup);

    // ─── Splint (toggled, for gas tests) ───────────────────────────────
    const splintGroup = new THREE.Group();
    splintGroup.visible = false;
    splintGroup.position.set(0, 0.5, 0);
    const splintWood = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.003, 0.18, 8),
      new THREE.MeshStandardMaterial({ color: 0xa07050, roughness: 0.85 })
    );
    splintGroup.add(splintWood);
    const splintTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xff6622 })
    );
    splintTip.position.y = 0.09;
    splintTip.visible = false;
    splintGroup.add(splintTip);
    scene.add(splintGroup);

    // ─── Litmus paper (for gas tests) ──────────────────────────────────
    const litmusGroup = new THREE.Group();
    litmusGroup.visible = false;
    litmusGroup.position.set(0, 0.4, 0);
    const litmus = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0xd96a8c, roughness: 0.9, side: THREE.DoubleSide,
      })
    );
    litmusGroup.add(litmus);
    scene.add(litmusGroup);

    // ─── Limewater tube (for gas tests) ────────────────────────────────
    const limewaterGroup = new THREE.Group();
    limewaterGroup.visible = false;
    limewaterGroup.position.set(0.4, 0.04, 0);
    const limewaterTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.12, 24, 1, true), glassMat
    );
    limewaterTube.position.y = 0.06;
    limewaterGroup.add(limewaterTube);
    const limewaterLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.023, 0.023, 0.09, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0xf4faf2, transparent: true, opacity: 0.7,
        roughness: 0.15, clearcoat: 0.5,
      })
    );
    limewaterLiquid.position.y = 0.045;
    limewaterGroup.add(limewaterLiquid);
    scene.add(limewaterGroup);

    sceneObjects.current = {
      scene, camera, renderer,
      bunsenGroup, flameGroup, flameLight, outerFlame, midFlame, innerFlame,
      wireGroup, watchGlassGroup, sample,
      gasJarGroup, gasTint,
      splintGroup, splintWood, splintTip,
      litmusGroup, litmus,
      limewaterGroup, limewaterLiquid,
      tweens: [],
      flameOn: false,
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
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      for (let i = so.tweens.length - 1; i >= 0; i--) {
        const tw = so.tweens[i];
        tw.progress = Math.min(1, tw.progress + dt / tw.duration);
        const t = tw.progress < 0.5
          ? 2 * tw.progress * tw.progress
          : 1 - Math.pow(-2 * tw.progress + 2, 2) / 2;
        if (tw.type === 'pos') {
          tw.target.position.x = tw.fromX + (tw.toX - tw.fromX) * t;
          tw.target.position.y = tw.fromY + (tw.toY - tw.fromY) * t;
          tw.target.position.z = tw.fromZ + (tw.toZ - tw.fromZ) * t;
        } else if (tw.type === 'colour') {
          const fr = ((tw.from >> 16) & 0xff) / 255;
          const fg = ((tw.from >> 8) & 0xff) / 255;
          const fb = (tw.from & 0xff) / 255;
          const tr = ((tw.to >> 16) & 0xff) / 255;
          const tg = ((tw.to >> 8) & 0xff) / 255;
          const tb = (tw.to & 0xff) / 255;
          tw.material.color.setRGB(fr + (tr - fr) * t, fg + (tg - fg) * t, fb + (tb - fb) * t);
        }
        if (tw.progress >= 1) {
          so.tweens.splice(i, 1);
          if (tw.onComplete) tw.onComplete();
        }
      }

      if (so.flameOn) {
        const t = so.time;
        so.outerFlame.scale.y = 1 + Math.sin(t * 6) * 0.08;
        so.outerFlame.scale.x = 1 + Math.sin(t * 8 + 1) * 0.05;
        so.outerFlame.scale.z = so.outerFlame.scale.x;
        so.midFlame.scale.y = 1 + Math.sin(t * 9 + 1) * 0.06;
        so.midFlame.scale.x = 1 + Math.sin(t * 11 + 2) * 0.04;
        so.midFlame.scale.z = so.midFlame.scale.x;
        so.innerFlame.scale.y = 1 + Math.sin(t * 13 + 2) * 0.05;
        so.flameLight.intensity = 0.8 + Math.sin(t * 12) * 0.15;
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

  // Tween helpers
  const tweenPos = (target, toPos, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'pos', target,
      fromX: target.position.x, fromY: target.position.y, fromZ: target.position.z,
      toX: toPos.x, toY: toPos.y, toZ: toPos.z,
      progress: 0, duration, onComplete: res,
    });
  });
  const tweenColour = (material, to, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'colour', material,
      from: material.color.getHex(), to,
      progress: 0, duration, onComplete: res,
    });
  });
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // ROUND A: Flame test trial
  // ═══════════════════════════════════════════════════════════════════════════
  const runFlameTest = async () => {
    if (busy || !current) return;
    setBusy(true);
    const so = sceneObjects.current;
    // Set up: bring out watch glass with sample + wire loop
    so.watchGlassGroup.visible = true;
    so.wireGroup.visible = true;
    so.wireGroup.position.set(0.5, 0.5, 0);
    // Light Bunsen
    playWhoosh();
    so.flameGroup.visible = true;
    so.flameLight.intensity = 0.8;
    so.flameOn = true;
    setHiss(true);
    await delay(700);
    // Wire dips in HCl (we skip the HCl bottle, just imply with a brief move)
    // Wire dips in sample
    await tweenPos(so.wireGroup, new THREE.Vector3(0.5, 0.18, 0), 0.5);
    playClick();
    await delay(400);
    // Wire moves to flame
    await tweenPos(so.wireGroup, new THREE.Vector3(0.5, 0.45, 0), 0.4);
    await tweenPos(so.wireGroup, new THREE.Vector3(0, 0.45, 0), 0.6);
    await tweenPos(so.wireGroup, new THREE.Vector3(0, 0.42, 0), 0.3);
    // Flame changes colour
    await tweenColour(so.outerFlame.material, current.colour, 0.6);
    await tweenColour(so.midFlame.material, current.colour, 0.3);
    so.flameLight.color.setHex(current.colour);
    await delay(2200);
    // Restore flame colour
    await tweenColour(so.outerFlame.material, 0xffa84a, 0.6);
    await tweenColour(so.midFlame.material, 0xff6622, 0.4);
    so.flameLight.color.setHex(0xff7733);
    // Return wire
    await tweenPos(so.wireGroup, new THREE.Vector3(0.5, 0.5, 0), 0.7);
    so.wireGroup.visible = false;
    // Extinguish flame
    so.flameGroup.visible = false;
    so.flameLight.intensity = 0;
    so.flameOn = false;
    setHiss(false);
    so.watchGlassGroup.visible = false;
    setBusy(false);
    setPhase('flame-guess');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ROUND B: Gas test
  // ═══════════════════════════════════════════════════════════════════════════
  const runGasTest = async (testId) => {
    if (busy || !current) return;
    setBusy(true);
    const so = sceneObjects.current;
    const test = GAS_TESTS.find(t => t.id === testId);
    if (!test) { setBusy(false); return; }

    const obs = gasObservation(current.id, testId);

    if (testId === 'lighted-splint' || testId === 'glowing-splint') {
      so.splintGroup.visible = true;
      so.splintTip.visible = true;
      so.splintTip.material.color.setHex(testId === 'lighted-splint' ? 0xff6622 : 0xff3300);
      so.splintGroup.position.set(0.5, 0.6, 0);
      // Move splint to top of gas jar
      await tweenPos(so.splintGroup, new THREE.Vector3(0, 0.45, 0), 0.6);
      await delay(400);
      if (testId === 'lighted-splint' && current.id === 'H2') {
        playPop();
      } else if (testId === 'glowing-splint' && current.id === 'O2') {
        // Splint relights — brighten tip
        await tweenColour(so.splintTip.material, 0xffe066, 0.3);
        playClick();
      }
      await delay(700);
      // Move splint away
      await tweenPos(so.splintGroup, new THREE.Vector3(0.5, 0.6, 0), 0.5);
      so.splintGroup.visible = false;
      so.splintTip.material.color.setHex(0xff6622);
    } else if (testId === 'limewater') {
      so.limewaterGroup.visible = true;
      so.limewaterGroup.position.set(0.4, 0.04, 0);
      await delay(600);
      if (current.id === 'CO2') {
        await tweenColour(so.limewaterLiquid.material, 0xc8d8c8, 1.5);
      } else {
        await delay(800);
      }
      await delay(400);
      // Leave limewater visible briefly
      await delay(500);
      so.limewaterGroup.visible = false;
      // Reset colour
      so.limewaterLiquid.material.color.setHex(0xf4faf2);
    } else if (testId === 'red-litmus' || testId === 'blue-litmus') {
      so.litmusGroup.visible = true;
      const startColour = testId === 'red-litmus' ? 0xd96a8c : 0x4a6ec8;
      so.litmus.material.color.setHex(startColour);
      so.litmusGroup.position.set(0.4, 0.6, 0);
      await tweenPos(so.litmusGroup, new THREE.Vector3(0, 0.42, 0), 0.5);
      await delay(500);
      if (testId === 'red-litmus' && current.id === 'NH3') {
        await tweenColour(so.litmus.material, 0x4a6ec8, 1.2);
      } else if (testId === 'blue-litmus' && current.id === 'Cl2') {
        await tweenColour(so.litmus.material, 0xffffff, 1.2);
      } else if (testId === 'blue-litmus' && current.id === 'CO2') {
        await tweenColour(so.litmus.material, 0xc26690, 1.2);
      }
      await delay(700);
      await tweenPos(so.litmusGroup, new THREE.Vector3(0.4, 0.6, 0), 0.5);
      so.litmusGroup.visible = false;
      so.litmus.material.color.setHex(startColour);
    }

    setGasObservations(prev => [...prev, { testId, label: test.short, text: obs.text }]);
    setBusy(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    const flames = shuffled(FLAME_SAMPLES).slice(0, TRIALS_PER_ROUND);
    const gases = shuffled(GASES).slice(0, TRIALS_PER_ROUND);
    setFlameTrials(flames);
    setGasTrials(gases);
    setTrialIndex(0);
    setRound('flame');
    setResults([]);
    setGuess(null);
    setGasObservations([]);
    setPhase('flame-trial');
  };

  // For flame round: when trial changes, set up scene + auto-run
  useEffect(() => {
    if (phase !== 'flame-trial' || !current) return;
    // small delay so UI updates first
    const t = setTimeout(() => runFlameTest(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, trialIndex]);

  // For gas round: when trial changes, set jar visibility + colour
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.gasJarGroup) return;
    if (round === 'gas' && phase !== 'intro' && current) {
      so.gasJarGroup.visible = true;
      so.gasTint.material.color.setHex(current.jarTint);
      so.gasTint.material.opacity = current.jarOpacity;
    } else {
      so.gasJarGroup.visible = false;
    }
  }, [phase, round, current]);

  const submitFlameGuess = () => {
    if (!guess || !current) return;
    const correct = guess === current.cation;
    if (correct) playChime(); else playWrong();
    setResults(prev => [...prev, {
      round: 'flame', sample: current.name, guess, correct,
      correctAnswer: current.cation,
    }]);
    setPhase('flame-result');
  };

  const submitGasGuess = () => {
    if (!guess || !current) return;
    const correct = guess === current.id;
    if (correct) playChime(); else playWrong();
    setResults(prev => [...prev, {
      round: 'gas', sample: current.name, guess, correct,
      correctAnswer: current.id, testsUsed: gasObservations.length,
    }]);
    setPhase('gas-result');
  };

  const nextTrial = () => {
    setGuess(null);
    if (round === 'flame') {
      if (trialIndex + 1 >= flameTrials.length) {
        setRound('gas');
        setTrialIndex(0);
        setGasObservations([]);
        setPhase('gas-trial');
      } else {
        setTrialIndex(trialIndex + 1);
        setPhase('flame-trial');
      }
    } else {
      if (trialIndex + 1 >= gasTrials.length) {
        setPhase('session-end');
      } else {
        setTrialIndex(trialIndex + 1);
        setGasObservations([]);
        setPhase('gas-trial');
      }
    }
  };

  const resetSession = () => {
    const flames = shuffled(FLAME_SAMPLES).slice(0, TRIALS_PER_ROUND);
    const gases = shuffled(GASES).slice(0, TRIALS_PER_ROUND);
    setFlameTrials(flames);
    setGasTrials(gases);
    setTrialIndex(0);
    setRound('flame');
    setResults([]);
    setGuess(null);
    setGasObservations([]);
    setPhase('flame-trial');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

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
            NSSCO · Chemistry Practical Drill
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Flame</span> & Gas Tests
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
        {phase !== 'intro' && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">
              {round === 'flame' ? 'Flame round' : 'Gas round'} · {Math.min(trialIndex + 1, TRIALS_PER_ROUND)} / {TRIALS_PER_ROUND}
            </div>
          </div>
        )}
        {phase === 'gas-trial' && gasObservations.length > 0 && (
          <div className="absolute top-2 left-3 max-w-[55%] text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div className="opacity-55 mb-1 uppercase" style={{ letterSpacing: '0.16em' }}>
              Observations
            </div>
            {gasObservations.map((o, i) => (
              <div key={i} className="mb-1 leading-snug">
                <span className="opacity-50">{i + 1}.</span> <span className="font-semibold">{o.label}:</span> {o.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10"
           style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                    boxShadow: '0 -10px 30px -10px rgba(26,31,46,0.4)' }}>

        {phase === 'intro' && (
          <div className="px-5 pt-5 pb-6">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Drill</div>
            <p className="text-base leading-snug mb-3">
              Two short rounds. <span style={{ fontStyle: 'italic' }}>Flame tests</span> — identify the cation by flame colour (Li⁺, Na⁺, K⁺, Ca²⁺, Ba²⁺). <span style={{ fontStyle: 'italic' }}>Gas tests</span> — choose the right test (lighted splint, glowing splint, limewater, damp litmus) to identify the gas (H₂, O₂, CO₂, NH₃, Cl₂).
            </p>
            <p className="text-xs opacity-65 mb-4">
              {TRIALS_PER_ROUND} trials per round.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Flame size={13} /> Begin Drill
            </button>
          </div>
        )}

        {phase === 'flame-trial' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Sample {trialIndex + 1} · {current.name}
            </div>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              running flame test...
            </div>
          </div>
        )}

        {phase === 'flame-guess' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              The flame burned {current.flameName}. Which cation is present?
            </div>
            <div className="grid grid-cols-1 gap-1 mb-2">
              {FLAME_OPTIONS.map(o => (
                <button key={o.id} onClick={() => setGuess(o.id)}
                        className="py-2 px-3 text-[11px] text-left active:scale-[0.99]"
                        style={{
                          background: guess === o.id
                            ? 'rgba(232,228,216,0.22)'
                            : 'rgba(232,228,216,0.07)',
                          border: '1px solid rgba(232,228,216,0.18)',
                          fontFamily: mono,
                        }}>
                  {o.label}
                </button>
              ))}
            </div>
            <button onClick={submitFlameGuess}
                    disabled={!guess}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Submit
            </button>
          </div>
        )}

        {phase === 'flame-result' && current && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const last = results[results.length - 1];
              if (!last) return null;
              return (
                <>
                  <div className="text-xl flex items-center gap-2 mb-2"
                       style={{ fontWeight: 500 }}>
                    {last.correct
                      ? <><Check size={20} /> Correct</>
                      : <><X size={20} /> Not correct</>}
                  </div>
                  <div className="text-xs opacity-80 mb-3" style={{ fontFamily: mono }}>
                    Sample: {current.name} ({current.flameName} flame). Cation: <span style={{ fontWeight: 600 }}>{current.cation}⁺</span>.
                  </div>
                  <button onClick={nextTrial}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    {trialIndex + 1 >= flameTrials.length
                      ? 'Next: Gas Tests'
                      : 'Next Sample'} <ChevronRight size={14} />
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {phase === 'gas-trial' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Unknown gas {trialIndex + 1} · choose a test
            </div>
            <div className="grid grid-cols-1 gap-1 mb-2">
              {GAS_TESTS.map(t => (
                <button key={t.id} onClick={() => runGasTest(t.id)}
                        disabled={busy}
                        className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99] disabled:opacity-40"
                        style={{
                          background: 'rgba(232,228,216,0.06)',
                          border: '1px solid rgba(232,228,216,0.15)',
                          fontFamily: mono,
                        }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => setPhase('gas-guess')}
                    disabled={busy || gasObservations.length === 0}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              I'm Ready to Identify
            </button>
          </div>
        )}

        {phase === 'gas-guess' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Which gas is in the jar?
            </div>
            <div className="grid grid-cols-1 gap-1 mb-2">
              {GASES.map(g => (
                <button key={g.id} onClick={() => setGuess(g.id)}
                        className="py-2 px-3 text-[11px] text-left active:scale-[0.99]"
                        style={{
                          background: guess === g.id
                            ? 'rgba(232,228,216,0.22)'
                            : 'rgba(232,228,216,0.07)',
                          border: '1px solid rgba(232,228,216,0.18)',
                          fontFamily: mono,
                        }}>
                  {g.id} · {g.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPhase('gas-trial')}
                      className="py-2.5 text-[10px] uppercase active:scale-95"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.22em' }}>
                ← More Tests
              </button>
              <button onClick={submitGasGuess}
                      disabled={!guess}
                      className="py-2.5 text-[10px] uppercase active:scale-95 disabled:opacity-40"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.22em', fontWeight: 500 }}>
                Submit
              </button>
            </div>
          </div>
        )}

        {phase === 'gas-result' && current && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const last = results[results.length - 1];
              if (!last) return null;
              return (
                <>
                  <div className="text-xl flex items-center gap-2 mb-2"
                       style={{ fontWeight: 500 }}>
                    {last.correct
                      ? <><Check size={20} /> Correct</>
                      : <><X size={20} /> Not correct</>}
                  </div>
                  <div className="text-xs opacity-80 mb-3" style={{ fontFamily: mono }}>
                    Gas: <span style={{ fontWeight: 600 }}>{current.id}</span> ({current.name}). {last.testsUsed} test{last.testsUsed === 1 ? '' : 's'} used.
                  </div>
                  <button onClick={nextTrial}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    {trialIndex + 1 >= gasTrials.length
                      ? 'See Score'
                      : 'Next Gas'} <ChevronRight size={14} />
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {phase === 'session-end' && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {(() => {
              const total = results.length;
              const correct = results.filter(r => r.correct).length;
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase text-stone-500"
                           style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Drill results</div>
                      <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                        Flame & gas <span style={{ fontStyle: 'italic' }}>tests</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full"
                         style={{ backgroundColor: correct === total ? '#2e7d32' : '#c2185b', color: 'white' }}>
                      <Trophy size={18} />
                    </div>
                  </div>
                  <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
                    {correct} <span className="text-stone-400 text-lg">/ {total}</span>
                  </div>
                  <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: mono }}>
                    {results.map((r, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-stone-700">
                          [{r.round}] {r.sample}
                        </span>
                        <span style={{
                          color: r.correct ? '#2e7d32' : '#c2185b',
                          fontWeight: 500,
                        }}>
                          {r.correct ? '✓' : `✗ → ${r.correctAnswer}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={resetSession}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                                   fontFamily: mono, letterSpacing: '0.25em' }}>
                    <RotateCcw size={13} /> New Drill
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
