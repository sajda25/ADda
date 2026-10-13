"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import type { PlaceSummary } from "@memory-streets/shared";
import {
  ARCHIVAL_TILE_ATTRIBUTION,
  ARCHIVAL_TILE_URL,
  DEMO_MAP_CENTER,
  DEMO_MAP_ZOOM,
} from "@/lib/geo";
import { LivingPresencesLayer } from "@/components/map/LivingPresencesLayer";
import { TramRideLayer } from "@/components/map/TramRideLayer";
import type { PresenceSummary } from "@/lib/presence";
import "leaflet/dist/leaflet.css";

type Props = {
  places: PlaceSummary[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  highlightLatLng?: { lat: number; lng: number } | null;
  cityCenter?: { lat: number; lng: number } | null;
  cityZoom?: number;
  rainMode?: boolean;
  tramStops?: PlaceSummary[];
  tramIndex?: number;
  tramLerp?: number;
  tramRiding?: boolean;
  livingPresences?: PresenceSummary[];
  selectedPresenceId?: string | null;
  onSelectPresence?: (id: string) => void;
};

function Recenter({
  lat,
  lng,
  zoom,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.flyTo([lat, lng], zoom ?? Math.max(map.getZoom(), 15), {
      duration: 0.75,
    });
  }, [lat, lng, zoom, map]);
  return null;
}

/** Keep Leaflet panes healthy after mount / city changes. */
function MapInvalidate() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const t = window.setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {
        /* map already torn down */
      }
    }, 80);
    return () => window.clearTimeout(t);
  }, [map]);
  return null;
}

export function StoryMap({
  places,
  selectedPlaceId,
  onSelectPlace,
  highlightLatLng,
  cityCenter,
  cityZoom,
  rainMode = false,
  tramStops = [],
  tramIndex = 0,
  tramLerp = 0,
  tramRiding = false,
  livingPresences = [],
  selectedPresenceId = null,
  onSelectPresence,
}: Props) {
  // Defer MapContainer until after mount so back/forward nav doesn't
  // race Leaflet against a half-destroyed DOM (appendChild TypeError).
  const [mountId, setMountId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const frame = window.requestAnimationFrame(() => {
      if (alive) setMountId(Date.now());
    });
    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      setMountId(null);
    };
  }, []);

  const focus = useMemo(() => {
    if (highlightLatLng) return { ...highlightLatLng, zoom: cityZoom };
    const selected = places.find((p) => p.id === selectedPlaceId);
    if (selected) {
      return {
        lat: selected.approxLat,
        lng: selected.approxLng,
        zoom: Math.max(cityZoom ?? DEMO_MAP_ZOOM, 14),
      };
    }
    if (cityCenter) {
      return { ...cityCenter, zoom: cityZoom ?? DEMO_MAP_ZOOM };
    }
    return { ...DEMO_MAP_CENTER, zoom: DEMO_MAP_ZOOM };
  }, [highlightLatLng, places, selectedPlaceId, cityCenter, cityZoom]);

  if (mountId == null) {
    return <div className="h-full w-full bg-[#d8cbb8]" aria-hidden="true" />;
  }

  return (
    <MapContainer
      key={mountId}
      center={[
        cityCenter?.lat ?? DEMO_MAP_CENTER.lat,
        cityCenter?.lng ?? DEMO_MAP_CENTER.lng,
      ]}
      zoom={cityZoom ?? DEMO_MAP_ZOOM}
      className={`h-full w-full z-0 ${rainMode ? "ms-map-rain" : ""}`}
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        attribution={ARCHIVAL_TILE_ATTRIBUTION}
        url={ARCHIVAL_TILE_URL}
        maxZoom={19}
        className={rainMode ? "ms-tiles-rain" : undefined}
      />
      <ZoomControl position="bottomleft" />
      <MapInvalidate />
      {!tramRiding ? (
        <Recenter lat={focus.lat} lng={focus.lng} zoom={focus.zoom} />
      ) : null}
      {tramRiding && tramStops.length >= 2 ? (
        <TramRideLayer
          stops={tramStops}
          index={tramIndex}
          lerp={tramLerp}
        />
      ) : null}
      {livingPresences.length > 0 && onSelectPresence ? (
        <LivingPresencesLayer
          presences={livingPresences}
          selectedId={selectedPresenceId}
          onSelect={onSelectPresence}
        />
      ) : null}
      {places.map((place) => {
        const selected = place.id === selectedPlaceId;
        const empty = place.memoryCount === 0;
        const radius = empty
          ? selected
            ? 14
            : 11
          : Math.min(20, 9 + Math.sqrt(place.memoryCount) * 2.4);
        const rainy =
          !empty &&
          rainMode &&
          (place.teaserExcerpt?.toLowerCase().includes("rain") ||
            place.teaserTitle?.toLowerCase().includes("monsoon") ||
            place.description.toLowerCase().includes("rain") ||
            place.description.toLowerCase().includes("monsoon"));
        return (
          <CircleMarker
            key={place.id}
            center={[place.approxLat, place.approxLng]}
            radius={selected && !empty ? radius + 4 : rainy ? radius + 2 : radius}
            pathOptions={{
              color: empty
                ? selected
                  ? "#5c2430"
                  : "#6a6156"
                : selected
                  ? "#33402e"
                  : rainy
                    ? "#2a5a7a"
                    : "#4f6348",
              fillColor: empty
                ? selected
                  ? "#c8e4ff"
                  : "#efe6d8"
                : selected
                  ? "#d0892f"
                  : rainy
                    ? "#5b9ec9"
                    : "#7d9174",
              fillOpacity: empty ? (selected ? 0.75 : 0.35) : selected ? 0.92 : rainy ? 0.85 : 0.62,
              weight: empty ? (selected ? 2.5 : 1.5) : selected ? 3 : rainy ? 2.4 : 1.75,
              dashArray: empty ? "4 5" : undefined,
              className: selected ? "marker-selected" : empty ? "marker-empty-chair" : undefined,
            }}
            eventHandlers={{
              click: () => onSelectPlace(place.id),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              opacity={1}
              sticky={false}
              className="ms-peek-tooltip"
            >
              <div className="ms-peek-scrap">
                <span className="ms-peek-tape" />
                <p className="ms-peek-place">{place.name}</p>
                {empty ? (
                  <>
                    <p className="ms-peek-title">an empty chair waits</p>
                    <p className="ms-peek-line">
                      No scrap yet — first memory claims the seat.
                    </p>
                    <p className="ms-peek-cta">sit down →</p>
                  </>
                ) : place.teaserTitle ? (
                  <>
                    <p className="ms-peek-title">{place.teaserTitle}</p>
                    {place.teaserExcerpt ? (
                      <p className="ms-peek-line">{place.teaserExcerpt}</p>
                    ) : null}
                    <p className="ms-peek-cta">peel open →</p>
                  </>
                ) : (
                  <>
                    <p className="ms-peek-line">
                      {place.memoryCount} memor
                      {place.memoryCount === 1 ? "y" : "ies"} waiting under this
                      scrap…
                    </p>
                    <p className="ms-peek-cta">peel open →</p>
                  </>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
