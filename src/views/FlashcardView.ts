import { trumpetFingering } from '../data/trumpetFingering';
import { createBackButton } from '../components/BackButton';
import { renderMusic } from '../components/MusicRenderer';

const NOTE_NAMES = Object.keys(trumpetFingering);

function pickRandomNote(): string {
  return NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
}

function renderNote(container: HTMLElement, noteName: string, showAnnotations: boolean): void {
  renderMusic(
    container,
    `${noteName}/w`,
    '4/4',
    [noteName],
    4,
    undefined,
    showAnnotations
  );
}

export function createFlashcardView(
  exerciseId: string,
  onBack: () => void
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view exercise-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = exerciseId === 'notes' ? 'Notes' : exerciseId;

  const actionBtn = document.createElement('button');
  actionBtn.className = 'play-button';
  actionBtn.type = 'button';

  header.appendChild(backBtn);
  header.appendChild(title);
  header.appendChild(actionBtn);

  const musicContainer = document.createElement('div');
  musicContainer.className = 'music-container';

  root.appendChild(header);
  root.appendChild(musicContainer);

  if (exerciseId === 'notes') {
    let currentNote = pickRandomNote();
    let annotationsVisible = false;

    function updateButton(): void {
      if (annotationsVisible) {
        actionBtn.textContent = 'Next';
        actionBtn.setAttribute('aria-label', 'Next note');
      } else {
        actionBtn.textContent = 'Reveal annotations';
        actionBtn.setAttribute('aria-label', 'Reveal annotations');
      }
    }

    requestAnimationFrame(() => {
      renderNote(musicContainer, currentNote, false);
      updateButton();
    });

    actionBtn.addEventListener('click', () => {
      if (annotationsVisible) {
        currentNote = pickRandomNote();
        annotationsVisible = false;
        renderNote(musicContainer, currentNote, false);
      } else {
        annotationsVisible = true;
        renderNote(musicContainer, currentNote, true);
      }
      updateButton();
    });
  }

  return root;
}
