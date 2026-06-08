import type { Exercise } from '../types';
import { keys } from './keys';
import {
  CHROMATIC_ORDER,
  noteToSemitones,
  PITCH_TO_SEMITONE,
  ROOT_CHROMATIC_LABELS,
  semitoneToNoteName,
} from './pitch';
import {
  buildScaleNoteNames,
  getScaleMode,
  normalizeScaleModeId,
  usesMinorRoots,
  type ScaleCategoryId,
  type ScaleModeId,
} from './scaleModes';

/** Songs: melody excerpts for trumpet practice */
export const songs: {
  id: string;
  displayName: string;
  notes: string;
  noteNames: string[];
  totalBeats?: number;
  keySignature?: string;
  beamIndices?: number[][];
  measureBoundaries?: number[];
}[] = [
  {
    id: 'la-vie-en-rose',
    displayName: 'La Vie en Rose',
    notes:
      'D5/q., C#5/8, B4/8, A4/8, F#4/8, D5/8, C#5/q., B4/8, A4/8, F#4/8, D4/8, C#5/8, B4/q., A4/8, F#4/8, C#4/8, D4/8, C#5/8, B4/h, A4/h, E5/q., D5/8, C#5/8, B4/8, G4/8, D5/8, C#5/q., B4/8, A4/8, G4/8, E4/8, C#5/8, B4/q., A4/8, G4/8, D#4/8, E4/8, C#5/8, B4/h, A4/h, D5/q., C#5/8, B4/8, A4/8, F#4/8, D5/8, C#5/q., B4/8, A4/8, F#4/8, D4/8, C#5/8, B4/q., A4/8, F4/8, C#4/8, D4/8, D5/8, D5/w, E5/8, E5/q, D5/8, E5/8, E5/q, D5/8, E5/8, E5/q, D5/8, A4/h, E5/8, E5/q, D5/8, E5/8, E5/q, D5/8, E5/8, E5/q, D5/8, F5/q, E5/q, D5/q., C#5/8, B4/8, A4/8, F#4/8, D5/8, C#5/q., B4/8, A4/8, F#4/8, D4/8, C#5/8, B4/q., A4/8, B4/q, C#5/q, D5/w',
    noteNames: [
      'D5', 'C#5', 'B4', 'A4', 'F#4', 'D5', 'C#5', 'B4', 'A4', 'F#4', 'D4', 'C#5', 'B4', 'A4', 'F#4',
      'C#4', 'D4', 'C#5', 'B4', 'A4',
      'E5', 'D5', 'C#5', 'B4', 'G4', 'D5', 'C#5', 'B4', 'A4', 'G4', 'E4', 'C#5', 'B4', 'A4', 'G4',
      'D#4', 'E4', 'C#5', 'B4', 'A4',
      'D5', 'C#5', 'B4', 'A4', 'F#4', 'D5', 'C#5', 'B4', 'A4', 'F#4', 'D4', 'C#5', 'B4', 'A4', 'F4',
      'C#4', 'D4', 'D5', 'D5',
      'E5', 'E5', 'D5', 'E5', 'E5', 'D5', 'E5', 'E5', 'D5', 'A4', 'E5', 'E5', 'D5', 'E5', 'E5', 'D5',
      'E5', 'E5', 'D5', 'F5', 'E5',
      'D5', 'C#5', 'B4', 'A4', 'F#4', 'D5', 'C#5', 'B4', 'A4', 'F#4', 'D4', 'C#5', 'B4', 'A4', 'B4', 'C#5', 'D5',
    ],
    totalBeats: 80,
    keySignature: 'D',
    beamIndices: [
      [2, 3, 4, 5], [8, 9, 10, 11], [14, 15, 16, 17],
      [22, 23, 24, 25], [28, 29, 30, 31], [34, 35, 36, 37],
      [42, 43, 44, 45], [48, 49, 50, 51], [54, 55, 56, 57],
      [61, 62], [71, 72],
      [82, 83, 84, 85], [88, 89, 90, 91],
    ],
    measureBoundaries: [5, 11, 17, 19, 25, 31, 37, 39, 45, 51, 57, 58, 64, 68, 74, 79, 85, 91, 95, 96],
  },
];

/** Etudes: predefined short study pieces */
export const etudes: { id: string; displayName: string; notes: string; noteNames: string[]; beamGroups?: number; totalBeats?: number }[] = [
  {
    id: 'C',
    displayName: 'Etude in C',
    notes: 'C4/8, D4, E4, C4, D4, E4, F4, D4, E4, F4, G4, E4, F4, G4, A4, F4, G4, A4, B4, G4, A4, B4, C5, A4, C5, B4, A4, C5, B4, A4, G4, B4, A4, G4, F4, A4, G4, F4, E4, G4, F4, E4, D4, F4, E4, D4, C4, C4',
    noteNames: ['C4', 'D4', 'E4', 'C4', 'D4', 'E4', 'F4', 'D4', 'E4', 'F4', 'G4', 'E4', 'F4', 'G4', 'A4', 'F4', 'G4', 'A4', 'B4', 'G4', 'A4', 'B4', 'C5', 'A4', 'C5', 'B4', 'A4', 'C5', 'B4', 'A4', 'G4', 'B4', 'A4', 'G4', 'F4', 'A4', 'G4', 'F4', 'E4', 'G4', 'F4', 'E4', 'D4', 'F4', 'E4', 'D4', 'C4', 'C4'],
    beamGroups: 4,
    totalBeats: 24,
  },
];

/** Chromatic scale exercises: start note to end note (ascending) */
export const chromaticExercises: { id: string; displayName: string; start: string; end: string }[] = [
  { id: 'C4-C5', displayName: 'C4 to C5', start: 'C4', end: 'C5' },
  { id: 'G4-F5', displayName: 'G4 to F5', start: 'G4', end: 'F5' },
];

export { noteToSemitones } from './pitch';

function getChromaticNotes(start: string, end: string): string[] {
  let semitones = noteToSemitones(start);
  const endSemitones = noteToSemitones(end);
  const notes: string[] = [];
  while (semitones <= endSemitones) {
    const oct = Math.floor(semitones / 12);
    const idx = semitones % 12;
    notes.push(CHROMATIC_ORDER[idx] + oct);
    semitones++;
  }
  return notes;
}

// Scale notes per key: [tonic, 2nd, 3rd, 4th, 5th, 6th, 7th, octave] in octave 4 range
const scaleNotesByKey: Record<string, string[]> = {
  C: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  G: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'],
  D: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'],
  A: ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5'],
  E: ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5'],
  B: ['B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'B4'],
  'F#': ['F#4', 'G#4', 'A#4', 'B4', 'C#5', 'D#5', 'E#5', 'F#5'],
  F: ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'],
  Bb: ['Bb4', 'C5', 'D5', 'Eb5', 'F5', 'G5', 'A5', 'Bb5'],
  Eb: ['Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5', 'D5', 'Eb5'],
  Ab: ['Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'G5', 'Ab5'],
  Db: ['Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'C5', 'Db5'],
  Gb: ['Gb4', 'Ab4', 'Bb4', 'Cb5', 'Db5', 'Eb5', 'F5', 'Gb5'],
};

// Natural minor scale notes (keyed by scale key id like Am, Em, etc.)
const minorScaleNotesByKey: Record<string, string[]> = {
  Am: ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'],
  Em: ['E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'],
  Bm: ['B3', 'C#4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4'],
  'F#m': ['F#4', 'G#4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5'],
  'C#m': ['C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5'],
  'G#m': ['G#4', 'A#4', 'B4', 'C#5', 'D#5', 'E5', 'F#5', 'G#5'],
  'D#m': ['D#4', 'E#4', 'F#4', 'G#4', 'A#4', 'B4', 'C#5', 'D#5'],
  Dm: ['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5', 'D5'],
  Gm: ['G4', 'A4', 'Bb4', 'C5', 'D5', 'Eb5', 'F5', 'G5'],
  Cm: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'],
  Fm: ['F4', 'G4', 'Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5'],
  Bbm: ['Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'Gb5', 'Ab5', 'Bb5'],
  Ebm: ['Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'Cb5', 'Db5', 'Eb5'],
};

/** Scale options for scales category: major and minor keys */
export const scaleKeys: { id: string; displayName: string; scaleType: 'major' | 'minor' }[] = [
  { id: 'C', displayName: 'C Major', scaleType: 'major' },
  { id: 'Am', displayName: 'A Minor', scaleType: 'minor' },
  { id: 'G', displayName: 'G Major', scaleType: 'major' },
  { id: 'Em', displayName: 'E Minor', scaleType: 'minor' },
  { id: 'D', displayName: 'D Major', scaleType: 'major' },
  { id: 'Bm', displayName: 'B Minor', scaleType: 'minor' },
  { id: 'A', displayName: 'A Major', scaleType: 'major' },
  { id: 'F#m', displayName: 'F# Minor', scaleType: 'minor' },
  { id: 'E', displayName: 'E Major', scaleType: 'major' },
  { id: 'C#m', displayName: 'C# Minor', scaleType: 'minor' },
  { id: 'B', displayName: 'B Major', scaleType: 'major' },
  { id: 'G#m', displayName: 'G# Minor', scaleType: 'minor' },
  { id: 'F#', displayName: 'F# Major', scaleType: 'major' },
  { id: 'D#m', displayName: 'D# Minor', scaleType: 'minor' },
  { id: 'F', displayName: 'F Major', scaleType: 'major' },
  { id: 'Dm', displayName: 'D Minor', scaleType: 'minor' },
  { id: 'Bb', displayName: 'Bb Major', scaleType: 'major' },
  { id: 'Gm', displayName: 'G Minor', scaleType: 'minor' },
  { id: 'Eb', displayName: 'Eb Major', scaleType: 'major' },
  { id: 'Cm', displayName: 'C Minor', scaleType: 'minor' },
  { id: 'Ab', displayName: 'Ab Major', scaleType: 'major' },
  { id: 'Fm', displayName: 'F Minor', scaleType: 'minor' },
  { id: 'Db', displayName: 'Db Major', scaleType: 'major' },
  { id: 'Bbm', displayName: 'Bb Minor', scaleType: 'minor' },
  { id: 'Gb', displayName: 'Gb Major', scaleType: 'major' },
  { id: 'Ebm', displayName: 'Eb Minor', scaleType: 'minor' },
];

function applyChromaticDisplayRoots(
  options: { root: string; keyId: string }[]
): { root: string; displayRoot: string; keyId: string }[] {
  const countBySemitone = new Map<number, number>();
  for (const o of options) {
    const semi = PITCH_TO_SEMITONE[o.root] ?? 0;
    countBySemitone.set(semi, (countBySemitone.get(semi) ?? 0) + 1);
  }

  return options.map((o) => {
    const semi = PITCH_TO_SEMITONE[o.root] ?? 0;
    const chromaticLabel = ROOT_CHROMATIC_LABELS[semi];
    const useChromaticLabel = (countBySemitone.get(semi) ?? 0) === 1;
    return {
      ...o,
      displayRoot: useChromaticLabel ? chromaticLabel : o.root,
    };
  });
}

export function getScaleRootOptions(
  categoryId: ScaleCategoryId
): { root: string; displayRoot: string; keyId: string }[] {
  const options = usesMinorRoots(categoryId)
    ? scaleKeys
        .filter((k) => k.scaleType === 'minor')
        .map((k) => ({
          root: k.id.replace(/m$/, ''),
          keyId: k.id,
        }))
    : keys.map((k) => ({
        root: k.id,
        keyId: k.id,
      }));

  options.sort((a, b) => {
    const diff = (PITCH_TO_SEMITONE[a.root] ?? 0) - (PITCH_TO_SEMITONE[b.root] ?? 0);
    return diff !== 0 ? diff : a.root.localeCompare(b.root);
  });

  return applyChromaticDisplayRoots(options);
}

export function getDisplayRootForKeyId(keyId: string, categoryId: ScaleCategoryId): string {
  const option = getScaleRootOptions(categoryId).find((o) => o.keyId === keyId);
  return option?.displayRoot ?? keyId;
}

// Arpeggio: tonic, 3rd, 5th, octave, 5th, 3rd, tonic
function getArpeggioNotes(keyId: string): string[] {
  const scale = scaleNotesByKey[keyId];
  if (!scale) return [];
  const [tonic, , third, , fifth, , , octave] = scale;
  return [tonic, third, fifth, octave, fifth, third, tonic];
}

function scaleNoteNamesToScore(ascending: string[]): string {
  if (ascending.length === 0) return '';
  const asc = `${ascending[0]}/q, ${ascending.slice(1).join(', ')}`;
  const desc = ascending.slice(0, -1).reverse().join(', ');
  return `${asc}, ${desc}`;
}

function noteNamesToQuarterScore(noteNames: string[]): string {
  if (noteNames.length === 0) return '';
  return `${noteNames[0]}/q, ${noteNames.slice(1).join(', ')}`;
}

function noteNamesToScore(
  noteNames: string[],
  halfNoteIndices: number[] = []
): string {
  if (noteNames.length === 0) return '';
  const halfSet = new Set(halfNoteIndices);
  const format = (note: string, i: number): string => (halfSet.has(i) ? `${note}/h` : note);
  const first = halfSet.has(0) ? format(noteNames[0], 0) : `${noteNames[0]}/q`;
  return `${first}, ${noteNames.slice(1).map((note, j) => format(note, j + 1)).join(', ')}`;
}

function scoreTotalBeats(noteNames: string[], halfNoteIndices: number[] = []): number {
  const halfSet = new Set(halfNoteIndices);
  return noteNames.reduce((sum, _, i) => sum + (halfSet.has(i) ? 2 : 1), 0);
}

function arpeggioUpDown(up: string[]): string[] {
  return [...up, ...up.slice(0, -1).reverse()];
}

/** Ascending scale notes within one octave (tonic through octave). */
export function getAscendingScaleNotes(keyId: string, scaleModeId?: ScaleModeId): string[] {
  const modeId = normalizeScaleModeId(scaleModeId, keyId);
  const mode = getScaleMode(modeId);

  if (mode?.useLegacyTables) {
    const scaleType = modeId === 'natural-minor' ? 'minor' : 'major';
    const scale =
      scaleType === 'minor'
        ? minorScaleNotesByKey[keyId] ?? []
        : scaleNotesByKey[keyId] ?? [];
    return [...scale];
  }

  if (mode?.intervals) {
    return buildScaleNoteNames(keyId, mode.intervals, mode.category);
  }

  return [];
}

export interface ScalePattern {
  id: string;
  label: string;
  notes: string;
  noteNames: string[];
  totalBeats: number;
}

function getNinthNote(ascending: string[]): string | null {
  if (ascending.length < 2) return null;
  return semitoneToNoteName(noteToSemitones(ascending[1]) + 12);
}

function notesAtIndices(ascending: string[], indices: number[]): string[] {
  return indices.map((i) => ascending[i]).filter(Boolean);
}

/** 1–3–2–4–3–5 … ascending through the octave (and 9th on the last pair). */
function brokenThirdsUp(ascending: string[], ninth: string | null): string[] {
  if (ascending.length < 3) return [];

  const notes: string[] = [];
  for (let i = 0; i <= ascending.length - 2; i++) {
    notes.push(ascending[i]);
    if (i + 2 < ascending.length) {
      notes.push(ascending[i + 2]);
    } else if (i === ascending.length - 2 && ninth) {
      notes.push(ninth);
    } else {
      const step = noteToSemitones(ascending[1]) - noteToSemitones(ascending[0]);
      notes.push(semitoneToNoteName(noteToSemitones(ascending[i]) + step * 2));
    }
  }
  notes.push(ascending[ascending.length - 1]);
  return notes;
}

export function getScalePatterns(keyId: string, scaleModeId?: ScaleModeId): ScalePattern[] {
  const ascending = getAscendingScaleNotes(keyId, scaleModeId);
  if (ascending.length === 0) return [];

  const patterns: ScalePattern[] = [];
  const ninth = getNinthNote(ascending);

  if (ascending.length >= 3) {
    const up = brokenThirdsUp(ascending, ninth);
    const noteNames = arpeggioUpDown(up);
    const peakIndex = up.length - 1;
    patterns.push({
      id: 'broken-thirds',
      label: 'Broken Thirds',
      notes: noteNamesToScore(noteNames, [peakIndex]),
      noteNames,
      totalBeats: scoreTotalBeats(noteNames, [peakIndex]),
    });
  }

  if (ascending.length >= 5) {
    const up = notesAtIndices(ascending, [0, 2, 4]);
    const noteNames = arpeggioUpDown(up);
    patterns.push({
      id: 'triad',
      label: 'Triad (Root – 3rd – 5th)',
      notes: noteNamesToQuarterScore(noteNames),
      noteNames,
      totalBeats: noteNames.length,
    });
  }

  if (ascending.length >= 7) {
    const up7 = notesAtIndices(ascending, [0, 2, 4, 6]);
    const noteNames7 = arpeggioUpDown(up7);
    patterns.push({
      id: 'seventh',
      label: '7th Chord',
      notes: noteNamesToQuarterScore(noteNames7),
      noteNames: noteNames7,
      totalBeats: noteNames7.length,
    });
  }

  if (ascending.length >= 7 && ninth) {
    const up9 = [...notesAtIndices(ascending, [0, 2, 4, 6]), ninth];
    const noteNames9 = arpeggioUpDown(up9);
    patterns.push({
      id: 'ninth',
      label: '9th Chord',
      notes: noteNamesToQuarterScore(noteNames9),
      noteNames: noteNames9,
      totalBeats: noteNames9.length,
    });

    const ninthUpScaleDown = [...up9, ...[...ascending].reverse()];
    patterns.push({
      id: 'ninth-up-scale-down',
      label: '9th Chord ↑ / Scale ↓',
      notes: noteNamesToQuarterScore(ninthUpScaleDown),
      noteNames: ninthUpScaleDown,
      totalBeats: ninthUpScaleDown.length,
    });

    const ninthDown = [ninth, ascending[6], ascending[4], ascending[2], ascending[0]];
    const scaleUpNinthDown = [...ascending, ...ninthDown];
    patterns.push({
      id: 'scale-up-ninth-down',
      label: 'Scale ↑ / 9th Chord ↓',
      notes: noteNamesToQuarterScore(scaleUpNinthDown),
      noteNames: scaleUpNinthDown,
      totalBeats: scaleUpNinthDown.length,
    });
  }

  return patterns;
}

/** Build scale notes within a single octave (tonic through octave). */
function getHeldNotesInKey(keyId: string, scaleType?: 'major' | 'minor'): string[] {
  const scale =
    scaleType === 'minor' ? minorScaleNotesByKey[keyId] : scaleNotesByKey[keyId];
  if (!scale) return [];
  return [...scale];
}

function getHeldNote(keyId: string, scaleType?: 'major' | 'minor'): string {
  const notes = getHeldNotesInKey(keyId, scaleType);
  if (notes.length === 0) return 'C4/h';
  return `${notes[0]}/h, ${notes.slice(1).join(', ')}`;
}

export function getExercise(
  categoryId: string,
  keyId: string,
  scaleModeId?: ScaleModeId
): Exercise {
  const key = keys.find((k) => k.id === keyId);
  const keyName = key?.displayName ?? keyId;

  const id = `${categoryId}-${keyId}`;

  if (categoryId === 'held-notes') {
    const heldKey = scaleKeys.find((k) => k.id === keyId);
    const scaleType = heldKey?.scaleType ?? 'major';
    const noteNames = getHeldNotesInKey(keyId, scaleType);
    const totalBeats = noteNames.length * 2; // half notes = 2 beats each
    const displayName = heldKey?.displayName ?? keyName;
    return {
      id,
      categoryId,
      keyId,
      title: `Held Notes in ${displayName}`,
      notes: getHeldNote(keyId, scaleType),
      noteNames,
      timeSignature: '4/4',
      totalBeats,
    };
  }

  if (categoryId === 'scales') {
    const modeId = normalizeScaleModeId(scaleModeId, keyId);
    const mode = getScaleMode(modeId);
    const ascending = getAscendingScaleNotes(keyId, scaleModeId);

    if (ascending.length > 0) {
      const noteNames = [...ascending, ...ascending.slice(0, -1).reverse()];
      const totalBeats = noteNames.length;

      if (mode?.useLegacyTables) {
        const scaleKey = scaleKeys.find((k) => k.id === keyId);
        const displayName = scaleKey?.displayName ?? keyName;
        return {
          id: `${categoryId}-${modeId}-${keyId}`,
          categoryId,
          keyId,
          title: `${displayName} Scale`,
          notes: scaleNoteNamesToScore(ascending),
          noteNames,
          timeSignature: '4/4',
          totalBeats,
        };
      }

      if (mode?.intervals) {
        const displayRoot = getDisplayRootForKeyId(keyId, mode.category);
        return {
          id: `${categoryId}-${modeId}-${keyId}`,
          categoryId,
          keyId,
          title: `${displayRoot} ${mode.name} Scale`,
          notes: scaleNoteNamesToScore(ascending),
          noteNames,
          timeSignature: '4/4',
          totalBeats,
        };
      }
    }
  }

  if (categoryId === 'arpeggios') {
    const noteNames = getArpeggioNotes(keyId);
    const notes = `${noteNames[0]}/q, ${noteNames.slice(1).join(', ')}`;
    const totalBeats = noteNames.length; // quarter notes = 1 beat each
    return {
      id,
      categoryId,
      keyId,
      title: `${keyName} Arpeggio`,
      notes,
      noteNames,
      timeSignature: '4/4',
      totalBeats,
    };
  }

  if (categoryId === 'etudes') {
    const etude = etudes.find((e) => e.id === keyId);
    if (!etude) {
      return {
        id,
        categoryId,
        keyId,
        title: 'Etude',
        notes: 'C4/q',
        noteNames: ['C4'],
        timeSignature: '4/4',
      };
    }
    return {
      id,
      categoryId,
      keyId,
      title: etude.displayName,
      notes: etude.notes,
      noteNames: etude.noteNames,
      timeSignature: '4/4',
      totalBeats: etude.totalBeats ?? etude.noteNames.length,
      beamGroups: etude.beamGroups,
    };
  }

  if (categoryId === 'songs') {
    const song = songs.find((s) => s.id === keyId);
    if (!song) {
      return {
        id,
        categoryId,
        keyId,
        title: 'Song',
        notes: 'C4/q',
        noteNames: ['C4'],
        timeSignature: '4/4',
      };
    }
    return {
      id,
      categoryId,
      keyId,
      title: song.displayName,
      notes: song.notes,
      noteNames: song.noteNames,
      timeSignature: '4/4',
      totalBeats: song.totalBeats ?? song.noteNames.length,
      keySignature: song.keySignature,
      beamIndices: song.beamIndices,
      measureBoundaries: song.measureBoundaries,
    };
  }

  if (categoryId === 'chromatic-scales') {
    const chrom = chromaticExercises.find((e) => e.id === keyId);
    if (!chrom) {
      return {
        id,
        categoryId,
        keyId,
        title: 'Chromatic Scale',
        notes: 'C4/q',
        noteNames: ['C4'],
        timeSignature: '4/4',
      };
    }
    const noteNames = getChromaticNotes(chrom.start, chrom.end);
    const notes = `${noteNames[0]}/q, ${noteNames.slice(1).join(', ')}`;
    const totalBeats = noteNames.length;
    return {
      id,
      categoryId,
      keyId,
      title: `Chromatic ${chrom.displayName}`,
      notes,
      noteNames,
      timeSignature: '4/4',
      totalBeats,
    };
  }

  return {
    id,
    categoryId,
    keyId,
    title: 'Exercise',
    notes: 'C4/q',
    noteNames: ['C4'],
    timeSignature: '4/4',
  };
}

/** Get items for a category (for Custom exercise multi-select). */
export function getItemsForCategory(categoryId: string): { id: string; displayName: string }[] {
  switch (categoryId) {
    case 'chromatic-scales':
      return chromaticExercises.map((e) => ({ id: e.id, displayName: e.displayName }));
    case 'etudes':
      return etudes.map((e) => ({ id: e.id, displayName: e.displayName }));
    case 'songs':
      return songs.map((s) => ({ id: s.id, displayName: s.displayName }));
    case 'scales':
    case 'held-notes':
      return scaleKeys.map((k) => ({ id: k.id, displayName: k.displayName }));
    case 'arpeggios':
      return keys.map((k) => ({ id: k.id, displayName: k.displayName }));
    default:
      return [];
  }
}

/** Ensure first note of a notes string has explicit duration. */
function ensureFirstNoteDuration(notes: string, durationCode: string): string {
  const match = notes.match(/^([A-G][#b]?-?\d+)(\/([whq]|8|16|32))?/i);
  if (!match) return notes;
  if (match[2]) return notes; // already has duration
  return notes.replace(/^([A-G][#b]?-?\d+)/, `$1/${durationCode}`);
}

/** Duration code for first note of each subsequent exercise by category. */
function getDurationCodeForCategory(categoryId: string): string {
  if (categoryId === 'held-notes') return 'h';
  if (categoryId === 'etudes') return '8';
  if (categoryId === 'songs') return 'q';
  return 'q'; // scales, arpeggios, chromatic-scales
}

/** Combine multiple exercises into one. */
export function combineExercises(categoryId: string, keyIds: string[]): Exercise {
  if (keyIds.length === 0) {
    return {
      id: `custom-${categoryId}-empty`,
      categoryId,
      keyId: 'custom',
      title: 'Custom Exercise',
      notes: 'C4/q',
      noteNames: ['C4'],
      timeSignature: '4/4',
    };
  }

  const exercises = keyIds.map((keyId) => getExercise(categoryId, keyId));
  const durationCode = getDurationCodeForCategory(categoryId);
  const allNoteNames: string[] = [];
  const notesParts: string[] = [];

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    allNoteNames.push(...ex.noteNames);
    const notesStr =
      i === 0 ? ex.notes : ensureFirstNoteDuration(ex.notes, durationCode);
    notesParts.push(notesStr);
  }

  const combinedNotes = notesParts.join(', ');
  const displayNames = exercises.map((e) => e.title);
  const title = `Custom: ${displayNames.join(', ')}`;

  const totalBeats = exercises.reduce((sum, e) => sum + (e.totalBeats ?? e.noteNames.length), 0);
  const beamGroups = categoryId === 'etudes' ? exercises[0]?.beamGroups : undefined;

  return {
    id: `custom-${categoryId}-${keyIds.join('-')}`,
    categoryId,
    keyId: 'custom',
    title,
    notes: combinedNotes,
    noteNames: allNoteNames,
    timeSignature: '4/4',
    totalBeats,
    beamGroups,
  };
}
