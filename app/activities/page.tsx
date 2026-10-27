import type { Metadata } from "next";
import Link from "next/link";
import { activities } from "@/lib/data/activities";
import { CoverPhoto } from "@/components/Photo";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Things to Do With Kids in Charleston",
  description: "Kid-tested Charleston activities with hours, prices and parent tips: the Aquarium, Children's Museum, Pack Athletics open gym, carriage rides, waterparks and more.",
  alternates: { canonical: "/activities" },
};

export default function ActivitiesPage() {
  return (
    <>
      <PageHead title="Things to do with kids" intro="Hours, prices, how long to plan for, and the tips we wish we'd known. Tap any activity for the full details." />
      <div className="grid">
        {activities.map((a) => (
          <Link key={a.slug} href={`/activities/${a.slug}`} className="card card-link pg-card">
            <CoverPhoto placeId={a.placeId} name={a.name} emoji="🎪" height={170} />
            <div className="body">
              <span className="badge badge-coral" style={{ alignSelf: "flex-start" }}>{a.category}</span>
              <h3>{a.name}</h3>
              <p style={{ margin: 0 }}>{a.short}</p>
              <div className="note" style={{ marginTop: "auto", paddingTop: 6, fontWeight: 700 }}>
                👧 {a.ages} · ⏱ {a.timeNeeded}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
