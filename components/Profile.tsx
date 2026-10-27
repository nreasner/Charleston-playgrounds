"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { playgrounds } from "@/lib/data/playgrounds";
import { useStore, type ListKey } from "@/lib/store";
import { AuthForm } from "./Auth";
import { PlaygroundCard } from "./Playgrounds";
import { Stars } from "./ui";

export function ProfileView() {
  const { ready, user, lists, myRatings, updateProfile, signOut, online } = useStore();
  const [name, setName] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<ListKey>("favorite");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setOptIn(user.optIn);
    }
  }, [user]);

  if (!ready) return <div className="photo-shimmer" style={{ height: 240, borderRadius: 18 }} />;

  if (!user)
    return (
      <div className="card card-pad" style={{ maxWidth: 460 }}>
        <h2 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--green-deep)", fontSize: 24 }}>Sign in or join free</h2>
        <p className="note">Save favorites, build a playground bucket list, track visits and rate playgrounds.</p>
        <AuthForm compact />
      </div>
    );

  const bucket = lists.bucket;
  const doneOfBucket = bucket.filter((s) => lists.visited.includes(s)).length;
  const pct = bucket.length ? Math.round((doneOfBucket / bucket.length) * 100) : 0;
  const allPct = Math.round((lists.visited.length / playgrounds.length) * 100);
  const shown = playgrounds.filter((p) => lists[tab].includes(p.slug));
  const rated = playgrounds.filter((p) => myRatings[p.slug] && Object.values(myRatings[p.slug]).some(Boolean));

  return (
    <>
      <div className="stats">
        {[
          ["❤️", lists.favorite.length, "Favorites"],
          ["🪣", bucket.length, "Bucket list"],
          ["✅", lists.visited.length, "Visited"],
          ["⭐", rated.length, "Rated"],
        ].map(([i, n, l]) => (
          <div key={l as string} className="stat">
            <div style={{ fontSize: 22 }}>{i}</div>
            <b>{n}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>

      <div className="card card-pad" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 8 }}>
          <span>🛝 Every playground in Charleston</span>
          <span>
            {lists.visited.length} / {playgrounds.length} ({allPct}%)
          </span>
        </div>
        <div className="progress"><div style={{ width: `${allPct}%` }} /></div>
        {bucket.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, margin: "14px 0 8px" }}>
              <span>🪣 Bucket list progress</span>
              <span>{pct}%</span>
            </div>
            <div className="progress"><div style={{ width: `${pct}%` }} /></div>
          </>
        )}
      </div>

      <div className="chips" style={{ margin: "22px 0 14px" }}>
        {([
          ["favorite", "❤️ Favorites"],
          ["bucket", "🪣 Bucket list"],
          ["visited", "✅ Visited"],
        ] as [ListKey, string][]).map(([k, l]) => (
          <button key={k} className={"chip" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
            {l} ({lists[k].length})
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="grid">
          {shown.map((p) => (
            <PlaygroundCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="empty card">
          Nothing here yet. <Link href="/">Browse playgrounds</Link> and tap 🤍 or 🪣.
        </div>
      )}

      {rated.length > 0 && (
        <>
          <h2 className="section-title">Your ratings</h2>
          <div className="stack">
            {rated.map((p) => (
              <Link key={p.slug} href={`/playgrounds/${p.slug}`} className="card card-pad card-link" style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <b>{p.name}</b>
                {myRatings[p.slug].overall ? <Stars value={myRatings[p.slug].overall!} /> : <span className="note">Rated (no overall)</span>}
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Your profile</h2>
      <form
        className="card card-pad"
        style={{ maxWidth: 520 }}
        onSubmit={async (e) => {
          e.preventDefault();
          await updateProfile(name.trim() || user.name, optIn);
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
      >
        <div className="field">
          <label htmlFor="p-name">Name</label>
          <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input className="input" value={user.email} disabled />
        </div>
        <label className="check" style={{ marginBottom: 16 }}>
          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
          <span>Email me about new playgrounds and family events (occasional, unsubscribe anytime).</span>
        </label>
        <div className="btn-row" style={{ alignItems: "center" }}>
          <button className="btn btn-green btn-sm">Save profile</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
          {saved && <span className="note" style={{ fontWeight: 800, color: "var(--green)" }}>Saved!</span>}
        </div>
        {!online && <p className="note" style={{ marginTop: 12 }}>Your lists are saved in this browser.</p>}
      </form>
    </>
  );
}
