import type { Exercise } from '../types';
import { keys } from './keys';

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

/** Chromatic pitch order (ascending, using sharps) */
const CHROMATIC_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PITCH_TO_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

function noteToSemitones(note: string): number {
  const match = note.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return 48; // C4
  const pitchIdx = PITCH_TO_SEMITONE[match[1]] ?? 0;
  const octave = parseInt(match[2], 10);
  return octave * 12 + pitchIdx;
}

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

// Arpeggio: tonic, 3rd, 5th, octave, 5th, 3rd, tonic
function getArpeggioNotes(keyId: string): string[] {
  const scale = scaleNotesByKey[keyId];
  if (!scale) return [];
  const [tonic, , third, , fifth, , , octave] = scale;
  return [tonic, third, fifth, octave, fifth, third, tonic];
}

function getScaleNotes(keyId: string, scaleType: 'major' | 'minor'): string {
  const scale =
    scaleType === 'minor' ? minorScaleNotesByKey[keyId] : scaleNotesByKey[keyId];
  if (!scale) return '';
  const asc = `${scale[0]}/q, ${scale.slice(1).join(', ')}`;
  const desc = scale.slice(0, -1).reverse().join(', ');
  return `${asc}, ${desc}`;
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

export function getExercise(categoryId: string, keyId: string): Exercise {
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
    const scaleKey = scaleKeys.find((k) => k.id === keyId);
    const scaleType = scaleKey?.scaleType ?? 'major';
    const scale =
      scaleType === 'minor'
        ? minorScaleNotesByKey[keyId] ?? []
        : scaleNotesByKey[keyId] ?? [];
    const noteNames = [...scale, ...scale.slice(0, -1).reverse()];
    const totalBeats = noteNames.length; // quarter notes = 1 beat each
    const displayName = scaleKey?.displayName ?? keyName;
    return {
      id,
      categoryId,
      keyId,
      title: `${displayName} Scale`,
      notes: getScaleNotes(keyId, scaleType),
      noteNames,
      timeSignature: '4/4',
      totalBeats,
    };
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
