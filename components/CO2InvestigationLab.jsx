'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check,
  Volume2, VolumeX, Sun,
} from 'lucide-react';

// ============================================================================
// CO₂ INVESTIGATION LAB · v1
// NSSCO Biology Practical — Investigating whether photosynthesis requires CO₂.
// A destarched plant has three leaves, each sealed inside a transparent bag.
// Each bag contains a different chemical:
//   - Soda lime         (absorbs CO₂ → no CO₂ around the leaf)
//   - Sodium bicarbonate (releases CO₂ → plenty of CO₂)
//   - Water (control)   (atmospheric CO₂ only)
// After hours in light, the iodine starch test reveals which leaves
// photosynthesised.
// ============================================================================

const SUBSTANCES = [
  {
    id: 'sodaLime',
    label: 'Soda lime',
    note: 'Absorbs CO₂ from the air inside the bag',
    hasStarch: false,
    bagTint: 0xece6d2,
  },
  {
    id: 'sodiumBicarb',
    label: 'Sodium bicarbonate',
    note: 'Slowly releases CO₂',
    hasStarch: true,
    bagTint: 0xe8f0ff,
  },
  {
    id: 'water',
    label: 'Water (control)',
    note: 'No CO₂-affecting chemical, atmospheric CO₂ available',
    hasStarch: true,
    bagTint: 0xeaf6f6,
  },
];

// Shuffle helper
const shuffled = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function CO2InvestigationLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'predict' → 'exposing' → 'observe' → 'results'
  const [phase, setPhase] = useState('intro');
  const [bags, setBags] = useState([]); // shuffled SUBSTANCES copy, length 3
  const [prediction, setPrediction] = useState({ A: false, B: false, C: false });
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);
  const [exposureProgress, setExposureProgress] = useState(0); // 0..1

  // Refs mirroring state for animation loop
  const sunRef = useRef({ active: false, progress: 0 });

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

      const drip = new Tone.PluckSynth({
        attackNoise: 0.6, dampening: 4500, resonance: 0.88,
      }).connect(master);
      drip.volume.value = -10;

      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;

      // Birdsong-ish for the time-skip
      const bird = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.04, release: 0.15 },
      }).connect(master);
      bird.volume.value = -16;

      audioRef.current = { initialized: true, master, click, drip, chime, bird };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playDrip = () => {
    if (muted || !audioRef.current.initialized) return;
    const notes = ['C6', 'D6', 'E6', 'C6', 'A5', 'B5'];
    audioRef.current.drip.triggerAttack(notes[Math.floor(Math.random() * notes.length)]);
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  const chirp = () => {
    if (muted || !audioRef.current.initialized) return;
    const notes = ['G5', 'B5', 'C6', 'E6'];
    audioRef.current.bird.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '32n');
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

  // Initialise bags on mount
  useEffect(() => {
    setBags(shuffled(SUBSTANCES));
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
    camera.position.set(0, 1.1, 2.6);
    camera.lookAt(0, 0.45, 0);

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
    const ambient = new THREE.AmbientLight(0xfff0d4, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.2);
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    // The "sun" — a strong directional light that we arc overhead during the time-skip
    const sunLight = new THREE.DirectionalLight(0xfff6c8, 1.8);
    sunLight.position.set(-2.5, 1.5, 1.5);
    scene.add(sunLight);

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

    // ═══ POT ════════════════════════════════════════════════════════════════
    const potGroup = new THREE.Group();
    potGroup.position.set(0, 0.025, -0.05);
    const potBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.085, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xa05a36, roughness: 0.85 })
    );
    potBody.position.y = 0.06;
    potBody.castShadow = true; potBody.receiveShadow = true;
    potGroup.add(potBody);
    const potRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.008, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x8a4a2e, roughness: 0.85 })
    );
    potRim.rotation.x = Math.PI / 2;
    potRim.position.y = 0.12;
    potGroup.add(potRim);
    // Soil disc
    const soil = new THREE.Mesh(
      new THREE.CircleGeometry(0.115, 24),
      new THREE.MeshStandardMaterial({ color: 0x35221a, roughness: 1 })
    );
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.121;
    potGroup.add(soil);
    scene.add(potGroup);

    // ═══ STEM + 3 LEAVES + BAGS ═════════════════════════════════════════════
    const plantGroup = new THREE.Group();
    plantGroup.position.set(0, 0.025 + 0.121, -0.05);
    scene.add(plantGroup);

    // Main stem
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x5a8a3a, roughness: 0.7,
    });
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.012, 0.45, 12), stemMat
    );
    stem.position.y = 0.225;
    plantGroup.add(stem);

    // Three branches going to leaves at different heights/angles
    const branchSpecs = [
      { angle:  Math.PI * 0.0, y: 0.36, label: 'A' }, // toward camera/front-right
      { angle:  Math.PI * 0.66, y: 0.30, label: 'B' }, // back-left
      { angle: -Math.PI * 0.66, y: 0.40, label: 'C' }, // front-left
    ];

    const leafCanvases = []; // store canvases so we can repaint them later
    const leafMeshes = [];   // for animations
    const bagGroups = [];

    branchSpecs.forEach((spec) => {
      const branchGroup = new THREE.Group();
      branchGroup.position.y = spec.y;
      branchGroup.rotation.y = spec.angle;
      plantGroup.add(branchGroup);

      // Branch stick
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.006, 0.15, 8), stemMat
      );
      stick.rotation.z = -Math.PI / 2.6;
      stick.position.set(0.06, 0.025, 0);
      branchGroup.add(stick);

      // Leaf canvas + texture
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const leafTex = new THREE.CanvasTexture(c);
      leafTex.anisotropy = 4;
      leafCanvases.push(c);
      // Initial: fresh green leaf
      const ctx = c.getContext('2d');
      const w = 256, h = 256, cx = w / 2;
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.08);
      ctx.bezierCurveTo(w * 0.88, h * 0.2, w * 0.95, h * 0.5, cx, h * 0.94);
      ctx.bezierCurveTo(w * 0.05, h * 0.5, w * 0.12, h * 0.2, cx, h * 0.08);
      ctx.closePath();
      ctx.fillStyle = '#4a8030';
      ctx.fill();
      ctx.strokeStyle = 'rgba(20,32,16,0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.1);
      ctx.lineTo(cx, h * 0.9);
      ctx.stroke();
      for (let k = 0; k < 6; k++) {
        const y = h * (0.2 + k * 0.12);
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.quadraticCurveTo(cx - 30, y + 16, cx - 56, y + 28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.quadraticCurveTo(cx + 30, y + 16, cx + 56, y + 28);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(30,40,20,0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.08);
      ctx.bezierCurveTo(w * 0.88, h * 0.2, w * 0.95, h * 0.5, cx, h * 0.94);
      ctx.bezierCurveTo(w * 0.05, h * 0.5, w * 0.12, h * 0.2, cx, h * 0.08);
      ctx.closePath();
      ctx.stroke();
      leafTex.needsUpdate = true;

      const leafMat = new THREE.MeshStandardMaterial({
        map: leafTex, transparent: true, alphaTest: 0.05,
        side: THREE.DoubleSide, roughness: 0.7,
      });
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.15), leafMat);
      leaf.position.set(0.18, 0.05, 0);
      leaf.rotation.y = -Math.PI / 2;
      leaf.castShadow = true;
      branchGroup.add(leaf);
      leafMeshes.push({ mesh: leaf, branchGroup, texture: leafTex, canvas: c, label: spec.label });

      // Bag around leaf (translucent rectangular bag)
      const bagGroup = new THREE.Group();
      bagGroup.position.set(0.18, 0.04, 0);
      bagGroup.rotation.y = -Math.PI / 2;
      const bagBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.22, 0.06),
        new THREE.MeshPhysicalMaterial({
          color: 0xeaf6f6, transparent: true, opacity: 0.28,
          roughness: 0.18, clearcoat: 0.7, side: THREE.DoubleSide,
        })
      );
      bagGroup.add(bagBody);
      // Tie at top (small dark band)
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.015, 0.07),
        new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.7 })
      );
      tie.position.y = 0.12;
      bagGroup.add(tie);
      // Substance lump at the bottom (small box)
      const lump = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.02, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xe6e2c8, roughness: 0.9 })
      );
      lump.position.y = -0.09;
      bagGroup.add(lump);
      bagGroup.userData = { bagBody, lump };
      branchGroup.add(bagGroup);
      bagGroups.push(bagGroup);
    });

    // ═══ THREE WHITE TEST TILES on the foreground tile ══════════════════════
    const testTiles = [];
    const tilePositions = [
      new THREE.Vector3(-0.55, 0.027, 0.32),
      new THREE.Vector3(0.0,   0.027, 0.42),
      new THREE.Vector3(0.55,  0.027, 0.32),
    ];
    tilePositions.forEach((p) => {
      const tt = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.008, 0.18),
        new THREE.MeshStandardMaterial({ color: 0xf0e8d6, roughness: 0.7 })
      );
      tt.position.copy(p);
      tt.castShadow = true; tt.receiveShadow = true;
      scene.add(tt);
      testTiles.push(tt);
    });

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      sunLight, ambient,
      plantGroup, leafMeshes, bagGroups,
      testTiles,
      droplets: [], splashes: [],
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.45;
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

      // Plant gentle sway
      so.plantGroup.rotation.y = Math.sin(so.time * 0.3) * 0.04;

      // Sun arc during exposing phase
      const sun = sunRef.current;
      if (sun.active) {
        sun.progress = Math.min(1, sun.progress + dt * 0.15); // ~6.7s to complete
        const angle = sun.progress * Math.PI; // 0 → π (sunrise → sunset)
        // Light position arcs from (-3, low, 1) → over the top → (3, low, -1)
        const x = -Math.cos(angle) * 3;
        const y = 1 + Math.sin(angle) * 3.5;
        const z = 1.2 - sun.progress * 2.4;
        so.sunLight.position.set(x, y, z);
        // Light intensity stronger at midday
        so.sunLight.intensity = 1.2 + Math.sin(angle) * 1.0;
        // Tint warmer at dawn/dusk
        const warmth = Math.sin(angle);
        const r = 1, g = 0.92 + warmth * 0.04, b = 0.72 + warmth * 0.18;
        so.sunLight.color.setRGB(r, g, b);
        setExposureProgress(sun.progress);

        // Occasional bird chirp
        if (Math.random() < 0.015) chirp();

        if (sun.progress >= 1) {
          sun.active = false;
          // Hand control back to React. A useEffect listening on `phase`
          // will run beginObservation with fresh bags state.
          setTimeout(() => setPhase('observe'), 600);
        }
      }

      // Droplets + splashes (used in starch test phase)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToInit]);

  // ─── helper: splash ─────────────────────────────────────────────────────
  function spawnSplash(so, x, y, z, color) {
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.random() * 0.6;
      const speed = 0.2 + Math.random() * 0.18;
      const splash = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 8, 8),
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
        vy: 1.0 + Math.random() * 0.4,
        vz: Math.sin(angle) * speed,
        life: 1.0,
      });
    }
  }

  // ─── helper: drop iodine onto a position ─────────────────────────────────
  const dropAt = (origin, targetY, color, count, callback) => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    let dropped = 0;
    const drip = () => {
      playDrip();
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 12, 12),
        new THREE.MeshPhysicalMaterial({
          color, transparent: true, opacity: 0.92,
          roughness: 0.05, clearcoat: 0.8,
          emissive: color, emissiveIntensity: 0.12,
        })
      );
      drop.position.set(origin.x, origin.y, origin.z);
      so.scene.add(drop);
      so.droplets.push({ mesh: drop, vy: 0, targetY, color });
      dropped++;
      if (dropped < count) {
        setTimeout(drip, 180);
      } else if (callback) {
        setTimeout(callback, 400);
      }
    };
    drip();
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setBags(shuffled(SUBSTANCES));
    setPhase('predict');
  };

  // Update the bag tints in the 3D scene whenever bags change
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.bagGroups || bags.length !== 3) return;
    bags.forEach((sub, i) => {
      const bg = so.bagGroups[i];
      if (!bg) return;
      bg.userData.bagBody.material.color.setHex(sub.bagTint);
      // Tint the lump too
      bg.userData.lump.material.color.setHex(
        sub.id === 'sodaLime' ? 0xe6e2c8 :
        sub.id === 'sodiumBicarb' ? 0xffffff :
        0xb0d0e8
      );
    });
  }, [bags, readyToInit]);

  const submitPrediction = () => {
    playClick();
    sunRef.current = { active: true, progress: 0 };
    setExposureProgress(0);
    setPhase('exposing');
  };

  // When the animation loop sets phase to 'observe', run the procedure with
  // fresh React state (avoids the stale-closure trap of calling it directly
  // from the captured-once useEffect).
  useEffect(() => {
    if (phase === 'observe' && bags.length === 3) {
      beginObservation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const beginObservation = async () => {
    const so = sceneObjects.current;
    if (!so.leafMeshes) return;

    // Animate: remove bags, drop leaves onto tiles, drop iodine on each, reveal
    await delay(400);

    // Fade out / shrink bags
    so.bagGroups.forEach((bg) => {
      bg.visible = false;
    });

    // For each leaf: animate it to its corresponding tile, then iodine drop, reveal
    const tilePositions = so.testTiles.map(t => t.position);
    for (let i = 0; i < so.leafMeshes.length; i++) {
      const leafInfo = so.leafMeshes[i];
      const targetTile = tilePositions[i];

      // Detach the leaf from the branch by reparenting to the scene
      const worldPos = new THREE.Vector3();
      leafInfo.mesh.getWorldPosition(worldPos);
      const worldQuat = new THREE.Quaternion();
      leafInfo.mesh.getWorldQuaternion(worldQuat);
      so.scene.attach(leafInfo.mesh);
      leafInfo.mesh.position.copy(worldPos);
      leafInfo.mesh.quaternion.copy(worldQuat);

      // Animate to a position above the tile, then onto the tile (face up)
      const toAbove = new THREE.Vector3(targetTile.x, 0.45, targetTile.z);
      const toTile  = new THREE.Vector3(targetTile.x, targetTile.y + 0.012, targetTile.z);
      await tweenObject(leafInfo.mesh, leafInfo.mesh.position.clone(), toAbove, 0.7);
      // Rotate to face up while descending
      const startQuat = leafInfo.mesh.quaternion.clone();
      const endRot = new THREE.Euler(-Math.PI / 2, 0, 0);
      const endQuat = new THREE.Quaternion().setFromEuler(endRot);
      await tweenQuatAndPos(leafInfo.mesh, startQuat, endQuat, toAbove, toTile, 0.6);
      playClick();

      // Drop iodine onto the leaf
      const origin = new THREE.Vector3(targetTile.x, 0.45, targetTile.z);
      await new Promise(res =>
        dropAt(origin, targetTile.y + 0.02, 0x9a5c1f, 4, res)
      );

      // Reveal the iodine result
      const substance = bags[i];
      const pattern = substance.hasStarch ? 'starch' : 'noStarch';
      paintLeafResult(leafInfo.canvas, pattern);
      leafInfo.texture.needsUpdate = true;
      await delay(700);
    }

    playChime();
    await delay(500);
    // Auto-show results
    setPhase('results');
  };

  // ─── tween helpers (inline, since this lab is self-contained) ───────────
  const tweenObject = (obj, from, to, duration) => {
    return new Promise(resolve => {
      const start = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - start) / (duration * 1000));
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        obj.position.lerpVectors(from, to, e);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      step();
    });
  };
  const tweenQuatAndPos = (obj, fromQ, toQ, fromP, toP, duration) => {
    return new Promise(resolve => {
      const start = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - start) / (duration * 1000));
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        obj.quaternion.copy(fromQ).slerp(toQ, e);
        obj.position.lerpVectors(fromP, toP, e);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      step();
    });
  };

  const paintLeafResult = (c, pattern) => {
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height, cx = w / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.08);
    ctx.bezierCurveTo(w * 0.88, h * 0.2, w * 0.95, h * 0.5, cx, h * 0.94);
    ctx.bezierCurveTo(w * 0.05, h * 0.5, w * 0.12, h * 0.2, cx, h * 0.08);
    ctx.closePath();
    ctx.fillStyle = pattern === 'starch' ? '#181a36' : '#9a7138';
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,40,20,0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  const scoreSession = () => {
    let score = 0;
    bags.forEach((sub, i) => {
      const label = ['A', 'B', 'C'][i];
      const expected = sub.hasStarch;
      const predicted = !!prediction[label];
      if (expected === predicted) score++;
    });
    return score;
  };

  const resetSession = () => {
    setBags(shuffled(SUBSTANCES));
    setPrediction({ A: false, B: false, C: false });
    setExposureProgress(0);
    // Reset visuals
    const so = sceneObjects.current;
    if (so.bagGroups) {
      so.bagGroups.forEach(bg => { bg.visible = true; });
    }
    if (so.leafMeshes && so.plantGroup) {
      // Re-attach leaves to their branch groups and repaint as fresh
      so.leafMeshes.forEach((info) => {
        // Repaint canvas to fresh green
        const c = info.canvas;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height, cx = w / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(cx, h * 0.08);
        ctx.bezierCurveTo(w * 0.88, h * 0.2, w * 0.95, h * 0.5, cx, h * 0.94);
        ctx.bezierCurveTo(w * 0.05, h * 0.5, w * 0.12, h * 0.2, cx, h * 0.08);
        ctx.closePath();
        ctx.fillStyle = '#4a8030';
        ctx.fill();
        ctx.strokeStyle = 'rgba(30,40,20,0.55)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        info.texture.needsUpdate = true;
        // Re-parent to its branch
        info.branchGroup.attach(info.mesh);
        info.mesh.position.set(0.18, 0.05, 0);
        info.mesh.rotation.set(0, -Math.PI / 2, 0);
      });
    }
    setPhase('predict');
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
            NSSCO · Biology Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>CO₂</span> · Need for Photosynthesis
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
        {(phase === 'predict' || phase === 'exposing' || phase === 'observe') && bags.length === 3 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div className="text-right">A · {bags[0]?.label}</div>
            <div className="text-right">B · {bags[1]?.label}</div>
            <div className="text-right">C · {bags[2]?.label}</div>
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
              Does <span style={{ fontStyle: 'italic' }}>carbon dioxide</span> need to be present for photosynthesis to make starch?
            </p>
            <p className="text-xs opacity-65 mb-4">
              A destarched plant has three leaves enclosed in transparent bags, each with a different chemical: soda lime (absorbs CO₂), sodium bicarbonate (releases CO₂), or water (a control). After hours in light, the iodine starch test on each leaf will tell us which conditions allowed photosynthesis.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'predict' && bags.length === 3 && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-3"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Predict · Which leaves will test positive for starch?
            </div>
            <div className="space-y-1.5 mb-3">
              {bags.map((sub, i) => {
                const label = ['A', 'B', 'C'][i];
                const checked = prediction[label];
                return (
                  <button key={label}
                          onClick={() => setPrediction(p => ({ ...p, [label]: !p[label] }))}
                          className="w-full py-2 px-3 text-left text-xs flex items-center gap-3 active:scale-[0.99]"
                          style={{
                            background: checked
                              ? 'rgba(232,228,216,0.2)'
                              : 'rgba(232,228,216,0.06)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    <span className="w-5 h-5 inline-flex items-center justify-center"
                          style={{ border: '1px solid rgba(232,228,216,0.5)',
                                   background: checked ? '#e8e4d8' : 'transparent',
                                   color: '#1a1f2e' }}>
                      {checked && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="flex-1">
                      <span className="opacity-65 mr-2">{label}</span>
                      {sub.label}
                      <span className="opacity-50 ml-2 text-[9px]">{sub.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button onClick={submitPrediction}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              <Sun size={13} /> Expose to Light
            </button>
          </div>
        )}

        {phase === 'exposing' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Exposing to light · ~6 hours compressed
            </div>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all"
                   style={{ width: `${exposureProgress * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
            <p className="text-xs opacity-65 leading-snug">
              Sun arcs over the bench. Inside each bag, the air composition follows whichever chemical it contains. Once the day is over we'll test each leaf for starch.
            </p>
          </div>
        )}

        {phase === 'observe' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Running starch tests · iodine on each leaf
            </div>
            <div className="text-[10px] opacity-55 flex items-center gap-2"
                 style={{ fontFamily: mono, letterSpacing: '0.18em' }}>
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              observing...
            </div>
          </div>
        )}
      </div>

      {phase === 'results' && bags.length === 3 && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {(() => {
              const score = scoreSession();
              const total = 3;
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase text-stone-500"
                           style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Results</div>
                      <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                        CO₂ <span style={{ fontStyle: 'italic' }}>conclusion</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full"
                         style={{ backgroundColor: score === total ? '#2e7d32' : '#c2185b', color: 'white' }}>
                      <Trophy size={18} />
                    </div>
                  </div>

                  <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
                    {score} <span className="text-stone-400 text-lg">/ {total}</span>
                  </div>

                  <div className="space-y-2 text-sm mb-4" style={{ fontFamily: mono }}>
                    {bags.map((sub, i) => {
                      const label = ['A', 'B', 'C'][i];
                      const predicted = prediction[label];
                      const expected = sub.hasStarch;
                      const correct = predicted === expected;
                      return (
                        <div key={label} className="grid grid-cols-3 gap-2 items-center text-xs">
                          <div className="text-stone-700">
                            <span className="opacity-60 mr-2">{label}</span>
                            <span style={{ fontWeight: 500 }}>{sub.label}</span>
                          </div>
                          <div className="text-stone-600">
                            you: {predicted ? '✓ starch' : '— no starch'}
                          </div>
                          <div style={{
                            color: correct ? '#2e7d32' : '#c2185b',
                            fontWeight: 500,
                          }}>
                            {correct ? '✓' : '✗'} actual: {expected ? 'blue-black' : 'amber'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-stone-100 p-3 mb-4 text-xs text-stone-700 leading-snug">
                    Photosynthesis requires CO₂. The leaf in soda lime had its CO₂ absorbed and could not make starch. The bicarbonate leaf had abundant CO₂; the water control had atmospheric CO₂ — both photosynthesised normally.
                  </div>

                  <button onClick={resetSession}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                                   fontFamily: mono, letterSpacing: '0.25em' }}>
                    <RotateCcw size={13} /> Reshuffle and Try Again
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
