'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// MONTE CARLO π LAB · v1
// Maths Exploration — Estimate π by randomly sampling points in a unit square.
// The fraction of points falling inside the inscribed quarter-circle ≈ π/4.
// ============================================================================

const BATCH_OPTIONS = [
  { label: '100', n: 100,    perFrame: 10  },
  { label: '1 000',  n: 1000,   perFrame: 25  },
  { label: '10 000', n: 10000,  perFrame: 200 },
  { label: '50 000', n: 50000,  perFrame: 800 },
];

export default function MonteCarloPiLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  const [phase, setPhase] = useState('intro');
  const [batch, setBatch] = useState(BATCH_OPTIONS[1]);
  const [total, setTotal] = useState(0);
  const [inside, setInside] = useState(0);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // For the running loop
  const runRef = useRef({
    running: false, queued: 0, perFrame: 25, batchTotal: 0, batchInside: 0,
  });

  const piEst = total > 0 ? 4 * inside / total : 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.7).toDestination();
      const click = new Tone.MetalSynth({
        frequency: 250, envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;
      // Soft "tic" stream while running
      const tic = new Tone.MembraneSynth({
        pitchDecay: 0.02, octaves: 3,
        envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.02 },
      }).connect(master);
      tic.volume.value = -28;
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      audioRef.current = { initialized: true, master, click, tic, chime };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playTic = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.tic.triggerAttackRelease('E5', '64n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  useEffect(() => {
    if (!audioRef.current.initialized) return;
    audioRef.current.master.gain.rampTo(muted ? 0 : 0.7, 0.15);
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
  // THREE.JS SCENE — a square "dart board" facing the camera
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!readyToInit || !mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e4d8);
    scene.fog = new THREE.Fog(0xe8e4d8, 6, 18);

    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 1.6);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0d4, 0.65));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 0.9);
    keyLight.position.set(2, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0xfff, 0.4);
    rim.position.set(-2, 1, 1.5);
    scene.add(rim);

    // Floor (subtle)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 6),
      new THREE.MeshStandardMaterial({ color: 0xd8d3c2, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Board — a square panel with a canvas texture
    const boardSize = 0.9;
    const boardCanvas = document.createElement('canvas');
    boardCanvas.width = 1024; boardCanvas.height = 1024;
    const ctx = boardCanvas.getContext('2d');
    // Paint background + quarter-circle
    const paintBoard = () => {
      ctx.fillStyle = '#f5f1e8';
      ctx.fillRect(0, 0, 1024, 1024);
      // Quarter circle (centered at bottom-left corner for clarity)
      ctx.fillStyle = 'rgba(40, 102, 196, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, 1024);
      ctx.arc(0, 1024, 1024, -Math.PI / 2, 0);
      ctx.lineTo(0, 1024);
      ctx.fill();
      // Outline
      ctx.strokeStyle = '#1a3a72';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 1024, 1024, -Math.PI / 2, 0);
      ctx.stroke();
      // Square outline
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 1024, 1024);
      // Axis labels
      ctx.fillStyle = '#3a3a3a';
      ctx.font = '24px "IBM Plex Mono", monospace';
      ctx.fillText('0', 6, 1024 - 6);
      ctx.fillText('1', 1024 - 28, 1024 - 6);
      ctx.fillText('1', 6, 28);
    };
    paintBoard();

    const boardTex = new THREE.CanvasTexture(boardCanvas);
    boardTex.anisotropy = 4;
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(boardSize, boardSize),
      new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.7 })
    );
    board.position.set(0, 0.5, 0);
    board.castShadow = false;
    board.receiveShadow = true;
    scene.add(board);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      board, boardCanvas, boardCtx: ctx, boardTex,
      paintBoard,
      time: 0,
    };

    // ─── Camera drag controls (limited rotation since this is mostly 2D) ──
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAt = new THREE.Vector3(0, 0.5, 0);
    let azimuth = Math.atan2(camera.position.x, camera.position.z);
    let elevation = Math.atan2(camera.position.y - lookAt.y,
                               Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2));
    const radius = Math.sqrt(camera.position.x ** 2 +
                             (camera.position.y - lookAt.y) ** 2 +
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
      azimuth = Math.max(-0.4, Math.min(0.4, azimuth));
      elevation = Math.max(-0.2, Math.min(0.3, elevation + dy * 0.003));
      const r = radius * Math.cos(elevation);
      camera.position.x = Math.sin(azimuth) * r;
      camera.position.z = Math.cos(azimuth) * r;
      camera.position.y = lookAt.y + radius * Math.sin(elevation);
      camera.lookAt(lookAt);
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
    let ticAccum = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      const run = runRef.current;
      if (run.running && run.queued > 0) {
        const n = Math.min(run.queued, run.perFrame);
        let batchInside = 0;
        for (let i = 0; i < n; i++) {
          // Random point in [0,1] x [0,1]
          const x = Math.random();
          const y = Math.random();
          const inCircle = (x * x + y * y) <= 1;
          if (inCircle) batchInside++;
          // Draw the dot on the canvas
          const px = x * 1024;
          const py = (1 - y) * 1024; // flip y so origin is bottom-left
          ctx.fillStyle = inCircle ? '#ec407a' : '#3a3a3a';
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        so.boardTex.needsUpdate = true;
        run.queued -= n;
        run.batchTotal += n;
        run.batchInside += batchInside;
        setTotal(t => t + n);
        setInside(v => v + batchInside);

        // Soft tic at most ~12 times/sec
        ticAccum += dt;
        if (ticAccum > 0.08) {
          ticAccum = 0;
          playTic();
        }

        if (run.queued <= 0) {
          run.running = false;
          setTimeout(() => {
            playChime();
            setPhase('finished');
          }, 100);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const dropBatch = () => {
    playClick();
    runRef.current = {
      running: true, queued: batch.n, perFrame: batch.perFrame,
      batchTotal: 0, batchInside: 0,
    };
    setPhase('running');
  };

  const stopEarly = () => {
    runRef.current.running = false;
    runRef.current.queued = 0;
    setPhase('finished');
  };

  const continueDropping = () => {
    setPhase('setup');
  };

  const reset = () => {
    setTotal(0);
    setInside(0);
    // Repaint board
    const so = sceneObjects.current;
    if (so.paintBoard) {
      so.paintBoard();
      so.boardTex.needsUpdate = true;
    }
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';
  const err = total > 0 ? Math.abs(piEst - Math.PI) : 0;

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
            Maths · Stochastic Methods
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Monte Carlo</span> · Estimating π
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
          <div className="absolute top-2 left-3 text-[11px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>points  : {total.toLocaleString()}</div>
            <div>inside  : {inside.toLocaleString()}</div>
            <div>π ≈ 4·n/N : <span style={{ fontWeight: 600 }}>{piEst.toFixed(5)}</span></div>
            <div>|π − π̂| : {err.toFixed(5)}</div>
          </div>
        )}
        {phase !== 'intro' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-stone-500 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
            drag to nudge view
          </div>
        )}
      </div>

      <div className="relative z-10"
           style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                    boxShadow: '0 -10px 30px -10px rgba(26,31,46,0.4)' }}>

        {phase === 'intro' && (
          <div className="px-5 pt-5 pb-6">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Idea</div>
            <p className="text-base leading-snug mb-3">
              Pick random points uniformly in a unit square. Count the fraction that fall inside the <span style={{ fontStyle: 'italic' }}>quarter circle</span> of radius 1. That fraction tends to π/4.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Drop more and more points. The estimate of π should converge — error shrinks like 1/√N.
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
            <div className="text-[10px] uppercase opacity-55 mb-3"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Drop random points · {total.toLocaleString()} placed so far
            </div>
            <div className="mb-3">
              <div className="text-[10px] opacity-65 uppercase mb-1"
                   style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                Batch size · {batch.label}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {BATCH_OPTIONS.map(b => (
                  <button key={b.label} onClick={() => setBatch(b)}
                          className="py-2 text-xs active:scale-95"
                          style={{
                            background: b.label === batch.label
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={dropBatch}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Drop Batch
              </button>
              <button onClick={reset}
                      disabled={total === 0}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                <RotateCcw size={12} /> Clear Board
              </button>
            </div>
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Sampling · {total.toLocaleString()} points
            </div>
            <div className="text-3xl mb-3" style={{ fontWeight: 600, fontFamily: mono }}>
              π ≈ {piEst.toFixed(5)}
            </div>
            <button onClick={stopEarly}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(232,228,216,0.1)', color: '#e8e4d8',
                             border: '1px solid rgba(232,228,216,0.25)',
                             fontFamily: mono, letterSpacing: '0.25em' }}>
              <Square size={11} /> Stop
            </button>
          </div>
        )}

        {phase === 'finished' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Estimate · {total.toLocaleString()} samples
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              π ≈ {piEst.toFixed(5)}
            </div>
            <div className="text-xs opacity-70 mb-3" style={{ fontFamily: mono }}>
              |error| = {err.toFixed(5)} &nbsp;·&nbsp; true π = 3.14159
            </div>
            <button onClick={continueDropping}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Drop Another Batch <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
