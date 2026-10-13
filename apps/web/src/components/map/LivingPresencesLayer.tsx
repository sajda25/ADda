"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { Marker, useMap } from "react-leaflet";
import type { PresenceSummary } from "@/lib/presence";
import { wanderOffset } from "@/lib/presence";

type Props = {
  presences: PresenceSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function presenceIcon(label: string, selected: boolean) {
  const initial = (label.trim()[0] ?? "?").toUpperCase();
  return L.divIcon({
    className: "ms-presence-marker",
    iconSize: [52, 64],
    iconAnchor: [26, 58],
    html: `<div class="ms-presence-marker-inner ${selected ? "is-selected" : ""}" aria-hidden="true">
      <div class="ms-presence-bubble">${initial}</div>
      <div class="ms-presence-legs"></div>
      <p class="ms-presence-label">${escapeHtml(label.slice(0, 14))}</p>
    </div>`,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function LivingPresencesLayer({
  presences,
  selectedId,
  onSelect,
}: Props) {
  const map = useMap();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 120);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selectedId || !map) return;
    const p = presences.find((x) => x.id === selectedId);
    if (!p) return;
    try {
      map.panTo([p.anchorLat, p.anchorLng], {
        animate: true,
        duration: 0.45,
      });
    } catch {
      /* ignore */
    }
  }, [selectedId, map, presences]);

  const icons = useMemo(() => {
    const mapIcons = new Map<string, L.DivIcon>();
    for (const p of presences) {
      mapIcons.set(p.id, presenceIcon(p.label, p.id === selectedId));
    }
    return mapIcons;
  }, [presences, selectedId]);

  return (
    <>
      {presences.map((p) => {
        const w = wanderOffset(p.id, now);
        const icon = icons.get(p.id);
        if (!icon) return null;
        return (
          <Marker
            key={p.id}
            position={[p.anchorLat + w.dLat, p.anchorLng + w.dLng]}
            icon={icon}
            zIndexOffset={p.id === selectedId ? 900 : 700}
            eventHandlers={{
              click: () => onSelect(p.id),
            }}
          />
        );
      })}
    </>
  );
}
