export type WireStyle = "curve" | "elbow" | "straight";

const SHAPES = new Set(["text", "box", "ellipse", "diamond", "cylinder", "cloud", "note"]);

const SHAPE_SIZE: Record<string, { w: number; h: number }> = {
  text: { w: 180, h: 48 },
  box: { w: 160, h: 90 },
  ellipse: { w: 160, h: 90 },
  diamond: { w: 140, h: 110 },
  cylinder: { w: 140, h: 100 },
  cloud: { w: 170, h: 100 },
  note: { w: 160, h: 110 },
};

export function isShape(type: string): boolean {
  return SHAPES.has(type);
}

export function defaultSize(type: string): { w: number; h: number } {
  return SHAPE_SIZE[type] ?? { w: 144, h: 112 };
}

export function nodeSize(node: { type?: string; w?: number; h?: number }): { w: number; h: number } {
  const fallback = defaultSize(node.type ?? "");
  return {
    w: node.w && node.w > 0 ? node.w : fallback.w,
    h: node.h && node.h > 0 ? node.h : fallback.h,
  };
}

export function anchors(node: { x: number; y: number; type?: string; w?: number; h?: number }): {
  inn: { x: number; y: number };
  out: { x: number; y: number };
} {
  const size = nodeSize(node);
  return {
    inn: { x: node.x, y: node.y + size.h / 2 },
    out: { x: node.x + size.w, y: node.y + size.h / 2 },
  };
}

export function boardExtent(nodes: Array<{ x: number; y: number; type?: string; w?: number; h?: number }>): { w: number; h: number } {
  let w = 1600;
  let h = 1100;
  for (const node of nodes) {
    const size = nodeSize(node);
    w = Math.max(w, node.x + size.w + 120);
    h = Math.max(h, node.y + size.h + 120);
  }
  return { w, h };
}

export function snapCoord(value: number, step = 20): number {
  return Math.round(value / step) * step;
}

export function wireStyleOf(style?: string): WireStyle {
  if (style === "elbow" || style === "straight" || style === "curve") return style;
  return "curve";
}

export function wirePath(x1: number, y1: number, x2: number, y2: number, style: WireStyle): string {
  if (style === "straight") return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (style === "elbow") {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} L ${mid} ${y1} L ${mid} ${y2} L ${x2} ${y2}`;
  }
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function pointOnWire(x1: number, y1: number, x2: number, y2: number, t: number, style: WireStyle): { x: number; y: number } {
  const clamped = Math.min(1, Math.max(0, t));
  if (style === "straight") {
    return { x: x1 + (x2 - x1) * clamped, y: y1 + (y2 - y1) * clamped };
  }
  if (style === "elbow") {
    const mid = (x1 + x2) / 2;
    const segs = [
      { x1, y1, x2: mid, y2: y1 },
      { x1: mid, y1, x2: mid, y2 },
      { x1: mid, y1: y2, x2, y2 },
    ];
    const lengths = segs.map((seg) => Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1));
    const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
    let remain = clamped * total;
    for (let index = 0; index < segs.length; index += 1) {
      const length = lengths[index] ?? 0;
      const seg = segs[index];
      if (!seg) break;
      if (remain <= length || index === segs.length - 1) {
        const along = length === 0 ? 0 : remain / length;
        return { x: seg.x1 + (seg.x2 - seg.x1) * along, y: seg.y1 + (seg.y2 - seg.y1) * along };
      }
      remain -= length;
    }
  }
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
  const c1x = x1 + dx;
  const c1y = y1;
  const c2x = x2 - dx;
  const c2y = y2;
  const mt = 1 - clamped;
  return {
    x: mt * mt * mt * x1 + 3 * mt * mt * clamped * c1x + 3 * mt * clamped * clamped * c2x + clamped * clamped * clamped * x2,
    y: mt * mt * mt * y1 + 3 * mt * mt * clamped * c1y + 3 * mt * clamped * clamped * c2y + clamped * clamped * clamped * y2,
  };
}
