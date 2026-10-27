import type { Metadata } from "next";
import Link from "next/link";
import { libraries, libraryPerks } from "@/lib/data/libraries";
import { CoverPhoto } from "@/components/Photo";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Charleston Library Storytimes & Kids' Spaces",
  description: "Charleston County Public Library branches for families: storytimes, outdoor play spaces, Storytime Kits, hours and tips for each branch.",
  alternates: { canonical: "/libraries" },
};

export default function LibrariesPage() {
  return (
    <>
      <PageHead title="Libraries & storytimes" intro="Free, air-conditioned and full of books — Charleston County's libraries are a parent's best friend. Tap a branch for hours and what makes it special." />
      <div className="grid-3" style={{ marginBottom: 22 }}>
        {libraryPerks.map((p) => (
          <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="card card-pad card-link accent-green">
            <h3 style={{ fontSize: 16 }}>{p.title} ↗</h3>
            <p style={{ fontSize: 14 }}>{p.body}</p>
          </a>
        ))}
      </div>
      <div className="grid">
        {libraries.map((l) => (
          <Link key={l.slug} href={`/libraries/${l.slug}`} className="card card-link pg-card">
            <CoverPhoto placeId={l.placeId} name={l.name} emoji="📚" height={160} />
            <div className="body">
              <h3>{l.name}</h3>
              <div className="sub">📍 {l.area}</div>
              <p style={{ margin: 0 }}>{l.short}</p>
            </div>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
