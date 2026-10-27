import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activities, activityBySlug } from "@/lib/data/activities";
import { passBySlug } from "@/lib/data/passes";
import { PhotoGallery } from "@/components/Photo";
import { Crumb, JsonLd, TipCta } from "@/components/ui";
import { directionsLink, mapsLink, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = activityBySlug((await params).slug);
  if (!a) return {};
  return { title: `${a.name} With Kids — Hours, Prices & Tips`, description: a.short, alternates: { canonical: `/activities/${a.slug}` } };
}

export default async function ActivityPage({ params }: Props) {
  const a = activityBySlug((await params).slug);
  if (!a) notFound();
  const pass = a.pass ? passBySlug(a.pass) : undefined;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: a.name,
          description: a.short,
          url: `${SITE.url}/activities/${a.slug}`,
          address: a.address,
          geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
          sameAs: a.url,
        }}
      />
      <Crumb href="/activities" label="All activities" />
      {a.placeId ? <PhotoGallery placeId={a.placeId} name={a.name} emoji="🎪" /> : null}
      <div className="detail-head">
        <div>
          <span className="badge badge-coral">{a.category}</span>
          <h1 style={{ marginTop: 8 }}>{a.name}</h1>
          <a href={mapsLink(a.address)} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>📍 {a.address}</a>
        </div>
        <div className="btn-row">
          <a className="btn" href={a.url} target="_blank" rel="noopener noreferrer">Official site ↗</a>
          <a className="btn btn-ghost" href={directionsLink(a.address)} target="_blank" rel="noopener noreferrer">Directions</a>
        </div>
      </div>

      <div className="detail-grid" style={{ marginTop: 20 }}>
        <div>
          <div className="prose">
            {a.description.map((d, i) => (
              <p key={i}>{d}</p>
            ))}
          </div>

          {a.schedule && (
            <>
              <h2 className="section-title">{a.schedule.title}</h2>
              <div className="card" style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr><th>Days</th><th>Time</th><th>Who</th><th>Cost</th><th>Where</th></tr>
                  </thead>
                  <tbody>
                    {a.schedule.rows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 800 }}>{r.day}</td>
                        <td>{r.time}</td>
                        <td>{r.who}</td>
                        <td>{r.cost}</td>
                        <td>{r.where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note" style={{ marginTop: 8 }}>Schedules change with the seasons — confirm on the official site before you go.</p>
            </>
          )}

          {a.locations && (
            <>
              <h2 className="section-title">Locations</h2>
              <div className="grid">
                {a.locations.map((l) => (
                  <a key={l.name} href={mapsLink(l.address)} target="_blank" rel="noopener noreferrer" className="card card-pad card-link">
                    <h3 style={{ fontSize: 16 }}>{l.name}</h3>
                    <p style={{ fontSize: 14 }}>📍 {l.address}</p>
                  </a>
                ))}
              </div>
            </>
          )}

          <h2 className="section-title">Parent tips</h2>
          <ul className="list">
            {a.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <aside className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>🕐 Hours</h3>
          <ul className="list" style={{ fontSize: 15 }}>
            {a.hours.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          <h3 style={{ fontSize: 16, margin: "16px 0 4px" }}>💵 Cost</h3>
          <div className="kv">
            {a.prices.map((p) => (
              <div key={p.label}>
                <span>{p.label}</span>
                <b>{p.value}</b>
              </div>
            ))}
          </div>
          <div className="facts" style={{ marginTop: 14 }}>
            <div className="row"><span>👧</span><span>{a.ages}</span></div>
            <div className="row"><span>⏱</span><span>Plan {a.timeNeeded}</span></div>
            {a.phone && <div className="row"><span>📞</span><a href={`tel:${a.phone}`}>{a.phone}</a></div>}
          </div>
          {pass && (
            <p className="alert" style={{ marginTop: 14 }}>
              Save with a pass: <Link href={`/passes/${pass.slug}`}>{pass.name}</Link>
            </p>
          )}
        </aside>
      </div>
      <TipCta />
    </>
  );
}
