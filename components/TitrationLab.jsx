'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Droplet, Square,
} from 'lucide-react';

// ============================================================================
// TITRATION LAB · v1
// NSSCO Chemistry Practical — Acid-base titration.
// A burette of known NaOH titrates an unknown HCl in a conical flask
// (phenolphthalein indicator). The student stops when the persistent pink
// appears, reads the volume, and calculates the acid's concentration.
// ============================================================================

const NAOH_CONC = 0.100;   // mol/dm³, known
const ACID_VOL  = 25.0;    // cm³ of acid in the flask
const BURETTE_CAPACITY = 50.0; // cm³

// Each "fast add" tick (10 Hz) adds this much
const FAST_TICK_ML = 0.5;
const FINE_TICK_ML = 0.1;
const DROP_ML = 0.05;

// Sigmoid color around equivalence
function pinkness(addedMl, equivMl) {
  const k = 18; // steepness — sharper means tighter endpoint
  return 1 / (1 + Math.exp(-(addedMl - equivMl) * k / 0.5));
}

export default function TitrationLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'setup' → 'titrating' → 'finished' → 'results'
  const [phase, setPhase] = useState('intro');
  const [addedMl, setAddedMl] = useState(0);
  const [trueAcidM, setTrueAcidM] = useState(0.1);
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Mirror for animation-loop fast-tap mode
  const flowRef = useRef({ fastOpen: false, lastFastTickAt: 0 });
  // Equivalence volume needed (for the current trial)
  const equivMlRef = useRef(25);

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
        attackNoise: 0.5, dampening: 4500, resonance: 0.85,
      }).connect(master);
      drip.volume.value = -12;
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      // Continuous flow (filtered noise)
      const flowNoise = new Tone.Noise('pink');
      const flowBP = new Tone.Filter(1400, 'bandpass');
      flowBP.Q.value = 0.8;
      const flowGain = new Tone.Gain(0).connect(master);
      flowNoise.chain(flowBP, flowGain);
      flowNoise.start();
      audioRef.current = { initialized: true, master, click, drip, chime, flowGain };
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
  const setFlow = (on) => {
    if (!audioRef.current.initialized) return;
    const g = audioRef.current.flowGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(on && !muted ? 0.12 : 0, 0.15);
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
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0.2, 1.1, 2.6);
    camera.lookAt(0, 0.5, 0);

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
      transparent: true, opacity: 0.16, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x383a3e, metalness: 0.7, roughness: 0.35 });

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

    // ═══ STAND ═════════════════════════════════════════════════════════════
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.025, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.7, roughness: 0.35 })
    );
    standBase.position.set(0, 0.0375, -0.25);
    standBase.castShadow = true; standBase.receiveShadow = true;
    scene.add(standBase);
    const standRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 1.3, 12), metalMat
    );
    standRod.position.set(-0.12, 0.7, -0.25);
    standRod.castShadow = true;
    scene.add(standRod);
    const clampArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.014, 0.022), metalMat
    );
    clampArm.position.set(-0.03, 1.05, -0.25);
    clampArm.castShadow = true;
    scene.add(clampArm);
    const clampRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.022, 0.005, 8, 24), metalMat
    );
    clampRing.rotation.x = Math.PI / 2;
    clampRing.position.set(0.05, 1.05, -0.25);
    scene.add(clampRing);

    // ═══ BURETTE ═══════════════════════════════════════════════════════════
    // Tall thin glass cylinder. Held by the clamp. The bottom has a small
    // tapered tip + stopcock.
    const buretteHeight = 0.7;
    const buretteRadius = 0.018;
    const burette = new THREE.Mesh(
      new THREE.CylinderGeometry(buretteRadius, buretteRadius, buretteHeight, 24, 1, true),
      glassMat
    );
    burette.position.set(0.05, 0.65, -0.25);
    burette.renderOrder = 2;
    burette.castShadow = true;
    scene.add(burette);
    // Bottom taper
    const buretteTaper = new THREE.Mesh(
      new THREE.CylinderGeometry(buretteRadius, 0.003, 0.04, 16, 1, true),
      glassMat
    );
    buretteTaper.position.set(0.05, 0.65 - buretteHeight / 2 - 0.02, -0.25);
    scene.add(buretteTaper);
    // Stopcock (small valve at the bottom)
    const stopcock = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x9d4f1a, metalness: 0.2, roughness: 0.5 })
    );
    stopcock.position.set(0.05, 0.65 - buretteHeight / 2 - 0.045, -0.25);
    scene.add(stopcock);
    // Tip (thin cylinder below the stopcock)
    const buretteTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.003, 0.0015, 0.04, 12),
      glassMat
    );
    buretteTip.position.set(0.05, 0.65 - buretteHeight / 2 - 0.08, -0.25);
    scene.add(buretteTip);
    const BURETTE_TIP_Y = 0.65 - buretteHeight / 2 - 0.1;

    // Liquid inside the burette (starts full)
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f4fa, transparent: true, opacity: 0.78,
      roughness: 0.12, clearcoat: 0.4,
    });
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(buretteRadius * 0.92, buretteRadius * 0.92, buretteHeight * 0.95, 24),
      liquidMat
    );
    liquid.position.copy(burette.position);
    liquid.position.y = burette.position.y - 0.005;
    liquid.renderOrder = 1;
    scene.add(liquid);
    const liquidMeniscus = new THREE.Mesh(
      new THREE.CircleGeometry(buretteRadius * 0.92, 24),
      new THREE.MeshStandardMaterial({
        color: 0xd0d8e0, roughness: 0.4, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    liquidMeniscus.rotation.x = -Math.PI / 2;
    liquidMeniscus.position.set(burette.position.x, burette.position.y + buretteHeight * 0.475 - 0.005, burette.position.z);
    scene.add(liquidMeniscus);

    // ═══ CONICAL FLASK ═════════════════════════════════════════════════════
    // Built as a lathe geometry: a cone tapering up to a narrow neck.
    const flaskProfile = (() => {
      const pts = [];
      pts.push(new THREE.Vector2(0.001, 0));
      // Wide base
      const baseR = 0.07, baseH = 0.07;
      pts.push(new THREE.Vector2(baseR, 0));
      pts.push(new THREE.Vector2(baseR, baseH * 0.2));
      // Cone walls
      pts.push(new THREE.Vector2(baseR * 0.9, baseH * 0.6));
      pts.push(new THREE.Vector2(baseR * 0.45, baseH * 1.6));
      // Narrow neck up
      pts.push(new THREE.Vector2(0.015, baseH * 1.8));
      pts.push(new THREE.Vector2(0.015, baseH * 2.6));
      // Slight rim flare
      pts.push(new THREE.Vector2(0.018, baseH * 2.65));
      return pts;
    })();
    const flask = new THREE.Mesh(
      new THREE.LatheGeometry(flaskProfile, 32), glassMat
    );
    flask.position.set(0.05, 0.038, -0.25);
    flask.castShadow = true;
    flask.renderOrder = 2;
    scene.add(flask);

    // Liquid inside the flask (acid + indicator)
    const flaskLiquidProfile = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.064, 0.001),
      new THREE.Vector2(0.064, 0.012),
      new THREE.Vector2(0.058, 0.04),
      new THREE.Vector2(0.052, 0.06),
      new THREE.Vector2(0.045, 0.075),
      new THREE.Vector2(0.001, 0.075),
    ];
    const flaskLiquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafafa, transparent: true, opacity: 0.85,
      roughness: 0.15, clearcoat: 0.5,
    });
    const flaskLiquid = new THREE.Mesh(
      new THREE.LatheGeometry(flaskLiquidProfile, 32),
      flaskLiquidMat
    );
    flaskLiquid.position.copy(flask.position);
    flaskLiquid.renderOrder = 1;
    scene.add(flaskLiquid);
    const flaskMeniscus = new THREE.Mesh(
      new THREE.CircleGeometry(0.045, 24),
      new THREE.MeshStandardMaterial({
        color: 0xeeeeee, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    flaskMeniscus.rotation.x = -Math.PI / 2;
    flaskMeniscus.position.set(flask.position.x, flask.position.y + 0.076, flask.position.z);
    scene.add(flaskMeniscus);

    const FLASK_TOP_Y = flask.position.y + 0.18; // for drop target reference
    const FLASK_LIQUID_TOP = flask.position.y + 0.08;

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      burette, liquid, liquidMeniscus,
      flask, flaskLiquid, flaskLiquidMat, flaskMeniscus,
      buretteHeight, buretteRadius, buretteCenter: burette.position.clone(),
      BURETTE_TIP_Y, FLASK_TOP_Y, FLASK_LIQUID_TOP,
      droplets: [], splashes: [],
      time: 0,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.5;
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

      // Fast-add: every ~0.12s while flow is open, add a tick of NaOH
      const flow = flowRef.current;
      if (flow.fastOpen) {
        flow.lastFastTickAt += dt;
        while (flow.lastFastTickAt >= 0.12) {
          flow.lastFastTickAt -= 0.12;
          // Spawn a drop and update state via React's setState (functional)
          addNaOH(FAST_TICK_ML, false);
        }
      }

      // Droplets falling
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
      const speed = 0.18 + Math.random() * 0.14;
      const splash = new THREE.Mesh(
        new THREE.SphereGeometry(0.01, 8, 8),
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
        vy: 0.8 + Math.random() * 0.3,
        vz: Math.sin(angle) * speed,
        life: 0.8,
      });
    }
  }

  // ─── helper: drop one bead of NaOH from the tip into the flask ──────────
  const spawnDrop = () => {
    const so = sceneObjects.current;
    if (!so.scene) return;
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.011, 12, 12),
      new THREE.MeshPhysicalMaterial({
        color: 0xeaf0fa, transparent: true, opacity: 0.92,
        roughness: 0.05, clearcoat: 0.8,
      })
    );
    drop.position.set(so.buretteCenter.x, so.BURETTE_TIP_Y, so.buretteCenter.z);
    so.scene.add(drop);
    so.droplets.push({
      mesh: drop, vy: 0, targetY: so.FLASK_LIQUID_TOP, color: 0xeaf0fa,
    });
    playDrip();
  };

  // ─── Add NaOH to the flask (state + visuals) ────────────────────────────
  const addNaOH = (ml, withDrop = true) => {
    const so = sceneObjects.current;
    if (withDrop) spawnDrop();
    setAddedMl(prev => {
      const next = Math.min(BURETTE_CAPACITY, prev + ml);
      // Update burette liquid level
      if (so.liquid && so.liquidMeniscus) {
        const remainingFrac = 1 - next / BURETTE_CAPACITY;
        const fullH = so.buretteHeight * 0.95;
        const newH = Math.max(0.001, fullH * remainingFrac);
        so.liquid.geometry.dispose();
        so.liquid.geometry = new THREE.CylinderGeometry(
          so.buretteRadius * 0.92, so.buretteRadius * 0.92, newH, 24
        );
        so.liquid.position.y = so.buretteCenter.y - so.buretteHeight / 2 + newH / 2;
        so.liquidMeniscus.position.y = so.buretteCenter.y - so.buretteHeight / 2 + newH;
        if (newH <= 0.002) {
          so.liquid.visible = false;
          so.liquidMeniscus.visible = false;
        }
      }
      // Update flask color (interp white → pink)
      const p = pinkness(next, equivMlRef.current);
      const r = 250, g = 250 - 90 * p, b = 250 - 60 * p;
      if (so.flaskLiquidMat) {
        so.flaskLiquidMat.color.setRGB(r / 255, g / 255, b / 255);
      }
      if (so.flaskMeniscus) {
        so.flaskMeniscus.material.color.setRGB(r / 255 * 0.92, g / 255 * 0.92, b / 255 * 0.92);
      }
      return next;
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    startNewTrial();
    setPhase('setup');
  };

  const startNewTrial = () => {
    // Pick a random acid concentration so the student can't memorise
    const trueM = 0.05 + Math.random() * 0.12; // 0.05..0.17 M
    setTrueAcidM(trueM);
    // Equivalence volume: M_acid V_acid = M_base V_base
    const equiv = (trueM * ACID_VOL) / NAOH_CONC;
    equivMlRef.current = equiv;
    setAddedMl(0);
    // Reset visuals
    const so = sceneObjects.current;
    if (so.liquid) {
      so.liquid.visible = true;
      so.liquidMeniscus.visible = true;
      so.liquid.geometry.dispose();
      so.liquid.geometry = new THREE.CylinderGeometry(
        so.buretteRadius * 0.92, so.buretteRadius * 0.92, so.buretteHeight * 0.95, 24
      );
      so.liquid.position.y = so.buretteCenter.y - 0.005;
      so.liquidMeniscus.position.y = so.buretteCenter.y + so.buretteHeight * 0.475 - 0.005;
    }
    if (so.flaskLiquidMat) {
      so.flaskLiquidMat.color.setRGB(250 / 255, 250 / 255, 250 / 255);
    }
  };

  const fineAdd = () => {
    playClick();
    addNaOH(FINE_TICK_ML);
  };
  const dropAdd = () => {
    playClick();
    addNaOH(DROP_ML);
  };
  const fastToggle = (on) => {
    flowRef.current.fastOpen = on;
    flowRef.current.lastFastTickAt = 0;
    setFlow(on);
  };

  const stopTitration = () => {
    fastToggle(false);
    const userM = (NAOH_CONC * addedMl) / ACID_VOL;
    const err = Math.abs(userM - trueAcidM) / trueAcidM * 100;
    const rec = {
      addedMl,
      trueAcidM,
      userAcidM: userM,
      errorPct: err,
      // Pass if within 3% (sharp standard)
      pass: err <= 3.0,
    };
    if (rec.pass) playChime();
    setTrials(prev => [...prev, rec]);
    setPhase('finished');
  };

  const nextTrial = () => {
    startNewTrial();
    setPhase('setup');
  };

  const showResults = () => {
    setPhase('results');
  };

  const resetSession = () => {
    setTrials([]);
    startNewTrial();
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const buretteReading = addedMl; // mL added equals burette reading change
  const flaskP = pinkness(addedMl, equivMlRef.current);

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
            <span style={{ fontStyle: 'italic' }}>Titration</span> · Acid–Base
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
        {(phase === 'titrating' || phase === 'setup') && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>added : {addedMl.toFixed(2)} cm³</div>
            <div>pink  : {(flaskP * 100).toFixed(0)} %</div>
          </div>
        )}
        {phase !== 'intro' && (
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
              Find the concentration of an <span style={{ fontStyle: 'italic' }}>unknown HCl</span> sample by titrating it with {NAOH_CONC.toFixed(3)} mol/dm³ NaOH and phenolphthalein indicator.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Open the tap slowly. Watch the flask: it stays colourless until the equivalence point, then turns pink. Stop as soon as the pink colour persists. Each trial uses a fresh, unknown acid concentration.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {(phase === 'setup' || phase === 'titrating') && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-3"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Titrating · {addedMl.toFixed(2)} cm³ NaOH added
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onMouseDown={() => fastToggle(true)}
                onMouseUp={() => fastToggle(false)}
                onMouseLeave={() => fastToggle(false)}
                onTouchStart={() => fastToggle(true)}
                onTouchEnd={() => fastToggle(false)}
                className="py-3 text-[10px] uppercase active:scale-95 flex items-center justify-center gap-1"
                style={{ background: 'rgba(232,228,216,0.1)', color: '#e8e4d8',
                         border: '1px solid rgba(232,228,216,0.25)',
                         fontFamily: mono, letterSpacing: '0.18em' }}>
                Hold to Pour
              </button>
              <button onClick={fineAdd}
                      className="py-3 text-[10px] uppercase active:scale-95 flex items-center justify-center gap-1"
                      style={{ background: 'rgba(232,228,216,0.15)', color: '#e8e4d8',
                               border: '1px solid rgba(232,228,216,0.3)',
                               fontFamily: mono, letterSpacing: '0.18em' }}>
                +0.1 cm³
              </button>
              <button onClick={dropAdd}
                      className="py-3 text-[10px] uppercase active:scale-95 flex items-center justify-center gap-1"
                      style={{ background: 'rgba(232,228,216,0.2)', color: '#e8e4d8',
                               border: '1px solid rgba(232,228,216,0.4)',
                               fontFamily: mono, letterSpacing: '0.18em' }}>
                <Droplet size={11} /> drop
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={stopTitration}
                      disabled={addedMl < 0.01}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Square size={11} /> Endpoint
              </button>
              <button onClick={showResults} disabled={trials.length === 0}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                See Results
              </button>
            </div>
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
                    Result · final reading {last.addedMl.toFixed(2)} cm³
                  </div>
                  <div className="text-sm leading-snug opacity-90 mb-3" style={{ fontFamily: mono }}>
                    M(HCl) = ({NAOH_CONC} × {last.addedMl.toFixed(2)}) ÷ {ACID_VOL.toFixed(1)} ={' '}
                    <span style={{ fontWeight: 600 }}>{last.userAcidM.toFixed(3)} mol/dm³</span>
                  </div>
                  <div className="text-xs opacity-70 mb-3">
                    Actual acid concentration: <span style={{ fontWeight: 600 }}>{last.trueAcidM.toFixed(3)}</span>. Error: {last.errorPct.toFixed(1)} %
                  </div>
                  <div className={`text-xs mb-3 flex items-center gap-2 ${last.pass ? 'text-green-300' : 'text-pink-300'}`}>
                    {last.pass ? <Check size={14} /> : <X size={14} />}
                    {last.pass ? 'Within 3 % — accurate titration.' : 'Outside 3 % — stopped too early or too late.'}
                  </div>
                  <button onClick={nextTrial}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    Next Unknown <ChevronRight size={14} />
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
                     style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Session</div>
                <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                  Titration <span style={{ fontStyle: 'italic' }}>accuracy</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>

            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {trials.filter(t => t.pass).length} <span className="text-stone-400 text-lg">/ {trials.length} accurate</span>
            </div>

            <div className="space-y-1 text-xs mb-4" style={{ fontFamily: mono }}>
              <div className="opacity-50 grid grid-cols-4 gap-1"
                   style={{ letterSpacing: '0.1em' }}>
                <div>V (cm³)</div><div>your M</div><div>true M</div><div>err %</div>
              </div>
              {trials.map((t, i) => (
                <div key={i} className="grid grid-cols-4 gap-1">
                  <div>{t.addedMl.toFixed(2)}</div>
                  <div>{t.userAcidM.toFixed(3)}</div>
                  <div>{t.trueAcidM.toFixed(3)}</div>
                  <div style={{ fontWeight: 600,
                                 color: t.pass ? '#2e7d32' : '#c2185b' }}>
                    {t.errorPct.toFixed(1)}
                  </div>
                </div>
              ))}
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
