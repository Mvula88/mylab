'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  Leaf, ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX,
} from 'lucide-react';

// ============================================================================
// PHOTOSYNTHESIS LAB · v1
// NSSCO Biology Practical — Starch Test in a Leaf
// ============================================================================

// Each specimen describes a leaf that was prepared in some way before testing.
// `pattern` controls how iodine stains the leaf in the final reveal.
//   - 'full'       → blue-black everywhere (starch present)
//   - 'none'       → amber-brown everywhere (no starch)
//   - 'foil'       → blue-black except a covered strip (no starch under foil)
//   - 'variegated' → blue-black only on the green regions
// `predict` is the correct multiple-choice answer key.
const SPECIMENS = [
  {
    id: 'normal',
    title: 'Standard control',
    blurb: 'Destarched plant kept in bright light for 6 hours. Healthy leaf, no covering.',
    pattern: 'full',
    predict: 'A',
    explain:
      'Light, chlorophyll and CO₂ were all available. Photosynthesis proceeded across the whole leaf, producing starch everywhere.',
  },
  {
    id: 'dark',
    title: 'Kept in darkness',
    blurb: 'Destarched plant left in a dark cupboard for the full 6 hours. No light reached the leaf.',
    pattern: 'none',
    predict: 'B',
    explain:
      'Without light, the light-dependent reactions cannot run, so no starch is made. Iodine stays amber across the leaf.',
  },
  {
    id: 'foil',
    title: 'Half covered with foil',
    blurb: 'A strip of aluminium foil was clipped across the middle of the leaf before the plant was placed in light.',
    pattern: 'foil',
    predict: 'C',
    explain:
      'Only the uncovered regions received light, so starch formed there. The foil-covered strip received no light and contains no starch.',
  },
  {
    id: 'variegated',
    title: 'Variegated leaf',
    blurb: 'A leaf with green regions and pale (chlorophyll-free) regions. Kept in normal light for 6 hours.',
    pattern: 'variegated',
    predict: 'D',
    explain:
      'Only the green regions contain chlorophyll, so only those regions photosynthesised. The pale regions stay amber after iodine.',
  },
  {
    id: 'co2',
    title: 'CO₂ removed (soda lime)',
    blurb: 'Leaf enclosed in a sealed bag with soda lime, which absorbs CO₂. Otherwise normal light and chlorophyll.',
    pattern: 'none',
    predict: 'B',
    explain:
      'Without CO₂, the Calvin cycle has no carbon source. Even though light and chlorophyll were present, no starch was produced.',
  },
  {
    id: 'boiled',
    title: 'Killed before exposure',
    blurb: 'Leaf detached and immersed in boiling water before being returned to the plant in light.',
    pattern: 'none',
    predict: 'B',
    explain:
      'Boiling denatured the photosynthetic enzymes. Even with light, chlorophyll and CO₂, no metabolism could occur — so no starch was made.',
  },
];

const PREDICTIONS = [
  { key: 'A', label: 'Blue-black across the entire leaf' },
  { key: 'B', label: 'Amber-brown across the entire leaf (no starch)' },
  { key: 'C', label: 'Blue-black only where light reached the leaf' },
  { key: 'D', label: 'Blue-black only on the green (chlorophyll) regions' },
];

const TRIALS_PER_SESSION = 4;

// ─── Tube liquid profile (reused from Food Tests Lab) ──────────────────────
function buildTubeLiquidProfile(fillHeight) {
  const pts = [new THREE.Vector2(0.001, 0.005)];
  const segs = 6;
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.062 * Math.sin(a);
    const y = 0.005 + 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  if (fillHeight > 0.065) {
    pts.push(new THREE.Vector2(0.062, fillHeight - 0.005));
  }
  pts.push(new THREE.Vector2(0.062, fillHeight));
  pts.push(new THREE.Vector2(0.001, fillHeight));
  return pts;
}

const TUBE_OUTER_PROFILE = (() => {
  const pts = [new THREE.Vector2(0.001, 0)];
  const segs = 8;
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.067 * Math.sin(a);
    const y = 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  pts.push(new THREE.Vector2(0.067, 0.55));
  pts.push(new THREE.Vector2(0.072, 0.56));
  return pts;
})();

// ─── Leaf shape painter ────────────────────────────────────────────────────
// Paints a leaf silhouette onto a 512x512 canvas, returning a path that
// procedure functions can use to clip stain regions. The leaf occupies
// roughly UV (0.1..0.9, 0.05..0.95) of the canvas.
function buildLeafPath(ctx, w, h) {
  const cx = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.05);
  ctx.bezierCurveTo(w * 0.85, h * 0.18, w * 0.95, h * 0.45, cx, h * 0.95);
  ctx.bezierCurveTo(w * 0.05, h * 0.45, w * 0.15, h * 0.18, cx, h * 0.05);
  ctx.closePath();
}

function drawLeafVeins(ctx, w, h, alpha = 0.35, color = '#1f3a18') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 2;
  const cx = w / 2;
  // midrib
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.08);
  ctx.lineTo(cx, h * 0.92);
  ctx.stroke();
  // side veins
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) {
    const t = 0.18 + i * 0.105;
    const y = h * t;
    const sweep = h * 0.06;
    // left
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.quadraticCurveTo(cx - w * 0.18, y + sweep * 0.5, cx - w * 0.32, y + sweep);
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.quadraticCurveTo(cx + w * 0.18, y + sweep * 0.5, cx + w * 0.32, y + sweep);
    ctx.stroke();
  }
  ctx.restore();
}

// Generate stable variegated blob mask for a given specimen (cached).
function buildVariegatedMask(w, h, seed = 1) {
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const ctx = off.getContext('2d');
  ctx.fillStyle = '#ffffff'; // white = chlorophyll absent
  // Deterministic pseudo-random blobs
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 16; i++) {
    const r = 30 + rnd() * 55;
    const x = rnd() * w;
    const y = rnd() * h;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return off;
}

// Paint the leaf texture given current state.
// state.phase: 'fresh' | 'boiled' | 'decolorizing' | 'decolorized' | 'staining' | 'stained'
// state.decolorAmount: 0..1
// state.stainAmount: 0..1
// state.pattern: 'full' | 'none' | 'foil' | 'variegated'
function paintLeaf(canvas, state, cache) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Determine base leaf color based on chlorophyll state
  // Fresh: deep green. Boiled: slightly olive. Decolorizing→decolorized: pale cream.
  const decolor = Math.min(1, Math.max(0, state.decolorAmount ?? 0));
  const isStaining = state.phase === 'staining' || state.phase === 'stained';

  // Base color interpolation: deep green → cream
  const greenR = 65, greenG = 122, greenB = 48;
  const creamR = 235, creamG = 224, creamB = 188;
  const r = Math.round(greenR + (creamR - greenR) * decolor);
  const g = Math.round(greenG + (creamG - greenG) * decolor);
  const b = Math.round(greenB + (creamB - greenB) * decolor);
  const baseFill = `rgb(${r},${g},${b})`;

  // Paint leaf silhouette
  ctx.save();
  buildLeafPath(ctx, w, h);
  ctx.fillStyle = baseFill;
  ctx.fill();

  // For variegated: paint white blobs on top BEFORE clipping (these are
  // chlorophyll-free regions, always visible in pale cream regardless of decolor)
  if (state.pattern === 'variegated') {
    ctx.save();
    buildLeafPath(ctx, w, h);
    ctx.clip();
    const mask = cache.variegatedMask || (cache.variegatedMask = buildVariegatedMask(w, h, 11));
    // Blend white regions over the base
    ctx.globalAlpha = 0.85;
    ctx.drawImage(mask, 0, 0);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Veins (still visible while there's chlorophyll, fade as decolor increases)
  drawLeafVeins(ctx, w, h, 0.45 * (1 - decolor * 0.7));

  // Iodine staining overlay (only after decolorizing)
  if (isStaining) {
    const t = Math.min(1, Math.max(0, state.stainAmount ?? 0));
    ctx.save();
    buildLeafPath(ctx, w, h);
    ctx.clip();

    // Background amber tint (iodine alone, before reacting)
    ctx.globalAlpha = 0.85 * t;
    ctx.fillStyle = '#9a7138';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    // Pattern: where starch reacts (blue-black)
    if (state.pattern === 'full') {
      ctx.globalAlpha = t;
      ctx.fillStyle = '#181a36';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    } else if (state.pattern === 'foil') {
      // Blue-black everywhere EXCEPT a horizontal band (the covered strip)
      ctx.globalAlpha = t;
      ctx.fillStyle = '#181a36';
      ctx.fillRect(0, 0, w, h * 0.42);
      ctx.fillRect(0, h * 0.62, w, h * 0.38);
      ctx.globalAlpha = 1;
    } else if (state.pattern === 'variegated') {
      // Blue-black only where chlorophyll WAS (i.e. not in white blobs)
      // We achieve this by drawing blue-black, then erasing in the mask blobs
      ctx.save();
      ctx.globalAlpha = t;
      ctx.fillStyle = '#181a36';
      ctx.fillRect(0, 0, w, h);
      // Erase blobs
      const mask = cache.variegatedMask || (cache.variegatedMask = buildVariegatedMask(w, h, 11));
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.drawImage(mask, 0, 0);
      ctx.restore();
    }
    // 'none' → just amber, no blue-black overlay
    ctx.restore();
  }

  // Subtle outer rim for definition
  ctx.save();
  buildLeafPath(ctx, w, h);
  ctx.strokeStyle = 'rgba(28,38,18,0.45)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export default function PhotosynthesisLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);
  const leafTextureCache = useRef({});

  // Phase machine:
  //   intro → setup → running → observe → setup (next trial) → results
  const [phase, setPhase] = useState('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [trials, setTrials] = useState([]); // shuffled specimens for this session
  const [prediction, setPrediction] = useState(null); // user's letter pick for current trial
  const [results, setResults] = useState([]); // [{specimen, predicted, correct}]
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const currentSpec = trials[trialIndex] || null;

  // Mirror leaf state in a ref so the animation loop can repaint the texture
  const leafStateRef = useRef({
    phase: 'fresh',
    decolorAmount: 0,
    stainAmount: 0,
    pattern: 'full',
    dirty: true,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO  (subset of Food Tests Lab synths)
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(1).toDestination();

      const placeClick = new Tone.MetalSynth({
        frequency: 220, envelope: { attack: 0.001, decay: 0.06, release: 0.02 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      placeClick.volume.value = -22;

      const dripPluck = new Tone.PluckSynth({
        attackNoise: 0.6, dampening: 4500, resonance: 0.88,
      }).connect(master);
      dripPluck.volume.value = -10;

      const pourNoise = new Tone.Noise('pink');
      const pourBP = new Tone.Filter(1400, 'bandpass');
      pourBP.Q.value = 0.8;
      const pourGain = new Tone.Gain(0).connect(master);
      pourNoise.chain(pourBP, pourGain);
      pourNoise.start();

      const hissNoise = new Tone.Noise('white');
      const hissHP = new Tone.Filter(1800, 'highpass');
      const hissGain = new Tone.Gain(0).connect(master);
      hissNoise.chain(hissHP, hissGain);
      hissNoise.start();

      const bubbleNoise = new Tone.Noise('brown');
      const bubbleLP = new Tone.Filter(400, 'lowpass');
      const bubbleGain = new Tone.Gain(0).connect(master);
      bubbleNoise.chain(bubbleLP, bubbleGain);
      bubbleNoise.start();

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

      audioRef.current = {
        initialized: true, master,
        placeClick, dripPluck, pourGain, hissGain, bubbleGain,
        chime, wrong, whooshGain,
      };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playPlace = () => {
    if (!muted && audioRef.current.initialized)
      audioRef.current.placeClick.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playDrip = () => {
    if (muted || !audioRef.current.initialized) return;
    const notes = ['C6', 'D6', 'E6', 'C6', 'A5', 'B5'];
    audioRef.current.dripPluck.triggerAttack(notes[Math.floor(Math.random() * notes.length)]);
  };
  const playPour = (durationSec = 1.2) => {
    if (muted || !audioRef.current.initialized) return;
    const g = audioRef.current.pourGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(0.22, 0.12);
    setTimeout(() => g.linearRampTo(0, 0.3), durationSec * 1000 - 300);
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
    g.linearRampTo(0.35, 0.1);
    setTimeout(() => g.linearRampTo(0, 0.4), 400);
  };
  const setHiss = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.hissGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.08 : 0, 0.2);
  };
  const setBubble = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.bubbleGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.25 : 0, 0.3);
  };

  useEffect(() => {
    if (!audioRef.current.initialized) return;
    audioRef.current.master.gain.rampTo(muted ? 0 : 1, 0.15);
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
    camera.position.set(0, 1.0, 2.5);
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

    // ─── Lighting ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff0d4, 0.5));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.4);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -2; keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 2; keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0005; keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    const flameLight = new THREE.PointLight(0xff7733, 0, 1.5, 2);
    scene.add(flameLight);

    // ─── Shared materials ─────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x26282d, metalness: 0.88, roughness: 0.32 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6e4a2b, roughness: 0.85, metalness: 0.05 });

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

    // ═══ BUNSEN + TRIPOD + BEAKER (left station) ═══════════════════════════
    const STATION_X = -0.6;

    // Bunsen burner
    const bunsenGroup = new THREE.Group();
    bunsenGroup.position.set(STATION_X, 0.025, 0);
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

    // Flame
    const flameGroup = new THREE.Group();
    flameGroup.position.set(STATION_X, 0.36, 0);
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

    // Tripod
    const tripodGroup = new THREE.Group();
    tripodGroup.position.set(STATION_X, 0, 0);
    const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, metalMat);
      const tiltAxis = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      leg.rotateOnAxis(tiltAxis, 0.18);
      leg.position.x = Math.cos(a) * 0.13;
      leg.position.y = 0.25;
      leg.position.z = Math.sin(a) * 0.13;
      leg.castShadow = true;
      tripodGroup.add(leg);
    }
    const tripodRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.012, 8, 24), metalMat
    );
    tripodRing.rotation.x = Math.PI / 2;
    tripodRing.position.y = 0.48;
    tripodGroup.add(tripodRing);
    const gauze = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.005, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.6, metalness: 0.4 })
    );
    gauze.position.y = 0.49;
    gauze.castShadow = true;
    tripodGroup.add(gauze);
    scene.add(tripodGroup);

    // Beaker of water
    const bathGroup = new THREE.Group();
    bathGroup.position.set(STATION_X, 0.49, 0);
    const beakerHeight = 0.22;
    const beakerRadius = 0.1;
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerRadius, beakerRadius, beakerHeight, 32, 1, true),
      glassMat
    );
    beaker.position.y = beakerHeight / 2;
    beaker.renderOrder = 2;
    bathGroup.add(beaker);
    const beakerRim = new THREE.Mesh(
      new THREE.TorusGeometry(beakerRadius, 0.006, 6, 24), glassMat
    );
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.y = beakerHeight;
    bathGroup.add(beakerRim);
    const beakerFloor = new THREE.Mesh(
      new THREE.CircleGeometry(beakerRadius, 32), glassMat
    );
    beakerFloor.rotation.x = -Math.PI / 2;
    beakerFloor.position.y = 0.001;
    bathGroup.add(beakerFloor);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerRadius * 0.96, beakerRadius * 0.96, beakerHeight * 0.78, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xb8d4ff, transparent: true, opacity: 0.55,
        roughness: 0.12, clearcoat: 0.5,
      })
    );
    water.position.y = beakerHeight * 0.39 + 0.005;
    water.renderOrder = 1;
    bathGroup.add(water);
    const waterSurface = new THREE.Mesh(
      new THREE.CircleGeometry(beakerRadius * 0.96, 32),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = beakerHeight * 0.78 + 0.005;
    bathGroup.add(waterSurface);
    scene.add(bathGroup);

    const BEAKER_TOP_Y = bathGroup.position.y + beakerHeight; // ~0.71
    const BEAKER_WATER_TOP = bathGroup.position.y + beakerHeight * 0.78 + 0.01; // top of water
    const BEAKER_INSIDE_Y = bathGroup.position.y + 0.06; // deep inside the beaker

    // ═══ TEST TUBE STAND (right of beaker) ═════════════════════════════════
    // A small rack holding one test tube (for the ethanol step).
    const rackGroup = new THREE.Group();
    rackGroup.position.set(-0.1, 0.04, 0);
    const rackBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.06, 0.18), woodMat
    );
    rackBase.castShadow = true; rackBase.receiveShadow = true;
    rackGroup.add(rackBase);
    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16, 1, true),
      woodMat
    );
    cuff.position.y = 0.05;
    rackGroup.add(cuff);
    scene.add(rackGroup);

    // The test tube itself
    const tubeGroup = new THREE.Group();
    const tubeGlass = new THREE.Mesh(
      new THREE.LatheGeometry(TUBE_OUTER_PROFILE, 32), glassMat
    );
    tubeGlass.castShadow = true;
    tubeGlass.renderOrder = 2;
    tubeGroup.add(tubeGlass);
    // Liquid (starts empty)
    const tubeLiquid = new THREE.Mesh(
      new THREE.LatheGeometry(buildTubeLiquidProfile(0.001), 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xe8edf0, transparent: true, opacity: 0.88,
        roughness: 0.18, metalness: 0, clearcoat: 0.6,
      })
    );
    tubeLiquid.visible = false;
    tubeLiquid.renderOrder = 1;
    tubeGroup.add(tubeLiquid);
    const tubeMeniscus = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 24),
      new THREE.MeshStandardMaterial({
        color: 0xd0d8e0, roughness: 0.4, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    tubeMeniscus.rotation.x = -Math.PI / 2;
    tubeMeniscus.visible = false;
    tubeMeniscus.renderOrder = 1;
    tubeGroup.add(tubeMeniscus);
    tubeGroup.position.set(-0.1, 0.10, 0);
    tubeGroup.userData = {
      homeX: -0.1, homeY: 0.10,
      currentFill: 0.001,
      liquidMesh: tubeLiquid,
      meniscusMesh: tubeMeniscus,
    };
    scene.add(tubeGroup);

    // ═══ SPECIMEN TRAY (right edge) ════════════════════════════════════════
    // A small petri-dish-style tray that holds the leaf before testing.
    const trayGroup = new THREE.Group();
    trayGroup.position.set(0.85, 0.025, 0.0);
    const trayBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.012, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xfafffe, transparent: true, opacity: 0.4,
        roughness: 0.08, clearcoat: 0.6, side: THREE.DoubleSide,
      })
    );
    trayBase.position.y = 0.006;
    trayBase.castShadow = true; trayBase.receiveShadow = true;
    trayGroup.add(trayBase);
    const trayRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.005, 6, 32),
      glassMat
    );
    trayRim.rotation.x = Math.PI / 2;
    trayRim.position.y = 0.012;
    trayGroup.add(trayRim);
    scene.add(trayGroup);

    // ═══ IODINE BOTTLE (left of tile, near tray) ═══════════════════════════
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(0.55, 0.025, 0.18);
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.05, 0.13, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x6e4a1a, transparent: true, opacity: 0.85,
        roughness: 0.18, clearcoat: 0.7,
      })
    );
    bottle.position.y = 0.065;
    bottle.castShadow = true;
    bottleGroup.add(bottle);
    const bottleNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.022, 0.025, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0x6e4a1a, transparent: true, opacity: 0.9,
        roughness: 0.2,
      })
    );
    bottleNeck.position.y = 0.145;
    bottleGroup.add(bottleNeck);
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.018, 16),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })
    );
    bottleCap.position.y = 0.167;
    bottleGroup.add(bottleCap);
    // Label
    const bottleLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0xf5e6c8, roughness: 0.9,
      })
    );
    bottleLabel.position.set(0, 0.06, 0.046);
    bottleGroup.add(bottleLabel);
    scene.add(bottleGroup);

    // ═══ LEAF MESH ═════════════════════════════════════════════════════════
    // The leaf is a plane with a CanvasTexture that we repaint during the
    // procedure. The geometry sits flat (face up) at rest on the tile.
    const leafCanvas = document.createElement('canvas');
    leafCanvas.width = 512; leafCanvas.height = 512;
    const leafTexture = new THREE.CanvasTexture(leafCanvas);
    leafTexture.anisotropy = 4;

    const leafMat = new THREE.MeshStandardMaterial({
      map: leafTexture,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.7,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const leafGeo = new THREE.PlaneGeometry(0.22, 0.28);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.castShadow = true; leaf.receiveShadow = true;
    // Start lying flat on the tray
    leaf.rotation.x = -Math.PI / 2;
    leaf.position.set(0.85, 0.015, 0);
    scene.add(leaf);

    // Initial paint
    paintLeaf(leafCanvas, leafStateRef.current, leafTextureCache.current);
    leafTexture.needsUpdate = true;

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      bathGroup, flameGroup, flameLight,
      outerFlame, midFlame, innerFlame,
      water, waterSurface,
      tube: tubeGroup,
      leaf, leafCanvas, leafTexture,
      bottleGroup,
      bubbles: [], droplets: [], splashes: [],
      tubeAnimations: [],
      leafAnimations: [],
      colorTransitions: [],
      flameOn: false,
      bubblesOn: false,
      time: 0,
      beakerCenter: bathGroup.position.clone(),
      BEAKER_TOP_Y, BEAKER_WATER_TOP, BEAKER_INSIDE_Y,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.35;
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

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════════════════════════
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // ── Tube animations ──
      for (let i = so.tubeAnimations.length - 1; i >= 0; i--) {
        const a = so.tubeAnimations[i];
        a.progress = Math.min(1, a.progress + dt / a.duration);
        const t = a.progress < 0.5
          ? 2 * a.progress * a.progress
          : 1 - Math.pow(-2 * a.progress + 2, 2) / 2;
        a.target.position.x = a.fromX + (a.toX - a.fromX) * t;
        a.target.position.y = a.fromY + (a.toY - a.fromY) * t;
        a.target.position.z = a.fromZ + (a.toZ - a.fromZ) * t;
        if (a.progress >= 1) {
          so.tubeAnimations.splice(i, 1);
          if (a.onComplete) a.onComplete();
        }
      }

      // ── Leaf transform animations (position + rotation) ──
      for (let i = so.leafAnimations.length - 1; i >= 0; i--) {
        const a = so.leafAnimations[i];
        a.progress = Math.min(1, a.progress + dt / a.duration);
        const t = a.progress < 0.5
          ? 2 * a.progress * a.progress
          : 1 - Math.pow(-2 * a.progress + 2, 2) / 2;
        if (a.fromPos && a.toPos) {
          a.target.position.x = a.fromPos.x + (a.toPos.x - a.fromPos.x) * t;
          a.target.position.y = a.fromPos.y + (a.toPos.y - a.fromPos.y) * t;
          a.target.position.z = a.fromPos.z + (a.toPos.z - a.fromPos.z) * t;
        }
        if (a.fromRot && a.toRot) {
          a.target.rotation.x = a.fromRot.x + (a.toRot.x - a.fromRot.x) * t;
          a.target.rotation.y = a.fromRot.y + (a.toRot.y - a.fromRot.y) * t;
          a.target.rotation.z = a.fromRot.z + (a.toRot.z - a.fromRot.z) * t;
        }
        if (a.progress >= 1) {
          so.leafAnimations.splice(i, 1);
          if (a.onComplete) a.onComplete();
        }
      }

      // ── Numeric tweens (used for leaf decolor / stain progress) ──
      if (so.numericTweens) {
        for (let i = so.numericTweens.length - 1; i >= 0; i--) {
          const tw = so.numericTweens[i];
          tw.progress = Math.min(1, tw.progress + dt / tw.duration);
          const t = tw.progress;
          tw.setter(tw.from + (tw.to - tw.from) * t);
          if (tw.progress >= 1) {
            so.numericTweens.splice(i, 1);
            if (tw.onComplete) tw.onComplete();
          }
        }
      }

      // ── Color transitions (for the tube liquid: ethanol → green) ──
      for (let i = so.colorTransitions.length - 1; i >= 0; i--) {
        const c = so.colorTransitions[i];
        c.progress = Math.min(1, c.progress + dt / c.duration);
        const t = c.progress;
        const from = c.from, to = c.to;
        const fr = ((from >> 16) & 0xff) / 255;
        const fg = ((from >> 8) & 0xff) / 255;
        const fb = (from & 0xff) / 255;
        const tr = ((to >> 16) & 0xff) / 255;
        const tg = ((to >> 8) & 0xff) / 255;
        const tb = (to & 0xff) / 255;
        const r = fr + (tr - fr) * t;
        const g = fg + (tg - fg) * t;
        const b = fb + (tb - fb) * t;
        c.material.color.setRGB(r, g, b);
        if (c.progress >= 1) {
          so.colorTransitions.splice(i, 1);
          if (c.onComplete) c.onComplete();
        }
      }

      // ── Repaint leaf texture if dirty ──
      if (leafStateRef.current.dirty) {
        paintLeaf(so.leafCanvas, leafStateRef.current, leafTextureCache.current);
        so.leafTexture.needsUpdate = true;
        leafStateRef.current.dirty = false;
      }

      // ── Flame flicker ──
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

      // ── Bubbles rising in the beaker ──
      if (so.bubblesOn && Math.random() < 0.5) {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.008 + Math.random() * 0.006, 8, 8),
          new THREE.MeshPhysicalMaterial({
            color: 0xffffff, transparent: true, opacity: 0.7,
            roughness: 0.05, clearcoat: 0.7,
          })
        );
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.08;
        bubble.position.set(
          so.beakerCenter.x + Math.cos(a) * r,
          so.beakerCenter.y + 0.02,
          so.beakerCenter.z + Math.sin(a) * r,
        );
        so.scene.add(bubble);
        so.bubbles.push({
          mesh: bubble,
          vy: 0.18 + Math.random() * 0.12,
          targetY: so.BEAKER_WATER_TOP + Math.random() * 0.01,
        });
      }
      for (let i = so.bubbles.length - 1; i >= 0; i--) {
        const b = so.bubbles[i];
        b.mesh.position.y += b.vy * dt;
        b.mesh.position.x += (Math.random() - 0.5) * 0.003;
        if (b.mesh.position.y > b.targetY) {
          so.scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          so.bubbles.splice(i, 1);
        }
      }

      // ── Droplets + splashes ──
      for (let i = so.droplets.length - 1; i >= 0; i--) {
        const d = so.droplets[i];
        d.vy -= 3.5 * dt;
        d.mesh.position.y += d.vy * dt;
        if (d.mesh.position.y < d.targetY) {
          spawnSplash(so, d.mesh.position.x, d.targetY, d.mesh.position.z, d.color);
          so.scene.remove(d.mesh);
          d.mesh.geometry.dispose();
          d.mesh.material.dispose();
          so.droplets.splice(i, 1);
        }
      }
      for (let i = so.splashes.length - 1; i >= 0; i--) {
        const sp = so.splashes[i];
        sp.vy -= 6.0 * dt;
        sp.mesh.position.x += sp.vx * dt;
        sp.mesh.position.y += sp.vy * dt;
        sp.mesh.position.z += sp.vz * dt;
        sp.life -= dt * 1.8;
        sp.mesh.material.opacity = Math.max(0, sp.life * 0.85);
        if (sp.life <= 0) {
          so.scene.remove(sp.mesh);
          sp.mesh.geometry.dispose();
          sp.mesh.material.dispose();
          so.splashes.splice(i, 1);
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
  }, [readyToInit]);

  // ─── Helpers (mirroring Food Tests Lab) ────────────────────────────────
  function spawnSplash(so, x, y, z, color) {
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.random() * 0.6;
      const speed = 0.25 + Math.random() * 0.2;
      const splash = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 8),
        new THREE.MeshPhysicalMaterial({
          color, transparent: true, opacity: 0.85,
          roughness: 0.1, clearcoat: 0.6,
        })
      );
      splash.position.set(x, y + 0.01, z);
      so.scene.add(splash);
      so.splashes.push({
        mesh: splash,
        vx: Math.cos(angle) * speed,
        vy: 1.2 + Math.random() * 0.4,
        vz: Math.sin(angle) * speed,
        life: 1.0,
      });
    }
  }

  const dropReagent = (origin, target, color, count, callback) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    let dropped = 0;
    const drip = () => {
      playDrip();
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 12, 12),
        new THREE.MeshPhysicalMaterial({
          color, transparent: true, opacity: 0.92,
          roughness: 0.05, clearcoat: 0.8,
          emissive: color, emissiveIntensity: 0.12,
        })
      );
      drop.position.set(origin.x, origin.y, origin.z);
      so.scene.add(drop);
      so.droplets.push({ mesh: drop, vy: 0, targetY: target.y, color });
      dropped++;
      if (dropped < count) {
        setTimeout(drip, 220);
      } else if (callback) {
        setTimeout(callback, 500);
      }
    };
    drip();
  };

  const animateNumeric = (from, to, duration, setter, onComplete) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    if (!so.numericTweens) so.numericTweens = [];
    so.numericTweens.push({ from, to, progress: 0, duration, setter, onComplete });
  };
  const animateNumericPromise = (from, to, duration, setter) =>
    new Promise(res => animateNumeric(from, to, duration, setter, res));

  const animateLeaf = (target, toPos, toRot, duration, onComplete) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    so.leafAnimations.push({
      target,
      fromPos: target.position.clone(),
      toPos: toPos ? toPos.clone() : null,
      fromRot: { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
      toRot: toRot ? toRot : null,
      progress: 0, duration, onComplete,
    });
  };
  const animateLeafPromise = (target, toPos, toRot, duration) =>
    new Promise(res => animateLeaf(target, toPos, toRot, duration, res));

  const animateObject = (target, toPos, duration, onComplete) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    so.tubeAnimations.push({
      target,
      fromX: target.position.x, fromY: target.position.y, fromZ: target.position.z,
      toX: toPos.x, toY: toPos.y, toZ: toPos.z,
      progress: 0, duration, onComplete,
    });
  };
  const animateObjectPromise = (target, toPos, duration) =>
    new Promise(res => animateObject(target, toPos, duration, res));

  const fillTubeLiquid = (newFill) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tube;
    const liquid = tube.userData.liquidMesh;
    const meniscus = tube.userData.meniscusMesh;
    liquid.geometry.dispose();
    liquid.geometry = new THREE.LatheGeometry(buildTubeLiquidProfile(Math.max(0.001, newFill)), 32);
    meniscus.position.y = newFill;
    tube.userData.currentFill = newFill;
    liquid.visible = newFill > 0.005;
    meniscus.visible = newFill > 0.005;
  };

  const transitionMaterialColor = (material, toColor, duration, onComplete) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    so.colorTransitions.push({
      material,
      from: material.color.getHex(),
      to: toColor,
      progress: 0, duration, onComplete,
    });
  };
  const transitionMaterialColorPromise = (material, toColor, duration) =>
    new Promise(res => transitionMaterialColor(material, toColor, duration, res));

  const setLeafState = (patch) => {
    leafStateRef.current = { ...leafStateRef.current, ...patch, dirty: true };
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // STARCH-TEST PROCEDURE
  // ═══════════════════════════════════════════════════════════════════════════
  const runProcedure = async (specimen) => {
    const so = sceneObjects.current;
    if (!so.scene) return;

    // Reset leaf to fresh state
    setLeafState({
      phase: 'fresh',
      decolorAmount: 0,
      stainAmount: 0,
      pattern: specimen.pattern,
      dirty: true,
    });
    fillTubeLiquid(0.001);
    so.tube.userData.liquidMesh.material.color.setHex(0xe8edf0);
    // Reset positions
    so.leaf.position.set(0.85, 0.015, 0);
    so.leaf.rotation.set(-Math.PI / 2, 0, 0);
    so.tube.position.set(so.tube.userData.homeX, so.tube.userData.homeY, 0);

    await delay(400);

    // ── STEP 1: Boil the leaf in water ─────────────────────────────────
    // Light the Bunsen, watch water heat, drop the leaf in.
    playWhoosh();
    so.flameGroup.visible = true;
    so.flameLight.intensity = 0.8;
    so.flameOn = true;
    setHiss(true);
    await delay(900);
    setBubble(true);
    so.bubblesOn = true;
    await delay(1000);

    // Lift leaf, fly it over the beaker
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(0.85, 0.55, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.5,
    );
    // Move across to above the beaker
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, 0.85, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.8,
    );
    // Drop into the boiling water
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, so.BEAKER_INSIDE_Y, 0),
      { x: -Math.PI / 2, y: 0, z: 0.4 }, // slight curl
      0.5,
    );
    playPlace();

    // Wait while it boils
    await delay(2200);

    // Update leaf state: boiled (slightly olive, slight decolor start)
    setLeafState({ phase: 'boiled' });
    await delay(300);

    // Lift leaf out
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, 0.95, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.6,
    );

    // Turn off flame
    setBubble(false);
    so.bubblesOn = false;
    setHiss(false);
    so.flameGroup.visible = false;
    so.flameLight.intensity = 0;
    so.flameOn = false;

    await delay(400);

    // ── STEP 2: Decolorize in ethanol ──────────────────────────────────
    // Move the leaf into the test tube, then add ethanol, then place the
    // tube in the warm water bath.
    // First, move leaf to above the test tube
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.tube.userData.homeX, 0.7, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.7,
    );
    // Lower into the tube (rotate to vertical so it fits)
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.tube.userData.homeX, 0.20, 0),
      { x: 0, y: 0, z: 0 },
      0.6,
    );
    playPlace();

    // Add ethanol — drops fall in from above
    playPour(1.2);
    const tubeOrigin = new THREE.Vector3(so.tube.position.x, 0.65, 0);
    const tubeTarget = new THREE.Vector3(so.tube.position.x, so.tube.position.y + 0.04, 0);
    await new Promise(res => dropReagent(tubeOrigin, tubeTarget, 0xf6f8fc, 5, res));
    // Fill liquid to ~0.32 (well above the leaf-in-tube position)
    fillTubeLiquid(0.34);
    so.tube.userData.liquidMesh.material.color.setHex(0xf0f4fa);
    so.tube.userData.meniscusMesh.material.color.setHex(0xd0d8e0);
    so.tube.userData.meniscusMesh.visible = true;
    await delay(400);

    // Pick up the tube and place it in the warm water bath
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.tube.userData.homeX, 0.55, 0),
      0.5,
    );
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.beakerCenter.x, 0.55, 0),
      0.7,
    );
    // Lower it into the beaker
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.beakerCenter.x, so.beakerCenter.y + 0.02, 0),
      0.5,
    );
    playPlace();

    // Decolorize: ethanol turns green, leaf turns pale
    setLeafState({ phase: 'decolorizing' });
    // Two parallel tweens: ethanol color → leafy green, leaf decolor → 1
    const ethanolGreenPromise = transitionMaterialColorPromise(
      so.tube.userData.liquidMesh.material,
      0x3d7a30,
      4.5,
    );
    const leafDecolorPromise = animateNumericPromise(0, 1, 4.5, (v) => {
      setLeafState({ decolorAmount: v });
    });
    await Promise.all([ethanolGreenPromise, leafDecolorPromise]);
    setLeafState({ phase: 'decolorized' });
    await delay(500);

    // Lift the tube out of the bath
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.beakerCenter.x, 0.55, 0),
      0.5,
    );
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.tube.userData.homeX, 0.55, 0),
      0.6,
    );
    await animateObjectPromise(
      so.tube,
      new THREE.Vector3(so.tube.userData.homeX, so.tube.userData.homeY, 0),
      0.4,
    );
    await delay(300);

    // Lift the leaf out of the tube
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.tube.userData.homeX, 0.7, 0),
      { x: 0, y: 0, z: 0 },
      0.6,
    );

    // ── STEP 3: Rinse the leaf briefly in water (back into the beaker) ──
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, 0.85, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.7,
    );
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, so.BEAKER_INSIDE_Y + 0.04, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.5,
    );
    playPlace();
    await delay(800);
    // Pull back out
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(so.beakerCenter.x, 0.95, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.5,
    );

    // ── STEP 4: Spread on the white tile ───────────────────────────────
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(0.1, 0.35, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.7,
    );
    await animateLeafPromise(
      so.leaf,
      new THREE.Vector3(0.1, 0.028, 0),
      { x: -Math.PI / 2, y: 0, z: 0 },
      0.4,
    );
    playPlace();
    await delay(600);

    // ── STEP 5: Add iodine ─────────────────────────────────────────────
    // Bottle lifts slightly, drops fall on the leaf
    await animateObjectPromise(
      so.bottleGroup,
      new THREE.Vector3(0.3, 0.45, 0.05),
      0.6,
    );
    // Tilt: just simulate with a rotation on Z
    so.bottleGroup.rotation.z = -0.6;
    await delay(200);

    setLeafState({ phase: 'staining' });
    const iodineOrigin = new THREE.Vector3(0.2, 0.42, 0.02);
    const iodineTarget = new THREE.Vector3(0.1, 0.05, 0);
    playPour(0.8);
    await new Promise(res => dropReagent(iodineOrigin, iodineTarget, 0x9a5c1f, 6, res));

    // Develop the stain
    await animateNumericPromise(0, 1, 2.2, (v) => {
      setLeafState({ stainAmount: v });
    });
    setLeafState({ phase: 'stained' });
    await delay(300);

    // Return the bottle home
    so.bottleGroup.rotation.z = 0;
    await animateObjectPromise(
      so.bottleGroup,
      new THREE.Vector3(0.55, 0.025, 0.18),
      0.5,
    );

    await delay(300);
    playChime();

    // Done — let the user observe
    setPhase('observe');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION / PHASE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const shuffled = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const beginLab = async () => {
    await initAudio();
    const session = shuffled(SPECIMENS).slice(0, TRIALS_PER_SESSION);
    setTrials(session);
    setTrialIndex(0);
    setResults([]);
    setPrediction(null);
    setPhase('setup');
  };

  const submitPrediction = () => {
    if (!prediction || !currentSpec) return;
    setPhase('running');
    runProcedure(currentSpec);
  };

  const recordAndContinue = () => {
    if (!currentSpec) return;
    const correct = prediction === currentSpec.predict;
    if (correct) playChime(); else playWrong();
    const newResults = [...results, {
      specimen: currentSpec, predicted: prediction, correct,
    }];
    setResults(newResults);

    if (trialIndex + 1 >= trials.length) {
      setPhase('results');
    } else {
      setTrialIndex(trialIndex + 1);
      setPrediction(null);
      setPhase('setup');
    }
  };

  const resetSession = () => {
    const session = shuffled(SPECIMENS).slice(0, TRIALS_PER_SESSION);
    setTrials(session);
    setTrialIndex(0);
    setResults([]);
    setPrediction(null);
    setPhase('setup');
    // Reset leaf state
    setLeafState({
      phase: 'fresh', decolorAmount: 0, stainAmount: 0,
      pattern: session[0]?.pattern || 'full',
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const score = results.filter(r => r.correct).length;
  const totalScore = trials.length;

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
            NSSCO · Biology Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Photosynthesis</span> · Starch Test
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
        {phase !== 'intro' && trials.length > 0 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-600 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">Trial {Math.min(trialIndex + 1, trials.length)} / {trials.length}</div>
            <div className="text-right opacity-70">Score {score}</div>
          </div>
        )}
      </div>

      <div className="relative z-10"
           style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                    boxShadow: '0 -10px 30px -10px rgba(26,31,46,0.4)' }}>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="px-5 pt-5 pb-6">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Aim</div>
            <p className="text-base leading-snug mb-3">
              Use the <span style={{ fontStyle: 'italic' }}>iodine starch test</span> on a series of leaves prepared under different conditions. For each leaf, predict the outcome — then run the test to check.
            </p>
            <p className="text-xs opacity-65 mb-4">
              You will run {TRIALS_PER_SESSION} trials. Each leaf was treated differently before being placed in light. After boiling, decolorising and staining, the pattern of blue-black tells you where photosynthesis occurred.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* SETUP — show specimen card and ask for prediction */}
        {phase === 'setup' && currentSpec && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Specimen {trialIndex + 1} · {currentSpec.title}
            </div>
            <p className="text-sm leading-snug opacity-90 mb-3">
              {currentSpec.blurb}
            </p>
            <div className="text-[10px] uppercase opacity-55 mb-2 mt-3"
                 style={{ fontFamily: mono, letterSpacing: '0.22em' }}>
              Predict the iodine result
            </div>
            <div className="grid grid-cols-1 gap-1.5 mb-3">
              {PREDICTIONS.map(p => {
                const selected = prediction === p.key;
                return (
                  <button key={p.key}
                          onClick={() => setPrediction(p.key)}
                          className="py-2.5 px-3 text-left text-xs active:scale-[0.99] transition"
                          style={{
                            background: selected
                              ? 'rgba(232,228,216,0.18)'
                              : 'rgba(232,228,216,0.06)',
                            border: selected
                              ? '1px solid rgba(232,228,216,0.55)'
                              : '1px solid rgba(232,228,216,0.15)',
                            fontFamily: mono,
                          }}>
                    <span className="opacity-55 mr-2">{p.key}</span>{p.label}
                  </button>
                );
              })}
            </div>
            <button onClick={submitPrediction}
                    disabled={!prediction}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Run the Test <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* RUNNING */}
        {phase === 'running' && currentSpec && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              In progress · Starch test
            </div>
            <p className="text-sm leading-snug opacity-80 mb-3">
              Boiling the leaf to break cell membranes · decolorising in ethanol · rinsing · spreading on the tile · adding iodine.
            </p>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              observing...
            </div>
          </div>
        )}

        {/* OBSERVE */}
        {phase === 'observe' && currentSpec && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const correct = prediction === currentSpec.predict;
              return (
                <>
                  <div className="text-[10px] uppercase opacity-55 mb-2"
                       style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
                    Result · {currentSpec.title}
                  </div>
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl flex items-center gap-2" style={{ fontWeight: 500 }}>
                        {correct
                          ? <><Check size={18} /> Correct</>
                          : <><X size={18} /> Not quite</>}
                      </span>
                      <span className="text-xs opacity-65">
                        — Answer was {currentSpec.predict}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 leading-snug mt-1">
                      {currentSpec.explain}
                    </p>
                  </div>
                  <button onClick={recordAndContinue}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    {trialIndex + 1 >= trials.length ? 'See Final Score' : 'Next Specimen'} <ChevronRight size={14} />
                  </button>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* RESULTS MODAL */}
      {phase === 'results' && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase text-stone-500"
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Session results</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Photosynthesis <span style={{ fontStyle: 'italic' }}>verified</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: score === totalScore ? '#2e7d32' : '#c2185b', color: 'white' }}>
                {score === totalScore ? <Trophy size={18} /> : <Leaf size={18} />}
              </div>
            </div>

            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {score} <span className="text-stone-400 text-lg">/ {totalScore}</span>
            </div>

            <div className="space-y-2 text-sm mb-4" style={{ fontFamily: mono }}>
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 truncate pr-2">{r.specimen.title}</span>
                  <span style={{
                    color: r.correct ? '#2e7d32' : '#c2185b',
                    fontWeight: 500,
                  }}>
                    {r.correct ? `✓ ${r.predicted}` : `✗ ${r.predicted} (was ${r.specimen.predict})`}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={resetSession}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> Run Another Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
