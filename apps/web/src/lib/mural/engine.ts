import { MURAL_ENGINE_VERSION } from "@memory-streets/shared";
import { drawMotif, motifsFromTags } from "./motifs";
import type { MuralCause, MuralInput, MuralRenderResult } from "./types";

/** Deterministic 32-bit hash */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildArtworkHash(input: MuralInput, motifs: string[]): string {
  const payload = [
    input.engineVersion,
    input.placeId,
    input.styleSeed,
    input.epochSeed,
    input.tags.slice().sort().join(","),
    JSON.stringify(input.layerWeights),
    String(input.relationCount),
    String(input.archiveSize),
    String(input.preservationScore ?? 0),
    motifs.join(","),
    input.previousArtworkHash ?? "",
  ].join("|");
  return `mural:${hashString(payload).toString(16)}`;
}

export function analyzeMuralInput(
  input: MuralInput,
  contributingMemoryIds: string[],
  epochLabel: string,
): { motifs: ReturnType<typeof motifsFromTags>; cause: MuralCause; artworkHash: string } {
  const motifs = motifsFromTags(input.tags).slice(0, 6);
  const layerEmphasis = (
    Object.entries(input.layerWeights) as [keyof typeof input.layerWeights, number][]
  )
    .filter(([, w]) => (w ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0) || a[0].localeCompare(b[0]))
    .map(([layer]) => layer);

  const dominantTags = [...input.tags]
    .reduce<Map<string, number>>((map, tag) => {
      map.set(tag, (map.get(tag) ?? 0) + 1);
      return map;
    }, new Map())
    .entries();

  const sortedTags = [...dominantTags]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([tag]) => tag);

  const artworkHash = buildArtworkHash(input, motifs);

  const cause: MuralCause = {
    whatChanged: motifs.length
      ? `Motifs derived from archive tags: ${motifs.join(", ")}.`
      : "Archive composition updated street geometry without new symbolic motifs.",
    contributingMemoryIds,
    dominantTags: sortedTags,
    layerEmphasis,
    relationInfluence: input.relationCount,
    epochLabel,
    carriedForward: input.previousArtworkHash
      ? `Previous artwork hash ${input.previousArtworkHash} informs continuity strokes.`
      : "No previous epoch — this is a root composition.",
  };

  return { motifs, cause, artworkHash };
}

export function renderMural(
  canvas: HTMLCanvasElement,
  input: MuralInput,
  contributingMemoryIds: string[],
  epochLabel: string,
): MuralRenderResult {
  const { motifs, cause, artworkHash } = analyzeMuralInput(
    input,
    contributingMemoryIds,
    epochLabel,
  );

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { artworkHash, motifs, cause };
  }

  const w = canvas.width;
  const h = canvas.height;
  const rand = mulberry32(
    hashString(`${input.styleSeed}:${input.epochSeed}:${input.engineVersion}`),
  );

  // Paper ground
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#f3ebe0");
  grad.addColorStop(1, "#e0d2be");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Grain
  for (let i = 0; i < 1200; i++) {
    const x = rand() * w;
    const y = rand() * h;
    ctx.fillStyle = `rgba(28,25,21,${0.015 + rand() * 0.03})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Street geometry continuity from previous hash
  ctx.strokeStyle = "rgba(61,56,48,0.45)";
  ctx.lineWidth = 1.25;
  const continuity = input.previousArtworkHash
    ? hashString(input.previousArtworkHash)
    : hashString(input.styleSeed);
  const baseY = h * (0.62 + ((continuity % 100) / 100) * 0.08);
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let x = 0; x <= w; x += 16) {
    const y =
      baseY +
      Math.sin(x * 0.02 + (continuity % 50)) * 10 +
      Math.sin(x * 0.05 + continuity) * 3;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Layer wash
  const layerKeys = Object.keys(input.layerWeights);
  if (layerKeys.includes("BEFORE_CHANGE")) {
    ctx.fillStyle = "rgba(92,107,74,0.08)";
    ctx.fillRect(0, 0, w, h * 0.35);
  }
  if (layerKeys.includes("CHILDHOOD_CAMPUS")) {
    ctx.fillStyle = "rgba(196,137,58,0.07)";
    ctx.fillRect(0, h * 0.35, w, h * 0.3);
  }

  // Building outlines scale with archive size
  const buildingCount = Math.min(8, 3 + Math.floor(input.archiveSize / 5));
  ctx.strokeStyle = "rgba(28,25,21,0.4)";
  for (let i = 0; i < buildingCount; i++) {
    const bw = 28 + rand() * 36;
    const bh = 40 + rand() * 70;
    const bx = 24 + i * ((w - 48) / buildingCount);
    const by = baseY - bh;
    ctx.strokeRect(bx, by, bw, bh);
  }

  // Relation paths
  ctx.strokeStyle = "rgba(138,151,120,0.45)";
  for (let i = 0; i < Math.min(input.relationCount, 8); i++) {
    ctx.beginPath();
    ctx.moveTo(rand() * w * 0.4, rand() * h * 0.5);
    ctx.quadraticCurveTo(rand() * w, rand() * h, w * 0.5 + rand() * w * 0.5, baseY);
    ctx.stroke();
  }

  // Motifs
  motifs.forEach((motif, index) => {
    const x = 40 + ((index * 97 + hashString(motif)) % Math.max(1, w - 80));
    const y = 50 + ((index * 53 + hashString(input.epochSeed)) % Math.max(1, Math.floor(h * 0.45)));
    drawMotif(ctx, motif, x, y, 1 + rand() * 0.4, "rgba(28,25,21,0.55)", "rgba(196,137,58,0.7)");
  });

  // Preservation glow (visual only — never affects ranking)
  const preservation = input.preservationScore ?? 0;
  if (preservation > 0) {
    const glow = ctx.createRadialGradient(w * 0.8, h * 0.2, 10, w * 0.8, h * 0.2, 80);
    glow.addColorStop(0, `rgba(196,137,58,${0.12 + preservation * 0.2})`);
    glow.addColorStop(1, "rgba(196,137,58,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  // Annotation
  ctx.fillStyle = "rgba(107,100,88,0.85)";
  ctx.font = "12px Georgia, serif";
  ctx.fillText(epochLabel, 16, 24);
  ctx.fillStyle = "rgba(154,145,132,0.9)";
  ctx.font = "10px Georgia, serif";
  ctx.fillText(`engine ${input.engineVersion || MURAL_ENGINE_VERSION}`, 16, 40);

  return { artworkHash, motifs, cause };
}

export function defaultMuralInput(
  partial: Partial<MuralInput> & Pick<MuralInput, "placeId" | "styleSeed" | "epochSeed">,
): MuralInput {
  return {
    engineVersion: MURAL_ENGINE_VERSION,
    tags: [],
    layerWeights: {},
    relationCount: 0,
    archiveSize: 0,
    preservationScore: 0,
    previousArtworkHash: null,
    ...partial,
  };
}
