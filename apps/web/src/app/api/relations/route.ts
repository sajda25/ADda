import { NextRequest, NextResponse } from "next/server";
import { isRelationType } from "@adda/shared";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const memoryId = request.nextUrl.searchParams.get("memoryId");
    if (!memoryId) {
      return NextResponse.json({ error: "memoryId is required" }, { status: 400 });
    }

    const relations = await prisma.memoryRelation.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ sourceMemoryId: memoryId }, { targetMemoryId: memoryId }],
      },
      include: {
        sourceMemory: { select: { id: true, title: true } },
        targetMemory: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ relations });
  } catch (error) {
    console.error("GET /api/relations", error);
    return NextResponse.json(
      { error: "Failed to load relations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const sourceMemoryId =
      typeof body.sourceMemoryId === "string" ? body.sourceMemoryId : "";
    const targetMemoryId =
      typeof body.targetMemoryId === "string" ? body.targetMemoryId : "";
    const relationType = body.relationType;
    const description =
      typeof body.description === "string" ? body.description.trim() : null;

    if (!sourceMemoryId || !targetMemoryId) {
      return NextResponse.json(
        { error: "sourceMemoryId and targetMemoryId are required" },
        { status: 400 },
      );
    }
    if (sourceMemoryId === targetMemoryId) {
      return NextResponse.json(
        { error: "A memory cannot relate to itself" },
        { status: 400 },
      );
    }
    if (!isRelationType(relationType)) {
      return NextResponse.json({ error: "Invalid relationType" }, { status: 400 });
    }

    const [source, target] = await Promise.all([
      prisma.memory.findUnique({ where: { id: sourceMemoryId } }),
      prisma.memory.findUnique({ where: { id: targetMemoryId } }),
    ]);
    if (!source || !target) {
      return NextResponse.json(
        { error: "Referenced memories must exist" },
        { status: 400 },
      );
    }

    try {
      const relation = await prisma.memoryRelation.create({
        data: {
          sourceMemoryId,
          targetMemoryId,
          relationType,
          description,
          status: "ACTIVE",
        },
      });
      return NextResponse.json({ relation }, { status: 201 });
    } catch (error) {
      if (
        typeof error === "object" &&
        error &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Duplicate relation" },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("POST /api/relations", error);
    return NextResponse.json(
      { error: "Failed to create relation" },
      { status: 500 },
    );
  }
}
