"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { easeOut } from "@/components/motion/primitives";
import {
  Bookworm,
  CoffeeDada,
  PolaroidFrame,
  RainAuntie,
  TramKid,
} from "@/components/demo/DiaryCaricatures";
import {
  PaperClip,
  PostageStamp,
  StickerHeart,
  StickerStar,
  TicketStub,
} from "@/components/demo/ScrapbookBits";
import { aestheticCoverForPlace } from "@/lib/storyImages";

type SeedStatus = {
  seeded: boolean;
  version: string | null;
  expectedVersion: string;
  places: number;
  memories: number;
  appliedAt: string | null;
};

const polaroids = [
  {
    id: "place_coffee_house",
    caption: "Coffee House",
    rotate: -8,
    theme: "coral" as const,
    className: "w-36 sm:w-44 -rotate-6",
    style: { zIndex: 3 },
  },
  {
    id: "place_boi_para",
    caption: "Boi Para",
    rotate: 5,
    theme: "mint" as const,
    className: "w-32 sm:w-40 translate-y-4",
    style: { zIndex: 2 },
  },
  {
    id: "place_tram_crossing",
    caption: "Tram bell",
    rotate: -3,
    theme: "sun" as const,
    className: "w-36 sm:w-44 -translate-y-2",
    style: { zIndex: 4 },
  },
  {
    id: "place_park_street",
    caption: "Park Street",
    rotate: 7,
    theme: "coral" as const,
    className: "w-28 sm:w-36 translate-y-6 hidden sm:block",
    style: { zIndex: 1 },
  },
];

const pathSteps = [
  "Open the story map — tap Coffee House Steps.",
  "Flip Most Read vs Surprise Me.",
  "Open a story and follow a Memory Echo.",
  "Peek mural epochs on desktop (E1 / E2).",
  "Paste your own scrap into the diary.",
];

export default function DemoPage() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<SeedStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch("/api/seed");
      if (!res.ok) throw new Error("failed");
      setStatus((await res.json()) as SeedStatus);
      setError(null);
    } catch {
      setError("Could not load seed status. Is the database running?");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-[#e8c9a8]">
      <div className="pointer-events-none absolute inset-0 ms-story-desk opacity-90" />
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-50" />
      <div className="pointer-events-none absolute inset-0 ms-cork-scatter opacity-40" />

      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8 sm:py-14">
        {/* Floating caricatures */}
        <motion.div
          className="pointer-events-none absolute left-2 top-24 hidden w-24 lg:block"
          animate={
            reduce ? undefined : { y: [0, -10, 0], rotate: [-6, 4, -6] }
          }
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <CoffeeDada className="h-24 w-24 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute right-4 top-40 hidden w-20 lg:block"
          animate={
            reduce ? undefined : { y: [0, -12, 0], rotate: [8, -4, 8] }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <TramKid className="h-20 w-20 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute bottom-32 left-6 hidden w-20 xl:block"
          animate={
            reduce ? undefined : { y: [0, -8, 0], rotate: [-4, 6, -4] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bookworm className="h-20 w-20 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute bottom-40 right-8 hidden w-20 xl:block"
          animate={
            reduce ? undefined : { y: [0, -9, 0], rotate: [5, -7, 5] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <RainAuntie className="h-20 w-20 drop-shadow-lg" />
        </motion.div>

        {/* Hero scrap */}
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 28, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
          className="ms-scrap-page ms-scrap-page--butter relative mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-10"
          style={{
            transformStyle: "preserve-3d",
            boxShadow:
              "0 28px 60px -24px rgba(26,22,18,0.45), 0 2px 0 rgba(255,255,255,0.4) inset",
          }}
        >
          <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-5 w-28 -translate-x-1/2 rotate-[-2deg]" />
          <span className="ms-washi ms-washi--sun absolute top-16 -left-2 h-3 w-14 -rotate-90" />
          <span className="ms-washi ms-washi--teal absolute top-24 -right-2 h-3 w-12 rotate-90" />
          <div className="absolute left-6 top-2">
            <PaperClip className="h-14 w-8 rotate-[-14deg]" />
          </div>

          <p className="font-hand text-xl font-semibold text-[#b83240]">
            judge-facing · demo desk
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight text-[#1a1612] sm:text-5xl">
            Demonstration scrapbook
          </h1>
          <p className="font-hand mt-3 max-w-xl text-xl leading-snug text-[#5c3a2e]">
            Not a settings panel — a corkboard of what&apos;s already pasted into
            the demo. Ordinary readers never see this page.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TicketStub label="Demo only" code="JUDGE" />
            <PostageStamp city="IND" className="h-16 w-14" />
            <StickerHeart className="h-10 w-10" />
            <StickerStar className="h-10 w-10" />
          </div>
        </motion.section>

        {/* 3D polaroid stack */}
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: easeOut }}
          className="relative mx-auto mt-12 max-w-4xl"
          style={{ perspective: "1200px" }}
        >
          <p className="font-hand mb-4 text-center text-2xl font-semibold text-[#5c2430]">
            places already in the diary
          </p>
          <div
            className="flex flex-wrap items-end justify-center gap-2 sm:gap-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            {polaroids.map((p, i) => {
              const src = aestheticCoverForPlace(p.id);
              return (
                <motion.div
                  key={p.id}
                  className={p.className}
                  style={{
                    ...p.style,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, y: 40, rotateY: -18, z: -40 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateY: i % 2 === 0 ? -6 : 8,
                    rotateZ: p.rotate,
                    z: 20 + i * 8,
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: -16,
                          rotateY: 0,
                          rotateZ: 0,
                          scale: 1.06,
                          z: 80,
                          transition: { type: "spring", stiffness: 260 },
                        }
                  }
                  transition={{
                    delay: 0.2 + i * 0.08,
                    duration: 0.55,
                    ease: easeOut,
                  }}
                >
                  <PolaroidFrame
                    caption={p.caption}
                    rotate={0}
                    theme={p.theme}
                    className="w-full shadow-[0_22px_50px_-18px_rgba(26,22,18,0.55)]"
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src.replace("w=1400", "w=480")}
                        alt={p.caption}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-hand text-sm">photo pending</span>
                    )}
                  </PolaroidFrame>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Seed status scrap */}
          <motion.section
            initial={reduce ? false : { opacity: 0, x: -20, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="ms-scrap-page ms-scrap-page--mint relative p-5 sm:p-6"
            style={{
              boxShadow:
                "0 22px 48px -22px rgba(26,22,18,0.4), 8px 8px 0 rgba(26,22,18,0.06)",
            }}
          >
            <span className="ms-washi ms-washi--teal absolute -top-2 left-8 h-4 w-16 rotate-[-3deg]" />
            <h2 className="font-hand text-2xl font-semibold text-[#14383a]">
              seed status
            </h2>
            <p className="font-display mt-1 text-2xl text-[#1a1612]">
              What&apos;s loaded
            </p>

            {error ? (
              <p className="font-hand mt-4 text-lg font-semibold text-[#b83240]">
                {error}
              </p>
            ) : status ? (
              <dl className="mt-4 space-y-2.5 text-sm text-[#1a3a3c]">
                {[
                  ["Seeded", status.seeded ? "yes ♡" : "no"],
                  [
                    "Version",
                    `${status.version ?? "—"} / ${status.expectedVersion}`,
                  ],
                  [
                    "Places / memories",
                    `${status.places} / ${status.memories}`,
                  ],
                  ["Applied", status.appliedAt ?? "—"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/15 pb-2"
                  >
                    <dt className="font-hand text-base font-semibold text-[#1f5c5e]">
                      {k}
                    </dt>
                    <dd className="text-right text-xs tabular-nums sm:text-sm">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="font-hand mt-4 animate-pulse text-lg text-[#1f5c5e]">
                opening this page of the diary…
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <motion.button
                type="button"
                whileHover={reduce ? undefined : { y: -2, rotate: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => void refresh()}
                className="font-hand ms-sticky ms-sticky--lime px-4 py-2 text-base font-semibold"
              >
                Refresh status
              </motion.button>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-[#14383a]/80">
              To reload demo data, run{" "}
              <code className="rounded bg-[#fffdf8]/80 px-1 font-mono text-[10px]">
                pnpm seed
              </code>{" "}
              in the repo. Browser-triggered destructive resets stay off this
              desk on purpose.
            </p>
          </motion.section>

          {/* Path scraps */}
          <motion.section
            initial={reduce ? false : { opacity: 0, x: 20, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="ms-scrap-page ms-scrap-page--peach relative p-5 sm:p-6"
            style={{
              boxShadow:
                "0 22px 48px -22px rgba(26,22,18,0.4), -8px 8px 0 rgba(26,22,18,0.06)",
            }}
          >
            <span className="ms-washi ms-washi--berry absolute -top-2 right-10 h-4 w-14 rotate-[4deg]" />
            <h2 className="font-hand text-2xl font-semibold text-[#b83240]">
              suggested path
            </h2>
            <p className="font-display mt-1 text-2xl text-[#1a1612]">
              Walk the demo
            </p>

            <ol className="mt-5 space-y-3">
              {pathSteps.map((step, i) => (
                <motion.li
                  key={step}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`font-hand relative rounded-sm px-3 py-2.5 text-lg leading-snug text-[#3a1f2e] ring-1 ring-ink/10 ${
                    [
                      "bg-[#ffd0e8]/70",
                      "bg-[#c8e4ff]/70",
                      "bg-[#fff3c4]/80",
                      "bg-[#d8f0c8]/70",
                      "bg-[#ffe0c8]/80",
                    ][i % 5]
                  }`}
                  style={{
                    transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
                  }}
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#5c2430] text-sm font-semibold text-[#ffe9c8]">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </motion.section>
        </div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={reduce ? undefined : { y: -4, rotate: -1, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/map"
              className="ms-btn inline-flex h-12 items-center bg-[#5c2430] px-7 text-sm font-semibold tracking-wide text-[#ffe9c8] shadow-[0_16px_36px_-14px_rgba(92,36,48,0.6)]"
            >
              Enter the seeded map →
            </Link>
          </motion.div>
          <Link
            href="/"
            className="font-hand text-lg font-semibold text-[#5c2430] underline decoration-wavy underline-offset-4"
          >
            back to the diary cover
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
