import { getItemsForCategory } from '../data/exercises';
import { categories } from '../data/categories';
import { createBackButton } from '../components/BackButton';

export function createKeyView(
  categoryId: string,
  onSelectKey: (keyId: string) => void,
  onBack: () => void,
  onSelectCustom?: () => void
): HTMLElement {
  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? categoryId;

  const root = document.createElement('div');
  root.className = 'view key-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent =
    categoryId === 'chromatic-scales'
      ? `Choose Chromatic Scale`
      : categoryId === 'etudes'
        ? `Choose Etude`
        : categoryId === 'songs'
          ? `Choose Song`
          : categoryId === 'scales' || categoryId === 'held-notes'
          ? categoryId === 'scales'
            ? `Choose Scale`
            : `Choose Key for Held Notes`
          : `Choose Key for ${categoryName}`;
  header.appendChild(backBtn);
  header.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'key-grid';

  const items = getItemsForCategory(categoryId);

  for (const item of items) {
    const btn = document.createElement('button');
    btn.className = 'key-button';
    btn.textContent = item.displayName;
    btn.addEventListener('click', () => onSelectKey(item.id));
    grid.appendChild(btn);
  }

  if (onSelectCustom) {
    const customBtn = document.createElement('button');
    customBtn.className = 'key-button key-button-custom';
    customBtn.textContent = 'Custom';
    customBtn.addEventListener('click', onSelectCustom);
    grid.appendChild(customBtn);
  }

  root.appendChild(header);
  root.appendChild(grid);
  return root;
}
