import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { validatePublishMemory } from "@adda/shared";
import { prisma } from "@/lib/db";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = validatePublishMemory(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const place = await prisma.place.findUnique({
      where: { id: parsed.data.placeId },
    });
    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const author = await prisma.user.upsert({
      where: { id: `local_${parsed.data.displayName.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}` },
      create: {
        id: `local_${parsed.data.displayName.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}`,
        displayName: parsed.data.displayName,
        cloakedDefault: parsed.data.cloaked,
        isDemo: false,
      },
      update: {
        displayName: parsed.data.displayName,
        cloakedDefault: parsed.data.cloaked,
      },
    });

    const contentHash = createHash("sha256")
      .update(
        JSON.stringify({
          title: parsed.data.title,
          text: parsed.data.text,
          placeId: parsed.data.placeId,
          layer: parsed.data.layer,
        }),
      )
      .digest("hex");

    const memory = await prisma.memory.create({
      data: {
        placeId: parsed.data.placeId,
        authorId: author.id,
        title: parsed.data.title,
        text: parsed.data.text,
        layer: parsed.data.layer,
        tags: parsed.data.tags,
        cloaked: parsed.data.cloaked,
        contentHash,
        status: "PUBLISHED",
        moderationStatus: "CLEAR",
        visibility: "PUBLIC",
        publishedAt: new Date(),
        onChain: false,
        isDemo: false,
        cellId: parsed.data.placeId,
        readCount: 0,
      },
    });

    // You become a place for one hour
    const jitter = (n: number) => (Math.random() - 0.5) * n;
    const label = parsed.data.cloaked
      ? "a stranger"
      : parsed.data.displayName.split(/\s+/)[0] || "a stranger";
    const presence = await prisma.livingPresence.create({
      data: {
        memoryId: memory.id,
        label,
        anchorLat: place.approxLat + jitter(0.0008),
        anchorLng: place.approxLng + jitter(0.0008),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      ok: true,
      memory: {
        id: memory.id,
        placeId: memory.placeId,
        title: memory.title,
        contentHash: memory.contentHash,
        onChain: memory.onChain,
        publishedAt: memory.publishedAt?.toISOString(),
      },
      presence: {
        id: presence.id,
        expiresAt: presence.expiresAt.toISOString(),
        label: presence.label,
      },
      notice:
        "Published — and you are now a place on the map for one hour. Strangers can leave notes on your shoulder.",
    });
  } catch (error) {
    console.error("POST /api/memories/publish", error);
    return NextResponse.json(
      { error: "Publication failed" },
      { status: 500 },
    );
  }
}
