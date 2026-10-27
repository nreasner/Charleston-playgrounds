"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

const KINDS = [
  ["playground", "🛝 New playground"],
  ["update", "💡 Update or fix"],
  ["event", "📅 Event"],
  ["restaurant", "🍽️ Restaurant"],
  ["other", "💬 Something else"],
];

export function ContactForm() {
  const { user } = useStore();
  const [kind, setKind] = useState("playground");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setState("sending");
    const row = { kind, name: name || user?.name || null, email: email || user?.email || null, message: message.trim(), page: document.referrer || null };
    const sb = getSupabase();
    try {
      if (sb) {
        const { error } = await sb.from("submissions").insert(row);
        if (error) throw error;
      } else {
        const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
        if (!id) throw new Error("not configured");
        const r = await fetch(`https://formspree.io/f/${id}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(row) });
        if (!r.ok) throw new Error("failed");
      }
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent")
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>🎉</div>
        <h2 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--green-deep)" }}>Thank you!</h2>
        <p>We read every message and update the site regularly.</p>
        <button className="btn btn-ghost btn-sm" onClick={() => (setMessage(""), setState("idle"))}>Send another</button>
      </div>
    );

  return (
    <form className="card card-pad" onSubmit={submit} style={{ maxWidth: 620 }}>
      <div className="field">
        <label>What's this about?</label>
        <div className="chips wrap-chips">
          {KINDS.map(([k, l]) => (
            <button type="button" key={k} className={"chip sm" + (kind === k ? " on" : "")} onClick={() => setKind(k)} aria-pressed={kind === k}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid" style={{ gap: 12 }}>
        <div className="field">
          <label htmlFor="c-name">Name (optional)</label>
          <input id="c-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.name || ""} />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email (optional)</label>
          <input id="c-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={user?.email || ""} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" className="input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us the playground name and what we should know…" />
      </div>
      {state === "error" && <p className="alert alert-warn" style={{ marginBottom: 12 }}>Sorry — that didn't send. Please try again in a minute.</p>}
      <button className="btn" disabled={!message.trim() || state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
      <p className="note" style={{ marginTop: 10 }}>We only use your email to reply. We never share it.</p>
    </form>
  );
}
