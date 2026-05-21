'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';
import {
  ChevronRight, RotateCcw, Trophy, Check, X,
  Volume2, VolumeX, Flame, FlaskConical,
} from 'lucide-react';

// ============================================================================
// QUALITATIVE ANALYSIS LAB · v1
// NSSCO / NSSCAS Chemistry Practical — Identification of cations and anions.
// Observation wording mirrors NSSCO Annexe B "Notes for use in qualitative
// analysis" so the text the student reads here is the text that is marked
// correct in the actual exam (NSSCO 6117 Paper 3, NSSCAS 8224 Paper 3).
// ============================================================================

// ─── Cations and anions covered by NSSCO syllabus ──────────────────────────
const CATIONS = [
  { id: 'NH4',   label: 'NH₄⁺',  name: 'ammonium' },
  { id: 'Al',    label: 'Al³⁺',  name: 'aluminium' },
  { id: 'Ca',    label: 'Ca²⁺',  name: 'calcium' },
  { id: 'Cu',    label: 'Cu²⁺',  name: 'copper(II)' },
  { id: 'FeII',  label: 'Fe²⁺',  name: 'iron(II)' },
  { id: 'FeIII', label: 'Fe³⁺',  name: 'iron(III)' },
  { id: 'Zn',    label: 'Zn²⁺',  name: 'zinc' },
  { id: 'Li',    label: 'Li⁺',   name: 'lithium' },
  { id: 'Na',    label: 'Na⁺',   name: 'sodium' },
  { id: 'K',     label: 'K⁺',    name: 'potassium' },
  { id: 'Ba',    label: 'Ba²⁺',  name: 'barium' },
];

const ANIONS = [
  { id: 'Cl',  label: 'Cl⁻',    name: 'chloride' },
  { id: 'Br',  label: 'Br⁻',    name: 'bromide' },
  { id: 'I',   label: 'I⁻',     name: 'iodide' },
  { id: 'SO4', label: 'SO₄²⁻',  name: 'sulfate' },
  { id: 'CO3', label: 'CO₃²⁻',  name: 'carbonate' },
  { id: 'NO3', label: 'NO₃⁻',   name: 'nitrate' },
];

// ─── Unknown pool — combinations the student may be given ──────────────────
// Natural colour is the colour of the solution as it sits in the test tube
// (most are colourless / very pale). RGB hex.
const UNKNOWNS = [
  { cation: 'Cu',    anion: 'SO4',  color: 0x4f8fd9, displayName: 'copper(II) sulfate' },
  { cation: 'FeII',  anion: 'SO4',  color: 0xb6d7a3, displayName: 'iron(II) sulfate' },
  { cation: 'FeIII', anion: 'SO4',  color: 0xc09060, displayName: 'iron(III) sulfate' },
  { cation: 'Zn',    anion: 'NO3',  color: 0xeef3f5, displayName: 'zinc nitrate' },
  { cation: 'Al',    anion: 'Cl',   color: 0xeef3f5, displayName: 'aluminium chloride' },
  { cation: 'NH4',   anion: 'Cl',   color: 0xeef3f5, displayName: 'ammonium chloride' },
  { cation: 'Ca',    anion: 'NO3',  color: 0xeef3f5, displayName: 'calcium nitrate' },
  { cation: 'Ba',    anion: 'Cl',   color: 0xeef3f5, displayName: 'barium chloride' },
  { cation: 'Na',    anion: 'Br',   color: 0xeef3f5, displayName: 'sodium bromide' },
  { cation: 'K',     anion: 'I',    color: 0xeef3f5, displayName: 'potassium iodide' },
  { cation: 'Li',    anion: 'CO3',  color: 0xeef3f5, displayName: 'lithium carbonate' },
  { cation: 'Na',    anion: 'NO3',  color: 0xeef3f5, displayName: 'sodium nitrate' },
];

// ─── Test catalogue: what the student can do ───────────────────────────────
const TESTS = [
  {
    id: 'naoh-few',
    target: 'cation',
    label: 'Add a few drops of aqueous NaOH',
    short: 'NaOH (few drops)',
    reagent: 'NaOH',
  },
  {
    id: 'naoh-excess',
    target: 'cation',
    label: 'Add NaOH until in excess',
    short: 'NaOH (excess)',
    reagent: 'NaOH',
  },
  {
    id: 'naoh-warm',
    target: 'cation',
    label: 'Add NaOH, warm, test gas with damp red litmus paper',
    short: 'NaOH + warm (gas test)',
    reagent: 'NaOH',
    warm: true,
  },
  {
    id: 'ammonia-few',
    target: 'cation',
    label: 'Add a few drops of aqueous ammonia',
    short: 'NH₃(aq) (few drops)',
    reagent: 'NH3',
  },
  {
    id: 'ammonia-excess',
    target: 'cation',
    label: 'Add aqueous ammonia until in excess',
    short: 'NH₃(aq) (excess)',
    reagent: 'NH3',
  },
  {
    id: 'flame',
    target: 'cation',
    label: 'Flame test (nichrome wire)',
    short: 'Flame test',
    reagent: 'flame',
  },
  {
    id: 'agno3',
    target: 'anion',
    label: 'Acidify with dilute HNO₃, then add aqueous silver nitrate',
    short: 'AgNO₃ / HNO₃',
    reagent: 'AgNO3',
  },
  {
    id: 'banitate',
    target: 'anion',
    label: 'Acidify with dilute HNO₃, then add aqueous barium nitrate',
    short: 'Ba(NO₃)₂ / HNO₃',
    reagent: 'BaNO32',
  },
  {
    id: 'dilute-acid',
    target: 'anion',
    label: 'Add dilute HCl, test any gas with limewater',
    short: 'dilute HCl + limewater',
    reagent: 'HCl',
  },
  {
    id: 'naoh-al-warm',
    target: 'anion',
    label: 'Add NaOH + aluminium foil, warm, test gas with damp red litmus',
    short: 'NaOH + Al + warm',
    reagent: 'NaOH',
    warm: true,
  },
];

// ─── Observation engine ────────────────────────────────────────────────────
// Returns { text, effect } where effect describes the visual change in the tube
//   colour: hex, what colour to tint the liquid (precipitate colour)
//   cloudy: bool, render as cloudy / opaque (precipitate present)
//   dissolveAfter: bool, in excess the precipitate dissolves back to clear
//   dissolveTo: hex, what colour the solution ends as after dissolving
//   effervescence: bool, bubbles
//   gas: 'ammonia' | 'co2' | null, gas evolved at top
//   flameColor: hex (for flame tests)
//   noChange: bool
function observe(unknown, testId) {
  const { cation, anion } = unknown;

  // ─── NaOH tests ──────────────────────────────────────────────────────
  if (testId === 'naoh-few' || testId === 'naoh-excess') {
    const excess = testId === 'naoh-excess';
    switch (cation) {
      case 'NH4':
        return excess
          ? { text: 'No precipitate, even in excess.', noChange: true }
          : { text: 'No visible change.', noChange: true };
      case 'Al':
        return excess
          ? { text: 'White precipitate dissolves in excess giving a colourless solution.',
              colour: 0xffffff, cloudy: true, dissolveAfter: true, dissolveTo: 0xeef3f5 }
          : { text: 'White precipitate formed.', colour: 0xffffff, cloudy: true };
      case 'Ca':
        return { text: excess
          ? 'White precipitate, insoluble in excess.'
          : 'White precipitate formed.',
          colour: 0xffffff, cloudy: true };
      case 'Cu':
        return { text: excess
          ? 'Light blue precipitate, insoluble in excess.'
          : 'Light blue precipitate formed.',
          colour: 0x9ec5e5, cloudy: true };
      case 'FeII':
        return { text: excess
          ? 'Green precipitate, insoluble in excess.'
          : 'Green precipitate formed.',
          colour: 0x4f8a3e, cloudy: true };
      case 'FeIII':
        return { text: excess
          ? 'Red-brown precipitate, insoluble in excess.'
          : 'Red-brown precipitate formed.',
          colour: 0x8e4525, cloudy: true };
      case 'Zn':
        return excess
          ? { text: 'White precipitate dissolves in excess giving a colourless solution.',
              colour: 0xffffff, cloudy: true, dissolveAfter: true, dissolveTo: 0xeef3f5 }
          : { text: 'White precipitate formed.', colour: 0xffffff, cloudy: true };
      case 'Li': case 'Na': case 'K':
        return { text: 'No precipitate.', noChange: true };
      case 'Ba':
        return { text: 'No precipitate (a very faint white turbidity may appear from impurity).',
                 noChange: true };
      default:
        return { text: 'No visible change.', noChange: true };
    }
  }

  // ─── NaOH + warm (test for ammonium) ─────────────────────────────────
  if (testId === 'naoh-warm') {
    if (cation === 'NH4') {
      return {
        text: 'On warming, a gas is evolved which turns damp red litmus paper blue — ammonia. Cation is NH₄⁺.',
        gas: 'ammonia',
        litmusBlue: true,
      };
    }
    // For other cations this test still produces the NaOH precipitate but no
    // ammonia. Use the few-drops result but flag no gas.
    const base = observe(unknown, 'naoh-few');
    return { ...base, text: base.text + ' On warming, no gas is evolved with damp red litmus paper.' };
  }

  // ─── Aqueous ammonia tests ───────────────────────────────────────────
  if (testId === 'ammonia-few' || testId === 'ammonia-excess') {
    const excess = testId === 'ammonia-excess';
    switch (cation) {
      case 'NH4':
        return { text: 'No visible change.', noChange: true };
      case 'Al':
        return { text: excess
          ? 'White precipitate, insoluble in excess.'
          : 'White precipitate formed.',
          colour: 0xffffff, cloudy: true };
      case 'Ca':
        return { text: 'No precipitate, or a very slight white precipitate.', noChange: true };
      case 'Cu':
        return excess
          ? { text: 'Light blue precipitate dissolves in excess giving a deep blue solution.',
              colour: 0x6fa6d4, cloudy: true, dissolveAfter: true, dissolveTo: 0x1a4ea0 }
          : { text: 'Light blue precipitate formed.', colour: 0x9ec5e5, cloudy: true };
      case 'FeII':
        return { text: excess
          ? 'Green precipitate, insoluble in excess.'
          : 'Green precipitate formed.',
          colour: 0x4f8a3e, cloudy: true };
      case 'FeIII':
        return { text: excess
          ? 'Red-brown precipitate, insoluble in excess.'
          : 'Red-brown precipitate formed.',
          colour: 0x8e4525, cloudy: true };
      case 'Zn':
        return excess
          ? { text: 'White precipitate dissolves in excess giving a colourless solution.',
              colour: 0xffffff, cloudy: true, dissolveAfter: true, dissolveTo: 0xeef3f5 }
          : { text: 'White precipitate formed.', colour: 0xffffff, cloudy: true };
      case 'Li': case 'Na': case 'K': case 'Ba':
        return { text: 'No precipitate.', noChange: true };
      default:
        return { text: 'No visible change.', noChange: true };
    }
  }

  // ─── Flame test ──────────────────────────────────────────────────────
  if (testId === 'flame') {
    const flameMap = {
      Li: { colour: 0xd24a2a, name: 'red' },
      Na: { colour: 0xffd54a, name: 'bright yellow' },
      K:  { colour: 0xb070d6, name: 'lilac' },
      Ca: { colour: 0xd96b3a, name: 'brick-red' },
      Ba: { colour: 0x7fc674, name: 'green' },
    };
    if (flameMap[cation]) {
      return {
        text: `Flame burns ${flameMap[cation].name}. Cation is ${CATIONS.find(c => c.id === cation).name}.`,
        flameColor: flameMap[cation].colour,
      };
    }
    return {
      text: 'No characteristic flame colour observed (flame stays the usual blue/yellow).',
      flameColor: 0xff7733,
    };
  }

  // ─── Silver nitrate (halide test) ────────────────────────────────────
  if (testId === 'agno3') {
    switch (anion) {
      case 'Cl':
        return { text: 'White precipitate formed (soluble in dilute aqueous ammonia). Chloride present.',
                 colour: 0xffffff, cloudy: true };
      case 'Br':
        return { text: 'Cream precipitate formed (partially soluble in dilute aqueous ammonia). Bromide present.',
                 colour: 0xf5e6c2, cloudy: true };
      case 'I':
        return { text: 'Yellow precipitate formed (insoluble in dilute aqueous ammonia). Iodide present.',
                 colour: 0xe7c84a, cloudy: true };
      case 'CO3':
        return { text: 'On adding dilute HNO₃ before AgNO₃, effervescence — carbonate decomposes. Silver nitrate then gives no further precipitate.',
                 effervescence: true, gas: 'co2' };
      default:
        return { text: 'No precipitate.', noChange: true };
    }
  }

  // ─── Barium nitrate (sulfate test) ───────────────────────────────────
  if (testId === 'banitate') {
    if (anion === 'SO4') {
      return { text: 'White precipitate formed, insoluble in excess dilute strong acid. Sulfate present.',
               colour: 0xffffff, cloudy: true };
    }
    return { text: 'No precipitate.', noChange: true };
  }

  // ─── Dilute HCl + limewater (carbonate test) ─────────────────────────
  if (testId === 'dilute-acid') {
    if (anion === 'CO3') {
      return {
        text: 'Effervescence — gas evolved which turns limewater milky. Carbon dioxide. Carbonate present.',
        effervescence: true,
        gas: 'co2',
        limewaterMilky: true,
      };
    }
    return { text: 'No effervescence, no gas evolved.', noChange: true };
  }

  // ─── NaOH + Al foil + warm (nitrate test) ────────────────────────────
  if (testId === 'naoh-al-warm') {
    if (anion === 'NO3') {
      return {
        text: 'On warming with aluminium foil, a gas is evolved which turns damp red litmus paper blue — ammonia. Nitrate present.',
        gas: 'ammonia',
        litmusBlue: true,
      };
    }
    return { text: 'No gas evolved that turns damp red litmus paper blue.', noChange: true };
  }

  return { text: 'No visible change.', noChange: true };
}

// ─── Tube profile (reused from food tests lab) ─────────────────────────────
function buildTubeLiquidProfile(fillHeight) {
  const pts = [new THREE.Vector2(0.001, 0.005)];
  const segs = 6;
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.062 * Math.sin(a);
    const y = 0.005 + 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  if (fillHeight > 0.065) {
    pts.push(new THREE.Vector2(0.062, fillHeight - 0.005));
  }
  pts.push(new THREE.Vector2(0.062, fillHeight));
  pts.push(new THREE.Vector2(0.001, fillHeight));
  return pts;
}

const TUBE_OUTER_PROFILE = (() => {
  const pts = [new THREE.Vector2(0.001, 0)];
  const segs = 8;
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI / 2;
    const r = 0.067 * Math.sin(a);
    const y = 0.06 * (1 - Math.cos(a));
    pts.push(new THREE.Vector2(r, y));
  }
  pts.push(new THREE.Vector2(0.067, 0.55));
  pts.push(new THREE.Vector2(0.072, 0.56));
  return pts;
})();

// Helper to pick N unknowns at random
const pickUnknowns = (n) => {
  const a = [...UNKNOWNS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
};

const UNKNOWN_LABELS = ['A', 'B', 'C', 'D', 'E'];
const TRIALS_PER_SESSION = 3;

export default function QualitativeAnalysisLab() {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});
  const audioRef = useRef({ initialized: false });
  const animationRef = useRef(null);

  // Phase: 'intro' → 'testing' → 'identify' → 'result' → ('testing' next trial) → 'session-end'
  const [phase, setPhase] = useState('intro');
  const [trials, setTrials] = useState([]);
  const [trialIndex, setTrialIndex] = useState(0);
  const [observations, setObservations] = useState([]); // log of {testId, text}
  const [busy, setBusy] = useState(false);
  const [cationGuess, setCationGuess] = useState(null);
  const [anionGuess, setAnionGuess] = useState(null);
  const [results, setResults] = useState([]); // accumulated trial outcomes
  const [muted, setMuted] = useState(false);
  const [readyToInit, setReadyToInit] = useState(false);

  const currentUnknown = trials[trialIndex] || null;

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════════════════════════════════════
  const initAudio = async () => {
    if (audioRef.current.initialized) return;
    try {
      await Tone.start();
      const master = new Tone.Gain(0.85).toDestination();

      const click = new Tone.MetalSynth({
        frequency: 220, envelope: { attack: 0.001, decay: 0.06, release: 0.02 },
        harmonicity: 4.5, modulationIndex: 14, resonance: 1800, octaves: 0.4,
      }).connect(master);
      click.volume.value = -22;

      const drip = new Tone.PluckSynth({
        attackNoise: 0.6, dampening: 4500, resonance: 0.88,
      }).connect(master);
      drip.volume.value = -10;

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

      const wrong = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 },
      }).connect(master);
      wrong.volume.value = -10;

      const whooshNoise = new Tone.Noise('pink');
      const whooshFilter = new Tone.AutoFilter({ frequency: 0.5, baseFrequency: 200, octaves: 4 });
      const whooshGain = new Tone.Gain(0).connect(master);
      whooshNoise.chain(whooshFilter, whooshGain);
      whooshNoise.start();
      whooshFilter.start();

      audioRef.current = {
        initialized: true, master,
        click, drip, pourGain, hissGain, bubbleGain, chime, wrong, whooshGain,
      };
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
  const playPour = (durationSec = 1.0) => {
    if (muted || !audioRef.current.initialized) return;
    const g = audioRef.current.pourGain.gain;
    g.cancelScheduledValues(Tone.now());
    g.linearRampTo(0.2, 0.1);
    setTimeout(() => g.linearRampTo(0, 0.25), durationSec * 1000 - 250);
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
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0, 1.0, 2.4);
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
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    const flameLight = new THREE.PointLight(0xff7733, 0, 1.5, 2);
    scene.add(flameLight);

    // ─── Shared materials ─────────────────────────────────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafffe, metalness: 0, roughness: 0.04,
      transparent: true, opacity: 0.18, side: THREE.DoubleSide,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 0.55,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x26282d, metalness: 0.88, roughness: 0.32 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6e4a2b, roughness: 0.85, metalness: 0.05 });

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

    // ═══ TEST TUBE (centre) ═══════════════════════════════════════════════
    const rackGroup = new THREE.Group();
    rackGroup.position.set(0, 0.04, 0);
    const rackBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.06, 0.18), woodMat
    );
    rackBase.castShadow = true; rackBase.receiveShadow = true;
    rackGroup.add(rackBase);
    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16, 1, true), woodMat
    );
    cuff.position.y = 0.05;
    rackGroup.add(cuff);
    scene.add(rackGroup);

    const tubeGroup = new THREE.Group();
    const tubeGlass = new THREE.Mesh(
      new THREE.LatheGeometry(TUBE_OUTER_PROFILE, 32), glassMat
    );
    tubeGlass.castShadow = true;
    tubeGlass.renderOrder = 2;
    tubeGroup.add(tubeGlass);
    // Liquid (the unknown solution)
    const liquidProfile = buildTubeLiquidProfile(0.22);
    const liquid = new THREE.Mesh(
      new THREE.LatheGeometry(liquidProfile, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xeef3f5, transparent: true, opacity: 0.82,
        roughness: 0.18, metalness: 0, clearcoat: 0.6,
      })
    );
    liquid.renderOrder = 1;
    tubeGroup.add(liquid);
    const meniscus = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 24),
      new THREE.MeshStandardMaterial({
        color: 0xdde6e8, roughness: 0.4, transparent: true, opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    meniscus.rotation.x = -Math.PI / 2;
    meniscus.position.y = 0.22;
    meniscus.renderOrder = 1;
    tubeGroup.add(meniscus);
    tubeGroup.position.set(0, 0.10, 0);
    scene.add(tubeGroup);

    // ═══ BUNSEN BURNER (left) ═════════════════════════════════════════════
    const bunsenGroup = new THREE.Group();
    bunsenGroup.position.set(-0.6, 0.025, 0);
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

    // Flame (hidden initially)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(-0.6, 0.36, 0);
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

    // ═══ NICHROME WIRE LOOP (used for flame tests) ═════════════════════════
    const wireGroup = new THREE.Group();
    wireGroup.position.set(0.55, 0.4, 0);
    wireGroup.visible = false;
    const wireHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x9a7038, roughness: 0.7 })
    );
    wireHandle.position.y = 0.08;
    wireGroup.add(wireHandle);
    const wireRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.5 })
    );
    wireRod.position.y = -0.06;
    wireGroup.add(wireRod);
    const wireLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.012, 0.0015, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.3 })
    );
    wireLoop.position.y = -0.145;
    wireLoop.rotation.x = Math.PI / 2;
    wireGroup.add(wireLoop);
    scene.add(wireGroup);

    // ═══ REAGENT BOTTLE (appears when a test is run) ═══════════════════════
    const bottleGroup = new THREE.Group();
    bottleGroup.visible = false;
    bottleGroup.position.set(0.55, 0.4, 0);
    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.06, 0.16, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x6e4a1a, transparent: true, opacity: 0.85,
        roughness: 0.18, clearcoat: 0.7,
      })
    );
    bottleBody.position.y = 0.08;
    bottleBody.castShadow = true;
    bottleGroup.add(bottleBody);
    const bottleNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.025, 0.03, 16),
      new THREE.MeshPhysicalMaterial({ color: 0x6e4a1a, transparent: true, opacity: 0.9, roughness: 0.2 })
    );
    bottleNeck.position.y = 0.175;
    bottleGroup.add(bottleNeck);
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.027, 0.027, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })
    );
    bottleCap.position.y = 0.197;
    bottleGroup.add(bottleCap);
    const bottleLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.9 })
    );
    bottleLabel.position.set(0, 0.08, 0.061);
    bottleGroup.add(bottleLabel);
    scene.add(bottleGroup);

    // ═══ LIMEWATER TEST TUBE (small, appears when CO₂ test runs) ════════════
    const limewaterGroup = new THREE.Group();
    limewaterGroup.position.set(0.85, 0.10, 0);
    limewaterGroup.visible = false;
    const limewaterTube = new THREE.Mesh(
      new THREE.LatheGeometry(TUBE_OUTER_PROFILE, 24), glassMat
    );
    limewaterTube.scale.set(0.7, 0.7, 0.7);
    limewaterGroup.add(limewaterTube);
    const limewaterLiquid = new THREE.Mesh(
      new THREE.LatheGeometry(buildTubeLiquidProfile(0.18), 24),
      new THREE.MeshPhysicalMaterial({
        color: 0xf4faf2, transparent: true, opacity: 0.75,
        roughness: 0.18, clearcoat: 0.5,
      })
    );
    limewaterLiquid.scale.set(0.7, 0.7, 0.7);
    limewaterGroup.add(limewaterLiquid);
    scene.add(limewaterGroup);

    // ═══ LITMUS PAPER STRIP (appears above tube for gas tests) ═════════════
    const litmusGroup = new THREE.Group();
    litmusGroup.position.set(0, 0.62, 0);
    litmusGroup.visible = false;
    const litmusMat = new THREE.MeshStandardMaterial({
      color: 0xd96a8c, roughness: 0.9, side: THREE.DoubleSide,
    });
    const litmus = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 0.1), litmusMat
    );
    litmusGroup.add(litmus);
    scene.add(litmusGroup);

    // ─── Save refs ────────────────────────────────────────────────────────
    sceneObjects.current = {
      scene, camera, renderer,
      tubeGroup, liquid, meniscus,
      flameGroup, flameLight, outerFlame, midFlame, innerFlame,
      wireGroup, wireLoop,
      bottleGroup, bottleLabel,
      limewaterGroup, limewaterLiquid,
      litmusGroup, litmus, litmusMat,
      bubbles: [], droplets: [], splashes: [], gasBubbles: [],
      tweens: [],
      flameOn: false,
      bubblesOn: false,
      gasOn: false,
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

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════════════════════════
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const so = sceneObjects.current;
      if (!so.scene) return;
      so.time += dt;

      // ── Generic tweens (numeric, position, color) ──
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
        } else if (tw.type === 'rot') {
          tw.target.rotation.z = tw.fromZ + (tw.toZ - tw.fromZ) * t;
        } else if (tw.type === 'colour') {
          const fr = ((tw.from >> 16) & 0xff) / 255;
          const fg = ((tw.from >> 8) & 0xff) / 255;
          const fb = (tw.from & 0xff) / 255;
          const tr = ((tw.to >> 16) & 0xff) / 255;
          const tg = ((tw.to >> 8) & 0xff) / 255;
          const tb = (tw.to & 0xff) / 255;
          tw.material.color.setRGB(fr + (tr - fr) * t, fg + (tg - fg) * t, fb + (tb - fb) * t);
        } else if (tw.type === 'opacity') {
          tw.material.opacity = tw.from + (tw.to - tw.from) * t;
        } else if (tw.type === 'numeric') {
          tw.setter(tw.from + (tw.to - tw.from) * t);
        }
        if (tw.progress >= 1) {
          so.tweens.splice(i, 1);
          if (tw.onComplete) tw.onComplete();
        }
      }

      // ── Flame flicker ──
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

      // ── Bubbles (effervescence inside tube) ──
      if (so.bubblesOn && Math.random() < 0.55) {
        const bubble = new THREE.Mesh(
          new THREE.SphereGeometry(0.005 + Math.random() * 0.004, 8, 8),
          new THREE.MeshPhysicalMaterial({
            color: 0xffffff, transparent: true, opacity: 0.7,
            roughness: 0.05, clearcoat: 0.7,
          })
        );
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.04;
        bubble.position.set(
          so.tubeGroup.position.x + Math.cos(a) * r,
          so.tubeGroup.position.y + 0.04,
          so.tubeGroup.position.z + Math.sin(a) * r,
        );
        so.scene.add(bubble);
        so.bubbles.push({
          mesh: bubble,
          vy: 0.18 + Math.random() * 0.1,
          targetY: so.tubeGroup.position.y + 0.2 + Math.random() * 0.02,
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

      // ── Gas evolution (visible smoke above tube) ──
      if (so.gasOn && Math.random() < 0.45) {
        const g = new THREE.Mesh(
          new THREE.SphereGeometry(0.012 + Math.random() * 0.006, 8, 8),
          new THREE.MeshBasicMaterial({
            color: 0xf2f5fa, transparent: true, opacity: 0.35,
          })
        );
        g.position.set(
          so.tubeGroup.position.x + (Math.random() - 0.5) * 0.04,
          so.tubeGroup.position.y + 0.24,
          so.tubeGroup.position.z + (Math.random() - 0.5) * 0.04,
        );
        so.scene.add(g);
        so.gasBubbles.push({
          mesh: g,
          vy: 0.12 + Math.random() * 0.06,
          life: 1.0,
        });
      }
      for (let i = so.gasBubbles.length - 1; i >= 0; i--) {
        const g = so.gasBubbles[i];
        g.mesh.position.y += g.vy * dt;
        g.life -= dt * 0.7;
        g.mesh.material.opacity = Math.max(0, g.life * 0.35);
        g.mesh.scale.multiplyScalar(1 + dt * 0.3);
        if (g.life <= 0) {
          so.scene.remove(g.mesh);
          g.mesh.geometry.dispose();
          g.mesh.material.dispose();
          so.gasBubbles.splice(i, 1);
        }
      }

      // ── Droplets falling from bottle to tube ──
      for (let i = so.droplets.length - 1; i >= 0; i--) {
        const d = so.droplets[i];
        d.vy -= 3.5 * dt;
        d.mesh.position.y += d.vy * dt;
        if (d.mesh.position.y < d.targetY) {
          so.scene.remove(d.mesh);
          d.mesh.geometry.dispose();
          d.mesh.material.dispose();
          so.droplets.splice(i, 1);
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
  const tweenPos = (target, toPos, duration) =>
    new Promise(res => {
      const so = sceneObjects.current;
      so.tweens.push({
        type: 'pos', target,
        fromX: target.position.x, fromY: target.position.y, fromZ: target.position.z,
        toX: toPos.x, toY: toPos.y, toZ: toPos.z,
        progress: 0, duration, onComplete: res,
      });
    });
  const tweenRot = (target, toZ, duration) =>
    new Promise(res => {
      const so = sceneObjects.current;
      so.tweens.push({
        type: 'rot', target,
        fromZ: target.rotation.z, toZ,
        progress: 0, duration, onComplete: res,
      });
    });
  const tweenColour = (material, to, duration) =>
    new Promise(res => {
      const so = sceneObjects.current;
      so.tweens.push({
        type: 'colour', material,
        from: material.color.getHex(), to,
        progress: 0, duration, onComplete: res,
      });
    });
  const tweenOpacity = (material, to, duration) =>
    new Promise(res => {
      const so = sceneObjects.current;
      so.tweens.push({
        type: 'opacity', material,
        from: material.opacity, to,
        progress: 0, duration, onComplete: res,
      });
    });
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // ─── Visual effect: drops fall from bottle into tube ─────────────────────
  const dropDrops = (count, color) =>
    new Promise(res => {
      const so = sceneObjects.current;
      let dropped = 0;
      const fire = () => {
        playDrip();
        const drop = new THREE.Mesh(
          new THREE.SphereGeometry(0.018, 12, 12),
          new THREE.MeshPhysicalMaterial({
            color, transparent: true, opacity: 0.92,
            roughness: 0.05, clearcoat: 0.8,
            emissive: color, emissiveIntensity: 0.1,
          })
        );
        drop.position.set(
          so.tubeGroup.position.x,
          so.tubeGroup.position.y + 0.45,
          so.tubeGroup.position.z,
        );
        so.scene.add(drop);
        so.droplets.push({
          mesh: drop, vy: 0,
          targetY: so.tubeGroup.position.y + 0.24,
        });
        dropped++;
        if (dropped < count) setTimeout(fire, 220);
        else setTimeout(res, 500);
      };
      fire();
    });

  // ─── Reset tube to fresh unknown ─────────────────────────────────────────
  const resetTube = () => {
    const so = sceneObjects.current;
    if (!so.liquid || !currentUnknown) return;
    so.liquid.material.color.setHex(currentUnknown.color);
    so.liquid.material.opacity = 0.82;
    so.meniscus.material.color.setHex(currentUnknown.color);
    so.meniscus.material.opacity = 0.85;
    so.bubblesOn = false;
    so.gasOn = false;
    setBubble(false);
    if (so.litmusGroup) {
      so.litmusGroup.visible = false;
      so.litmus.material.color.setHex(0xd96a8c);
    }
    if (so.limewaterGroup) {
      so.limewaterGroup.visible = false;
      so.limewaterLiquid.material.color.setHex(0xf4faf2);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RUN A TEST — orchestrates animation + records observation
  // ═══════════════════════════════════════════════════════════════════════════
  const runTest = async (testId) => {
    if (busy || !currentUnknown) return;
    const test = TESTS.find(t => t.id === testId);
    if (!test) return;
    setBusy(true);
    const so = sceneObjects.current;

    // Reset tube to fresh unknown solution
    resetTube();
    await delay(200);

    const obs = observe(currentUnknown, testId);

    // ─── Flame test: separate animation ────────────────────────────────
    if (testId === 'flame') {
      playWhoosh();
      so.flameGroup.visible = true;
      so.flameLight.intensity = 0.8;
      so.flameOn = true;
      setHiss(true);
      // Show wire loop near tube
      so.wireGroup.visible = true;
      so.wireGroup.position.set(0.55, 0.4, 0);
      await tweenPos(so.wireGroup, new THREE.Vector3(0, 0.4, 0), 0.6);
      await tweenPos(so.wireGroup, new THREE.Vector3(0, 0.28, 0), 0.4);  // dip in unknown
      playClick();
      await delay(300);
      await tweenPos(so.wireGroup, new THREE.Vector3(0, 0.5, 0), 0.4);
      await tweenPos(so.wireGroup, new THREE.Vector3(-0.6, 0.5, 0), 0.7);
      await tweenPos(so.wireGroup, new THREE.Vector3(-0.6, 0.42, 0), 0.3);  // in flame
      // Change flame colour
      if (obs.flameColor !== undefined) {
        await tweenColour(so.outerFlame.material, obs.flameColor, 0.6);
        await tweenColour(so.midFlame.material, obs.flameColor, 0.3);
        so.flameLight.color.setHex(obs.flameColor);
      }
      await delay(1800);
      // Restore flame colour
      await tweenColour(so.outerFlame.material, 0xffa84a, 0.6);
      await tweenColour(so.midFlame.material, 0xff6622, 0.4);
      so.flameLight.color.setHex(0xff7733);
      // Return wire to rest
      await tweenPos(so.wireGroup, new THREE.Vector3(0.55, 0.4, 0), 0.7);
      so.wireGroup.visible = false;
      // Extinguish flame
      so.flameGroup.visible = false;
      so.flameLight.intensity = 0;
      so.flameOn = false;
      setHiss(false);

      setObservations(prev => [...prev, { testId, label: test.short, text: obs.text }]);
      setBusy(false);
      return;
    }

    // ─── Other tests: bring out reagent bottle, drop drips into tube ───
    so.bottleGroup.visible = true;
    so.bottleGroup.position.set(0.55, 0.45, 0);
    so.bottleGroup.rotation.z = 0;
    // Recolour the bottle label to hint reagent
    const reagentColours = {
      NaOH: 0xe8e4d8, NH3: 0xe8e8f4, AgNO3: 0xefe8d4,
      BaNO32: 0xf2e8e8, HCl: 0xf4f4e8,
    };
    const reagentDropColours = {
      NaOH: 0xf0f0f0, NH3: 0xf0f4f0, AgNO3: 0xeeeeee,
      BaNO32: 0xefefef, HCl: 0xf4f4e8,
    };
    if (so.bottleLabel && reagentColours[test.reagent]) {
      so.bottleLabel.material.color.setHex(reagentColours[test.reagent]);
    }
    // Move bottle above the tube and tilt
    await tweenPos(so.bottleGroup, new THREE.Vector3(0.16, 0.55, 0), 0.6);
    await tweenRot(so.bottleGroup, -0.7, 0.3);

    // Drops fall
    playPour(0.6);
    await dropDrops(testId.includes('excess') ? 6 : 4, reagentDropColours[test.reagent] || 0xeeeeee);

    // ─── Apply visual outcome to liquid ────────────────────────────────
    if (obs.colour !== undefined) {
      // precipitate forms — tint liquid to ppt colour, make it cloudy
      await tweenColour(so.liquid.material, obs.colour, 0.7);
      await tweenColour(so.meniscus.material, obs.colour, 0.5);
      // opacity up slightly to look cloudy
      so.liquid.material.opacity = 0.95;
      so.meniscus.material.opacity = 0.95;
    }

    // For excess tests that dissolve, second batch + dissolve animation
    if (testId.includes('excess') && obs.dissolveAfter && obs.dissolveTo !== undefined) {
      await delay(400);
      // tilt bottle again, drip more
      playPour(0.6);
      await dropDrops(4, reagentDropColours[test.reagent] || 0xeeeeee);
      await tweenColour(so.liquid.material, obs.dissolveTo, 1.0);
      await tweenColour(so.meniscus.material, obs.dissolveTo, 0.7);
      so.liquid.material.opacity = 0.82;
      so.meniscus.material.opacity = 0.85;
    }

    // Effervescence
    if (obs.effervescence) {
      so.bubblesOn = true;
      setBubble(true);
      // If carbonate gas test, also show limewater going milky
      if (obs.limewaterMilky) {
        so.limewaterGroup.visible = true;
        await delay(600);
        await tweenColour(so.limewaterLiquid.material, 0xc8d8c8, 1.5);
      } else {
        await delay(1800);
      }
      so.bubblesOn = false;
      setBubble(false);
      await delay(400);
    }

    // Gas evolution (ammonia / CO₂ at top) + litmus paper test
    if (obs.gas === 'ammonia') {
      so.gasOn = true;
      so.litmusGroup.visible = true;
      so.litmusGroup.position.set(so.tubeGroup.position.x, so.tubeGroup.position.y + 0.34, 0);
      // Warm the tube
      playWhoosh();
      so.flameGroup.visible = true;
      so.flameLight.intensity = 0.8;
      so.flameOn = true;
      setHiss(true);
      // (We don't physically move the tube to the flame for simplicity)
      await delay(1500);
      // Litmus turns blue if ammonia
      if (obs.litmusBlue) {
        await tweenColour(so.litmus.material, 0x4a6ec8, 1.2);
      }
      await delay(800);
      so.gasOn = false;
      so.flameGroup.visible = false;
      so.flameLight.intensity = 0;
      so.flameOn = false;
      setHiss(false);
    }

    // Return bottle to rest
    await tweenRot(so.bottleGroup, 0, 0.3);
    await tweenPos(so.bottleGroup, new THREE.Vector3(0.55, 0.45, 0), 0.5);
    so.bottleGroup.visible = false;

    setObservations(prev => [...prev, { testId, label: test.short, text: obs.text }]);
    setBusy(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  const beginLab = async () => {
    await initAudio();
    const session = pickUnknowns(TRIALS_PER_SESSION);
    setTrials(session);
    setTrialIndex(0);
    setResults([]);
    setObservations([]);
    setCationGuess(null);
    setAnionGuess(null);
    setPhase('testing');
  };

  // Repaint tube whenever the current unknown changes
  useEffect(() => {
    const so = sceneObjects.current;
    if (!so.liquid || !currentUnknown) return;
    so.liquid.material.color.setHex(currentUnknown.color);
    so.liquid.material.opacity = 0.82;
    so.meniscus.material.color.setHex(currentUnknown.color);
    so.meniscus.material.opacity = 0.85;
  }, [currentUnknown]);

  const submitIdentification = () => {
    if (!cationGuess || !anionGuess || !currentUnknown) return;
    const correctCation = cationGuess === currentUnknown.cation;
    const correctAnion = anionGuess === currentUnknown.anion;
    const fullyCorrect = correctCation && correctAnion;
    if (fullyCorrect) playChime();
    else playWrong();
    setResults(prev => [...prev, {
      unknown: currentUnknown,
      cationGuess, anionGuess,
      correctCation, correctAnion, fullyCorrect,
      testsUsed: observations.length,
    }]);
    setPhase('result');
  };

  const nextTrial = () => {
    if (trialIndex + 1 >= trials.length) {
      setPhase('session-end');
    } else {
      setTrialIndex(trialIndex + 1);
      setObservations([]);
      setCationGuess(null);
      setAnionGuess(null);
      setPhase('testing');
      // reset tube visuals — useEffect on currentUnknown handles it
    }
  };

  const resetSession = () => {
    const session = pickUnknowns(TRIALS_PER_SESSION);
    setTrials(session);
    setTrialIndex(0);
    setResults([]);
    setObservations([]);
    setCationGuess(null);
    setAnionGuess(null);
    setPhase('testing');
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
            NSSCO · Chemistry Practical · Paper 3
          </div>
          <h1 className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
            <span style={{ fontStyle: 'italic' }}>Qualitative</span> Analysis
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
        {phase !== 'intro' && currentUnknown && (
          <div className="absolute top-2 right-3 text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono, letterSpacing: '0.12em' }}>
            <div className="text-right">Solution {UNKNOWN_LABELS[trialIndex]} of {trials.length}</div>
          </div>
        )}
        {phase === 'testing' && currentUnknown && observations.length > 0 && (
          <div className="absolute top-2 left-3 max-w-[55%] text-[10px] text-stone-700 pointer-events-none"
               style={{ fontFamily: mono }}>
            <div className="opacity-55 mb-1 uppercase" style={{ letterSpacing: '0.16em' }}>
              Observations
            </div>
            {observations.map((o, i) => (
              <div key={i} className="mb-1 leading-snug">
                <span className="opacity-50">{i + 1}.</span> <span className="font-semibold">{o.label}:</span> {o.text}
              </div>
            ))}
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
              Identify the <span style={{ fontStyle: 'italic' }}>cation and anion</span> in each unknown salt solution by carrying out the standard NSSCO qualitative analysis tests.
            </p>
            <p className="text-xs opacity-65 mb-4">
              You'll receive {TRIALS_PER_SESSION} unknown solutions. Choose tests from the menu — sodium hydroxide, aqueous ammonia, flame test, silver nitrate, barium nitrate, dilute acid, or the aluminium-foil reduction. Observation wording matches NSSCO Annexe B.
            </p>
            <button onClick={beginLab}
                    className="w-full py-3.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              Enter the Lab <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'testing' && currentUnknown && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2 flex items-center justify-between"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              <span>Solution {UNKNOWN_LABELS[trialIndex]} · choose a test</span>
              <span>{observations.length} test{observations.length === 1 ? '' : 's'} done</span>
            </div>
            <div className="grid grid-cols-1 gap-1 mb-2 max-h-44 overflow-y-auto pr-1">
              {TESTS.map(t => (
                <button key={t.id} onClick={() => runTest(t.id)}
                        disabled={busy}
                        className="py-1.5 px-2 text-[10px] text-left active:scale-[0.99] disabled:opacity-40"
                        style={{
                          background: 'rgba(232,228,216,0.06)',
                          border: '1px solid rgba(232,228,216,0.15)',
                          fontFamily: mono,
                        }}>
                  <span className="opacity-55">[{t.target}]</span> {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => setPhase('identify')}
                    disabled={busy || observations.length === 0}
                    className="w-full py-2.5 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
                    style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                             fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
              I'm Ready to Identify <ChevronRight size={14} />
            </button>
          </div>
        )}

        {phase === 'identify' && currentUnknown && (
          <div className="px-5 pt-4 pb-5">
            <div className="text-[10px] uppercase opacity-55 mb-2"
                 style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
              Identify the ions in solution {UNKNOWN_LABELS[trialIndex]}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[10px] opacity-65 mb-1 uppercase"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  Cation
                </div>
                <div className="grid grid-cols-3 gap-1 max-h-32 overflow-y-auto pr-1">
                  {CATIONS.map(c => (
                    <button key={c.id} onClick={() => setCationGuess(c.id)}
                            className="py-1.5 px-1 text-[10px] active:scale-95"
                            style={{
                              background: c.id === cationGuess
                                ? 'rgba(232,228,216,0.25)'
                                : 'rgba(232,228,216,0.06)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] opacity-65 mb-1 uppercase"
                     style={{ fontFamily: mono, letterSpacing: '0.2em' }}>
                  Anion
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {ANIONS.map(a => (
                    <button key={a.id} onClick={() => setAnionGuess(a.id)}
                            className="py-1.5 px-1 text-[10px] active:scale-95"
                            style={{
                              background: a.id === anionGuess
                                ? 'rgba(232,228,216,0.25)'
                                : 'rgba(232,228,216,0.06)',
                              border: '1px solid rgba(232,228,216,0.18)',
                              fontFamily: mono,
                            }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPhase('testing')}
                      className="py-2.5 text-[10px] uppercase active:scale-95"
                      style={{ background: 'rgba(232,228,216,0.08)',
                               color: '#e8e4d8', border: '1px solid rgba(232,228,216,0.25)',
                               fontFamily: mono, letterSpacing: '0.22em' }}>
                ← More Tests
              </button>
              <button onClick={submitIdentification}
                      disabled={!cationGuess || !anionGuess}
                      className="py-2.5 text-[10px] uppercase active:scale-95 disabled:opacity-40"
                      style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                               fontFamily: mono, letterSpacing: '0.22em', fontWeight: 500 }}>
                Submit
              </button>
            </div>
          </div>
        )}

        {phase === 'result' && currentUnknown && (
          <div className="px-5 pt-4 pb-5">
            {(() => {
              const last = results[results.length - 1];
              if (!last) return null;
              const trueC = CATIONS.find(c => c.id === currentUnknown.cation);
              const trueA = ANIONS.find(a => a.id === currentUnknown.anion);
              const guessC = CATIONS.find(c => c.id === last.cationGuess);
              const guessA = ANIONS.find(a => a.id === last.anionGuess);
              return (
                <>
                  <div className="text-[10px] uppercase opacity-55 mb-2"
                       style={{ fontFamily: mono, letterSpacing: '0.24em' }}>
                    Result · Solution {UNKNOWN_LABELS[trialIndex]}
                  </div>
                  <div className="text-xl flex items-center gap-2 mb-1"
                       style={{ fontWeight: 500 }}>
                    {last.fullyCorrect
                      ? <><Check size={20} /> Both correct</>
                      : last.correctCation || last.correctAnion
                        ? <><Check size={20} /> Partial</>
                        : <><X size={20} /> Not identified</>}
                  </div>
                  <div className="text-xs mb-3 leading-snug" style={{ fontFamily: mono }}>
                    Your answer: {guessC?.label} + {guessA?.label}
                    {' · '}
                    Actual: <span style={{ fontWeight: 600 }}>{trueC?.label} + {trueA?.label}</span>
                    {' '}({currentUnknown.displayName})
                  </div>
                  <div className="text-xs opacity-65 mb-3">
                    {last.testsUsed} test{last.testsUsed === 1 ? '' : 's'} used.
                  </div>
                  <button onClick={nextTrial}
                          className="w-full py-3 text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#e8e4d8', color: '#1a1f2e',
                                   fontFamily: mono, letterSpacing: '0.25em', fontWeight: 500 }}>
                    {trialIndex + 1 >= trials.length ? 'See Session Score' : 'Next Unknown'} <ChevronRight size={14} />
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
            {(() => {
              const correct = results.filter(r => r.fullyCorrect).length;
              const total = results.length;
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase text-stone-500"
                           style={{ fontFamily: mono, letterSpacing: '0.28em' }}>Session results</div>
                      <div className="text-2xl mt-1 leading-tight" style={{ fontWeight: 500 }}>
                        Qualitative <span style={{ fontStyle: 'italic' }}>analysis</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full"
                         style={{ backgroundColor: correct === total ? '#2e7d32' : '#c2185b', color: 'white' }}>
                      <Trophy size={18} />
                    </div>
                  </div>
                  <div className="text-3xl mb-3" style={{ fontWeight: 600 }}>
                    {correct} <span className="text-stone-400 text-lg">/ {total}</span>
                  </div>
                  <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: mono }}>
                    {results.map((r, i) => {
                      const trueC = CATIONS.find(c => c.id === r.unknown.cation);
                      const trueA = ANIONS.find(a => a.id === r.unknown.anion);
                      const guessC = CATIONS.find(c => c.id === r.cationGuess);
                      const guessA = ANIONS.find(a => a.id === r.anionGuess);
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-stone-700">
                            {UNKNOWN_LABELS[i]}: {guessC?.label} + {guessA?.label}
                          </span>
                          <span style={{
                            color: r.fullyCorrect ? '#2e7d32' : '#c2185b',
                            fontWeight: 500,
                          }}>
                            {r.fullyCorrect ? '✓' : `✗ → ${trueC?.label} + ${trueA?.label}`}
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
