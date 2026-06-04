import { getScaleRootOptions } from '../data/exercises';
import {
  getScaleModeOptions,
  SCALE_CATEGORIES,
  type ScaleCategoryId,
  type ScaleModeId,
} from '../data/scaleModes';
import { createBackButton } from '../components/BackButton';

export function createScaleSelectView(
  onSelectKey: (keyId: string, scaleModeId: ScaleModeId) => void,
  onBack: () => void,
  onSelectCustom?: () => void
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view scale-select-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = 'Choose Scale';
  header.appendChild(backBtn);
  header.appendChild(title);

  const form = document.createElement('div');
  form.className = 'scale-select-form';

  const categoryField = document.createElement('div');
  categoryField.className = 'scale-select-field';
  const categoryLabel = document.createElement('label');
  categoryLabel.htmlFor = 'scale-category';
  categoryLabel.textContent = 'Category';
  const categorySelect = document.createElement('select');
  categorySelect.id = 'scale-category';
  categorySelect.setAttribute('aria-label', 'Scale category');
  for (const cat of SCALE_CATEGORIES) {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  }
  categoryField.appendChild(categoryLabel);
  categoryField.appendChild(categorySelect);

  const typeField = document.createElement('div');
  typeField.className = 'scale-select-field';
  const typeLabel = document.createElement('label');
  typeLabel.htmlFor = 'scale-type';
  typeLabel.textContent = 'Scale type';
  const typeSelect = document.createElement('select');
  typeSelect.id = 'scale-type';
  typeSelect.setAttribute('aria-label', 'Scale type');
  typeField.appendChild(typeLabel);
  typeField.appendChild(typeSelect);

  const rootField = document.createElement('div');
  rootField.className = 'scale-select-field';
  const rootLabel = document.createElement('label');
  rootLabel.htmlFor = 'scale-root';
  rootLabel.textContent = 'Root note';
  const rootSelect = document.createElement('select');
  rootSelect.id = 'scale-root';
  rootSelect.setAttribute('aria-label', 'Root note');
  rootField.appendChild(rootLabel);
  rootField.appendChild(rootSelect);

  const startBtn = document.createElement('button');
  startBtn.className = 'key-button scale-select-start';
  startBtn.type = 'button';
  startBtn.textContent = 'Start Scale';

  function updateStartButton(): void {
    startBtn.disabled = typeSelect.options.length === 0 || !rootSelect.value;
  }

  function populateScaleTypes(categoryId: ScaleCategoryId): void {
    const modes = getScaleModeOptions(categoryId);
    typeSelect.innerHTML = '';
    for (const { id, name } of modes) {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = name;
      typeSelect.appendChild(opt);
    }
    updateStartButton();
  }

  function populateRootOptions(categoryId: ScaleCategoryId): void {
    const options = getScaleRootOptions(categoryId);
    rootSelect.innerHTML = '';
    for (const { displayRoot, keyId } of options) {
      const opt = document.createElement('option');
      opt.value = keyId;
      opt.textContent = displayRoot;
      rootSelect.appendChild(opt);
    }
    updateStartButton();
  }

  function onCategoryChange(): void {
    const categoryId = categorySelect.value as ScaleCategoryId;
    populateScaleTypes(categoryId);
    populateRootOptions(categoryId);
  }

  categorySelect.addEventListener('change', onCategoryChange);
  typeSelect.addEventListener('change', updateStartButton);
  rootSelect.addEventListener('change', updateStartButton);

  onCategoryChange();

  startBtn.addEventListener('click', () => {
    const keyId = rootSelect.value;
    const scaleModeId = typeSelect.value as ScaleModeId;
    if (keyId && scaleModeId) onSelectKey(keyId, scaleModeId);
  });

  form.appendChild(categoryField);
  form.appendChild(typeField);
  form.appendChild(rootField);

  const actions = document.createElement('div');
  actions.className = 'scale-select-actions';
  actions.appendChild(startBtn);

  if (onSelectCustom) {
    const customBtn = document.createElement('button');
    customBtn.className = 'key-button key-button-custom';
    customBtn.type = 'button';
    customBtn.textContent = 'Custom';
    customBtn.addEventListener('click', onSelectCustom);
    actions.appendChild(customBtn);
  }

  root.appendChild(header);
  root.appendChild(form);
  root.appendChild(actions);

  return root;
}
