"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DEMO_CITIES,
  LAYER_LABELS,
  TEMPORAL_LAYERS,
  type TemporalLayer,
} from "@adda/shared";
import { easeOut } from "@/components/motion/primitives";
import {
  Bookworm,
  CoffeeDada,
  RainAuntie,
} from "@/components/demo/DiaryCaricatures";
import {
  PaperClip,
  PostageStamp,
  StickerHeart,
  StickerStar,
  TicketStub,
} from "@/components/demo/ScrapbookBits";
import {
  PlasticSticker,
  StickerChai,
  StickerCloudRain,
} from "@/components/stories/TopicStickers";

export type PublishPlaceOption = {
  id: string;
  name: string;
  neighborhoodId: string;
  city?: string;
};

type Props = {
  placeId: string;
  placeName: string;
  places?: PublishPlaceOption[];
  open: boolean;
  onClose: () => void;
  onPlaceChange?: (placeId: string) => void;
  onPlaceCreated?: (place: PublishPlaceOption) => void;
  onPublished: (memoryId: string) => void;
};

const NEW_PLACE = "__new__";

const fieldClass =
  "mt-1.5 h-10 w-full rounded-sm border border-ink/15 bg-[#fffdf8] px-3 text-sm text-[#1a1612] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-[#e87860] focus:ring-2 focus:ring-[#e87860]/25";

const labelClass = "font-hand block text-base font-semibold text-[#5c2430]";

export function PublishMemoryModal({
  placeId,
  placeName,
  places = [],
  open,
  onClose,
  onPlaceChange,
  onPlaceCreated,
  onPublished,
}: Props) {
  const reduce = useReducedMotion();
  const initialCity =
    places.find((p) => p.id === placeId)?.neighborhoodId ?? DEMO_CITIES[0].id;

  const [cityId, setCityId] = useState(initialCity);
  const [selectedPlaceId, setSelectedPlaceId] = useState(placeId);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceNote, setNewPlaceNote] = useState("");
  const [creatingPlace, setCreatingPlace] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [layer, setLayer] = useState<TemporalLayer>("NOW");
  const [tags, setTags] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [cloaked, setCloaked] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const match = places.find((p) => p.id === placeId);
    setCityId(match?.neighborhoodId ?? DEMO_CITIES[0].id);
    setSelectedPlaceId(placeId);
    setNewPlaceName("");
    setNewPlaceNote("");
    setError(null);
    setSuccess(null);
    setPreview(false);
  }, [open, placeId, places]);

  const cityPlaces = useMemo(
    () => places.filter((p) => p.neighborhoodId === cityId),
    [places, cityId],
  );

  const addingNew = selectedPlaceId === NEW_PLACE;
  const activePlaceName = addingNew
    ? newPlaceName.trim() || "New place"
    : cityPlaces.find((p) => p.id === selectedPlaceId)?.name ?? placeName;
  const activeCityName =
    DEMO_CITIES.find((c) => c.id === cityId)?.name ?? "City";
  const stampCity = activeCityName.slice(0, 3).toUpperCase();

  const reset = () => {
    setTitle("");
    setText("");
    setLayer("NOW");
    setTags("");
    setDisplayName("");
    setCloaked(false);
    setPrivacyAccepted(false);
    setPreview(false);
    setError(null);
    setSuccess(null);
    setNewPlaceName("");
    setNewPlaceNote("");
  };

  const ensurePlaceId = async (): Promise<string | null> => {
    if (!addingNew) return selectedPlaceId;
    const name = newPlaceName.trim();
    if (name.length < 2) {
      setError("Enter a place name (street, café, campus gate…).");
      return null;
    }
    setCreatingPlace(true);
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          neighborhoodId: cityId,
          name,
          description:
            newPlaceNote.trim() ||
            `A neighbor-added place in ${activeCityName}.`,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        place?: PublishPlaceOption & { city?: string };
        notice?: string;
      };
      if (!res.ok || !data.place) {
        if (res.status === 409 && data.place?.id) {
          setSelectedPlaceId(data.place.id);
          onPlaceChange?.(data.place.id);
          return data.place.id;
        }
        setError(data.error ?? "Could not add this place.");
        return null;
      }
      const created = {
        id: data.place.id,
        name: data.place.name,
        neighborhoodId: data.place.neighborhoodId,
        city: data.place.city,
      };
      onPlaceCreated?.(created);
      setSelectedPlaceId(created.id);
      onPlaceChange?.(created.id);
      return created.id;
    } catch {
      setError("Could not add this place.");
      return null;
    } finally {
      setCreatingPlace(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const placeToUse = await ensurePlaceId();
      if (!placeToUse) return;

      const res = await fetch("/api/memories/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: placeToUse,
          title,
          text,
          layer,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          displayName,
          cloaked,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        notice?: string;
        explorerUrl?: string | null;
        memory?: { id: string; onChain?: boolean; txHash?: string | null };
      };
      if (!res.ok) {
        setError(data.error ?? "Publication failed");
        return;
      }
      const chainBit = data.explorerUrl
        ? ` On-chain: ${data.explorerUrl}`
        : data.memory?.onChain
          ? " Registered on Monad Testnet."
          : "";
      setSuccess((data.notice ?? "Published.") + chainBit);
      if (data.memory?.id) onPublished(data.memory.id);
    } catch {
      setError("Publication failed before the server confirmed success.");
    } finally {
      setSubmitting(false);
    }
  };

  const canPreview =
    privacyAccepted &&
    !!title &&
    !!text &&
    !!displayName &&
    (!addingNew || newPlaceName.trim().length >= 2);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="publish-modal"
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[#3a1f2e]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              reset();
              onClose();
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-title"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 56, scale: 0.92, rotate: -2.5 }
            }
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.4 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 32, scale: 0.96, rotate: 1.5 }
            }
            transition={{ duration: 0.45, ease: easeOut }}
            className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-visible sm:max-h-[88vh]"
          >
            {/* Floating scrap decorations around the page */}
            <motion.div
              className="pointer-events-none absolute -left-3 top-16 z-20 hidden w-16 sm:block"
              animate={
                reduce ? undefined : { y: [0, -8, 0], rotate: [-8, -2, -8] }
              }
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlasticSticker color="#ffe49a">
                <StickerChai className="h-12 w-11" />
              </PlasticSticker>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute -right-2 top-28 z-20 hidden w-14 sm:block"
              animate={
                reduce ? undefined : { y: [0, -10, 0], rotate: [10, 18, 10] }
              }
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlasticSticker color="#c8e4ff">
                <StickerCloudRain className="h-12 w-14" />
              </PlasticSticker>
            </motion.div>
            <motion.div
              className="pointer-events-none absolute -left-4 bottom-24 z-20 hidden w-20 sm:block"
              animate={
                reduce ? undefined : { y: [0, -6, 0], rotate: [-6, 4, -6] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <CoffeeDada className="h-20 w-20 drop-shadow-md" />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute -right-3 bottom-16 z-20 hidden w-16 sm:block"
              animate={
                reduce ? undefined : { y: [0, -9, 0], rotate: [6, -4, 6] }
              }
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bookworm className="h-16 w-16 drop-shadow-md" />
            </motion.div>

            <div className="ms-scrap-page ms-scrap-page--butter relative max-h-[92dvh] overflow-y-auto sm:max-h-[88vh]">
              <span className="ms-washi ms-washi--coral pointer-events-none absolute -top-2 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rotate-[-2deg]" />
              <span className="ms-washi ms-washi--sun pointer-events-none absolute top-14 -left-2 z-20 h-3 w-14 -rotate-90" />
              <span className="ms-washi ms-washi--teal pointer-events-none absolute top-20 -right-2 z-20 h-3 w-12 rotate-90" />
              <span className="ms-washi ms-washi--berry pointer-events-none absolute bottom-10 left-6 z-10 h-3 w-16 rotate-[-4deg]" />

              <div className="pointer-events-none absolute inset-0 paper-grain opacity-40" />
              <div className="pointer-events-none absolute inset-0 ms-cork-scatter opacity-30" />

              <div className="relative z-10 px-5 pb-6 pt-7 sm:px-7 sm:pt-8">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <motion.p
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-hand text-lg font-semibold text-[#b83240]"
                    >
                      paste into the diary
                    </motion.p>
                    <motion.h2
                      id="publish-title"
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06, duration: 0.4, ease: easeOut }}
                      className="mt-0.5 font-display text-3xl leading-tight tracking-tight text-[#1a1612] sm:text-4xl"
                    >
                      Add a memory
                    </motion.h2>
                    <p className="font-hand mt-1 text-lg text-[#5c3a2e]">
                      {activeCityName}
                      {" · "}
                      <span className="font-semibold text-[#5c2430]">
                        {activePlaceName}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      className="font-hand ms-sticky ms-sticky--pink px-3 py-1 text-sm font-semibold"
                      onClick={() => {
                        reset();
                        onClose();
                      }}
                    >
                      tuck away ✕
                    </button>
                    <motion.div
                      animate={
                        reduce
                          ? undefined
                          : { rotate: [-4, 4, -4], y: [0, -3, 0] }
                      }
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <PostageStamp city={stampCity} className="h-16 w-14" />
                    </motion.div>
                  </div>
                </div>

                <div className="pointer-events-none absolute left-8 top-2">
                  <PaperClip className="h-12 w-7 rotate-[-12deg] drop-shadow-sm" />
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <TicketStub
                    label={activeCityName}
                    code="NEW+"
                    className="scale-90 origin-left"
                  />
                  <motion.div
                    className="hidden sm:block"
                    animate={
                      reduce ? undefined : { rotate: [8, 14, 8], y: [0, -4, 0] }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <RainAuntie className="h-14 w-12" />
                  </motion.div>
                  <StickerHeart className="ml-auto h-9 w-9 sm:hidden" />
                  <StickerStar className="hidden h-9 w-9 sm:ml-auto sm:block" />
                </div>

                <motion.div
                  key={preview ? "preview" : "form"}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className="mt-5 space-y-3.5"
                >
                  {!preview ? (
                    <>
                      <label className={labelClass}>
                        City / state
                        <select
                          value={cityId}
                          onChange={(e) => {
                            const nextCity = e.target.value;
                            setCityId(nextCity);
                            const first = places.find(
                              (p) => p.neighborhoodId === nextCity,
                            );
                            if (first) {
                              setSelectedPlaceId(first.id);
                              onPlaceChange?.(first.id);
                            } else {
                              setSelectedPlaceId(NEW_PLACE);
                            }
                          }}
                          className={fieldClass}
                        >
                          {DEMO_CITIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} — {c.state}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className={labelClass}>
                        Location
                        <select
                          value={selectedPlaceId}
                          onChange={(e) => {
                            const next = e.target.value;
                            setSelectedPlaceId(next);
                            if (next !== NEW_PLACE) onPlaceChange?.(next);
                          }}
                          className={fieldClass}
                        >
                          {cityPlaces.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                          <option value={NEW_PLACE}>+ Add a new place…</option>
                        </select>
                      </label>

                      <AnimatePresence>
                        {addingNew ? (
                          <motion.div
                            initial={
                              reduce
                                ? { opacity: 0 }
                                : { opacity: 0, height: 0, rotate: -1 }
                            }
                            animate={{ opacity: 1, height: "auto", rotate: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ms-scrap-page ms-scrap-page--mint overflow-hidden p-3"
                          >
                            <span className="ms-washi ms-washi--dots absolute -top-1 left-4 h-3 w-12" />
                            <p className="font-hand text-base font-semibold text-[#14383a]">
                              Place not listed? Stick a new scrap in{" "}
                              {activeCityName}.
                            </p>
                            <label className={`${labelClass} mt-2`}>
                              New place name
                              <input
                                value={newPlaceName}
                                onChange={(e) => setNewPlaceName(e.target.value)}
                                className={fieldClass}
                                placeholder="e.g. My college canteen steps"
                                maxLength={80}
                              />
                            </label>
                            <label className={`${labelClass} mt-2`}>
                              Short note (optional)
                              <input
                                value={newPlaceNote}
                                onChange={(e) => setNewPlaceNote(e.target.value)}
                                className={fieldClass}
                                placeholder="What makes this spot special?"
                                maxLength={400}
                              />
                            </label>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <label className={labelClass}>
                        Temporal layer
                        <select
                          value={layer}
                          onChange={(e) =>
                            setLayer(e.target.value as TemporalLayer)
                          }
                          className={fieldClass}
                        >
                          {TEMPORAL_LAYERS.map((l) => (
                            <option key={l} value={l}>
                              {LAYER_LABELS[l]}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className={labelClass}>
                        Title
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className={fieldClass}
                          maxLength={120}
                          placeholder="Give this scrap a headline…"
                        />
                      </label>

                      <label className={labelClass}>
                        Memory
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={6}
                          className={`${fieldClass} h-auto min-h-[9rem] py-2.5 leading-relaxed`}
                          placeholder="Write the moment — messy, spicy, memorable…"
                        />
                      </label>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className={labelClass}>
                          Tags
                          <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className={fieldClass}
                            placeholder="tea, rain, crush"
                          />
                        </label>
                        <label className={labelClass}>
                          Your name / pen name
                          <input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className={fieldClass}
                            maxLength={60}
                            placeholder="Aparna, or a neighbor…"
                          />
                        </label>
                      </div>

                      <label className="flex items-start gap-2 text-sm text-[#3a1f2e]">
                        <input
                          type="checkbox"
                          checked={cloaked}
                          onChange={(e) => setCloaked(e.target.checked)}
                          className="mt-1 accent-[#5c2430]"
                        />
                        <span className="font-hand text-base leading-snug">
                          Cloak my name (shows as “A neighbor”) — not full
                          anonymity.
                        </span>
                      </label>
                      <label className="flex items-start gap-2 text-sm text-[#3a1f2e]">
                        <input
                          type="checkbox"
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          className="mt-1 accent-[#5c2430]"
                        />
                        <span className="font-hand text-base leading-snug">
                          I won’t paste private addresses, exact home pins, or
                          sensitive details about others.
                        </span>
                      </label>
                    </>
                  ) : (
                    <div className="ms-diary-page ms-diary-page--peach relative px-5 py-6">
                      <span className="ms-washi ms-washi--coral absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2" />
                      <p className="font-hand text-lg font-semibold text-[#b83240]">
                        preview scrap
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-[#1a1612]">
                        {title}
                      </h3>
                      <p className="font-hand mt-2 text-base text-[#5c3a2e]">
                        {activeCityName} · {activePlaceName} ·{" "}
                        {LAYER_LABELS[layer]} ·{" "}
                        {cloaked ? "A neighbor" : displayName || "Anonymous"}
                      </p>
                      <p className="mt-4 whitespace-pre-wrap text-base leading-[1.85] text-[#3a1f2e]">
                        {text}
                      </p>
                      {tags ? (
                        <p className="font-hand mt-4 text-base text-[#b83240]">
                          #{tags.split(",").map((t) => t.trim()).filter(Boolean).join(" #")}
                        </p>
                      ) : null}
                    </div>
                  )}

                  {error ? (
                    <p className="font-hand text-lg font-semibold text-[#b83240]">
                      {error}
                    </p>
                  ) : null}
                  {success ? (
                    <p className="font-hand text-lg font-semibold text-[#1f5c5e]">
                      {success}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {!preview ? (
                      <motion.button
                        type="button"
                        disabled={!canPreview || creatingPlace}
                        whileHover={
                          reduce || !canPreview
                            ? undefined
                            : { y: -2, rotate: -0.5 }
                        }
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPreview(true)}
                        className="ms-btn inline-flex h-11 items-center bg-[#5c2430] px-5 text-sm font-semibold tracking-wide text-[#ffe9c8] shadow-[0_10px_24px_-12px_rgba(92,36,48,0.55)] disabled:opacity-40"
                      >
                        Preview scrap →
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          type="button"
                          whileHover={reduce ? undefined : { y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPreview(false)}
                          className="font-hand ms-sticky ms-sticky--sky px-4 py-2 text-base font-semibold"
                        >
                          ← Edit
                        </motion.button>
                        <motion.button
                          type="button"
                          disabled={submitting || creatingPlace}
                          whileHover={
                            reduce || submitting
                              ? undefined
                              : { y: -2, rotate: 0.5 }
                          }
                          whileTap={{ scale: 0.98 }}
                          onClick={() => void submit()}
                          className="ms-btn inline-flex h-11 items-center bg-[#1f5c5e] px-5 text-sm font-semibold tracking-wide text-[#e8fff8] disabled:opacity-40"
                        >
                          {submitting || creatingPlace
                            ? "Pasting…"
                            : "Paste into diary ♡"}
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
