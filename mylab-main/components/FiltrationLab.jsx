'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Play,
} from 'lucide-react';

// ============================================================================
// FILTRATION / CRYSTALLISATION LAB · v1
// NSSCO Chemistry Practical — Obtaining a sample of dry sodium chloride
// from rock salt (rock salt = NaCl + sand). Maps to NSSCO 2024 Paper 3 Q2.
//
// Procedure (the steps and vocabulary the exam tests):
//   1. Grind rock salt with a mortar and pestle.
//   2. Add to water in a beaker, heat while stirring with a glass rod
//      (to dissolve the sodium chloride; the sand stays undissolved).
//   3. Filter the mixture. The sand stays in the filter paper (the residue);
//      the salt solution passes through (the filtrate).
//   4. Evaporate the filtrate to crystallise the sodium chloride.
//   5. The crystals are dried.
// ============================================================================

const STEPS = [
  {
    id: 'grind',
    title: '1 · Grind the rock salt',
    blurb: 'A mortar and pestle is used to grind the rock salt into smaller pieces so it dissolves faster.',
  },
  {
    id: 'dissolve',
    title: '2 · Dissolve in hot water',
    blurb: 'The crushed rock salt is added to water in a beaker and heated while stirring. Sodium chloride dissolves; sand does not.',
  },
  {
    id: 'filter',
    title: '3 · Filter the mixture',
    blurb: 'The mixture is poured through filter paper. The sand stays in the filter paper as the residue; the salt solution that passes through is the filtrate.',
  },
  {
    id: 'evaporate',
    title: '4 · Evaporate the filtrate',
    blurb: 'The filtrate is heated in an evaporating basin. Water evaporates, leaving solid sodium chloride crystals behind.',
  },
];

const QUIZ = [
  {
    q: 'What is the apparatus used to grind the rock salt in step 1?',
    options: ['Mortar and pestle', 'Crucible and tongs', 'Test tube and stopper', 'Beaker and stirring rod'],
    correct: 0,
  },
  {
    q: 'What term is given to the sand that stays in the filter paper after step 3?',
    options: ['Filtrate', 'Solvent', 'Residue', 'Solution'],
    correct: 2,
  },
  {
    q: 'What term is given to the salt solution that passes through the filter paper?',
    options: ['Residue', 'Filtrate', 'Precipitate', 'Decant'],
    correct: 1,
  },
  {
    q: 'Why is the water heated in step 2?',
    options: [
      'To kill bacteria in the water',
      'To make the sand dissolve',
      'To increase the solubility of sodium chloride and speed up dissolving',
      'To sterilise the apparatus',
    ],
    correct: 2,
  },
  {
    q: 'What must be done to the filtrate to obtain dry sodium chloride crystals?',
    options: [
      'Filter it a second time',
      'Cool it in the fridge',
      'Evaporate the water from it',
      'Add more rock salt to it',
    ],
    correct: 2,
  },
];

export default function FiltrationLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → running → quiz → result
  const [phase, setPhase] = useState('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

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
      const grind = new Tone.Noise('pink');
      const grindFilter = new Tone.Filter(1200, 'bandpass');
      grindFilter.Q.value = 1.2;
      const grindGain = new Tone.Gain(0).connect(master);
      grind.chain(grindFilter, grindGain);
      grind.start();
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
      const bubbleLP = new Tone.Filter(420, 'lowpass');
      const bubbleGain = new Tone.Gain(0).connect(master);
      bubbleNoise.chain(bubbleLP, bubbleGain);
      bubbleNoise.start();
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      const whooshNoise = new Tone.Noise('pink');
      const whooshFilter = new Tone.AutoFilter({ frequency: 0.5, baseFrequency: 200, octaves: 4 });
      const whooshGain = new Tone.Gain(0).connect(master);
      whooshNoise.chain(whooshFilter, whooshGain);
      whooshNoise.start();
      whooshFilter.start();
      const wrong = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 },
      }).connect(master);
      wrong.volume.value = -10;
      audioRef.current = {
        initialized: true, master,
        click, grindGain, pourGain, hissGain, bubbleGain, chime, whooshGain, wrong,
      };
    } catch (e) { console.warn('Audio init failed', e); }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
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
  const setGrindNoise = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.grindGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.06 : 0, 0.2);
  };
  const playPour = (durationSec = 1.2) => {
    if (muted || !audioRef.current.initialized) return;
    const g = audioRef.current.pourGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(0.22, 0.12);
    setTimeout(() => g.linearRampTo(0, 0.3), durationSec * 1000 - 300);
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
    g.linearRampTo(on && !muted ? 0.22 : 0, 0.3);
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
    scene.fog = new THREE.Fog(0xe8e4d8, 7, 16);

    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0.3, 1.0, 2.6);
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

    // ═══ MORTAR AND PESTLE (left side, for step 1) ═══════════════════════
    const mortarGroup = new THREE.Group();
    mortarGroup.position.set(-0.6, 0.025, 0);
    const mortarBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.07, 0.08, 24, 1, false),
      new THREE.MeshStandardMaterial({ color: 0xc8c2b0, roughness: 0.7 })
    );
    mortarBody.position.y = 0.04;
    mortarBody.castShadow = true; mortarBody.receiveShadow = true;
    mortarGroup.add(mortarBody);
    // Cavity (visual: a darker disc on top)
    const mortarCavity = new THREE.Mesh(
      new THREE.CircleGeometry(0.085, 24),
      new THREE.MeshStandardMaterial({ color: 0x8a8470, roughness: 0.6, side: THREE.DoubleSide })
    );
    mortarCavity.rotation.x = -Math.PI / 2;
    mortarCavity.position.y = 0.075;
    mortarGroup.add(mortarCavity);
    // Rock salt chunks in mortar (visible until ground)
    const rockMat = new THREE.MeshStandardMaterial({ color: 0xddc8a0, roughness: 0.95 });
    const rocks = [];
    for (let i = 0; i < 6; i++) {
      const r = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.013, 0), rockMat
      );
      const a = Math.random() * Math.PI * 2;
      const rr = Math.random() * 0.05;
      r.position.set(Math.cos(a) * rr, 0.082, Math.sin(a) * rr);
      r.castShadow = true;
      mortarGroup.add(r);
      rocks.push(r);
    }
    scene.add(mortarGroup);

    // Pestle (initially leaning against mortar)
    const pestleGroup = new THREE.Group();
    pestleGroup.position.set(-0.45, 0.16, 0.05);
    const pestleHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.016, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0xc8c2b0, roughness: 0.7 })
    );
    pestleHandle.castShadow = true;
    pestleGroup.add(pestleHandle);
    const pestleHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.018, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: 0xc8c2b0, roughness: 0.7 })
    );
    pestleHead.position.y = -0.1;
    pestleHead.castShadow = true;
    pestleGroup.add(pestleHead);
    pestleGroup.rotation.z = 0.4;
    scene.add(pestleGroup);

    // ═══ BUNSEN BURNER (centre-left, for steps 2 and 4) ══════════════════
    const bunsenGroup = new THREE.Group();
    bunsenGroup.position.set(-0.05, 0.025, 0);
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
    flameGroup.position.set(-0.05, 0.36, 0);
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
    tripodGroup.position.set(-0.05, 0, 0);
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

    // ═══ BEAKER (on tripod, for step 2) ══════════════════════════════════
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(-0.05, 0.49, 0);
    const beakerH = 0.18, beakerR = 0.09;
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
    // Water (initially empty — visibility toggled)
    const beakerWater = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR * 0.96, beakerR * 0.96, beakerH * 0.78, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xb8d4ff, transparent: true, opacity: 0.65,
        roughness: 0.12, clearcoat: 0.5,
      })
    );
    beakerWater.position.y = beakerH * 0.39 + 0.005;
    beakerWater.renderOrder = 1;
    beakerWater.visible = false;
    beakerGroup.add(beakerWater);
    const beakerSurface = new THREE.Mesh(
      new THREE.CircleGeometry(beakerR * 0.96, 32),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    beakerSurface.rotation.x = -Math.PI / 2;
    beakerSurface.position.y = beakerH * 0.78 + 0.005;
    beakerSurface.visible = false;
    beakerGroup.add(beakerSurface);
    // Sand at the bottom (visible once dissolved — sand doesn't dissolve)
    const beakerSand = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR * 0.85, beakerR * 0.85, 0.015, 32),
      new THREE.MeshStandardMaterial({ color: 0xc1a87b, roughness: 0.95 })
    );
    beakerSand.position.y = 0.013;
    beakerSand.visible = false;
    beakerGroup.add(beakerSand);
    scene.add(beakerGroup);

    // ═══ STAND, CLAMP, FUNNEL, FLASK (for step 3) ════════════════════════
    // Position right of the Bunsen
    const standGroup = new THREE.Group();
    standGroup.position.set(0.6, 0.025, -0.05);
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.025, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    standBase.position.y = 0.0125;
    standBase.castShadow = true; standBase.receiveShadow = true;
    standGroup.add(standBase);
    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.8, 12), metalMat
    );
    standRod.position.set(-0.105, 0.4, 0);
    standRod.castShadow = true;
    standGroup.add(standRod);
    const clampArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.014, 0.022), metalMat
    );
    clampArm.position.set(-0.02, 0.55, 0);
    standGroup.add(clampArm);
    const clampRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.005, 8, 24), metalMat
    );
    clampRing.rotation.x = Math.PI / 2;
    clampRing.position.set(0.06, 0.55, 0);
    standGroup.add(clampRing);
    // Funnel (cone) — initially visible
    const funnelGroup = new THREE.Group();
    funnelGroup.position.set(0.66, 0.575, -0.05);
    const funnelCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.09, 24, 1, true), glassMat
    );
    funnelCone.position.y = 0.045;
    funnelCone.rotation.x = Math.PI;
    funnelGroup.add(funnelCone);
    const funnelNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.011, 0.06, 16, 1, true), glassMat
    );
    funnelNeck.position.y = -0.03;
    funnelGroup.add(funnelNeck);
    // Filter paper (a cone inside the funnel, slightly grey)
    const filterPaper = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.075, 24, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xdfd6c0, roughness: 0.95, side: THREE.DoubleSide,
      })
    );
    filterPaper.position.y = 0.05;
    filterPaper.rotation.x = Math.PI;
    funnelGroup.add(filterPaper);
    // Residue (sand in the filter paper) — initially hidden
    const residue = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.05, 24, 1, false),
      new THREE.MeshStandardMaterial({ color: 0xc1a87b, roughness: 0.95 })
    );
    residue.position.y = 0.06;
    residue.rotation.x = Math.PI;
    residue.visible = false;
    funnelGroup.add(residue);
    scene.add(funnelGroup);
    // Conical flask below funnel
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(0.66, 0.025, -0.05);
    const flaskProfile = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.075, 0.002),
      new THREE.Vector2(0.075, 0.015),
      new THREE.Vector2(0.07, 0.04),
      new THREE.Vector2(0.06, 0.07),
      new THREE.Vector2(0.04, 0.11),
      new THREE.Vector2(0.018, 0.16),
      new THREE.Vector2(0.018, 0.24),
      new THREE.Vector2(0.022, 0.245),
    ];
    const flask = new THREE.Mesh(
      new THREE.LatheGeometry(flaskProfile, 32), glassMat
    );
    flask.castShadow = true; flask.renderOrder = 2;
    flaskGroup.add(flask);
    // Filtrate (initially invisible)
    const flaskLiquidProfile = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.072, 0.002),
      new THREE.Vector2(0.072, 0.015),
      new THREE.Vector2(0.065, 0.04),
      new THREE.Vector2(0.052, 0.07),
      new THREE.Vector2(0.038, 0.085),
      new THREE.Vector2(0.001, 0.085),
    ];
    const flaskLiquid = new THREE.Mesh(
      new THREE.LatheGeometry(flaskLiquidProfile, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xe4f0fa, transparent: true, opacity: 0.78,
        roughness: 0.15, clearcoat: 0.5,
      })
    );
    flaskLiquid.visible = false;
    flaskGroup.add(flaskLiquid);
    scene.add(flaskGroup);

    // ═══ EVAPORATING BASIN (for step 4 — visible later) ══════════════════
    const basinGroup = new THREE.Group();
    basinGroup.position.set(-0.05, 0.49, 0);
    basinGroup.visible = false;
    const basinShape = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.05, 0.04, 32),
      new THREE.MeshStandardMaterial({
        color: 0xf3eed8, roughness: 0.85, metalness: 0.05,
      })
    );
    basinShape.position.y = 0.02;
    basinShape.castShadow = true; basinShape.receiveShadow = true;
    basinGroup.add(basinShape);
    // Filtrate inside the basin (initially with liquid, becomes crystals)
    const basinLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.045, 0.018, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xe4f0fa, transparent: true, opacity: 0.78,
        roughness: 0.15, clearcoat: 0.5,
      })
    );
    basinLiquid.position.y = 0.029;
    basinGroup.add(basinLiquid);
    // Crystals (initially hidden, appear as tiny cubes after evaporation)
    const crystalsGroup = new THREE.Group();
    crystalsGroup.position.y = 0.02;
    crystalsGroup.visible = false;
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.25, metalness: 0.05,
    });
    for (let i = 0; i < 30; i++) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.006, 0.008), crystalMat);
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.075;
      c.position.set(Math.cos(a) * r, 0.004 + Math.random() * 0.004, Math.sin(a) * r);
      c.rotation.y = Math.random() * Math.PI;
      c.castShadow = true;
      crystalsGroup.add(c);
    }
    basinGroup.add(crystalsGroup);
    scene.add(basinGroup);

    // ═══ STIRRING ROD (for step 2) ═══════════════════════════════════════
    const stirRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.22, 8), glassMat
    );
    stirRod.position.set(-0.05, 0.7, 0);
    stirRod.rotation.z = 0.1;
    stirRod.visible = false;
    scene.add(stirRod);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      mortarGroup, pestleGroup, rocks,
      bunsenGroup, flameGroup, flameLight, outerFlame, midFlame, innerFlame,
      tripodGroup,
      beakerGroup, beakerWater, beakerSurface, beakerSand,
      funnelGroup, filterPaper, residue,
      flaskGroup, flaskLiquid,
      basinGroup, basinLiquid, crystalsGroup,
      stirRod,
      bubbles: [], gasBubbles: [], tweens: [],
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

    // ─── Animation loop ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // Tweens
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
        } else if (tw.type === 'rot-z') {
          tw.target.rotation.z = tw.fromZ + (tw.toZ - tw.fromZ) * t;
        } else if (tw.type === 'scale-y') {
          tw.target.scale.y = tw.from + (tw.to - tw.from) * t;
        } else if (tw.type === 'numeric') {
          tw.setter(tw.from + (tw.to - tw.from) * t);
        }
        if (tw.progress >= 1) {
          so.tweens.splice(i, 1);
          if (tw.onComplete) tw.onComplete();
        }
      }

      // Flame flicker
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

      // Bubbles in beaker (when heating)
      if (so.bubblesOn && Math.random() < 0.5) {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.005 + Math.random() * 0.004, 8, 8),
          new THREE.MeshPhysicalMaterial({
            color: 0xffffff, transparent: true, opacity: 0.7,
            roughness: 0.05, clearcoat: 0.7,
          })
        );
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.07;
        bubble.position.set(
          so.beakerGroup.position.x + Math.cos(a) * r,
          so.beakerGroup.position.y + 0.02,
          so.beakerGroup.position.z + Math.sin(a) * r,
        );
        so.scene.add(bubble);
        so.bubbles.push({
          mesh: bubble,
          vy: 0.18 + Math.random() * 0.1,
          targetY: so.beakerGroup.position.y + 0.14 + Math.random() * 0.02,
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

  // ─── Tween helpers ───────────────────────────────────────────────────────
  const tweenPos = (target, toPos, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'pos', target,
      fromX: target.position.x, fromY: target.position.y, fromZ: target.position.z,
      toX: toPos.x, toY: toPos.y, toZ: toPos.z,
      progress: 0, duration, onComplete: res,
    });
  });
  const tweenRotZ = (target, toZ, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'rot-z', target,
      fromZ: target.rotation.z, toZ,
      progress: 0, duration, onComplete: res,
    });
  });
  const tweenScaleY = (target, to, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'scale-y', target,
      from: target.scale.y, to,
      progress: 0, duration, onComplete: res,
    });
  });
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // PROCEDURE — each step is an async fn
  // ═══════════════════════════════════════════════════════════════════════════
  const runStep1 = async () => {  // GRIND
    const so = sceneObjects.current;
    setGrindNoise(true);
    // Pestle moves down into mortar, hammers ~5 times
    await tweenPos(so.pestleGroup, new THREE.Vector3(-0.6, 0.16, 0), 0.5);
    await tweenRotZ(so.pestleGroup, 0, 0.3);
    for (let i = 0; i < 5; i++) {
      playClick();
      await tweenPos(so.pestleGroup, new THREE.Vector3(-0.6, 0.10, 0), 0.18);
      await tweenPos(so.pestleGroup, new THREE.Vector3(-0.6, 0.16, 0), 0.18);
      // Shrink rocks over time
      so.rocks.forEach(r => {
        r.scale.multiplyScalar(0.92);
      });
    }
    setGrindNoise(false);
    await tweenPos(so.pestleGroup, new THREE.Vector3(-0.45, 0.18, 0.05), 0.5);
    await tweenRotZ(so.pestleGroup, 0.4, 0.3);
    // Replace rocks with finer "powder" — turn them into smaller flatter discs
    so.rocks.forEach(r => {
      r.scale.set(0.45, 0.25, 0.45);
      r.material.color.setHex(0xf2e8c8);  // lighter (now powder)
    });
    await delay(400);
  };

  const runStep2 = async () => {  // DISSOLVE + HEAT
    const so = sceneObjects.current;
    // Make beaker water and surface visible
    so.beakerWater.visible = true;
    so.beakerSurface.visible = true;
    so.beakerSand.visible = true;
    // Hide rocks (they've been transferred to the beaker)
    so.rocks.forEach(r => r.visible = false);
    // Light Bunsen
    playWhoosh();
    so.flameGroup.visible = true;
    so.flameLight.intensity = 0.8;
    so.flameOn = true;
    setHiss(true);
    await delay(700);
    // Bubbles start (boiling)
    setBubble(true);
    so.bubblesOn = true;
    // Stir rod appears and moves
    so.stirRod.visible = true;
    for (let i = 0; i < 5; i++) {
      await tweenRotZ(so.stirRod, 0.3, 0.18);
      await tweenRotZ(so.stirRod, -0.3, 0.18);
    }
    await tweenRotZ(so.stirRod, 0, 0.2);
    so.stirRod.visible = false;
    await delay(800);
    // Salt has dissolved. Sand visible at the bottom.
    setBubble(false);
    so.bubblesOn = false;
    so.flameGroup.visible = false;
    so.flameLight.intensity = 0;
    so.flameOn = false;
    setHiss(false);
    await delay(400);
  };

  const runStep3 = async () => {  // FILTER
    const so = sceneObjects.current;
    // Visually: beaker tips toward funnel, "pours" — we simulate by
    // hiding the beaker contents and showing residue in funnel + filtrate
    // in flask.
    playPour(1.5);
    // Hide beaker contents
    so.beakerWater.visible = false;
    so.beakerSurface.visible = false;
    so.beakerSand.visible = false;
    // Show residue in filter (sand stays in filter paper)
    so.residue.visible = true;
    so.residue.scale.set(0.2, 0.2, 0.2);
    await tweenScaleY(so.residue, 1.0, 1.0);
    // Tween filter paper colour to slightly darker (wet)
    // Show filtrate accumulating in flask
    so.flaskLiquid.visible = true;
    so.flaskLiquid.scale.set(1, 0.1, 1);
    await tweenScaleY(so.flaskLiquid, 1.0, 1.8);
    await delay(500);
  };

  const runStep4 = async () => {  // EVAPORATE
    const so = sceneObjects.current;
    // Remove beaker, place evaporating basin on tripod
    so.beakerGroup.visible = false;
    so.basinGroup.visible = true;
    // Transfer filtrate from flask to basin
    so.flaskLiquid.visible = false;
    so.basinLiquid.visible = true;
    await delay(400);
    // Light Bunsen, evaporate
    playWhoosh();
    so.flameGroup.visible = true;
    so.flameLight.intensity = 0.8;
    so.flameOn = true;
    setHiss(true);
    setBubble(true);
    so.bubblesOn = false;  // no bubbles in shallow basin, just steam
    await delay(800);
    // Tween filtrate scale to 0 (it evaporates)
    await tweenScaleY(so.basinLiquid, 0.05, 4.0);
    so.basinLiquid.visible = false;
    // Reveal crystals
    so.crystalsGroup.visible = true;
    so.crystalsGroup.children.forEach((c, i) => {
      c.scale.set(0.001, 0.001, 0.001);
    });
    for (let i = 0; i < so.crystalsGroup.children.length; i++) {
      const c = so.crystalsGroup.children[i];
      so.tweens.push({
        type: 'numeric',
        from: 0.001, to: 1.0, progress: 0, duration: 0.8,
        setter: v => c.scale.set(v, v, v),
      });
    }
    await delay(1000);
    // Extinguish
    so.flameGroup.visible = false;
    so.flameLight.intensity = 0;
    so.flameOn = false;
    setHiss(false);
    setBubble(false);
    playChime();
    await delay(800);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setStepIndex(0);
    setPhase('running');
    // Run the procedure end-to-end
    await runStep1();
    setStepIndex(1);
    await runStep2();
    setStepIndex(2);
    await runStep3();
    setStepIndex(3);
    await runStep4();
    await delay(500);
    setPhase('quiz');
  };

  const submitQuizAnswer = (idx) => {
    playClick();
    const next = [...quizAnswers, idx];
    setQuizAnswers(next);
    if (next.length >= QUIZ.length) {
      setTimeout(() => setPhase('result'), 400);
    } else {
      setQuizIndex(quizIndex + 1);
    }
  };

  const resetLab = () => {
    // Reset scene state for another run (most easily by reloading visuals)
    const so = sceneObjects.current;
    if (so.scene) {
      so.beakerGroup.visible = true;
      so.beakerWater.visible = false;
      so.beakerSurface.visible = false;
      so.beakerSand.visible = false;
      so.flaskLiquid.visible = false;
      so.flaskLiquid.scale.set(1, 1, 1);
      so.residue.visible = false;
      so.basinGroup.visible = false;
      so.crystalsGroup.visible = false;
      so.crystalsGroup.children.forEach(c => c.scale.set(1, 1, 1));
      so.basinLiquid.visible = true;
      so.basinLiquid.scale.set(1, 1, 1);
      // Reset rocks
      so.rocks.forEach(r => {
        r.visible = true;
        r.scale.set(1, 1, 1);
        r.material.color.setHex(0xddc8a0);
      });
      so.pestleGroup.position.set(-0.45, 0.18, 0.05);
      so.pestleGroup.rotation.z = 0.4;
    }
    setQuizIndex(0);
    setQuizAnswers([]);
    setStepIndex(0);
    setPhase('intro');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const currentStep = STEPS[stepIndex];
  const score = quizAnswers.reduce((acc, ans, i) => acc + (ans === QUIZ[i].correct ? 1 : 0), 0);

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
            NSSCO · Chemistry Practical · Paper 3
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Purification</span> · Rock Salt
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
        {phase === 'running' && currentStep && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none max-w-md"
               style={{ fontFamily: mono }}>
            <div className="font-semibold mb-0.5">{currentStep.title}</div>
            <div className="text-[10px] opacity-75 leading-snug">{currentStep.blurb}</div>
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
              Obtain a sample of dry <span style={{ fontStyle: 'italic' }}>sodium chloride crystals</span> from rock salt (NaCl mixed with sand).
            </p>
            <p className="text-xs opacity-65 mb-4">
              Watch the four steps — grinding, dissolving, filtering, evaporating — then answer the exam questions on the vocabulary (residue, filtrate, mortar and pestle).
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Play size={12} /> Begin Procedure
            </button>
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Step {stepIndex + 1} of {STEPS.length}
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-2">
              <div className="h-full transition-all"
                   style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              {currentStep?.title}
            </div>
          </div>
        )}

        {phase === 'quiz' && QUIZ[quizIndex] && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Question {quizIndex + 1} of {QUIZ.length}
            </div>
            <p className="text-sm leading-snug mb-3">{QUIZ[quizIndex].q}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {QUIZ[quizIndex].options.map((opt, i) => (
                <button key={i} onClick={() => submitQuizAnswer(i)}
                        className="py-2 px-3 text-[11px] text-left active:scale-[0.99]"
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
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Quiz score</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Purification <span style={{ fontStyle: 'italic' }}>vocabulary</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: score === QUIZ.length ? '#2e7d32' : '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>
            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {score} <span className="text-stone-400 text-lg">/ {QUIZ.length}</span>
            </div>
            <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: mono }}>
              {QUIZ.map((q, i) => {
                const correct = quizAnswers[i] === q.correct;
                return (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className="text-stone-700 flex-1">{q.q}</span>
                    <span style={{
                      color: correct ? '#2e7d32' : '#c2185b',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {correct ? '✓' : `✗ ${q.options[q.correct]}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <button onClick={resetLab}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <RotateCcw size={13} /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
