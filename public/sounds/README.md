# Lab sound files

Drop CC0 / royalty-free audio files here with the exact filenames listed below.
The sound engine in `components/lab/util/sound.js` automatically uses them if
present, falling back to Tone.js synth presets if missing.

| File | Purpose | Suggested source |
|------|---------|------------------|
| `click.mp3`   | Mechanical apparatus snap / clamp click | freesound.org "metal click", BBC SFX |
| `drop.mp3`    | Single water droplet into liquid | freesound.org "water drop", "droplet" |
| `pour.mp3`    | Pouring liquid (~3–5 s) | freesound.org "pouring water" |
| `stream.mp3`  | Continuous tap flow (loopable, seamless) | freesound.org "running water loop" |
| `whoosh.mp3`  | Bunsen burner ignition (~0.5 s) | freesound.org "gas ignition", "fwoosh" |
| `bunsen.mp3`  | Continuous gas burner hiss (loopable) | freesound.org "gas burner loop" |
| `bubbles.mp3` | Continuous bubbling water (loopable) | freesound.org "boiling water loop" |
| `swirl.mp3`   | Liquid swirling in a flask | freesound.org "swirl water" |
| `chime.mp3`   | Success / endpoint chime | freesound.org "bell chime", "ding" |
| `buzz.mp3`    | Wrong action / unsafe choice | freesound.org "buzzer", "wrong answer" |

## Recommended sources (all free, CC0 / CC-BY)

- **freesound.org** — biggest library, search and download. Filter by license = CC0.
- **BBC Sound Effects** (bbcsfx.acropolis.org.uk) — free for personal/educational use.
- **Pixabay** (pixabay.com/sound-effects) — royalty-free, no attribution required.
- **Mixkit** (mixkit.co/free-sound-effects) — curated free SFX.

## Format notes

- Use `.mp3` for broad browser support and small file size.
- Loopable files (`stream.mp3`, `bunsen.mp3`, `bubbles.mp3`) should be seam-edited
  so the end-to-start transition is silent. Audacity's "Repair" + crossfade tools work.
- Keep files under ~200 KB each; the goal is a fast-loading classroom experience.
