/**
 * Spacing debug mode: add #debug-spacing to the URL to show color-coded bounding boxes
 * around layout containers. Use the legend to identify which area has excess whitespace.
 */
export function initSpacingDebug(): void {
  function update(): void {
    const active = location.hash === '#debug-spacing';
    document.body.classList.toggle('debug-spacing', active);
    ensureLegend(active);
  }

  function ensureLegend(visible: boolean): void {
    let legend = document.getElementById('debug-spacing-legend');
    if (visible && !legend) {
      legend = document.createElement('div');
      legend.id = 'debug-spacing-legend';
      legend.innerHTML = `
        <strong>Spacing debug</strong> (remove #debug-spacing from URL to hide)
        <ul>
          <li><span class="swatch swatch-red"></span> exercise-view</li>
          <li><span class="swatch swatch-blue"></span> music-container</li>
          <li><span class="swatch swatch-green"></span> vexflow-output div</li>
          <li><span class="swatch swatch-amber"></span> SVG canvas</li>
          <li><span class="swatch swatch-red"></span> red = expected first staff (VexFlow getY)</li>
          <li><span class="swatch swatch-green"></span> green = actual first staff</li>
          <li><span class="swatch swatch-red"></span> red = bottom of last staff</li>
        </ul>
      `;
      document.body.appendChild(legend);
    } else if (!visible && legend) {
      legend.remove();
    }
  }

  window.addEventListener('hashchange', update);
  update();
}
