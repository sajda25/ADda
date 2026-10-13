import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readLetterToken } from "@/lib/letters";

type Params = { params: Promise<{ token: string }> };

/** Sealed peek only — never returns story title or body. */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const payload = readLetterToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    const memory = await prisma.memory.findUnique({
      where: { id: payload.m },
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
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    return NextResponse.json({
      token,
      memoryId: memory.id,
      placeName: memory.place.name,
      neighborhoodLabel: memory.place.neighborhood.label,
      fromLabel: memory.cloaked
        ? "someone who was there"
        : memory.author.displayName,
      sealedAt: payload.t || null,
    });
  } catch (error) {
    console.error("GET /api/letters/[token]", error);
    return NextResponse.json({ error: "Could not open letter" }, { status: 500 });
  }
}
