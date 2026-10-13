import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isTemporalLayer } from "@adda/shared";
import { exteriorImageForPlace } from "@/lib/placeImages";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const placeId = searchParams.get("placeId");
    const layerParam = searchParams.get("layer");
    const mode = searchParams.get("mode") ?? "MOST_READ";

    if (!placeId) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    const layer =
      layerParam && isTemporalLayer(layerParam) ? layerParam : undefined;

    if (mode === "SURPRISE_ME") {
      const lesser = await prisma.memory.findMany({
        where: {
          placeId,
          status: "PUBLISHED",
          moderationStatus: "CLEAR",
          ...(layer ? { layer } : {}),
        },
        include: { author: true },
        orderBy: [{ readCount: "asc" }, { publishedAt: "asc" }, { id: "asc" }],
        take: 8,
      });
      if (lesser.length === 0) {
        return NextResponse.json({ memories: [], mode });
      }
      const pick = lesser[Math.floor(Math.random() * lesser.length)]!;
      return NextResponse.json({
        memories: [serializeMemory(pick)],
        mode,
      });
    }

    const memories = await prisma.memory.findMany({
      where: {
        placeId,
        status: "PUBLISHED",
        moderationStatus: "CLEAR",
        ...(layer ? { layer } : {}),
      },
      include: { author: true },
      orderBy:
        mode === "RECENTLY_ADDED"
          ? [{ publishedAt: "desc" }, { id: "asc" }]
          : [{ readCount: "desc" }, { publishedAt: "desc" }, { id: "asc" }],
    });

    return NextResponse.json({
      memories: memories.map(serializeMemory),
      mode,
    });
  } catch (error) {
    console.error("GET /api/memories", error);
    return NextResponse.json(
      { error: "Failed to load memories" },
      { status: 500 },
    );
  }
}

function serializeMemory(memory: {
  id: string;
  placeId: string;
  title: string;
  text: string;
  layer: string;
  tags: string[];
  cloaked: boolean;
  publishedAt: Date | null;
  readCount: number;
  status: string;
  onChain: boolean;
  contentHash: string | null;
  author: { displayName: string };
}) {
  const excerpt =
    memory.text.length > 180
      ? `${memory.text.slice(0, 177).trimEnd()}…`
      : memory.text;

  return {
    id: memory.id,
    placeId: memory.placeId,
    title: memory.title,
    excerpt,
    layer: memory.layer,
    tags: memory.tags,
    authorDisplayName: memory.cloaked ? "A neighbor" : memory.author.displayName,
    cloaked: memory.cloaked,
    publishedAt: memory.publishedAt?.toISOString() ?? null,
    readCount: memory.readCount,
    status: memory.status,
    onChain: memory.onChain,
    contentHash: memory.contentHash,
    imageUrl: exteriorImageForPlace(memory.placeId),
  };
}
