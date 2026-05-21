'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX, Play, Square,
} from 'lucide-react';

// ============================================================================
// GALTON BOARD LAB · v1
// Maths Exploration — Watch beads bounce randomly through rows of pegs into
// bins below. The bin counts trace out the binomial distribution, which
// approaches a Normal as the number of rows grows.
// ============================================================================

const ROW_OPTIONS = [8, 12, 16];
const BATCH_OPTIONS = [50, 200, 1000];
const PEG_SPACING_X = 0.07;
const PEG_SPACING_Y = 0.07;
const BEAD_FALL_SPEED = 0.55; // units / sec
const MAX_ACTIVE_BEADS = 30;

// Returns world position of a peg at (row, col). col can be fractional for
// the bead's interpolated x; bins are after row=rows.
function pegPos(row, col, rows) {
  const x = (col - row / 2) * PEG_SPACING_X;
  const y = 0.95 - row * PEG_SPACING_Y;
  return new THREE.Vector3(x, y, 0);
}

export default function GaltonBoardLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  const [phase, setPhase] = useState('intro');
  const [rows, setRows] = useState(12);
  const [batch, setBatch] = useState(200);
  const [counts, setCounts] = useState(() => new Array(13).fill(0));
  const [released, setReleased] = useState(0);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  // Animation-loop state
  const runRef = useRef({
    running: false,
    queued: 0,
    rows: 12,
    spawnAccum: 0,
    activeBeads: [], // each: {row, colF, colI, nextColI, mesh}
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.75).toDestination();
      const click = new Tone.MetalSynth({
        frequency: 250, envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;
      const pegHit = new Tone.MembraneSynth({
        pitchDecay: 0.02, octaves: 5,
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.03 },
      }).connect(master);
      pegHit.volume.value = -22;
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      audioRef.current = { initialized: true, master, click, pegHit, chime };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };
  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playPeg = () => {
    if (muted || !audioRef.current.initialized) return;
    const note = `C${4 + Math.floor(Math.random() * 2)}`;
    audioRef.current.pegHit.triggerAttackRelease(note, '64n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  };
  useEffect(() => {
    if (!audioRef.current.initialized) return;
    audioRef.current.master.gain.rampTo(muted ? 0 : 0.75, 0.15);
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
    camera.position.set(0, 0.55, 1.7);
    camera.lookAt(0, 0.4, 0);

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
    const rim = new THREE.DirectionalLight(0xffffff, 0.4);
    rim.position.set(-2, 1, 1.5);
    scene.add(rim);

    // ─── Backing board behind pegs (so they're easier to see) ────────────
    const boardWidth = (Math.max(...ROW_OPTIONS) + 2) * PEG_SPACING_X;
    const boardHeight = (Math.max(...ROW_OPTIONS) + 4) * PEG_SPACING_Y;
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(boardWidth, boardHeight),
      new THREE.MeshStandardMaterial({ color: 0x2c3140, roughness: 0.9 })
    );
    board.position.set(0, 0.55, -0.025);
    board.receiveShadow = true;
    scene.add(board);

    // Pegs group (rebuilt when row count changes)
    const pegsGroup = new THREE.Group();
    scene.add(pegsGroup);

    // Bin counters: small rectangular bars per bin, growing in height with count
    const binBarsGroup = new THREE.Group();
    scene.add(binBarsGroup);

    // Bin walls (dividers between bins, decorative)
    const binWallsGroup = new THREE.Group();
    scene.add(binWallsGroup);

    // Live beads layer
    const beadsGroup = new THREE.Group();
    scene.add(beadsGroup);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      pegsGroup, binBarsGroup, binWallsGroup, beadsGroup,
      time: 0,
      lastRebuiltForRows: -1,
    };

    // ─── Camera drag controls ─────────────────────────────────────────────
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAt = new THREE.Vector3(0, 0.4, 0);
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
      azimuth = Math.max(-0.5, Math.min(0.5, azimuth));
      elevation = Math.max(-0.2, Math.min(0.4, elevation + dy * 0.003));
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
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      const run = runRef.current;
      const ROWS = run.rows;

      // Spawn new beads if there's still queue
      if (run.running) {
        run.spawnAccum += dt * 30; // up to 30 beads/sec spawn rate
        while (run.activeBeads.length < MAX_ACTIVE_BEADS
               && run.queued > 0
               && run.spawnAccum >= 1) {
          run.spawnAccum -= 1;
          // Precompute the bead's path: a sequence of R (1) or L (0) decisions
          const decisions = [];
          let col = 0;
          for (let r = 0; r < ROWS; r++) {
            const right = Math.random() < 0.5;
            decisions.push(right ? 1 : 0);
            if (right) col++;
          }
          // Build the bead mesh
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.012, 12, 10),
            new THREE.MeshStandardMaterial({
              color: 0xec407a, roughness: 0.4, metalness: 0.2,
            })
          );
          const startPos = pegPos(0, 0, ROWS);
          startPos.y += 0.05;
          mesh.position.copy(startPos);
          mesh.castShadow = true;
          so.beadsGroup.add(mesh);
          run.activeBeads.push({
            mesh,
            row: 0,
            colI: 0,
            decisions,
            finalBin: col,
            // we tween between pegs by interpolating from-Pos → to-Pos
            t: 0,
          });
          run.queued -= 1;
          setReleased(prev => prev + 1);
        }
      }

      // Advance active beads
      for (let i = run.activeBeads.length - 1; i >= 0; i--) {
        const b = run.activeBeads[i];
        b.t += dt * BEAD_FALL_SPEED / PEG_SPACING_Y;
        // Compute from/to positions
        const fromCol = b.colI;
        let toCol;
        let toRow;
        if (b.row < ROWS) {
          // Going from peg(row, colI) to peg(row+1, colI + decisions[row])
          toRow = b.row + 1;
          toCol = b.colI + b.decisions[b.row];
        } else {
          // Past last row → falling into bin (no further interaction)
          toRow = ROWS + 1;
          toCol = b.finalBin;
        }
        const from = pegPos(b.row, fromCol, ROWS);
        const to = pegPos(toRow, toCol, ROWS);
        const t = Math.min(1, b.t);
        b.mesh.position.lerpVectors(from, to, t);
        // Slight bounce above interpolation curve
        if (t < 1) {
          b.mesh.position.y += Math.sin(t * Math.PI) * 0.005;
        }
        if (b.t >= 1) {
          b.row = toRow;
          b.colI = toCol;
          b.t = 0;
          if (b.row <= ROWS) playPeg();
          // If reached bottom (past row=ROWS)
          if (b.row > ROWS) {
            // Add to bin count
            setCounts(prev => {
              const next = [...prev];
              if (b.finalBin >= 0 && b.finalBin < next.length) {
                next[b.finalBin]++;
              }
              return next;
            });
            so.beadsGroup.remove(b.mesh);
            b.mesh.geometry.dispose();
            b.mesh.material.dispose();
            run.activeBeads.splice(i, 1);
          }
        }
      }

      // End run when queue is exhausted and no more active beads
      if (run.running && run.queued === 0 && run.activeBeads.length === 0) {
        run.running = false;
        setTimeout(() => {
          playChime();
          setPhase('finished');
        }, 100);
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

  // ─── Rebuild pegs + bin bars whenever rows changes ──────────────────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.pegsGroup) return;

    // Clear old pegs
    while (so.pegsGroup.children.length) {
      const m = so.pegsGroup.children.pop();
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    }
    while (so.binBarsGroup.children.length) {
      const m = so.binBarsGroup.children.pop();
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    }
    while (so.binWallsGroup.children.length) {
      const m = so.binWallsGroup.children.pop();
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    }

    const pegMat = new THREE.MeshStandardMaterial({
      color: 0xf5f1e8, roughness: 0.4, metalness: 0.1,
    });
    const pegGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.015, 12);
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= r; c++) {
        const peg = new THREE.Mesh(pegGeo, pegMat);
        const p = pegPos(r, c, rows);
        peg.position.set(p.x, p.y, 0);
        peg.rotation.x = Math.PI / 2;
        peg.castShadow = true;
        so.pegsGroup.add(peg);
      }
    }

    // Bin bars
    const binCount = rows + 1;
    const binMat = new THREE.MeshStandardMaterial({
      color: 0xec407a, roughness: 0.55, metalness: 0.05,
    });
    for (let b = 0; b < binCount; b++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(PEG_SPACING_X * 0.85, 0.01, 0.02), binMat
      );
      const p = pegPos(rows + 1, b, rows);
      bar.position.set(p.x, p.y + 0.005, 0);
      bar.castShadow = true;
      so.binBarsGroup.add(bar);
    }

    // Bin dividers (decorative)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x6b7480, roughness: 0.6, metalness: 0.1,
    });
    for (let b = 0; b <= binCount; b++) {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.003, 0.13, 0.01), wallMat
      );
      const p = pegPos(rows + 1, b - 0.5, rows);
      wall.position.set(p.x, p.y - 0.06, 0);
      so.binWallsGroup.add(wall);
    }

    // Reset counts to match new bin count
    setCounts(new Array(binCount).fill(0));
    setReleased(0);
    so.lastRebuiltForRows = rows;
  }, [rows, readyToInit]);

  // ─── Animate bin bars when counts change ────────────────────────────────
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.binBarsGroup) return;
    const maxCount = Math.max(1, ...counts);
    so.binBarsGroup.children.forEach((bar, i) => {
      const h = (counts[i] / maxCount) * 0.18; // up to 0.18 unit tall
      bar.scale.y = Math.max(0.05, h / 0.01);
      const p = pegPos(rows + 1, i, rows);
      bar.position.y = p.y + (h / 2);
    });
  }, [counts, rows]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const startBatch = () => {
    playClick();
    runRef.current = {
      running: true,
      queued: batch,
      rows,
      spawnAccum: 0,
      activeBeads: [],
    };
    setPhase('running');
  };

  const stopEarly = () => {
    const run = runRef.current;
    run.running = false;
    run.queued = 0;
    // Let active beads finish, but force-finalize when none remain
    if (run.activeBeads.length === 0) setPhase('finished');
  };

  const continueDrop = () => setPhase('setup');

  const reset = () => {
    setCounts(new Array(rows + 1).fill(0));
    setReleased(0);
    setPhase('setup');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  // Compute mean & sd of the empirical distribution
  const total = counts.reduce((a, b) => a + b, 0);
  let mean = 0, sd = 0;
  if (total > 0) {
    for (let i = 0; i < counts.length; i++) mean += i * counts[i];
    mean /= total;
    for (let i = 0; i < counts.length; i++) sd += counts[i] * (i - mean) ** 2;
    sd = Math.sqrt(sd / total);
  }
  const expectedMean = rows / 2;
  const expectedSd = Math.sqrt(rows * 0.25);

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
            Maths · Distributions
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Galton</span> · Bean Machine
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
            <div>released : {released} / {released + (runRef.current.queued || 0)}</div>
            <div>mean   : {mean.toFixed(2)} (exp {expectedMean.toFixed(1)})</div>
            <div>sd     : {sd.toFixed(2)} (exp {expectedSd.toFixed(2)})</div>
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
              A bead falls through rows of pegs, each time deflecting left or right with equal probability. The bin it lands in is determined by the number of right-deflections — a Bernoulli sum, which is <span style={{ fontStyle: 'italic' }}>Binomial(n, ½)</span>.
            </p>
            <p className="text-xs opacity-65 mb-4">
              For large n, the distribution approaches Normal with mean n/2 and standard deviation √(n/4).
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
              Drop beads · total {released}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[10px] opacity-65 uppercase mb-1"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  Rows · {rows}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {ROW_OPTIONS.map(r => (
                    <button key={r} onClick={() => setRows(r)}
                            className="py-2 text-xs active:scale-95"
                            style={{
                              background: r === rows
                                ? 'rgba(232,228,216,0.22)'
                                : 'rgba(232,228,216,0.07)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] opacity-65 uppercase mb-1"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  Batch · {batch}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {BATCH_OPTIONS.map(b => (
                    <button key={b} onClick={() => setBatch(b)}
                            className="py-2 text-xs active:scale-95"
                            style={{
                              background: b === batch
                                ? 'rgba(232,228,216,0.22)'
                                : 'rgba(232,228,216,0.07)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={startBatch}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                <Play size={12} /> Drop {batch}
              </button>
              <button onClick={reset}
                      disabled={released === 0}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                <RotateCcw size={12} /> Clear Bins
              </button>
            </div>
            {total > 0 && (
              <div className="mt-3 text-[10px] flex flex-wrap gap-1" style={{ fontFamily: mono }}>
                {counts.map((c, i) => (
                  <span key={i} className="px-1.5 py-0.5"
                        style={{ background: 'rgba(232,228,216,0.05)',
                                 border: '1px solid rgba(232,228,216,0.08)' }}>
                    {i}:{c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'running' && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Dropping · {rows} rows · target {batch}
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600, fontFamily: mono }}>
              {released}<span className="opacity-50 text-base"> beads</span>
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
              Batch complete · {rows} rows
            </div>
            <div className="text-sm leading-snug opacity-90 mb-3" style={{ fontFamily: mono }}>
              mean {mean.toFixed(2)} (expected {expectedMean.toFixed(1)}) ·
              sd {sd.toFixed(2)} (expected {expectedSd.toFixed(2)})
            </div>
            <button onClick={continueDrop}
                    className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Drop More <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
