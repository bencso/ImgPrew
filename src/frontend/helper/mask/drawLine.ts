// Linear interpolation : https://hu.wikipedia.org/wiki/Interpol%C3%A1ci%C3%B3
export function drawLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  brushSize: number,
  paint: any,
) {
  // Különbség számítás
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Pitagorasz tétel
  const distance = Math.sqrt(dx * dx + dy * dy);

  // A két pont közötti távolság "megrajzolása"
  for (let i = 0; i <= distance; i += brushSize) {
    const a = i / distance;

    const x = x1 + dx * a;
    const y = y1 + dy * a;

    paint(x, y);
  }
}
