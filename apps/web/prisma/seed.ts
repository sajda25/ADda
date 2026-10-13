/**
 * Idempotent multi-city demo seed.
 * Clears previous demo neighborhoods, then upserts stable IDs.
 */

import { PrismaClient } from "@prisma/client";
import {
  SEED_VERSION,
  assertSeedIntegrity,
  demoNeighborhood,
  seedEpochs,
  seedMemories,
  seedPlaces,
  seedRelations,
  seedUsers,
} from "../src/lib/seed/demoNeighborhood";
import {
  seedCityMemories,
  seedCityPlaces,
  seedNeighborhoods,
} from "../src/lib/seed/demoCities";

const prisma = new PrismaClient();

async function main() {
  assertSeedIntegrity(
    seedCityPlaces.map((p) => p.id),
    seedCityMemories,
  );

  const allMemories = [...seedMemories, ...seedCityMemories];
  const neighborhoodIds = seedNeighborhoods.map((n) => n.id);

  console.log(`Seeding ADda demo (${SEED_VERSION})…`);
  console.log(
    `Cities: ${seedNeighborhoods.length}, Places: ${seedPlaces.length + seedCityPlaces.length}, Memories: ${allMemories.length}`,
  );

  // Wipe all prior demo districts (Kolkata + other cities)
  await prisma.neighborhood.deleteMany({
    where: {
      OR: [{ isDemo: true }, { id: { in: neighborhoodIds } }],
    },
  });

  await prisma.user.deleteMany({
    where: { isDemo: true },
  });

  for (const n of seedNeighborhoods) {
    await prisma.neighborhood.create({
      data: {
        id: n.id,
        label: n.label,
        description: n.description,
        centerLat: n.centerLat,
        centerLng: n.centerLng,
        isDemo: true,
      },
    });
  }

  for (const user of seedUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        displayName: user.displayName,
        cloakedDefault: user.cloakedDefault,
        isDemo: true,
      },
    });
  }

  for (const place of seedPlaces) {
    await prisma.place.create({
      data: {
        id: place.id,
        neighborhoodId: demoNeighborhood.id,
        name: place.name,
        description: place.description,
        approxLat: place.approxLat,
        approxLng: place.approxLng,
        isDemo: true,
      },
    });
  }

  for (const place of seedCityPlaces) {
    await prisma.place.create({
      data: {
        id: place.id,
        neighborhoodId: place.neighborhoodId,
        name: place.name,
        description: place.description,
        approxLat: place.approxLat,
        approxLng: place.approxLng,
        isDemo: true,
      },
    });
  }

  for (const memory of allMemories) {
    await prisma.memory.create({
      data: {
        id: memory.id,
        placeId: memory.placeId,
        authorId: memory.authorId,
        title: memory.title,
        text: memory.text,
        layer: memory.layer,
        tags: memory.tags,
        cloaked: memory.cloaked,
        readCount: memory.readCount,
        contentHash: memory.contentHash,
        status: "PUBLISHED",
        moderationStatus: "CLEAR",
        visibility: "PUBLIC",
        publishedAt: new Date(memory.publishedAt),
        onChain: false,
        isDemo: true,
        cellId: memory.placeId,
      },
    });
  }

  for (const relation of seedRelations) {
    await prisma.memoryRelation.create({
      data: {
        id: relation.id,
        sourceMemoryId: relation.sourceMemoryId,
        targetMemoryId: relation.targetMemoryId,
        relationType: relation.relationType,
        description: relation.description,
        status: "ACTIVE",
        createdById: "user_ghost",
      },
    });
  }

  for (const epoch of seedEpochs) {
    await prisma.muralEpoch.create({
      data: {
        id: epoch.id,
        placeId: epoch.placeId,
        epochNumber: epoch.epochNumber,
        seed: epoch.seed,
        contributingMemoryIds: epoch.contributingMemoryIds,
        engineVersion: epoch.engineVersion,
        artworkHash: epoch.artworkHash,
        preservationScore: epoch.preservationScore,
        simulated: true,
        createdAt: new Date(epoch.createdAt),
      },
    });
  }

  // Demo footnotes — "the scrap reads you back"
  const demoFootnotes = [
    {
      id: "fn_demo_1",
      memoryId: "mem_ch_friends",
      question: "Whose voice still sits across from you in that room?",
      answer:
        "My roommate from first year — we still text when the ceiling fan sounds like College Street.",
      signedAs: "a stranger",
    },
    {
      id: "fn_demo_2",
      memoryId: "mem_ch_friends",
      question: "Whose voice still sits across from you in that room?",
      answer: "Nobody. That is why the empty chair hurts.",
      signedAs: "R.",
    },
    {
      id: "fn_demo_3",
      memoryId: "mem_ch_dada",
      question: "Who shared the umbrella when leaving still felt unfinished?",
      answer: "Dadu. Always Dadu. Even the years after.",
      signedAs: "someone who was there",
    },
  ] as const;

  for (const fn of demoFootnotes) {
    await prisma.memoryFootnote.upsert({
      where: { id: fn.id },
      create: fn,
      update: {
        question: fn.question,
        answer: fn.answer,
        signedAs: fn.signedAs,
      },
    });
  }

  await prisma.seedMeta.upsert({
    where: { id: "demo-district" },
    create: { id: "demo-district", version: SEED_VERSION },
    update: { version: SEED_VERSION, appliedAt: new Date() },
  });

  const counts = {
    neighborhoods: await prisma.neighborhood.count({ where: { isDemo: true } }),
    places: await prisma.place.count({ where: { isDemo: true } }),
    memories: await prisma.memory.count({ where: { isDemo: true } }),
    relations: await prisma.memoryRelation.count(),
    epochs: await prisma.muralEpoch.count(),
    footnotes: await prisma.memoryFootnote.count(),
  };

  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
