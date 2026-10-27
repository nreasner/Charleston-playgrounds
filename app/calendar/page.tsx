import type { Metadata } from "next";
import Link from "next/link";
import { events, recurring } from "@/lib/data/events";
import { CalendarView } from "@/components/CalendarView";
import { PageHead, TipCta } from "@/components/ui";

export const metadata: Metadata = {
  title: "Charleston Family Events Calendar",
  description: "Kid-friendly events around Charleston: Holiday Festival of Lights, Christmas parades, SEWE, the Teddy Bear Picnic, Easter egg hunts and weekly toddler programs.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarPage() {
  return (
    <>
      <PageHead title="Family events calendar" intro="Hand-picked, kid-friendly events around Charleston. Dates come from organizers and can change — always confirm before you go." />
      <h2 className="section-title" style={{ marginTop: 0 }}>Every week</h2>
      <div className="grid" style={{ marginBottom: 8 }}>
        {recurring.map((r) => (
          <Link key={r.title} href={r.href} className="card card-pad card-link">
            <h3 style={{ fontSize: 16 }}>{r.title}</h3>
            <p style={{ fontSize: 14 }}>
              🕐 {r.when} · 💵 {r.cost}
            </p>
          </Link>
        ))}
      </div>
      <CalendarView events={events} />
      <p className="note" style={{ marginTop: 24 }}>
        Know about an event we should add? <Link href="/contact">Tell us</Link>.
      </p>
      <TipCta />
    </>
  );
}
