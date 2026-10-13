"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LAYER_LABELS, type MemorySummary } from "@adda/shared";
import { CoffeeRing } from "@/components/demo/ScrapbookBits";
import { rankStrangerPairs } from "@/lib/strangerPair";
import { easeOut } from "@/components/motion/primitives";

type Props = {
  memories: MemorySummary[];
  placeName: string;
  /** Compact for map side panel; roomier for place page */
  dense?: boolean;
};

export function TwoStrangersTable({
  memories,
  placeName,
  dense = false,
}: Props) {
  const reduce = useReducedMotion();
  const idsKey = memories.map((m) => m.id).join("|");
  const pairs = useMemo(
    () => rankStrangerPairs(memories),
    // Re-rank only when the set of scraps changes (not on every parent render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsKey],
  );
  const [seat, setSeat] = useState(0);

  useEffect(() => {
    setSeat(0);
  }, [idsKey]);

  if (pairs.length === 0) return null;

  const pair = pairs[seat % pairs.length]!;
  const { left, right } = pair;

  return (
    <motion.section
      layout
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className={`relative ${dense ? "" : "mb-8"}`}
      aria-label={`Two strangers at one table at ${placeName}`}
    >
      {/* Spotlight frame — bright paper so it can't hide */}
      <div className="ms-adda-spotlight relative overflow-hidden rounded-xl px-3 pb-3 pt-3 sm:px-3.5">
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-40" />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl ring-2 ring-[#e87860]/70"
          animate={
            reduce
              ? undefined
              : {
                  boxShadow: [
                    "0 0 0 0 rgba(232,120,96,0.45)",
                    "0 0 0 10px rgba(232,120,96,0)",
                    "0 0 0 0 rgba(232,120,96,0.45)",
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />

        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-hand ms-sticky ms-sticky--pink inline-block px-2 py-0.5 text-sm font-semibold">
                look · adda
              </span>
              <span className="font-hand text-xs font-semibold tracking-wide text-[#5c2430]/80 uppercase">
                only here
              </span>
            </div>
            <h3
              className={`font-display mt-1.5 leading-tight tracking-tight text-[#1a1612] ${
                dense ? "text-xl" : "text-2xl sm:text-3xl"
              }`}
            >
              Two strangers, one table
            </h3>
            <p
              className={`font-hand mt-1 leading-snug text-[#5c3a2e] ${
                dense ? "text-base" : "text-lg"
              }`}
            >
              Same place. Different nights. An adda that never happened.
            </p>
          </div>
          {pairs.length > 1 ? (
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { y: -2, rotate: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSeat((s) => (s + 1) % pairs.length)}
              className="font-hand shrink-0 rounded-sm bg-[#e87860] px-2.5 py-1.5 text-sm font-semibold text-[#1a1612] shadow-[0_8px_18px_-10px_rgba(232,120,96,0.9)] ring-1 ring-ink/15"
            >
              reshuffle
            </motion.button>
          ) : null}
        </div>

        {/* Table top */}
        <div
          className={`ms-adda-table relative mt-3 ${
            dense ? "px-2.5 py-3.5" : "px-4 py-7 sm:px-6 sm:py-9"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 paper-grain opacity-25" />

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_40%_35%,#d4b08a_0%,#9a6e48_55%,#5c3a22_100%)] shadow-[inset_0_0_0_2px_rgba(255,233,200,0.2),0_18px_40px_-20px_rgba(26,22,18,0.55)]"
            style={{
              width: "94%",
              height: dense ? "82%" : "74%",
            }}
            aria-hidden="true"
          />

          <CoffeeRing
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 opacity-80 ${
              dense ? "h-10 w-10" : "h-16 w-16"
            }`}
          />

          <div className="relative z-[2] grid grid-cols-2 items-stretch gap-2 sm:gap-3">
            <SeatScrap
              memory={left}
              side="left"
              dense={dense}
              reduce={reduce}
              delay={0}
            />
            <SeatScrap
              memory={right}
              side="right"
              dense={dense}
              reduce={reduce}
              delay={0.08}
            />
          </div>

          <p
            className={`font-hand relative z-[2] mt-2.5 text-center font-semibold text-[#ffe9c8] ${
              dense ? "text-sm" : "text-base"
            }`}
          >
            they never met — but they both sat here
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function SeatScrap({
  memory,
  side,
  dense,
  reduce,
  delay,
}: {
  memory: MemorySummary;
  side: "left" | "right";
  dense: boolean;
  reduce: boolean | null;
  delay: number;
}) {
  const tilt = side === "left" ? -2.8 : 2.8;
  const tone =
    side === "left" ? "ms-scrap-page--butter" : "ms-scrap-page--sky";

  return (
    <motion.div
      key={memory.id}
      initial={reduce ? false : { opacity: 0, y: 16, rotate: tilt * 2 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -4,
              rotate: tilt * 0.25,
              scale: 1.03,
              transition: { type: "spring", stiffness: 280 },
            }
      }
      className={side === "left" ? "origin-right" : "origin-left"}
    >
      <Link
        href={`/story/${memory.id}`}
        className={`ms-scrap-page ${tone} relative block shadow-[0_14px_28px_-14px_rgba(26,22,18,0.6)] ring-1 ring-ink/10 ${
          dense ? "px-2.5 py-2" : "px-3.5 py-3"
        }`}
      >
        <span
          className={`ms-washi pointer-events-none absolute -top-1.5 h-3 w-9 ${
            side === "left"
              ? "left-2 ms-washi--coral rotate-[-4deg]"
              : "right-2 ms-washi--teal rotate-[4deg]"
          }`}
        />
        <p className="font-hand text-[11px] font-semibold text-[#b83240]">
          {side === "left" ? "this seat" : "that seat"}
        </p>
        <h4
          className={`mt-0.5 font-display leading-snug text-[#1a1612] ${
            dense ? "line-clamp-2 text-sm" : "line-clamp-2 text-lg"
          }`}
        >
          {memory.title}
        </h4>
        <p
          className={`font-hand mt-1 leading-snug text-[#3a1f2e] ${
            dense ? "line-clamp-2 text-xs" : "line-clamp-3 text-base"
          }`}
        >
          {memory.excerpt}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-1 border-t border-dashed border-ink/15 pt-1">
          <span className="truncate text-[10px] text-[#5c3a2e]">
            {LAYER_LABELS[memory.layer]}
          </span>
          <span className="font-hand shrink-0 text-xs font-semibold text-[#b83240]">
            lean in →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
