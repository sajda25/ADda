"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bookworm,
  CoffeeDada,
  RainAuntie,
  TramKid,
} from "@/components/demo/DiaryCaricatures";
import { StickerHeart, StickerStar } from "@/components/demo/ScrapbookBits";
import {
  PlasticSticker,
  StickerCards,
  StickerChai,
  StickerCloudRain,
  StickerRadio,
  StickerRickshaw,
  StickerUmbrellaKid,
} from "@/components/stories/TopicStickers";

function Wiggle({
  children,
  delay = 0,
  className,
  reduce,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { scale: 0, rotate: -25, opacity: 0 }}
      animate={
        reduce
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              scale: [1, 1.06, 1],
              rotate: [-6, 6, -4, 5, -6],
              y: [0, -8, 0, 4, 0],
            }
      }
      transition={{
        opacity: { delay, duration: 0.4 },
        // tween (not spring): multi-keyframe arrays crash spring/inertia in Motion
        scale: {
          delay,
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: { delay: delay + 0.3, duration: 3.4, repeat: Infinity, ease: "easeInOut" },
        y: { delay: delay + 0.3, duration: 3.1, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Visible sticker rails + floating topic caricatures (not clipped off-screen) */
export function StoryScrapBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-clip" aria-hidden="true">
      <div className="absolute inset-0 ms-story-desk" />
      <div className="absolute inset-0 paper-grain opacity-55" />
      <div className="absolute inset-0 ms-cork-scatter" />
      <div className="absolute inset-0 ms-story-doodles opacity-90" />

      {!reduce
        ? Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${5 + ((i * 5.2) % 90)}%`,
                top: `${6 + ((i * 11) % 88)}%`,
                width: 8 + (i % 3) * 4,
                height: 8 + (i % 3) * 4,
                background: ["#ff8fb5", "#ffc53d", "#7ec8ff", "#b8e86a", "#e87860", "#d0b8f0"][
                  i % 6
                ],
                boxShadow: "0 2px 0 rgba(26,22,18,0.2)",
              }}
              animate={{
                y: [0, -18, 0],
                scale: [0.8, 1.25, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2.6 + (i % 4) * 0.4,
                delay: i * 0.07,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}
    </div>
  );
}

/** Sticker column that sits beside story content — always on screen */
export function StoryStickerRail({ side }: { side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const left = side === "left";

  const items = left
    ? [
        { node: <StickerUmbrellaKid className="h-28 w-24" />, color: "#c8e4ff", d: 0.1 },
        { node: <StickerChai className="h-24 w-20" />, color: "#ffe49a", d: 0.25 },
        { node: <CoffeeDada className="h-28 w-28" />, color: "#ffd0b0", d: 0.4 },
        { node: <StickerRadio className="h-24 w-28" />, color: "#fff3c4", d: 0.55 },
        { node: <StickerCloudRain className="h-20 w-24" />, color: "#b8f0e4", d: 0.7 },
      ]
    : [
        { node: <RainAuntie className="h-28 w-24" />, color: "#d0b8f0", d: 0.15 },
        { node: <StickerCards className="h-24 w-24" />, color: "#ffd0e8", d: 0.3 },
        { node: <TramKid className="h-24 w-28" />, color: "#ffe49a", d: 0.45 },
        { node: <StickerRickshaw className="h-24 w-28" />, color: "#c8e4ff", d: 0.6 },
        { node: <Bookworm className="h-24 w-24" />, color: "#b8e86a", d: 0.75 },
      ];

  return (
    <div
      className={`pointer-events-none absolute top-20 bottom-8 z-[5] hidden w-[6.5rem] flex-col items-center justify-around gap-3 overflow-clip lg:flex xl:w-[7.5rem] ${
        left ? "left-2 xl:left-4 2xl:left-10" : "right-2 xl:right-4 2xl:right-10"
      }`}
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <Wiggle key={i} delay={item.d} reduce={reduce} className="w-[7.2rem]">
          <PlasticSticker color={item.color}>{item.node}</PlasticSticker>
        </Wiggle>
      ))}
      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.2, 1], rotate: [-10, 10, -10] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {left ? (
          <StickerStar className="h-12 w-12 drop-shadow-lg" />
        ) : (
          <StickerHeart className="h-12 w-12 drop-shadow-lg" />
        )}
      </motion.div>
    </div>
  );
}

/** Inline sticker strip for mobile / tablet (between sections) */
export function StoryStickerStrip() {
  const reduce = useReducedMotion();
  const stickers = [
    { node: <StickerUmbrellaKid className="h-16 w-14" />, color: "#c8e4ff" },
    { node: <StickerChai className="h-16 w-14" />, color: "#ffe49a" },
    { node: <StickerRadio className="h-14 w-16" />, color: "#fff3c4" },
    { node: <StickerCards className="h-14 w-14" />, color: "#ffd0e8" },
    { node: <StickerRickshaw className="h-14 w-16" />, color: "#b8f0e4" },
    { node: <StickerCloudRain className="h-14 w-16" />, color: "#c8e4ff" },
  ];

  return (
    <div
      className="relative z-10 mt-6 flex gap-3 overflow-x-auto pb-2 lg:hidden"
      aria-hidden="true"
    >
      {stickers.map((s, i) => (
        <motion.div
          key={i}
          className="w-20 shrink-0"
          initial={reduce ? false : { y: 20, opacity: 0, rotate: -10 }}
          animate={
            reduce
              ? { opacity: 1 }
              : { y: [0, -8, 0], opacity: 1, rotate: [-4, 4, -4] }
          }
          transition={{
            delay: 0.1 + i * 0.08,
            duration: 2.8 + i * 0.15,
            rotate: { repeat: Infinity, ease: "easeInOut", duration: 3 + i * 0.2 },
            y: { repeat: Infinity, ease: "easeInOut", duration: 2.6 + i * 0.2 },
          }}
        >
          <PlasticSticker color={s.color}>{s.node}</PlasticSticker>
        </motion.div>
      ))}
    </div>
  );
}
