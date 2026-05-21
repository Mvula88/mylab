'use client';

// Hybrid SoundEngine — prefers real audio files in /public/sounds/, falls back
// to Tone.js synth presets if a file is missing. This lets us drop in better
// recordings later without changing any lab code.

const SOUND_FILES = {
  click:      '/sounds/click.mp3',      // mechanical apparatus click
  drop:       '/sounds/drop.mp3',       // single water droplet
  pour:       '/sounds/pour.mp3',       // pouring liquid (3-5s loop)
  stream:     '/sounds/stream.mp3',     // continuous tap flow (loopable)
  whoosh:     '/sounds/whoosh.mp3',     // bunsen ignition
  bunsen:     '/sounds/bunsen.mp3',     // continuous burner hiss (loopable)
  bubbles:    '/sounds/bubbles.mp3',    // continuous bubbling (loopable)
  swirl:      '/sounds/swirl.mp3',      // flask swirling
  chime:      '/sounds/chime.mp3',      // success / endpoint chime
  buzz:       '/sounds/buzz.mp3',       // wrong / unsafe action
};

const FILE_EXISTS = {}; // cache: { key: boolean }
const AUDIO_NODES = {}; // cache: { key: HTMLAudioElement } for one-shots
const LOOP_NODES = {};  // cache: { key: HTMLAudioElement } for continuous

let toneEngine = null;
let muted = false;
let started = false;

async function checkFile(key) {
  if (key in FILE_EXISTS) return FILE_EXISTS[key];
  try {
    const url = SOUND_FILES[key];
    if (!url) return (FILE_EXISTS[key] = false);
    const res = await fetch(url, { method: 'HEAD' });
    FILE_EXISTS[key] = res.ok;
    return res.ok;
  } catch {
    return (FILE_EXISTS[key] = false);
  }
}

async function ensureTone() {
  if (toneEngine) return toneEngine;
  const Tone = await import('tone');
  if (!started) {
    try { await Tone.start(); started = true; } catch {}
  }
  // Master compressor + limiter so all sounds feel "loud and full" without clipping
  const limiter = new Tone.Limiter(-1).toDestination();
  const reverb = new Tone.Reverb({ decay: 0.6, wet: 0.18 }).connect(limiter);
  toneEngine = {
    Tone, limiter, reverb,
    // Mechanical click — short metallic tick (apparatus snap, edge crossing)
    click: new Tone.MetalSynth({
      frequency: 220, envelope: { attack: 0.001, decay: 0.1, release: 0.06 },
      harmonicity: 4.3, modulationIndex: 14, resonance: 900, octaves: 1.6,
    }).connect(limiter),
    // Water drop — pluck with reverb tail for "plink…" sound, not just pluck
    drop: new Tone.PluckSynth({ attackNoise: 0.6, dampening: 5000, resonance: 0.9 }).connect(reverb),
    // Endpoint chime — richer triad with reverb
    chime: new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.5, sustain: 0.1, release: 1.4 },
    }).connect(reverb),
    // Wrong-action buzzer
    buzzer: new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0.3, release: 0.1 },
    }).connect(limiter),
    // Pouring — richer with a low rumble layered on top
    pourNoise: new Tone.Noise('pink').connect(
      new Tone.Filter({ type: 'bandpass', frequency: 1100, Q: 0.9 }).connect(limiter),
    ),
    // Continuous stream — fuller body
    streamNoise: new Tone.Noise('brown').connect(
      new Tone.Filter({ type: 'lowpass', frequency: 700 }).connect(limiter),
    ),
    // Bunsen hiss — high band
    bunsenHiss: new Tone.Noise('white').connect(
      new Tone.Filter({ type: 'highpass', frequency: 2800 }).connect(limiter),
    ),
    // Bubbling — low pulsing rumble
    bubbleNoise: new Tone.Noise('brown').connect(
      new Tone.Filter({ type: 'lowpass', frequency: 380 }).connect(limiter),
    ),
  };
  // Volumes bumped up roughly +8 dB across the board for a louder, more present mix
  toneEngine.click.volume.value      = -3;
  toneEngine.drop.volume.value       = -1;
  toneEngine.chime.volume.value      = -3;
  toneEngine.buzzer.volume.value     = -10;
  toneEngine.pourNoise.volume.value  = -12;
  toneEngine.streamNoise.volume.value = -14;
  toneEngine.bunsenHiss.volume.value = -22;
  toneEngine.bubbleNoise.volume.value = -18;
  return toneEngine;
}

async function playOneShot(key) {
  if (muted) return;
  if (await checkFile(key)) {
    let a = AUDIO_NODES[key];
    if (!a) {
      a = new Audio(SOUND_FILES[key]);
      a.preload = 'auto';
      AUDIO_NODES[key] = a;
    }
    // Clone so overlapping plays don't cut each other off
    const clone = a.cloneNode();
    clone.volume = 1.0;
    clone.play().catch(() => {});
    return;
  }
  // Fallback: Tone synth
  const t = await ensureTone();
  if (!t) return;
  if (key === 'click') t.click.triggerAttackRelease('C2', '16n');
  else if (key === 'drop') {
    const notes = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
    t.drop.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], '8n');
  } else if (key === 'chime') t.chime.triggerAttackRelease(['E5', 'G5', 'B5'], '2n');
  else if (key === 'buzz') t.buzzer.triggerAttackRelease('C3', '8n');
  else if (key === 'whoosh') {
    const filter = new t.Tone.Filter({ type: 'bandpass', frequency: 600, Q: 1.5 }).connect(t.limiter);
    const noise = new t.Tone.Noise('pink').connect(filter);
    noise.volume.value = -6;
    noise.start();
    filter.frequency.rampTo(2200, 0.4);
    noise.stop('+0.5');
    setTimeout(() => { noise.dispose(); filter.dispose(); }, 700);
  } else if (key === 'swirl') {
    // Watery rumble — short low-passed brown noise
    const filter = new t.Tone.Filter({ type: 'lowpass', frequency: 500 }).connect(t.limiter);
    const noise = new t.Tone.Noise('brown').connect(filter);
    noise.volume.value = -12;
    noise.start();
    noise.stop('+0.6');
    setTimeout(() => { noise.dispose(); filter.dispose(); }, 800);
  } else if (key === 'pour') {
    t.pourNoise.start();
    t.pourNoise.stop('+1.8');
  }
}

async function startLoop(key) {
  if (muted) return;
  if (await checkFile(key)) {
    let a = LOOP_NODES[key];
    if (!a) {
      a = new Audio(SOUND_FILES[key]);
      a.loop = true;
      a.volume = 0.9;
      LOOP_NODES[key] = a;
    }
    a.play().catch(() => {});
    return;
  }
  const t = await ensureTone();
  if (!t) return;
  if (key === 'stream') t.streamNoise.start();
  else if (key === 'bunsen') t.bunsenHiss.start();
  else if (key === 'bubbles') t.bubbleNoise.start();
}

async function stopLoop(key) {
  const a = LOOP_NODES[key];
  if (a) {
    a.pause();
    a.currentTime = 0;
  }
  if (toneEngine) {
    if (key === 'stream') toneEngine.streamNoise.stop();
    else if (key === 'bunsen') toneEngine.bunsenHiss.stop();
    else if (key === 'bubbles') toneEngine.bubbleNoise.stop();
  }
}

export const Sound = {
  async ready() {
    return ensureTone();
  },
  setMuted(m) {
    muted = m;
    if (m) {
      Object.values(LOOP_NODES).forEach((a) => a.pause());
      if (toneEngine) {
        toneEngine.streamNoise.stop();
        toneEngine.bunsenHiss.stop();
        toneEngine.bubbleNoise.stop();
      }
    }
  },
  isMuted: () => muted,
  click:      () => playOneShot('click'),
  drop:       () => playOneShot('drop'),
  pour:       () => playOneShot('pour'),
  whoosh:     () => playOneShot('whoosh'),
  swirl:      () => playOneShot('swirl'),
  chime:      () => playOneShot('chime'),
  buzz:       () => playOneShot('buzz'),
  streamOn:   () => startLoop('stream'),
  streamOff:  () => stopLoop('stream'),
  bunsenOn:   () => startLoop('bunsen'),
  bunsenOff:  () => stopLoop('bunsen'),
  bubblesOn:  () => startLoop('bubbles'),
  bubblesOff: () => stopLoop('bubbles'),
};
