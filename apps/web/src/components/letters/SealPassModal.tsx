"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PaperClip } from "@/components/demo/ScrapbookBits";
import { easeOut } from "@/components/motion/primitives";

type Props = {
  open: boolean;
  onClose: () => void;
  memoryId: string;
  placeName: string;
};

type SealResult = {
  url: string;
  fromLabel: string;
  placeName: string;
};

export function SealPassModal({ open, onClose, memoryId, placeName }: Props) {
  const reduce = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SealResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setResult(null);
    setCopied(false);
    setBusy(true);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/letters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memoryId }),
        });
        if (!res.ok) throw new Error("seal failed");
        const data = (await res.json()) as SealResult & { token: string };
        if (!cancelled) {
          setResult({
            url: data.url,
            fromLabel: data.fromLabel,
            placeName: data.placeName,
          });
        }
      } catch {
        if (!cancelled) setError("Could not seal this scrap. Try again.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, memoryId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function copyLink() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[#1a1612]/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="seal-pass-title"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 40, scale: 0.94, rotate: -1.5 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="ms-scrap-page ms-scrap-page--butter relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
              <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-4 w-24 -translate-x-1/2" />
              <PaperClip className="absolute -top-3 right-8 h-12 w-7 rotate-[12deg]" />

              <p className="font-hand text-lg font-semibold text-[#b83240]">
                inheritance · not a share sheet
              </p>
              <h2
                id="seal-pass-title"
                className="mt-1 font-display text-3xl tracking-tight text-[#1a1612]"
              >
                Seal &amp; pass
              </h2>
              <p className="font-hand mt-2 text-lg leading-snug text-[#5c3a2e]">
                They get blank paper with a wax seal. The scrap from{" "}
                <span className="font-semibold text-[#5c2430]">{placeName}</span>{" "}
                stays hidden until they break it.
              </p>

              <div className="ms-envelope-mini relative mx-auto mt-6 h-36 w-[90%] max-w-sm">
                <div className="ms-envelope-body absolute inset-0" />
                <motion.div
                  className="ms-envelope-flap absolute inset-x-0 top-0"
                  initial={reduce ? false : { rotateX: 0 }}
                  animate={{ rotateX: busy ? 0 : 28 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: easeOut }}
                  style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                />
                <motion.div
                  className="ms-wax-seal absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={
                    busy
                      ? { scale: 0.6, opacity: 0.4 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ delay: 0.45, type: "spring", stiffness: 220, damping: 14 }}
                >
                  <span className="font-hand text-lg font-bold text-[#ffe9c8]">♡</span>
                </motion.div>
              </div>

              {error ? (
                <div className="mt-5 space-y-3 text-center">
                  <p className="text-sm text-[#8b3a2f]">{error}</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-hand text-base font-semibold text-[#5c2430] underline decoration-wavy underline-offset-4"
                  >
                    close
                  </button>
                </div>
              ) : result ? (
                <div className="mt-5 space-y-3">
                  <p className="font-hand text-base text-[#3a1f2e]">
                    Sealed for whoever you send it to — from{" "}
                    <span className="font-semibold">{result.fromLabel}</span>.
                  </p>
                  <div className="rounded-sm bg-[#fff3c4]/80 px-3 py-2 ring-1 ring-ink/10">
                    <p className="break-all font-mono text-[11px] leading-relaxed text-[#5c3a2e]">
                      {result.url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      type="button"
                      whileHover={reduce ? undefined : { y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => void copyLink()}
                      className="ms-btn inline-flex h-10 flex-1 items-center justify-center bg-[#5c2430] px-4 text-sm font-semibold text-[#ffe9c8]"
                    >
                      {copied ? "Copied — go pass it" : "Copy sealed link"}
                    </motion.button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="font-hand h-10 px-3 text-base font-semibold text-[#5c2430] underline decoration-wavy underline-offset-4"
                    >
                      done
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-hand mt-5 text-center text-lg text-[#5c3a2e]">
                  {busy ? "Warming the wax…" : "Preparing the envelope…"}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
