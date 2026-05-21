'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  Droplet, ClipboardCheck, ChevronRight, RotateCcw, Trophy, X,
  Volume2, VolumeX, Flame, Check, ArrowLeft
} from 'lucide-react';

// ============================================================================
// FOOD TESTS LAB · v1
// NSSCO Biology Practical — Testing for Biological Molecules
// ============================================================================

const FOODS = [
  { name: 'Milk',          contains: { starch: false, sugar: true,  protein: true,  lipid: true  } },
  { name: 'Bread',         contains: { starch: true,  sugar: false, protein: true,  lipid: false } },
  { name: 'Apple juice',   contains: { starch: false, sugar: true,  protein: false, lipid: false } },
  { name: 'Egg white',     contains: { starch: false, sugar: false, protein: true,  lipid: false } },
  { name: 'Sunflower oil', contains: { starch: false, sugar: false, protein: false, lipid: true  } },
  { name: 'Rice water',    contains: { starch: true,  sugar: false, protein: false, lipid: false } },
  { name: 'Sweet potato',  contains: { starch: true,  sugar: true,  protein: false, lipid: false } },
];

const TESTS = [
  { id: 'iodine',    name: 'Iodine Test',     biomolecule: 'starch',  bioKey: 'starch'  },
  { id: 'benedicts', name: "Benedict's Test", biomolecule: 'sugar',   bioKey: 'sugar'   },
  { id: 'biuret',    name: 'Biuret Test',     biomolecule: 'protein', bioKey: 'protein' },
  { id: 'emulsion',  name: 'Emulsion Test',   biomolecule: 'lipid',   bioKey: 'lipid'   },
];

// ─── Tube liquid geometry helpers ──────────────────────────────────────────
function buildTubeLiquidProfile(fillHeight) {
  // Build a profile from the tube's rounded bottom up to fillHeight
  const pts = [new THREE.Vector2(0.001, 0.005)];
  const segs = 6;
  // Rounded bottom hemisphere
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.062 * Math.sin(a);
    const y = 0.005 + 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  // Straight side up to top
  if (fillHeight > 0.065) {
    pts.push(new THREE.Vector2(0.062, fillHeight - 0.005));
  }
  // Top surface
  pts.push(new THREE.Vector2(0.062, fillHeight));
  pts.push(new THREE.Vector2(0.001, fillHeight));
  return pts;
}

// ─── Tube outer profile (glass) ────────────────────────────────────────────
const TUBE_OUTER_PROFILE = (() => {
  const pts = [new THREE.Vector2(0.001, 0)];
  const segs = 8;
  // Rounded bottom outer
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.067 * Math.sin(a);
    const y = 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  // Straight glass cylinder
  pts.push(new THREE.Vector2(0.067, 0.55));
  // Slight rim flare
  pts.push(new THREE.Vector2(0.072, 0.56));
  return pts;
})();

export default function FoodTestsLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const stateRef = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase machine
  // 'intro' → 'menu' → 'running' → 'observe' → 'menu' (repeat) → 'results'
  const [phase, setPhase] = useState('intro');
  const [currentTest, setCurrentTest] = useState(null); // 'iodine' | 'benedicts' | 'biuret' | 'emulsion'
  const [testStep, setTestStep] = useState(0);
  const [busy, setBusy] = useState(false); // an animation/timeout is running

  const [completed, setCompleted] = useState({}); // { iodine: { positive: true/false, color: 0x... } }
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);
  const [food] = useState(() => FOODS[Math.floor(Math.random() * FOODS.length)]);

  // Tube colors (the visible liquid color in each tube right now)
  // Index 0=iodine tube, 1=benedict's, 2=biuret, 3=emulsion
  const FOOD_COLOR = 0xefe6c8; // pale beige food sample
  const [tubeColors, setTubeColors] = useState([FOOD_COLOR, FOOD_COLOR, FOOD_COLOR, FOOD_COLOR]);

  // Mirror state into ref for animation loop
  useEffect(() => {
    stateRef.current = { phase, currentTest, testStep, busy };
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(1).toDestination();

      const placeClick = new Tone.MetalSynth({
        frequency: 250, envelope: { attack: 0.001, decay: 0.06, release: 0.02 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      placeClick.volume.value = -22;

      const dripPluck = new Tone.PluckSynth({
        attackNoise: 0.6, dampening: 4500, resonance: 0.88,
      }).connect(master);
      dripPluck.volume.value = -10;

      // Pour - filtered pink noise
      const pourNoise = new Tone.Noise('pink');
      const pourBP = new Tone.Filter(1400, 'bandpass');
      pourBP.Q.value = 0.8;
      const pourGain = new Tone.Gain(0).connect(master);
      pourNoise.chain(pourBP, pourGain);
      pourNoise.start();

      // Bunsen hiss - white noise, high-pass
      const hissNoise = new Tone.Noise('white');
      const hissHP = new Tone.Filter(1800, 'highpass');
      const hissGain = new Tone.Gain(0).connect(master);
      hissNoise.chain(hissHP, hissGain);
      hissNoise.start();

      // Bubbling - brown noise low-pass + occasional bursts
      const bubbleNoise = new Tone.Noise('brown');
      const bubbleLP = new Tone.Filter(400, 'lowpass');
      const bubbleGain = new Tone.Gain(0).connect(master);
      bubbleNoise.chain(bubbleLP, bubbleGain);
      bubbleNoise.start();

      // Chime
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;

      // Whoosh (for flame ignite)
      const whooshNoise = new Tone.Noise('pink');
      const whooshFilter = new Tone.AutoFilter({ frequency: 0.5, baseFrequency: 200, octaves: 4 });
      const whooshGain = new Tone.Gain(0).connect(master);
      whooshNoise.chain(whooshFilter, whooshGain);
      whooshNoise.start();
      whooshFilter.start();

      audioRef.current = {
        initialized: true, master,
        placeClick, dripPluck, pourGain, hissGain, bubbleGain, chime, whooshGain,
      };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playPlace = () => { if (!muted && audioRef.current.initialized)
    audioRef.current.placeClick.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n'); };

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
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
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

    // Flame light (off initially)
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

    // ═══ TEST TUBE RACK ═══════════════════════════════════════════════════
    const rackGroup = new THREE.Group();
    rackGroup.position.set(0.45, 0.04, 0);

    // Wooden base
    const rackBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.06, 0.18), woodMat
    );
    rackBase.castShadow = true; rackBase.receiveShadow = true;
    rackGroup.add(rackBase);

    // Tube holders (small wooden cuffs)
    const tubeX = [-0.36, -0.12, 0.12, 0.36];
    tubeX.forEach((x, i) => {
      const cuff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16, 1, true),
        woodMat
      );
      cuff.position.set(x, 0.05, 0);
      rackGroup.add(cuff);

      // Label tag in front
      const tagMat = new THREE.MeshStandardMaterial({ color: 0xfff3d6, roughness: 0.95 });
      const tag = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.005), tagMat);
      tag.position.set(x, -0.02, 0.092);
      rackGroup.add(tag);
    });
    scene.add(rackGroup);

    // ═══ TEST TUBES ═══════════════════════════════════════════════════════
    // Each tube is a group containing glass + liquid
    const tubes = tubeX.map((x, i) => {
      const tubeGroup = new THREE.Group();

      // Glass
      const glass = new THREE.Mesh(
        new THREE.LatheGeometry(TUBE_OUTER_PROFILE, 32),
        glassMat
      );
      glass.castShadow = true;
      glass.renderOrder = 2;
      tubeGroup.add(glass);

      // Liquid (starts as food sample, fill height 0.16)
      const liquidProfile = buildTubeLiquidProfile(0.16);
      const liquid = new THREE.Mesh(
        new THREE.LatheGeometry(liquidProfile, 32),
        new THREE.MeshPhysicalMaterial({
          color: FOOD_COLOR,
          transparent: true,
          opacity: 0.88,
          roughness: 0.18,
          metalness: 0,
          clearcoat: 0.6,
        })
      );
      liquid.renderOrder = 1;
      tubeGroup.add(liquid);

      // Meniscus disc
      const meniscus = new THREE.Mesh(
        new THREE.CircleGeometry(0.06, 24),
        new THREE.MeshStandardMaterial({
          color: 0xd0c19a, roughness: 0.4, transparent: true, opacity: 0.85,
          side: THREE.DoubleSide,
        })
      );
      meniscus.rotation.x = -Math.PI / 2;
      meniscus.position.y = 0.16;
      meniscus.renderOrder = 1;
      tubeGroup.add(meniscus);

      // World position
      tubeGroup.position.set(x + 0.45, 0.10, 0); // rack base y=0.04 + half height=0.03 + tube base=0.03 ≈ 0.10
      tubeGroup.userData = { 
        homeX: x + 0.45, 
        homeY: 0.10,
        currentFill: 0.16,
        liquidMesh: liquid,
        meniscusMesh: meniscus,
      };
      scene.add(tubeGroup);
      return tubeGroup;
    });

    // ═══ BUNSEN BURNER ════════════════════════════════════════════════════
    const bunsenGroup = new THREE.Group();
    bunsenGroup.position.set(-0.6, 0.025, 0);

    // Base disc
    const bunsenBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.04, 24),
      metalMat
    );
    bunsenBase.castShadow = true; bunsenBase.receiveShadow = true;
    bunsenGroup.add(bunsenBase);

    // Barrel
    const bunsenBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.32, 16),
      metalMat
    );
    bunsenBarrel.position.y = 0.18;
    bunsenBarrel.castShadow = true;
    bunsenGroup.add(bunsenBarrel);

    // Top collar
    const bunsenTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.045, 0.02, 16),
      metalMat
    );
    bunsenTop.position.y = 0.35;
    bunsenGroup.add(bunsenTop);

    scene.add(bunsenGroup);

    // ═══ FLAME (hidden initially) ═════════════════════════════════════════
    const flameGroup = new THREE.Group();
    flameGroup.position.set(-0.6, 0.36, 0);
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

    // ═══ TRIPOD ═══════════════════════════════════════════════════════════
    const tripodGroup = new THREE.Group();
    tripodGroup.position.set(-0.6, 0, 0);

    // Three legs angled outward
    const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(Math.cos(a) * 0.07, 0.25, Math.sin(a) * 0.07);
      // Tilt outward
      const tiltAxis = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      leg.rotateOnAxis(tiltAxis, 0.18);
      // Move legs out at the base
      leg.position.x = Math.cos(a) * 0.13;
      leg.position.z = Math.sin(a) * 0.13;
      leg.castShadow = true;
      tripodGroup.add(leg);
    }

    // Top ring
    const tripodRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.012, 8, 24),
      metalMat
    );
    tripodRing.rotation.x = Math.PI / 2;
    tripodRing.position.y = 0.48;
    tripodGroup.add(tripodRing);

    // Wire gauze (grey square)
    const gauze = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.005, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.6, metalness: 0.4 })
    );
    gauze.position.y = 0.49;
    gauze.castShadow = true;
    tripodGroup.add(gauze);

    scene.add(tripodGroup);

    // ═══ WATER BATH (beaker on tripod) ════════════════════════════════════
    const bathGroup = new THREE.Group();
    bathGroup.position.set(-0.6, 0.49, 0);

    // Beaker (cylindrical)
    const beakerHeight = 0.18;
    const beakerRadius = 0.09;
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerRadius, beakerRadius, beakerHeight, 32, 1, true),
      glassMat
    );
    beaker.position.y = beakerHeight / 2;
    beaker.renderOrder = 2;
    bathGroup.add(beaker);

    // Beaker rim
    const beakerRim = new THREE.Mesh(
      new THREE.TorusGeometry(beakerRadius, 0.006, 6, 24),
      glassMat
    );
    beakerRim.rotation.x = Math.PI / 2;
    beakerRim.position.y = beakerHeight;
    bathGroup.add(beakerRim);

    // Beaker floor
    const beakerFloor = new THREE.Mesh(
      new THREE.CircleGeometry(beakerRadius, 32),
      glassMat
    );
    beakerFloor.rotation.x = -Math.PI / 2;
    beakerFloor.position.y = 0.001;
    bathGroup.add(beakerFloor);

    // Water inside
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerRadius * 0.96, beakerRadius * 0.96, beakerHeight * 0.75, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xb8d4ff, transparent: true, opacity: 0.65,
        roughness: 0.12, clearcoat: 0.5,
      })
    );
    water.position.y = beakerHeight * 0.375 + 0.005;
    water.renderOrder = 1;
    bathGroup.add(water);

    // Water surface (meniscus disc)
    const waterSurface = new THREE.Mesh(
      new THREE.CircleGeometry(beakerRadius * 0.96, 32),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = beakerHeight * 0.75 + 0.005;
    bathGroup.add(waterSurface);

    scene.add(bathGroup);

    // ═══ FOOD SAMPLE LABEL ════════════════════════════════════════════════
    // A small paper card on the bench showing "Sample A" or food name
    // (we'll use HTML for this, but add a 3D bookmark for atmosphere)

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      tubes, flameGroup, flameLight,
      outerFlame, midFlame, innerFlame,
      bathGroup, water, waterSurface,
      bubbles: [], droplets: [], splashes: [],
      tubeAnimations: [], // active tube position animations
      colorTransitions: [], // active liquid color transitions
      flameOn: false,
      bubblesOn: false,
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.35;
    let azimuth = Math.atan2(camera.position.x, camera.position.z);
    let elevation = Math.atan2(camera.position.y - lookAtY,
                               Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2));
    const radius = Math.sqrt(camera.position.x ** 2 + (camera.position.y - lookAtY) ** 2 + camera.position.z ** 2);

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

      // ── Tube animations (smooth lerp from→to over duration) ──
      for (let i = so.tubeAnimations.length - 1; i >= 0; i--) {
        const a = so.tubeAnimations[i];
        a.progress = Math.min(1, a.progress + dt / a.duration);
        const t = a.progress < 0.5
          ? 2 * a.progress * a.progress
          : 1 - Math.pow(-2 * a.progress + 2, 2) / 2; // ease in-out
        a.tube.position.x = a.fromX + (a.toX - a.fromX) * t;
        a.tube.position.y = a.fromY + (a.toY - a.fromY) * t;
        if (a.progress >= 1) {
          so.tubeAnimations.splice(i, 1);
          if (a.onComplete) a.onComplete();
        }
      }

      // ── Liquid color transitions ──
      for (let i = so.colorTransitions.length - 1; i >= 0; i--) {
        const c = so.colorTransitions[i];
        c.progress = Math.min(1, c.progress + dt / c.duration);
        const t = c.progress;
        // Find current segment in color stops
        let from, to, segT;
        if (c.stops.length === 2) {
          from = c.stops[0].color;
          to = c.stops[1].color;
          segT = t;
        } else {
          // multi-stop: find which segment t falls in
          let idx = 0;
          for (let j = 0; j < c.stops.length - 1; j++) {
            if (t >= c.stops[j].at && t <= c.stops[j + 1].at) {
              idx = j;
              break;
            }
          }
          from = c.stops[idx].color;
          to = c.stops[idx + 1].color;
          const segStart = c.stops[idx].at;
          const segEnd = c.stops[idx + 1].at;
          segT = (t - segStart) / (segEnd - segStart);
        }
        const fromR = ((from >> 16) & 0xff) / 255;
        const fromG = ((from >> 8) & 0xff) / 255;
        const fromB = (from & 0xff) / 255;
        const toR = ((to >> 16) & 0xff) / 255;
        const toG = ((to >> 8) & 0xff) / 255;
        const toB = (to & 0xff) / 255;
        const r = fromR + (toR - fromR) * segT;
        const g = fromG + (toG - fromG) * segT;
        const b = fromB + (toB - fromB) * segT;
        c.liquid.material.color.setRGB(r, g, b);
        c.meniscus.material.color.setRGB(r * 0.85, g * 0.85, b * 0.85);

        if (c.progress >= 1) {
          so.colorTransitions.splice(i, 1);
          if (c.onComplete) c.onComplete();
        }
      }

      // ── Flame animation (flicker scale) ──
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

      // ── Bubbles (rising in water bath) ──
      if (so.bubblesOn && Math.random() < 0.4) {
        // spawn a new bubble
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.008 + Math.random() * 0.006, 8, 8),
          new THREE.MeshPhysicalMaterial({
            color: 0xffffff, transparent: true, opacity: 0.7,
            roughness: 0.05, clearcoat: 0.7,
          })
        );
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.07;
        bubble.position.set(
          so.bathGroup.position.x + Math.cos(a) * r,
          0.5,
          Math.sin(a) * r
        );
        so.scene.add(bubble);
        so.bubbles.push({
          mesh: bubble,
          vy: 0.15 + Math.random() * 0.1,
          targetY: 0.62 + Math.random() * 0.02,
        });
      }
      for (let i = so.bubbles.length - 1; i >= 0; i--) {
        const b = so.bubbles[i];
        b.mesh.position.y += b.vy * dt;
        b.mesh.position.x += (Math.random() - 0.5) * 0.002;
        if (b.mesh.position.y > b.targetY) {
          so.scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          so.bubbles.splice(i, 1);
        }
      }

      // ── Drops + splashes (similar to titration v3) ──
      for (let i = so.droplets.length - 1; i >= 0; i--) {
        const d = so.droplets[i];
        d.vy -= 3.5 * dt;
        d.mesh.position.y += d.vy * dt;
        if (d.mesh.position.y < d.targetY) {
          // Splash
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

  // ─── Helper: spawn splash droplets ────────────────────────────────────
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

  // ─── Helper: drop a reagent into a tube ───────────────────────────────
  const dropReagent = (tubeIndex, color, count = 3, callback) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tubes[tubeIndex];
    const targetY = tube.position.y + (tube.userData.currentFill || 0.16);

    let dropped = 0;
    const drip = () => {
      playDrip();
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 12, 12),
        new THREE.MeshPhysicalMaterial({
          color, transparent: true, opacity: 0.92,
          roughness: 0.05, clearcoat: 0.8,
          emissive: color, emissiveIntensity: 0.15,
        })
      );
      drop.position.set(tube.position.x, tube.position.y + 0.55, tube.position.z);
      so.scene.add(drop);
      so.droplets.push({ mesh: drop, vy: 0, targetY, color });
      dropped++;
      if (dropped < count) {
        setTimeout(drip, 250);
      } else if (callback) {
        setTimeout(callback, 600);
      }
    };
    drip();
  };

  // ─── Helper: animate liquid color in a tube ───────────────────────────
  const transitionTubeColor = (tubeIndex, toColor, duration, callback) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tubes[tubeIndex];
    const liquid = tube.userData.liquidMesh;
    const meniscus = tube.userData.meniscusMesh;
    const currentColor = liquid.material.color.getHex();
    so.colorTransitions.push({
      liquid, meniscus,
      stops: [{ color: currentColor, at: 0 }, { color: toColor, at: 1 }],
      progress: 0, duration,
      onComplete: callback,
    });
  };

  // ─── Helper: multi-stop color transition (for Benedict's) ─────────────
  const transitionTubeColorMulti = (tubeIndex, stops, duration, callback) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tubes[tubeIndex];
    const liquid = tube.userData.liquidMesh;
    const meniscus = tube.userData.meniscusMesh;
    so.colorTransitions.push({
      liquid, meniscus,
      stops, progress: 0, duration,
      onComplete: callback,
    });
  };

  // ─── Helper: increase tube liquid level ───────────────────────────────
  const fillTubeLiquid = (tubeIndex, newFill) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tubes[tubeIndex];
    const liquid = tube.userData.liquidMesh;
    const meniscus = tube.userData.meniscusMesh;
    liquid.geometry.dispose();
    liquid.geometry = new THREE.LatheGeometry(buildTubeLiquidProfile(newFill), 32);
    meniscus.position.y = newFill;
    tube.userData.currentFill = newFill;
  };

  // ─── Helper: animate tube to new position ─────────────────────────────
  const animateTube = (tubeIndex, toX, toY, duration, onComplete) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const tube = so.tubes[tubeIndex];
    so.tubeAnimations.push({
      tube,
      fromX: tube.position.x, fromY: tube.position.y,
      toX, toY, progress: 0, duration, onComplete,
    });
  };

  // ─── Helper: chain animations with promises ───────────────────────────
  const animateTubePromise = (tubeIndex, toX, toY, duration) =>
    new Promise(resolve => animateTube(tubeIndex, toX, toY, duration, resolve));

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST PROCEDURES
  // ═══════════════════════════════════════════════════════════════════════════

  // Constants for tube positions
  const RACK_TUBE_Y = 0.10;
  const LIFT_Y = 0.55;
  const BATH_X = -0.6;
  const BATH_Y = 0.40;

  // ─── IODINE TEST (tube 0) ─────────────────────────────────────────────
  const runIodineTest = () => {
    setBusy(true);
    playPour(1.0);
    // Add iodine - brown drops fall in
    dropReagent(0, 0x9a5c1f, 4, () => {
      // Color change
      const positive = food.contains.starch;
      const finalColor = positive ? 0x1a1a3e : 0x9a7f3a; // blue-black or amber
      transitionTubeColor(0, finalColor, 1.2, () => {
        finishTest('iodine', positive, finalColor);
      });
    });
  };

  // ─── BENEDICT'S TEST (tube 1) — with heating ──────────────────────────
  const runBenedictsTest = async () => {
    setBusy(true);
    // Step 1: add Benedict's solution
    playPour(1.0);
    await new Promise(res => dropReagent(1, 0x4a90e2, 4, res));
    await new Promise(res => transitionTubeColor(1, 0x4a90e2, 0.8, res));
    await delay(300);

    // Step 2: move tube to water bath
    const tube = sceneObjects.current.tubes[1];
    const homeX = tube.position.x;
    const homeY = RACK_TUBE_Y;

    await animateTubePromise(1, homeX, LIFT_Y, 0.5);
    await animateTubePromise(1, BATH_X, LIFT_Y, 0.7);
    await animateTubePromise(1, BATH_X, BATH_Y, 0.5);
    await delay(300);

    // Step 3: light Bunsen, start bubbles
    playWhoosh();
    sceneObjects.current.flameGroup.visible = true;
    sceneObjects.current.flameLight.intensity = 0.8;
    sceneObjects.current.flameOn = true;
    sceneObjects.current.bubblesOn = true;
    setHiss(true);
    await delay(700);
    setBubble(true);
    await delay(500);

    // Step 4: color transition (long, visible)
    const positive = food.contains.sugar;
    if (positive) {
      await new Promise(res => transitionTubeColorMulti(1, [
        { color: 0x4a90e2, at: 0 },
        { color: 0x7fb95e, at: 0.25 },
        { color: 0xeaca5b, at: 0.5 },
        { color: 0xf09040, at: 0.75 },
        { color: 0xa84a2a, at: 1.0 },
      ], 6.0, res));
    } else {
      await delay(6000); // still wait, but stays blue
    }

    // Step 5: extinguish, bubbles off
    setBubble(false);
    sceneObjects.current.bubblesOn = false;
    await delay(300);
    sceneObjects.current.flameGroup.visible = false;
    sceneObjects.current.flameLight.intensity = 0;
    sceneObjects.current.flameOn = false;
    setHiss(false);
    await delay(400);

    // Step 6: return tube to rack
    await animateTubePromise(1, BATH_X, LIFT_Y, 0.5);
    await animateTubePromise(1, homeX, LIFT_Y, 0.7);
    await animateTubePromise(1, homeX, homeY, 0.5);
    await delay(300);

    const finalColor = positive ? 0xa84a2a : 0x4a90e2;
    finishTest('benedicts', positive, finalColor);
  };

  // ─── BIURET TEST (tube 2) — two reagents ──────────────────────────────
  const runBiuretTest = async () => {
    setBusy(true);
    playPour(0.8);
    await new Promise(res => dropReagent(2, 0xeeeeee, 3, res));
    await new Promise(res => transitionTubeColor(2, 0xe5e3d6, 0.6, res));
    await delay(500);

    playPour(0.8);
    await new Promise(res => dropReagent(2, 0x4a90e2, 3, res));
    await new Promise(res => transitionTubeColor(2, 0x4a90e2, 0.8, res));
    await delay(700);

    const positive = food.contains.protein;
    if (positive) {
      await new Promise(res => transitionTubeColor(2, 0x8a4a9b, 2.5, res));
    } else {
      await delay(2000);
    }

    const finalColor = positive ? 0x8a4a9b : 0x4a90e2;
    finishTest('biuret', positive, finalColor);
  };

  // ─── EMULSION TEST (tube 3) — ethanol then water ──────────────────────
  const runEmulsionTest = async () => {
    setBusy(true);
    playPour(0.8);
    await new Promise(res => dropReagent(3, 0xf0f0f0, 4, res));
    await delay(500);

    playPour(0.8);
    await new Promise(res => dropReagent(3, 0xc5deff, 4, res));

    // Brief shake animation
    const tube = sceneObjects.current.tubes[3];
    const baseX = tube.position.x;
    for (let i = 0; i < 4; i++) {
      await animateTubePromise(3, baseX + 0.02, tube.position.y, 0.06);
      await animateTubePromise(3, baseX - 0.02, tube.position.y, 0.06);
    }
    await animateTubePromise(3, baseX, tube.position.y, 0.06);
    await delay(400);

    const positive = food.contains.lipid;
    const finalColor = positive ? 0xfafafa : 0xe8edf0;
    if (positive) {
      await new Promise(res => transitionTubeColor(3, finalColor, 1.5, res));
    } else {
      await new Promise(res => transitionTubeColor(3, finalColor, 1.0, res));
    }
    await delay(300);

    finishTest('emulsion', positive, finalColor);
  };

  const finishTest = (testId, positive, finalColor) => {
    playChime();
    setCompleted(prev => ({
      ...prev,
      [testId]: { positive, color: finalColor }
    }));
    setTubeColors(prev => {
      const next = [...prev];
      const idx = TESTS.findIndex(t => t.id === testId);
      next[idx] = finalColor;
      return next;
    });
    setBusy(false);
    setPhase('observe');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE TRANSITIONS
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('menu');
  };

  const startTest = (testId) => {
    setCurrentTest(testId);
    setTestStep(0);
    setPhase('running');
    if (testId === 'iodine') runIodineTest();
    else if (testId === 'benedicts') runBenedictsTest();
    else if (testId === 'biuret') runBiuretTest();
    else if (testId === 'emulsion') runEmulsionTest();
  };

  const backToMenu = () => {
    setCurrentTest(null);
    // Check if all 4 are done
    const doneCount = Object.keys(completed).length;
    if (doneCount >= 4) {
      setPhase('results');
    } else {
      setPhase('menu');
    }
  };

  const reset = () => {
    setPhase('menu');
    setCompleted({});
    setCurrentTest(null);
    setTubeColors([FOOD_COLOR, FOOD_COLOR, FOOD_COLOR, FOOD_COLOR]);
    // Reset tube liquid colors in scene
    const so = sceneObjects.current;
    if (so && so.tubes) {
      so.tubes.forEach((tube, i) => {
        tube.userData.liquidMesh.material.color.setHex(FOOD_COLOR);
        tube.userData.meniscusMesh.material.color.setHex(0xd0c19a);
      });
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  // Determine deduced food name from results
  const allDone = Object.keys(completed).length === 4;
  const deducedProfile = allDone ? {
    starch: completed.iodine?.positive ?? false,
    sugar: completed.benedicts?.positive ?? false,
    protein: completed.biuret?.positive ?? false,
    lipid: completed.emulsion?.positive ?? false,
  } : null;
  const deducedFood = deducedProfile
    ? FOODS.find(f => 
        f.contains.starch === deducedProfile.starch &&
        f.contains.sugar === deducedProfile.sugar &&
        f.contains.protein === deducedProfile.protein &&
        f.contains.lipid === deducedProfile.lipid)
    : null;

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
            <span style={{ fontStyle: 'italic' }}>Food</span> Tests
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
        {/* Tube labels (A, B, C, D) */}
        {phase !== 'intro' && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-600 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">A · Iodine</div>
            <div className="text-right">B · Benedict's</div>
            <div className="text-right">C · Biuret</div>
            <div className="text-right">D · Emulsion</div>
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
              An <span style={{ fontStyle: 'italic' }}>unknown food sample</span> is in your four test tubes. Use the four standard food tests to identify which biological molecules it contains.
            </p>
            <p className="text-xs opacity-65 mb-4">
              You'll test for starch, reducing sugar, protein, and lipid. Watch closely — each test gives a different colour change.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* MENU */}
        {phase === 'menu' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-3"
                 style={{ fontFamily: mono, letterSpacing: '0.28em' }}>
              Choose a test · {Object.keys(completed).length} of 4 complete
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TESTS.map(test => {
                const done = completed[test.id];
                return (
                  <button key={test.id}
                          onClick={() => !done && startTest(test.id)}
                          disabled={!!done}
                          className="py-3 px-3 text-left active:scale-95 transition disabled:opacity-100"
                          style={{
                            background: done
                              ? (done.positive ? 'rgba(76,175,80,0.15)' : 'rgba(232,228,216,0.05)')
                              : 'rgba(232,228,216,0.08)',
                            border: '1px solid rgba(232,228,216,0.15)',
                            fontFamily: mono,
                          }}>
                    <div className="text-[10px] opacity-55 uppercase mb-1"
                         style={{ letterSpacing: '0.18em' }}>
                      {done ? (done.positive ? '✓ positive' : '— negative') : 'pending'}
                    </div>
                    <div className="text-sm leading-tight" style={{ fontWeight: 500, fontFamily: serif }}>
                      {test.name}
                    </div>
                    <div className="text-[10px] opacity-50 mt-0.5">
                      for {test.biomolecule}
                    </div>
                  </button>
                );
              })}
            </div>
            {Object.keys(completed).length === 4 && (
              <button onClick={() => setPhase('results')}
                      className="w-full mt-3 py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(180deg, #ec407a 0%, #c2185b 100%)',
                               color: 'white', fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                See Final Results <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* RUNNING */}
        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              In progress · {TESTS.find(t => t.id === currentTest)?.name}
            </div>
            <p className="text-sm leading-snug opacity-80 mb-3">
              {currentTest === 'iodine' && 'Adding iodine solution. Watch the colour of the food sample.'}
              {currentTest === 'benedicts' && "Adding Benedict's solution, then heating in the water bath. Watch the slow colour change."}
              {currentTest === 'biuret' && 'Adding sodium hydroxide, then copper sulfate. Watch for violet.'}
              {currentTest === 'emulsion' && 'Adding ethanol, then water. Shaking. Watch for cloudiness.'}
            </p>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              observing...
            </div>
          </div>
        )}

        {/* OBSERVE (result of last test) */}
        {phase === 'observe' && currentTest && completed[currentTest] && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Observation · {TESTS.find(t => t.id === currentTest)?.name}
            </div>
            <div className="mb-4">
              {completed[currentTest].positive ? (
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl" style={{ fontWeight: 500 }}>Positive</span>
                    <span className="text-xs opacity-65">— {TESTS.find(t => t.id === currentTest)?.biomolecule} detected</span>
                  </div>
                  <p className="text-xs opacity-70 leading-snug">
                    {currentTest === 'iodine' && 'The solution turned blue-black, indicating starch is present.'}
                    {currentTest === 'benedicts' && 'A brick-red precipitate formed on heating, indicating reducing sugar is present.'}
                    {currentTest === 'biuret' && 'The solution turned violet, indicating protein is present.'}
                    {currentTest === 'emulsion' && 'A cloudy white emulsion formed, indicating lipid is present.'}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl" style={{ fontWeight: 500 }}>Negative</span>
                    <span className="text-xs opacity-65">— no {TESTS.find(t => t.id === currentTest)?.biomolecule}</span>
                  </div>
                  <p className="text-xs opacity-70 leading-snug">
                    {currentTest === 'iodine' && 'The solution stayed amber/brown. Starch is absent.'}
                    {currentTest === 'benedicts' && 'The solution stayed blue. Reducing sugar is absent.'}
                    {currentTest === 'biuret' && 'The solution stayed blue. Protein is absent.'}
                    {currentTest === 'emulsion' && 'The solution stayed clear. Lipid is absent.'}
                  </p>
                </div>
              )}
            </div>
            <button onClick={backToMenu}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <ArrowLeft size={14} /> {Object.keys(completed).length === 4 ? 'Show All Results' : 'Back to Tests'}
            </button>
          </div>
        )}
      </div>

      {/* RESULTS MODAL */}
      {phase === 'results' && allDone && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase text-stone-500"
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Results</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Food <span style={{ fontStyle: 'italic' }}>identified</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4" style={{ fontFamily: mono }}>
              {TESTS.map(test => {
                const res = completed[test.id];
                return (
                  <div key={test.id} className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">{test.name}</span>
                    <span style={{
                      color: res.positive ? '#2e7d32' : '#9e9e9e',
                      fontWeight: 500,
                    }}>
                      {res.positive ? `+ ${test.biomolecule}` : `— no ${test.biomolecule}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-stone-100 rounded-sm p-4 mb-4">
              <div className="text-[10px] uppercase text-stone-500 mb-1"
                   style={{ fontFamily: mono, letterSpacing: '0.25em' }}>
                The unknown sample was
              </div>
              <div className="text-xl" style={{ fontWeight: 600 }}>
                {food.name}
              </div>
              {deducedFood && deducedFood.name === food.name ? (
                <div className="text-xs text-green-700 mt-1 flex items-center gap-1">
                  <Check size={12} /> Your results match exactly.
                </div>
              ) : (
                <div className="text-xs text-stone-600 mt-1" style={{ fontStyle: 'italic' }}>
                  Your test profile suggests: {deducedFood ? deducedFood.name : 'an unidentified composition'}
                </div>
              )}
            </div>

            <button onClick={reset}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> Try Another Sample
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
