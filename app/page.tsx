import { Suspense } from "react";
import Link from "next/link";
import { playgrounds } from "@/lib/data/playgrounds";
import { posts } from "@/lib/data/posts";
import { PlaygroundBrowser } from "@/components/Playgrounds";
import { JsonLd, TipCta } from "@/components/ui";
import { SITE } from "@/lib/site";

export default function Home() {
  const featured = posts.slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Playgrounds in Charleston, SC",
          itemListElement: playgrounds.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/playgrounds/${p.slug}`, name: p.name })),
        }}
      />
      <div className="intro">
        <h1>Find the perfect playground in Charleston.</h1>
        <p className="note" style={{ maxWidth: 340, margin: 0, fontSize: 15 }}>
          Shade, fencing, restrooms, bugs and the nearest kid-friendly lunch — rated by local parents.
        </p>
      </div>
      <Suspense fallback={<div className="photo-shimmer" style={{ height: 300, borderRadius: 18 }} />}>
        <PlaygroundBrowser all={playgrounds} />
      </Suspense>

      <h2 className="section-title">Tips &amp; guides</h2>
      <div className="grid-3">
        {featured.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-pad card-link">
            <div style={{ fontSize: 30 }}>{p.emoji}</div>
            <h3 style={{ fontSize: 16, marginTop: 6 }}>{p.title}</h3>
            <p style={{ fontSize: 14 }}>{p.description}</p>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
