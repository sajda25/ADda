import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SEED_VERSION } from "@/lib/seed/demoNeighborhood";

/**
 * Demo-facing seed status. Actual reseed is performed via `pnpm seed`.
 * POST triggers an in-process reseed only when DEMO_MODE is enabled.
 */
export async function GET() {
  const meta = await prisma.seedMeta.findUnique({
    where: { id: "demo-district" },
  });
  const memories = await prisma.memory.count({ where: { isDemo: true } });
  const places = await prisma.place.count({ where: { isDemo: true } });

  return NextResponse.json({
    seeded: Boolean(meta),
    version: meta?.version ?? null,
    expectedVersion: SEED_VERSION,
    places,
    memories,
    appliedAt: meta?.appliedAt?.toISOString() ?? null,
  });
}
