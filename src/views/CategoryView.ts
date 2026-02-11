import { categories } from '../data/categories';
import { createBackButton } from '../components/BackButton';

export function createCategoryView(
  onSelectCategory: (categoryId: string) => void,
  onBack: () => void,
  showBackButton: boolean
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view category-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, showBackButton);
  const title = document.createElement('h1');
  title.textContent = 'Choose Exercise Type';
  header.appendChild(backBtn);
  header.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'category-grid';

  for (const cat of categories) {
    const card = document.createElement('button');
    card.className = 'category-card';
    card.textContent = cat.name;
    card.addEventListener('click', () => onSelectCategory(cat.id));
    grid.appendChild(card);
  }

  root.appendChild(header);
  root.appendChild(grid);
  return root;
}
