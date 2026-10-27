import type { Metadata } from "next";
import Link from "next/link";
import { beaches } from "@/lib/data/beaches";
import { CoverPhoto } from "@/components/Photo";
import { PageHead, PassBadge, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Family Beaches Near Charleston — Parking, Passes & Tips",
  description: "Which Charleston beach is best for kids, where to park with or without the Gold Pass, and what each section of Folly, Isle of Palms and Kiawah offers.",
  alternates: { canonical: "/beaches" },
};

export default function BeachesPage() {
  return (
    <>
      <PageHead title="Beaches" intro="Every beach has different sections with different parking rules. Tap a beach to see exactly how to go — with or without a pass." />
      <div className="card card-pad accent-gold" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 17 }}>🏅 The Gold Pass and beaches, in one sentence</h3>
        <p>
          The <Link href="/passes/gold-pass">Gold Pass</Link> covers parking at the three <b>county beach parks</b> only — Isle of Palms County Park, Folly Beach County Park
          (plus Lighthouse Inlet) and Kiawah Beachwalker Park. City lots, meters and street parking elsewhere on those beaches aren&apos;t included.
        </p>
      </div>
      <div className="grid">
        {beaches.map((b) => (
          <Link key={b.slug} href={`/beaches/${b.slug}`} className="card card-link pg-card">
            <CoverPhoto placeId={b.placeId} name={b.name} emoji="🏖️" height={180} />
            <div className="body">
              <div className="top">
                <h3>{b.name}</h3>
                <PassBadge pass={b.pass} plain />
              </div>
              <div className="sub">🚗 {b.driveTime}</div>
              <p style={{ margin: 0 }}>{b.short}</p>
              <div className="note" style={{ marginTop: "auto", paddingTop: 6, fontWeight: 700 }}>
                🛟 Lifeguards: {b.lifeguards}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
