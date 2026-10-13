"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Soft monsoon curtain over the map */
export function RainOverlay({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#1a3048]/18 mix-blend-multiply" />
      <div className="absolute inset-0 ms-rain-sheet opacity-70" />
      {!reduce
        ? Array.from({ length: 36 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-px rounded-full bg-[#c8e4ff]/70"
              style={{
                left: `${(i * 2.9) % 100}%`,
                height: `${12 + (i % 5) * 8}px`,
                top: "-10%",
              }}
              animate={{ y: ["0vh", "120vh"], opacity: [0, 0.85, 0] }}
              transition={{
                duration: 0.7 + (i % 5) * 0.18,
                repeat: Infinity,
                delay: (i % 12) * 0.08,
                ease: "linear",
              }}
            />
          ))
        : null}
      <p className="font-hand absolute bottom-16 left-1/2 z-20 -translate-x-1/2 rounded-sm bg-[#fff3c4]/90 px-3 py-1 text-sm font-semibold text-[#5c2430] shadow-md ring-1 ring-ink/10 md:bottom-20">
        monsoon mode · rainy memories rise
      </p>
    </div>
  );
}
