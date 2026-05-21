'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Play,
} from 'lucide-react';

// ============================================================================
// GAS COLLECTION RATE LAB · v1
// NSSCO Chemistry Practical — Rate of oxygen production from the thermal
// decomposition of potassium chlorate(V) with MnO₂ catalyst:
//     2 KClO₃(s) → 2 KCl(s) + 3 O₂(g)
// Maps directly to NSSCO 2024 Paper 3 Q3. The reference data set matches the
// exam: V(t) at 0,20,40,60,80,100,120 s = 0, 30, 50, 66, 78, 86, 86 cm³.
// ============================================================================

// Target time-series (cm³ vs seconds) for crystals, lifted from NSSCO 2024 Q3.
const CRYSTAL_SERIES = [
  [0, 0], [20, 30], [40, 50], [60, 66], [80, 78], [100, 86], [120, 86],
];
// Powder reacts faster (larger surface area) so reaches the same plateau sooner.
const POWDER_SERIES = [
  [0, 0], [20, 50], [40, 72], [60, 84], [80, 86], [100, 86], [120, 86],
];

// Linear interpolation through a (time, volume) table.
function interpVolume(series, t) {
  if (t <= series[0][0]) return series[0][1];
  if (t >= series[series.length - 1][0]) return series[series.length - 1][1];
  for (let i = 0; i < series.length - 1; i++) {
    const [t1, v1] = series[i];
    const [t2, v2] = series[i + 1];
    if (t >= t1 && t <= t2) {
      const f = (t - t1) / (t2 - t1);
      return v1 + (v2 - v1) * f;
    }
  }
  return series[series.length - 1][1];
}

// Simulated time per real second
const TIME_COMPRESSION = 8; // 1 real s ≈ 8 simulated s → 15 real s for 120 sim s
const MAX_TIME = 120;
const MAX_VOLUME = 100;

// Analysis questions (lifted from NSSCO 2024 Q3 with mark-scheme answers)
const QUESTIONS = [
  {
    q: 'From the graph (or table), predict the volume of oxygen at 45 seconds.',
    options: ['About 30 cm³', 'About 45 cm³', 'About 55 cm³', 'About 70 cm³'],
    correct: 2,
    explain: 'Interpolating between 40 s (50 cm³) and 60 s (66 cm³) gives roughly 55–58 cm³.',
  },
  {
    q: 'Why are the final two readings (at 100 s and 120 s) the same?',
    options: [
      'The thermometer broke',
      'The reaction is complete — all the potassium chlorate has decomposed',
      'The gas syringe is full',
      'The Bunsen burner went out',
    ],
    correct: 1,
    explain: 'Once all the KClO₃ has reacted, no more oxygen is produced and the volume stops rising.',
  },
  {
    q: 'If the experiment were repeated with potassium chlorate POWDER instead of crystals, the graph would show:',
    options: [
      'A higher final volume of oxygen',
      'A lower final volume of oxygen',
      'A steeper initial rise but the same final volume',
      'A shallower initial rise and a lower final volume',
    ],
    correct: 2,
    explain: 'Powder has a larger surface area so the reaction is faster initially; total O₂ depends only on the mass of KClO₃ used, so the plateau is the same.',
  },
  {
    q: 'Which test confirms the gas collected is oxygen?',
    options: [
      'It pops with a lighted splint',
      'It relights a glowing splint',
      'It turns limewater milky',
      'It bleaches damp blue litmus paper',
    ],
    correct: 1,
    explain: 'Oxygen relights a glowing splint — the defining test for oxygen.',
  },
];

export default function GasCollectionRateLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → setup → running → finished → analysis → result
  const [phase, setPhase] = useState('intro');
  const [useCrystals, setUseCrystals] = useState(true);
  const [simTime, setSimTime] = useState(0);
  const [volume, setVolume] = useState(0);
  const [recordings, setRecordings] = useState([]); // {t, v}
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const runRef = useRef({ running: false, simTime: 0, series: CRYSTAL_SERIES, recAt: 0 });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO (subset)
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
      const bubbleNoise = new Tone.Noise('brown');
      const bubbleLP = new Tone.Filter(400, 'lowpass');
      const bubbleGain = new Tone.Gain(0).connect(master);
      bubbleNoise.chain(bubbleLP, bubbleGain);
      bubbleNoise.start();
      const whooshNoise = new Tone.Noise('pink');
      const whooshFilter = new Tone.AutoFilter({ frequency: 0.5, baseFrequency: 200, octaves: 4 });
      const whooshGain = new Tone.Gain(0).connect(master);
      whooshNoise.chain(whooshFilter, whooshGain);
      whooshNoise.start();
      whooshFilter.start();
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
      audioRef.current = { initialized: true, master, click, hissGain, bubbleGain, whooshGain, chime, wrong };
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
    scene.fog = new THREE.Fog(0xe8e4d8, 6, 16);
    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0.2, 0.95, 2.4);
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

    scene.add(new THREE.AmbientLight(0xfff0d4, 0.6));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
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

    // ─── Stand + clamp for the test tube ───────────────────────────────
    const standGroup = new THREE.Group();
    standGroup.position.set(-0.5, 0.025, -0.1);
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.025, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    standBase.position.y = 0.0125;
    standBase.castShadow = true; standBase.receiveShadow = true;
    standGroup.add(standBase);
    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.85, 12), metalMat
    );
    standRod.position.set(-0.105, 0.42, 0);
    standGroup.add(standRod);
    const clampArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.014, 0.022), metalMat
    );
    clampArm.position.set(-0.02, 0.45, 0);
    standGroup.add(clampArm);
    scene.add(standGroup);

    // ─── Test tube (clamped at slight angle, contents inside) ──────────
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(-0.5, 0.5, -0.1);
    tubeGroup.rotation.z = -0.45;  // tilt the tube
    // Tube (a cylinder closed at one end)
    const tubeLen = 0.22;
    const tubeR = 0.027;
    const tubeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(tubeR, tubeR, tubeLen, 24, 1, true), glassMat
    );
    tubeMesh.position.y = -tubeLen / 2;  // tube hangs below pivot
    tubeMesh.renderOrder = 2;
    tubeGroup.add(tubeMesh);
    // Closed bottom (hemisphere)
    const tubeBottom = new THREE.Mesh(
      new THREE.SphereGeometry(tubeR, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      glassMat
    );
    tubeBottom.position.y = -tubeLen;
    tubeGroup.add(tubeBottom);
    // KClO₃ + MnO₂ contents at the bottom (white powder/crystal mix)
    const contents = new THREE.Mesh(
      new THREE.CylinderGeometry(tubeR * 0.92, tubeR * 0.92, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0xefe6c8, roughness: 0.92 })
    );
    contents.position.y = -tubeLen + 0.02;
    tubeGroup.add(contents);
    // Rubber stopper at the top
    const stopper = new THREE.Mesh(
      new THREE.CylinderGeometry(tubeR * 1.05, tubeR * 1.05, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x6a4a3a, roughness: 0.85 })
    );
    stopper.position.y = 0;
    tubeGroup.add(stopper);
    // Delivery tube emerging from stopper (thin glass tube bent to horizontal)
    const deliveryTubeA = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.08, 12), glassMat
    );
    deliveryTubeA.position.set(0, 0.045, 0);
    tubeGroup.add(deliveryTubeA);
    scene.add(tubeGroup);

    // ─── Bunsen burner under the tube ──────────────────────────────────
    const bunsenGroup = new THREE.Group();
    // Position so the flame is near the bottom of the test tube.
    bunsenGroup.position.set(-0.42, 0.025, -0.1);
    const bunsenBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.04, 24), metalMat
    );
    bunsenBase.castShadow = true; bunsenBase.receiveShadow = true;
    bunsenGroup.add(bunsenBase);
    const bunsenBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.32, 16), metalMat
    );
    bunsenBarrel.position.y = 0.18;
    bunsenGroup.add(bunsenBarrel);
    const bunsenTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.045, 0.02, 16), metalMat
    );
    bunsenTop.position.y = 0.35;
    bunsenGroup.add(bunsenTop);
    scene.add(bunsenGroup);

    const flameGroup = new THREE.Group();
    flameGroup.position.set(-0.42, 0.36, -0.1);
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

    // ─── Delivery tube bend (rendered as 2 short cylinders + the syringe) ──
    const bendGroup = new THREE.Group();
    // Horizontal segment to the right
    const bendH = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.5, 12), glassMat
    );
    bendH.position.set(-0.18, 0.59, -0.1);
    bendH.rotation.z = Math.PI / 2;
    scene.add(bendH);

    // ─── Gas syringe (horizontal, plunger slides outward) ──────────────
    const syringeGroup = new THREE.Group();
    syringeGroup.position.set(0.45, 0.59, -0.1);
    const syringeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.45, 24, 1, true), glassMat
    );
    syringeBody.rotation.z = Math.PI / 2;
    syringeGroup.add(syringeBody);
    // Cap at left end (where gas enters)
    const syringeCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.044, 0.044, 0.012, 24),
      new THREE.MeshStandardMaterial({ color: 0x4a3528, roughness: 0.85 })
    );
    syringeCap.rotation.z = Math.PI / 2;
    syringeCap.position.x = -0.225;
    syringeGroup.add(syringeCap);
    // Plunger (slides inside)
    const plunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0x9a8a78, roughness: 0.6, metalness: 0.1 })
    );
    plunger.rotation.z = Math.PI / 2;
    plunger.position.x = -0.205;  // initial: pushed all the way in
    syringeGroup.add(plunger);
    // Plunger handle (sticking out the right end)
    const plungerHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: 0x9a8a78, roughness: 0.6 })
    );
    plungerHandle.rotation.z = Math.PI / 2;
    plungerHandle.position.x = -0.205 - 0.09;  // attached to plunger
    syringeGroup.add(plungerHandle);
    // Scale marks on the syringe body
    for (let v = 0; v <= 100; v += 20) {
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.018, 0.001),
        new THREE.MeshBasicMaterial({ color: 0x444444 })
      );
      // Position along the body (-0.22 = 0 mL, +0.22 = 100 mL)
      tick.position.set(-0.22 + (v / 100) * 0.44, 0.04, 0);
      syringeGroup.add(tick);
    }
    scene.add(syringeGroup);

    sceneObjects.current = {
      scene, camera, renderer,
      tubeGroup, contents,
      flameGroup, flameLight, outerFlame, midFlame, innerFlame,
      syringeGroup, plunger, plungerHandle,
      bubbles: [],
      flameOn: false,
      time: 0,
    };

    // Camera drag controls
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

    const clock = new THREE.Clock();
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // Advance simulated time when running
      const run = runRef.current;
      if (run.running) {
        run.simTime = Math.min(MAX_TIME, run.simTime + dt * TIME_COMPRESSION);
        setSimTime(run.simTime);
        const v = interpVolume(run.series, run.simTime);
        setVolume(v);
        // Move plunger position based on volume
        // Plunger travels from x = -0.205 (V=0) to x = +0.205 (V=100)
        const px = -0.205 + (v / 100) * 0.41;
        so.plunger.position.x = px;
        so.plungerHandle.position.x = px - 0.09;
        // Record a reading every 20 simulated seconds
        if (run.simTime - run.recAt >= 20 || run.simTime >= MAX_TIME - 0.5) {
          run.recAt = Math.floor(run.simTime / 20) * 20;
          setRecordings(prev => {
            // Only add if not already at this time
            if (prev.length > 0 && Math.abs(prev[prev.length - 1].t - run.recAt) < 0.5) return prev;
            return [...prev, { t: run.recAt, v: Math.round(v) }];
          });
        }
        if (run.simTime >= MAX_TIME) {
          run.running = false;
          so.flameGroup.visible = false;
          so.flameLight.intensity = 0;
          so.flameOn = false;
          setHiss(false);
          setBubble(false);
          setTimeout(() => setPhase('finished'), 600);
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
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const startRun = () => {
    playClick();
    const so = sceneObjects.current;
    const series = useCrystals ? CRYSTAL_SERIES : POWDER_SERIES;
    runRef.current = { running: true, simTime: 0, series, recAt: -20 };
    setSimTime(0); setVolume(0); setRecordings([]);
    // Light Bunsen
    playWhoosh();
    so.flameGroup.visible = true;
    so.flameLight.intensity = 0.8;
    so.flameOn = true;
    setHiss(true);
    setPhase('running');
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
    if (so.plunger) {
      so.plunger.position.x = -0.205;
      so.plungerHandle.position.x = -0.205 - 0.09;
    }
    setSimTime(0); setVolume(0); setRecordings([]);
    setQuestionIndex(0); setAnswers([]);
    setPhase('intro');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const score = answers.reduce((acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0), 0);

  // Sketch graph
  const graphSvg = () => {
    if (recordings.length < 2) return null;
    const W = 240, H = 110, pad = 12;
    const toX = (t) => pad + (t / MAX_TIME) * (W - 2 * pad);
    const toY = (v) => H - pad - (v / MAX_VOLUME) * (H - 2 * pad);
    const path = recordings.map((r, i) => `${i === 0 ? 'M' : 'L'} ${toX(r.t)} ${toY(r.v)}`).join(' ');
    return (
      <svg width={W} height={H} className="block">
        <rect x="0" y="0" width={W} height={H} fill="rgba(232,228,216,0.05)" />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <path d={path} stroke="#ec407a" strokeWidth="1.6" fill="none" />
        {recordings.map((r, i) => (
          <circle key={i} cx={toX(r.t)} cy={toY(r.v)} r="2.5" fill="#ec407a" />
        ))}
        <text x={W - pad} y={H - 2} fontSize="9" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>t (s)</text>
        <text x={pad + 2} y={pad + 7} fontSize="9" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>V (cm³)</text>
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
            NSSCO · Chemistry Practical · Paper 3
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Rate</span> · KClO₃ → O₂
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
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div>t = {simTime.toFixed(0)} s</div>
            <div>V = {volume.toFixed(0)} cm³</div>
          </div>
        )}
        {recordings.length > 0 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div className="opacity-55 mb-0.5 uppercase" style={{ letterSpacing: '0.16em' }}>Readings</div>
            <div className="grid grid-cols-2 gap-x-3">
              <span className="opacity-50">t/s</span>
              <span className="opacity-50">V/cm³</span>
              {recordings.map((r, i) => (
                <span key={`t${i}`} className="contents">
                  <span>{r.t}</span>
                  <span style={{ fontWeight: 600 }}>{r.v}</span>
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
              Measure the rate of <span style={{ fontStyle: 'italic' }}>oxygen production</span> when potassium chlorate(V) is heated with a manganese(IV) oxide catalyst.
            </p>
            <p className="text-xs opacity-65 mb-4">
              The oxygen is collected in a gas syringe. Volume readings are taken every 20 seconds for 2 minutes. Then plot V vs t and answer the kinetics questions.
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
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Form of potassium chlorate
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={() => setUseCrystals(true)}
                      className="py-2.5 text-[11px] text-left px-3 active:scale-95"
                      style={{
                        background: useCrystals ? 'rgba(232,228,216,0.22)' : 'rgba(232,228,216,0.07)',
                        border: '1px solid rgba(232,228,216,0.18)',
                        fontFamily: mono,
                      }}>
                Crystals <span className="opacity-55">(standard run)</span>
              </button>
              <button onClick={() => setUseCrystals(false)}
                      className="py-2.5 text-[11px] text-left px-3 active:scale-95"
                      style={{
                        background: !useCrystals ? 'rgba(232,228,216,0.22)' : 'rgba(232,228,216,0.07)',
                        border: '1px solid rgba(232,228,216,0.18)',
                        fontFamily: mono,
                      }}>
                Powder <span className="opacity-55">(more surface area)</span>
              </button>
            </div>
            <button onClick={startRun}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Play size={12} /> Light Bunsen & Start
            </button>
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Decomposing KClO₃ · t = {simTime.toFixed(0)} s of {MAX_TIME} s
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-2">
              <div className="h-full transition-all"
                   style={{ width: `${(simTime / MAX_TIME) * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <p className="text-xs opacity-65 leading-snug">
              Oxygen is being produced. The gas syringe plunger is moving outward.
            </p>
          </div>
        )}

        {phase === 'finished' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Run complete · plot the data
            </div>
            <div className="bg-stone-900/40 p-2 mb-3 rounded-sm">
              {graphSvg()}
            </div>
            <button onClick={() => setPhase('analysis')}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Answer the Exam Questions <ChevronRight size={14} />
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
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Score</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Rate · <span style={{ fontStyle: 'italic' }}>analysis</span>
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
                      <span className="text-stone-700 flex-1">{q.q}</span>
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
