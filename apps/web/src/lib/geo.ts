import { demoNeighborhood } from "@/lib/seed/demoNeighborhood";

export const DEMO_MAP_CENTER = {
  lat: demoNeighborhood.centerLat,
  lng: demoNeighborhood.centerLng,
} as const;

export const DEMO_MAP_ZOOM = 14;

/**
 * Free OpenStreetMap raster tiles — no API key required.
 * (Carto Voyager now watermarks without a key, which broke the demo map.)
 */
export const ARCHIVAL_TILE_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const ARCHIVAL_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
