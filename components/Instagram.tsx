"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/** Official Instagram post embeds. Add post links in lib/data/community.ts. */
export function InstagramEmbeds({ urls }: { urls: string[] }) {
  useEffect(() => {
    if (window.instgrm) return window.instgrm.Embeds.process();
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, [urls]);
  return (
    <div className="grid" style={{ alignItems: "start" }}>
      {urls.map((u) => (
        <blockquote key={u} className="instagram-media" data-instgrm-permalink={u} data-instgrm-version="14" style={{ margin: 0, width: "100%", minWidth: 0, maxWidth: "100%" }}>
          <a href={u} target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
        </blockquote>
      ))}
    </div>
  );
}
