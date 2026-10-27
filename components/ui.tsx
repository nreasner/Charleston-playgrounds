import Link from "next/link";
import type { PassKey, TagKey } from "@/lib/types";
import { PASS_LABEL, TAGS } from "@/lib/site";

export function Stars({ value, size = 15, showNumber = true }: { value: number; size?: number; showNumber?: boolean }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: value >= i - 0.25 ? "var(--star)" : value >= i - 0.75 ? "#fcd34d" : "#d6d0c4" }}>
          ★
        </span>
      ))}
      {showNumber && <span className="n">{value.toFixed(1)}</span>}
    </span>
  );
}

export function PassBadge({ pass, plain }: { pass?: PassKey; plain?: boolean }) {
  if (!pass) return null;
  const p = PASS_LABEL[pass];
  return p.href && !plain ? (
    <Link href={p.href} className={`badge ${p.cls}`}>
      {p.label}
    </Link>
  ) : (
    <span className={`badge ${p.cls}`}>{p.label}</span>
  );
}

export function TagBadges({ tags, max }: { tags: TagKey[]; max?: number }) {
  const shown = max ? tags.slice(0, max) : tags;
  return (
    <>
      {shown.map((t) => (
        <span key={t} className="badge">
          {TAGS[t].icon} {TAGS[t].label}
        </span>
      ))}
      {max && tags.length > max && <span className="badge badge-gray">+{tags.length - max}</span>}
    </>
  );
}

export function PageHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="ph">
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </header>
  );
}

export function Crumb({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="crumb">
      ← {label}
    </Link>
  );
}

export function TipCta() {
  return (
    <div className="tip-cta">
      <p className="note" style={{ marginBottom: 10 }}>Know something we should add or fix?</p>
      <Link href="/contact" className="btn btn-ghost btn-sm">📬 Send us a tip</Link>
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Tiny markdown renderer for blog posts: ## headings, - lists, [links](/x), **bold**. */
export function Markdown({ text }: { text: string }) {
  const inline = (s: string, key: string) => {
    const parts: React.ReactNode[] = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = re.exec(s))) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      if (m[1]) {
        const href = m[2];
        parts.push(
          href.startsWith("/") ? (
            <Link key={key + i} href={href}>{m[1]}</Link>
          ) : (
            <a key={key + i} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>
          )
        );
      } else if (m[3]) parts.push(<strong key={key + i}>{m[3]}</strong>);
      else if (m[4]) parts.push(<em key={key + i}>{m[4]}</em>);
      last = re.lastIndex;
      i++;
    }
    if (last < s.length) parts.push(s.slice(last));
    return parts;
  };
  // Group lines into headings, list runs and paragraphs
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flush = () => {
    const k = out.length;
    if (para.length) out.push(<p key={k}>{inline(para.join(" "), `p${k}`)}</p>);
    if (list.length)
      out.push(
        <ul key={k + "u"}>
          {list.map((l, li) => (
            <li key={li}>{inline(l, `l${k}-${li}`)}</li>
          ))}
        </ul>
      );
    para = [];
    list = [];
  };
  for (const raw of text.trim().split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) {
      flush();
      out.push(<h2 key={out.length}>{inline(line.slice(3), `h${out.length}`)}</h2>);
    } else if (line.startsWith("- ")) {
      if (para.length) flush();
      list.push(line.slice(2));
    } else {
      if (list.length) flush();
      para.push(line);
    }
  }
  flush();
  return <div className="prose">{out}</div>;
}
