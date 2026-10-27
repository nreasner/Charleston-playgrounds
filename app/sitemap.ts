import type { MetadataRoute } from "next";
import { playgrounds } from "@/lib/data/playgrounds";
import { activities } from "@/lib/data/activities";
import { beaches } from "@/lib/data/beaches";
import { libraries } from "@/lib/data/libraries";
import { passes } from "@/lib/data/passes";
import { posts } from "@/lib/data/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority });
  return [
    u("/", 1, "weekly"),
    ...["/activities", "/beaches", "/libraries", "/passes", "/community", "/blog", "/calendar", "/map"].map((p) => u(p, 0.8, "weekly")),
    ...playgrounds.map((p) => u(`/playgrounds/${p.slug}`, 0.9)),
    ...activities.map((a) => u(`/activities/${a.slug}`, 0.7)),
    ...beaches.map((b) => u(`/beaches/${b.slug}`, 0.8)),
    ...libraries.map((l) => u(`/libraries/${l.slug}`, 0.6)),
    ...passes.map((p) => u(`/passes/${p.slug}`, 0.7)),
    ...posts.map((p) => ({ ...u(`/blog/${p.slug}`, 0.7), lastModified: new Date(p.date) })),
  ];
}
