"use client";

import type { MuralCause } from "@/lib/mural/types";
import { LAYER_LABELS } from "@adda/shared";

type Props = {
  cause: MuralCause | null;
  artworkHash?: string | null;
};

const scraps = [
  "ms-scrap-page--peach",
  "ms-scrap-page--mint",
  "ms-scrap-page--butter",
  "ms-scrap-page--sky",
  "ms-scrap-page--lavender",
] as const;

const washi = [
  "ms-washi--coral",
  "ms-washi--teal",
  "ms-washi--sun",
  "ms-washi--berry",
  "ms-washi--dots",
] as const;

export function MuralCausePanel({ cause, artworkHash }: Props) {
  if (!cause) {
    return (
      <div className="ms-scrap-page ms-scrap-page--butter p-3 text-center">
        <p className="font-hand text-base font-semibold text-[#5c2430]">
          Mural notes unavailable for this view.
        </p>
      </div>
    );
  }

  const blocks = [
    {
      title: "what changed?",
      body: cause.whatChanged,
    },
    {
      title: "contributing stories",
      body: `${cause.contributingMemoryIds.length} memor${
        cause.contributingMemoryIds.length === 1 ? "y" : "ies"
      }${
        cause.contributingMemoryIds.length
          ? ` · ${cause.contributingMemoryIds.slice(0, 3).join(", ")}${
              cause.contributingMemoryIds.length > 3 ? "…" : ""
            }`
          : " · none recorded"
      }`,
    },
    {
      title: "tags & layers",
      body: `Tags: ${cause.dominantTags.join(", ") || "unavailable"}\nLayers: ${
        cause.layerEmphasis.map((l) => LAYER_LABELS[l]).join(" · ") ||
        "unavailable"
      }`,
    },
    {
      title: "connections",
      body: `${cause.relationInfluence} memory relation${
        cause.relationInfluence === 1 ? "" : "s"
      } influenced connecting strokes.`,
    },
    {
      title: "epoch",
      body: `${cause.epochLabel}\n${cause.carriedForward}${
        artworkHash ? `\n${artworkHash}` : ""
      }`,
    },
  ];

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div
          key={block.title}
          className={`ms-scrap-page ${scraps[i % scraps.length]} relative px-3 py-2.5`}
          style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.7}deg)` }}
        >
          <span
            className={`ms-washi ${washi[i % washi.length]} absolute -top-1.5 left-3 h-3 w-10 rotate-[-3deg]`}
          />
          <p className="font-hand text-sm font-semibold text-[#b83240]">
            {block.title}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[#3a1f2e]">
            {block.body}
          </p>
        </div>
      ))}
    </div>
  );
}
