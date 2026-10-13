import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { questionForScrap } from "@/lib/scrapQuestion";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const memory = await prisma.memory.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        text: true,
        tags: true,
        status: true,
        moderationStatus: true,
        place: { select: { name: true } },
      },
    });

    if (
      !memory ||
      memory.status !== "PUBLISHED" ||
      memory.moderationStatus === "HIDDEN"
    ) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const footnotes = await prisma.memoryFootnote.findMany({
      where: { memoryId: id },
      orderBy: { createdAt: "desc" },
      take: 40,
    });

    return NextResponse.json({
      question: questionForScrap({
        id: memory.id,
        title: memory.title,
        text: memory.text,
        tags: memory.tags,
        placeName: memory.place.name,
      }),
      footnotes: footnotes.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        signedAs: f.signedAs,
        createdAt: f.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/memories/[id]/footnotes", error);
    return NextResponse.json({ error: "Could not load footnotes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      answer?: string;
      signedAs?: string;
    };
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    const signedAsRaw =
      typeof body.signedAs === "string" ? body.signedAs.trim() : "";
    const signedAs = signedAsRaw.slice(0, 40) || "a stranger";

    if (answer.length < 2 || answer.length > 480) {
      return NextResponse.json(
        { error: "Answer must be between 2 and 480 characters" },
        { status: 400 },
      );
    }

    const memory = await prisma.memory.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        text: true,
        tags: true,
        status: true,
        moderationStatus: true,
        place: { select: { name: true } },
      },
    });

    if (
      !memory ||
      memory.status !== "PUBLISHED" ||
      memory.moderationStatus === "HIDDEN"
    ) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const question = questionForScrap({
      id: memory.id,
      title: memory.title,
      text: memory.text,
      tags: memory.tags,
      placeName: memory.place.name,
    });

    const footnote = await prisma.memoryFootnote.create({
      data: {
        memoryId: memory.id,
        question,
        answer,
        signedAs,
      },
    });

    return NextResponse.json({
      footnote: {
        id: footnote.id,
        question: footnote.question,
        answer: footnote.answer,
        signedAs: footnote.signedAs,
        createdAt: footnote.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/memories/[id]/footnotes", error);
    return NextResponse.json({ error: "Could not save footnote" }, { status: 500 });
  }
}
