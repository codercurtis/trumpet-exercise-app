import { createBackButton } from '../components/BackButton';
import { getShowAnnotations, setShowAnnotations } from '../settings';

export function createSettingsView(onBack: () => void): HTMLElement {
  const root = document.createElement('div');
  root.className = 'view settings-view';

  const header = document.createElement('div');
  header.className = 'view-header';
  const backBtn = createBackButton(onBack, true);
  const title = document.createElement('h1');
  title.textContent = 'Settings';
  header.appendChild(backBtn);
  header.appendChild(title);

  const settingsList = document.createElement('div');
  settingsList.className = 'settings-list';

  const label = document.createElement('label');
  label.className = 'settings-toggle';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getShowAnnotations();
  checkbox.setAttribute('aria-label', 'Show note names and fingerings');
  checkbox.addEventListener('change', () => {
    setShowAnnotations(checkbox.checked);
  });
  const labelText = document.createElement('span');
  labelText.textContent = 'Show note names and fingerings';
  label.appendChild(checkbox);
  label.appendChild(labelText);
  settingsList.appendChild(label);

  root.appendChild(header);
  root.appendChild(settingsList);
  return root;
}
