import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/data/posts";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tips & Guides for Charleston Families",
  description: "Top 10 playgrounds, shaded and fenced playgrounds, tips for locals and visitors, holiday guides, family restaurants and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const cats = Array.from(new Set(posts.map((p) => p.category)));
  return (
    <>
      <PageHead title="Tips & guides" intro="Everything we've learned taking a toddler to every playground in Charleston." />
      {cats.map((c) => (
        <section key={c}>
          <h2 className="section-title">{c}</h2>
          <div className="grid">
            {posts
              .filter((p) => p.category === c)
              .map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-pad card-link" style={{ display: "flex", gap: 14 }}>
                  <div style={{ fontSize: 34, lineHeight: 1 }}>{p.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: 17 }}>{p.title}</h3>
                    <p style={{ fontSize: 14 }}>{p.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
      <TipCta />
    </>
  );
}
