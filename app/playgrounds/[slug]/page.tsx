import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { playgroundBySlug, playgrounds } from "@/lib/data/playgrounds";
import { PhotoGallery } from "@/components/Photo";
import { RatePanel, RatingsGrid, PlaygroundCard } from "@/components/Playgrounds";
import { SaveButtons } from "@/components/Save";
import { Crumb, JsonLd, PassBadge, TagBadges, TipCta } from "@/components/ui";
import { directionsLink, mapsLink, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return playgrounds.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = playgroundBySlug((await params).slug);
  if (!p) return {};
  const feats = [p.tags.includes("fenced") && "fenced", p.tags.includes("shade") && "shaded", p.tags.includes("restrooms") && "restrooms"].filter(Boolean).join(", ");
  return {
    title: `${p.name} — ${p.area} Playground`,
    description: `${p.short} ${feats ? `Features: ${feats}.` : ""} Parent ratings, photos, tips and nearby kid-friendly food.`.slice(0, 300),
    alternates: { canonical: `/playgrounds/${p.slug}` },
  };
}

export default async function PlaygroundPage({ params }: Props) {
  const p = playgroundBySlug((await params).slug);
  if (!p) notFound();
  const nearby = playgrounds
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, d: Math.hypot(x.lat - p.lat, (x.lng - p.lng) * 0.84) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map((n) => n.x);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["Park", "TouristAttraction"],
          name: p.name,
          description: p.short,
          url: `${SITE.url}/playgrounds/${p.slug}`,
          address: { "@type": "PostalAddress", streetAddress: p.address, addressRegion: "SC", addressCountry: "US" },
          geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
          isAccessibleForFree: !p.fee,
          publicAccess: true,
          ...(p.ratings.overall ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.ratings.overall, bestRating: 5, ratingCount: 1 } } : {}),
        }}
      />
      <Crumb href="/" label="All playgrounds" />
      <PhotoGallery placeId={p.placeId} name={p.name} />

      <div className="detail-head">
        <div>
          <h1>{p.name}</h1>
          <a href={mapsLink(p.address)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>
            📍 {p.address}
          </a>
        </div>
        <a className="btn" href={directionsLink(p.address)} target="_blank" rel="noopener noreferrer">
          Directions
        </a>
      </div>
      <div className="badges" style={{ margin: "8px 0 16px" }}>
        {p.isNew && <span className="badge badge-new">New in 2026</span>}
        <PassBadge pass={p.pass} />
        <TagBadges tags={p.tags} />
      </div>
      <SaveButtons slug={p.slug} />

      <div className="detail-grid" style={{ marginTop: 24 }}>
        <div>
          <div className="prose">
            {p.description.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </div>
          <h2 className="section-title">Good to know</h2>
          <ul className="list">
            {p.goodToKnow.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>

          <h2 className="section-title">Ratings</h2>
          <RatingsGrid p={p} />
          <div style={{ marginTop: 16 }}>
            <RatePanel slug={p.slug} />
          </div>

          {p.eats.length > 0 && (
            <>
              <h2 className="section-title">Kid-friendly eats nearby</h2>
              <div className="stack">
                {p.eats.map((e) => (
                  <a key={e.name} className="card card-pad card-link" href={mapsLink(`${e.name}, ${e.address}`)} target="_blank" rel="noopener noreferrer">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16 }}>{e.name}</h3>
                      <span className="badge badge-green">{e.type}</span>
                    </div>
                    <p style={{ fontSize: 14 }}>{e.tip}</p>
                    <div className="note" style={{ marginTop: 4 }}>📍 {e.address} ↗</div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="card card-pad facts">
          <div className="row"><span>📍</span><span>{p.area}</span></div>
          {p.hours && <div className="row"><span>🕐</span><span>{p.hours}</span></div>}
          <div className="row"><span>💵</span><span>{p.fee || "Free"}</span></div>
          {p.ages && <div className="row"><span>👧</span><span>{p.ages}</span></div>}
          <div className="row"><span>🚻</span><span>{p.tags.includes("restrooms") ? "Restrooms on site" : "No dedicated restrooms"}</span></div>
          <div className="row"><span>🔒</span><span>{p.tags.includes("fenced") ? "Fenced play area" : "Not fully fenced"}</span></div>
          {p.pass === "gold" && (
            <p className="note" style={{ margin: 0 }}>
              Free with the <Link href="/passes/gold-pass">Gold Pass</Link>.
            </p>
          )}
          <Link href={`/map?focus=${p.slug}`} className="btn btn-ghost btn-sm">🗺️ See on our map</Link>
        </aside>
      </div>

      <h2 className="section-title">Nearby playgrounds</h2>
      <div className="grid">
        {nearby.map((n) => (
          <PlaygroundCard key={n.slug} p={n} />
        ))}
      </div>
      <TipCta />
    </>
  );
}
