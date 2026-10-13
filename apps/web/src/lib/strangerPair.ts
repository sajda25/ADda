import type { MemorySummary } from "@memory-streets/shared";

export type StrangerPair = {
  left: MemorySummary;
  right: MemorySummary;
  score: number;
};

/** Rank every duo — prefer different authors, layers, and little tag overlap. */
export function rankStrangerPairs(memories: MemorySummary[]): StrangerPair[] {
  if (memories.length < 2) return [];

  const pairs: StrangerPair[] = [];
  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      const left = memories[i]!;
      const right = memories[j]!;
      pairs.push({ left, right, score: pairScore(left, right) });
    }
  }

  return pairs.sort((a, b) => b.score - a.score || a.left.id.localeCompare(b.left.id));
}

function pairScore(a: MemorySummary, b: MemorySummary): number {
  let score = 0;
  if (a.authorDisplayName !== b.authorDisplayName) score += 4;
  if (a.layer !== b.layer) score += 3;

  const tagsA = new Set(a.tags.map((t) => t.toLowerCase()));
  const overlap = b.tags.filter((t) => tagsA.has(t.toLowerCase())).length;
  score += Math.max(0, 4 - overlap * 2);

  const readDiff = Math.abs(a.readCount - b.readCount);
  score += Math.min(2, readDiff / 8);

  // Slight preference for longer excerpts — more to “overhear”
  score += Math.min(1.5, (a.excerpt.length + b.excerpt.length) / 240);

  return score;
}
