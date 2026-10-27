import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { passBySlug, passes } from "@/lib/data/passes";
import { Crumb, TipCta } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return passes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = passBySlug((await params).slug);
  if (!p) return {};
  return { title: `${p.name} — Price, What's Included & How to Buy`, description: p.short, alternates: { canonical: `/passes/${p.slug}` } };
}

export default async function PassPage({ params }: Props) {
  const p = passBySlug((await params).slug);
  if (!p) notFound();
  return (
    <>
      <Crumb href="/passes" label="All passes" />
      <div className={`card card-pad accent-${p.accent}`}>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 32, color: "var(--green-deep)" }}>{p.name}</h1>
        <div style={{ fontWeight: 900, fontSize: 20, marginTop: 6 }}>{p.price}</div>
        <p style={{ fontSize: 17 }}>{p.short}</p>
        <div className="btn-row" style={{ marginTop: 14 }}>
          {p.links.map((l, i) => (
            <a key={l.url} className={i === 0 ? "btn" : "btn btn-ghost"} href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="detail-grid" style={{ marginTop: 24 }}>
        <div>
          {p.includes.map((g) => (
            <div key={g.heading}>
              <h2 className="section-title" style={{ marginTop: 0 }}>✅ {g.heading}</h2>
              <ul className="list" style={{ marginBottom: 22 }}>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
          <h2 className="section-title">🚫 Not included</h2>
          <ul className="list">
            {p.notIncluded.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          {p.math && (
            <>
              <h2 className="section-title">🧮 Does it pay off?</h2>
              <p className="prose">{p.math}</p>
            </>
          )}
          <h2 className="section-title">🛒 How to buy & use it</h2>
          <ol className="list">
            {p.howToBuy.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ol>
        </div>
        <aside className="card card-pad">
          <h3 style={{ fontSize: 16 }}>💵 Prices</h3>
          <div className="kv" style={{ marginTop: 6 }}>
            {p.priceTable.map((r) => (
              <div key={r.label}>
                <span>{r.label}</span>
                <b>{r.value}</b>
              </div>
            ))}
          </div>
          <p className="note" style={{ marginTop: 12 }}>
            <b>Best for:</b> {p.bestFor}
          </p>
          <p className="note">{p.verifiedNote}</p>
        </aside>
      </div>
      <TipCta />
    </>
  );
}
