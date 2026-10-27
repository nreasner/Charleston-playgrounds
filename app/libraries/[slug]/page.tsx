import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { libraries, libraryBySlug, libraryPerks } from "@/lib/data/libraries";
import { PhotoGallery } from "@/components/Photo";
import { Crumb, JsonLd, TipCta } from "@/components/ui";
import { directionsLink, mapsLink, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return libraries.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = libraryBySlug((await params).slug);
  if (!l) return {};
  return { title: `${l.name} — Storytimes & Kids' Area`, description: l.short, alternates: { canonical: `/libraries/${l.slug}` } };
}

export default async function LibraryPage({ params }: Props) {
  const l = libraryBySlug((await params).slug);
  if (!l) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Library",
          name: l.name,
          url: `${SITE.url}/libraries/${l.slug}`,
          address: l.address,
          telephone: l.phone,
          geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng },
        }}
      />
      <Crumb href="/libraries" label="All libraries" />
      <PhotoGallery placeId={l.placeId} name={l.name} emoji="📚" />
      <div className="detail-head">
        <div>
          <h1>{l.name}</h1>
          <a href={mapsLink(l.address)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>📍 {l.address}</a>
        </div>
        <div className="btn-row">
          <a className="btn" href="https://ccplsc.libcal.com/calendar" target="_blank" rel="noopener noreferrer">Storytime calendar ↗</a>
          <a className="btn btn-ghost" href={directionsLink(l.address)} target="_blank" rel="noopener noreferrer">Directions</a>
        </div>
      </div>
      <div className="detail-grid" style={{ marginTop: 20 }}>
        <div>
          <p className="prose" style={{ fontSize: 17 }}>{l.short}</p>
          <h2 className="section-title">Why families love it</h2>
          <ul className="list">
            {l.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          {l.nearby && (
            <p className="alert" style={{ marginTop: 16 }}>🛝 Make a morning of it: {l.nearby}</p>
          )}
          <h2 className="section-title">At every CCPL branch</h2>
          <div className="stack">
            {libraryPerks.map((p) => (
              <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="card card-pad card-link">
                <h3 style={{ fontSize: 16 }}>{p.title} ↗</h3>
                <p style={{ fontSize: 14 }}>{p.body}</p>
              </a>
            ))}
          </div>
        </div>
        <aside className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>🕐 Usual hours</h3>
          <ul className="list" style={{ fontSize: 15 }}>
            {l.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="note">Holiday hours vary — confirm at ccpl.org.</p>
          <div className="facts" style={{ marginTop: 10 }}>
            <div className="row"><span>📞</span><a href={`tel:${l.phone}`}>{l.phone}</a></div>
            <div className="row"><span>🌐</span><a href="https://www.ccpl.org" target="_blank" rel="noopener noreferrer">ccpl.org ↗</a></div>
          </div>
        </aside>
      </div>
      <TipCta />
    </>
  );
}
