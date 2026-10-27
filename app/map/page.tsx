import type { Metadata } from "next";
import { Suspense } from "react";
import { playgrounds } from "@/lib/data/playgrounds";
import { beaches } from "@/lib/data/beaches";
import { libraries } from "@/lib/data/libraries";
import { activities } from "@/lib/data/activities";
import { MapView, type Pin } from "@/components/MapView";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Charleston Playground Map",
  description: "Every playground, family beach, library and kid activity in Charleston on one interactive map.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  const pins: Pin[] = [
    ...playgrounds.map((p) => ({ id: p.slug, kind: "Playgrounds" as const, name: p.name, lat: p.lat, lng: p.lng, href: `/playgrounds/${p.slug}`, sub: p.area })),
    ...beaches.map((b) => ({ id: b.slug, kind: "Beaches" as const, name: b.name, lat: b.lat, lng: b.lng, href: `/beaches/${b.slug}`, sub: b.driveTime })),
    ...libraries.map((l) => ({ id: l.slug, kind: "Libraries" as const, name: l.name, lat: l.lat, lng: l.lng, href: `/libraries/${l.slug}`, sub: l.area })),
    ...activities.map((a) => ({ id: a.slug, kind: "Activities" as const, name: a.name, lat: a.lat, lng: a.lng, href: `/activities/${a.slug}`, sub: a.category })),
  ];
  return (
    <>
      <PageHead title="Map" intro="Playgrounds, beaches, libraries and activities across the Lowcountry. Toggle a category to clear the clutter." />
      <Suspense fallback={<div className="map-box photo-shimmer" />}>
        <MapView pins={pins} />
      </Suspense>
    </>
  );
}
