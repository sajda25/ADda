"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DISCOVERY_LABELS,
  LAYER_LABELS,
  type DiscoveryMode,
  type MemorySummary,
  type PlaceSummary,
  type TemporalLayer,
} from "@memory-streets/shared";
import { easeOut } from "@/components/motion/primitives";
import { EmptyChair } from "@/components/storybook/EmptyChair";
import { TwoStrangersTable } from "@/components/storybook/TwoStrangersTable";

type Props = {
  place: PlaceSummary;
  memories: MemorySummary[];
  mode: DiscoveryMode;
  layer: TemporalLayer | "ALL";
  loading: boolean;
  onModeChange: (mode: DiscoveryMode) => void;
  onLayerChange: (layer: TemporalLayer | "ALL") => void;
  onClose: () => void;
  onContribute?: () => void;
};

const modes: DiscoveryMode[] = [
  "MOST_READ",
  "RECENTLY_ADDED",
  "SURPRISE_ME",
  "EXPLORE_BY_TIME",
];

const scrapTones = [
  "ms-scrap-page--peach",
  "ms-scrap-page--butter",
  "ms-scrap-page--mint",
  "ms-scrap-page--lavender",
  "ms-scrap-page--sky",
] as const;

const washiTones = [
  "ms-washi--coral",
  "ms-washi--sun",
  "ms-washi--teal",
  "ms-washi--berry",
  "ms-washi--dots",
] as const;

export function PlaceStorybook({
  place,
  memories,
  mode,
  layer,
  loading,
  onModeChange,
  onLayerChange,
  onClose,
  onContribute,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.aside
      key={place.id}
      initial={reduce ? false : { opacity: 0, x: 36, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="ms-storybook-panel relative flex h-full max-h-[46vh] flex-col overflow-hidden rounded-t-2xl md:max-h-none md:rounded-xl"
    >
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-40" />
      <div className="mx-auto mt-1.5 h-1 w-10 shrink-0 rounded-full bg-[#c45c48]/40 md:hidden" />

      {/* Place intro — compact, shares half the panel */}
      <header className="relative flex min-h-0 flex-[1_1_0%] flex-col overflow-y-auto px-4 pb-3 pt-2">
        <div className="flex items-start gap-3">
          {place.imageUrl ? (
            <motion.div
              key={`img-${place.id}`}
              initial={reduce ? false : { opacity: 0, y: 8, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.5 }}
              className="relative w-[42%] shrink-0 bg-[#fff3c4] p-1.5 pb-5 shadow-[0_10px_24px_-14px_rgba(26,22,18,0.45)] ring-1 ring-ink/15"
            >
              <span className="ms-washi ms-washi--coral absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rotate-[-2deg]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.imageUrl}
                alt={`Photo related to ${place.name}`}
                className="aspect-[4/3] w-full object-cover"
              />
              <p className="font-hand absolute inset-x-1 bottom-0.5 truncate text-center text-xs font-semibold text-[#5c2430]">
                kept
              </p>
            </motion.div>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-hand text-base font-semibold text-[#b83240]">
                  place scrapbook
                </p>
                <h2
                  key={`title-${place.id}`}
                  className="mt-0.5 line-clamp-2 font-display text-2xl leading-tight tracking-tight text-[#1a1612]"
                >
                  {place.name}
                </h2>
                <p className="mt-1 line-clamp-1 text-xs text-[#5c3a2e]/90">
                  {place.neighborhoodLabel}
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="ms-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-[#fff3c4] text-sm text-[#5c2430] hover:bg-[#ffe49a]"
                aria-label="Close storybook"
              >
                ✕
              </motion.button>
            </div>

            <p className="font-hand mt-2 line-clamp-3 text-lg leading-snug text-[#3a1f2e]">
              {place.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span
                className={`font-hand inline-flex h-7 items-center px-2.5 text-sm font-semibold ${
                  place.memoryCount === 0
                    ? "bg-[#c8e4ff] text-[#14383a]"
                    : "bg-[#e87860] text-[#1a1612]"
                }`}
              >
                {place.memoryCount === 0
                  ? "empty chair"
                  : `${place.memoryCount} memories`}
              </span>
              {place.layers.slice(0, 2).map((l, i) => (
                <span
                  key={l}
                  className={`font-hand ms-sticky inline-flex h-7 items-center px-2.5 text-sm font-semibold ms-sticky--${
                    ["pink", "lime", "sky"][i % 3]
                  }`}
                >
                  {LAYER_LABELS[l]}
                </span>
              ))}
            </div>

            {onContribute ? (
              <motion.button
                type="button"
                whileHover={
                  reduce ? undefined : { y: -1, scale: 1.01, rotate: -0.5 }
                }
                whileTap={{ scale: 0.98 }}
                onClick={onContribute}
                className="ms-btn mt-3 inline-flex h-9 w-full items-center justify-center bg-[#5c2430] text-xs font-semibold tracking-wide text-[#ffe9c8] sm:w-auto sm:px-4"
              >
                Paste your memory →
              </motion.button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Sort + scraps — equal share of the panel */}
      <div className="relative flex min-h-0 flex-[1_1_0%] flex-col border-t border-dashed border-ink/20 bg-[#fff3c4]/35">
        {!loading && place.memoryCount === 0 ? (
          <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <EmptyChair
              placeId={place.id}
              placeName={place.name}
              onClaim={onContribute}
              dense
            />
          </div>
        ) : (
          <>
        {/* Pinned spotlight — always visible before sort/list */}
        {!loading && memories.length >= 2 ? (
          <div className="relative shrink-0 border-b border-dashed border-ink/15 px-3 pb-2 pt-2.5">
            <TwoStrangersTable
              key={`table-${place.id}`}
              memories={memories}
              placeName={place.name}
              dense
            />
          </div>
        ) : null}

        <div className="relative shrink-0 px-4 py-2.5">
          <span className="ms-washi ms-washi--teal pointer-events-none absolute -top-1.5 left-5 h-3 w-12 rotate-[-3deg]" />
          <p className="font-hand mb-2 text-lg font-semibold text-[#5c2430]">
            sort the scraps
          </p>
          <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {modes.map((m, i) => (
              <motion.button
                key={m}
                type="button"
                layout
                whileHover={{ y: -1, rotate: i % 2 ? 2 : -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onModeChange(m)}
                className={`ms-chip relative h-8 shrink-0 px-3 text-xs font-semibold ${
                  mode === m
                    ? "bg-[#1a1612] text-[#ffe9c8]"
                    : "border border-ink/15 bg-[#f7f0e6] text-[#5c3a2e]"
                }`}
              >
                {DISCOVERY_LABELS[m]}
              </motion.button>
            ))}
          </div>
          {(mode === "EXPLORE_BY_TIME" || layer !== "ALL") && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 flex gap-2 overflow-x-auto"
            >
              {(
                ["ALL", "NOW", "BEFORE_CHANGE", "CHILDHOOD_CAMPUS"] as const
              ).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLayerChange(l)}
                  className={`ms-chip h-7 shrink-0 px-2.5 text-xs font-medium ${
                    layer === l
                      ? "bg-[#e87860]/30 text-[#1a1612]"
                      : "text-[#5c3a2e]/70 hover:text-[#1a1612]"
                  }`}
                >
                  {l === "ALL" ? "All layers" : LAYER_LABELS[l]}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="relative min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-1">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`h-28 ms-scrap-page ${scrapTones[i]}`}
                  animate={
                    reduce ? undefined : { opacity: [0.45, 0.85, 0.45] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          ) : memories.length === 0 ? (
            <div className="ms-scrap-page ms-scrap-page--butter p-5 text-center">
              <p className="font-hand text-xl font-semibold text-[#5c2430]">
                no scraps in this view
              </p>
              <p className="mt-1 text-sm text-[#5c3a2e]">
                Try another layer or mode.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {memories.map((memory, index) => {
                const tone = scrapTones[index % scrapTones.length];
                const washi = washiTones[index % washiTones.length];
                const tilt = index % 2 === 0 ? -1.2 : 1.4;
                return (
                  <motion.div
                    key={`${mode}-${layer}-${memory.id}`}
                    layout
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            y: 18,
                            rotate: tilt * 2,
                            scale: 0.96,
                          }
                    }
                    animate={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.35,
                      ease: easeOut,
                      delay: reduce ? 0 : Math.min(index * 0.05, 0.35),
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : {
                            y: -4,
                            rotate: 0,
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 280 },
                          }
                    }
                  >
                    <Link
                      href={`/story/${memory.id}`}
                      className={`ms-scrap-page ${tone} relative block px-4 py-3.5`}
                    >
                      <span
                        className={`ms-washi ${washi} pointer-events-none absolute -top-1.5 left-4 h-3.5 w-12 rotate-[-3deg]`}
                      />
                      <p className="font-hand text-sm font-semibold text-[#b83240]">
                        scrap {index + 1}
                      </p>
                      <h3 className="mt-0.5 font-display text-lg leading-snug text-[#1a1612]">
                        {memory.title}
                      </h3>
                      <p className="font-hand mt-2 line-clamp-2 text-base leading-snug text-[#3a1f2e]">
                        {memory.excerpt}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-ink/15 pt-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 text-[#5c3a2e]">
                          <span className="rounded-sm bg-ink/5 px-2 py-0.5">
                            {LAYER_LABELS[memory.layer]}
                          </span>
                          <span>{memory.authorDisplayName}</span>
                          <span className="tabular-nums">
                            {memory.readCount} reads
                          </span>
                        </div>
                        <span className="font-hand text-base font-semibold text-[#b83240]">
                          open →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
          </>
        )}
      </div>
    </motion.aside>
  );
}
