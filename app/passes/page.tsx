import type { Metadata } from "next";
import Link from "next/link";
import { passes } from "@/lib/data/passes";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Charleston Family Passes Compared — Gold Pass, State Parks, Splash & More",
  description: "What the Charleston County Gold Pass, SC State Park Passport, Splash Passes and museum memberships cost, what they cover, and which one your family needs.",
  alternates: { canonical: "/passes" },
};

export default function PassesPage() {
  return (
    <>
      <PageHead title="Passes & memberships" intro="Which pass covers what, what it costs, and whether it'll pay off for your family. Tap any pass for the full breakdown and where to buy." />
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 17 }}>Not sure which one?</h3>
        <p>
          County parks, county beach parks and the Festival of Lights → <Link href="/passes/gold-pass">Gold Pass</Link>. Charles Towne Landing, Edisto and
          state parks → <Link href="/passes/state-park-passport">State Park Passport</Link>. Summer waterparks → <Link href="/passes/super-splash-pass">Splash Pass</Link>.{" "}
          <Link href="/blog/gold-pass-vs-state-park-pass">Read our comparison →</Link>
        </p>
      </div>
      <div className="grid">
        {passes.map((p) => (
          <Link key={p.slug} href={`/passes/${p.slug}`} className={`card card-pad card-link accent-${p.accent}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h3>{p.name}</h3>
            <div style={{ fontWeight: 900, fontSize: 18, color: "var(--green-deep)" }}>{p.price}</div>
            <p style={{ margin: 0 }}>{p.short}</p>
            <div className="note" style={{ marginTop: "auto", paddingTop: 8, fontWeight: 700 }}>Best for: {p.bestFor}</div>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
