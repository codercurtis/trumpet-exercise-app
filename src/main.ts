import './styles.css';
import { createCategoryView } from './views/CategoryView';
import { createKeyView } from './views/KeyView';
import { createExerciseView } from './views/ExerciseView';
import { createCustomExerciseSelectView } from './views/CustomExerciseSelectView';

type Screen =
  | { type: 'category' }
  | { type: 'key'; categoryId: string }
  | { type: 'custom-select'; categoryId: string }
  | { type: 'exercise'; categoryId: string; keyId: string; customKeyIds?: string[] };

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
      (categoryId) => push({ type: 'key', categoryId }),
      pop,
      stack.length > 1
    );
    app.appendChild(view);
    return;
  }

  if (current.type === 'key') {
    const view = createKeyView(
      current.categoryId,
      (keyId) => push({ type: 'exercise', categoryId: current.categoryId, keyId }),
      pop,
      () => push({ type: 'custom-select', categoryId: current.categoryId })
    );
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
      current.customKeyIds
    );
    app.appendChild(view);
    return;
  }
}

render();
