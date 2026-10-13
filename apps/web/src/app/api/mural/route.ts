import { NextRequest, NextResponse } from "next/server";
import { MURAL_ENGINE_VERSION } from "@memory-streets/shared";
import { prisma } from "@/lib/db";
import {
  analyzeMuralInput,
  defaultMuralInput,
} from "@/lib/mural/engine";
import type { TemporalLayer } from "@memory-streets/shared";

export async function GET(request: NextRequest) {
  try {
    const placeId = request.nextUrl.searchParams.get("placeId");
    const epochId = request.nextUrl.searchParams.get("epochId");
    if (!placeId) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const epochs = await prisma.muralEpoch.findMany({
      where: { placeId },
      orderBy: { epochNumber: "asc" },
    });

    const selected =
      (epochId
        ? epochs.find((e) => e.id === epochId)
        : epochs[epochs.length - 1]) ?? null;

    const memories = await prisma.memory.findMany({
      where: {
        placeId,
        status: "PUBLISHED",
        moderationStatus: "CLEAR",
      },
      select: {
        id: true,
        tags: true,
        layer: true,
        readCount: true,
      },
    });

    const contributingIds =
      selected?.contributingMemoryIds ?? memories.map((m) => m.id);

    const contributing = memories.filter((m) =>
      contributingIds.includes(m.id),
    );

    const tags = contributing.flatMap((m) => m.tags);
    const layerWeights: Partial<Record<TemporalLayer, number>> = {};
    for (const memory of contributing) {
      layerWeights[memory.layer] = (layerWeights[memory.layer] ?? 0) + 1;
    }

    const relationCount = await prisma.memoryRelation.count({
      where: {
        status: "ACTIVE",
        OR: [
          { sourceMemoryId: { in: contributingIds } },
          { targetMemoryId: { in: contributingIds } },
        ],
      },
    });

    const previous =
      selected && selected.epochNumber > 1
        ? epochs.find((e) => e.epochNumber === selected.epochNumber - 1)
        : epochs.length > 1
          ? epochs[epochs.length - 2]
          : null;

    const input = defaultMuralInput({
      placeId,
      styleSeed: `${place.neighborhoodId}:${place.id}`,
      epochSeed: selected?.seed ?? `${place.id}:live`,
      engineVersion: selected?.engineVersion ?? MURAL_ENGINE_VERSION,
      tags,
      layerWeights,
      relationCount,
      archiveSize: contributing.length,
      preservationScore: selected?.preservationScore ?? 0,
      previousArtworkHash: previous?.artworkHash ?? null,
    });

    const analysis = analyzeMuralInput(
      input,
      contributingIds,
      selected
        ? `Epoch ${selected.epochNumber}${selected.simulated ? " · simulated" : ""}`
        : "Live preview",
    );

    return NextResponse.json({
      placeId,
      input,
      analysis,
      epochs: epochs.map((e) => ({
        id: e.id,
        epochNumber: e.epochNumber,
        seed: e.seed,
        artworkHash: e.artworkHash,
        contributingMemoryIds: e.contributingMemoryIds,
        engineVersion: e.engineVersion,
        preservationScore: e.preservationScore,
        simulated: e.simulated,
        txHash: e.txHash,
        createdAt: e.createdAt.toISOString(),
      })),
      selectedEpochId: selected?.id ?? null,
    });
  } catch (error) {
    console.error("GET /api/mural", error);
    return NextResponse.json({ error: "Failed to load mural" }, { status: 500 });
  }
}
