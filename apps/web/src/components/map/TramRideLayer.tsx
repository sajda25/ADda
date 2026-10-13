"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { Marker, Polyline, useMap } from "react-leaflet";
import type { PlaceSummary } from "@memory-streets/shared";
import { lerpLatLng } from "@/lib/tramRoute";

type Props = {
  stops: PlaceSummary[];
  /** Index of the stop the tram has reached (or is leaving). */
  index: number;
  /** 0–1 progress toward the next stop. */
  lerp: number;
};

function tramDivIcon() {
  return L.divIcon({
    className: "ms-tram-marker",
    iconSize: [64, 48],
    iconAnchor: [32, 40],
    html: `<div class="ms-tram-marker-inner" aria-hidden="true">
      <svg viewBox="0 0 180 140" width="64" height="48">
        <ellipse cx="90" cy="130" rx="60" ry="7" fill="#1a1612" opacity="0.15"/>
        <rect x="28" y="48" width="124" height="58" rx="8" fill="#ffc53d" stroke="#1a1612" stroke-width="2.2"/>
        <rect x="40" y="58" width="28" height="22" rx="3" fill="#7ec8ff" stroke="#1a1612" stroke-width="1.5"/>
        <rect x="76" y="58" width="28" height="22" rx="3" fill="#ff8fb5" stroke="#1a1612" stroke-width="1.5"/>
        <rect x="112" y="58" width="28" height="22" rx="3" fill="#b8e86a" stroke="#1a1612" stroke-width="1.5"/>
        <circle cx="52" cy="112" r="10" fill="#1a1612"/>
        <circle cx="128" cy="112" r="10" fill="#1a1612"/>
        <circle cx="52" cy="112" r="4" fill="#ffc53d"/>
        <circle cx="128" cy="112" r="4" fill="#ffc53d"/>
        <circle cx="90" cy="36" r="18" fill="#ffd0a8" stroke="#1a1612" stroke-width="2"/>
        <circle cx="84" cy="34" r="2.5" fill="#1a1612"/>
        <circle cx="96" cy="34" r="2.5" fill="#1a1612"/>
        <path d="M84 42 Q90 46 96 42" fill="none" stroke="#1a1612" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M70 28 Q90 12 110 28" fill="#2f6f72" stroke="#1a1612" stroke-width="1.5"/>
        <line x1="20" y1="40" x2="160" y2="40" stroke="#e87860" stroke-opacity="0.7" stroke-width="1.6"/>
      </svg>
    </div>`,
  });
}

export function TramRideLayer({ stops, index, lerp }: Props) {
  const map = useMap();
  const icon = useMemo(() => tramDivIcon(), []);

  const fullLine = useMemo(
    () => stops.map((s) => [s.approxLat, s.approxLng] as [number, number]),
    [stops],
  );

  const position = useMemo(() => {
    const here = stops[Math.min(index, stops.length - 1)];
    if (!here) return null;
    const next = stops[index + 1];
    if (!next || lerp <= 0) {
      return { lat: here.approxLat, lng: here.approxLng };
    }
    return lerpLatLng(
      { lat: here.approxLat, lng: here.approxLng },
      { lat: next.approxLat, lng: next.approxLng },
      lerp,
    );
  }, [stops, index, lerp]);

  const traveled = useMemo(() => {
    if (!position) return fullLine.slice(0, 1);
    const pts: [number, number][] = [];
    for (let i = 0; i <= index && i < stops.length; i++) {
      const s = stops[i]!;
      pts.push([s.approxLat, s.approxLng]);
    }
    if (lerp > 0 && index < stops.length - 1) {
      pts.push([position.lat, position.lng]);
    }
    return pts;
  }, [stops, index, lerp, position, fullLine]);

  useEffect(() => {
    if (!map || !position) return;
    try {
      map.panTo([position.lat, position.lng], { animate: true, duration: 0.35 });
    } catch {
      /* map torn down */
    }
  }, [map, position?.lat, position?.lng]);

  if (!position || stops.length < 2) return null;

  return (
    <>
      <Polyline
        positions={fullLine}
        pathOptions={{
          color: "#5c2430",
          weight: 2,
          opacity: 0.25,
          dashArray: "6 10",
        }}
      />
      <Polyline
        positions={traveled}
        pathOptions={{
          color: "#e87860",
          weight: 4,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      <Marker position={[position.lat, position.lng]} icon={icon} zIndexOffset={800} />
    </>
  );
}
