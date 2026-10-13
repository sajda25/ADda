"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
  CoffeeRing,
  PaperClip,
  PostageStamp,
  TicketStub,
  TornScrap,
} from "@/components/demo/ScrapbookBits";
import { ScrapbookStage } from "@/components/demo/ScrapbookStage";

const cities = [
  "Kolkata",
  "Bengaluru",
  "Chandigarh",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
];

const diaryEntries = [
  {
    date: "Monsoon · ’19",
    city: "Kolkata",
    place: "College Street · Coffee House",
    title: "The table where we became friends",
    note: "Three cups. One shared umbrella. The city felt smaller after that.",
    reads: 192,
    tone: "peach" as const,
    washi: "coral" as const,
    href: "/story/mem_ch_friends",
  },
  {
    date: "Monsoon · ’18",
    city: "Kolkata",
    place: "Boi Para Lane",
    title: "He found me hiding in Fiction",
    note: "School crush, a borrowed handkerchief, and a number the rain erased.",
    reads: 128,
    tone: "lavender" as const,
    washi: "berry" as const,
    href: "/story/mem_book_monsoon",
  },
  {
    date: "Dusk · always",
    city: "Kolkata",
    place: "Esplanade Tram Crossing",
    title: "Our hands met on the pole",
    note: "Three stops without letting go. Bravery tasted like wet iron.",
    reads: 156,
    tone: "butter" as const,
    washi: "sun" as const,
    href: "/story/mem_tram_bell",
  },
];

const scrapNotes = [
  { text: "Bengaluru traffic = more stories", rotate: -4, sticky: "pink" as const },
  { text: "Chandigarh sundown walks", rotate: 3, sticky: "lime" as const },
  { text: "every city keeps a diary ♡", rotate: -2, sticky: "sky" as const },
];

export function LandingExperience() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bookY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const bookRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -2]);
  const scrapOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] overflow-hidden ms-desk-bg"
      >
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-40" />
        <div className="pointer-events-none absolute inset-0 ms-cork-scatter opacity-80" />
        <ScrapbookStage scrapOpacity={scrapOpacity} />

        {/* Sticky notes with peel-in */}
        {scrapNotes.map((note, i) => (
          <motion.p
            key={note.text}
            className={`font-hand ms-sticky pointer-events-none absolute z-[7] hidden px-3 py-2 text-lg font-semibold md:block ms-sticky--${note.sticky}`}
            style={{
              top: `${14 + i * 26}%`,
              right: i === 1 ? "22%" : i === 2 ? "4%" : undefined,
              left: i === 0 ? "20%" : undefined,
              opacity: scrapOpacity,
            }}
            initial={
              reduce ? false : { opacity: 0, scale: 0.4, rotate: note.rotate - 25, y: -30 }
            }
            animate={
              reduce
                ? { opacity: 1, rotate: note.rotate }
                : {
                    opacity: 1,
                    scale: [1, 1.04, 1],
                    rotate: [note.rotate, note.rotate + 3, note.rotate],
                    y: [0, -10, 0],
                  }
            }
            transition={{
              delay: 0.9 + i * 0.18,
              duration: reduce ? 0.4 : 3.8 + i * 0.4,
              repeat: reduce ? 0 : Infinity,
              ease: "easeInOut",
              type: reduce ? undefined : undefined,
            }}
          >
            {note.text}
          </motion.p>
        ))}

        <SiteHeader variant="overlay" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:px-8 sm:pb-20">
          <motion.div style={{ y: bookY, rotate: bookRotate }} className="ms-diary-stack relative mx-auto max-w-5xl">
            {/* Open diary on a stack of scrap papers */}
            <motion.div
              className="ms-diary relative grid overflow-hidden rounded-sm md:grid-cols-2"
              initial={reduce ? false : { opacity: 0, rotateX: 18, y: 50, scale: 0.94 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      rotateX: 0,
                      y: [0, -4, 0],
                      scale: 1,
                    }
              }
              transition={{
                duration: 1.05,
                ease: easeOut,
                y: { delay: 1.1, duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* Spine */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-6 -translate-x-1/2 md:block">
                <motion.div
                  className="ms-diary-spine h-full w-full"
                  animate={reduce ? undefined : { opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Left page — brand */}
              <div className="ms-diary-page ms-diary-page--peach relative border-b border-ink/15 px-7 py-10 sm:px-10 sm:py-14 md:border-b-0 md:border-r md:border-ink/10">
                <motion.span
                  className="ms-washi ms-washi--coral pointer-events-none absolute -left-1 top-10 h-14 w-8 origin-top"
                  initial={reduce ? false : { rotate: -40, y: -20, opacity: 0 }}
                  animate={
                    reduce
                      ? { rotate: -12, opacity: 1 }
                      : { rotate: [-12, -8, -12], y: 0, opacity: 1 }
                  }
                  transition={{
                    delay: 0.7,
                    duration: 4,
                    rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  }}
                />
                <motion.span
                  className="ms-washi ms-washi--sun pointer-events-none absolute right-8 top-4 h-4 w-20 origin-left"
                  initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                  animate={
                    reduce
                      ? { scaleX: 1, opacity: 1, rotate: 6 }
                      : { scaleX: 1, opacity: 1, rotate: [6, 9, 6] }
                  }
                  transition={{
                    delay: 0.85,
                    duration: 0.5,
                    rotate: { delay: 1.4, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
                <motion.span
                  className="ms-washi ms-washi--dots pointer-events-none absolute top-1/2 -left-2 h-3 w-16"
                  animate={reduce ? undefined : { rotate: [-90, -84, -90] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute -top-3 left-1/3 z-30"
                  animate={reduce ? undefined : { y: [0, 3, 0], rotate: [-8, -4, -8] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PaperClip className="h-14 w-8" />
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute top-16 right-6"
                  animate={reduce ? undefined : { rotate: [0, 12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CoffeeRing className="h-20 w-20 opacity-80" />
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute top-28 -right-3 hidden w-24 sm:block"
                  initial={reduce ? false : { scale: 0, rotate: 40 }}
                  animate={
                    reduce
                      ? { scale: 1, rotate: 12 }
                      : { scale: 1, rotate: [12, 18, 12], y: [0, -6, 0] }
                  }
                  transition={{
                    delay: 1.1,
                    type: "spring",
                    stiffness: 200,
                    rotate: { delay: 1.6, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                    y: { delay: 1.6, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <TornScrap className="p-2 text-center">
                    <p className="font-hand text-sm font-semibold text-[#5c2430]">
                      keep forever
                    </p>
                  </TornScrap>
                </motion.div>
                <motion.p
                  className="ms-scribble pointer-events-none absolute bottom-28 left-8 hidden text-4xl sm:block"
                  animate={reduce ? undefined : { opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  ✦ ✦ ✦
                </motion.p>
                <motion.p
                  className="font-hand text-xl font-semibold text-[#b83240]"
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  Dear cities —
                </motion.p>
                <motion.p
                  className="mt-6 font-display text-4xl leading-[0.95] tracking-tight text-[#5c2430] sm:text-5xl md:text-6xl"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.7, ease: easeOut }}
                >
                  AD
                  <span className="text-[#c45c48]">da</span>
                </motion.p>
                <motion.div
                  className="mt-5 h-1 w-28 origin-left rounded-full bg-[#e87860]"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.85, duration: 0.6, ease: easeOut }}
                />
                <motion.p
                  className="font-hand mt-6 max-w-sm text-2xl leading-snug font-semibold text-[#6a2e4a]"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.95, duration: 0.7 }}
                >
                  every place has more than one story…
                </motion.p>
                <motion.p
                  className="mt-4 max-w-sm text-sm leading-relaxed text-[#5c3a2e]"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  A living diary of neighborhoods across India — from Kolkata
                  adda to Bengaluru cafés to Chandigarh plazas, and every corner
                  people keep rewriting.
                </motion.p>

                <motion.span
                  className="ms-stamp pointer-events-none absolute bottom-24 left-8 px-3 py-1 text-[10px] text-[#c45c48]"
                  initial={reduce ? false : { opacity: 0, scale: 1.4, rotate: -12 }}
                  animate={{ opacity: 0.8, scale: 1, rotate: -8 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 220 }}
                >
                  kept · ’26
                </motion.span>

                {!reduce ? (
                  <motion.div
                    className="absolute bottom-4 right-4"
                    animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CoffeeDada className="h-24 w-24 sm:h-28 sm:w-28" />
                  </motion.div>
                ) : (
                  <CoffeeDada className="absolute bottom-4 right-4 h-24 w-24" />
                )}
              </div>

              {/* Right page — CTA */}
              <div className="ms-diary-page ms-diary-page--mint relative px-7 py-10 sm:px-10 sm:py-14">
                <motion.span
                  className="ms-washi ms-washi--teal pointer-events-none absolute right-6 top-6 h-4 w-24 origin-right"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={
                    reduce
                      ? { scaleX: 1, rotate: -4 }
                      : { scaleX: 1, rotate: [-4, 0, -4] }
                  }
                  transition={{
                    delay: 0.95,
                    rotate: { delay: 1.5, duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
                <motion.span
                  className="ms-washi ms-washi--berry pointer-events-none absolute bottom-10 right-4 h-12 w-7"
                  animate={reduce ? undefined : { rotate: [12, 18, 12], y: [0, -3, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="ms-washi ms-washi--grid pointer-events-none absolute top-20 -right-1 h-3 w-14"
                  animate={reduce ? undefined : { rotate: [12, 18, 12] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute top-8 left-4 hidden w-24 sm:block"
                  initial={reduce ? false : { opacity: 0, y: -24, rotate: -20 }}
                  animate={
                    reduce
                      ? { opacity: 1, rotate: -6 }
                      : { opacity: 1, rotate: [-6, -2, -6], y: [0, -6, 0] }
                  }
                  transition={{
                    delay: 1.15,
                    type: "spring",
                    rotate: { delay: 1.8, duration: 4, repeat: Infinity, ease: "easeInOut" },
                    y: { delay: 1.8, duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <TicketStub label="Chandigarh" code="IXC-17" />
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute right-8 bottom-24 hidden scale-90 sm:block"
                  initial={reduce ? false : { scale: 0, rotate: -30 }}
                  animate={
                    reduce
                      ? { scale: 0.9, rotate: 14 }
                      : { scale: 0.9, rotate: [14, 20, 14], y: [0, -8, 0] }
                  }
                  transition={{
                    delay: 1.3,
                    type: "spring",
                    stiffness: 220,
                    rotate: { delay: 1.9, duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                    y: { delay: 1.9, duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <PostageStamp city="BLR" />
                </motion.div>
                <motion.p
                  className="ms-scribble pointer-events-none absolute right-10 bottom-36 hidden text-3xl md:block"
                  animate={
                    reduce ? undefined : { opacity: [0.4, 0.9, 0.4], rotate: [-12, -8, -12] }
                  }
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  cut here ↓
                </motion.p>
                <motion.p
                  className="text-[10px] font-semibold tracking-[0.22em] text-[#1f5c5e] uppercase"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Today&apos;s entry
                </motion.p>
                <motion.h1
                  className="mt-3 font-display text-3xl leading-tight tracking-tight text-[#14383a] sm:text-4xl"
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: easeOut }}
                >
                  Open the neighborhood diary.
                </motion.h1>
                <motion.p
                  className="mt-3 text-sm leading-relaxed text-[#2a4e50] sm:text-base"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.95 }}
                >
                  Browse neighborhood storybooks across cities — no account, no
                  wallet. Places that remember you back.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/map"
                      className="ms-btn inline-flex h-12 items-center justify-center bg-[#e87860] px-7 text-sm font-semibold tracking-wide text-[#1a1612] shadow-[0_12px_40px_-12px_rgba(232,120,96,0.75)]"
                    >
                      Open the Story Map
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/#diary-pages"
                      className="ms-btn inline-flex h-12 items-center justify-center border-2 border-[#1f5c5e]/40 bg-[#fff3c4] px-7 text-sm font-medium text-[#14383a] hover:bg-[#ffe49a]"
                    >
                      Read a few pages
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.p
                  className="font-hand mt-6 text-xl font-semibold text-[#9a4e8a]"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.25 }}
                >
                  — illustrative demo, doodled with love
                </motion.p>

                {!reduce ? (
                  <motion.span
                    className="ms-ink-blot pointer-events-none absolute bottom-8 left-8 h-20 w-20 rounded-full bg-[#9a4e8a]/25"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.65, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                ) : null}
              </div>
            </motion.div>

            {/* Floating polaroids — flip in, then bob */}
            <motion.div
              className="pointer-events-none absolute -left-2 top-[12%] z-30 hidden w-28 lg:block xl:-left-8 xl:w-32"
              initial={reduce ? false : { opacity: 0, x: -50, rotateY: 70, rotate: -18 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, rotate: -12 }}
              transition={{ delay: 1.15, type: "spring", stiffness: 120, damping: 14 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={
                  reduce ? undefined : { y: [0, -14, 0], rotate: [-10, -4, -10] }
                }
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={reduce ? undefined : { scale: 1.08, rotate: 0 }}
              >
                <PolaroidFrame caption="Kolkata" rotate={0} theme="sun">
                  <TramKid className="h-full w-full p-1" />
                </PolaroidFrame>
              </motion.div>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute -right-2 top-[8%] z-30 hidden w-28 lg:block xl:-right-6 xl:w-32"
              initial={reduce ? false : { opacity: 0, x: 50, rotateY: -70, rotate: 16 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, rotate: 8 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 120, damping: 14 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={
                  reduce ? undefined : { y: [0, -16, 0], rotate: [7, 14, 7] }
                }
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <PolaroidFrame caption="Bengaluru" rotate={0} theme="mint">
                  <Bookworm className="h-full w-full p-2" />
                </PolaroidFrame>
              </motion.div>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute -bottom-6 right-[18%] z-30 hidden w-28 md:block"
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
              transition={{ delay: 1.45, type: "spring", stiffness: 160 }}
            >
              <motion.div
                animate={
                  reduce ? undefined : { y: [0, -10, 0], rotate: [-4, 2, -4] }
                }
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <PolaroidFrame caption="Chandigarh" rotate={0} theme="coral">
                  <RainAuntie className="h-full w-full p-1" />
                </PolaroidFrame>
              </motion.div>
            </motion.div>
          </motion.div>

          {!reduce ? (
            <motion.div
              className="mt-10 flex flex-col items-center gap-2 text-[#ffe9c8]"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-hand text-lg font-semibold">turn the page</span>
              <span className="h-8 w-px bg-[#ffc53d]/70" />
            </motion.div>
          ) : null}
        </div>
      </section>

      <main className="flex-1">
        <section
          id="diary-pages"
          className="ms-section-scrap relative overflow-hidden border-t border-ink/10"
        >
          <div className="pointer-events-none absolute inset-0 paper-grain opacity-25" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <p className="font-hand text-2xl font-semibold text-[#c45c48]">
                pages from many cities
              </p>
              <h2 className="mt-2 max-w-2xl font-display text-3xl tracking-tight text-[#3a1f2e] sm:text-5xl">
                Same idea. Different streets.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c3a2e]">
                Each place is a scrapbook — Kolkata, Bengaluru, Chandigarh, and
                more. Popular memories rise; quieter ones stay on the page.
              </p>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-2">
              {cities.map((city, i) => (
                <motion.div
                  key={city}
                  initial={reduce ? false : { opacity: 0, y: 10, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 220 }}
                  whileHover={reduce ? undefined : { y: -3, rotate: i % 2 ? 2 : -2 }}
                >
                  <Link
                    href={`/map?city=${encodeURIComponent(city)}`}
                    className={`font-hand ms-sticky inline-block cursor-pointer px-3 py-1.5 text-base font-semibold ${
                      ["ms-sticky--pink", "ms-sticky--lime", "ms-sticky--sky"][i % 3]
                    }`}
                  >
                    {city}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {diaryEntries.map((entry, i) => (
                <motion.div
                  key={entry.title}
                  initial={
                    reduce
                      ? false
                      : {
                          opacity: 0,
                          y: 50,
                          rotate: i % 2 ? 8 : -8,
                          scale: 0.88,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: i === 1 ? 1.5 : i === 2 ? -2 : -1,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.14,
                    type: "spring",
                    stiffness: 140,
                    damping: 14,
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: -12,
                          rotate: 0,
                          scale: 1.03,
                          transition: { type: "spring", stiffness: 280 },
                        }
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={entry.href}
                    className={`ms-scrap-page ms-scrap-stack ms-scrap-page--${entry.tone} relative flex h-full cursor-pointer flex-col p-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#e87860]`}
                  >
                    <motion.span
                      className={`ms-washi ms-washi--${entry.washi} absolute -top-2 left-6 h-5 w-16`}
                      animate={reduce ? undefined : { rotate: [-3, 2, -3] }}
                      transition={{ duration: 3.2 + i, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="ms-washi ms-washi--dots absolute -right-1 top-10 h-3 w-12"
                      animate={reduce ? undefined : { rotate: [90, 96, 90] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -top-4 right-8"
                      animate={reduce ? undefined : { y: [0, 3, 0], rotate: [12, 18, 12] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <PaperClip className="h-12 w-7" />
                    </motion.div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8b2e1f] uppercase">
                      {entry.city} · {entry.date}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#5c3a2e]/80">
                      {entry.place}
                    </p>
                    <h3 className="mt-3 font-display text-xl leading-snug text-[#1a1612]">
                      {entry.title}
                    </h3>
                    <p className="font-hand mt-3 flex-1 text-xl leading-snug font-semibold text-[#3a1f2e]">
                      {entry.note}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink/20 pt-3">
                      <span className="text-xs tabular-nums text-[#3a1f2e]/70">
                        {entry.reads} reads
                      </span>
                      <span className="font-hand text-lg font-semibold text-[#b83240]">
                        open →
                      </span>
                    </div>
                    {i === 0 ? (
                      <CoffeeDada className="pointer-events-none absolute -right-2 -bottom-1 h-16 w-16" />
                    ) : null}
                    {i === 1 ? (
                      <Bookworm className="pointer-events-none absolute -right-1 bottom-0 h-14 w-14" />
                    ) : null}
                    {i === 2 ? (
                      <TramKid className="pointer-events-none absolute -right-2 bottom-0 h-14 w-16" />
                    ) : null}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative overflow-hidden ms-desk-bg">
          <div className="pointer-events-none absolute inset-0 paper-grain opacity-35" />
          <div className="pointer-events-none absolute inset-0 ms-cork-scatter opacity-70" />

          {/* Floating desk scraps */}
          <motion.div
            className="pointer-events-none absolute top-10 left-[6%] hidden w-28 rotate-[-10deg] lg:block"
            animate={reduce ? undefined : { y: [0, -10, 0], rotate: [-10, -4, -10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <TicketStub label="how it works" code="TIP-01" />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute top-16 right-[8%] hidden rotate-[12deg] md:block"
            animate={reduce ? undefined : { y: [0, -8, 0], rotate: [12, 18, 12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PostageStamp city="MAP" />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute bottom-12 left-[12%] hidden w-24 xl:block"
            animate={reduce ? undefined : { rotate: [-6, 2, -6], y: [0, -6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <TornScrap className="bg-[#ffd0e8] p-2 text-center">
              <p className="font-hand text-sm font-semibold text-[#5c2430]">step 1 → tap</p>
            </TornScrap>
          </motion.div>

          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-22">
            <motion.div
              className="ms-scrap-page ms-scrap-page--butter ms-scrap-stack relative mx-auto max-w-2xl p-6 text-center sm:p-8"
              initial={reduce ? false : { opacity: 0, y: 24, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              <span className="ms-washi ms-washi--sun absolute -top-2 left-1/2 h-5 w-24 -translate-x-1/2" />
              <span className="ms-washi ms-washi--coral absolute -left-1 top-8 h-12 w-6 -rotate-12" />
              <p className="font-hand text-2xl font-semibold text-[#b83240]">
                how this diary works
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-[#3a1f2e] sm:text-4xl">
                Tap a place. Step into its many lives.
              </h2>
              <p className="font-hand mt-3 text-xl text-[#5c3a2e]">
                three scraps. one neighborhood book.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Memory Echoes",
                  body: "Follow connections across time — echo, contradiction, transformation — without declaring a winner.",
                  doodle: <CoffeeDada className="h-16 w-16" />,
                  tone: "peach" as const,
                  washi: "coral" as const,
                  stamp: "echo",
                  rotate: -2.5,
                },
                {
                  title: "A mural that remembers",
                  body: "Watch a neighborhood mural evolve from tags, layers, and relations. Every change is explainable.",
                  doodle: <RainAuntie className="h-16 w-16" />,
                  tone: "sky" as const,
                  washi: "teal" as const,
                  stamp: "live",
                  rotate: 1.5,
                },
                {
                  title: "Shared provenance",
                  body: "Optional on-chain commitments on Monad. Story text stays off-chain. Truth is never purchased.",
                  doodle: <Bookworm className="h-16 w-16" />,
                  tone: "lavender" as const,
                  washi: "berry" as const,
                  stamp: "kept",
                  rotate: -1,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, y: 40, rotate: item.rotate * 3, scale: 0.9 }
                  }
                  whileInView={{ opacity: 1, y: 0, rotate: item.rotate, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    type: "spring",
                    stiffness: 140,
                    damping: 14,
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: -10,
                          rotate: 0,
                          scale: 1.03,
                          transition: { type: "spring", stiffness: 260 },
                        }
                  }
                  className={`ms-scrap-page ms-scrap-stack ms-scrap-page--${item.tone} relative p-5 sm:p-6`}
                >
                  <motion.span
                    className={`ms-washi ms-washi--${item.washi} absolute -top-2 left-5 h-5 w-16`}
                    animate={reduce ? undefined : { rotate: [-4, 2, -4] }}
                    transition={{ duration: 3.4 + i, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="ms-washi ms-washi--dots absolute -right-1 top-12 h-3 w-12"
                    animate={reduce ? undefined : { rotate: [90, 98, 90] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute -top-3 right-6"
                    animate={reduce ? undefined : { y: [0, 3, 0], rotate: [10, 16, 10] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PaperClip className="h-11 w-6" />
                  </motion.div>

                  <div className="relative mb-4 inline-block rounded-sm bg-[#fff3c4] p-1 shadow-md ring-2 ring-ink/15">
                    <motion.div
                      animate={
                        reduce
                          ? undefined
                          : { rotate: [-4, 4, -4], y: [0, -5, 0] }
                      }
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {item.doodle}
                    </motion.div>
                  </div>

                  <p className="font-hand text-lg font-semibold text-[#b83240]">
                    scrap {i + 1}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-[#1a1612]">
                    {item.title}
                  </h3>
                  <p className="font-hand mt-3 text-lg leading-snug text-[#3a1f2e]">
                    {item.body}
                  </p>

                  <motion.span
                    className="ms-stamp mt-5 inline-block px-3 py-1 text-[10px] text-[#c45c48]"
                    animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.6 + i, repeat: Infinity }}
                  >
                    {item.stamp}
                  </motion.span>

                  {i === 1 ? (
                    <CoffeeRing className="pointer-events-none absolute right-2 bottom-2 h-16 w-16 opacity-50" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="ms-section-scrap relative overflow-hidden border-t border-ink/10">
          <div className="pointer-events-none absolute inset-0 paper-grain opacity-35" />
          <div className="pointer-events-none absolute inset-0 ms-cork-scatter opacity-50" />

          <motion.div
            className="pointer-events-none absolute top-10 left-[8%] hidden rotate-[-8deg] lg:block"
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <TornScrap className="bg-[#ffd0e8] px-3 py-2">
              <p className="font-hand text-sm font-semibold text-[#5c2430]">for you ♡</p>
            </TornScrap>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-[7%] top-16 hidden rotate-[10deg] md:block"
            animate={reduce ? undefined : { y: [0, -10, 0], rotate: [10, 16, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <PostageStamp city="♡" />
          </motion.div>

          <div className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
            <motion.div
              className="ms-scrap-page ms-scrap-page--peach ms-scrap-stack relative px-7 py-12 text-center sm:px-14 sm:py-16"
              initial={reduce ? false : { opacity: 0, y: 40, rotate: -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -0.5 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, ease: easeOut }}
            >
              <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-5 w-28 -translate-x-1/2" />
              <span className="ms-washi ms-washi--sun absolute top-10 -left-1 h-14 w-7 -rotate-12" />
              <span className="ms-washi ms-washi--berry absolute top-12 -right-1 h-14 w-7 rotate-12" />
              <PaperClip className="absolute -top-3 left-[18%] h-12 w-7 rotate-[-8deg]" />
              <PaperClip className="absolute -top-3 right-[18%] h-12 w-7 rotate-[10deg]" />
              <CoffeeRing className="pointer-events-none absolute right-8 bottom-10 h-24 w-24 opacity-40" />

              <motion.p
                className="font-hand text-xl font-semibold text-[#b83240] sm:text-2xl"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                a note left on the last page
              </motion.p>

              <motion.blockquote
                className="mx-auto mt-6 max-w-2xl"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28, duration: 0.65, ease: easeOut }}
              >
                <p className="font-display text-3xl leading-[1.25] tracking-tight text-[#3a1f2e] sm:text-4xl md:text-[2.75rem]">
                  “Some places hold us longer than we stay —
                  <br className="hidden sm:block" />
                  in the rain on a shared umbrella, in a late bus home,
                  <br className="hidden sm:block" />
                  in a laugh we thought the city had forgotten.”
                </p>
              </motion.blockquote>

              <motion.p
                className="font-hand mx-auto mt-8 max-w-xl text-2xl leading-snug font-semibold text-[#6a2e4a] sm:text-3xl"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
              >
                ADda is where those quiet moments finally have an address —
                so the people we love, and the strangers who stood beside us,
                can be found again.
              </motion.p>

              <motion.p
                className="mt-6 text-sm leading-relaxed text-[#5c3a2e] sm:text-base"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 }}
              >
                Come leave a memory. Come find one that feels like yours.
                Across Kolkata, Bengaluru, Chandigarh, and every street still
                waiting to be written.
              </motion.p>

              <div className="mt-10 flex flex-col items-center gap-4">
                <motion.div
                  animate={
                    reduce ? undefined : { y: [0, -10, 0], rotate: [-2, 3, -2] }
                  }
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="rounded-sm bg-[#fff3c4] p-2 shadow-md ring-2 ring-ink/15">
                    <CoffeeDada className="h-20 w-20" />
                  </div>
                </motion.div>

                <TornScrap className="bg-[#c8e4ff] px-4 py-1.5">
                  <p className="font-hand text-base font-semibold text-[#14383a]">
                    your story belongs on a map ♡
                  </p>
                </TornScrap>

                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/map"
                    className="ms-btn inline-flex items-center justify-center bg-[#e87860] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#1a1612] shadow-[0_14px_36px_-12px_rgba(232,120,96,0.75)]"
                  >
                    Begin with a street →
                  </Link>
                </motion.div>
                <p className="font-hand text-lg text-[#5c3a2e]/80">
                  no account. no wallet. just memory.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
