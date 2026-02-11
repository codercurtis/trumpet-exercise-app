export function createBackButton(
  onClick: () => void,
  visible: boolean
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = 'Back';
  btn.className = 'back-button';
  btn.addEventListener('click', onClick);
  if (!visible) {
    btn.style.display = 'none';
  }
  return btn;
}
