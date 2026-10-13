import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_CITIES,
  demoCityById,
  demoCityByName,
  validateCreatePlace,
} from "@adda/shared";
import { prisma } from "@/lib/db";
import { exteriorImageForPlace } from "@/lib/placeImages";

function jitter(seed: string, span: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((h % 1000) / 1000 - 0.5) * span;
}

export async function GET(request: NextRequest) {
  try {
    const neighborhoodId = request.nextUrl.searchParams.get("neighborhoodId");
    const cityParam = request.nextUrl.searchParams.get("city");
    const cityMatch = cityParam ? demoCityByName(cityParam) : null;

    const places = await prisma.place.findMany({
      where: {
        ...(neighborhoodId
          ? { neighborhoodId }
          : cityMatch
            ? { neighborhoodId: cityMatch.id }
            : {}),
      },
      include: {
        neighborhood: true,
        _count: {
          select: {
            memories: {
              where: { status: "PUBLISHED", moderationStatus: "CLEAR" },
            },
          },
        },
        memories: {
          where: { status: "PUBLISHED", moderationStatus: "CLEAR" },
          select: { layer: true, title: true, text: true, readCount: true },
          orderBy: { readCount: "desc" },
        },
      },
      orderBy: [{ neighborhoodId: "asc" }, { name: "asc" }],
    });

    const payload = places.map((place) => {
      const layers = [...new Set(place.memories.map((m) => m.layer))];
      const cityMeta = demoCityById(place.neighborhoodId);
      const top = place.memories[0];
      const teaserExcerpt = top
        ? top.text.replace(/\s+/g, " ").trim().slice(0, 96) +
          (top.text.length > 96 ? "…" : "")
        : null;
      return {
        id: place.id,
        name: place.name,
        neighborhoodId: place.neighborhoodId,
        neighborhoodLabel: place.neighborhood.label,
        city: cityMeta?.name ?? place.neighborhood.label.split(",")[0] ?? "India",
        state: cityMeta?.state ?? "",
        description: place.description,
        approxLat: place.approxLat,
        approxLng: place.approxLng,
        memoryCount: place._count.memories,
        layers,
        isDemo: place.isDemo,
        imageUrl: exteriorImageForPlace(place.id),
        teaserTitle: top?.title ?? null,
        teaserExcerpt,
      };
    });

    const neighborhoods = DEMO_CITIES.map((c) => ({
      id: c.id,
      name: c.name,
      state: c.state,
      label: `${c.name} Demo District, ${c.state} (Illustrative)`,
      centerLat: c.centerLat,
      centerLng: c.centerLng,
      zoom: c.zoom,
      placeCount: payload.filter((p) => p.neighborhoodId === c.id).length,
    }));

    return NextResponse.json({
      demo: true,
      count: payload.length,
      cities: neighborhoods,
      places: payload,
    });
  } catch (error) {
    console.error("GET /api/places", error);
    return NextResponse.json(
      { error: "Failed to load places. Is the database seeded?" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = validateCreatePlace(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const city = demoCityById(parsed.data.neighborhoodId);
    if (!city) {
      return NextResponse.json(
        { error: "Unknown city. Pick a city from the list." },
        { status: 400 },
      );
    }

    // Ensure neighborhood row exists (seeded cities)
    let neighborhood = await prisma.neighborhood.findUnique({
      where: { id: city.id },
    });
    if (!neighborhood) {
      neighborhood = await prisma.neighborhood.create({
        data: {
          id: city.id,
          label: `${city.name} Demo District, ${city.state} (Illustrative)`,
          description: `Neighbor-contributed places in ${city.name}.`,
          centerLat: city.centerLat,
          centerLng: city.centerLng,
          isDemo: true,
        },
      });
    }

    const existing = await prisma.place.findFirst({
      where: {
        neighborhoodId: city.id,
        name: { equals: parsed.data.name, mode: "insensitive" },
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "That place already exists in this city.",
          place: {
            id: existing.id,
            name: existing.name,
            neighborhoodId: existing.neighborhoodId,
          },
        },
        { status: 409 },
      );
    }

    const approxLat =
      parsed.data.approxLat ??
      city.centerLat + jitter(parsed.data.name, 0.04);
    const approxLng =
      parsed.data.approxLng ??
      city.centerLng + jitter(`${parsed.data.name}:lng`, 0.04);

    const place = await prisma.place.create({
      data: {
        neighborhoodId: city.id,
        name: parsed.data.name,
        description: parsed.data.description,
        approxLat,
        approxLng,
        isDemo: false,
      },
    });

    return NextResponse.json(
      {
        place: {
          id: place.id,
          name: place.name,
          neighborhoodId: place.neighborhoodId,
          neighborhoodLabel: neighborhood.label,
          city: city.name,
          state: city.state,
          description: place.description,
          approxLat: place.approxLat,
          approxLng: place.approxLng,
          memoryCount: 0,
          layers: [],
          isDemo: false,
          imageUrl: exteriorImageForPlace(place.id),
        },
        notice: `Added “${place.name}” in ${city.name}. You can paste a memory there now.`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/places", error);
    return NextResponse.json(
      { error: "Failed to create place" },
      { status: 500 },
    );
  }
}
