"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export interface Pin {
  id: string;
  kind: "Playgrounds" | "Beaches" | "Libraries" | "Activities";
  name: string;
  lat: number;
  lng: number;
  href: string;
  sub: string;
}

const STYLE: Record<Pin["kind"], { color: string; icon: string }> = {
  Playgrounds: { color: "#2d6a4f", icon: "🛝" },
  Beaches: { color: "#0ea5e9", icon: "🏖️" },
  Libraries: { color: "#8b5cf6", icon: "📚" },
  Activities: { color: "#ef7b56", icon: "🎪" },
};

export function MapView({ pins }: { pins: Pin[] }) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const layers = useRef<Record<string, any>>({}); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [on, setOn] = useState<Record<Pin["kind"], boolean>>({ Playgrounds: true, Beaches: true, Libraries: true, Activities: true });
  const focus = useSearchParams().get("focus");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !box.current || mapRef.current) return;
      const map = L.map(box.current, { scrollWheelZoom: false }).setView([32.8, -79.95], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      mapRef.current = map;
      const markers: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      (Object.keys(STYLE) as Pin["kind"][]).forEach((k) => (layers.current[k] = L.layerGroup().addTo(map)));
      for (const p of pins) {
        const s = STYLE[p.kind];
        const icon = L.divIcon({ className: "", html: `<div class="pin" style="background:${s.color}"><span>${s.icon}</span></div>`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
        const m = L.marker([p.lat, p.lng], { icon, title: p.name })
          .bindPopup(`<b>${p.name}</b><div style="color:#6b716c">${p.sub}</div><a href="${p.href}" style="font-weight:800">View details →</a>`)
          .addTo(layers.current[p.kind]);
        markers[p.id] = m;
      }
      const f = focus && markers[focus];
      if (f) {
        map.setView(f.getLatLng(), 14);
        f.openPopup();
      } else {
        map.fitBounds(L.latLngBounds(pins.filter((p) => p.lat > 32.55).map((p) => [p.lat, p.lng] as [number, number])), { padding: [20, 20] });
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [pins, focus]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const [k, v] of Object.entries(on)) {
      const layer = layers.current[k];
      if (!layer) continue;
      if (v && !map.hasLayer(layer)) layer.addTo(map);
      if (!v && map.hasLayer(layer)) map.removeLayer(layer);
    }
  }, [on]);

  return (
    <>
      <div className="chips wrap-chips" style={{ marginBottom: 12 }}>
        {(Object.keys(STYLE) as Pin["kind"][]).map((k) => (
          <button key={k} className={"chip" + (on[k] ? " on" : "")} aria-pressed={on[k]} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}>
            {STYLE[k].icon} {k}
          </button>
        ))}
      </div>
      <div ref={box} className="map-box" />
      <p className="note" style={{ marginTop: 8 }}>Tap a pin for details. Use two fingers (or the + / – buttons) to zoom.</p>
    </>
  );
}
