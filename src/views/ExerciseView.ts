import {
  ALL_ROOTS_KEY_ID,
  getAllRootsScaleOptions,
  getExercise,
  combineExercises,
  getScalePatterns,
  type ScalePattern,
} from '../data/exercises';
import type { Exercise } from '../types';
import {
  getScaleCategoryForMode,
  getScaleMode,
  type ScaleModeId,
} from '../data/scaleModes';
import { createBackButton } from '../components/BackButton';
import { renderMusic } from '../components/MusicRenderer';
import { playExercise } from '../audio/trumpetSound';
import { getShowAnnotations } from '../settings';

function renderMusicStaff(
  container: HTMLElement,
  exercise: Pick<Exercise, 'notes' | 'noteNames' | 'timeSignature' | 'totalBeats' | 'beamGroups' | 'keySignature' | 'beamIndices' | 'measureBoundaries'>
): void {
  requestAnimationFrame(() => {
    try {
      renderMusic(container, exercise.notes, {
        timeSignature: exercise.timeSignature ?? '4/4',
        noteNames: exercise.noteNames,
        totalBeats: exercise.totalBeats,
        beamGroups: exercise.beamGroups,
        showAnnotations: getShowAnnotations(),
        keySignature: exercise.keySignature,
        beamIndices: exercise.beamIndices,
        measureBoundaries: exercise.measureBoundaries,
      });
    } catch (err) {
      console.error('Music render error:', err);
      container.textContent = `Error rendering music: ${err instanceof Error ? err.message : String(err)}`;
    }
  });
}

function createPatternSection(pattern: ScalePattern): HTMLElement {
  const section = document.createElement('section');
  section.className = 'scale-pattern-section';

  const header = document.createElement('div');
  header.className = 'scale-pattern-header';

  const label = document.createElement('h2');
  label.textContent = pattern.label;

  const playBtn = document.createElement('button');
  playBtn.className = 'play-button play-button--small';
  playBtn.setAttribute('aria-label', `Play ${pattern.label}`);
  playBtn.textContent = '▶ Play';
  playBtn.type = 'button';
  playBtn.addEventListener('click', () => {
    playExercise({
      notes: pattern.notes,
      noteNames: pattern.noteNames,
      timeSignature: '4/4',
    });
  });

  header.appendChild(label);
  header.appendChild(playBtn);

  const musicContainer = document.createElement('div');
  musicContainer.className = 'music-container' + (getShowAnnotations() ? '' : ' annotations-off');
  musicContainer.dataset.debugBox = 'music-container';

  section.appendChild(header);
  section.appendChild(musicContainer);

  renderMusicStaff(musicContainer, {
    notes: pattern.notes,
    noteNames: pattern.noteNames,
    timeSignature: '4/4',
    totalBeats: pattern.totalBeats,
  });

  return section;
}

function createScaleExerciseSection(exercise: Exercise): HTMLElement {
  const section = document.createElement('section');
  section.className = 'scale-pattern-section';

  const header = document.createElement('div');
  header.className = 'scale-pattern-header';

  const label = document.createElement('h2');
  label.textContent = exercise.title;

  const playBtn = document.createElement('button');
  playBtn.className = 'play-button play-button--small';
  playBtn.setAttribute('aria-label', `Play ${exercise.title}`);
  playBtn.textContent = '▶ Play';
  playBtn.type = 'button';
  playBtn.addEventListener('click', () => {
    playExercise({
      notes: exercise.notes,
      noteNames: exercise.noteNames,
      timeSignature: exercise.timeSignature,
      beamGroups: exercise.beamGroups,
    });
  });

  header.appendChild(label);
  header.appendChild(playBtn);

  const musicContainer = document.createElement('div');
  musicContainer.className = 'music-container' + (getShowAnnotations() ? '' : ' annotations-off');
  musicContainer.dataset.debugBox = 'music-container';

  section.appendChild(header);
  section.appendChild(musicContainer);

  renderMusicStaff(musicContainer, exercise);

  return section;
}

function createAllRootsScaleView(scaleModeId: ScaleModeId, onBack: () => void): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view exercise-view';
  root.dataset.debugBox = 'exercise-view';

  const mode = getScaleMode(scaleModeId);
  const categoryId = getScaleCategoryForMode(scaleModeId) ?? 'major';
  const modeName = mode?.name ?? 'Scale';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = `All ${modeName} Scales`;

  header.appendChild(backBtn);
  header.appendChild(title);

  const scalesContainer = document.createElement('div');
  scalesContainer.className = 'scale-patterns';

  for (const { keyId } of getAllRootsScaleOptions(categoryId)) {
    const exercise = getExercise('scales', keyId, scaleModeId);
    scalesContainer.appendChild(createScaleExerciseSection(exercise));
  }

  root.appendChild(header);
  root.appendChild(scalesContainer);

  return root;
}

export function createExerciseView(
  categoryId: string,
  keyId: string,
  onBack: () => void,
  customKeyIds?: string[],
  scaleModeId?: ScaleModeId
): HTMLElement {
  if (categoryId === 'scales' && keyId === ALL_ROOTS_KEY_ID && scaleModeId) {
    return createAllRootsScaleView(scaleModeId, onBack);
  }

  const root = document.createElement('div');
  root.className = 'view exercise-view';
  root.dataset.debugBox = 'exercise-view';

  const exercise =
    customKeyIds && customKeyIds.length > 0
      ? combineExercises(categoryId, customKeyIds)
      : getExercise(categoryId, keyId, scaleModeId);

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = exercise.title;

  const playBtn = document.createElement('button');
  playBtn.className = 'play-button';
  playBtn.setAttribute('aria-label', 'Play exercise');
  playBtn.textContent = '▶ Play';
  playBtn.type = 'button';
  playBtn.addEventListener('click', () => {
    playExercise({
      notes: exercise.notes,
      noteNames: exercise.noteNames,
      timeSignature: exercise.timeSignature,
      beamGroups: exercise.beamGroups,
    });
  });

  header.appendChild(backBtn);
  header.appendChild(title);
  header.appendChild(playBtn);

  const musicContainer = document.createElement('div');
  musicContainer.className = 'music-container' + (getShowAnnotations() ? '' : ' annotations-off');
  musicContainer.dataset.debugBox = 'music-container';

  root.appendChild(header);
  root.appendChild(musicContainer);

  renderMusicStaff(musicContainer, exercise);

  if (categoryId === 'scales' && scaleModeId && !customKeyIds?.length) {
    const patterns = getScalePatterns(keyId, scaleModeId);
    if (patterns.length > 0) {
      const patternsContainer = document.createElement('div');
      patternsContainer.className = 'scale-patterns';
      for (const pattern of patterns) {
        patternsContainer.appendChild(createPatternSection(pattern));
      }
      root.appendChild(patternsContainer);
    }
  }

  return root;
}
