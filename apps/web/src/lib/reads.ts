import { createHash, randomUUID } from "node:crypto";
import { READ_DEDUP_HOURS } from "@memory-streets/shared";
import { prisma } from "@/lib/db";

export function hashReaderKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function dedupeBucket(date = new Date()): string {
  // Bucket by READ_DEDUP_HOURS window start (UTC)
  const ms = READ_DEDUP_HOURS * 60 * 60 * 1000;
  const bucketStart = Math.floor(date.getTime() / ms) * ms;
  return new Date(bucketStart).toISOString();
}

export async function recordQualifiedRead(input: {
  memoryId: string;
  readerKeyRaw: string;
}): Promise<{ accepted: boolean; readCount: number }> {
  const memory = await prisma.memory.findUnique({
    where: { id: input.memoryId },
    select: { id: true, status: true, moderationStatus: true, readCount: true },
  });

  if (
    !memory ||
    memory.status !== "PUBLISHED" ||
    memory.moderationStatus === "HIDDEN"
  ) {
    throw new Error("Memory not available");
  }

  const readerKey = hashReaderKey(input.readerKeyRaw);
  const bucket = dedupeBucket();

  try {
    await prisma.storyRead.create({
      data: {
        memoryId: memory.id,
        readerKey,
        dedupeBucket: bucket,
      },
    });
  } catch (error) {
    // Unique constraint → duplicate within window
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { accepted: false, readCount: memory.readCount };
    }
    throw error;
  }

  const updated = await prisma.memory.update({
    where: { id: memory.id },
    data: { readCount: { increment: 1 } },
    select: { readCount: true },
  });

  return { accepted: true, readCount: updated.readCount };
}

export function newAnonymousReaderSeed(): string {
  return randomUUID();
}
