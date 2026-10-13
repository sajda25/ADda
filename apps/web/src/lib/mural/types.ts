import type { TemporalLayer } from "@adda/shared";

export type MuralMotifKind =
  | "tea"
  | "rain"
  | "bus"
  | "school"
  | "tree"
  | "market"
  | "music"
  | "family"
  | "road"
  | "lamp";

export interface MuralInput {
  placeId: string;
  styleSeed: string;
  epochSeed: string;
  engineVersion: string;
  tags: string[];
  layerWeights: Partial<Record<TemporalLayer, number>>;
  relationCount: number;
  archiveSize: number;
  preservationScore?: number;
  previousArtworkHash?: string | null;
}

export interface MuralCause {
  whatChanged: string;
  contributingMemoryIds: string[];
  dominantTags: string[];
  layerEmphasis: TemporalLayer[];
  relationInfluence: number;
  epochLabel: string;
  carriedForward: string;
}

export interface MuralRenderResult {
  artworkHash: string;
  motifs: MuralMotifKind[];
  cause: MuralCause;
}
