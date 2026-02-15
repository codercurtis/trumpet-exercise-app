export interface Category {
  id: string;
  name: string;
}

export interface Key {
  id: string;
  displayName: string;
}

export interface Exercise {
  id: string;
  categoryId: string;
  keyId: string;
  title: string;
  notes: string;
  noteNames: string[];
  timeSignature?: string;
  totalBeats?: number;
  /** When set, notes are 8th notes grouped in beams of this size */
  beamGroups?: number;
  /** Key signature for stave (e.g. "G" for G major, 1 sharp) */
  keySignature?: string;
  /** Indices of notes to beam together; each inner array = one beam group */
  beamIndices?: number[][];
  /** Note indices after which to insert measure bars (e.g. [5, 11, 17]) */
  measureBoundaries?: number[];
}
