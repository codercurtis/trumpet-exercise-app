import './styles.css';
import { initSpacingDebug } from './debugSpacing';
import { createCategoryView } from './views/CategoryView';
import { createKeyView } from './views/KeyView';
import { createScaleSelectView } from './views/ScaleSelectView';
import type { ScaleModeId } from './data/scaleModes';
import { createExerciseView } from './views/ExerciseView';
import { createCustomExerciseSelectView } from './views/CustomExerciseSelectView';
import { createFlashcardView } from './views/FlashcardView';
import { createLearnView } from './views/LearnView';
import { createSettingsView } from './views/SettingsView';

type Screen =
  | { type: 'category' }
  | { type: 'key'; categoryId: string }
  | { type: 'custom-select'; categoryId: string }
  | {
      type: 'exercise';
      categoryId: string;
      keyId: string;
      scaleModeId?: string;
      customKeyIds?: string[];
    }
  | { type: 'flashcard'; exerciseId: string }
  | { type: 'learn' }
  | { type: 'settings' };

let stack: Screen[] = [{ type: 'category' }];

const appEl = document.getElementById('app');
if (!appEl) throw new Error('Missing #app element');
const app = appEl;

function push(screen: Screen): void {
  stack = [...stack, screen];
  render();
}

function pop(): void {
  if (stack.length <= 1) return;
  stack = stack.slice(0, -1);
  render();
}

function render(): void {
  const current = stack[stack.length - 1];
  if (!current) return;

  app.innerHTML = '';

  if (current.type === 'category') {
    const view = createCategoryView(
      (categoryId) => {
        if (categoryId === 'flashcards') {
          push({ type: 'flashcard', exerciseId: 'notes' });
        } else if (categoryId === 'learn') {
          push({ type: 'learn' });
        } else {
          push({ type: 'key', categoryId });
        }
      },
      pop,
      stack.length > 1,
      () => push({ type: 'settings' })
    );
    app.appendChild(view);
    return;
  }

  if (current.type === 'key') {
    const onSelectKey = (keyId: string, scaleModeId?: ScaleModeId) => {
      if (current.categoryId === 'scales' && scaleModeId) {
        push({ type: 'exercise', categoryId: 'scales', keyId, scaleModeId });
      } else {
        push({ type: 'exercise', categoryId: current.categoryId, keyId });
      }
    };
    const onSelectCustom = () =>
      push({ type: 'custom-select', categoryId: current.categoryId });

    const view =
      current.categoryId === 'scales'
        ? createScaleSelectView(onSelectKey, pop, onSelectCustom)
        : createKeyView(current.categoryId, onSelectKey, pop, onSelectCustom);
    app.appendChild(view);
    return;
  }

  if (current.type === 'custom-select') {
    const view = createCustomExerciseSelectView(
      current.categoryId,
      (selectedKeyIds) =>
        push({
          type: 'exercise',
          categoryId: current.categoryId,
          keyId: 'custom',
          customKeyIds: selectedKeyIds,
        }),
      pop
    );
    app.appendChild(view);
    return;
  }

  if (current.type === 'exercise') {
    const view = createExerciseView(
      current.categoryId,
      current.keyId,
      pop,
      current.customKeyIds,
      current.scaleModeId as ScaleModeId | undefined
    );
    app.appendChild(view);
    return;
  }

  if (current.type === 'flashcard') {
    const view = createFlashcardView(current.exerciseId, pop);
    app.appendChild(view);
    return;
  }

  if (current.type === 'learn') {
    const view = createLearnView(pop, (keyId, scaleModeId) => {
      push({ type: 'exercise', categoryId: 'scales', keyId, scaleModeId });
    });
    app.appendChild(view);
    return;
  }

  if (current.type === 'settings') {
    const view = createSettingsView(pop);
    app.appendChild(view);
    return;
  }
}

initSpacingDebug();
render();
