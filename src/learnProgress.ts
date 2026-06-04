const STORAGE_KEY = 'learnProgress';

function readIds(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function getLearnedIds(): Set<string> {
  return readIds();
}

export function isLearned(id: string): boolean {
  return readIds().has(id);
}

export function setLearned(id: string, learned: boolean): void {
  const ids = readIds();
  if (learned) {
    ids.add(id);
  } else {
    ids.delete(id);
  }
  writeIds(ids);
}

export function getSectionProgress(sectionIds: string[]): { learned: number; total: number } {
  const ids = readIds();
  const learned = sectionIds.filter((id) => ids.has(id)).length;
  return { learned, total: sectionIds.length };
}
