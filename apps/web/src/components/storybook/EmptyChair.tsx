"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";

const HALF_LINES = [
  "That evening we almost—",
  "I still look for you at—",
  "If you had stayed five minutes longer—",
  "The rain started, and then—",
  "We never finished saying—",
];

function lineForPlace(placeId: string): string {
  let h = 0;
  for (let i = 0; i < placeId.length; i++) h = (h + placeId.charCodeAt(i) * (i + 1)) % 997;
  return HALF_LINES[h % HALF_LINES.length]!;
}

type Props = {
  placeId: string;
  placeName: string;
  onClaim?: () => void;
  dense?: boolean;
};

export function EmptyChair({ placeId, placeName, onClaim, dense = false }: Props) {
  const reduce = useReducedMotion();
  const halfLine = lineForPlace(placeId);

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="ms-empty-chair relative overflow-hidden rounded-xl px-3 py-4 sm:px-4"
      aria-label={`Empty chair waiting at ${placeName}`}
    >
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-35" />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-xl ring-1 ring-[#5c2430]/20"
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.55, 1, 0.55],
              }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="font-hand ms-sticky ms-sticky--sky inline-block px-2 py-0.5 text-sm font-semibold">
          empty chair
        </span>
        <h3
          className={`font-display mt-2 leading-tight tracking-tight text-[#1a1612] ${
            dense ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          A seat is waiting
        </h3>
        <p
          className={`font-hand mt-1 max-w-sm leading-snug text-[#5c3a2e] ${
            dense ? "text-base" : "text-lg"
          }`}
        >
          No scrap has claimed {placeName} yet. The map feels haunted — not empty.
        </p>

        <motion.div
          className="relative mt-4"
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <EmptyChairSvg className={dense ? "h-28 w-28" : "h-36 w-36"} />
        </motion.div>

        <div className="ms-scrap-page ms-scrap-page--butter relative mt-3 w-full max-w-sm px-4 py-3 text-left shadow-sm">
          <span className="ms-washi ms-washi--coral absolute -top-1.5 left-4 h-3 w-10 rotate-[-3deg]" />
          <p className="font-hand text-xs font-semibold text-[#b83240]">
            half a sentence, left on the seat
          </p>
          <p
            className={`font-hand mt-1 leading-snug text-[#3a1f2e] ${
              dense ? "text-lg" : "text-xl"
            }`}
          >
            {halfLine}
            <motion.span
              className="ml-0.5 inline-block h-[1.1em] w-0.5 bg-[#b83240] align-middle"
              animate={reduce ? undefined : { opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </p>
        </div>

        {onClaim ? (
          <motion.button
            type="button"
            whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClaim}
            className="ms-btn mt-4 inline-flex h-10 items-center justify-center bg-[#5c2430] px-5 text-sm font-semibold tracking-wide text-[#ffe9c8] shadow-[0_12px_28px_-14px_rgba(92,36,48,0.65)]"
          >
            Claim this chair →
          </motion.button>
        ) : null}
        <p className="font-hand mt-2 text-sm text-[#5c3a2e]/80">
          first memory gets the seat
        </p>
      </div>
    </motion.section>
  );
}

function EmptyChairSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <ellipse cx="80" cy="148" rx="42" ry="7" fill="#1a1612" opacity="0.1" />
      {/* Ghost dashed chair */}
      <path
        d="M48 78 L48 118 M112 78 L112 118 M48 118 L112 118 M52 78 L52 52 Q52 40 80 40 Q108 40 108 52 L108 78 M48 78 L112 78 M60 78 L60 118 M100 78 L100 118"
        fill="none"
        stroke="#5c2430"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="5 5"
        opacity="0.55"
      />
      <path
        d="M56 70 Q80 62 104 70"
        fill="none"
        stroke="#e87860"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="3 4"
        opacity="0.7"
      />
      {/* Soft heart hover above */}
      <path
        d="M80 28 C74 22 64 24 64 34 C64 42 80 52 80 52 C80 52 96 42 96 34 C96 24 86 22 80 28 Z"
        fill="#ff8fb5"
        opacity="0.45"
        stroke="#5c2430"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
    </svg>
  );
}
