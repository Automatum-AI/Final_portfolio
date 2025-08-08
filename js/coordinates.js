// Handles displaying cursor coordinates on the top-left corner
export function initCoordinates() {
  // Create HUD element
  console.log('initCoordinates invoked');
  const coordsEl = document.createElement('div');
  coordsEl.className = 'hud-coords';
  coordsEl.innerHTML = 'X:0<br>Y:0<br>Z:0';
  document.body.appendChild(coordsEl);

  // Running 8-digit counters for X, Y, Z
  let xCount = 0, yCount = 0, zCount = 0;
  function pad8(n) { return n.toString().padStart(8, '0'); }
  // Auto increment counters on interval
  setInterval(() => {
    // Update base counters modulo 10 for digit cycling
    xCount = (xCount + 1) % 10;
    yCount = (yCount + 2) % 10;
    zCount = (zCount + 3) % 10;
    // Generate 8-digit running sequences
    const xStr = Array.from({ length: 8 }, (_, i) => (xCount + i) % 10).join('');
    const yStr = Array.from({ length: 8 }, (_, i) => (yCount + i * 2) % 10).join('');
    const zStr = Array.from({ length: 8 }, (_, i) => (zCount + i * 3) % 10).join('');
    coordsEl.innerHTML = `X: ${xStr}<br>Y: ${yStr}<br>Z: ${zStr}`;
  }, 100);
}
