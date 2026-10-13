"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PageTurn } from "@/components/motion/PageTurn";
import { easeOut } from "@/components/motion/primitives";
import { letterOpenedKey } from "@/lib/letterStorage";

type Peek = {
  memoryId: string;
  placeName: string;
  neighborhoodLabel: string;
  fromLabel: string;
};

type StoryBody = {
  id: string;
  title: string;
  text: string;
  authorDisplayName: string;
  cloaked: boolean;
  place: { id: string; name: string; neighborhoodLabel: string };
};

export function LetterExperience({ token }: { token: string }) {
  const reduce = useReducedMotion();
  const [peek, setPeek] = useState<Peek | null>(null);
  const [story, setStory] = useState<StoryBody | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [breaking, setBreaking] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(letterOpenedKey(token)) === "1") {
        setOpened(true);
      }
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/letters/${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error("missing");
        const data = (await res.json()) as Peek;
        if (!cancelled) setPeek(data);
      } catch {
        if (!cancelled) setError("This letter could not be found — or the seal washed away.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!opened || !peek || story) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/memories/${peek.memoryId}`);
        if (!res.ok) throw new Error("story");
        const data = (await res.json()) as StoryBody;
        if (!cancelled) setStory(data);
      } catch {
        if (!cancelled) setError("The seal broke, but the scrap would not open.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opened, peek, story]);

  function breakSeal() {
    if (breaking || opened) return;
    setBreaking(true);
    window.setTimeout(() => {
      setOpened(true);
      setBreaking(false);
      try {
        localStorage.setItem(letterOpenedKey(token), "1");
      } catch {
        /* ignore */
      }
    }, reduce ? 0 : 900);
  }

  if (error) {
    return (
      <div className="ms-story-shell min-h-dvh bg-[#e8c9a8]">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="font-hand text-2xl font-semibold text-[#5c2430]">{error}</p>
          <Link href="/map" className="font-hand mt-6 inline-block text-lg underline">
            back to the map
          </Link>
        </main>
      </div>
    );
  }

  if (!peek) {
    return (
      <div className="ms-story-shell min-h-dvh bg-[#e8c9a8]">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-5 py-16">
          <p className="font-hand text-xl text-[#5c3a2e]">A letter is arriving…</p>
        </main>
      </div>
    );
  }

  if (!opened) {
    return (
      <div className="ms-story-shell relative min-h-dvh overflow-clip bg-[#2a1a12]">
        <div className="pointer-events-none absolute inset-0 ms-desk-bg opacity-90" />
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-30" />
        <SiteHeader variant="overlay" />

        <main className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-5 pb-16 pt-24">
          <motion.p
            className="font-hand text-center text-xl font-semibold text-[#ffb0c8]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            someone passed you a scrap
          </motion.p>
          <motion.h1
            className="mt-2 text-center font-display text-3xl tracking-tight text-[#fff6e8] sm:text-4xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A sealed letter from {peek.placeName}
          </motion.h1>
          <p className="font-hand mt-2 text-center text-lg text-[#ffe9c8]/80">
            {peek.neighborhoodLabel} · left by {peek.fromLabel}
          </p>
          <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-[#ffe9c8]/55">
            The page is blank until you break the wax. This is inheritance — not a preview.
          </p>

          <motion.button
            type="button"
            onClick={breakSeal}
            disabled={breaking}
            className="ms-envelope relative mt-10 w-full max-w-sm cursor-pointer border-0 bg-transparent p-0 text-left"
            initial={reduce ? false : { opacity: 0, y: 24, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: breaking ? 1 : -1 }}
            transition={{ delay: 0.2, duration: 0.55, ease: easeOut }}
            whileHover={reduce || breaking ? undefined : { y: -4, rotate: 0 }}
            aria-label="Break the wax seal"
          >
            <div className="ms-envelope-body relative aspect-[5/3] w-full">
              <motion.div
                className="ms-envelope-flap absolute inset-x-0 top-0 z-[2]"
                animate={breaking ? { rotateX: -150, opacity: 0.85 } : { rotateX: 0 }}
                transition={{ duration: 0.85, ease: easeOut }}
                style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-hand px-6 text-center text-xl font-semibold text-[#5c2430]/35">
                  {breaking ? "…" : "blank until the seal breaks"}
                </p>
              </div>
              <motion.div
                className="ms-wax-seal absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2"
                animate={
                  breaking
                    ? { scale: [1, 1.15, 0.4], opacity: [1, 1, 0], rotate: [0, -20, 40] }
                    : reduce
                      ? { scale: 1 }
                      : { scale: [1, 1.06, 1] }
                }
                transition={
                  breaking
                    ? { duration: 0.85, ease: easeOut }
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <span className="font-hand text-2xl font-bold text-[#ffe9c8]">♡</span>
              </motion.div>
            </div>
            <p className="font-hand mt-4 text-center text-lg font-semibold text-[#ffc53d]">
              {breaking ? "wax cracking…" : "tap the seal to open →"}
            </p>
          </motion.button>
        </main>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="ms-story-shell min-h-dvh bg-[#e8c9a8]">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-5 py-16">
          <p className="font-hand text-xl text-[#5c3a2e]">Unfolding the scrap…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="ms-story-shell bg-[#e8c9a8]">
      <SiteHeader />
      <PageTurn>
        <main className="relative mx-auto max-w-2xl overflow-x-clip px-5 py-12 sm:py-16">
          <p className="font-hand text-lg font-semibold text-[#b83240]">
            seal broken · the scrap is yours now
          </p>
          <p className="mt-1 text-sm text-[#5c3a2e]">
            Passed from {peek.fromLabel} · {story.place.name}
          </p>
          <article className="ms-scrap-page ms-scrap-page--peach ms-scrap-stack relative mt-8 px-6 py-8 sm:px-9 sm:py-10">
            <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-4 w-24 -translate-x-1/2" />
            <h1 className="font-display text-3xl tracking-tight text-[#1a1612] sm:text-4xl">
              {story.title}
            </h1>
            <p className="font-hand mt-2 text-base text-[#5c3a2e]">
              {story.cloaked ? "someone who was there" : story.authorDisplayName}
            </p>
            <div className="mt-6 space-y-4 text-base leading-[1.9] text-[#3a1f2e] sm:text-lg">
              {story.text.split(/\n\n+/).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </article>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/story/${story.id}`}
              className="font-hand ms-sticky ms-sticky--pink px-3 py-1.5 text-base font-semibold"
            >
              open full diary page →
            </Link>
            <Link
              href="/map"
              className="font-hand ms-sticky ms-sticky--sky px-3 py-1.5 text-base font-semibold"
            >
              ← back to the map
            </Link>
          </div>
        </main>
      </PageTurn>
    </div>
  );
}
