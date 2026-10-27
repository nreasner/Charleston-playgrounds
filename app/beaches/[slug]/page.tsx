import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { beachBySlug, beaches } from "@/lib/data/beaches";
import { playgrounds } from "@/lib/data/playgrounds";
import { PhotoGallery } from "@/components/Photo";
import { PlaygroundCard } from "@/components/Playgrounds";
import { Crumb, JsonLd, PassBadge, TipCta } from "@/components/ui";
import { directionsLink, PASS_LABEL, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return beaches.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = beachBySlug((await params).slug);
  if (!b) return {};
  return { title: `${b.name} With Kids — Parking, Passes & Tips`, description: b.short, alternates: { canonical: `/beaches/${b.slug}` } };
}

export default async function BeachPage({ params }: Props) {
  const b = beachBySlug((await params).slug);
  if (!b) notFound();
  const near = playgrounds
    .map((p) => ({ p, d: Math.hypot(p.lat - b.lat, (p.lng - b.lng) * 0.84) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 2)
    .map((x) => x.p);
  const passName = b.pass === "gold" ? "Gold Pass" : b.pass === "state" ? "State Park Pass" : "a pass";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Beach",
          name: b.name,
          description: b.short,
          url: `${SITE.url}/beaches/${b.slug}`,
          geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
        }}
      />
      <Crumb href="/beaches" label="All beaches" />
      <PhotoGallery placeId={b.placeId} name={b.name} emoji="🏖️" />
      <div className="detail-head">
        <div>
          <h1>{b.name}</h1>
          <div className="note" style={{ fontWeight: 700 }}>🚗 {b.driveTime} · 🛟 Lifeguards: {b.lifeguards}</div>
        </div>
        <div className="btn-row" style={{ alignItems: "center" }}>
          <PassBadge pass={b.pass} />
          <a className="btn" href={directionsLink(b.address)} target="_blank" rel="noopener noreferrer">Directions</a>
        </div>
      </div>
      <div className="prose" style={{ marginTop: 12 }}>
        {b.description.map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </div>

      <h2 className="section-title">The sections of the beach</h2>
      <div className="stack">
        {b.sections.map((s) => (
          <div key={s.name} className={`card card-pad section-card ${s.pass || ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 17 }}>{s.name}</h3>
              {s.pass ? <span className={`badge ${PASS_LABEL[s.pass].cls}`}>{PASS_LABEL[s.pass].label}</span> : <span className="badge badge-gray">No pass needed / not covered</span>}
            </div>
            <div className="facts" style={{ marginTop: 10 }}>
              <div className="row"><span>🅿️</span><span>{s.parking}</span></div>
              <div className="row"><span>🚻</span><span>{s.facilities}</span></div>
              <div className="row"><span>👍</span><span><b>Best for:</b> {s.bestFor}</span></div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">How to go</h2>
      <div className="how">
        <div className="card card-pad accent-gold">
          <h3 style={{ fontSize: 17 }}>With {passName}</h3>
          <ol className="list" style={{ marginTop: 10 }}>
            {b.withPass.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
          {b.pass !== "free" && (
            <Link className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} href={b.pass === "gold" ? "/passes/gold-pass" : "/passes/state-park-passport"}>
              About the {passName} →
            </Link>
          )}
        </div>
        <div className="card card-pad accent-blue">
          <h3 style={{ fontSize: 17 }}>Without a pass</h3>
          <ol className="list" style={{ marginTop: 10 }}>
            {b.withoutPass.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="detail-grid" style={{ marginTop: 24 }}>
        <div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Family tips</h2>
          <ul className="list">
            {b.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
        <aside className="card card-pad facts">
          <div className="row"><span>🐕</span><span>{b.dogs}</span></div>
          {b.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>
              {l.label} ↗
            </a>
          ))}
          <p className="note" style={{ margin: 0 }}>Parking rates change seasonally — check the official links before you go.</p>
        </aside>
      </div>

      <h2 className="section-title">Playgrounds nearby (for a sand break)</h2>
      <div className="grid">
        {near.map((p) => (
          <PlaygroundCard key={p.slug} p={p} />
        ))}
      </div>
      <TipCta />
    </>
  );
}
