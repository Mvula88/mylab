'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Play,
} from 'lucide-react';

// ============================================================================
// PAPER CHROMATOGRAPHY LAB · v1
// NSSCO Chemistry Practical — Paper chromatography of coloured inks.
// Maps directly to NSSCO 2024 Paper 3 Q1: 7 inks on a pencil baseline, water
// as solvent. Student identifies a setup error (baseline below solvent),
// names the solvent front, and reads the chromatogram (which inks are single
// dyes, which contain most dyes, etc.).
// ============================================================================

// ─── Ink data: each ink's component dyes and their Rf values ───────────────
// Rf = distance travelled by dye / distance travelled by solvent (0..1).
// Colours are the rendered colours of each spot on the paper.
const INKS = [
  { id: 'red', name: 'red',
    dyes: [{ colour: '#d23a3a', rf: 0.20 }] },
  { id: 'orange', name: 'orange',
    dyes: [
      { colour: '#e76a2a', rf: 0.20 },
      { colour: '#f2c046', rf: 0.50 },
      { colour: '#ec8a35', rf: 0.70 },
    ] },
  { id: 'yellow', name: 'yellow',
    dyes: [
      { colour: '#f2c046', rf: 0.50 },
      { colour: '#d6b04e', rf: 0.70 },
    ] },
  { id: 'green', name: 'green',
    dyes: [
      { colour: '#3a8a5c', rf: 0.20 },
      { colour: '#2a6f96', rf: 0.50 },
      { colour: '#5fa84a', rf: 0.70 },
    ] },
  { id: 'blue', name: 'blue',
    dyes: [{ colour: '#2a4ea6', rf: 0.60 }] },
  { id: 'purple', name: 'purple',
    dyes: [
      { colour: '#7a3aa6', rf: 0.50 },
      { colour: '#a23a8f', rf: 0.70 },
    ] },
  { id: 'black', name: 'black',
    dyes: [
      { colour: '#1a1a1a', rf: 0.20 },
      { colour: '#3a4a6e', rf: 0.70 },
    ] },
];

// Analysis questions (lifted directly from NSSCO 2024 Paper 3 Q1)
const QUESTIONS = [
  {
    q: 'Name line A on the chromatogram (the upper line the solvent has reached).',
    options: ['Baseline', 'Solvent front', 'Rf line', 'Origin'],
    correct: 1,
  },
  {
    q: 'Why is the baseline drawn in pencil and not in pen?',
    options: [
      'Pencil is darker and easier to see',
      'Pen ink dissolves in the solvent and would interfere with the results',
      'Pencil dries faster',
      'Pen damages the paper',
    ],
    correct: 1,
  },
  {
    q: 'Which ink contains the greatest number of dyes (after the run)?',
    options: ['Red', 'Blue', 'Orange', 'Yellow'],
    correct: 2,
  },
  {
    q: 'Which TWO inks are made of a single dye? (pick the pair that is correct)',
    options: ['Red and orange', 'Red and blue', 'Yellow and green', 'Black and purple'],
    correct: 1,
  },
  {
    q: 'How could you find out if the blue ink really contains a single dye?',
    options: [
      'Use a longer piece of paper',
      'Wait longer for the experiment to run',
      'Repeat the experiment using a different solvent',
      'Use a bigger spot of ink',
    ],
    correct: 2,
  },
];

const ERROR_OPTIONS = [
  'The pencil baseline is below the solvent level',
  'There are too many ink spots on the paper',
  'The paper is too wide for the beaker',
  'There is not enough solvent in the beaker',
];

// ─── Paint the chromatography paper texture ────────────────────────────────
// progress: 0..1, how far the solvent front has risen up the paper.
// Each spot's dyes are painted up to their Rf-fraction of progress.
// Returns nothing; mutates the canvas in place.
function paintPaper(canvas, progress, fronted = true) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  // Paper background — slightly off-white
  ctx.fillStyle = '#f9f6ec';
  ctx.fillRect(0, 0, w, h);

  // Baseline: a horizontal pencil line at y = baselineY (near the bottom)
  const baselineY = h * 0.88;
  const topY = h * 0.05;
  const runHeight = baselineY - topY;  // how far solvent can rise

  // Wet area (solvent that has wicked up)
  if (progress > 0) {
    const solventY = baselineY - runHeight * progress;
    const grad = ctx.createLinearGradient(0, solventY, 0, baselineY);
    grad.addColorStop(0, 'rgba(180, 200, 220, 0.18)');
    grad.addColorStop(1, 'rgba(180, 200, 220, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, solventY, w, baselineY - solventY);
    // Solvent front line (faint)
    if (fronted && progress >= 0.98) {
      ctx.strokeStyle = 'rgba(80,100,140,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, topY + 6);
      ctx.lineTo(w, topY + 6);
      ctx.stroke();
    }
  }

  // Baseline (pencil)
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, baselineY);
  ctx.lineTo(w, baselineY);
  ctx.stroke();

  // Ink spots and the developed bands
  const slotWidth = w / INKS.length;
  INKS.forEach((ink, idx) => {
    const cx = slotWidth * (idx + 0.5);
    ink.dyes.forEach((dye) => {
      // The dye band travels up to dye.rf * progress * runHeight above baseline
      const travelled = Math.min(progress, dye.rf) * runHeight;
      const spotY = baselineY - travelled;
      // Paint a slightly diffuse spot
      const grad = ctx.createRadialGradient(cx, spotY, 0, cx, spotY, 14);
      grad.addColorStop(0, dye.colour);
      grad.addColorStop(0.6, dye.colour + 'aa');
      grad.addColorStop(1, dye.colour + '00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, spotY, 14, 0, Math.PI * 2);
      ctx.fill();
    });
    // Label below the baseline (ink name)
    ctx.fillStyle = '#3a3a3a';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ink.name, cx, baselineY + 14);
  });

  // Pencil label "baseline" (faint)
  ctx.fillStyle = 'rgba(80,80,80,0.45)';
  ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('baseline (pencil)', 6, baselineY - 4);
}

export default function ChromatographyLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: intro → setup-check → running → analysis → result
  const [phase, setPhase] = useState('intro');
  const [errorGuess, setErrorGuess] = useState(null);
  const [errorChecked, setErrorChecked] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const progressRef = useRef(0);
  const runningRef = useRef(false);

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
      audioRef.current = { initialized: true, master, click, chime, wrong };
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
    camera.position.set(0, 0.7, 1.6);
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

    scene.add(new THREE.AmbientLight(0xfff0d4, 0.6));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa3c9ff, 0.3);
    fillLight.position.set(-2, 2, -1);
    scene.add(fillLight);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });

    // Bench + tile
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

    // ─── Beaker (large, wider so we can see the paper inside) ──────────
    const beakerH = 0.6, beakerR = 0.22;
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR, beakerR, beakerH, 32, 1, true), glassMat
    );
    beaker.position.set(0, 0.025 + beakerH / 2, 0);
    beaker.renderOrder = 2;
    scene.add(beaker);
    const beakerFloor = new THREE.Mesh(
      new THREE.CircleGeometry(beakerR, 32), glassMat
    );
    beakerFloor.rotation.x = -Math.PI / 2;
    beakerFloor.position.set(0, 0.026, 0);
    scene.add(beakerFloor);

    // ─── Solvent at the bottom (water, level adjustable) ───────────────
    const solventH = 0.08;
    const solvent = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR * 0.96, beakerR * 0.96, solventH, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xb8d4ff, transparent: true, opacity: 0.6,
        roughness: 0.12, clearcoat: 0.5,
      })
    );
    solvent.position.set(0, 0.025 + solventH / 2 + 0.001, 0);
    solvent.renderOrder = 1;
    scene.add(solvent);
    const solventSurface = new THREE.Mesh(
      new THREE.CircleGeometry(beakerR * 0.96, 32),
      new THREE.MeshStandardMaterial({
        color: 0x88aaff, roughness: 0.2, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    solventSurface.rotation.x = -Math.PI / 2;
    solventSurface.position.set(0, 0.025 + solventH + 0.002, 0);
    scene.add(solventSurface);

    // ─── Chromatography paper ──────────────────────────────────────────
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 512; paperCanvas.height = 768;
    paintPaper(paperCanvas, 0);
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    paperTex.anisotropy = 4;
    const paperW = 0.34, paperH = 0.5;
    const paperGeo = new THREE.PlaneGeometry(paperW, paperH);
    const paperMat = new THREE.MeshStandardMaterial({
      map: paperTex, roughness: 0.9, side: THREE.DoubleSide,
    });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    // Position paper inside the beaker. Initially baseline is BELOW the
    // solvent level (the setup ERROR).
    paper.position.set(0, 0.18, 0.001);
    paper.castShadow = false;
    scene.add(paper);

    // Lid (a glass plate with a clip to suspend paper) — small decoration
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.012, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 0.85 })
    );
    lid.position.set(0, 0.025 + beakerH + 0.01, 0);
    lid.castShadow = true;
    scene.add(lid);

    sceneObjects.current = {
      scene, camera, renderer,
      beaker, solvent, solventSurface, paper, paperCanvas, paperTex,
      paperBasePosY: 0.18,
      solventH,
      time: 0,
      lastPaintProgress: -1,
    };

    // Camera drag (limited; this is a small fixed setup)
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
      azimuth -= dx * 0.005;
      azimuth = Math.max(-0.6, Math.min(0.6, azimuth));
      elevation = Math.max(-0.1, Math.min(0.4, elevation + dy * 0.003));
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

      // Advance progress while running
      if (runningRef.current) {
        progressRef.current = Math.min(1, progressRef.current + dt * 0.10);
        setProgress(progressRef.current);
        if (progressRef.current >= 1) {
          runningRef.current = false;
          setTimeout(() => setPhase('analysis'), 600);
        }
      }
      // Repaint paper if progress changed enough
      if (Math.abs(progressRef.current - so.lastPaintProgress) > 0.01) {
        paintPaper(so.paperCanvas, progressRef.current);
        so.paperTex.needsUpdate = true;
        so.lastPaintProgress = progressRef.current;
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

  // ─── Move paper up to the corrected position when the error is fixed ────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.paper) return;
    if (errorChecked && errorGuess === 0) {
      // Move paper up so baseline is above solvent (correct setup)
      so.paper.position.y = 0.27;
    }
  }, [errorChecked, errorGuess]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup-check');
  };

  const submitErrorGuess = () => {
    if (errorGuess === null) return;
    const correct = errorGuess === 0;
    if (correct) playChime(); else playWrong();
    setErrorChecked(true);
    // Show the result inline; advance after a beat
    setTimeout(() => {
      setPhase('running');
      runningRef.current = true;
      progressRef.current = 0;
    }, 1400);
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
    setErrorGuess(null);
    setErrorChecked(false);
    setQuestionIndex(0);
    setAnswers([]);
    progressRef.current = 0;
    setProgress(0);
    const so = sceneObjects.current;
    if (so.paper) {
      so.paper.position.y = 0.18;
      paintPaper(so.paperCanvas, 0);
      so.paperTex.needsUpdate = true;
      so.lastPaintProgress = -1;
    }
    setPhase('intro');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const score = answers.reduce((acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0), 0)
    + (errorGuess === 0 ? 1 : 0);
  const totalPossible = QUESTIONS.length + 1;

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
            <span style={{ fontStyle: 'italic' }}>Paper</span> Chromatography
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
        {phase === 'running' && (
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 bg-stone-100/80 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono }}>
            solvent front: {(progress * 100).toFixed(0)}%
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
              Separate the dyes in seven coloured inks by <span style={{ fontStyle: 'italic' }}>paper chromatography</span>, then interpret the chromatogram.
            </p>
            <p className="text-xs opacity-65 mb-4">
              First spot the setup error in the apparatus. Then run the experiment and answer the questions on Rf, solvent front and number of dyes.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'setup-check' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Spot the setup error
            </div>
            <p className="text-xs opacity-80 leading-snug mb-3">
              Look at the apparatus. One thing is wrong — find it before you run the experiment.
            </p>
            <div className="grid grid-cols-1 gap-1.5 mb-3">
              {ERROR_OPTIONS.map((opt, i) => (
                <button key={i} onClick={() => setErrorGuess(i)}
                        disabled={errorChecked}
                        className="py-2 px-3 text-[11px] text-left active:scale-[0.99] disabled:opacity-60"
                        style={{
                          background: errorGuess === i
                            ? (errorChecked
                                ? (i === 0 ? 'rgba(46,125,50,0.3)' : 'rgba(194,24,91,0.3)')
                                : 'rgba(232,228,216,0.22)')
                            : 'rgba(232,228,216,0.07)',
                          border: '1px solid rgba(232,228,216,0.18)',
                          fontFamily: mono,
                        }}>
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              ))}
            </div>
            {!errorChecked ? (
              <button onClick={submitErrorGuess}
                      disabled={errorGuess === null}
                      className="w-full py-3 text-[11px] uppercase active:scale-95 disabled:opacity-40"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                Submit
              </button>
            ) : (
              <div className="text-xs opacity-85" style={{ fontFamily: mono }}>
                {errorGuess === 0
                  ? '✓ Correct. The baseline must be ABOVE the solvent — otherwise the ink would dissolve into the solvent. Fixing the setup…'
                  : '✗ Not quite. The baseline must be ABOVE the solvent. We\'ll correct it and continue…'}
              </div>
            )}
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Experiment in progress
            </div>
            <p className="text-xs opacity-80 leading-snug mb-3">
              Water is rising up the paper by capillary action. As it passes each ink spot it carries the dyes upward — different dyes travel at different rates and so separate out.
            </p>
            <div className="h-1 bg-white/10 rounded-sm overflow-hidden mb-2">
              <div className="h-full transition-all"
                   style={{ width: `${progress * 100}%`,
                            backgroundColor: '#ec407a' }} />
            </div>
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
                  Chromatography <span style={{ fontStyle: 'italic' }}>analysis</span>
                </div>
              </div>
              <div className="p-2 rounded-full"
                   style={{ backgroundColor: score === totalPossible ? '#2e7d32' : '#c2185b', color: 'white' }}>
                <Trophy size={18} />
              </div>
            </div>
            <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
              {score} <span className="text-stone-400 text-lg">/ {totalPossible}</span>
            </div>
            <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: mono }}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-stone-700 flex-1">Setup error</span>
                <span style={{ color: errorGuess === 0 ? '#2e7d32' : '#c2185b', fontWeight: 500 }}>
                  {errorGuess === 0 ? '✓' : `✗ ${ERROR_OPTIONS[0]}`}
                </span>
              </div>
              {QUESTIONS.map((q, i) => {
                const correct = answers[i] === q.correct;
                return (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className="text-stone-700 flex-1 truncate">{q.q}</span>
                    <span style={{ color: correct ? '#2e7d32' : '#c2185b', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {correct ? '✓' : `✗ ${String.fromCharCode(65 + q.correct)}`}
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
