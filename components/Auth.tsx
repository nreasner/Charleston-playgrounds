"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";

export function AuthForm({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const { signIn, signUp, online } = useStore();
  const [mode, setMode] = useState<"join" | "signin">("join");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const validEmail = /\S+@\S+\.\S+/.test(email);
  const validPw = !online || password.length >= 6;
  const canSubmit = validEmail && validPw && (mode === "signin" || name.trim().length > 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setMsg(null);
    const err = mode === "join" ? await signUp(name.trim(), email.trim(), password, optIn) : await signIn(email.trim(), password);
    setBusy(false);
    if (err === "CHECK_EMAIL") setMsg({ kind: "ok", text: "Almost there! Check your email for a confirmation link, then come back and sign in." });
    else if (err) setMsg({ kind: "err", text: err });
    else onDone?.();
  }

  return (
    <form onSubmit={submit}>
      <div className="tabset" role="tablist">
        <button type="button" className={mode === "join" ? "on" : ""} onClick={() => setMode("join")}>Join free</button>
        <button type="button" className={mode === "signin" ? "on" : ""} onClick={() => setMode("signin")}>Sign in</button>
      </div>
      {mode === "join" && (
        <div className="field">
          <label htmlFor="a-name">First name</label>
          <input id="a-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
        </div>
      )}
      <div className="field">
        <label htmlFor="a-email">Email</label>
        <input id="a-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      {online && (
        <div className="field">
          <label htmlFor="a-pw">Password</label>
          <input
            id="a-pw"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "join" ? "new-password" : "current-password"}
            placeholder={mode === "join" ? "At least 6 characters" : ""}
          />
        </div>
      )}
      {mode === "join" && (
        <label className="check" style={{ marginBottom: 16 }}>
          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
          <span>Send me the occasional email about new playgrounds and events. No spam, unsubscribe anytime.</span>
        </label>
      )}
      {msg && (
        <p className={msg.kind === "ok" ? "alert" : "alert alert-warn"} style={{ marginBottom: 14 }}>
          {msg.text}
        </p>
      )}
      <button className="btn" style={{ width: "100%" }} disabled={!canSubmit || busy}>
        {busy ? "One sec…" : mode === "join" ? "Create my free account" : "Sign in"}
      </button>
      {!compact && (
        <p className="note" style={{ marginTop: 12, textAlign: "center" }}>
          We only use your email for your account{optIn && mode === "join" ? " and the occasional update" : ""}. We never share it.
        </p>
      )}
    </form>
  );
}

export function AuthModal() {
  const { authOpen, closeAuth } = useStore();
  if (!authOpen) return null;
  return (
    <div className="overlay" onClick={closeAuth}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h2 id="auth-title">Join the fun</h2>
          <button className="icon-btn" style={{ width: 34, height: 34, fontSize: 15, boxShadow: "none", background: "#f0ebe1" }} onClick={closeAuth} aria-label="Close">✕</button>
        </div>
        <p className="note" style={{ marginTop: 6, fontSize: 15 }}>{authOpen}</p>
        <AuthForm onDone={closeAuth} />
        <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 8, border: 0 }} onClick={closeAuth}>
          Just browsing
        </button>
      </div>
    </div>
  );
}
