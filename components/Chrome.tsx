"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MENU, NAV, SITE } from "@/lib/site";
import { useStore } from "@/lib/store";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, openAuth, signOut } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="wordmark">
          <strong>{SITE.name}</strong>
          <span>Rated &amp; reviewed by Lowcountry parents</span>
        </Link>
        <div ref={ref} style={{ position: "relative" }}>
          <button className="hamburger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
            {user && !open && <span className="dot" />}
          </button>
          {open && (
            <nav className="menu-panel" aria-label="Menu">
              {user ? (
                <div className="who">
                  <b>Hi, {user.name}!</b>
                  {user.email}
                </div>
              ) : (
                <button onClick={() => (setOpen(false), openAuth())}>
                  <span>🔑</span> Sign in / Join
                </button>
              )}
              {MENU.map((m) => (
                <Link key={m.href} href={m.href}>
                  <span>{m.icon}</span> {m.label}
                </Link>
              ))}
              {user && (
                <button onClick={() => (setOpen(false), signOut())}>
                  <span>👋</span> Sign out
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export function Tabs() {
  const path = usePathname() || "/";
  const active = (href: string) =>
    href === "/" ? path === "/" || path.startsWith("/playgrounds") : path === href || path.startsWith(href + "/");
  return (
    <nav className="tabs" aria-label="Sections">
      <div className="wrap">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={active(n.href) ? "on" : ""} aria-current={active(n.href) ? "page" : undefined}>
            {n.icon} {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <strong>{SITE.name}</strong>
        <div>{SITE.origin}</div>
        <nav>
          <Link href="/blog">Tips &amp; guides</Link>
          <Link href="/map">Map</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/passes">Passes</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
