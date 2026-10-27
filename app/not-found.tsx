import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty card" style={{ padding: "60px 20px" }}>
      <div style={{ fontSize: 54 }}>🛝</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--green-deep)" }}>This page went down the slide.</h1>
      <p>We couldn&apos;t find that page. Let&apos;s get you back to the playgrounds.</p>
      <Link href="/" className="btn" style={{ marginTop: 12 }}>See all playgrounds</Link>
    </div>
  );
}
