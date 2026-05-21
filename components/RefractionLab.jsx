'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Volume2, VolumeX,
} from 'lucide-react';

// ============================================================================
// REFRACTION LAB · v1
// NSSCO Physics Practical — Snell's Law. Pass a light ray through a glass
// block at different angles of incidence and measure the angle of refraction.
// Plot sin(i) vs sin(r) — slope is the refractive index n.
// ============================================================================

const N_GLASS = 1.52;
const ANGLE_OPTIONS = [10, 20, 30, 40, 50, 60, 70]; // degrees

// Snell: n1 sin(i) = n2 sin(r), n1 = 1 (air)
const refractAngle = (incidenceDeg) => {
  const i = incidenceDeg * Math.PI / 180;
  const r = Math.asin(Math.sin(i) / N_GLASS);
  return r * 180 / Math.PI;
};

// ─── Helper: build a thin "beam" mesh from point A to point B ───────────
function makeBeam(from, to, color, radius = 0.003) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const geo = new THREE.CylinderGeometry(radius, radius, length, 10);
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.92,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.addVectors(from, to).multiplyScalar(0.5);
  const up = new THREE.Vector3(0, 1, 0);
  const dir = direction.clone().normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
  mesh.quaternion.copy(quat);
  return mesh;
}

export default function RefractionLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  const [phase, setPhase] = useState('intro');
  const [incidenceDeg, setIncidenceDeg] = useState(40);
  const [trials, setTrials] = useState([]);
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const refractionDeg = refractAngle(incidenceDeg);

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
      const chime = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.5, sustain: 0.08, release: 1.6 },
      }).connect(master);
      chime.volume.value = -8;
      audioRef.current = { initialized: true, master, click, chime };
    } catch (e) {
      console.warn('Audio init failed', e);
    }
  };

  const playClick = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.click.triggerAttackRelease(`${230 + Math.random() * 60}`, '64n');
  };
  const playChime = () => {
    if (muted || !audioRef.current.initialized) return;
    audioRef.current.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
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
    scene.background = new THREE.Color(0x171a22); // darker so the beam pops
    scene.fog = new THREE.Fog(0x171a22, 4, 14);

    const W = mount.clientWidth, H = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    // Near-overhead camera (mostly looking down at the bench)
    camera.position.set(0, 1.6, 1.2);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ─── Lighting ─────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 0.7);
    keyLight.position.set(2, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // ─── Paper sheet on the bench ────────────────────────────────────────
    const paper = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.005, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xf5f1e8, roughness: 0.8 })
    );
    paper.position.y = 0.0025;
    paper.receiveShadow = true;
    scene.add(paper);

    // Draw grid markings on the paper using a CanvasTexture overlay
    const paperCanvas = document.createElement('canvas');
    paperCanvas.width = 1024; paperCanvas.height = 768;
    const pctx = paperCanvas.getContext('2d');
    pctx.fillStyle = '#f5f1e8';
    pctx.fillRect(0, 0, paperCanvas.width, paperCanvas.height);
    // Light grid
    pctx.strokeStyle = '#c4b8a0';
    pctx.lineWidth = 1;
    for (let i = 0; i <= paperCanvas.width; i += 32) {
      pctx.beginPath(); pctx.moveTo(i, 0); pctx.lineTo(i, paperCanvas.height); pctx.stroke();
    }
    for (let i = 0; i <= paperCanvas.height; i += 32) {
      pctx.beginPath(); pctx.moveTo(0, i); pctx.lineTo(paperCanvas.width, i); pctx.stroke();
    }
    // Central normal axis (vertical dashed line through entry point)
    pctx.strokeStyle = 'rgba(60,30,30,0.55)';
    pctx.lineWidth = 1.5;
    pctx.setLineDash([6, 4]);
    pctx.beginPath();
    pctx.moveTo(paperCanvas.width / 2, 0);
    pctx.lineTo(paperCanvas.width / 2, paperCanvas.height);
    pctx.stroke();
    pctx.setLineDash([]);
    // Protractor arc around entry point (centered on left edge of block)
    const centerX = paperCanvas.width / 2;
    const centerY = paperCanvas.height / 2;
    pctx.strokeStyle = 'rgba(180,30,60,0.4)';
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
    pctx.stroke();
    // Degree ticks every 10°
    pctx.fillStyle = '#3a2a1a';
    pctx.font = '12px "IBM Plex Mono", monospace';
    for (let a = 0; a < 360; a += 10) {
      const rad = a * Math.PI / 180;
      const x1 = centerX + Math.cos(rad) * 170;
      const y1 = centerY + Math.sin(rad) * 170;
      const x2 = centerX + Math.cos(rad) * 180;
      const y2 = centerY + Math.sin(rad) * 180;
      pctx.beginPath();
      pctx.moveTo(x1, y1); pctx.lineTo(x2, y2);
      pctx.stroke();
    }
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    paperTex.anisotropy = 4;
    paper.material.map = paperTex;
    paper.material.needsUpdate = true;

    // ─── Glass block ─────────────────────────────────────────────────────
    // Block dimensions: 0.4 wide × 0.04 tall × 0.18 deep
    const blockW = 0.4, blockH = 0.04, blockD = 0.18;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(blockW, blockH, blockD),
      new THREE.MeshPhysicalMaterial({
        color: 0xc8e0ff, metalness: 0, roughness: 0.05,
        transparent: true, opacity: 0.35,
        clearcoat: 1.0, clearcoatRoughness: 0.04,
        transmission: 0.8, thickness: 0.04, ior: N_GLASS,
      })
    );
    block.position.y = 0.005 + blockH / 2;
    block.castShadow = true;
    scene.add(block);

    // Entry & exit anchor points (front and back faces along Z)
    const ENTRY = new THREE.Vector3(0, 0.005 + blockH / 2, blockD / 2);
    const EXIT  = new THREE.Vector3(0, 0.005 + blockH / 2, -blockD / 2);

    // ─── Ray box (small grey unit on the +Z side, behind the camera-ish) ─
    const rayBoxGroup = new THREE.Group();
    const rayBoxBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.05, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x2a2c2e, roughness: 0.6, metalness: 0.35 })
    );
    rayBoxBody.castShadow = true;
    rayBoxGroup.add(rayBoxBody);
    // Glowing slot on the side that faces the block
    const slot = new THREE.Mesh(
      new THREE.PlaneGeometry(0.02, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xffeeb0 })
    );
    slot.position.set(0, 0, -0.036);
    rayBoxGroup.add(slot);
    scene.add(rayBoxGroup);

    // ─── Light beams (3 segments: incident, refracted-inside, exit) ──────
    // We attach them to a group and rebuild on angle change.
    const beamsGroup = new THREE.Group();
    scene.add(beamsGroup);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      paper, block, rayBoxGroup, beamsGroup,
      ENTRY, EXIT, blockD,
      time: 0,
    };

    // ─── Camera drag controls (more vertical bias since we want top-down) ─
    let isDragging = false, prevX = 0, prevY = 0;
    const lookAtY = 0.05;
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
      elevation = Math.max(0.2, Math.min(1.3, elevation + dy * 0.005));
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

      // Slight beam pulse
      so.beamsGroup.children.forEach((m, i) => {
        if (m.material) {
          m.material.opacity = 0.85 + Math.sin(so.time * 4 + i) * 0.08;
        }
      });

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

  // ─── Rebuild the beam segments + reposition the ray box on angle change ──
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.beamsGroup) return;
    // Clear old beams
    while (so.beamsGroup.children.length) {
      const m = so.beamsGroup.children.pop();
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    }
    // Geometry: normal points in +Z (paper's +Z direction), block's entry
    // face is at z = +blockD/2. The incident beam comes from +Z side at
    // angle i from the normal. After refraction it travels through the
    // block at angle r from the normal toward -Z. It exits at z = -blockD/2,
    // bending back to angle i.
    const iRad = incidenceDeg * Math.PI / 180;
    const rRad = refractAngle(incidenceDeg) * Math.PI / 180;
    const ENTRY = so.ENTRY.clone();
    const EXIT = so.EXIT.clone();
    // Incoming beam: from a point in +Z, +x (right side), to ENTRY
    const incidentLen = 0.45;
    // Direction vector of the incoming beam: it travels in -Z direction at
    // angle i (right-of-normal = +x for incidenceDeg > 0).
    const incidentStart = new THREE.Vector3(
      ENTRY.x + Math.sin(iRad) * incidentLen,
      ENTRY.y,
      ENTRY.z + Math.cos(iRad) * incidentLen,
    );
    const beamIn = makeBeam(incidentStart, ENTRY, 0xffd25a);
    so.beamsGroup.add(beamIn);

    // Through-block beam: from ENTRY to EXIT, traveling at angle r
    // Compute EXIT x by walking from ENTRY by Δz = -blockD at angle r
    const dx = Math.sin(rRad) * so.blockD; // shift in +x as it crosses
    const exitInside = new THREE.Vector3(
      ENTRY.x - dx, ENTRY.y, ENTRY.z - so.blockD,
    );
    const beamMid = makeBeam(ENTRY, exitInside, 0xffd25a);
    so.beamsGroup.add(beamMid);

    // Exit beam: from exitInside, traveling at angle i again into -z side
    const exitLen = 0.35;
    const exitEnd = new THREE.Vector3(
      exitInside.x - Math.sin(iRad) * exitLen,
      exitInside.y,
      exitInside.z - Math.cos(iRad) * exitLen,
    );
    const beamOut = makeBeam(exitInside, exitEnd, 0xffd25a);
    so.beamsGroup.add(beamOut);

    // Position the ray box at the start of the incident beam
    if (so.rayBoxGroup) {
      so.rayBoxGroup.position.copy(incidentStart);
      // Orient so the slot faces the entry point
      const dir = new THREE.Vector3().subVectors(ENTRY, incidentStart).normalize();
      so.rayBoxGroup.lookAt(ENTRY);
      // Lift slightly above paper
      so.rayBoxGroup.position.y = 0.025;
    }
  }, [incidenceDeg]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    setPhase('setup');
  };

  const recordTrial = () => {
    playClick();
    const r = refractAngle(incidenceDeg);
    const sini = Math.sin(incidenceDeg * Math.PI / 180);
    const sinr = Math.sin(r * Math.PI / 180);
    const rec = {
      i: incidenceDeg,
      r,
      sini, sinr,
      n: sini / sinr,
    };
    setTrials(prev => [...prev, rec]);
    playChime();
  };

  const showResults = () => {
    setPhase('results');
  };

  const resetSession = () => {
    setTrials([]);
    setPhase('setup');
  };

  // Fit n from sin(i) vs sin(r) trials
  const fitN = () => {
    if (trials.length < 2) return null;
    // Pass through origin: slope = Σ(x_i * y_i) / Σ(y_i²)
    let num = 0, den = 0;
    for (const t of trials) {
      num += t.sini * t.sinr;
      den += t.sinr * t.sinr;
    }
    if (den === 0) return null;
    return num / den;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const renderGraph = () => {
    if (trials.length < 2) return null;
    const pts = trials.map(t => ({ x: t.sinr, y: t.sini }));
    const xMax = Math.max(...pts.map(p => p.x), 0.1);
    const yMax = Math.max(...pts.map(p => p.y), 0.1);
    const W = 240, H = 100, pad = 10;
    const toX = (x) => pad + (x / xMax) * (W - 2 * pad);
    const toY = (y) => H - pad - (y / yMax) * (H - 2 * pad);
    return (
      <svg width={W} height={H} className="block">
        <rect x="0" y="0" width={W} height={H} fill="rgba(232,228,216,0.05)" />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="rgba(232,228,216,0.4)" />
        {pts.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="3" fill="#ec407a" />
        ))}
        <text x={W - pad} y={H - 2} fontSize="9" fill="rgba(232,228,216,0.5)"
              textAnchor="end" style={{ fontFamily: mono }}>sin r</text>
        <text x={pad + 2} y={pad + 7} fontSize="9" fill="rgba(232,228,216,0.5)"
              style={{ fontFamily: mono }}>sin i</text>
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
            NSSCO · Physics Practical
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Refraction</span> · Snell's Law
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
          <div className="absolute top-2 left-3 text-[11px] text-stone-100 bg-stone-900/70 px-2 py-1 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.06em' }}>
            <div>angle i  : {incidenceDeg}°</div>
            <div>angle r  : {refractionDeg.toFixed(1)}°</div>
            <div>sin i    : {Math.sin(incidenceDeg * Math.PI / 180).toFixed(3)}</div>
            <div>sin r    : {Math.sin(refractionDeg * Math.PI / 180).toFixed(3)}</div>
          </div>
        )}
        {phase !== 'intro' && trials.length > 0 && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-100 bg-stone-900/70 px-2 py-1 pointer-events-none"
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
              Investigate how light bends as it crosses from air into <span style={{ fontStyle: 'italic' }}>glass</span>, and determine the refractive index.
            </p>
            <p className="text-xs opacity-65 mb-4">
              Vary the angle of incidence and read off the angle of refraction. Plot sin i against sin r — the slope is n.
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
              Aim the ray box · {trials.length} measurements recorded
            </div>
            <div className="mb-3">
              <div className="text-[10px] opacity-65 uppercase mb-1"
                   style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                Angle of incidence · {incidenceDeg}°
              </div>
              <div className="grid grid-cols-7 gap-1">
                {ANGLE_OPTIONS.map(a => (
                  <button key={a} onClick={() => setIncidenceDeg(a)}
                          className="py-2 text-xs active:scale-95"
                          style={{
                            background: a === incidenceDeg
                              ? 'rgba(232,228,216,0.22)'
                              : 'rgba(232,228,216,0.07)',
                            border: '1px solid rgba(232,228,216,0.18)',
                            fontFamily: mono,
                          }}>
                    {a}°
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={recordTrial}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                Record Trial
              </button>
              <button onClick={showResults} disabled={trials.length < 2}
                      className="py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.25em' }}>
                See Graph
              </button>
            </div>
            {trials.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto pr-1"
                   style={{ fontFamily: mono, fontSize: '10px' }}>
                <div className="opacity-50 mb-1 grid grid-cols-5 gap-1"
                     style={{ letterSpacing: '0.1em' }}>
                  <div>i (°)</div><div>r (°)</div><div>sin i</div><div>sin r</div><div>n</div>
                </div>
                {trials.map((t, i) => (
                  <div key={i} className="grid grid-cols-5 gap-1 py-0.5">
                    <div>{t.i}</div>
                    <div>{t.r.toFixed(1)}</div>
                    <div>{t.sini.toFixed(3)}</div>
                    <div>{t.sinr.toFixed(3)}</div>
                    <div style={{ fontWeight: 600 }}>{t.n.toFixed(3)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {phase === 'results' && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center p-4"
             style={{ backgroundColor: 'rgba(26,31,46,0.65)' }}>
          <div className="w-full max-w-md rounded-sm p-6 relative"
               style={{ backgroundColor: '#f5f1e8', color: '#1a1f2e',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {(() => {
              const nEst = fitN();
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase text-stone-500"
                           style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Linear fit</div>
                      <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                        Refractive <span style={{ fontStyle: 'italic' }}>index</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full"
                         style={{ backgroundColor: '#c2185b', color: 'white' }}>
                      <Trophy size={18} />
                    </div>
                  </div>

                  <div className="bg-stone-900 text-stone-100 p-3 mb-4 rounded-sm">
                    {renderGraph()}
                    <div className="text-[9px] opacity-55 mt-1"
                         style={{ fontFamily: mono, letterSpacing: '0.15em' }}>
                      sin i vs sin r — slope = n
                    </div>
                  </div>

                  {nEst ? (
                    <div className="bg-stone-100 p-3 mb-4 text-sm" style={{ fontFamily: mono }}>
                      <div className="opacity-55 text-[10px] uppercase mb-1"
                           style={{ letterSpacing: '0.2em' }}>
                        Your estimate
                      </div>
                      <div className="text-2xl" style={{ fontWeight: 600 }}>
                        n ≈ {nEst.toFixed(3)}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        Glass (this block): {N_GLASS} · error {Math.abs(nEst - N_GLASS).toFixed(3)}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-100 p-3 mb-4 text-xs text-stone-600">
                      Need at least 2 trials to fit n.
                    </div>
                  )}

                  <button onClick={resetSession}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#1a1f2e', color: '#e8e4d8',
                                   fontFamily: mono, letterSpacing: '0.25em' }}>
                    <RotateCcw size={13} /> New Session
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
