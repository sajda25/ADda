-- CreateEnum
CREATE TYPE "TemporalLayer" AS ENUM ('NOW', 'BEFORE_CHANGE', 'CHILDHOOD_CAMPUS');

-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'REMOVED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('CLEAR', 'REPORTED', 'UNDER_REVIEW', 'HIDDEN');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('ECHO', 'CONTINUATION', 'CONTRADICTION', 'TRANSFORM', 'RELATED');

-- CreateEnum
CREATE TYPE "RelationStatus" AS ENUM ('ACTIVE', 'SUGGESTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWED', 'DISMISSED', 'ACTIONED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT,
    "privyId" TEXT,
    "displayName" TEXT NOT NULL,
    "cloakedDefault" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "neighborhoodId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approxLat" DOUBLE PRECISION NOT NULL,
    "approxLng" DOUBLE PRECISION NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "layer" "TemporalLayer" NOT NULL,
    "tags" TEXT[],
    "status" "MemoryStatus" NOT NULL DEFAULT 'PUBLISHED',
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'CLEAR',
    "cloaked" BOOLEAN NOT NULL DEFAULT false,
    "contentHash" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onChain" BOOLEAN NOT NULL DEFAULT false,
    "txHash" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "cellId" TEXT,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryRelation" (
    "id" TEXT NOT NULL,
    "sourceMemoryId" TEXT NOT NULL,
    "targetMemoryId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "description" TEXT,
    "createdById" TEXT,
    "status" "RelationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryRead" (
    "id" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "readerKey" TEXT NOT NULL,
    "qualifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dedupeBucket" TEXT NOT NULL,

    CONSTRAINT "StoryRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuralEpoch" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "epochNumber" INTEGER NOT NULL,
    "seed" TEXT NOT NULL,
    "contributingMemoryIds" TEXT[],
    "engineVersion" TEXT NOT NULL,
    "artworkHash" TEXT NOT NULL,
    "preservationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fadeLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "txHash" TEXT,
    "simulated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuralEpoch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreasuryEvent" (
    "id" TEXT NOT NULL,
    "placeId" TEXT,
    "amountWei" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "donorKey" TEXT,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TreasuryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedMeta" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_privyId_key" ON "User"("privyId");

-- CreateIndex
CREATE INDEX "Place_neighborhoodId_idx" ON "Place"("neighborhoodId");

-- CreateIndex
CREATE INDEX "Place_approxLat_approxLng_idx" ON "Place"("approxLat", "approxLng");

-- CreateIndex
CREATE UNIQUE INDEX "Place_neighborhoodId_name_key" ON "Place"("neighborhoodId", "name");

-- CreateIndex
CREATE INDEX "Memory_placeId_status_readCount_idx" ON "Memory"("placeId", "status", "readCount" DESC);

-- CreateIndex
CREATE INDEX "Memory_placeId_publishedAt_idx" ON "Memory"("placeId", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "Memory_placeId_layer_idx" ON "Memory"("placeId", "layer");

-- CreateIndex
CREATE INDEX "Memory_status_moderationStatus_idx" ON "Memory"("status", "moderationStatus");

-- CreateIndex
CREATE INDEX "Memory_contentHash_idx" ON "Memory"("contentHash");

-- CreateIndex
CREATE INDEX "MemoryRelation_targetMemoryId_idx" ON "MemoryRelation"("targetMemoryId");

-- CreateIndex
CREATE INDEX "MemoryRelation_sourceMemoryId_status_idx" ON "MemoryRelation"("sourceMemoryId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MemoryRelation_sourceMemoryId_targetMemoryId_relationType_key" ON "MemoryRelation"("sourceMemoryId", "targetMemoryId", "relationType");

-- CreateIndex
CREATE INDEX "StoryRead_memoryId_qualifiedAt_idx" ON "StoryRead"("memoryId", "qualifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoryRead_memoryId_readerKey_dedupeBucket_key" ON "StoryRead"("memoryId", "readerKey", "dedupeBucket");

-- CreateIndex
CREATE INDEX "MuralEpoch_placeId_createdAt_idx" ON "MuralEpoch"("placeId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "MuralEpoch_placeId_epochNumber_key" ON "MuralEpoch"("placeId", "epochNumber");

-- CreateIndex
CREATE INDEX "Report_memoryId_status_idx" ON "Report"("memoryId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TreasuryEvent_txHash_key" ON "TreasuryEvent"("txHash");

-- CreateIndex
CREATE INDEX "TreasuryEvent_placeId_createdAt_idx" ON "TreasuryEvent"("placeId", "createdAt");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryRelation" ADD CONSTRAINT "MemoryRelation_sourceMemoryId_fkey" FOREIGN KEY ("sourceMemoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryRelation" ADD CONSTRAINT "MemoryRelation_targetMemoryId_fkey" FOREIGN KEY ("targetMemoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryRelation" ADD CONSTRAINT "MemoryRelation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRead" ADD CONSTRAINT "StoryRead_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuralEpoch" ADD CONSTRAINT "MuralEpoch_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
