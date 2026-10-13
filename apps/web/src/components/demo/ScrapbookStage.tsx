"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import {
  CoffeeRing,
  PostageStamp,
  StickerHeart,
  StickerStar,
  TicketStub,
  TornScrap,
} from "@/components/demo/ScrapbookBits";
import { Bookworm, CoffeeDada, TramKid } from "@/components/demo/DiaryCaricatures";

function Bob({
  children,
  duration = 5,
  delay = 0,
  reduce,
}: {
  children: ReactNode;
  duration?: number;
  delay?: number;
  reduce: boolean | null;
}) {
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -12, 0, 7, 0], rotate: [-3, 4, -2, 3, -3] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

type Props = {
  scrapOpacity: MotionValue<number>;
};

export function ScrapbookStage({ scrapOpacity }: Props) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" aria-hidden="true">
      {!reduce
        ? Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={`dot-${i}`}
              className="absolute h-2.5 w-2.5 rounded-full shadow-sm"
              style={{
                left: `${5 + ((i * 6.3) % 90)}%`,
                top: `${8 + ((i * 9.7) % 78)}%`,
                background: ["#ff8fb5", "#ffc53d", "#7ec8ff", "#b8e86a", "#e87860", "#d0b8f0"][
                  i % 6
                ],
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.25, 0.95, 0.25],
                scale: [0.6, 1.25, 0.6],
                y: [0, -20 - (i % 4) * 5, 0],
                x: [0, (i % 2 === 0 ? 8 : -8), 0],
              }}
              transition={{
                duration: 3.2 + (i % 5) * 0.4,
                delay: 0.3 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        : null}

      <motion.div
        className="absolute top-[15%] left-[2%] hidden w-[7.5rem] lg:block"
        style={{ opacity: scrapOpacity }}
        initial={reduce ? false : { x: -90, opacity: 0, rotate: -28 }}
        animate={{ x: 0, opacity: 1, rotate: -12 }}
        transition={{ delay: 0.65, type: "spring", stiffness: 130, damping: 14 }}
      >
        <Bob duration={5.5} delay={0.2} reduce={reduce}>
          <TicketStub label="Kolkata" code="CCU-03" />
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[56%] left-[2.5%] hidden w-[7rem] md:block"
        style={{ opacity: scrapOpacity }}
        initial={reduce ? false : { x: -70, opacity: 0, rotate: 20 }}
        animate={{ x: 0, opacity: 1, rotate: 10 }}
        transition={{ delay: 1.0, type: "spring", stiffness: 120 }}
      >
        <Bob duration={6} delay={0.5} reduce={reduce}>
          <TicketStub label="Bengaluru" code="BLR-11" />
        </Bob>
      </motion.div>

      <motion.div
        className="absolute right-[3.5%] bottom-[13%] hidden lg:block"
        style={{ opacity: scrapOpacity }}
        initial={reduce ? false : { scale: 0, rotate: -35 }}
        animate={{ scale: 1, rotate: 9 }}
        transition={{ delay: 0.95, type: "spring", stiffness: 260, damping: 12 }}
      >
        <Bob duration={4.8} delay={0.3} reduce={reduce}>
          <PostageStamp city="IXC" />
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[26%] right-[2.5%] hidden scale-90 sm:block"
        initial={reduce ? false : { scale: 0, rotate: 45 }}
        animate={{ scale: 0.9, rotate: -14 }}
        transition={{ delay: 1.15, type: "spring", stiffness: 280 }}
      >
        <Bob duration={5.2} delay={0.7} reduce={reduce}>
          <PostageStamp city="BOM" />
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[18%] right-[13%] hidden lg:block"
        initial={reduce ? false : { scale: 0, rotate: -50 }}
        animate={
          reduce
            ? { scale: 1, rotate: 14 }
            : { scale: [1, 1.14, 1], rotate: [14, 22, 14], y: [0, -12, 0] }
        }
        transition={{
          delay: 1.1,
          duration: 3.6,
          repeat: reduce ? 0 : Infinity,
          ease: "easeInOut",
          type: reduce ? "spring" : undefined,
        }}
      >
        <StickerStar className="h-14 w-14 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute bottom-[18%] left-[8%] hidden md:block"
        initial={reduce ? false : { scale: 0 }}
        animate={
          reduce
            ? { scale: 1 }
            : { scale: [1, 1.18, 1], rotate: [-14, -2, -14], y: [0, -14, 0] }
        }
        transition={{
          delay: 1.3,
          duration: 4,
          repeat: reduce ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <StickerHeart className="h-12 w-12 drop-shadow-lg" />
      </motion.div>

      {!reduce ? (
        <motion.div
          className="absolute top-[40%] left-[1%] hidden xl:block"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <StickerStar className="h-9 w-9 opacity-85" />
        </motion.div>
      ) : null}

      <motion.div
        className="absolute top-[11%] left-[17%] hidden w-28 xl:block"
        initial={reduce ? false : { y: -50, opacity: 0, rotate: -16 }}
        animate={
          reduce
            ? { opacity: 0.95, rotate: -8 }
            : { y: [0, -14, 0], opacity: 0.95, rotate: [-8, 0, -8] }
        }
        transition={{
          delay: 0.85,
          duration: 4.5,
          repeat: reduce ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <TornScrap className="bg-[#ffd0e8] p-3">
          <p className="font-hand text-sm font-semibold text-[#5c2430]">Chandigarh ♡</p>
        </TornScrap>
      </motion.div>

      <motion.div
        className="absolute right-[15%] bottom-[9%] hidden w-32 xl:block"
        initial={reduce ? false : { y: 50, opacity: 0, rotate: 10 }}
        animate={
          reduce
            ? { opacity: 0.95, rotate: 7 }
            : { y: [0, -12, 0], opacity: 0.95, rotate: [7, 14, 7] }
        }
        transition={{
          delay: 1.15,
          duration: 5,
          repeat: reduce ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <TornScrap className="bg-[#c8e4ff] p-3">
          <p className="font-hand text-sm font-semibold text-[#14383a]">Indiranagar dusk</p>
        </TornScrap>
      </motion.div>

      <motion.div
        className="absolute top-[70%] right-[20%] hidden w-24 md:block"
        initial={reduce ? false : { scale: 0, rotate: 20 }}
        animate={{ scale: 1, rotate: -6 }}
        transition={{ delay: 1.35, type: "spring", stiffness: 200 }}
      >
        <Bob duration={4.6} delay={0.2} reduce={reduce}>
          <TornScrap className="bg-[#b8e86a] p-2 text-center">
            <p className="font-hand text-xs font-semibold text-[#1f2e0a]">Mumbai next!</p>
          </TornScrap>
        </Bob>
      </motion.div>

      <motion.div
        className="absolute right-[2%] bottom-[30%] hidden w-20 lg:block"
        initial={reduce ? false : { scale: 0, rotate: 28 }}
        animate={{ scale: 1, rotate: 8 }}
        transition={{ delay: 1.35, type: "spring", stiffness: 210 }}
      >
        <Bob duration={4.4} delay={0.4} reduce={reduce}>
          <div className="rounded-sm bg-[#ffe49a] p-1 shadow-lg ring-2 ring-ink/20">
            <CoffeeDada className="h-16 w-16" />
          </div>
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[46%] right-[7%] hidden w-20 md:block"
        initial={reduce ? false : { scale: 0, rotate: -24 }}
        animate={{ scale: 1, rotate: -6 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 210 }}
      >
        <Bob duration={5.1} delay={0.6} reduce={reduce}>
          <div className="rounded-sm bg-[#ffd0e8] p-1 shadow-lg ring-2 ring-ink/20">
            <TramKid className="h-14 w-16" />
          </div>
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[62%] left-[11%] hidden w-16 xl:block"
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: "spring" }}
      >
        <Bob duration={4.9} delay={0.3} reduce={reduce}>
          <div className="rounded-sm bg-[#b8f0e4] p-1 shadow-md ring-2 ring-ink/15">
            <Bookworm className="h-12 w-12" />
          </div>
        </Bob>
      </motion.div>

      <motion.div
        className="absolute top-[7%] left-[38%] hidden opacity-70 md:block"
        animate={
          reduce ? undefined : { rotate: [0, 10, 0], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <CoffeeRing className="h-28 w-28" />
      </motion.div>
    </div>
  );
}
