"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/types";

const fmt = (d: string) => d.replace(/-/g, "");
function gcal(e: CalendarEvent) {
  const end = new Date((e.end || e.start) + "T12:00:00");
  end.setDate(end.getDate() + 1);
  const endStr = end.toISOString().slice(0, 10).replace(/-/g, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmt(e.start)}/${endStr}`,
    details: `${e.description}\n\nVia charlestonplaygrounds.com`,
    location: e.where,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [today, setToday] = useState<string | null>(null);
  const [tag, setTag] = useState("All");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);

  const tags = useMemo(() => ["All", ...Array.from(new Set(events.flatMap((e) => e.tags)))], [events]);
  const upcoming = events
    .filter((e) => !today || (e.end || e.start) >= today)
    .filter((e) => tag === "All" || e.tags.includes(tag))
    .sort((a, b) => a.start.localeCompare(b.start));

  const byMonth = upcoming.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    const m = new Date(e.start + "T12:00:00").toLocaleString("en-US", { month: "long", year: "numeric" });
    (acc[m] ||= []).push(e);
    return acc;
  }, {});

  return (
    <>
      <div className="chips" role="group" aria-label="Filter events">
        {tags.map((t) => (
          <button key={t} className={"chip" + (tag === t ? " on" : "")} onClick={() => setTag(t)} aria-pressed={tag === t}>
            {t}
          </button>
        ))}
      </div>
      {Object.entries(byMonth).map(([month, list]) => (
        <section key={month}>
          <h2 className="month">{month}</h2>
          <div className="stack">
            {list.map((e) => {
              const d = new Date(e.start + "T12:00:00");
              return (
                <article key={e.id} className="card card-pad ev">
                  <div className="date">
                    <small>{d.toLocaleString("en-US", { month: "short" })}</small>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleString("en-US", { weekday: "short" })}</small>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17 }}>{e.title}</h3>
                    <div className="note" style={{ fontWeight: 700 }}>
                      🕐 {e.when} · 📍 {e.where}
                    </div>
                    <p style={{ fontSize: 15 }}>{e.description}</p>
                    <div className="badges" style={{ marginTop: 8, alignItems: "center" }}>
                      <span className="badge badge-green">💵 {e.cost}</span>
                      {e.tags.map((t) => (
                        <span key={t} className="badge badge-gray">{t}</span>
                      ))}
                    </div>
                    <div className="btn-row" style={{ marginTop: 10 }}>
                      {e.url &&
                        (e.url.startsWith("/") ? (
                          <Link className="btn btn-ghost btn-sm" href={e.url}>Details</Link>
                        ) : (
                          <a className="btn btn-ghost btn-sm" href={e.url} target="_blank" rel="noopener noreferrer">Details ↗</a>
                        ))}
                      <a className="btn btn-ghost btn-sm" href={gcal(e)} target="_blank" rel="noopener noreferrer">+ Google Calendar</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {upcoming.length === 0 && <div className="empty card">No upcoming events in this category — check back soon.</div>}
    </>
  );
}
