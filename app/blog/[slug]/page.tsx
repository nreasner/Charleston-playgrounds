import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postBySlug, posts } from "@/lib/data/posts";
import { Crumb, JsonLd, Markdown, TipCta } from "@/components/ui";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.description } };
}

export default async function PostPage({ params }: Props) {
  const p = postBySlug((await params).slug);
  if (!p) notFound();
  const more = posts.filter((x) => x.slug !== p.slug && x.category === p.category).concat(posts.filter((x) => x.category !== p.category)).slice(0, 2);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          url: `${SITE.url}/blog/${p.slug}`,
          author: { "@type": "Organization", name: SITE.name },
        }}
      />
      <Crumb href="/blog" label="All tips & guides" />
      <article className="card card-pad" style={{ padding: "28px clamp(18px, 4vw, 40px)" }}>
        <div style={{ fontSize: 44 }}>{p.emoji}</div>
        <span className="badge badge-green">{p.category}</span>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: "clamp(28px, 4vw, 38px)", color: "var(--green-deep)", margin: "10px 0 8px" }}>{p.title}</h1>
        <p className="note" style={{ fontSize: 16, marginBottom: 22 }}>{p.description}</p>
        <Markdown text={p.body} />
      </article>
      <h2 className="section-title">Keep reading</h2>
      <div className="grid">
        {more.map((m) => (
          <Link key={m.slug} href={`/blog/${m.slug}`} className="card card-pad card-link" style={{ display: "flex", gap: 14 }}>
            <div style={{ fontSize: 30 }}>{m.emoji}</div>
            <div>
              <h3 style={{ fontSize: 16 }}>{m.title}</h3>
              <p style={{ fontSize: 14 }}>{m.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <TipCta />
    </>
  );
}
