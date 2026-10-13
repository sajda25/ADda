"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/components/motion/primitives";
import type { PresenceSummary } from "@/lib/presence";

type Note = {
  id: string;
  body: string;
  signedAs: string;
  createdAt: string;
};

type Props = {
  presenceId: string;
  onClose: () => void;
  onExpired?: () => void;
};

export function PresenceShoulder({ presenceId, onClose, onExpired }: Props) {
  const reduce = useReducedMotion();
  const [presence, setPresence] = useState<
    (PresenceSummary & { excerpt?: string; placeId?: string; expired?: boolean }) | null
  >(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [body, setBody] = useState("");
  const [signedAs, setSignedAs] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/presences/${presenceId}`);
        if (!res.ok) throw new Error("load");
        const data = (await res.json()) as {
          presence: PresenceSummary & {
            excerpt?: string;
            placeId?: string;
            expired?: boolean;
          };
          notes: Note[];
        };
        if (cancelled) return;
        setPresence(data.presence);
        setNotes(data.notes);
        if (data.presence.expired) onExpired?.();
      } catch {
        if (!cancelled) setError("This presence faded.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [presenceId, onExpired]);

  async function leaveNote() {
    if (busy || body.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/presences/${presenceId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          signedAs: signedAs.trim() || "a stranger",
        }),
      });
      const data = (await res.json()) as { error?: string; note?: Note };
      if (!res.ok || !data.note) {
        setError(data.error ?? "Could not leave a note.");
        return;
      }
      setNotes((n) => [data.note!, ...n]);
      setBody("");
    } catch {
      setError("Could not leave a note.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.aside
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="ms-presence-panel relative flex h-full max-h-[46vh] flex-col overflow-hidden rounded-t-2xl md:max-h-none md:rounded-xl"
    >
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-35" />
      <div className="relative flex items-start justify-between gap-2 border-b border-dashed border-ink/15 px-4 py-3">
        <div className="min-w-0">
          <p className="font-hand text-sm font-semibold text-[#b83240]">
            living presence · not a café
          </p>
          <h2 className="font-display text-2xl leading-tight text-[#1a1612]">
            {presence?.label ?? "…"}
          </h2>
          <p className="font-hand mt-1 text-base text-[#5c3a2e]">
            {presence
              ? `${presence.minutesLeft} min left as a place · from ${presence.placeName}`
              : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ms-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-[#fff3c4] text-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="relative min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {error ? <p className="text-sm text-[#8b3a2f]">{error}</p> : null}

        {presence ? (
          <div className="ms-scrap-page ms-scrap-page--peach px-3.5 py-3">
            <p className="font-hand text-xs font-semibold text-[#b83240]">
              the scrap they carried onto the map
            </p>
            <p className="mt-1 font-display text-lg text-[#1a1612]">
              {presence.memoryTitle}
            </p>
            {presence.excerpt ? (
              <p className="font-hand mt-1.5 line-clamp-3 text-base text-[#3a1f2e]">
                {presence.excerpt}
              </p>
            ) : null}
            <Link
              href={`/story/${presence.memoryId}`}
              className="font-hand mt-2 inline-block text-sm font-semibold text-[#b83240]"
            >
              open full scrap →
            </Link>
          </div>
        ) : null}

        <div className="ms-scrap-page ms-scrap-page--butter px-3.5 py-3">
          <p className="font-hand text-base font-semibold text-[#5c2430]">
            leave a note on their shoulder
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={280}
            disabled={presence?.expired}
            placeholder="I read your goodbye on the tram…"
            className="mt-2 w-full resize-y rounded-sm border border-ink/15 bg-[#fffdf8] px-2.5 py-2 font-hand text-base text-[#1a1612] placeholder:text-[#5c3a2e]/45 focus:border-[#e87860] focus:outline-none"
          />
          <input
            value={signedAs}
            onChange={(e) => setSignedAs(e.target.value)}
            maxLength={40}
            placeholder="sign as (optional)"
            className="mt-2 w-full rounded-sm border border-ink/15 bg-[#fffdf8] px-2.5 py-1.5 text-sm"
          />
          <motion.button
            type="button"
            disabled={busy || body.trim().length < 2 || !!presence?.expired}
            whileTap={{ scale: 0.98 }}
            onClick={() => void leaveNote()}
            className="ms-btn mt-2 inline-flex h-9 items-center bg-[#5c2430] px-4 text-xs font-semibold text-[#ffe9c8] disabled:opacity-40"
          >
            {busy ? "Leaving…" : "Pin to shoulder →"}
          </motion.button>
        </div>

        <div>
          <p className="font-hand text-base font-semibold text-[#b83240]">
            shoulder notes ({notes.length})
          </p>
          {notes.length === 0 ? (
            <p className="mt-2 text-sm text-[#5c3a2e]">
              No one has touched this shoulder yet.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {notes.map((n, i) => (
                <li
                  key={n.id}
                  className={`ms-scrap-page px-3 py-2 ${
                    ["ms-scrap-page--sky", "ms-scrap-page--mint", "ms-scrap-page--lavender"][
                      i % 3
                    ]
                  }`}
                >
                  <p className="font-hand text-base leading-snug text-[#3a1f2e]">
                    {n.body}
                  </p>
                  <p className="mt-1 text-[11px] text-[#5c3a2e]">— {n.signedAs}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
