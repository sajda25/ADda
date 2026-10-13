import type { DiscoveryMode } from "@memory-streets/shared";

export type RankableMemory = {
  id: string;
  readCount: number;
  publishedAt: Date | string | null;
};

/** Deterministic Most Read ordering with stable tie-breakers. */
export function sortMostRead<T extends RankableMemory>(memories: T[]): T[] {
  return [...memories].sort((a, b) => {
    if (b.readCount !== a.readCount) return b.readCount - a.readCount;
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    if (bTime !== aTime) return bTime - aTime;
    return a.id.localeCompare(b.id);
  });
}

export function sortRecentlyAdded<T extends RankableMemory>(memories: T[]): T[] {
  return [...memories].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    if (bTime !== aTime) return bTime - aTime;
    return a.id.localeCompare(b.id);
  });
}

export function pickSurprise<T extends RankableMemory>(
  memories: T[],
  random = Math.random,
): T | null {
  if (memories.length === 0) return null;
  const sorted = [...memories].sort((a, b) => {
    if (a.readCount !== b.readCount) return a.readCount - b.readCount;
    return a.id.localeCompare(b.id);
  });
  const poolSize = Math.max(1, Math.ceil(sorted.length * 0.4));
  const pool = sorted.slice(0, poolSize);
  return pool[Math.floor(random() * pool.length)] ?? null;
}

export function orderByMode<T extends RankableMemory>(
  memories: T[],
  mode: DiscoveryMode,
): T[] {
  switch (mode) {
    case "RECENTLY_ADDED":
      return sortRecentlyAdded(memories);
    case "SURPRISE_ME": {
      const pick = pickSurprise(memories);
      return pick ? [pick] : [];
    }
    case "MOST_READ":
    case "EXPLORE_BY_TIME":
    default:
      return sortMostRead(memories);
  }
}
