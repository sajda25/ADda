import type { MuralMotifKind } from "./types";

const TAG_TO_MOTIF: Record<string, MuralMotifKind> = {
  tea: "tea",
  chai: "tea",
  coffee: "tea",
  adda: "tea",
  rain: "rain",
  monsoon: "rain",
  flood: "rain",
  bandh: "rain",
  bus: "bus",
  tram: "bus",
  train: "bus",
  taxi: "road",
  road: "road",
  neon: "road",
  ferry: "road",
  river: "rain",
  school: "school",
  campus: "school",
  exams: "school",
  childhood: "school",
  tree: "tree",
  trees: "tree",
  park: "tree",
  market: "market",
  flowers: "market",
  vendors: "market",
  food: "market",
  books: "market",
  reading: "market",
  clay: "family",
  craft: "family",
  durga: "music",
  music: "music",
  festival: "music",
  winter: "lamp",
  family: "family",
  friendship: "family",
  sunday: "family",
  tradition: "family",
  night: "lamp",
  lamps: "lamp",
  dusk: "lamp",
  waiting: "lamp",
};

export function motifsFromTags(tags: string[]): MuralMotifKind[] {
  const counts = new Map<MuralMotifKind, number>();
  for (const tag of tags) {
    const motif = TAG_TO_MOTIF[tag.toLowerCase()];
    if (!motif) continue;
    counts.set(motif, (counts.get(motif) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([kind]) => kind);
}

export function drawMotif(
  ctx: CanvasRenderingContext2D,
  kind: MuralMotifKind,
  x: number,
  y: number,
  scale: number,
  ink: string,
  accent: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = ink;
  ctx.fillStyle = "transparent";
  ctx.lineWidth = 1.2;

  switch (kind) {
    case "tea":
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.quadraticCurveTo(0, -18, 10, -4);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 2, 12, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.arc(14, 0, 4, -0.8, 0.8);
      ctx.stroke();
      break;
    case "rain":
      ctx.strokeStyle = ink;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 6 - 12, -14);
        ctx.quadraticCurveTo(i * 6 - 10, 0, i * 6 - 12, 14);
        ctx.stroke();
      }
      break;
    case "bus":
      ctx.strokeRect(-16, -8, 32, 16);
      ctx.strokeRect(-10, -4, 8, 6);
      ctx.strokeRect(2, -4, 8, 6);
      ctx.beginPath();
      ctx.arc(-10, 10, 3, 0, Math.PI * 2);
      ctx.arc(10, 10, 3, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "school":
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(16, -4);
      ctx.lineTo(16, 12);
      ctx.lineTo(-16, 12);
      ctx.lineTo(-16, -4);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(-4, 0, 8, 12);
      break;
    case "tree":
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(0, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -8, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.quadraticCurveTo(10, 0, 14, 8);
      ctx.stroke();
      break;
    case "market":
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(0, -12);
      ctx.lineTo(14, 0);
      ctx.lineTo(14, 12);
      ctx.lineTo(-14, 12);
      ctx.closePath();
      ctx.stroke();
      break;
    case "music":
      ctx.beginPath();
      ctx.moveTo(-4, -12);
      ctx.lineTo(-4, 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-8, 8, 5, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = accent;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(6 + i * 4, -6 + i * 2, 3, Math.PI * 0.2, Math.PI * 0.9);
        ctx.stroke();
      }
      break;
    case "family":
      ctx.beginPath();
      ctx.arc(-8, -4, 4, 0, Math.PI * 2);
      ctx.arc(8, -4, 4, 0, Math.PI * 2);
      ctx.arc(0, 2, 3.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "road":
      ctx.beginPath();
      ctx.moveTo(-18, 8);
      ctx.quadraticCurveTo(0, -10, 18, 8);
      ctx.stroke();
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(-14, 10);
      ctx.quadraticCurveTo(0, -4, 14, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    case "lamp":
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(0, -6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -10, 5, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }
  ctx.restore();
}
