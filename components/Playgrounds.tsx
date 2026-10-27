"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Playground, RatingKey, Ratings, TagKey } from "@/lib/types";
import { AREAS, RATING_KEYS, TAGS } from "@/lib/site";
import { blended, useStore } from "@/lib/store";
import { CoverPhoto } from "./Photo";
import { SaveIcons } from "./Save";
import { PassBadge, Stars, TagBadges } from "./ui";

function useScore(p: Playground, key: RatingKey) {
  const { summary } = useStore();
  return blended(p.ratings[key], summary[p.slug]?.[key]);
}

export function PlaygroundCard({ p }: { p: Playground }) {
  const { value, count } = useScore(p, "overall");
  return (
    <article className="card pg-card">
      <div className="photo-wrap">
        <Link href={`/playgrounds/${p.slug}#photos`} aria-label={`${p.name} photos`}>
          <CoverPhoto placeId={p.placeId} name={p.name} />
        </Link>
        <SaveIcons slug={p.slug} name={p.name} />
      </div>
      <div className="body">
        <h3>
          <Link href={`/playgrounds/${p.slug}`}>{p.name}</Link>
        </h3>
        <div className="sub">📍 {p.area}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {value > 0 ? <Stars value={value} /> : <span className="badge badge-new">New — be the first to rate</span>}
          {count > 0 && <span className="note">· {count} parent rating{count === 1 ? "" : "s"}</span>}
        </div>
        <p style={{ margin: 0 }}>{p.short}</p>
        <div className="badges" style={{ marginTop: "auto", paddingTop: 6 }}>
          <PassBadge pass={p.pass} />
          <TagBadges tags={p.tags} max={p.pass ? 2 : 3} />
        </div>
      </div>
    </article>
  );
}

export function PlaygroundBrowser({ all }: { all: Playground[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const { summary } = useStore();
  const [q, setQ] = useState(params.get("q") || "");
  const area = params.get("area") || "All";
  const tags = (params.get("tags") || "").split(",").filter(Boolean) as TagKey[];
  const sort = (params.get("sort") || "overall") as RatingKey;

  const setParam = (k: string, v: string | null) => {
    const n = new URLSearchParams(params.toString());
    if (v && v !== "All") n.set(k, v);
    else n.delete(k);
    router.replace(n.toString() ? `/?${n}` : "/", { scroll: false });
  };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const score = (p: Playground) => blended(p.ratings[sort], summary[p.slug]?.[sort]).value;
    return all
      .filter((p) => area === "All" || p.area === area)
      .filter((p) => tags.every((t) => p.tags.includes(t)))
      .filter((p) => !s || [p.name, p.area, p.short, p.address, ...p.description].join(" ").toLowerCase().includes(s))
      .sort((a, b) => score(b) - score(a));
  }, [all, area, tags, q, sort, summary]);

  return (
    <>
      <input
        className="input search"
        type="search"
        placeholder={`Search ${all.length} playgrounds…`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onBlur={() => setParam("q", q.trim() || null)}
        aria-label="Search playgrounds"
      />
      <div className="chips" style={{ marginTop: 14 }} role="group" aria-label="Area">
        {["All", ...AREAS].map((a) => (
          <button key={a} className={"chip" + (area === a ? " on" : "")} onClick={() => setParam("area", a)} aria-pressed={area === a}>
            {a}
          </button>
        ))}
      </div>
      <div className="chips wrap-chips feature-chips" style={{ marginTop: 10 }} role="group" aria-label="Features">
        {(Object.keys(TAGS) as TagKey[]).map((t) => {
          const on = tags.includes(t);
          return (
            <button
              key={t}
              className={"chip sm soft" + (on ? " on" : "")}
              aria-pressed={on}
              onClick={() => setParam("tags", (on ? tags.filter((x) => x !== t) : [...tags, t]).join(",") || null)}
            >
              {TAGS[t].icon} {TAGS[t].label}
            </button>
          );
        })}
      </div>
      <div className="toolbar">
        <label className="note" style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
          Sort by
          <select className="input" style={{ width: "auto", padding: "8px 12px" }} value={sort} onChange={(e) => setParam("sort", e.target.value === "overall" ? null : e.target.value)}>
            {RATING_KEYS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.icon} {r.label}
              </option>
            ))}
          </select>
        </label>
        {(area !== "All" || tags.length > 0 || q) && (
          <button className="btn btn-ghost btn-sm" onClick={() => (setQ(""), router.replace("/", { scroll: false }))}>
            Clear filters
          </button>
        )}
      </div>
      {list.length ? (
        <div className="grid">
          {list.map((p) => (
            <PlaygroundCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="empty card">
          <div style={{ fontSize: 40 }}>🔍</div>
          <p>No playgrounds match those filters. Try removing one.</p>
        </div>
      )}
    </>
  );
}

/** Ratings grid that blends our ratings with everyone else's. */
export function RatingsGrid({ p }: { p: Playground }) {
  const { summary } = useStore();
  const overall = blended(p.ratings.overall, summary[p.slug]?.overall);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        {overall.value > 0 ? <Stars value={overall.value} size={22} /> : <span className="badge badge-new">No ratings yet</span>}
        <span className="note">
          {overall.count > 0
            ? `Our rating blended with ${overall.count} parent rating${overall.count === 1 ? "" : "s"}`
            : p.ratings.overall
              ? "Our rating — add yours below"
              : "Be the first to rate it below"}
        </span>
      </div>
      <div className="rating-grid">
        {RATING_KEYS.filter((r) => r.key !== "overall").map((r) => {
          const v = blended(p.ratings[r.key], summary[p.slug]?.[r.key]).value;
          return (
            <div key={r.key} className="rating-row">
              <span>
                {r.icon} {r.label}
              </span>
              {v > 0 ? <Stars value={v} size={13} /> : <span className="note">—</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Rate a playground with explicit Save and Clear buttons. */
export function RatePanel({ slug }: { slug: string }) {
  const { myRatings, saveRatings, clearRatings, user, openAuth } = useStore();
  const saved = myRatings[slug] || {};
  const [draft, setDraft] = useState<Partial<Ratings> | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const values = draft ?? saved;
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved);
  const hasAny = Object.values(values).some((v) => v && v > 0);

  const set = (k: RatingKey, n: number) => {
    if (!user) return openAuth("Sign in to rate playgrounds — your ratings help other parents.");
    setStatus(null);
    setDraft({ ...values, [k]: values[k] === n ? 0 : n });
  };

  return (
    <div className="card card-pad" style={{ background: "#fff8f0" }}>
      <h3 style={{ fontSize: 17 }}>⭐ Your rating</h3>
      <p className="note" style={{ margin: "4px 0 12px" }}>Tap the stars, then save. Your ratings are blended into the scores everyone sees.</p>
      <div className="rating-grid">
        {RATING_KEYS.map((r) => (
          <div key={r.key} className="rating-row" style={{ background: "#fff" }}>
            <span>
              {r.icon} {r.label}
            </span>
            <span className="rate-stars" role="radiogroup" aria-label={r.label}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className={(values[r.key] || 0) >= n ? "on" : ""} onClick={() => set(r.key, n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} role="radio" aria-checked={values[r.key] === n}>
                  ★
                </button>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="btn-row" style={{ marginTop: 14, alignItems: "center" }}>
        <button
          className="btn btn-green btn-sm"
          disabled={!dirty || !hasAny}
          onClick={async () => {
            await saveRatings(slug, values);
            setDraft(null);
            setStatus("Saved — thanks for rating!");
          }}
        >
          Save ratings
        </button>
        <button
          className="btn btn-ghost btn-sm"
          disabled={!hasAny}
          onClick={async () => {
            setDraft(null);
            await clearRatings(slug);
            setStatus("Your ratings were cleared.");
          }}
        >
          Clear
        </button>
        {status && <span className="note" style={{ fontWeight: 700, color: "var(--green)" }}>{status}</span>}
        {dirty && !status && <span className="note">Unsaved changes</span>}
      </div>
    </div>
  );
}
