export const PRESENCE_TTL_MS = 60 * 60 * 1000; // one hour

export type PresenceSummary = {
  id: string;
  memoryId: string;
  label: string;
  anchorLat: number;
  anchorLng: number;
  expiresAt: string;
  createdAt: string;
  memoryTitle: string;
  placeName: string;
  noteCount: number;
  minutesLeft: number;
};

export function minutesLeft(expiresAt: Date, now = Date.now()): number {
  return Math.max(0, Math.ceil((expiresAt.getTime() - now) / 60_000));
}

/** Tiny deterministic wander offset so each presence walks its own path. */
export function wanderOffset(
  presenceId: string,
  nowMs: number,
): { dLat: number; dLng: number } {
  let h = 0;
  for (let i = 0; i < presenceId.length; i++) {
    h = (h * 33 + presenceId.charCodeAt(i)) >>> 0;
  }
  const t = nowMs / 1000;
  const phase = (h % 360) * (Math.PI / 180);
  const radius = 0.00035 + (h % 7) * 0.00004;
  return {
    dLat: Math.sin(t * 0.35 + phase) * radius,
    dLng: Math.cos(t * 0.28 + phase * 1.3) * radius,
  };
}
