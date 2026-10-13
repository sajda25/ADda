"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  href?: string;
  overlay?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "text-2xl sm:text-3xl",
  md: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
} as const;

export function AddaLogo({
  href = "/",
  overlay = false,
  className = "",
  size = "md",
}: Props) {
  const reduce = useReducedMotion();
  const ink = overlay ? "#fff6e8" : "#5c2430";
  const accent = overlay ? "#ffb0c8" : "#c45c48";

  return (
    <Link
      href={href}
      aria-label="ADda home"
      className={`group relative inline-flex items-end gap-0.5 leading-none ${className}`}
    >
      <span className="sr-only">ADda</span>
      <motion.span
        className={`font-display font-semibold tracking-tight ${sizeClass[size]}`}
        style={{ color: ink }}
        initial={reduce ? false : { opacity: 0, y: 10, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        whileHover={
          reduce
            ? undefined
            : {
                rotate: [-3, 4, -2, 0],
                y: [0, -3, 0],
                transition: { duration: 0.55 },
              }
        }
      >
        AD
      </motion.span>
      <motion.span
        className={`font-hand font-bold tracking-tight ${sizeClass[size]}`}
        style={{ color: accent }}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.7, rotate: 12 }}
        animate={
          reduce
            ? { opacity: 1, y: 0, scale: 1, rotate: 4 }
            : {
                opacity: 1,
                y: [0, -3, 0],
                scale: 1,
                rotate: [4, 8, 3, 6, 4],
              }
        }
        transition={
          reduce
            ? { type: "spring", stiffness: 280, damping: 14, delay: 0.08 }
            : {
                opacity: { duration: 0.35, delay: 0.08 },
                scale: { type: "spring", stiffness: 280, damping: 14, delay: 0.08 },
                y: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                },
                rotate: {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                },
              }
        }
        whileHover={
          reduce
            ? undefined
            : {
                scale: 1.08,
                rotate: [4, -6, 8, 4],
                transition: { duration: 0.5 },
              }
        }
      >
        da
      </motion.span>

      {/* Scribble underline */}
      <motion.svg
        viewBox="0 0 88 12"
        className="pointer-events-none absolute -bottom-1 left-0 w-[110%] overflow-visible"
        aria-hidden="true"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
      >
        <motion.path
          d="M2 8 C18 2, 34 11, 48 6 S72 2, 86 7"
          fill="none"
          stroke={accent}
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            reduce
              ? { pathLength: 1 }
              : {
                  pathLength: 1,
                  d: [
                    "M2 8 C18 2, 34 11, 48 6 S72 2, 86 7",
                    "M2 7 C20 11, 36 3, 50 8 S74 10, 86 5",
                    "M2 8 C18 2, 34 11, 48 6 S72 2, 86 7",
                  ],
                }
          }
          transition={
            reduce
              ? { delay: 0.35, duration: 0.7 }
              : {
                  pathLength: { delay: 0.35, duration: 0.7 },
                  d: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                }
          }
        />
      </motion.svg>

      {/* Tiny spark */}
      <motion.span
        className="pointer-events-none absolute -right-3 -top-2 font-hand text-sm"
        style={{ color: accent }}
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.35, 1, 0.35],
                scale: [0.85, 1.25, 0.85],
                rotate: [0, 20, 0],
              }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>
    </Link>
  );
}
