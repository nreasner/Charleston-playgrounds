import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us — Send a Tip",
  description: "Tell us about a playground we're missing, a fix, a family event or a kid-friendly restaurant.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHead title="Contact us" intro="Found a playground we're missing, a detail that's changed, or an event families should know about? Tell us." />
      <ContactForm />
    </>
  );
}
