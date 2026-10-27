"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSupabase, supabaseEnabled } from "./supabase";
import type { RatingKey, Ratings } from "./types";

export type ListKey = "favorite" | "bucket" | "visited";
export type MyRatings = Record<string, Partial<Ratings>>;
export type Summary = Record<string, Partial<Record<RatingKey, { avg: number; count: number }>>>;

export interface User {
  id?: string;
  email: string;
  name: string;
  optIn: boolean;
}

interface Store {
  ready: boolean;
  online: boolean; // true when connected to Supabase
  user: User | null;
  lists: Record<ListKey, string[]>;
  myRatings: MyRatings;
  summary: Summary;
  authOpen: string | null; // reason text when the sign-in modal is open
  openAuth: (reason?: string) => void;
  closeAuth: () => void;
  toggle: (list: ListKey, slug: string) => void;
  has: (list: ListKey, slug: string) => boolean;
  saveRatings: (slug: string, values: Partial<Ratings>) => Promise<void>;
  clearRatings: (slug: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, optIn: boolean) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (name: string, optIn: boolean) => Promise<void>;
}

const Ctx = createContext<Store | null>(null);
const EMPTY: Record<ListKey, string[]> = { favorite: [], bucket: [], visited: [] };

const ls = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem("cp_" + k);
      return v ? (JSON.parse(v) as T) : d;
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem("cp_" + k, JSON.stringify(v));
    } catch {}
  },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const sb = getSupabase();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lists, setLists] = useState(EMPTY);
  const [myRatings, setMyRatings] = useState<MyRatings>({});
  const [summary, setSummary] = useState<Summary>({});
  const [authOpen, setAuthOpen] = useState<string | null>(null);

  // Community averages (everyone's ratings)
  const loadSummary = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("rating_summary").select("slug, category, avg, count");
    if (!data) return;
    const s: Summary = {};
    for (const row of data as { slug: string; category: RatingKey; avg: number; count: number }[]) {
      (s[row.slug] ||= {})[row.category] = { avg: Number(row.avg), count: Number(row.count) };
    }
    setSummary(s);
  }, [sb]);

  const loadUserData = useCallback(
    async (uid: string, email: string) => {
      if (!sb) return;
      const [{ data: prof }, { data: saved }, { data: rates }] = await Promise.all([
        sb.from("profiles").select("name, email_opt_in").eq("id", uid).maybeSingle(),
        sb.from("saved").select("slug, list").eq("user_id", uid),
        sb.from("ratings").select("slug, category, value").eq("user_id", uid),
      ]);
      setUser({ id: uid, email, name: prof?.name || email.split("@")[0], optIn: Boolean(prof?.email_opt_in) });
      const l: Record<ListKey, string[]> = { favorite: [], bucket: [], visited: [] };
      for (const s of (saved || []) as { slug: string; list: ListKey }[]) l[s.list]?.push(s.slug);
      setLists(l);
      const r: MyRatings = {};
      for (const x of (rates || []) as { slug: string; category: RatingKey; value: number }[]) (r[x.slug] ||= {})[x.category] = x.value;
      setMyRatings(r);
    },
    [sb]
  );

  useEffect(() => {
    if (!sb) {
      // Local mode: everything lives in this browser
      setUser(ls.get<User | null>("user", null));
      setLists(ls.get("lists", EMPTY));
      setMyRatings(ls.get("ratings", {}));
      setReady(true);
      return;
    }
    loadSummary();
    sb.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      if (s?.user) await loadUserData(s.user.id, s.user.email || "");
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (session?.user) loadUserData(session.user.id, session.user.email || "");
      else {
        setUser(null);
        setLists(EMPTY);
        setMyRatings({});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [sb, loadSummary, loadUserData]);

  // Persist local mode; in local mode "community" is just this browser's ratings
  useEffect(() => {
    if (sb || !ready) return;
    ls.set("user", user);
    ls.set("lists", lists);
    ls.set("ratings", myRatings);
    const s: Summary = {};
    for (const [slug, vals] of Object.entries(myRatings))
      for (const [k, v] of Object.entries(vals)) if (v) (s[slug] ||= {})[k as RatingKey] = { avg: v, count: 1 };
    setSummary(s);
  }, [sb, ready, user, lists, myRatings]);

  const openAuth = useCallback((reason?: string) => setAuthOpen(reason || "Sign in to save favorites, build your bucket list and rate playgrounds."), []);
  const closeAuth = useCallback(() => setAuthOpen(null), []);

  const has = useCallback((list: ListKey, slug: string) => lists[list].includes(slug), [lists]);

  const toggle = useCallback(
    (list: ListKey, slug: string) => {
      if (!user) {
        const why = { favorite: "Sign in to save favorites.", bucket: "Sign in to build your playground bucket list.", visited: "Sign in to track the playgrounds you've visited." }[list];
        openAuth(why);
        return;
      }
      const on = lists[list].includes(slug);
      setLists((prev) => ({ ...prev, [list]: on ? prev[list].filter((s) => s !== slug) : [...prev[list], slug] }));
      if (sb && user.id) {
        if (on) sb.from("saved").delete().match({ user_id: user.id, slug, list }).then(() => {});
        else sb.from("saved").insert({ user_id: user.id, slug, list }).then(() => {});
      }
    },
    [user, lists, sb, openAuth]
  );

  const saveRatings = useCallback(
    async (slug: string, values: Partial<Ratings>) => {
      if (!user) {
        openAuth("Sign in to rate playgrounds — your ratings help other parents.");
        return;
      }
      setMyRatings((prev) => ({ ...prev, [slug]: values }));
      if (sb && user.id) {
        await sb.from("ratings").delete().match({ user_id: user.id, slug });
        const rows = Object.entries(values)
          .filter(([, v]) => v && v > 0)
          .map(([category, value]) => ({ user_id: user.id, slug, category, value }));
        if (rows.length) await sb.from("ratings").insert(rows);
        loadSummary();
      }
    },
    [user, sb, openAuth, loadSummary]
  );

  const clearRatings = useCallback(
    async (slug: string) => {
      setMyRatings((prev) => {
        const n = { ...prev };
        delete n[slug];
        return n;
      });
      if (sb && user?.id) {
        await sb.from("ratings").delete().match({ user_id: user.id, slug });
        loadSummary();
      }
    },
    [sb, user, loadSummary]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string, optIn: boolean) => {
      if (!sb) {
        setUser({ email, name, optIn });
        setAuthOpen(null);
        return null;
      }
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name, email_opt_in: optIn } } });
      if (error) return error.message;
      if (!data.session) return "CHECK_EMAIL";
      setAuthOpen(null);
      return null;
    },
    [sb]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!sb) {
        const existing = ls.get<User | null>("user", null);
        setUser(existing && existing.email === email ? existing : { email, name: email.split("@")[0], optIn: false });
        setAuthOpen(null);
        return null;
      }
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      setAuthOpen(null);
      return null;
    },
    [sb]
  );

  const signOut = useCallback(async () => {
    if (sb) await sb.auth.signOut();
    setUser(null);
    if (!sb) {
      setLists(EMPTY);
      setMyRatings({});
    }
  }, [sb]);

  const updateProfile = useCallback(
    async (name: string, optIn: boolean) => {
      setUser((u) => (u ? { ...u, name, optIn } : u));
      if (sb && user?.id) await sb.from("profiles").upsert({ id: user.id, name, email_opt_in: optIn });
    },
    [sb, user]
  );

  const value = useMemo<Store>(
    () => ({
      ready,
      online: supabaseEnabled,
      user,
      lists,
      myRatings,
      summary,
      authOpen,
      openAuth,
      closeAuth,
      toggle,
      has,
      saveRatings,
      clearRatings,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }),
    [ready, user, lists, myRatings, summary, authOpen, openAuth, closeAuth, toggle, has, saveRatings, clearRatings, signUp, signIn, signOut, updateProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

/** Editorial rating blended with community ratings. Our rating counts as 3 votes. */
export function blended(editorial: number, community?: { avg: number; count: number }) {
  const c = community && community.count > 0 ? community : null;
  if (!c) return { value: editorial, count: 0 };
  if (!editorial) return { value: c.avg, count: c.count };
  return { value: (editorial * 3 + c.avg * c.count) / (3 + c.count), count: c.count };
}
