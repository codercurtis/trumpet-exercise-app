import { getItemsForCategory } from '../data/exercises';
import { categories } from '../data/categories';
import { createBackButton } from '../components/BackButton';

export function createCustomExerciseSelectView(
  categoryId: string,
  onConfirm: (selectedKeyIds: string[]) => void,
  onBack: () => void
): HTMLElement {
  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? categoryId;

  const root = document.createElement('div');
  root.className = 'view custom-select-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = `Custom ${categoryName}`;
  header.appendChild(backBtn);
  header.appendChild(title);

  const items = getItemsForCategory(categoryId);
  const selected = new Set<string>();

  const grid = document.createElement('div');
  grid.className = 'key-grid custom-select-grid';

  const createExerciseBtn = document.createElement('button');
  createExerciseBtn.className = 'play-button';
  createExerciseBtn.textContent = 'Create Exercise';
  createExerciseBtn.type = 'button';
  createExerciseBtn.disabled = true;

  function updateCreateButton(): void {
    createExerciseBtn.disabled = selected.size === 0;
  }

  for (const item of items) {
    const btn = document.createElement('button');
    btn.className = 'key-button custom-select-item';
    btn.textContent = item.displayName;
    btn.type = 'button';
    btn.addEventListener('click', () => {
      if (selected.has(item.id)) {
        selected.delete(item.id);
        btn.classList.remove('selected');
      } else {
        selected.add(item.id);
        btn.classList.add('selected');
      }
      updateCreateButton();
    });
    grid.appendChild(btn);
  }

  createExerciseBtn.addEventListener('click', () => {
    const selectedKeyIds = Array.from(selected);
    onConfirm(selectedKeyIds);
  });

  const footer = document.createElement('div');
  footer.className = 'view-header';
  footer.style.marginTop = 'auto';
  footer.appendChild(createExerciseBtn);

  root.appendChild(header);
  root.appendChild(grid);
  root.appendChild(footer);

  return root;
}
