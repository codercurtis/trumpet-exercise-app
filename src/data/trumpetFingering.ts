/**
 * Bb trumpet fingering chart (written pitch).
 * Keys: note name (e.g. "C4", "Bb4", "F#5")
 * Values: valve combination - "Open" or "1", "2", "3", "1-2", "1-3", "2-3", "1-2-3"
 */
export const trumpetFingering: Record<string, string> = {
  'F#3': '1-2-3',
  G3: '1-2',
  'G#3': '2',
  Ab3: '2',
  A3: '1',
  'A#3': 'Open',
  Bb3: 'Open',
  B3: '1-2',
  C4: 'Open',
  'C#4': '1-2-3',
  Db4: '1-2-3',
  D4: '1-3',
  'D#4': '2-3',
  Eb4: '2-3',
  E4: '1-2',
  F4: '1',
  'F#4': '2',
  G4: 'Open',
  'G#4': '2-3',
  Ab4: '2-3',
  A4: '1-2',
  'A#4': '1',
  Bb4: '1',
  B4: '2',
  C5: 'Open',
  'C#5': '1-2',
  Db5: '1-2',
  D5: '1',
  'D#5': '2',
  Eb5: '2',
  E5: 'Open',
  F5: '1',
  'F#5': '2',
  G5: 'Open',
  'Gb4': '2',
  'Gb5': '2',
  'G#5': '1-2',
  Ab5: '1-2',
  A5: '1',
  'A#5': '2',
  Bb5: '2',
  B5: 'Open',
  C6: '1-2',
  'Cb5': '2',
  'E#5': '1',
};

export function getFingering(noteName: string): string {
  return trumpetFingering[noteName] ?? '—';
}
