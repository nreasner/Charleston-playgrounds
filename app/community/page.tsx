import type { Metadata } from "next";
import { creators, instagramPosts, resources } from "@/lib/data/community";
import { InstagramEmbeds } from "@/components/Instagram";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Charleston Family Community — Local Creators & Resources",
  description: "The Charleston parents and creators we follow for playground finds, family outings and weekend ideas, plus local family resources.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  return (
    <>
      <PageHead title="Community" intro="The local parents and creators we follow for family ideas around the Lowcountry." />
      <div className="grid">
        {creators.map((c) => (
          <a key={c.handle} href={`https://www.instagram.com/${c.handle}/`} target="_blank" rel="noopener noreferrer" className="card card-pad card-link" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div className="avatar">
              <div style={{ background: c.color }}>{c.initials}</div>
            </div>
            <div>
              <h3 style={{ fontSize: 17 }}>{c.name}</h3>
              <div style={{ color: "var(--coral)", fontWeight: 800, fontSize: 14 }}>@{c.handle}</div>
              <div className="note">{c.blurb}</div>
            </div>
          </a>
        ))}
      </div>

      {instagramPosts.length > 0 && (
        <>
          <h2 className="section-title">From their feeds</h2>
          <InstagramEmbeds urls={instagramPosts} />
        </>
      )}

      <h2 className="section-title">Local resources</h2>
      <div className="grid-3">
        {resources.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="card card-pad card-link">
            <h3 style={{ fontSize: 16 }}>{r.name} ↗</h3>
            <p style={{ fontSize: 14 }}>{r.blurb}</p>
          </a>
        ))}
      </div>
      <TipCta />
    </>
  );
}
