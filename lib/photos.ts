"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    __cpMapsCb?: () => void;
  }
}

const KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || "";
const TTL = 3 * 24 * 60 * 60 * 1000; // photo links expire, so refresh every few days
const MAX_PHOTOS = 5; // cost control: each photo displayed is a billable Google request

export interface PlacePhoto {
  url: string;
  credit?: string; // photographer name (Google requires attribution)
  creditUrl?: string;
}

let loading: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined" || !KEY) return Promise.reject();
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.__cpMapsCb = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places&callback=__cpMapsCb&loading=async`;
    s.async = true;
    s.onerror = () => reject();
    document.head.appendChild(s);
  });
  return loading;
}

// One request per place, shared across components
const inflight = new Map<string, Promise<PlacePhoto[]>>();

function fetchPhotos(placeId: string): Promise<PlacePhoto[]> {
  const ck = "cp_ph3_" + placeId;
  try {
    const c = JSON.parse(localStorage.getItem(ck) || "null");
    if (c && Date.now() - c.t < TTL) return Promise.resolve(c.p);
  } catch {}
  if (inflight.has(placeId)) return inflight.get(placeId)!;
  const p = loadMaps()
    .then(async () => {
      // Places API (New). Each photo shown is billed, so keep the count small.
      const { Place } = await window.google.maps.importLibrary("places");
      const place = new Place({ id: placeId });
      await place.fetchFields({ fields: ["photos"] });
      const list: PlacePhoto[] = (place.photos || []).slice(0, MAX_PHOTOS).map((ph: any) => {
        const a = ph.authorAttributions?.[0];
        return { url: ph.getURI({ maxWidth: 1000, maxHeight: 800 }), credit: a?.displayName, creditUrl: a?.uri };
      });
      try {
        localStorage.setItem(ck, JSON.stringify({ t: Date.now(), p: list }));
      } catch {}
      return list;
    })
    .catch(() => [] as PlacePhoto[]);
  inflight.set(placeId, p);
  return p;
}

export function usePlacePhotos(placeId?: string) {
  const [photos, setPhotos] = useState<PlacePhoto[] | null>(null);
  useEffect(() => {
    if (!placeId || !KEY) {
      setPhotos([]);
      return;
    }
    let live = true;
    fetchPhotos(placeId).then((p) => live && setPhotos(p));
    return () => {
      live = false;
    };
  }, [placeId]);
  return photos; // null = loading
}
