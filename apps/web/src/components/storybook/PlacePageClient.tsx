"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LAYER_LABELS,
  type MemorySummary,
  type PlaceSummary,
} from "@adda/shared";
import { EmptyChair } from "@/components/storybook/EmptyChair";
import { TwoStrangersTable } from "@/components/storybook/TwoStrangersTable";

export function PlacePageClient({ placeId }: { placeId: string }) {
  const [place, setPlace] = useState<PlaceSummary | null>(null);
  const [memories, setMemories] = useState<MemorySummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [placesRes, memoriesRes] = await Promise.all([
          fetch("/api/places"),
          fetch(`/api/memories?placeId=${placeId}&mode=MOST_READ`),
        ]);
        if (!placesRes.ok || !memoriesRes.ok) throw new Error("failed");
        const placesData = (await placesRes.json()) as {
          places: PlaceSummary[];
        };
        const memoriesData = (await memoriesRes.json()) as {
          memories: MemorySummary[];
        };
        const found = placesData.places.find((p) => p.id === placeId) ?? null;
        if (!cancelled) {
          setPlace(found);
          setMemories(memoriesData.memories);
          if (!found) setError("Place not found");
        }
      } catch {
        if (!cancelled) setError("Could not load this place.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-16">
        <p className="text-sm text-danger">{error}</p>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-16">
        <p className="text-sm text-ink-muted">Loading place storybook…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <p className="font-hand text-base font-semibold text-[#b83240]">
        place scrapbook
      </p>
      <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
        {place.name}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">{place.neighborhoodLabel}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        {place.description}
      </p>
      <p className="mt-3 text-xs text-ink-faint">
        {place.memoryCount === 0
          ? "empty chair · waiting for a first scrap"
          : `${place.memoryCount} memories · ordered by Most Read`}
      </p>

      {place.memoryCount === 0 ? (
        <div className="mt-10">
          <EmptyChair placeId={place.id} placeName={place.name} />
        </div>
      ) : (
        <>
          {memories.length >= 2 ? (
            <div className="mt-10">
              <TwoStrangersTable
                memories={memories}
                placeName={place.name}
              />
            </div>
          ) : null}

          <ul className="mt-10 space-y-6">
            {memories.map((memory) => (
              <li key={memory.id} className="border-b border-border pb-6">
                <Link href={`/story/${memory.id}`} className="group block">
                  <h2 className="font-display text-xl text-ink group-hover:text-olive-deep">
                    {memory.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {memory.excerpt}
                  </p>
                  <p className="mt-2 text-[11px] text-ink-faint">
                    {LAYER_LABELS[memory.layer]} · {memory.authorDisplayName} ·{" "}
                    {memory.readCount} reads
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
