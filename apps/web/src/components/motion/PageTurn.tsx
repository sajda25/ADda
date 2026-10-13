"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";

/** Scrapbook page-curl entrance for story pages */
export function PageTurn({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <div className="relative overflow-clip">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 origin-left bg-gradient-to-r from-[#5c2430]/20 to-transparent"
        initial={{ opacity: 0.5, scaleX: 1 }}
        animate={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.85, ease: easeOut }}
        style={{ transformOrigin: "left center" }}
      />
      <motion.div
        initial={{
          opacity: 0.4,
          x: -28,
          rotate: -1.5,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          x: 0,
          rotate: 0,
          scale: 1,
        }}
        transition={{ duration: 0.85, ease: easeOut }}
        style={{ transformOrigin: "left center" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
