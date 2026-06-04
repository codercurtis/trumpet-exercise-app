import type { ScaleModeId } from './scaleModes';

export type LearnScaleType = 'major' | 'dominant-7th' | 'minor';

export interface LearnScaleItem {
  id: string;
  type: LearnScaleType;
  displayName: string;
  keyId: string;
  scaleModeId: ScaleModeId;
}

export interface LearnScaleSection {
  type: LearnScaleType;
  title: string;
  items: LearnScaleItem[];
}

const LEARN_ROOTS: { displayName: string; majorKeyId: string; minorKeyId: string }[] = [
  { displayName: 'C', majorKeyId: 'C', minorKeyId: 'Cm' },
  { displayName: 'F', majorKeyId: 'F', minorKeyId: 'Fm' },
  { displayName: 'Bb', majorKeyId: 'Bb', minorKeyId: 'Bbm' },
  { displayName: 'Eb', majorKeyId: 'Eb', minorKeyId: 'Ebm' },
  { displayName: 'Ab', majorKeyId: 'Ab', minorKeyId: 'G#m' },
  { displayName: 'Db (C#)', majorKeyId: 'Db', minorKeyId: 'C#m' },
  { displayName: 'Gb (F#)', majorKeyId: 'Gb', minorKeyId: 'F#m' },
  { displayName: 'B', majorKeyId: 'B', minorKeyId: 'Bm' },
  { displayName: 'E', majorKeyId: 'E', minorKeyId: 'Em' },
  { displayName: 'A', majorKeyId: 'A', minorKeyId: 'Am' },
  { displayName: 'D', majorKeyId: 'D', minorKeyId: 'Dm' },
  { displayName: 'G', majorKeyId: 'G', minorKeyId: 'Gm' },
];

function buildSection(
  type: LearnScaleType,
  title: string,
  scaleModeId: ScaleModeId,
  keySelector: (root: (typeof LEARN_ROOTS)[number]) => string
): LearnScaleSection {
  return {
    type,
    title,
    items: LEARN_ROOTS.map((root) => {
      const keyId = keySelector(root);
      return {
        id: `${type}-${keyId}`,
        type,
        displayName: root.displayName,
        keyId,
        scaleModeId,
      };
    }),
  };
}

export const LEARN_SCALE_SECTIONS: LearnScaleSection[] = [
  buildSection('major', 'Major Scales', 'major', (r) => r.majorKeyId),
  buildSection('dominant-7th', 'Dominant 7th Scales', 'dominant-7th', (r) => r.majorKeyId),
  buildSection('minor', 'Minor Scales', 'natural-minor', (r) => r.minorKeyId),
];

export const ALL_LEARN_ITEMS: LearnScaleItem[] = LEARN_SCALE_SECTIONS.flatMap((s) => s.items);
