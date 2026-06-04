/** Chromatic pitch order (ascending, using sharps). */
export const CHROMATIC_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const PITCH_TO_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

/** Chromatic root labels for scale picker (flats). */
export const ROOT_CHROMATIC_LABELS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function noteToSemitones(note: string): number {
  const match = note.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return 48; // C4
  const pitchIdx = PITCH_TO_SEMITONE[match[1]] ?? 0;
  const octave = parseInt(match[2], 10);
  return octave * 12 + pitchIdx;
}

export function semitoneToNoteName(semitones: number): string {
  const oct = Math.floor(semitones / 12);
  const idx = ((semitones % 12) + 12) % 12;
  return CHROMATIC_ORDER[idx] + oct;
}
