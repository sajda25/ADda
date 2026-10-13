"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DEMO_CITIES,
  demoCityById,
  demoCityByName,
  type CitySummary,
  type DiscoveryMode,
  type MemorySummary,
  type PlaceSummary,
  type TemporalLayer,
} from "@adda/shared";
import { AddaLogo } from "@/components/layout/AddaLogo";
import { RainOverlay } from "@/components/map/RainOverlay";
import { MuralPanel } from "@/components/mural/MuralPanel";
import { easeOut } from "@/components/motion/primitives";
import { PublishMemoryModal } from "@/components/publish/PublishMemoryModal";
import { PresenceShoulder } from "@/components/map/PresenceShoulder";
import { PlaceStorybook } from "@/components/storybook/PlaceStorybook";
import type { PresenceSummary } from "@/lib/presence";
import { buildTramRoute } from "@/lib/tramRoute";

const RAIN_TAGS = ["rain", "monsoon", "flood", "umbrella"];

function rainBoost(memories: MemorySummary[]): MemorySummary[] {
  return [...memories].sort((a, b) => {
    const score = (m: MemorySummary) =>
      m.tags.some((t) => RAIN_TAGS.includes(t.toLowerCase())) ||
      /rain|monsoon|flood|umbrella/i.test(`${m.title} ${m.excerpt}`)
        ? 1
        : 0;
    return score(b) - score(a) || b.readCount - a.readCount;
  });
}

const StoryMap = dynamic(
  () => import("@/components/map/StoryMap").then((m) => m.StoryMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#d8cbb8] text-sm text-ink-muted">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AddaLogo size="sm" />
          <motion.p
            className="mt-2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Unfolding India…
          </motion.p>
        </motion.div>
      </div>
    ),
  },
);

function initialCityFromUrl(): string {
  if (typeof window === "undefined") return DEMO_CITIES[0].id;
  const param = new URLSearchParams(window.location.search).get("city");
  if (!param) return DEMO_CITIES[0].id;
  return demoCityByName(param)?.id ?? demoCityById(param)?.id ?? DEMO_CITIES[0].id;
}

function presenceIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("presence");
}

export function MapExperience() {
  const reduce = useReducedMotion();
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [cityId, setCityId] = useState<string>(DEMO_CITIES[0].id);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemorySummary[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [mode, setMode] = useState<DiscoveryMode>("MOST_READ");
  const [layer, setLayer] = useState<TemporalLayer | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [rainMode, setRainMode] = useState(false);
  const [tramRiding, setTramRiding] = useState(false);
  const [tramStops, setTramStops] = useState<PlaceSummary[]>([]);
  const [tramIndex, setTramIndex] = useState(0);
  const [tramLerp, setTramLerp] = useState(0);
  const [presences, setPresences] = useState<PresenceSummary[]>([]);
  const [selectedPresenceId, setSelectedPresenceId] = useState<string | null>(
    null,
  );
  const [presenceFlash, setPresenceFlash] = useState<string | null>(null);

  useEffect(() => {
    setCityId(initialCityFromUrl());
  }, []);

  const loadPlaces = useCallback(async (preferredPlaceId?: string | null) => {
    try {
      setLoadingPlaces(true);
      const res = await fetch("/api/places");
      if (!res.ok) throw new Error("Places request failed");
      const data = (await res.json()) as {
        places: PlaceSummary[];
        cities: CitySummary[];
      };
      setPlaces(data.places);
      setCities(data.cities ?? []);
      setLoadError(null);

      const preferred = preferredPlaceId
        ? data.places.find((p) => p.id === preferredPlaceId)
        : null;
      if (preferred) {
        setCityId(preferred.neighborhoodId);
        setSelectedPlaceId(preferred.id);
        return;
      }

      const activeCity = initialCityFromUrl();
      setCityId(activeCity);
      const inCity = data.places.filter((p) => p.neighborhoodId === activeCity);
      const richest = [...inCity].sort(
        (a, b) => b.memoryCount - a.memoryCount,
      )[0];
      if (richest) setSelectedPlaceId(richest.id);
    } catch {
      setLoadError(
        "Could not load demo cities. Run `pnpm seed` and refresh.",
      );
    } finally {
      setLoadingPlaces(false);
    }
  }, []);

  useEffect(() => {
    void loadPlaces();
  }, [loadPlaces]);

  const loadPresences = useCallback(async () => {
    try {
      const res = await fetch("/api/presences");
      if (!res.ok) return;
      const data = (await res.json()) as { presences: PresenceSummary[] };
      setPresences(data.presences);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadPresences();
    const t = window.setInterval(() => void loadPresences(), 20_000);
    return () => window.clearInterval(t);
  }, [loadPresences]);

  useEffect(() => {
    const fromUrl = presenceIdFromUrl();
    if (!fromUrl) return;
    setSelectedPlaceId(null);
    setSelectedPresenceId(fromUrl);
  }, []);

  const loadMemories = useCallback(async () => {
    if (!selectedPlaceId) {
      setMemories([]);
      return;
    }
    setMemoriesLoading(true);
    try {
      const params = new URLSearchParams({
        placeId: selectedPlaceId,
        mode,
      });
      if (mode === "EXPLORE_BY_TIME" && layer !== "ALL") {
        params.set("layer", layer);
      } else if (layer !== "ALL" && mode !== "SURPRISE_ME") {
        params.set("layer", layer);
      }
      const res = await fetch(`/api/memories?${params}`);
      if (!res.ok) throw new Error("memories failed");
      const data = (await res.json()) as { memories: MemorySummary[] };
      setMemories(
        rainMode ? rainBoost(data.memories) : data.memories,
      );
    } catch {
      setMemories([]);
    } finally {
      setMemoriesLoading(false);
    }
  }, [selectedPlaceId, mode, layer, rainMode]);

  useEffect(() => {
    void loadMemories();
  }, [loadMemories]);

  const activeCity =
    cities.find((c) => c.id === cityId) ??
    DEMO_CITIES.find((c) => c.id === cityId) ??
    DEMO_CITIES[0];

  const cityPlaces = useMemo(
    () => places.filter((p) => p.neighborhoodId === cityId),
    [places, cityId],
  );

  const filteredPlaces = useMemo(() => {
    const base = query.trim()
      ? cityPlaces.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()),
        )
      : cityPlaces;
    if (!rainMode) return base;
    return [...base].sort((a, b) => {
      const rainy = (p: PlaceSummary) =>
        /rain|monsoon|flood/i.test(
          `${p.teaserTitle ?? ""} ${p.teaserExcerpt ?? ""} ${p.description}`,
        )
          ? 1
          : 0;
      return rainy(b) - rainy(a) || b.memoryCount - a.memoryCount;
    });
  }, [cityPlaces, query, rainMode]);

  const selectedPlace =
    places.find((p) => p.id === selectedPlaceId) ?? null;

  const stopTramRide = useCallback(() => {
    setTramRiding(false);
    setTramStops([]);
    setTramIndex(0);
    setTramLerp(0);
  }, []);

  const startTramRide = useCallback(() => {
    const route = buildTramRoute(filteredPlaces, 7);
    if (route.length < 2) return;
    setTramStops(route);
    setTramIndex(0);
    setTramLerp(0);
    setSelectedPlaceId(route[0]!.id);
    setTramRiding(true);
  }, [filteredPlaces]);

  useEffect(() => {
    if (!tramRiding || tramStops.length < 2) return;
    let cancelled = false;
    const dwellMs = reduce ? 400 : 1500;
    const travelMs = reduce ? 500 : 2400;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const animateSegment = (fromIdx: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / travelMs);
          setTramIndex(fromIdx);
          setTramLerp(t);
          if (t < 1) {
            window.requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };
        window.requestAnimationFrame(tick);
      });

    (async () => {
      await wait(dwellMs);
      for (let i = 0; i < tramStops.length - 1; i++) {
        if (cancelled) return;
        await animateSegment(i);
        if (cancelled) return;
        const next = tramStops[i + 1]!;
        setTramIndex(i + 1);
        setTramLerp(0);
        setSelectedPlaceId(next.id);
        await wait(dwellMs);
      }
      if (!cancelled) {
        setTramRiding(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tramRiding, tramStops, reduce]);

  const switchCity = (nextId: string) => {
    stopTramRide();
    setCityId(nextId);
    setQuery("");
    const cityMeta = demoCityById(nextId);
    if (cityMeta && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("city", cityMeta.name);
      window.history.replaceState({}, "", url.toString());
    }
    const nextPlaces = places.filter((p) => p.neighborhoodId === nextId);
    const richest = [...nextPlaces].sort(
      (a, b) => b.memoryCount - a.memoryCount,
    )[0];
    setSelectedPlaceId(richest?.id ?? null);
  };

  const tramStopName = tramStops[tramIndex]?.name;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#d8cbb8]">
      {/* In-flow toolbar — never overlays map / scrapbook */}
      <motion.header
        initial={reduce ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="relative z-30 shrink-0 border-b border-ink/10 bg-[#f7ead4]/95 shadow-[0_10px_28px_-18px_rgba(26,22,18,0.45)] backdrop-blur-md"
      >
        <span className="ms-washi ms-washi--coral pointer-events-none absolute -bottom-1.5 left-8 h-3 w-16 rotate-[-2deg]" />
        <span className="ms-washi ms-washi--sun pointer-events-none absolute -bottom-1 right-16 hidden h-3 w-12 rotate-[3deg] sm:block" />
        <div className="pointer-events-none absolute inset-0 paper-grain opacity-30" />

        <div className="relative mx-auto flex max-w-[1600px] flex-col gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AddaLogo size="sm" className="shrink-0" />
            <span className="hidden h-4 w-px bg-ink/15 sm:block" />
            <p className="font-hand hidden min-w-0 truncate text-base font-semibold text-[#5c2430] md:block">
              {activeCity.name}
              <span className="mx-1.5 text-[#5c3a2e]/50">·</span>
              <span className="font-sans text-[11px] font-medium tracking-wide text-[#5c3a2e]">
                {activeCity.state}
              </span>
            </p>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  tramRiding ? stopTramRide() : startTramRide()
                }
                aria-pressed={tramRiding}
                disabled={!tramRiding && filteredPlaces.length < 2}
                className={`font-hand inline-flex h-8 items-center rounded-sm px-2.5 text-sm font-semibold transition sm:h-9 sm:px-3 ${
                  tramRiding
                    ? "bg-[#e87860] text-[#1a1612] shadow-sm ring-1 ring-[#ffc53d]/50"
                    : "bg-[#fffdf8]/80 text-[#5c3a2e] ring-1 ring-ink/10 hover:bg-[#ffe49a]/70 disabled:opacity-40"
                }`}
              >
                {tramRiding ? "Stop tram" : "Ride tram"}
              </button>
              <button
                type="button"
                onClick={() => setRainMode((v) => !v)}
                aria-pressed={rainMode}
                className={`font-hand inline-flex h-8 items-center rounded-sm px-2.5 text-sm font-semibold transition sm:h-9 sm:px-3 ${
                  rainMode
                    ? "bg-[#2a5a7a] text-[#e8f4ff] shadow-sm ring-1 ring-[#7ec8ff]/40"
                    : "bg-[#fffdf8]/80 text-[#5c3a2e] ring-1 ring-ink/10 hover:bg-[#c8e4ff]/50"
                }`}
              >
                {rainMode ? "Monsoon on" : "Monsoon"}
              </button>
              <label className="sr-only" htmlFor="place-search">
                Search places
              </label>
              <input
                id="place-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this city"
                className="h-8 w-28 rounded-sm border border-ink/15 bg-[#fffdf8] px-2.5 text-xs text-ink placeholder:text-ink-faint focus:border-[#e87860] focus:outline-none focus:ring-2 focus:ring-[#e87860]/20 sm:h-9 sm:w-44 sm:px-3"
              />
              <Link
                href="/demo"
                className="font-hand hidden h-9 items-center rounded-sm bg-[#fff3c4] px-3 text-sm font-semibold text-[#5c2430] ring-1 ring-ink/10 hover:bg-[#ffe49a] sm:inline-flex"
              >
                Demo
              </Link>
            </div>
          </div>

          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DEMO_CITIES.map((c) => {
              const active = c.id === cityId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => switchCity(c.id)}
                  className={`font-hand shrink-0 rounded-sm px-3 py-1 text-sm font-semibold transition ${
                    active
                      ? "bg-[#5c2430] text-[#ffe9c8] shadow-sm"
                      : "bg-[#fffdf8]/80 text-[#5c3a2e] ring-1 ring-ink/10 hover:bg-[#fff3c4]"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </motion.header>

      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="relative min-h-[38vh] flex-1 md:min-h-0">
          {loadingPlaces ? (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              Loading cities…
            </div>
          ) : loadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-sm text-danger">{loadError}</p>
            </div>
          ) : (
            // Plain div on purpose: Framer transform on Leaflet's parent
            // breaks map panes and causes appendChild crashes on back/forward.
            <div className="relative h-full w-full">
              <StoryMap
                places={filteredPlaces}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={(id) => {
                  if (tramRiding) stopTramRide();
                  setSelectedPresenceId(null);
                  setSelectedPlaceId(id);
                }}
                cityCenter={{
                  lat: activeCity.centerLat,
                  lng: activeCity.centerLng,
                }}
                cityZoom={"zoom" in activeCity ? activeCity.zoom : 12}
                rainMode={rainMode}
                tramRiding={tramRiding}
                tramStops={tramStops}
                tramIndex={tramIndex}
                tramLerp={tramLerp}
                livingPresences={presences}
                selectedPresenceId={selectedPresenceId}
                onSelectPresence={(id) => {
                  if (tramRiding) stopTramRide();
                  setSelectedPlaceId(null);
                  setSelectedPresenceId(id);
                }}
              />
              <RainOverlay active={rainMode} />
              {presenceFlash ? (
                <div className="pointer-events-none absolute inset-x-3 top-3 z-30 md:inset-x-auto md:left-5 md:top-5 md:max-w-sm">
                  <div className="ms-presence-flash rounded-sm px-3 py-2.5 shadow-lg">
                    <p className="font-hand text-sm font-semibold text-[#ffb0c8]">
                      you are a place now
                    </p>
                    <p className="font-display text-lg text-[#fff6e8]">
                      {presenceFlash}
                    </p>
                  </div>
                </div>
              ) : null}
              {tramRiding && tramStopName ? (
                <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[min(100%,280px)] md:left-5 md:top-5">
                  <div className="ms-tram-banner pointer-events-auto rounded-sm px-3 py-2 shadow-[0_12px_28px_-14px_rgba(26,22,18,0.55)]">
                    <p className="font-hand text-xs font-semibold tracking-wide text-[#ffb0c8] uppercase">
                      tram reel · stop {tramIndex + 1}/{tramStops.length}
                    </p>
                    <p className="font-display mt-0.5 text-lg leading-tight text-[#fff6e8]">
                      {tramStopName}
                    </p>
                    <p className="font-hand mt-1 text-sm text-[#ffe9c8]/85">
                      scraps open as the tram arrives
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {!loadingPlaces && !loadError ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 px-3 md:bottom-6 md:left-6 md:right-auto md:max-w-[min(100%,560px)] md:px-0">
              <motion.div
                className="pointer-events-auto flex gap-2 overflow-x-auto pb-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.25 },
                  },
                }}
              >
                {filteredPlaces.map((place) => {
                  const active = place.id === selectedPlaceId;
                  return (
                    <motion.button
                      key={place.id}
                      type="button"
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.35, ease: easeOut },
                        },
                      }}
                      whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPlaceId(place.id)}
                      className={`ms-chip shrink-0 rounded-full px-3 py-2 text-left text-[11px] shadow-sm ${
                        active ? "bg-ink text-paper" : "ms-glass text-ink-soft"
                      }`}
                    >
                      <span className="block font-medium">{place.name}</span>
                      <span
                        className={`tabular-nums ${active ? "text-paper/70" : "text-ink-faint"}`}
                      >
                        {place.memoryCount} memories
                        {!place.isDemo ? " · yours" : ""}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {selectedPresenceId ? (
            <motion.div
              key={`presence-${selectedPresenceId}`}
              className="z-20 flex w-full min-h-0 flex-col md:w-[380px] md:py-3 md:pr-3 lg:w-[400px]"
              initial={reduce ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 28 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              <div className="min-h-0 flex-1 overflow-hidden md:rounded-xl md:shadow-[0_24px_60px_-28px_rgba(26,22,18,0.45)]">
                <PresenceShoulder
                  presenceId={selectedPresenceId}
                  onClose={() => setSelectedPresenceId(null)}
                  onExpired={() => {
                    setSelectedPresenceId(null);
                    void loadPresences();
                  }}
                />
              </div>
            </motion.div>
          ) : selectedPlace ? (
            <motion.div
              key={selectedPlace.id}
              className="z-20 flex w-full min-h-0 flex-col md:w-[380px] md:py-3 md:pr-3 lg:w-[400px]"
              initial={reduce ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: 28 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              <div className="min-h-0 flex-1 overflow-hidden md:rounded-xl md:shadow-[0_24px_60px_-28px_rgba(26,22,18,0.45)]">
                <PlaceStorybook
                  place={selectedPlace}
                  memories={memories}
                  mode={mode}
                  layer={layer}
                  loading={memoriesLoading}
                  onModeChange={(m) => {
                    setMode(m);
                    if (m === "EXPLORE_BY_TIME" && layer === "ALL") {
                      setLayer("NOW");
                    }
                  }}
                  onLayerChange={setLayer}
                  onClose={() => setSelectedPlaceId(null)}
                  onContribute={() => setPublishOpen(true)}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <MuralPanel placeId={selectedPlaceId} />
      </div>

      {selectedPlace ? (
        <PublishMemoryModal
          open={publishOpen}
          placeId={selectedPlace.id}
          placeName={selectedPlace.name}
          places={places.map((p) => ({
            id: p.id,
            name: p.name,
            neighborhoodId: p.neighborhoodId,
            city: p.city,
          }))}
          onPlaceChange={(id) => {
            setSelectedPlaceId(id);
            const p = places.find((x) => x.id === id);
            if (p) setCityId(p.neighborhoodId);
          }}
          onPlaceCreated={(place) => {
            void loadPlaces(place.id);
          }}
          onClose={() => setPublishOpen(false)}
          onPublished={(memoryId) => {
            void loadPlaces(selectedPlaceId);
            void loadMemories();
            setPublishOpen(false);
            if (memoryId) {
              void (async () => {
                await loadPresences();
                try {
                  const res = await fetch("/api/presences");
                  const data = (await res.json()) as {
                    presences: PresenceSummary[];
                  };
                  const mine = data.presences.find(
                    (p) => p.memoryId === memoryId,
                  );
                  if (mine) {
                    setSelectedPlaceId(null);
                    setSelectedPresenceId(mine.id);
                    setPresenceFlash(
                      `${mine.label} is walking the map for ${mine.minutesLeft} min`,
                    );
                    window.setTimeout(() => setPresenceFlash(null), 6000);
                  }
                } catch {
                  /* ignore */
                }
              })();
            }
          }}
        />
      ) : null}
    </div>
  );
}
