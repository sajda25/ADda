import type { PlaceSummary } from "@adda/shared";

function dist2(a: PlaceSummary, b: PlaceSummary): number {
  const dLat = a.approxLat - b.approxLat;
  const dLng = a.approxLng - b.approxLng;
  return dLat * dLat + dLng * dLng;
}

/**
 * Build a tram-like route: start at the westernmost place with memories,
 * then walk nearest-neighbor so the line feels like a city ride.
 */
export function buildTramRoute(
  places: PlaceSummary[],
  maxStops = 7,
): PlaceSummary[] {
  const candidates = places
    .filter((p) => p.memoryCount > 0)
    .sort((a, b) => a.approxLng - b.approxLng || b.memoryCount - a.memoryCount);

  if (candidates.length === 0) {
    return [...places]
      .sort((a, b) => a.approxLng - b.approxLng)
      .slice(0, maxStops);
  }

  const remaining = [...candidates];
  const route: PlaceSummary[] = [remaining.shift()!];

  while (remaining.length > 0 && route.length < maxStops) {
    const here = route[route.length - 1]!;
    let bestIdx = 0;
    let best = dist2(here, remaining[0]!);
    for (let i = 1; i < remaining.length; i++) {
      const d = dist2(here, remaining[i]!);
      if (d < best) {
        best = d;
        bestIdx = i;
      }
    }
    route.push(remaining.splice(bestIdx, 1)[0]!);
  }

  return route;
}

export function lerpLatLng(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  t: number,
): { lat: number; lng: number } {
  const u = Math.min(1, Math.max(0, t));
  return {
    lat: a.lat + (b.lat - a.lat) * u,
    lng: a.lng + (b.lng - a.lng) * u,
  };
}
