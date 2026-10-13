"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { StoryImage } from "@/lib/storyImages";
import { easeOut } from "@/components/motion/primitives";

type Props = {
  images: StoryImage[];
  placeName: string;
};

export function StoryGallery({ images, placeName }: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current || images.length === 0) return null;

  return (
    <div className="mt-6">
      <motion.div
        className="relative bg-[#fff3c4] p-3 pb-10 shadow-[0_22px_50px_-24px_rgba(26,22,18,0.5)] ring-2 ring-ink/15"
        initial={reduce ? false : { opacity: 0, y: 16, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -0.8 }}
        transition={{ duration: 0.55, ease: easeOut }}
      >
        <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-5 w-20 -translate-x-1/2 rotate-[-2deg]" />
        <span className="ms-washi ms-washi--sun absolute top-10 -left-2 h-3 w-12 -rotate-90" />
        <span className="ms-washi ms-washi--teal absolute top-14 -right-2 h-3 w-12 rotate-90" />

        <div className="relative overflow-hidden bg-[#ddd0bb]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.url}
              initial={reduce ? false : { opacity: 0.35, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={current.alt || `Photo related to ${placeName}`}
                className="aspect-[16/10] w-full object-cover"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-4 pb-3 pt-12">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-paper/90 uppercase">
              {active + 1} / {images.length} · {placeName}
            </p>
            <p className="mt-0.5 text-[10px] text-paper/60">
              Photo: {current.credit}
            </p>
          </div>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setActive((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff3c4] text-ink shadow-sm ring-1 ring-ink/20 hover:bg-[#ffe49a]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setActive((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff3c4] text-ink shadow-sm ring-1 ring-ink/20 hover:bg-[#ffe49a]"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
        <p className="font-hand absolute inset-x-3 bottom-2 text-center text-base font-semibold text-[#5c2430]">
          kept from {placeName}
        </p>
      </motion.div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image, index) => {
          const selected = index === active;
          const tilt = index % 2 === 0 ? -2 : 2;
          return (
            <motion.button
              key={image.url + index}
              type="button"
              onClick={() => setActive(index)}
              whileHover={reduce ? undefined : { y: -4, rotate: 0, scale: 1.03 }}
              className={`relative bg-[#f7f0e6] p-1.5 pb-5 shadow-md ring-1 transition ${
                selected
                  ? "ring-2 ring-[#e87860] rotate-0"
                  : "ring-ink/15 opacity-90"
              }`}
              style={{ transform: selected ? undefined : `rotate(${tilt}deg)` }}
            >
              <span
                className={`ms-washi absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 ${
                  ["ms-washi--coral", "ms-washi--sun", "ms-washi--teal"][
                    index % 3
                  ]
                }`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${image.url.replace("w=1400", "w=480")}`}
                alt={image.alt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <span className="font-hand absolute inset-x-1 bottom-0.5 text-center text-[11px] font-semibold text-[#5c2430]">
                {index + 1}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
