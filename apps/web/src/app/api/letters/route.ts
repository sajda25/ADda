import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mintLetterToken } from "@/lib/letters";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { memoryId?: string };
    const memoryId = typeof body.memoryId === "string" ? body.memoryId : "";
    if (!memoryId) {
      return NextResponse.json({ error: "memoryId required" }, { status: 400 });
    }

    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      include: {
        author: { select: { displayName: true } },
        place: {
          select: {
            name: true,
            neighborhood: { select: { label: true } },
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

    const token = mintLetterToken(memory.id);
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      token,
      url: `${origin}/letter/${token}`,
      placeName: memory.place.name,
      neighborhoodLabel: memory.place.neighborhood.label,
      fromLabel: memory.cloaked
        ? "someone who was there"
        : memory.author.displayName,
    });
  } catch (error) {
    console.error("POST /api/letters", error);
    return NextResponse.json({ error: "Could not seal letter" }, { status: 500 });
  }
}
