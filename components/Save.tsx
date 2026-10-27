"use client";
import { useStore } from "@/lib/store";

/** Heart + bucket list, always visible. Logged-out clicks open the sign-in prompt. */
export function SaveIcons({ slug, name }: { slug: string; name: string }) {
  const { has, toggle } = useStore();
  const fav = has("favorite", slug);
  const bucket = has("bucket", slug);
  return (
    <div className="save-btns">
      <button
        className={"icon-btn" + (fav ? " on" : "")}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        title={fav ? "Favorited" : "Favorite"}
        onClick={(e) => (e.preventDefault(), toggle("favorite", slug))}
      >
        {fav ? "❤️" : "🤍"}
      </button>
      <button
        className={"icon-btn" + (bucket ? " on" : "")}
        aria-pressed={bucket}
        aria-label={bucket ? `Remove ${name} from bucket list` : `Add ${name} to bucket list`}
        title={bucket ? "On your bucket list" : "Add to bucket list"}
        onClick={(e) => (e.preventDefault(), toggle("bucket", slug))}
        style={bucket ? { background: "#dbeafe" } : undefined}
      >
        🪣
      </button>
    </div>
  );
}

export function SaveButtons({ slug }: { slug: string }) {
  const { has, toggle } = useStore();
  const b = (list: "favorite" | "bucket" | "visited", on: string, off: string, color: string) => {
    const active = has(list, slug);
    return (
      <button
        className="btn btn-ghost btn-sm"
        aria-pressed={active}
        onClick={() => toggle(list, slug)}
        style={active ? { background: color, borderColor: "transparent" } : undefined}
      >
        {active ? on : off}
      </button>
    );
  };
  return (
    <div className="btn-row">
      {b("favorite", "❤️ Favorited", "🤍 Favorite", "#fee2e2")}
      {b("bucket", "🪣 On my bucket list", "🪣 Bucket list", "#dbeafe")}
      {b("visited", "✅ Visited", "☐ Mark visited", "#d1fae5")}
    </div>
  );
}
