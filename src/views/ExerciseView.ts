import { getExercise, combineExercises } from '../data/exercises';
import { createBackButton } from '../components/BackButton';
import { renderMusic } from '../components/MusicRenderer';
import { playExercise } from '../audio/trumpetSound';

export function createExerciseView(
  categoryId: string,
  keyId: string,
  onBack: () => void,
  customKeyIds?: string[]
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view exercise-view';
  root.dataset.debugBox = 'exercise-view';

  const exercise =
    customKeyIds && customKeyIds.length > 0
      ? combineExercises(categoryId, customKeyIds)
      : getExercise(categoryId, keyId);

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
  musicContainer.className = 'music-container';
  musicContainer.dataset.debugBox = 'music-container';

  root.appendChild(header);
  root.appendChild(musicContainer);

  requestAnimationFrame(() => {
    try {
      renderMusic(musicContainer, exercise.notes, {
        timeSignature: exercise.timeSignature ?? '4/4',
        noteNames: exercise.noteNames,
        totalBeats: exercise.totalBeats,
        beamGroups: exercise.beamGroups,
        showAnnotations: true,
        keySignature: exercise.keySignature,
        beamIndices: exercise.beamIndices,
        measureBoundaries: exercise.measureBoundaries,
      });
    } catch (err) {
      console.error('Music render error:', err);
      musicContainer.textContent = `Error rendering music: ${err instanceof Error ? err.message : String(err)}`;
    }
  });

  return root;
}
