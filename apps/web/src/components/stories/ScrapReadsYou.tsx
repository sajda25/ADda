"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";

type Footnote = {
  id: string;
  question: string;
  answer: string;
  signedAs: string;
  createdAt: string;
};

type Props = {
  memoryId: string;
};

export function ScrapReadsYou({ memoryId }: Props) {
  const reduce = useReducedMotion();
  const [question, setQuestion] = useState<string | null>(null);
  const [footnotes, setFootnotes] = useState<Footnote[]>([]);
  const [answer, setAnswer] = useState("");
  const [signedAs, setSignedAs] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/memories/${memoryId}/footnotes`);
        if (!res.ok) throw new Error("load");
        const data = (await res.json()) as {
          question: string;
          footnotes: Footnote[];
        };
        if (!cancelled) {
          setQuestion(data.question);
          setFootnotes(data.footnotes);
        }
      } catch {
        if (!cancelled) setError("This scrap went quiet — try refreshing.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [memoryId]);

  async function submit() {
    if (busy || answer.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/memories/${memoryId}/footnotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answer.trim(),
          signedAs: signedAs.trim() || "a stranger",
        }),
      });
      if (!res.ok) throw new Error("save");
      const data = (await res.json()) as { footnote: Footnote };
      setFootnotes((prev) => [data.footnote, ...prev]);
      setDoneId(data.footnote.id);
      setAnswer("");
      setRevealed(true);
    } catch {
      setError("Could not stick your footnote. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!question && !error) {
    return (
      <p className="font-hand mt-10 text-lg text-[#5c3a2e]">
        The scrap is clearing its throat…
      </p>
    );
  }

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="ms-reads-you relative mt-12 overflow-hidden"
      aria-label="The scrap reads you back"
    >
      <div className="ms-scrap-page ms-scrap-page--lavender relative px-5 py-6 sm:px-7 sm:py-8">
        <span className="ms-washi ms-washi--berry absolute -top-2 left-1/2 h-4 w-24 -translate-x-1/2" />
        <span className="ms-washi ms-washi--sun absolute top-10 -right-1 h-3 w-12 rotate-90" />

        <p className="font-hand text-base font-semibold text-[#7a3a8a]">
          the scrap reads you back
        </p>
        <h2 className="mt-1 font-display text-2xl tracking-tight text-[#1a1612] sm:text-3xl">
          Not a like. A question only this page would ask.
        </h2>

        {error && !question ? (
          <p className="mt-4 text-sm text-[#8b3a2f]">{error}</p>
        ) : (
          <blockquote className="mt-5 border-l-2 border-[#9a4e8a]/40 pl-4">
            <p className="font-hand text-xl leading-snug font-semibold text-[#3a1f2e] sm:text-2xl">
              {question}
            </p>
          </blockquote>
        )}

        {doneId ? (
          <motion.p
            className="font-hand mt-5 text-lg font-semibold text-[#5c2430]"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Stuck to the page. Other readers will find your footnote under the
            scrap.
          </motion.p>
        ) : (
          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="font-hand text-sm font-semibold text-[#5c2430]">
                your answer — becomes a footnote
              </span>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                maxLength={480}
                placeholder="Write like nobody is grading you…"
                className="mt-1.5 w-full resize-y rounded-sm border border-ink/15 bg-[#fffdf8] px-3 py-2.5 font-hand text-lg leading-snug text-[#1a1612] placeholder:text-[#5c3a2e]/45 focus:border-[#9a4e8a] focus:outline-none focus:ring-2 focus:ring-[#9a4e8a]/25"
              />
            </label>
            <label className="block max-w-xs">
              <span className="font-hand text-sm font-semibold text-[#5c2430]">
                sign as (optional)
              </span>
              <input
                value={signedAs}
                onChange={(e) => setSignedAs(e.target.value)}
                maxLength={40}
                placeholder="a stranger"
                className="mt-1.5 w-full rounded-sm border border-ink/15 bg-[#fffdf8] px-3 py-2 text-sm text-[#1a1612] placeholder:text-[#5c3a2e]/45 focus:border-[#9a4e8a] focus:outline-none focus:ring-2 focus:ring-[#9a4e8a]/25"
              />
            </label>
            {error ? (
              <p className="text-sm text-[#8b3a2f]">{error}</p>
            ) : null}
            <motion.button
              type="button"
              disabled={busy || answer.trim().length < 2}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void submit()}
              className="ms-btn inline-flex h-10 items-center bg-[#5c2430] px-5 text-sm font-semibold text-[#ffe9c8] disabled:opacity-40"
            >
              {busy ? "Sticking…" : "Stick footnote to the page →"}
            </motion.button>
          </div>
        )}
      </div>

      {footnotes.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <div>
              <p className="font-hand text-lg font-semibold text-[#b83240]">
                footnotes from other strangers
              </p>
              <p className="text-sm text-[#5c3a2e]">
                Same question. Different lives. Stuck under this scrap.
              </p>
            </div>
            {!revealed && footnotes.length > 2 ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="font-hand shrink-0 text-sm font-semibold text-[#5c2430] underline decoration-wavy underline-offset-4"
              >
                show all
              </button>
            ) : null}
          </div>
          <ul className="mt-4 space-y-3">
            {(revealed ? footnotes : footnotes.slice(0, 3)).map((f, i) => (
              <motion.li
                key={f.id}
                initial={reduce ? false : { opacity: 0, x: -10, rotate: -1 }}
                whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 1 : -0.8 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: easeOut }}
                className={`ms-scrap-page relative px-4 py-3 ${
                  [
                    "ms-scrap-page--butter",
                    "ms-scrap-page--mint",
                    "ms-scrap-page--sky",
                    "ms-scrap-page--peach",
                  ][i % 4]
                } ${f.id === doneId ? "ring-2 ring-[#e87860]/50" : ""}`}
              >
                <span
                  className={`ms-washi absolute -top-1.5 left-4 h-3 w-10 ${
                    ["ms-washi--coral", "ms-washi--teal", "ms-washi--sun"][i % 3]
                  }`}
                />
                <p className="font-hand text-base leading-snug text-[#3a1f2e]">
                  {f.answer}
                </p>
                <p className="mt-2 text-[11px] text-[#5c3a2e]/80">
                  — {f.signedAs}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="font-hand mt-5 text-center text-base text-[#5c3a2e]/80">
          No footnotes yet — you could be the first voice under this scrap.
        </p>
      )}
    </motion.section>
  );
}
