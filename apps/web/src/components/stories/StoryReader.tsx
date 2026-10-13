"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LAYER_LABELS,
  RELATION_LABELS,
  type RelationType,
  type TemporalLayer,
} from "@memory-streets/shared";
import { easeOut } from "@/components/motion/primitives";
import { PageTurn } from "@/components/motion/PageTurn";
import {
  CoffeeDada,
  RainAuntie,
  TramKid,
} from "@/components/demo/DiaryCaricatures";
import { StickerHeart, StickerStar } from "@/components/demo/ScrapbookBits";
import { StoryGallery } from "@/components/stories/StoryGallery";
import {
  StoryScrapBackdrop,
  StoryStickerRail,
  StoryStickerStrip,
} from "@/components/stories/StoryScrapBackdrop";
import {
  PlasticSticker,
  StickerChai,
  StickerCloudRain,
  StickerRadio,
  StickerUmbrellaKid,
} from "@/components/stories/TopicStickers";
import type { StoryImage } from "@/lib/storyImages";
import { SealPassModal } from "@/components/letters/SealPassModal";
import { ScrapReadsYou } from "@/components/stories/ScrapReadsYou";

type Echo = {
  id: string;
  relationType: RelationType;
  description: string | null;
  memory: {
    id: string;
    title: string;
    layer: TemporalLayer;
    readCount: number;
  };
};

type StoryPayload = {
  id: string;
  title: string;
  text: string;
  layer: TemporalLayer;
  tags: string[];
  authorDisplayName: string;
  cloaked: boolean;
  publishedAt: string | null;
  readCount: number;
  onChain: boolean;
  isDemo: boolean;
  place: {
    id: string;
    name: string;
    neighborhoodLabel: string;
    description: string;
    imageUrl?: string | null;
    imageAlt?: string;
  };
  images?: StoryImage[];
  echoes: Echo[];
};

const scrapTones = [
  "ms-scrap-page--peach",
  "ms-scrap-page--mint",
  "ms-scrap-page--butter",
  "ms-scrap-page--lavender",
  "ms-scrap-page--sky",
] as const;

export function StoryReader({ storyId }: { storyId: string }) {
  const reduce = useReducedMotion();
  const [story, setStory] = useState<StoryPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number | null>(null);
  const [readNote, setReadNote] = useState<string | null>(null);
  const [sealOpen, setSealOpen] = useState(false);
  const [presenceBusy, setPresenceBusy] = useState(false);
  const [presenceNote, setPresenceNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/memories/${storyId}`);
        if (!res.ok) throw new Error("not found");
        const data = (await res.json()) as StoryPayload;
        if (!cancelled) {
          setStory(data);
          setReadCount(data.readCount);
        }
      } catch {
        if (!cancelled) setError("This memory could not be opened.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storyId]);

  useEffect(() => {
    if (!story) return;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/reads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoryId: story.id }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          accepted: boolean;
          readCount: number;
        };
        setReadCount(data.readCount);
        setReadNote(
          data.accepted
            ? "This page was kept as a read ♡"
            : "Already counted in this window.",
        );
      } catch {
        // ignore
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [story]);

  if (error) {
    return (
      <main className="ms-section-scrap mx-auto min-h-[50vh] max-w-2xl px-5 py-16">
        <div className="ms-scrap-page ms-scrap-page--peach p-6">
          <p className="font-hand text-xl font-semibold text-[#b83240]">{error}</p>
          <Link
            href="/map"
            className="mt-6 inline-block text-sm font-semibold text-[#5c2430] underline"
          >
            ← Back to map
          </Link>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="ms-section-scrap mx-auto min-h-[50vh] max-w-2xl px-5 py-16">
        <p className="font-hand animate-pulse text-xl text-[#5c3a2e]">
          opening this page of the diary…
        </p>
      </main>
    );
  }

  return (
    <>
    <PageTurn>
    <motion.main
      key={story.id}
      initial={false}
      className="relative overflow-clip"
    >
      <StoryScrapBackdrop />
      <StoryStickerRail side="left" />
      <StoryStickerRail side="right" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-10 sm:py-14 lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl">
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/map"
            className="font-hand ms-sticky ms-sticky--sky px-3 py-1.5 text-sm font-semibold"
          >
            ← Story Map
          </Link>
          <Link
            href={`/place/${story.place.id}`}
            className="font-hand ms-sticky ms-sticky--pink px-3 py-1.5 text-sm font-semibold"
          >
            {story.place.name}
          </Link>
        </nav>

        {story.images && story.images.length > 0 ? (
          <StoryGallery images={story.images} placeName={story.place.name} />
        ) : null}

        <StoryStickerStrip />

        <div className="relative mt-8">
          <motion.div
            className="absolute -left-3 -top-6 z-20 w-16 sm:-left-6 sm:w-20"
            animate={
              reduce ? undefined : { y: [0, -10, 0], rotate: [-12, -4, -12] }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlasticSticker color="#c8e4ff">
              <StickerCloudRain className="h-14 w-16" />
            </PlasticSticker>
          </motion.div>
          <motion.div
            className="absolute -right-2 -top-4 z-20 w-14 sm:-right-5 sm:w-16"
            animate={
              reduce ? undefined : { y: [0, -12, 0], rotate: [10, 18, 10] }
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlasticSticker color="#ffe49a">
              <StickerChai className="h-12 w-11" />
            </PlasticSticker>
          </motion.div>

          <motion.div
            className="ms-scrap-page ms-scrap-page--butter ms-scrap-stack relative px-6 py-7 sm:px-8"
            initial={reduce ? false : { opacity: 0, y: 18, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -0.4 }}
            transition={{ delay: 0.1, duration: 0.55, ease: easeOut }}
          >
            <span className="ms-washi ms-washi--sun absolute -top-2 left-8 h-5 w-16 rotate-[-3deg]" />
            <span className="ms-washi ms-washi--coral absolute -right-1 top-10 h-3 w-12 rotate-90" />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="font-hand text-lg font-semibold text-[#b83240]"
            >
              {LAYER_LABELS[story.layer]}
              {story.isDemo ? " · illustrative demo" : ""}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5, ease: easeOut }}
              className="mt-2 font-display text-3xl leading-tight tracking-tight text-[#1a1612] sm:text-5xl"
            >
              {story.title}
            </motion.h1>
            <p className="font-hand mt-3 text-xl text-[#5c3a2e]">
              {story.authorDisplayName}
              {story.cloaked ? " (cloaked)" : ""} · {story.place.name}
            </p>
          </motion.div>
        </div>

        <div className="relative mt-6">
          <motion.div
            className="absolute -left-4 bottom-8 z-20 hidden w-16 sm:block"
            animate={
              reduce ? undefined : { y: [0, -8, 0], rotate: [-8, 0, -8] }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlasticSticker color="#fff3c4">
              <StickerRadio className="h-12 w-14" />
            </PlasticSticker>
          </motion.div>
          <motion.div
            className="absolute -right-3 top-10 z-20 w-16"
            animate={
              reduce ? undefined : { y: [0, -10, 0], rotate: [8, 16, 8] }
            }
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <PlasticSticker color="#c8e4ff">
              <StickerUmbrellaKid className="h-14 w-12" />
            </PlasticSticker>
          </motion.div>

          <motion.article
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: easeOut }}
            className="ms-diary-page ms-diary-page--peach relative px-6 py-8 sm:px-9 sm:py-10"
          >
            <span className="ms-washi ms-washi--berry absolute -top-2 left-1/2 h-4 w-20 -translate-x-1/2" />
            <span className="ms-washi ms-washi--dots absolute top-16 -left-1 h-3 w-10 -rotate-90" />
            <div className="space-y-4 text-base leading-[1.9] text-[#3a1f2e] sm:text-lg">
              {story.text.split(/\n\n+/).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="font-hand mt-8 text-right text-lg text-[#b83240]">
              — end of this page
            </p>
          </motion.article>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="font-hand ms-sticky ms-sticky--lime px-3 py-1 text-sm font-semibold tabular-nums">
            {readCount ?? story.readCount} unique reads
          </span>
          <span className="font-hand ms-sticky ms-sticky--sky px-3 py-1 text-sm font-semibold">
            {story.onChain ? "On-chain commitment" : "Demo / off-chain"}
          </span>
          {readNote ? (
            <span className="font-hand ms-sticky ms-sticky--pink px-3 py-1 text-sm font-semibold">
              {readNote}
            </span>
          ) : null}
          <motion.button
            type="button"
            whileHover={reduce ? undefined : { y: -2, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSealOpen(true)}
            className="font-hand ms-btn inline-flex h-9 items-center bg-[#5c2430] px-3.5 text-sm font-semibold text-[#ffe9c8] shadow-[0_10px_24px_-12px_rgba(92,36,48,0.65)]"
          >
            Seal &amp; pass →
          </motion.button>
          <motion.button
            type="button"
            disabled={presenceBusy}
            whileHover={reduce ? undefined : { y: -2, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              void (async () => {
                setPresenceBusy(true);
                setPresenceNote(null);
                try {
                  const res = await fetch("/api/presences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      memoryId: story.id,
                      label: story.cloaked
                        ? "a stranger"
                        : story.authorDisplayName.split(/\s+/)[0],
                    }),
                  });
                  const data = (await res.json()) as {
                    error?: string;
                    notice?: string;
                    presence?: { id: string };
                  };
                  if (!res.ok) {
                    setPresenceNote(data.error ?? "Could not step onto the map.");
                    return;
                  }
                  setPresenceNote(
                    data.notice ??
                      "You are a place for one hour — open the map to walk.",
                  );
                  if (data.presence?.id) {
                    window.setTimeout(() => {
                      window.location.href = `/map?presence=${data.presence!.id}`;
                    }, 900);
                  }
                } catch {
                  setPresenceNote("Could not step onto the map.");
                } finally {
                  setPresenceBusy(false);
                }
              })();
            }}
            className="font-hand ms-btn inline-flex h-9 items-center bg-[#e87860] px-3.5 text-sm font-semibold text-[#1a1612] shadow-[0_10px_24px_-12px_rgba(232,120,96,0.65)] disabled:opacity-50"
          >
            {presenceBusy ? "Stepping on…" : "Become a place →"}
          </motion.button>
          {presenceNote ? (
            <span className="font-hand ms-sticky ms-sticky--pink px-3 py-1 text-sm font-semibold">
              {presenceNote}
            </span>
          ) : null}
        </div>

        {story.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {story.tags.map((tag, i) => (
              <span
                key={tag}
                className={`font-hand rounded-sm px-2.5 py-1 text-sm font-semibold ring-1 ring-ink/15 ${
                  ["bg-[#ffd0e8]", "bg-[#c8e4ff]", "bg-[#fff3c4]", "bg-[#d8f0c8]"][
                    i % 4
                  ]
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <ScrapReadsYou memoryId={story.id} />

        <section className="mt-14">
          <p className="font-hand text-2xl font-semibold text-[#b83240]">
            pages that echo this one
          </p>
          <h2 className="mt-1 font-display text-2xl text-[#1a1612] sm:text-3xl">
            Stories that remember nearby
          </h2>
          <p className="mt-2 text-sm text-[#5c3a2e]">
            Connections between accounts — not a verdict on truth.
          </p>
          {story.echoes.length === 0 ? (
            <div className="ms-scrap-page ms-scrap-page--mint mt-6 p-5">
              <p className="font-hand text-lg font-semibold text-[#14383a]">
                No echoes pasted here yet.
              </p>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {story.echoes.map((echo, i) => (
                <motion.li
                  key={echo.id}
                  initial={reduce ? false : { opacity: 0, x: -12, rotate: -2 }}
                  whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 1.2 : -1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: easeOut }}
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -4, rotate: 0, transition: { type: "spring", stiffness: 280 } }
                  }
                >
                  <Link
                    href={`/story/${echo.memory.id}`}
                    className={`ms-scrap-page ${scrapTones[i % scrapTones.length]} relative block px-4 py-3.5`}
                  >
                    <span
                      className={`ms-washi absolute -top-1.5 left-5 h-4 w-12 ${
                        ["ms-washi--coral", "ms-washi--teal", "ms-washi--sun"][
                          i % 3
                        ]
                      }`}
                    />
                    <p className="font-hand text-sm font-semibold text-[#b83240]">
                      {RELATION_LABELS[echo.relationType]}
                    </p>
                    <p className="mt-1 font-display text-lg text-[#1a1612]">
                      {echo.memory.title}
                    </p>
                    {echo.description ? (
                      <p className="font-hand mt-1 text-base text-[#3a1f2e]">
                        {echo.description}
                      </p>
                    ) : null}
                    <p className="font-hand mt-2 text-right text-base font-semibold text-[#b83240]">
                      open →
                    </p>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Full-width closing band — compact + walking characters */}
      <motion.footer
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="relative z-10 mt-8 w-full overflow-clip border-t border-ink/10"
      >
        <div className="absolute inset-0 bg-[#5c2430]" />
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-20" />

        {/* Quote row */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 py-5 text-center sm:px-8 sm:py-6">
          <p className="font-hand text-base font-semibold text-[#ffb0c8] sm:text-lg">
            a note under the last scrap
          </p>
          <blockquote className="mt-1.5">
            <p className="font-display text-xl leading-snug tracking-tight text-[#fff6e8] sm:text-2xl md:text-[1.65rem]">
              “You leave a place — but a corner of it keeps your name,
              spoken softly, whenever it rains.”
            </p>
          </blockquote>
          <Link
            href="/map"
            className="font-hand ms-sticky ms-sticky--pink mt-3 inline-flex px-4 py-1.5 text-sm font-semibold"
          >
            ← back to the map
          </Link>
        </div>

        {/* Walking parade — clipped so off-screen walks can't grow the page */}
        <div
          className="relative z-10 h-24 w-full overflow-clip border-t border-[#ffe9c8]/15 sm:h-28"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 bottom-2 h-0.5 bg-[#ffe9c8]/25" />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#3a1520]/40" />

          {!reduce ? (
            <>
              <motion.div
                className="absolute bottom-3 left-0"
                animate={{
                  left: ["-15%", "110%"],
                  y: [0, -7, 0, -7, 0],
                  rotate: [0, -6, 0, 6, 0],
                }}
                transition={{
                  left: { duration: 14, repeat: Infinity, ease: "linear" },
                  y: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <RainAuntie className="h-16 w-14 drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)] sm:h-20 sm:w-16" />
              </motion.div>

              <motion.div
                className="absolute bottom-3 left-0"
                animate={{
                  left: ["-18%", "112%"],
                  y: [0, -6, 0, -6, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  left: {
                    duration: 11,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2.2,
                  },
                  y: { duration: 0.55, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 0.55,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <PlasticSticker color="#c8e4ff">
                  <StickerUmbrellaKid className="h-12 w-10 sm:h-14 sm:w-12" />
                </PlasticSticker>
              </motion.div>

              <motion.div
                className="absolute bottom-2 left-0"
                animate={{
                  left: ["110%", "-18%"],
                  y: [0, -8, 0, -8, 0],
                  rotate: [0, 7, 0, -7, 0],
                }}
                transition={{
                  left: {
                    duration: 13,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                  },
                  y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="-scale-x-100">
                  <TramKid className="h-16 w-16 drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)] sm:h-20 sm:w-20" />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-2 left-0"
                animate={{
                  left: ["115%", "-20%"],
                  y: [0, -5, 0, -5, 0],
                  rotate: [0, -5, 0, 5, 0],
                }}
                transition={{
                  left: {
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 4,
                  },
                  y: { duration: 0.65, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 0.65,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="-scale-x-100">
                  <CoffeeDada className="h-16 w-16 drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)] sm:h-20 sm:w-20" />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-5 left-0"
                animate={{
                  left: ["-10%", "108%"],
                  y: [0, -10, 0, -10, 0],
                  rotate: [0, 16, -8, 16, 0],
                }}
                transition={{
                  left: {
                    duration: 9,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.8,
                  },
                  y: { duration: 0.45, repeat: Infinity, ease: "easeOut" },
                  rotate: {
                    duration: 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <StickerHeart className="h-8 w-8 drop-shadow-md" />
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-0"
                animate={{
                  left: ["108%", "-10%"],
                  y: [0, -10, 0, -10, 0],
                  rotate: [0, -20, 12, -20, 0],
                }}
                transition={{
                  left: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 3,
                  },
                  y: { duration: 0.4, repeat: Infinity, ease: "easeOut" },
                  rotate: {
                    duration: 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <StickerStar className="h-8 w-8 drop-shadow-md" />
              </motion.div>

              <motion.div
                className="absolute bottom-4 left-0 hidden sm:block"
                animate={{
                  left: ["-12%", "110%"],
                  y: [0, -6, 0, -6, 0],
                  rotate: [0, 8, 0, -8, 0],
                }}
                transition={{
                  left: {
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5.5,
                  },
                  y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <PlasticSticker color="#ffe49a">
                  <StickerChai className="h-10 w-9" />
                </PlasticSticker>
              </motion.div>
            </>
          ) : (
            <div className="flex h-full items-end justify-center gap-4 pb-2">
              <RainAuntie className="h-14 w-12" />
              <TramKid className="h-14 w-14" />
              <CoffeeDada className="h-14 w-14" />
            </div>
          )}
        </div>
      </motion.footer>
    </motion.main>
    </PageTurn>
    <SealPassModal
      open={sealOpen}
      onClose={() => setSealOpen(false)}
      memoryId={story.id}
      placeName={story.place.name}
    />
    </>
  );
}
