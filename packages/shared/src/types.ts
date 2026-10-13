/** Shared domain types for MEMORY STREETS */

export type TemporalLayer = "NOW" | "BEFORE_CHANGE" | "CHILDHOOD_CAMPUS";

export type MemoryStatus = "DRAFT" | "PUBLISHED" | "HIDDEN" | "REMOVED";

export type ModerationStatus = "CLEAR" | "REPORTED" | "UNDER_REVIEW" | "HIDDEN";

export type RelationType =
  | "ECHO"
  | "CONTINUATION"
  | "CONTRADICTION"
  | "TRANSFORM"
  | "RELATED";

export type RelationStatus = "ACTIVE" | "SUGGESTED" | "REMOVED";

export type DiscoveryMode =
  | "MOST_READ"
  | "RECENTLY_ADDED"
  | "SURPRISE_ME"
  | "EXPLORE_BY_TIME";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlaceSummary {
  id: string;
  name: string;
  neighborhoodId: string;
  neighborhoodLabel: string;
  city?: string;
  state?: string;
  description: string;
  approxLat: number;
  approxLng: number;
  memoryCount: number;
  layers: TemporalLayer[];
  isDemo?: boolean;
  imageUrl?: string | null;
  /** Top story tease for map torn-edge peeks */
  teaserTitle?: string | null;
  teaserExcerpt?: string | null;
}

export interface CitySummary {
  id: string;
  name: string;
  state: string;
  label: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  placeCount: number;
}

export interface MemorySummary {
  id: string;
  placeId: string;
  title: string;
  excerpt: string;
  layer: TemporalLayer;
  tags: string[];
  authorDisplayName: string;
  cloaked: boolean;
  publishedAt: string;
  readCount: number;
  status: MemoryStatus;
  onChain: boolean;
  contentHash?: string | null;
  imageUrl?: string | null;
}

export interface MemoryRelationSummary {
  id: string;
  sourceMemoryId: string;
  targetMemoryId: string;
  relationType: RelationType;
  description: string | null;
  status: RelationStatus;
  targetTitle?: string;
}

export interface MuralEpochSummary {
  id: string;
  placeId: string;
  epochNumber: number;
  seed: string;
  contributingMemoryIds: string[];
  engineVersion: string;
  artworkHash: string;
  preservationScore: number;
  txHash: string | null;
  simulated: boolean;
  createdAt: string;
}
