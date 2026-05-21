'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Play, Zap,
} from 'lucide-react';

// ============================================================================
// ELECTROLYSIS LAB · v1
// NSSCO Chemistry Practical — Electrolysis of various electrolytes with inert
// or copper electrodes. Maps to syllabus topic 5.1.
//
// Covers:
//   • Molten lead(II) bromide (PbBr₂)
//   • Dilute sulfuric acid (H₂SO₄)
//   • Concentrated hydrochloric acid (conc. HCl)
//   • Concentrated aqueous sodium chloride (conc. brine)
//   • Aqueous copper(II) sulfate with CARBON electrodes
//   • Aqueous copper(II) sulfate with COPPER electrodes (electroplating /
//     anode dissolving)
// ============================================================================

const ELECTROLYTES = [
  {
    id: 'pbbr2',
    label: 'Molten PbBr₂',
    description: 'Molten lead(II) bromide. Inert (carbon) electrodes.',
    liquidColour: 0x9a5028,   // dark amber molten salt
    electrodes: 'carbon',
    cathodeProduct: 'Pb',
    anodeProduct: 'Br2',
    cathodeHalfEq: 'Pb²⁺ + 2e⁻ → Pb',
    anodeHalfEq: '2Br⁻ → Br₂ + 2e⁻',
    cathodeNote: 'Lead metal forms — a shiny grey deposit at the cathode.',
    anodeNote: 'Bromine vapour evolves at the anode — red-brown gas.',
  },
  {
    id: 'dilute-h2so4',
    label: 'Dilute H₂SO₄',
    description: 'Dilute sulfuric acid. Inert (carbon) electrodes.',
    liquidColour: 0xd8e8f5,
    electrodes: 'carbon',
    cathodeProduct: 'H2',
    anodeProduct: 'O2',
    cathodeHalfEq: '2H⁺ + 2e⁻ → H₂',
    anodeHalfEq: '4OH⁻ → 2H₂O + O₂ + 4e⁻',
    cathodeNote: 'Hydrogen gas evolves — colourless. Pops with a lighted splint.',
    anodeNote: 'Oxygen gas evolves — colourless. Relights a glowing splint.',
  },
  {
    id: 'conc-hcl',
    label: 'Concentrated HCl',
    description: 'Concentrated hydrochloric acid. Inert (carbon) electrodes.',
    liquidColour: 0xeaf0e8,
    electrodes: 'carbon',
    cathodeProduct: 'H2',
    anodeProduct: 'Cl2',
    cathodeHalfEq: '2H⁺ + 2e⁻ → H₂',
    anodeHalfEq: '2Cl⁻ → Cl₂ + 2e⁻',
    cathodeNote: 'Hydrogen gas evolves at the cathode — colourless.',
    anodeNote: 'Chlorine gas evolves at the anode — yellow-green, pungent. Bleaches damp litmus.',
  },
  {
    id: 'conc-nacl',
    label: 'Concentrated NaCl (brine)',
    description: 'Concentrated aqueous sodium chloride. Inert (carbon) electrodes.',
    liquidColour: 0xeaeaf0,
    electrodes: 'carbon',
    cathodeProduct: 'H2',
    anodeProduct: 'Cl2',
    cathodeHalfEq: '2H₂O + 2e⁻ → H₂ + 2OH⁻',
    anodeHalfEq: '2Cl⁻ → Cl₂ + 2e⁻',
    cathodeNote: 'Hydrogen evolves at the cathode; the solution near the cathode becomes alkaline (NaOH).',
    anodeNote: 'Chlorine evolves at the anode — yellow-green gas.',
  },
  {
    id: 'cuso4-carbon',
    label: 'CuSO₄ · carbon electrodes',
    description: 'Aqueous copper(II) sulfate with inert (carbon) electrodes.',
    liquidColour: 0x4f8fd9,
    electrodes: 'carbon',
    cathodeProduct: 'Cu',
    anodeProduct: 'O2',
    cathodeHalfEq: 'Cu²⁺ + 2e⁻ → Cu',
    anodeHalfEq: '4OH⁻ → 2H₂O + O₂ + 4e⁻',
    cathodeNote: 'A copper deposit (pink-orange) forms on the cathode.',
    anodeNote: 'Oxygen gas evolves at the anode. The blue colour of the electrolyte slowly fades as Cu²⁺ is consumed.',
    fadeElectrolyte: true,
  },
  {
    id: 'cuso4-copper',
    label: 'CuSO₄ · copper electrodes',
    description: 'Aqueous copper(II) sulfate with copper electrodes (used for electroplating and purifying copper).',
    liquidColour: 0x4f8fd9,
    electrodes: 'copper',
    cathodeProduct: 'Cu',
    anodeProduct: 'Cu-dissolves',
    cathodeHalfEq: 'Cu²⁺ + 2e⁻ → Cu',
    anodeHalfEq: 'Cu → Cu²⁺ + 2e⁻',
    cathodeNote: 'Copper deposits on the cathode (the spoon / object being plated).',
    anodeNote: 'The copper anode dissolves into solution as Cu²⁺. The blue colour stays constant.',
  },
];

// Multi-choice options for cathode and anode products
const PRODUCT_OPTIONS = [
  { id: 'H2', label: 'Hydrogen gas (colourless, pops)' },
  { id: 'O2', label: 'Oxygen gas (colourless, relights glowing splint)' },
  { id: 'Cl2', label: 'Chlorine gas (yellow-green, bleaches)' },
  { id: 'Br2', label: 'Bromine vapour (red-brown)' },
  { id: 'Cu', label: 'Copper metal (pink-orange deposit)' },
  { id: 'Pb', label: 'Lead metal (grey)' },
  { id: 'Cu-dissolves', label: 'Copper electrode dissolves (Cu²⁺ released)' },
];

export default function ElectrolysisLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → menu → running → identify → result-trial → ... → session-end
  const [phase, setPhase] = useState('intro');
  const [currentId, setCurrentId] = useState(null);
  const [cathodeGuess, setCathodeGuess] = useState(null);
  const [anodeGuess, setAnodeGuess] = useState(null);
  const [results, setResults] = useState([]);  // [{electrolyteId, cathode correct, anode correct}]
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const current = ELECTROLYTES.find(e => e.id === currentId);
  const completedIds = new Set(results.map(r => r.electrolyteId));

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
      const buzz = new Tone.Oscillator(50, 'sawtooth');
      const buzzFilter = new Tone.Filter(180, 'lowpass');
      const buzzGain = new Tone.Gain(0);
      buzz.chain(buzzFilter, buzzGain, master);
      buzz.start();
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
      const wrong = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 },
      }).connect(master);
      wrong.volume.value = -10;
      audioRef.current = { initialized: true, master, click, buzzGain, bubbleGain, chime, wrong };
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
  const setBuzz = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.buzzGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.008 : 0, 0.2);
  };
  const setBubble = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.bubbleGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.18 : 0, 0.3);
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
    camera.position.set(0.1, 0.85, 2.3);
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

    // ─── Electrolytic cell — a glass beaker ────────────────────────────
    const cellGroup = new THREE.Group();
    cellGroup.position.set(0, 0.025, 0);
    const cellH = 0.22, cellR = 0.13;
    const cellGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(cellR, cellR, cellH, 32, 1, true), glassMat
    );
    cellGlass.position.y = cellH / 2;
    cellGlass.renderOrder = 2;
    cellGroup.add(cellGlass);
    const cellFloor = new THREE.Mesh(
      new THREE.CircleGeometry(cellR, 32), glassMat
    );
    cellFloor.rotation.x = -Math.PI / 2;
    cellFloor.position.y = 0.001;
    cellGroup.add(cellFloor);
    // Electrolyte (colour set per experiment)
    const electrolyteMat = new THREE.MeshPhysicalMaterial({
      color: 0xeaeaea, transparent: true, opacity: 0.7,
      roughness: 0.15, clearcoat: 0.5,
    });
    const electrolyte = new THREE.Mesh(
      new THREE.CylinderGeometry(cellR * 0.97, cellR * 0.97, cellH * 0.75, 32),
      electrolyteMat
    );
    electrolyte.position.y = cellH * 0.375 + 0.005;
    electrolyte.renderOrder = 1;
    cellGroup.add(electrolyte);
    const electrolyteSurface = new THREE.Mesh(
      new THREE.CircleGeometry(cellR * 0.97, 32),
      new THREE.MeshStandardMaterial({
        color: 0xc8c8c8, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    electrolyteSurface.rotation.x = -Math.PI / 2;
    electrolyteSurface.position.y = cellH * 0.75 + 0.005;
    cellGroup.add(electrolyteSurface);
    scene.add(cellGroup);

    // ─── Electrodes (two rods dipping into the cell) ────────────────────
    const electrodeH = 0.36;
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a, roughness: 0.6, metalness: 0.2,
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xc97a3f, roughness: 0.4, metalness: 0.45,
    });
    const electrodeCathode = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, electrodeH, 16), carbonMat
    );
    electrodeCathode.position.set(-0.06, 0.025 + electrodeH / 2, 0);
    electrodeCathode.castShadow = true;
    scene.add(electrodeCathode);
    const electrodeAnode = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, electrodeH, 16), carbonMat
    );
    electrodeAnode.position.set(0.06, 0.025 + electrodeH / 2, 0);
    electrodeAnode.castShadow = true;
    scene.add(electrodeAnode);

    // ─── Cathode deposit (metal that forms on cathode) — initially hidden ──
    const deposit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xc97a3f, roughness: 0.4, metalness: 0.4 })
    );
    deposit.position.set(-0.06, 0.025 + 0.04, 0);
    deposit.visible = false;
    deposit.scale.set(0.001, 0.001, 0.001);
    scene.add(deposit);

    // ─── Wires / power-supply labels (visual icon) ──────────────────────
    const powerGroup = new THREE.Group();
    powerGroup.position.set(0, 0.5, 0);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
    const wireRed = new THREE.MeshStandardMaterial({ color: 0xb02020, roughness: 0.7 });
    const wireBlack = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    // Two short wires from electrode tops up to a small "battery" box
    const wireL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0025, 0.0025, 0.16, 8), wireBlack
    );
    wireL.position.set(-0.06, 0, 0);
    powerGroup.add(wireL);
    const wireR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0025, 0.0025, 0.16, 8), wireRed
    );
    wireR.position.set(0.06, 0, 0);
    powerGroup.add(wireR);
    const battery = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.04, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x383a3e, roughness: 0.5, metalness: 0.3 })
    );
    battery.position.y = 0.1;
    powerGroup.add(battery);
    // Battery label patch
    const batteryLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.9 })
    );
    batteryLabel.position.set(0, 0.1, 0.031);
    powerGroup.add(batteryLabel);
    scene.add(powerGroup);

    sceneObjects.current = {
      scene, camera, renderer,
      cellGroup, electrolyte, electrolyteMat, electrolyteSurface,
      electrodeCathode, electrodeAnode, electrodeCathodeMat: carbonMat, electrodeAnodeMat: carbonMat,
      deposit,
      bubbles: [],
      tweens: [],
      bubblesCathodeOn: false,
      bubblesAnodeOn: false,
      bubblesCathodeColour: 0xffffff,
      bubblesAnodeColour: 0xffffff,
      cellR, cellH,
      time: 0,
    };

    // Camera controls
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

    // Animation loop
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
        const t = tw.progress;
        if (tw.type === 'colour') {
          const fr = ((tw.from >> 16) & 0xff) / 255;
          const fg = ((tw.from >> 8) & 0xff) / 255;
          const fb = (tw.from & 0xff) / 255;
          const tr = ((tw.to >> 16) & 0xff) / 255;
          const tg = ((tw.to >> 8) & 0xff) / 255;
          const tb = (tw.to & 0xff) / 255;
          tw.material.color.setRGB(fr + (tr - fr) * t, fg + (tg - fg) * t, fb + (tb - fb) * t);
        } else if (tw.type === 'scale') {
          tw.target.scale.set(
            tw.from + (tw.to - tw.from) * t,
            tw.from + (tw.to - tw.from) * t,
            tw.from + (tw.to - tw.from) * t,
          );
        }
        if (tw.progress >= 1) {
          so.tweens.splice(i, 1);
          if (tw.onComplete) tw.onComplete();
        }
      }

      // Bubbles at cathode + anode
      const spawnBubble = (group, fromX, colour) => {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.005 + Math.random() * 0.004, 8, 8),
          new THREE.MeshPhysicalMaterial({
            color: colour, transparent: true, opacity: 0.7,
            roughness: 0.05, clearcoat: 0.7,
          })
        );
        bubble.position.set(
          fromX + (Math.random() - 0.5) * 0.01,
          0.04 + Math.random() * 0.02,
          (Math.random() - 0.5) * 0.01,
        );
        so.scene.add(bubble);
        so.bubbles.push({
          mesh: bubble,
          vy: 0.18 + Math.random() * 0.1,
          targetY: 0.025 + so.cellH * 0.75 + Math.random() * 0.015,
        });
      };
      if (so.bubblesCathodeOn && Math.random() < 0.4) {
        spawnBubble(null, -0.06, so.bubblesCathodeColour);
      }
      if (so.bubblesAnodeOn && Math.random() < 0.4) {
        spawnBubble(null, 0.06, so.bubblesAnodeColour);
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
  const tweenColour = (material, to, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'colour', material,
      from: material.color.getHex(), to,
      progress: 0, duration, onComplete: res,
    });
  });
  const tweenScale = (target, to, duration) => new Promise(res => {
    const so = sceneObjects.current;
    so.tweens.push({
      type: 'scale', target,
      from: target.scale.x, to,
      progress: 0, duration, onComplete: res,
    });
  });
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // RUN AN EXPERIMENT
  // ═══════════════════════════════════════════════════════════════════════════
  const runExperiment = async (electrolyte) => {
    const so = sceneObjects.current;
    // Set electrolyte colour
    so.electrolyteMat.color.setHex(electrolyte.liquidColour);
    so.electrolyteSurface.material.color.setRGB(
      ((electrolyte.liquidColour >> 16) & 0xff) / 255 * 0.85,
      ((electrolyte.liquidColour >> 8) & 0xff) / 255 * 0.85,
      (electrolyte.liquidColour & 0xff) / 255 * 0.85,
    );
    // Set electrode appearance
    const useCopper = electrolyte.electrodes === 'copper';
    so.electrodeCathode.material.color.setHex(useCopper ? 0xc97a3f : 0x2a2a2a);
    so.electrodeAnode.material.color.setHex(useCopper ? 0xc97a3f : 0x2a2a2a);
    // Reset deposit
    so.deposit.visible = false;
    so.deposit.scale.set(0.001, 0.001, 0.001);

    setPhase('running');
    setBuzz(true);
    await delay(800);

    // Configure bubble streams based on products
    // Cathode bubbles colour
    if (electrolyte.cathodeProduct === 'H2') {
      so.bubblesCathodeOn = true; so.bubblesCathodeColour = 0xffffff;
    } else if (electrolyte.cathodeProduct === 'Cu' || electrolyte.cathodeProduct === 'Pb') {
      so.bubblesCathodeOn = false;
      // Grow deposit
      so.deposit.material.color.setHex(electrolyte.cathodeProduct === 'Cu' ? 0xc97a3f : 0x8a8e94);
      so.deposit.visible = true;
      tweenScale(so.deposit, 1.0, 2.5);
    }
    // Anode bubbles colour
    if (electrolyte.anodeProduct === 'O2') {
      so.bubblesAnodeOn = true; so.bubblesAnodeColour = 0xffffff;
    } else if (electrolyte.anodeProduct === 'Cl2') {
      so.bubblesAnodeOn = true; so.bubblesAnodeColour = 0xeaf2c8;
    } else if (electrolyte.anodeProduct === 'Br2') {
      so.bubblesAnodeOn = true; so.bubblesAnodeColour = 0xc66833;
    } else if (electrolyte.anodeProduct === 'Cu-dissolves') {
      // Anode shrinks slightly (visualised by tweening electrode width via scale.x)
      so.electrodeAnode.scale.set(1, 0.9, 1);
    }
    setBubble(true);
    await delay(2200);

    // For CuSO4 with carbon — the blue colour fades as Cu²⁺ is consumed
    if (electrolyte.fadeElectrolyte) {
      await tweenColour(so.electrolyteMat, 0xd0d4d8, 2.5);
    }

    await delay(1200);
    setBubble(false);
    setBuzz(false);
    so.bubblesCathodeOn = false;
    so.bubblesAnodeOn = false;
    setPhase('identify');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('menu');
    setResults([]);
  };
  const pickElectrolyte = (id) => {
    if (completedIds.has(id)) return;
    playClick();
    setCurrentId(id);
    setCathodeGuess(null);
    setAnodeGuess(null);
    const electrolyte = ELECTROLYTES.find(e => e.id === id);
    if (electrolyte) {
      runExperiment(electrolyte);
    }
  };
  const submitIdentification = () => {
    if (!current || !cathodeGuess || !anodeGuess) return;
    const cathodeCorrect = cathodeGuess === current.cathodeProduct;
    const anodeCorrect = anodeGuess === current.anodeProduct;
    const fullyCorrect = cathodeCorrect && anodeCorrect;
    if (fullyCorrect) playChime(); else playWrong();
    setResults(prev => [...prev, {
      electrolyteId: currentId,
      cathodeGuess, anodeGuess,
      cathodeCorrect, anodeCorrect, fullyCorrect,
    }]);
    setPhase('result-trial');
  };
  const backToMenu = () => {
    const so = sceneObjects.current;
    if (so.electrodeAnode) so.electrodeAnode.scale.set(1, 1, 1);
    setCurrentId(null);
    setCathodeGuess(null);
    setAnodeGuess(null);
    if (completedIds.size + 1 >= ELECTROLYTES.length) {
      setPhase('session-end');
    } else {
      setPhase('menu');
    }
  };
  const resetSession = () => {
    setResults([]);
    setCurrentId(null);
    setCathodeGuess(null);
    setAnodeGuess(null);
    setPhase('menu');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const correctCount = results.filter(r => r.fullyCorrect).length;

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
            NSSCO · Chemistry · Topic 5.1
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Electrolysis</span>
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
        {(phase === 'running' || phase === 'identify' || phase === 'result-trial') && current && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none max-w-md"
               style={{ fontFamily: mono }}>
            <div className="font-semibold mb-0.5">{current.label}</div>
            {phase === 'identify' && (
              <div className="text-[10px] opacity-75 leading-snug">
                {current.cathodeNote} {current.anodeNote}
              </div>
            )}
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
              Investigate the products of <span style={{ fontStyle: 'italic' }}>electrolysis</span> for six different electrolyte / electrode combinations from the syllabus.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Pick an electrolyte, watch the cell run, then identify the product at the cathode and the anode. The half-equations are revealed at the end of each trial.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Zap size={13} /> Enter the Lab
            </button>
          </div>
        )}

        {phase === 'menu' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Choose an electrolyte · {results.length} of {ELECTROLYTES.length} done
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ELECTROLYTES.map(e => {
                const done = completedIds.has(e.id);
                const result = results.find(r => r.electrolyteId === e.id);
                return (
                  <button key={e.id} onClick={() => pickElectrolyte(e.id)}
                          disabled={done}
                          className="py-2 px-3 text-[10px] text-left active:scale-[0.99] disabled:opacity-60"
                          style={{
                            background: done
                              ? (result?.fullyCorrect ? 'rgba(46,125,50,0.18)' : 'rgba(194,24,91,0.18)')
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.15)',
                            fontFamily: mono,
                          }}>
                    <div className="font-semibold mb-0.5">{e.label}</div>
                    <div className="opacity-60 text-[9px] leading-snug">{e.description}</div>
                    {done && (
                      <div className="text-[9px] mt-1" style={{ color: result.fullyCorrect ? '#7fbf8a' : '#e0809a' }}>
                        {result.fullyCorrect ? '✓ correct' : 'review'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {results.length > 0 && (
              <button onClick={() => setPhase('session-end')}
                      className="w-full mt-3 py-2.5 text-[10px] uppercase active:scale-95"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.22em' }}>
                Finish Session ({correctCount} / {results.length} correct)
              </button>
            )}
          </div>
        )}

        {phase === 'running' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Electrolysis running · {current.label}
            </div>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              current flowing · observe both electrodes
            </div>
          </div>
        )}

        {phase === 'identify' && current && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Identify the products
            </div>
            <div className="mb-3">
              <div className="text-[10px] opacity-65 mb-1 uppercase"
                   style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                Cathode (− electrode)
              </div>
              <div className="grid grid-cols-1 gap-1">
                {PRODUCT_OPTIONS.filter(o => o.id !== 'Cu-dissolves').map(o => (
                  <button key={o.id} onClick={() => setCathodeGuess(o.id)}
                          className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99]"
                          style={{
                            background: cathodeGuess === o.id
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.06)',
                            border: '1px solid rgba(232,228,216,0.15)',
                            fontFamily: mono,
                          }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-[10px] opacity-65 mb-1 uppercase"
                   style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                Anode (+ electrode)
              </div>
              <div className="grid grid-cols-1 gap-1">
                {PRODUCT_OPTIONS.filter(o => o.id !== 'Pb' && o.id !== 'Cu').map(o => (
                  <button key={o.id} onClick={() => setAnodeGuess(o.id)}
                          className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99]"
                          style={{
                            background: anodeGuess === o.id
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.06)',
                            border: '1px solid rgba(232,228,216,0.15)',
                            fontFamily: mono,
                          }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={submitIdentification}
                    disabled={!cathodeGuess || !anodeGuess}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Submit
            </button>
          </div>
        )}

        {phase === 'result-trial' && current && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const last = results[results.length - 1];
              if (!last) return null;
              return (
                <>
                  <div className="text-xl flex items-center gap-2 mb-2" style={{ fontWeight: 500 }}>
                    {last.fullyCorrect
                      ? <><Check size={20} /> Both correct</>
                      : (last.cathodeCorrect || last.anodeCorrect)
                        ? <><Check size={20} /> Partial</>
                        : <><X size={20} /> Not correct</>}
                  </div>
                  <div className="text-xs mb-2" style={{ fontFamily: mono }}>
                    <div className={last.cathodeCorrect ? 'text-green-300' : 'text-pink-300'}>
                      Cathode: {current.cathodeHalfEq}
                    </div>
                    <div className={last.anodeCorrect ? 'text-green-300' : 'text-pink-300'}>
                      Anode: {current.anodeHalfEq}
                    </div>
                  </div>
                  <button onClick={backToMenu}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    {completedIds.size + 1 >= ELECTROLYTES.length ? 'See Session Score' : 'Back to Menu'} <ChevronRight size={14} />
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase text-stone-500"
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Score</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Electrolysis <span style={{ fontStyle: 'italic' }}>products</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: correctCount === results.length ? '#2e7d32' : '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>
            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {correctCount} <span className="text-stone-400 text-lg">/ {results.length}</span>
            </div>
            <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: mono }}>
              {results.map((r, i) => {
                const e = ELECTROLYTES.find(x => x.id === r.electrolyteId);
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-stone-700 flex-1 truncate">{e?.label}</span>
                    <span style={{ color: r.fullyCorrect ? '#2e7d32' : '#c2185b', fontWeight: 500 }}>
                      {r.fullyCorrect ? '✓' : 'partial / wrong'}
                    </span>
                  </div>
                );
              })}
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
