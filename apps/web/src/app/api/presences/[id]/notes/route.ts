import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      body?: string;
      signedAs?: string;
    };
    const noteBody = typeof body.body === "string" ? body.body.trim() : "";
    const signedAs =
      (typeof body.signedAs === "string" ? body.signedAs.trim() : "").slice(
        0,
        40,
      ) || "a stranger";

    if (noteBody.length < 2 || noteBody.length > 280) {
      return NextResponse.json(
        { error: "Note must be between 2 and 280 characters" },
        { status: 400 },
      );
    }

    const presence = await prisma.livingPresence.findUnique({
      where: { id },
    });
    if (!presence) {
      return NextResponse.json({ error: "Presence not found" }, { status: 404 });
    }
    if (presence.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "This person has dissolved back into a person." },
        { status: 410 },
      );
    }

    const note = await prisma.presenceNote.create({
      data: {
        presenceId: presence.id,
        body: noteBody,
        signedAs,
      },
    });

    return NextResponse.json({
      note: {
        id: note.id,
        body: note.body,
        signedAs: note.signedAs,
        createdAt: note.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/presences/[id]/notes", error);
    return NextResponse.json({ error: "Could not leave a note" }, { status: 500 });
  }
}
