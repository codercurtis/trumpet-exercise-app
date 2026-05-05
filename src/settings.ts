const STORAGE_KEY = 'showAnnotations';

export function getShowAnnotations(): boolean {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (stored === null) return true;
  return stored === 'true';
}

export function setShowAnnotations(value: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
}
