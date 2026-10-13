"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MuralCanvas } from "@/components/mural/MuralCanvas";
import { MuralCausePanel } from "@/components/mural/MuralCausePanel";
import { PostageStamp, StickerStar } from "@/components/demo/ScrapbookBits";
import type { MuralInput, MuralRenderResult } from "@/lib/mural/types";

type EpochSummary = {
  id: string;
  epochNumber: number;
  simulated: boolean;
  artworkHash: string;
};

type Props = {
  placeId: string | null;
};

export function MuralPanel({ placeId }: Props) {
  const reduce = useReducedMotion();
  const [input, setInput] = useState<MuralInput | null>(null);
  const [contributing, setContributing] = useState<string[]>([]);
  const [epochLabel, setEpochLabel] = useState("Mural");
  const [epochs, setEpochs] = useState<EpochSummary[]>([]);
  const [selectedEpochId, setSelectedEpochId] = useState<string | null>(null);
  const [result, setResult] = useState<MuralRenderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (epochId?: string | null) => {
      if (!placeId) return;
      try {
        const params = new URLSearchParams({ placeId });
        if (epochId) params.set("epochId", epochId);
        const res = await fetch(`/api/mural?${params}`);
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as {
          input: MuralInput;
          analysis: MuralRenderResult;
          epochs: EpochSummary[];
          selectedEpochId: string | null;
        };
        setInput(data.input);
        setContributing(data.analysis.cause.contributingMemoryIds);
        setEpochLabel(data.analysis.cause.epochLabel);
        setEpochs(data.epochs);
        setSelectedEpochId(data.selectedEpochId);
        setResult(data.analysis);
        setError(null);
      } catch {
        setError("Mural data unavailable.");
      }
    },
    [placeId],
  );

  useEffect(() => {
    void load(null);
  }, [load]);

  const onExport = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      "aside canvas, .mural-export-target canvas",
    );
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `adda-mural-${placeId ?? "place"}.png`;
    a.click();
  };

  if (!placeId) {
    return (
      <div className="hidden min-h-0 w-[300px] py-3 pr-3 lg:block">
        <div className="ms-scrap-page ms-scrap-page--butter flex h-full items-center justify-center p-5 text-center">
          <span className="ms-washi ms-washi--sun absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2" />
          <p className="font-hand text-lg font-semibold text-[#5c2430]">
            Pick a place — its mural scrap waits here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden h-full min-h-0 w-[300px] flex-col py-3 pr-3 lg:flex">
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 20, rotate: 1.5 }}
        animate={{ opacity: 1, x: 0, rotate: 0.4 }}
        className="ms-scrap-page ms-scrap-page--lavender relative flex h-full min-h-0 flex-col overflow-hidden"
        style={{
          boxShadow:
            "0 22px 48px -22px rgba(26,22,18,0.42), -6px 8px 0 rgba(26,22,18,0.05)",
        }}
      >
        <span className="ms-washi ms-washi--berry absolute -top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rotate-[-2deg]" />
        <span className="ms-washi ms-washi--teal absolute top-12 -right-1 z-10 h-3 w-10 rotate-90" />
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-35" />

        <div className="relative shrink-0 px-4 pb-2 pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-hand text-base font-semibold text-[#6b3a8c]">
                neighborhood mural
              </p>
              <p className="mt-0.5 font-display text-lg leading-tight text-[#1a1612]">
                {epochLabel}
              </p>
            </div>
            <motion.div
              animate={
                reduce ? undefined : { rotate: [-6, 6, -6], y: [0, -3, 0] }
              }
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <PostageStamp city="MUR" className="h-14 w-12 shrink-0" />
            </motion.div>
          </div>
        </div>

        <div className="mural-export-target relative mx-3 shrink-0 overflow-hidden bg-[#fff3c4] p-1.5 pb-5 shadow-[0_12px_28px_-16px_rgba(26,22,18,0.45)] ring-1 ring-ink/15">
          <span className="ms-washi ms-washi--coral absolute -top-1.5 left-1/2 z-10 h-3 w-12 -translate-x-1/2 rotate-[-2deg]" />
          {error ? (
            <p className="font-hand p-4 text-base font-semibold text-[#b83240]">
              {error}
            </p>
          ) : input ? (
            <MuralCanvas
              input={input}
              contributingMemoryIds={contributing}
              epochLabel={epochLabel}
              width={600}
              height={420}
              className="h-auto w-full"
              onRendered={setResult}
            />
          ) : (
            <p className="font-hand animate-pulse p-4 text-base text-[#5c3a2e]">
              composing this scrap…
            </p>
          )}
          <p className="font-hand absolute inset-x-1 bottom-0.5 text-center text-xs font-semibold text-[#5c2430]">
            living wall · illustrative
          </p>
        </div>

        <div className="relative mt-3 flex shrink-0 flex-wrap items-center gap-1.5 px-4">
          {epochs.map((epoch) => {
            const active = selectedEpochId === epoch.id;
            return (
              <motion.button
                key={epoch.id}
                type="button"
                whileHover={reduce ? undefined : { y: -2, rotate: active ? 0 : -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => void load(epoch.id)}
                className={`font-hand h-8 px-2.5 text-sm font-semibold ${
                  active
                    ? "ms-sticky ms-sticky--pink"
                    : "rounded-sm bg-[#fffdf8]/80 text-[#5c3a2e] ring-1 ring-ink/10"
                }`}
              >
                E{epoch.epochNumber}
                {epoch.simulated ? " · sim" : ""}
              </motion.button>
            );
          })}
          <button
            type="button"
            onClick={onExport}
            className="font-hand ml-auto text-sm font-semibold text-[#6b3a8c] underline decoration-wavy underline-offset-2 hover:text-[#5c2430]"
          >
            Export
          </button>
          <StickerStar className="h-7 w-7" />
        </div>

        <div className="relative mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1">
          <MuralCausePanel
            cause={result?.cause ?? null}
            artworkHash={result?.artworkHash}
          />
        </div>
      </motion.div>
    </aside>
  );
}
