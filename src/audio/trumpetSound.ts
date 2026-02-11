const PITCH_TO_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

/** Bb trumpet: written C sounds as concert Bb (2 semitones lower). Shift down 2 semitones to match. */
const Bb_TRUMPET_TRANSPOSITION_SEMITONES = -2;

/**
 * Convert note name (e.g. C4, Bb5, F#4) to frequency in Hz.
 * Uses equal temperament with A4 = 440 Hz.
 * Transposed for Bb trumpet: written C4 → concert Bb3 (matches trumpet's actual sound).
 */
export function noteToFrequency(noteName: string): number {
  const match = noteName.match(/^([A-G][#b]?)(-?\d+)$/i);
  if (!match) return 261.63; // fallback to C4
  const [, name, oct] = match;
  const semitone = PITCH_TO_SEMITONE[name] ?? 0;
  const octave = parseInt(oct, 10);
  const midi = (octave + 1) * 12 + semitone;
  const midiTransposed = midi + Bb_TRUMPET_TRANSPOSITION_SEMITONES;
  return 440 * Math.pow(2, (midiTransposed - 69) / 12);
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Play a note with a trumpet-like synthesized sound.
 * Resumes AudioContext on first user gesture if needed.
 * @param startTime Optional AudioContext time (seconds) to schedule playback; defaults to now.
 */
export function playTrumpetNote(
  noteName: string,
  durationMs = 350,
  startTime?: number
): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const freq = noteToFrequency(noteName);
  const now = startTime ?? ctx.currentTime;
  const durationSec = durationMs / 1000;

  const oscillator = ctx.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(freq, now);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(1, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gainNode.gain.linearRampToValueAtTime(0.12, now + durationSec * 0.4);
  gainNode.gain.linearRampToValueAtTime(0, now + durationSec);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + durationSec);
}

/** Active sustained note: oscillator + nodes for stop/release */
let sustainedOscillator: OscillatorNode | null = null;
let sustainedGain: GainNode | null = null;

let releaseListenersAttached = false;

function attachReleaseListeners(): void {
  if (releaseListenersAttached) return;
  releaseListenersAttached = true;
  const stop = () => stopSustainedNote();
  document.addEventListener('mouseup', stop);
  document.addEventListener('mouseleave', stop);
  document.addEventListener('touchend', stop, { passive: true });
  document.addEventListener('touchcancel', stop, { passive: true });
}

/** Start a sustained note; plays until stopSustainedNote is called. */
export function startSustainedNote(noteName: string): void {
  stopSustainedNote();
  attachReleaseListeners();

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const freq = noteToFrequency(noteName);
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(freq, now);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(1, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gainNode.gain.setValueAtTime(0.12, now + 0.02);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(now);
  sustainedOscillator = oscillator;
  sustainedGain = gainNode;
}

/** Stop the sustained note with a short release. */
export function stopSustainedNote(): void {
  if (!sustainedOscillator || !sustainedGain) return;

  const ctx = sustainedOscillator.context;
  const now = ctx.currentTime;
  const releaseTime = 0.05;

  sustainedGain.gain.cancelScheduledValues(now);
  sustainedGain.gain.setValueAtTime(sustainedGain.gain.value, now);
  sustainedGain.gain.linearRampToValueAtTime(0, now + releaseTime);

  sustainedOscillator.stop(now + releaseTime);
  sustainedOscillator = null;
  sustainedGain = null;
}

/** Tempo in BPM for exercise playback */
const DEFAULT_TEMPO = 72;

/** Duration codes in EasyScore: duration code -> beats (in 4/4) */
const DURATION_BEATS: Record<string, number> = {
  w: 4,   // whole
  h: 2,   // half
  q: 1,   // quarter
  8: 0.5, // eighth
  16: 0.25, // sixteenth
  32: 0.125,
};

/**
 * Parse EasyScore notes string to extract duration (in beats) for each note.
 * E.g. "C4/q, D4, E4" -> [1, 1, 1]; "C4/h, D4" -> [2, 2]
 */
function parseNoteDurations(notes: string): number[] {
  const segments = notes.split(',').map((s) => s.trim());
  const durations: number[] = [];
  let currentBeats = 1; // default quarter note

  for (const seg of segments) {
    const durationMatch = seg.match(/\/([whq]|8|16|32)$/i);
    if (durationMatch) {
      const code = durationMatch[1].toLowerCase();
      currentBeats = DURATION_BEATS[code] ?? 1;
    }
    durations.push(currentBeats);
  }
  return durations;
}

export interface PlayExerciseOptions {
  notes: string;
  noteNames: string[];
  timeSignature?: string;
  beamGroups?: number;
}

/**
 * Play an entire exercise as a sequence of trumpet notes, respecting each note's
 * duration (quarter, half, whole, eighth, etc.) in 4/4 time.
 */
export function playExercise(options: PlayExerciseOptions): void {
  const { notes, noteNames } = options;
  if (noteNames.length === 0) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const durations = parseNoteDurations(notes);
  const beatDuration = 60 / DEFAULT_TEMPO; // seconds per beat

  let t = ctx.currentTime;
  for (let i = 0; i < noteNames.length; i++) {
    const noteName = noteNames[i];
    const beats = durations[i] ?? durations[durations.length - 1] ?? 1;
    const noteDurationSec = beats * beatDuration;
    const soundDurationMs = Math.min(noteDurationSec * 1000 * 0.92, 2000);

    playTrumpetNote(noteName, soundDurationMs, t);
    t += noteDurationSec;
  }
}
