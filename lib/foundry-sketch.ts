export function sketchPath(width: number, height: number, seed: string): string {
  const w = Math.max(24, Math.round(width));
  const h = Math.max(24, Math.round(height));
  const n = hash(seed);
  const j = (index: number) => ((n >> (index % 24)) & 7) - 3;
  const x0 = 3 + j(1);
  const y0 = 3 + j(2);
  const x1 = w - 3 + j(3);
  const y1 = 3 + j(4);
  const x2 = w - 3 + j(5);
  const y2 = h - 3 + j(6);
  const x3 = 3 + j(7);
  const y3 = h - 3 + j(8);
  return [
    `M ${x0} ${y0}`,
    `Q ${Math.round((x0 + x1) / 2)} ${y0 + j(9)} ${x1} ${y1}`,
    `Q ${x1 + j(10)} ${Math.round((y1 + y2) / 2)} ${x2} ${y2}`,
    `Q ${Math.round((x2 + x3) / 2)} ${y2 + j(11)} ${x3} ${y3}`,
    `Q ${x0 + j(12)} ${Math.round((y3 + y0) / 2)} ${x0} ${y0}`,
  ].join(" ");
}

function hash(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
