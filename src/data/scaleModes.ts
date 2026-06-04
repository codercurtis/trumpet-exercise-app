import { noteToSemitones, semitoneToNoteName } from './pitch';

export type ScaleCategoryId =
  | 'major'
  | 'dominant-7th'
  | 'dominant-7th-sus4'
  | 'minor'
  | 'half-diminished'
  | 'diminished';

export type ScaleModeId =
  | 'major'
  | 'pentatonic-major'
  | 'lydian'
  | 'bebop-major'
  | 'harmonic-major'
  | 'lydian-augmented'
  | 'augmented'
  | 'harmonic-major-6th'
  | 'blues-major'
  | 'dominant-7th'
  | 'pentatonic-dominant'
  | 'bebop-dominant'
  | 'spanish-jewish'
  | 'lydian-dominant'
  | 'hindu'
  | 'whole-tone'
  | 'diminished-dom7'
  | 'diminished-whole-tone'
  | 'blues-dominant'
  | 'dominant-7th-sus4'
  | 'pentatonic-sus4'
  | 'bebop-sus4'
  | 'natural-minor'
  | 'dorian'
  | 'pentatonic-minor'
  | 'bebop-minor'
  | 'melodic-minor'
  | 'bebop-minor-sharp2'
  | 'blues-minor'
  | 'harmonic-minor'
  | 'diminished-minor'
  | 'phrygian'
  | 'locrian'
  | 'locrian-sharp2'
  | 'bebop-half-dim'
  | 'diminished-wh';

export interface ScaleMode {
  id: ScaleModeId;
  name: string;
  category: ScaleCategoryId;
  intervals?: number[];
  useLegacyTables?: boolean;
}

export const SCALE_CATEGORIES: { id: ScaleCategoryId; name: string }[] = [
  { id: 'major', name: 'Major' },
  { id: 'dominant-7th', name: 'Dominant 7th' },
  { id: 'dominant-7th-sus4', name: 'Dominant 7th suspended 4th' },
  { id: 'minor', name: 'Minor' },
  { id: 'half-diminished', name: 'Half Diminished' },
  { id: 'diminished', name: 'Diminished' },
];

/** Tonic (octave 4) per major key id — matches scaleNotesByKey[0] in exercises.ts */
export const MAJOR_TONIC_BY_KEY: Record<string, string> = {
  C: 'C4',
  G: 'G4',
  D: 'D4',
  A: 'A4',
  E: 'E4',
  B: 'B3',
  'F#': 'F#4',
  F: 'F4',
  Bb: 'Bb4',
  Eb: 'Eb4',
  Ab: 'Ab4',
  Db: 'Db4',
  Gb: 'Gb4',
};

/** Tonic per minor key id — matches minorScaleNotesByKey[0] in exercises.ts */
export const MINOR_TONIC_BY_KEY: Record<string, string> = {
  Am: 'A4',
  Em: 'E4',
  Bm: 'B3',
  'F#m': 'F#4',
  'C#m': 'C#4',
  'G#m': 'G#4',
  'D#m': 'D#4',
  Dm: 'D4',
  Gm: 'G4',
  Cm: 'C4',
  Fm: 'F4',
  Bbm: 'Bb4',
  Ebm: 'Eb4',
};

export const SCALE_MODES: ScaleMode[] = [
  // Major
  { id: 'major', name: 'Major', category: 'major', useLegacyTables: true },
  { id: 'pentatonic-major', name: 'Major Pentatonic', category: 'major', intervals: [2, 2, 3, 2, 3] },
  { id: 'lydian', name: 'Lydian', category: 'major', intervals: [2, 2, 2, 1, 2, 2, 1] },
  { id: 'bebop-major', name: 'Bebop Major', category: 'major', intervals: [2, 2, 1, 2, 1, 1, 2, 1] },
  { id: 'harmonic-major', name: 'Harmonic Major', category: 'major', intervals: [2, 2, 1, 2, 1, 3, 1] },
  { id: 'lydian-augmented', name: 'Lydian Augmented', category: 'major', intervals: [2, 2, 2, 2, 1, 2, 1] },
  { id: 'augmented', name: 'Augmented', category: 'major', intervals: [3, 1, 3, 1, 3, 1] },
  {
    id: 'harmonic-major-6th',
    name: '6th Mode of Harmonic Major',
    category: 'major',
    intervals: [3, 1, 2, 1, 2, 2, 1],
  },
  { id: 'blues-major', name: 'Blues', category: 'major', intervals: [3, 2, 1, 1, 3, 2] },
  // Dominant 7th
  { id: 'dominant-7th', name: 'Dominant 7th', category: 'dominant-7th', intervals: [2, 2, 1, 2, 2, 1, 2] },
  {
    id: 'pentatonic-dominant',
    name: 'Major Pentatonic',
    category: 'dominant-7th',
    intervals: [2, 2, 3, 2, 3],
  },
  { id: 'bebop-dominant', name: 'Bebop', category: 'dominant-7th', intervals: [2, 2, 1, 2, 2, 1, 1, 1] },
  { id: 'spanish-jewish', name: 'Spanish/Jewish', category: 'dominant-7th', intervals: [1, 3, 1, 2, 1, 2, 2] },
  { id: 'lydian-dominant', name: 'Lydian Dominant', category: 'dominant-7th', intervals: [2, 2, 2, 1, 2, 1, 2] },
  { id: 'hindu', name: 'Hindu', category: 'dominant-7th', intervals: [2, 2, 1, 2, 1, 2, 2] },
  { id: 'whole-tone', name: 'Whole Tone', category: 'dominant-7th', intervals: [2, 2, 2, 2, 2, 2] },
  { id: 'diminished-dom7', name: 'Diminished', category: 'dominant-7th', intervals: [1, 2, 1, 2, 1, 2, 1, 2] },
  {
    id: 'diminished-whole-tone',
    name: 'Diminished Whole Tone',
    category: 'dominant-7th',
    intervals: [1, 2, 1, 2, 2, 2, 2],
  },
  { id: 'blues-dominant', name: 'Blues', category: 'dominant-7th', intervals: [3, 2, 1, 1, 3, 2] },
  // Dominant 7th suspended 4th
  { id: 'dominant-7th-sus4', name: 'Dom 7th', category: 'dominant-7th-sus4', intervals: [2, 2, 1, 2, 2, 1, 2] },
  { id: 'pentatonic-sus4', name: 'Major Pentatonic', category: 'dominant-7th-sus4', intervals: [2, 2, 3, 2, 3] },
  { id: 'bebop-sus4', name: 'Bebop', category: 'dominant-7th-sus4', intervals: [2, 2, 1, 2, 2, 1, 1, 1] },
  // Minor
  { id: 'natural-minor', name: 'Natural Minor', category: 'minor', useLegacyTables: true },
  { id: 'dorian', name: 'Minor (Dorian)', category: 'minor', intervals: [2, 1, 2, 2, 2, 1, 2] },
  { id: 'pentatonic-minor', name: 'Pentatonic', category: 'minor', intervals: [3, 2, 2, 3, 2] },
  { id: 'bebop-minor', name: 'Bebop', category: 'minor', intervals: [2, 1, 1, 1, 2, 2, 1, 2] },
  { id: 'melodic-minor', name: 'Melodic Minor', category: 'minor', intervals: [2, 1, 2, 2, 2, 2, 1] },
  { id: 'bebop-minor-sharp2', name: 'Bebop minor #2', category: 'minor', intervals: [2, 1, 2, 2, 1, 1, 2, 1] },
  { id: 'blues-minor', name: 'Blues', category: 'minor', intervals: [3, 2, 1, 1, 3, 2] },
  { id: 'harmonic-minor', name: 'Harmonic Minor', category: 'minor', intervals: [2, 1, 2, 2, 1, 3, 1] },
  { id: 'diminished-minor', name: 'Diminished', category: 'minor', intervals: [2, 1, 2, 1, 2, 1, 2, 1] },
  { id: 'phrygian', name: 'Phrygian', category: 'minor', intervals: [1, 2, 2, 2, 1, 2, 2] },
  // Half Diminished
  { id: 'locrian', name: 'Locrian', category: 'half-diminished', intervals: [1, 2, 2, 1, 2, 2, 2] },
  { id: 'locrian-sharp2', name: 'Locrian #2', category: 'half-diminished', intervals: [2, 1, 2, 1, 2, 2, 2] },
  { id: 'bebop-half-dim', name: 'Bebop', category: 'half-diminished', intervals: [1, 2, 2, 1, 1, 1, 2, 2] },
  // Diminished
  { id: 'diminished-wh', name: 'Diminished', category: 'diminished', intervals: [2, 1, 2, 1, 2, 1, 2, 1] },
];

export function getScaleMode(id: ScaleModeId): ScaleMode | undefined {
  return SCALE_MODES.find((m) => m.id === id);
}

export function getScaleCategoryForMode(modeId: ScaleModeId): ScaleCategoryId | undefined {
  return getScaleMode(modeId)?.category;
}

export function getScaleModeOptions(
  categoryId: ScaleCategoryId
): { id: ScaleModeId; name: string }[] {
  return SCALE_MODES.filter((m) => m.category === categoryId).map((m) => ({
    id: m.id,
    name: m.name,
  }));
}

export function usesMinorRoots(categoryId: ScaleCategoryId): boolean {
  return categoryId === 'minor';
}

/** Build ascending scale pitch names from root key and interval pattern (semitones). */
export function buildScaleNoteNames(
  rootKeyId: string,
  intervals: number[],
  categoryId: ScaleCategoryId
): string[] {
  const tonic = usesMinorRoots(categoryId)
    ? MINOR_TONIC_BY_KEY[rootKeyId]
    : MAJOR_TONIC_BY_KEY[rootKeyId];
  if (!tonic || intervals.length === 0) return [];

  let semitones = noteToSemitones(tonic);
  const notes = [semitoneToNoteName(semitones)];
  for (const interval of intervals) {
    semitones += interval;
    notes.push(semitoneToNoteName(semitones));
  }
  return notes;
}

/** Map legacy mode ids for backward compatibility. */
export function normalizeScaleModeId(modeId: string | undefined, keyId: string): ScaleModeId {
  if (modeId === 'minor') return 'natural-minor';
  if (modeId === 'blues') return 'blues-major';
  if (modeId) return modeId as ScaleModeId;
  if (keyId.endsWith('m') && MINOR_TONIC_BY_KEY[keyId]) return 'natural-minor';
  return 'major';
}
