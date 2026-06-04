import { ALL_LEARN_ITEMS, LEARN_SCALE_SECTIONS } from '../data/learnScales';
import type { ScaleModeId } from '../data/scaleModes';
import { getLearnedIds, getSectionProgress, setLearned } from '../learnProgress';
import { createBackButton } from '../components/BackButton';

export function createLearnView(
  onBack: () => void,
  onPractice: (keyId: string, scaleModeId: ScaleModeId) => void
): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view learn-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = 'Learn Scales';
  const overallProgress = document.createElement('span');
  overallProgress.className = 'learn-progress';

  header.appendChild(backBtn);
  header.appendChild(title);
  header.appendChild(overallProgress);

  const content = document.createElement('div');
  content.className = 'learn-content';

  const sectionProgressEls: HTMLElement[] = [];

  function updateProgress(): void {
    const allIds = ALL_LEARN_ITEMS.map((item) => item.id);
    const overall = getSectionProgress(allIds);
    overallProgress.textContent = `${overall.learned} / ${overall.total}`;

    for (let i = 0; i < LEARN_SCALE_SECTIONS.length; i++) {
      const section = LEARN_SCALE_SECTIONS[i];
      const sectionIds = section.items.map((item) => item.id);
      const { learned, total } = getSectionProgress(sectionIds);
      sectionProgressEls[i].textContent = `${learned} / ${total}`;
    }
  }

  for (const section of LEARN_SCALE_SECTIONS) {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'learn-section';

    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'learn-section-header';
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = section.title;
    const sectionProgress = document.createElement('span');
    sectionProgress.className = 'learn-progress';
    sectionProgressEls.push(sectionProgress);
    sectionHeader.appendChild(sectionTitle);
    sectionHeader.appendChild(sectionProgress);

    const list = document.createElement('ul');
    list.className = 'learn-list';

    for (const item of section.items) {
      const row = document.createElement('li');
      row.className = 'learn-item';

      const label = document.createElement('label');
      label.className = 'learn-item-toggle';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = getLearnedIds().has(item.id);
      checkbox.setAttribute('aria-label', `Mark ${item.displayName} ${section.title} as learned`);

      const nameBtn = document.createElement('button');
      nameBtn.type = 'button';
      nameBtn.className = 'learn-item-label';
      nameBtn.textContent = item.displayName;
      nameBtn.setAttribute('aria-label', `Practice ${item.displayName} ${section.title}`);

      function syncRowState(): void {
        row.classList.toggle('learn-item--learned', checkbox.checked);
      }

      checkbox.addEventListener('change', () => {
        setLearned(item.id, checkbox.checked);
        syncRowState();
        updateProgress();
      });

      nameBtn.addEventListener('click', () => {
        onPractice(item.keyId, item.scaleModeId);
      });

      label.appendChild(checkbox);
      label.appendChild(nameBtn);
      row.appendChild(label);
      list.appendChild(row);
      syncRowState();
    }

    sectionEl.appendChild(sectionHeader);
    sectionEl.appendChild(list);
    content.appendChild(sectionEl);
  }

  updateProgress();

  root.appendChild(header);
  root.appendChild(content);
  return root;
}
