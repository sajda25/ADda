/**
 * Lightweight runtime validators for API payloads.
 * Zod can be introduced later; keep Phase 1 dependency-free.
 */

import type { RelationType, TemporalLayer } from "./types";
import { RELATION_TYPES, TEMPORAL_LAYERS } from "./constants";

export function isTemporalLayer(value: unknown): value is TemporalLayer {
  return (
    typeof value === "string" &&
    (TEMPORAL_LAYERS as readonly string[]).includes(value)
  );
}

export function isRelationType(value: unknown): value is RelationType {
  return (
    typeof value === "string" &&
    (RELATION_TYPES as readonly string[]).includes(value)
  );
}

export interface PublishMemoryInput {
  placeId: string;
  title: string;
  text: string;
  layer: TemporalLayer;
  tags: string[];
  displayName: string;
  cloaked: boolean;
}

export function validatePublishMemory(
  input: unknown,
): { ok: true; data: PublishMemoryInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid body" };
  }

  const body = input as Record<string, unknown>;
  const placeId = typeof body.placeId === "string" ? body.placeId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : "";
  const cloaked = Boolean(body.cloaked);
  const layer = body.layer;
  const tagsRaw = body.tags;

  if (!placeId) return { ok: false, error: "placeId is required" };
  if (title.length < 3 || title.length > 120) {
    return { ok: false, error: "Title must be between 3 and 120 characters" };
  }
  if (text.length < 40 || text.length > 8000) {
    return {
      ok: false,
      error: "Memory text must be between 40 and 8000 characters",
    };
  }
  if (!isTemporalLayer(layer)) {
    return { ok: false, error: "Invalid temporal layer" };
  }
  if (!displayName || displayName.length > 60) {
    return {
      ok: false,
      error: "Display name is required (max 60 characters)",
    };
  }

  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 12)
    : [];

  return {
    ok: true,
    data: { placeId, title, text, layer, tags, displayName, cloaked },
  };
}

export interface CreatePlaceInput {
  neighborhoodId: string;
  name: string;
  description: string;
  approxLat?: number;
  approxLng?: number;
}

export function validateCreatePlace(
  input: unknown,
): { ok: true; data: CreatePlaceInput } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid body" };
  }

  const body = input as Record<string, unknown>;
  const neighborhoodId =
    typeof body.neighborhoodId === "string" ? body.neighborhoodId.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : "A neighbor-added place on ADda.";
  const approxLat =
    typeof body.approxLat === "number" && Number.isFinite(body.approxLat)
      ? body.approxLat
      : undefined;
  const approxLng =
    typeof body.approxLng === "number" && Number.isFinite(body.approxLng)
      ? body.approxLng
      : undefined;

  if (!neighborhoodId) {
    return { ok: false, error: "neighborhoodId (city) is required" };
  }
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Place name must be between 2 and 80 characters" };
  }
  if (description.length > 400) {
    return { ok: false, error: "Description must be under 400 characters" };
  }
  if (
    (approxLat !== undefined && (approxLat < -90 || approxLat > 90)) ||
    (approxLng !== undefined && (approxLng < -180 || approxLng > 180))
  ) {
    return { ok: false, error: "Coordinates look invalid" };
  }

  return {
    ok: true,
    data: { neighborhoodId, name, description, approxLat, approxLng },
  };
}
