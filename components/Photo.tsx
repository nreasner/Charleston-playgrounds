"use client";
import { useEffect, useRef, useState } from "react";
import { usePlacePhotos, type PlacePhoto } from "@/lib/photos";
import { placePhotosLink } from "@/lib/site";

function hueFor(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "300px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/** A single cover photo from Google Places, loaded only when it scrolls into view. */
export function CoverPhoto({ placeId, name, emoji = "🛝", height = 190 }: { placeId?: string; name: string; emoji?: string; height?: number }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const photos = usePlacePhotos(seen ? placeId : undefined);
  const h = hueFor(name);
  const src = photos?.[0]?.url;
  if (src)
    return <div ref={ref} className="photo" role="img" aria-label={`Photo of ${name}`} style={{ height, backgroundImage: `url("${src}")` }} />;
  if (seen && photos === null) return <div ref={ref} className="photo photo-shimmer" style={{ height }} />;
  return (
    <div
      ref={ref}
      className="photo photo-ph"
      style={{ height, ["--h1" as string]: `hsl(${h},45%,85%)`, ["--h2" as string]: `hsl(${(h + 40) % 360},38%,76%)` }}
    >
      <span aria-hidden>{emoji}</span>
    </div>
  );
}

/** Hero photo + thumbnail gallery with a lightbox, for detail pages. */
export function PhotoGallery({ placeId, name, emoji = "🛝" }: { placeId: string; name: string; emoji?: string }) {
  const photos = usePlacePhotos(placeId);
  const [open, setOpen] = useState<number | null>(null);
  const list: PlacePhoto[] = photos || [];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  const h = hueFor(name);
  return (
    <div id="photos">
      <div className="hero-photo">
        {list[0] ? (
          <button onClick={() => setOpen(0)} style={{ border: 0, padding: 0, width: "100%", display: "block" }} aria-label="Open photo gallery">
            <div className="photo" style={{ height: "min(52vw, 380px)", backgroundImage: `url("${list[0].url}")` }} />
          </button>
        ) : photos === null ? (
          <div className="photo photo-shimmer" style={{ height: "min(52vw, 380px)" }} />
        ) : (
          <div
            className="photo photo-ph"
            style={{ height: "min(52vw, 340px)", ["--h1" as string]: `hsl(${h},45%,85%)`, ["--h2" as string]: `hsl(${(h + 40) % 360},38%,76%)` }}
          >
            <span style={{ fontSize: 80 }}>{emoji}</span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="gallery" style={{ marginTop: 8 }}>
          {list.slice(1, 9).map((p, i) => (
            <button key={i} onClick={() => setOpen(i + 1)} aria-label={`Photo ${i + 2} of ${name}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <p className="note" style={{ marginTop: 8 }}>
        {list.length ? "Photos via Google Maps. " : ""}
        <a href={placePhotosLink(placeId, name)} target="_blank" rel="noopener noreferrer">
          See all photos on Google Maps ↗
        </a>
      </p>

      {open !== null && list[open] && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-label={`${name} photos`}>
          <div className="lb-bar">
            <button className="icon-btn" onClick={() => setOpen(null)} aria-label="Close">✕</button>
          </div>
          {list.length > 1 && (
            <>
              <button className="icon-btn lb-nav lb-prev" onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + list.length) % list.length))} aria-label="Previous">‹</button>
              <button className="icon-btn lb-nav lb-next" onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % list.length))} aria-label="Next">›</button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={list[open].url} alt={`${name} photo ${open + 1}`} />
            <div className="lb-credit">
              {open + 1} / {list.length}
              {list[open].credit && (
                <>
                  {" · Photo: "}
                  {list[open].creditUrl ? (
                    <a href={list[open].creditUrl} target="_blank" rel="noopener noreferrer">{list[open].credit}</a>
                  ) : (
                    list[open].credit
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
