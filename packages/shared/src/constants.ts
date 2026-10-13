/** Product constants shared across packages */

export const APP_NAME = "ADda";

export const DEMO_DISTRICT_ID = "kolkata-demo";

export const DEMO_DISTRICT_LABEL =
  "College Street Demo District, Kolkata (Illustrative)";

/** Demo cities available on the map / publish form */
export const DEMO_CITIES = [
  {
    id: "kolkata-demo",
    name: "Kolkata",
    state: "West Bengal",
    centerLat: 22.5758,
    centerLng: 88.3639,
    zoom: 13,
  },
  {
    id: "bengaluru-demo",
    name: "Bengaluru",
    state: "Karnataka",
    centerLat: 12.9716,
    centerLng: 77.5946,
    zoom: 12,
  },
  {
    id: "mumbai-demo",
    name: "Mumbai",
    state: "Maharashtra",
    centerLat: 19.076,
    centerLng: 72.8777,
    zoom: 12,
  },
  {
    id: "delhi-demo",
    name: "Delhi",
    state: "Delhi",
    centerLat: 28.6139,
    centerLng: 77.209,
    zoom: 12,
  },
  {
    id: "chandigarh-demo",
    name: "Chandigarh",
    state: "Chandigarh",
    centerLat: 30.7333,
    centerLng: 76.7794,
    zoom: 13,
  },
  {
    id: "chennai-demo",
    name: "Chennai",
    state: "Tamil Nadu",
    centerLat: 13.0827,
    centerLng: 80.2707,
    zoom: 12,
  },
  {
    id: "hyderabad-demo",
    name: "Hyderabad",
    state: "Telangana",
    centerLat: 17.385,
    centerLng: 78.4867,
    zoom: 12,
  },
  {
    id: "pune-demo",
    name: "Pune",
    state: "Maharashtra",
    centerLat: 18.5204,
    centerLng: 73.8567,
    zoom: 12,
  },
] as const;

export type DemoCityId = (typeof DEMO_CITIES)[number]["id"];

export function demoCityById(id: string) {
  return DEMO_CITIES.find((c) => c.id === id) ?? null;
}

export function demoCityByName(name: string) {
  const key = name.trim().toLowerCase();
  return DEMO_CITIES.find((c) => c.name.toLowerCase() === key) ?? null;
}

export const TEMPORAL_LAYERS = [
  "NOW",
  "BEFORE_CHANGE",
  "CHILDHOOD_CAMPUS",
] as const;

export const LAYER_LABELS: Record<(typeof TEMPORAL_LAYERS)[number], string> = {
  NOW: "Now",
  BEFORE_CHANGE: "Before the change",
  CHILDHOOD_CAMPUS: "Childhood & campus",
};

export const RELATION_TYPES = [
  "ECHO",
  "CONTINUATION",
  "CONTRADICTION",
  "TRANSFORM",
  "RELATED",
] as const;

export const RELATION_LABELS: Record<(typeof RELATION_TYPES)[number], string> =
  {
    ECHO: "Echo",
    CONTINUATION: "Continuation",
    CONTRADICTION: "Contradiction",
    TRANSFORM: "Transform",
    RELATED: "Related",
  };

export const DISCOVERY_MODES = [
  "MOST_READ",
  "RECENTLY_ADDED",
  "SURPRISE_ME",
  "EXPLORE_BY_TIME",
] as const;

export const DISCOVERY_LABELS: Record<
  (typeof DISCOVERY_MODES)[number],
  string
> = {
  MOST_READ: "Most Read",
  RECENTLY_ADDED: "Recently Added",
  SURPRISE_ME: "Surprise Me",
  EXPLORE_BY_TIME: "Explore by Time",
};

/** Monad Testnet */
export const MONAD_CHAIN_ID = 10143;
export const MONAD_RPC_DEFAULT = "https://testnet-rpc.monad.xyz";
export const MONAD_EXPLORER_DEFAULT = "https://testnet.monadexplorer.com";

/** Mural engine version — bump when rendering rules change */
export const MURAL_ENGINE_VERSION = "1.0.0";

/** Qualified-read deduplication window (hours) */
export const READ_DEDUP_HOURS = 24;

/** Polling interval for demo live updates (ms) */
export const DEMO_POLL_INTERVAL_MS = 2000;

export const FUNDING_DISCLAIMER =
  "Funding supports preservation. It does not buy influence over stories.";
