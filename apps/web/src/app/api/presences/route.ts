import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PRESENCE_TTL_MS, minutesLeft } from "@/lib/presence";

export async function GET() {
  try {
    const now = new Date();
    const rows = await prisma.livingPresence.findMany({
      where: { expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        memory: {
          select: {
            id: true,
            title: true,
            place: { select: { name: true } },
          },
        },
        _count: { select: { notes: true } },
      },
    });

    return NextResponse.json({
      presences: rows.map((p) => ({
        id: p.id,
        memoryId: p.memoryId,
        label: p.label,
        anchorLat: p.anchorLat,
        anchorLng: p.anchorLng,
        expiresAt: p.expiresAt.toISOString(),
        createdAt: p.createdAt.toISOString(),
        memoryTitle: p.memory.title,
        placeName: p.memory.place.name,
        noteCount: p._count.notes,
        minutesLeft: minutesLeft(p.expiresAt, now.getTime()),
      })),
    });
  } catch (error) {
    console.error("GET /api/presences", error);
    return NextResponse.json({ error: "Could not load presences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      memoryId?: string;
      label?: string;
    };
    const memoryId = typeof body.memoryId === "string" ? body.memoryId : "";
    if (!memoryId) {
      return NextResponse.json({ error: "memoryId required" }, { status: 400 });
    }

    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      include: {
        place: true,
        author: { select: { displayName: true } },
      },
    });

    if (
      !memory ||
      memory.status !== "PUBLISHED" ||
      memory.moderationStatus === "HIDDEN"
    ) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const labelRaw =
      typeof body.label === "string" ? body.label.trim().slice(0, 40) : "";
    const label =
      labelRaw ||
      (memory.cloaked ? "a stranger" : memory.author.displayName.split(" ")[0]!) ||
      "a stranger";

    // Jitter so multiple people at same café don't stack perfectly
    const jitter = (n: number) => (Math.random() - 0.5) * n;
    const expiresAt = new Date(Date.now() + PRESENCE_TTL_MS);

    const presence = await prisma.livingPresence.create({
      data: {
        memoryId: memory.id,
        label,
        anchorLat: memory.place.approxLat + jitter(0.0008),
        anchorLng: memory.place.approxLng + jitter(0.0008),
        expiresAt,
      },
    });

    return NextResponse.json({
      presence: {
        id: presence.id,
        memoryId: presence.memoryId,
        label: presence.label,
        anchorLat: presence.anchorLat,
        anchorLng: presence.anchorLng,
        expiresAt: presence.expiresAt.toISOString(),
        createdAt: presence.createdAt.toISOString(),
        memoryTitle: memory.title,
        placeName: memory.place.name,
        noteCount: 0,
        minutesLeft: minutesLeft(presence.expiresAt),
      },
      notice: `You are a place for one hour. Strangers can leave notes on your shoulder.`,
    });
  } catch (error) {
    console.error("POST /api/presences", error);
    return NextResponse.json({ error: "Could not step onto the map" }, { status: 500 });
  }
}
