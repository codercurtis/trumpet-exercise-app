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
}
