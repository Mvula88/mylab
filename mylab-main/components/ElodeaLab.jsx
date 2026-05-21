'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// ELODEA / PONDWEED LAB · v1
// NSSCO Biology Practical — Investigating the effect of light intensity
// (and other factors) on the rate of photosynthesis using pondweed.
// ============================================================================

const DISTANCE_OPTIONS = [10, 15, 20, 30, 40, 60]; // cm
const CO2_LEVELS = [
  { id: 'low',  label: 'Low (no NaHCO₃)',       mult: 0.45 },
  { id: 'med',  label: 'Medium (0.5% NaHCO₃)',  mult: 1.00 },
  { id: 'high', label: 'High (2% NaHCO₃)',      mult: 1.45 },
];
const TEMP_LEVELS = [
  { id: 'cold', label: '10 °C',  mult: 0.50 },
  { id: 'warm', label: '20 °C',  mult: 1.00 },
  { id: 'hot',  label: '35 °C',  mult: 1.55 }, // optimum-ish
];

const COUNT_DURATION_SIMULATED_S = 60;   // what the student "sees" on the timer
const COUNT_DURATION_REAL_S      = 15;   // wall-clock time we actually wait
const TIME_COMPRESSION = COUNT_DURATION_SIMULATED_S / COUNT_DURATION_REAL_S;

// Compute expected bubbles/min for a configuration. Light follows inverse-square,
// modulated by CO2 and temp multipliers, then saturates near a plateau.
function expectedRate(distance, co2Mult, tempMult) {
  // Reference: at d=20 cm, med CO2, warm temp → ~60 bubbles/min
  const base = 24000 / (distance * distance); // d=20 → 60
  const raw = base * co2Mult * tempMult;
  // Soft saturation around 130
  const cap = 130;
  return cap * (1 - Math.exp(-raw / cap));
}

// ─── Boiling tube geometry (taller, narrower than the food-test tube) ──────
function buildTallTubeProfile(height = 0.7, radius = 0.075) {
  const pts = [new THREE.Vector2(0.001, 0)];
  const segs = 8;
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = radius * Math.sin(a);
    const y = radius * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  pts.push(new THREE.Vector2(radius, height));
  pts.push(new THREE.Vector2(radius * 1.08, height + 0.012));
  return pts;
}

// ─── Build an Elodea sprig: a curved stem with leafy whorls ────────────────
function buildElodeaSprig() {
  const group = new THREE.Group();

  // Stem — segments along a gentle curve
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x335922, roughness: 0.75, metalness: 0,
  });
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x4a8030, roughness: 0.7, metalness: 0,
    side: THREE.DoubleSide, transparent: true, opacity: 0.96,
  });

  const stemSegments = 10;
  const stemHeight = 0.42;
  const points = [];
  for (let i = 0; i <= stemSegments; i++) {
    const t = i / stemSegments;
    // Slight lateral sway
    const x = Math.sin(t * Math.PI) * 0.012;
    const y = t * stemHeight;
    points.push(new THREE.Vector3(x, y, 0));
  }
  const stemCurve = new THREE.CatmullRomCurve3(points);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 24, 0.005, 6, false);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  group.add(stem);

  // Leafy whorls — small flat planes arranged radially every few cm
  const whorlCount = 7;
  for (let i = 0; i < whorlCount; i++) {
    const t = (i + 0.5) / whorlCount;
    const y = t * stemHeight;
    const center = stemCurve.getPoint(t);
    const leavesPerWhorl = 4;
    for (let j = 0; j < leavesPerWhorl; j++) {
      const a = (j / leavesPerWhorl) * Math.PI * 2 + i * 0.4;
      const leafGeo = new THREE.PlaneGeometry(0.022, 0.038);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      // Position the leaf base at the stem, extending outward
      const out = 0.018;
      leaf.position.set(
        center.x + Math.cos(a) * out,
        y - 0.005,
        Math.sin(a) * out,
      );
      // Orient: leaf normal points outward, length pointing slightly upward
      leaf.lookAt(
        center.x + Math.cos(a) * (out + 0.05),
        y + 0.02,
        Math.sin(a) * (out + 0.05),
      );
      leaf.rotateX(Math.PI / 2);
      group.add(leaf);
    }
  }

  return group;
}

export default function ElodeaLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'setup' → 'counting' → 'results' (after >=3 trials)
  const [phase, setPhase] = useState('intro');
  const [distance, setDistance] = useState(20);
  const [co2Id, setCo2Id] = useState('med');
  const [tempId, setTempId] = useState('warm');
  const [count, setCount] = useState(0);
  const [simulatedTime, setSimulatedTime] = useState(0); // 0..60
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Mirrors for the animation loop
  const countingRef = useRef({
    running: false,
    rate: 0,
    nextBubbleAt: 0,
    simulatedTime: 0,
    count: 0,
  });

  const co2 = CO2_LEVELS.find(c => c.id === co2Id);
  const temp = TEMP_LEVELS.find(t => t.id === tempId);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.85).toDestination();

      // Bubble plip (small water-blip)
      const bubble = new Tone.MembraneSynth({
        pitchDecay: 0.04,
        octaves: 4,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 },
      }).connect(master);
      bubble.volume.value = -16;

      // Underwater ambience (low-passed brown noise)
      const ambNoise = new Tone.Noise('brown');
      const ambLP = new Tone.Filter(220, 'lowpass');
      const ambGain = new Tone.Gain(0).connect(master);
      ambNoise.chain(ambLP, ambGain);
      ambNoise.start();

      // Click for UI
      const click = new Tone.MetalSynth({
        frequency: 250, envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;

      // Chime
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -10;

      audioRef.current = {
        initialized: true, master, bubble, ambGain, click, chime,
      };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playBubble = () => {
    if (muted || !audioRef.current.initialized) return;
    const note = 180 + Math.random() * 120; // 180-300 Hz
    audioRef.current.bubble.triggerAttackRelease(note, '32n');
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  const setAmbience = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.ambGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.08 : 0, 0.4);
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
    scene.fog = new THREE.Fog(0xe8e4d8, 7, 18);

    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0.2, 1.0, 2.7);
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

    // ─── Lighting ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff0d4, 0.55));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
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

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Lamp light — point light at the bulb that scales with distance to tank
    const lampLight = new THREE.PointLight(0xfff4c8, 0.9, 1.8, 2);
    scene.add(lampLight);

    // ─── Shared materials ─────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.16, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x26282d, metalness: 0.88, roughness: 0.32 });

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

    // ═══ BOILING TUBE WITH ELODEA + WATER ═══════════════════════════════════
    // Use a tall, wide boiling tube held in a stand at the centre.
    const TANK_X = 0.0;
    const TANK_Z = 0.0;

    const tubeHeight = 0.72;
    const tubeRadius = 0.075;
    const tubeProfile = buildTallTubeProfile(tubeHeight, tubeRadius);

    const tubeGlass = new THREE.Mesh(
      new THREE.LatheGeometry(tubeProfile, 32), glassMat
    );
    tubeGlass.position.set(TANK_X, 0.03, TANK_Z);
    tubeGlass.castShadow = true;
    tubeGlass.renderOrder = 2;
    scene.add(tubeGlass);

    // Water inside the tube
    const waterHeight = tubeHeight * 0.92;
    const waterRadius = tubeRadius * 0.96;
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(waterRadius, waterRadius, waterHeight, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xa3c8e8, transparent: true, opacity: 0.55,
        roughness: 0.12, clearcoat: 0.4,
      })
    );
    water.position.set(TANK_X, 0.03 + waterHeight / 2 + 0.02, TANK_Z);
    water.renderOrder = 1;
    scene.add(water);

    const waterSurface = new THREE.Mesh(
      new THREE.CircleGeometry(waterRadius, 32),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, roughness: 0.2, transparent: true, opacity: 0.8,
        side: THREE.DoubleSide,
      })
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.set(TANK_X, 0.03 + waterHeight + 0.02, TANK_Z);
    scene.add(waterSurface);

    // Tube clamp stand (a vertical metal rod with a clamp around the tube)
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.025, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x2c2620, roughness: 0.7, metalness: 0.3 })
    );
    standBase.position.set(TANK_X - 0.22, 0.0375, TANK_Z);
    standBase.castShadow = true; standBase.receiveShadow = true;
    scene.add(standBase);

    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.9, 12), metalMat
    );
    standRod.position.set(TANK_X - 0.27, 0.5, TANK_Z);
    standRod.castShadow = true;
    scene.add(standRod);

    const clampArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.014, 0.022), metalMat
    );
    clampArm.position.set(TANK_X - 0.18, 0.45, TANK_Z);
    clampArm.castShadow = true;
    scene.add(clampArm);

    const clampRing = new THREE.Mesh(
      new THREE.TorusGeometry(tubeRadius + 0.012, 0.005, 8, 24), metalMat
    );
    clampRing.rotation.x = Math.PI / 2;
    clampRing.position.set(TANK_X, 0.45, TANK_Z);
    scene.add(clampRing);

    // Elodea sprig — placed inside the tube near the bottom, stem upright,
    // cut end at the top emitting bubbles.
    const elodeaGroup = buildElodeaSprig();
    elodeaGroup.position.set(TANK_X - 0.015, 0.035, TANK_Z);
    // Tilt slightly to look natural
    elodeaGroup.rotation.z = 0.08;
    scene.add(elodeaGroup);

    // Bubble emit point: top of the stem (≈ y = 0.035 + stemHeight 0.42)
    const emitPoint = new THREE.Vector3(TANK_X - 0.005, 0.46, TANK_Z + 0.01);

    // ═══ FUNNEL + GAS-COLLECTION TUBE (decorative, classic IGCSE setup) ═════
    const funnelGroup = new THREE.Group();
    funnelGroup.position.set(TANK_X, 0.5, TANK_Z);
    const funnel = new THREE.Mesh(
      new THREE.ConeGeometry(0.058, 0.11, 24, 1, true),
      glassMat
    );
    funnel.position.y = 0.055;
    funnelGroup.add(funnel);
    // Neck
    const funnelNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.06, 16, 1, true),
      glassMat
    );
    funnelNeck.position.y = 0.14;
    funnelGroup.add(funnelNeck);
    // Inverted test tube at the top (collects gas)
    const collectTubeHeight = 0.18;
    const collectTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, collectTubeHeight, 24, 1, true),
      glassMat
    );
    collectTube.position.y = 0.14 + collectTubeHeight / 2;
    funnelGroup.add(collectTube);
    // Closed top
    const collectCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      glassMat
    );
    collectCap.position.y = 0.14 + collectTubeHeight;
    funnelGroup.add(collectCap);
    // Initial gas-water meniscus (start near the top — full of water)
    const meniscus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, 0.005, 24),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, transparent: true, opacity: 0.85, side: THREE.DoubleSide,
      })
    );
    meniscus.position.y = 0.14 + collectTubeHeight - 0.005;
    funnelGroup.add(meniscus);
    scene.add(funnelGroup);

    // ═══ LAMP ON A MOVABLE STAND ════════════════════════════════════════════
    const lampGroup = new THREE.Group();
    // We move this on x as the slider changes; current home is left side
    lampGroup.position.set(-0.6, 0.025, 0.0);

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.085, 0.028, 24),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    lampBase.position.y = 0.014;
    lampBase.castShadow = true; lampBase.receiveShadow = true;
    lampGroup.add(lampBase);
    const lampPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.55, 12),
      new THREE.MeshStandardMaterial({ color: 0x383a3e, metalness: 0.6, roughness: 0.4 })
    );
    lampPost.position.y = 0.3;
    lampPost.castShadow = true;
    lampGroup.add(lampPost);
    // Lamp head — a hemisphere "shade" with the open side facing the tank (i.e., +x)
    const lampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x2a2c2e, metalness: 0.4, roughness: 0.45, side: THREE.DoubleSide })
    );
    lampShade.position.y = 0.58;
    lampShade.rotation.z = -Math.PI / 2; // opens toward +x
    lampShade.castShadow = true;
    lampGroup.add(lampShade);
    // Glowing bulb inside
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 18, 14),
      new THREE.MeshBasicMaterial({ color: 0xfff2c0 })
    );
    bulb.position.set(0.02, 0.58, 0);
    lampGroup.add(bulb);
    scene.add(lampGroup);

    // ═══ RULER on the bench between the lamp base and the tube ══════════════
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.004, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf2e8c8, roughness: 0.8 })
    );
    ruler.position.set(-0.25, 0.027, 0.15);
    ruler.castShadow = true; ruler.receiveShadow = true;
    scene.add(ruler);
    // Tick marks
    const tickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    for (let i = 0; i <= 10; i++) {
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.002, 0.001, 0.018), tickMat
      );
      tick.position.set(-0.25 - 0.45 + i * 0.09, 0.029, 0.15 + 0.018);
      scene.add(tick);
    }

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      lampGroup, lampLight, bulb,
      water, waterSurface,
      elodeaGroup, emitPoint,
      meniscus,
      meniscusBaseY: 0.14 + collectTubeHeight - 0.005,
      funnelGroup, collectTubeHeight,
      bubbles: [],
      gasLevel: 0,            // 0..1 of how much the collect tube has filled
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
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

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════════════════════════
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // ── Elodea sway ──
      so.elodeaGroup.rotation.z = 0.08 + Math.sin(so.time * 0.8) * 0.02;
      so.elodeaGroup.rotation.x = Math.cos(so.time * 0.6) * 0.01;

      // ── Bubble emission and movement ──
      const counting = countingRef.current;
      if (counting.running) {
        // Advance simulated time
        counting.simulatedTime = Math.min(
          COUNT_DURATION_SIMULATED_S,
          counting.simulatedTime + dt * TIME_COMPRESSION,
        );
        setSimulatedTime(counting.simulatedTime);

        // Emit bubbles based on rate (bubbles per minute)
        const rateBpm = counting.rate;
        const rateBps = rateBpm / 60; // bubbles per simulated second
        const interval = rateBps > 0 ? 1 / rateBps : 99999; // seconds between bubbles
        counting.nextBubbleAt -= dt * TIME_COMPRESSION;
        while (counting.nextBubbleAt <= 0 && counting.simulatedTime < COUNT_DURATION_SIMULATED_S) {
          // Spawn a bubble
          const b = new THREE.Mesh(
            new THREE.SphereGeometry(0.005 + Math.random() * 0.004, 8, 8),
            new THREE.MeshPhysicalMaterial({
              color: 0xffffff, transparent: true, opacity: 0.7,
              roughness: 0.05, clearcoat: 0.7,
            })
          );
          const jitterX = (Math.random() - 0.5) * 0.012;
          const jitterZ = (Math.random() - 0.5) * 0.012;
          b.position.set(so.emitPoint.x + jitterX, so.emitPoint.y, so.emitPoint.z + jitterZ);
          so.scene.add(b);
          so.bubbles.push({
            mesh: b,
            vy: 0.12 + Math.random() * 0.05,
            wobble: Math.random() * Math.PI * 2,
            targetY: so.meniscusBaseY + so.elodeaGroup.position.y, // approx water surface
          });
          counting.count++;
          setCount(counting.count);
          playBubble();
          // schedule next bubble; add some randomness
          counting.nextBubbleAt += interval * (0.7 + Math.random() * 0.6);
        }

        // Stop when 60 simulated seconds reached
        if (counting.simulatedTime >= COUNT_DURATION_SIMULATED_S) {
          counting.running = false;
          // Trigger finalize on the React side
          setTimeout(() => finalizeTrial(), 50);
        }
      }

      // Move existing bubbles
      for (let i = so.bubbles.length - 1; i >= 0; i--) {
        const b = so.bubbles[i];
        b.wobble += dt * 4;
        b.mesh.position.y += b.vy * dt;
        b.mesh.position.x += Math.sin(b.wobble) * 0.0015;
        if (b.mesh.position.y > b.targetY) {
          so.scene.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          so.bubbles.splice(i, 1);
          // Add to gas accumulation in the collect tube
          so.gasLevel = Math.min(1, so.gasLevel + 0.005);
          const baseY = so.meniscusBaseY;
          const drop = so.collectTubeHeight - 0.02;
          so.meniscus.position.y = baseY - so.gasLevel * drop;
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

  // ─── Position the lamp & its light based on the selected distance ─────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.lampGroup) return;
    // Tube is at x=0; lamp shines from -x toward +x.
    const sceneX = -(distance / 80); // 10cm → -0.125, 60cm → -0.75
    so.lampGroup.position.x = sceneX;
    // Lamp intensity scales with 1/d² (also affects flicker) - just intensity
    const intensity = Math.min(1.5, 18 / (distance * distance) * 30);
    so.lampLight.intensity = intensity;
    so.lampLight.position.set(sceneX + 0.05, 0.58, 0);
    // Bulb glow brightness
    if (so.bulb && so.bulb.material) {
      so.bulb.material.color.setRGB(1, 0.95 - distance * 0.003, 0.75 - distance * 0.005);
    }
  }, [distance]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setAmbience(true);
    setPhase('setup');
  };

  const startCount = () => {
    playClick();
    const rate = expectedRate(distance, co2.mult, temp.mult);
    // Capture the user's selections at start time so finalizeTrial (which may
    // be called from a deferred animation-loop callback with stale React
    // closures) can build the trial record from authoritative values.
    countingRef.current = {
      running: true,
      rate,
      nextBubbleAt: 0.3,
      simulatedTime: 0,
      count: 0,
      distance,
      co2Id: co2.id,
      tempId: temp.id,
      expected: rate,
    };
    // Reset the collect tube meniscus
    const so = sceneObjects.current;
    if (so.meniscus) {
      so.gasLevel = 0;
      so.meniscus.position.y = so.meniscusBaseY;
    }
    setCount(0);
    setSimulatedTime(0);
    setPhase('counting');
  };

  const stopCount = () => {
    countingRef.current.running = false;
    finalizeTrial();
  };

  const finalizeTrial = () => {
    const c = countingRef.current;
    const rec = {
      distance: c.distance,
      co2: c.co2Id,
      temp: c.tempId,
      count: c.count,
      rate: c.simulatedTime > 0 ? c.count * (60 / c.simulatedTime) : 0,
      expected: c.expected,
    };
    playChime();
    setTrials(prev => [...prev, rec]);
    setPhase('setup');
  };

  const showResults = () => {
    setPhase('results');
  };

  const resetSession = () => {
    setTrials([]);
    setCount(0);
    setSimulatedTime(0);
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  // Mini sparkline for trials (rate vs 1/d²)
  const renderGraph = () => {
    if (trials.length < 2) return null;
    // x = 1/d², y = rate
    const pts = trials.map(t => ({ x: 1 / (t.distance * t.distance), y: t.rate }));
    const xMax = Math.max(...pts.map(p => p.x));
    const yMax = Math.max(...pts.map(p => p.y), 1);
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
              style={{ fontFamily: mono }}>rate</text>
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
            NSSCO · Biology Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Pondweed</span> · Rate of Photosynthesis
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
          <div className="absolute top-2 right-3 text-[10px] text-stone-600 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">Trials · {trials.length}</div>
          </div>
        )}
        {phase === 'counting' && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>bubbles : <span style={{ fontWeight: 600 }}>{count}</span></div>
            <div>time    : {simulatedTime.toFixed(1)}s / {COUNT_DURATION_SIMULATED_S}s</div>
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
              Investigate how <span style={{ fontStyle: 'italic' }}>light intensity</span>, CO₂ concentration and temperature affect the rate of photosynthesis in Elodea pondweed.
            </p>
            <p className="text-xs opacity-65 mb-4">
              You count the O₂ bubbles released from the cut stem over one minute. Each minute of "experiment time" runs in {COUNT_DURATION_REAL_S} seconds of real time. Vary one factor at a time and look for the trend.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* SETUP */}
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

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[10px] opacity-65 uppercase mb-1"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  CO₂
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {CO2_LEVELS.map(c => (
                    <button key={c.id} onClick={() => setCo2Id(c.id)}
                            className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99]"
                            style={{
                              background: c.id === co2Id
                                ? 'rgba(232,228,216,0.22)'
                                : 'rgba(232,228,216,0.07)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] opacity-65 uppercase mb-1"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  Temperature
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {TEMP_LEVELS.map(t => (
                    <button key={t.id} onClick={() => setTempId(t.id)}
                            className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99]"
                            style={{
                              background: t.id === tempId
                                ? 'rgba(232,228,216,0.22)'
                                : 'rgba(232,228,216,0.07)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={startCount}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Count Bubbles
              </button>
              <button onClick={showResults} disabled={trials.length === 0}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                See Results
              </button>
            </div>

            {trials.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto pr-1"
                   style={{ fontFamily: mono, fontSize: '10px' }}>
                <div className="opacity-50 mb-1 grid grid-cols-5 gap-1"
                     style={{ letterSpacing: '0.1em' }}>
                  <div>d (cm)</div><div>CO₂</div><div>T</div><div>count</div><div>rate/min</div>
                </div>
                {trials.map((t, i) => (
                  <div key={i} className="grid grid-cols-5 gap-1 py-0.5">
                    <div>{t.distance}</div>
                    <div className="opacity-70">{t.co2}</div>
                    <div className="opacity-70">{t.temp}</div>
                    <div>{t.count}</div>
                    <div style={{ fontWeight: 600 }}>{t.rate.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COUNTING */}
        {phase === 'counting' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              In progress · {distance} cm · {co2.label} · {temp.label}
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              {count}<span className="opacity-50 text-base"> bubbles</span>
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${(simulatedTime / COUNT_DURATION_SIMULATED_S) * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <button onClick={stopCount}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(232,228,216,0.1)', color: '#e8e4d8',
                             border: '1px solid rgba(232,228,216,0.25)',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <Square size={11} /> Stop Early
            </button>
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
                  Photosynthesis <span style={{ fontStyle: 'italic' }}>rate</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>

            <div className="space-y-1 text-xs mb-4" style={{ fontFamily: mono }}>
              <div className="opacity-50 grid grid-cols-5 gap-1"
                   style={{ letterSpacing: '0.1em' }}>
                <div>d (cm)</div><div>CO₂</div><div>T</div><div>count</div><div>rate/min</div>
              </div>
              {trials.map((t, i) => (
                <div key={i} className="grid grid-cols-5 gap-1">
                  <div>{t.distance}</div>
                  <div>{t.co2}</div>
                  <div>{t.temp}</div>
                  <div>{t.count}</div>
                  <div style={{ fontWeight: 600 }}>{t.rate.toFixed(0)}</div>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 text-stone-100 p-3 mb-4 rounded-sm">
              {renderGraph()}
              <div className="text-[9px] opacity-55 mt-1"
                   style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
                rate vs 1/distance² — should be roughly linear at low intensity
              </div>
            </div>

            <button onClick={resetSession}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> Start a New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
