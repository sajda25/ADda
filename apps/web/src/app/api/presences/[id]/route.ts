import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { minutesLeft } from "@/lib/presence";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const now = new Date();
    const presence = await prisma.livingPresence.findUnique({
      where: { id },
      include: {
        memory: {
          select: {
            id: true,
            title: true,
            text: true,
            place: { select: { id: true, name: true } },
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    });

    if (!presence) {
      return NextResponse.json({ error: "Presence not found" }, { status: 404 });
    }

    const expired = presence.expiresAt.getTime() <= now.getTime();

    return NextResponse.json({
      presence: {
        id: presence.id,
        memoryId: presence.memoryId,
        label: presence.label,
        anchorLat: presence.anchorLat,
        anchorLng: presence.anchorLng,
        expiresAt: presence.expiresAt.toISOString(),
        createdAt: presence.createdAt.toISOString(),
        memoryTitle: presence.memory.title,
        placeName: presence.memory.place.name,
        placeId: presence.memory.place.id,
        excerpt: presence.memory.text.slice(0, 180),
        noteCount: presence.notes.length,
        minutesLeft: minutesLeft(presence.expiresAt, now.getTime()),
        expired,
      },
      notes: presence.notes.map((n) => ({
        id: n.id,
        body: n.body,
        signedAs: n.signedAs,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/presences/[id]", error);
    return NextResponse.json({ error: "Could not load presence" }, { status: 500 });
  }
}
