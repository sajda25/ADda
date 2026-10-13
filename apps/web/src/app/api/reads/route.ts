import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  newAnonymousReaderSeed,
  recordQualifiedRead,
} from "@/lib/reads";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
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
    const body = (await request.json()) as { memoryId?: string };
    const memoryId = typeof body.memoryId === "string" ? body.memoryId : "";
    if (!memoryId) {
      return NextResponse.json({ error: "memoryId is required" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!rateLimit(`${ip}:${memoryId}`)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const cookieStore = await cookies();
    let readerSeed = cookieStore.get("ms_reader")?.value;
    let shouldSetCookie = false;

    if (!readerSeed) {
      readerSeed = newAnonymousReaderSeed();
      shouldSetCookie = true;
    }

    const result = await recordQualifiedRead({
      memoryId,
      readerKeyRaw: readerSeed,
    });

    const response = NextResponse.json({
      accepted: result.accepted,
      readCount: result.readCount,
    });

    if (shouldSetCookie) {
      response.cookies.set("ms_reader", readerSeed, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error("POST /api/reads", error);
    return NextResponse.json(
      { error: "Failed to record read" },
      { status: 500 },
    );
  }
}
