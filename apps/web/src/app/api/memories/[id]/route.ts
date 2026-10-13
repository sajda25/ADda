import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { imageForPlace } from "@/lib/placeImages";
import { imagesForStory } from "@/lib/storyImages";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const memory = await prisma.memory.findUnique({
      where: { id },
      include: {
        author: true,
        place: { include: { neighborhood: true } },
        relationsFrom: {
          where: { status: "ACTIVE" },
          include: {
            targetMemory: {
              select: { id: true, title: true, layer: true, readCount: true },
            },
          },
        },
        relationsTo: {
          where: { status: "ACTIVE" },
          include: {
            sourceMemory: {
              select: { id: true, title: true, layer: true, readCount: true },
            },
          },
        },
      },
    });

    if (
      !memory ||
      memory.status !== "PUBLISHED" ||
      memory.moderationStatus === "HIDDEN"
    ) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const echoes = [
      ...memory.relationsFrom.map((r) => ({
        id: r.id,
        relationType: r.relationType,
        description: r.description,
        direction: "from" as const,
        memory: r.targetMemory,
      })),
      ...memory.relationsTo.map((r) => ({
        id: r.id,
        relationType: r.relationType,
        description: r.description,
        direction: "to" as const,
        memory: r.sourceMemory,
      })),
    ];

    return NextResponse.json({
      id: memory.id,
      placeId: memory.placeId,
      title: memory.title,
      text: memory.text,
      layer: memory.layer,
      tags: memory.tags,
      authorDisplayName: memory.cloaked
        ? "A neighbor"
        : memory.author.displayName,
      cloaked: memory.cloaked,
      publishedAt: memory.publishedAt?.toISOString() ?? null,
      readCount: memory.readCount,
      onChain: memory.onChain,
      contentHash: memory.contentHash,
      txHash: memory.txHash,
      isDemo: memory.isDemo,
      place: {
        id: memory.place.id,
        name: memory.place.name,
        neighborhoodLabel: memory.place.neighborhood.label,
        approxLat: memory.place.approxLat,
        approxLng: memory.place.approxLng,
        description: memory.place.description,
        ...imageForPlace(memory.place.id, memory.tags),
      },
      images: imagesForStory(memory.id),
      echoes,
    });
  } catch (error) {
    console.error("GET /api/memories/[id]", error);
    return NextResponse.json({ error: "Failed to load memory" }, { status: 500 });
  }
}
