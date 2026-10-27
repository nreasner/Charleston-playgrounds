import type { Metadata } from "next";
import { ProfileView } from "@/components/Profile";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "My Profile", robots: { index: false } };

export default function ProfilePage() {
  return (
    <>
      <PageHead title="My playgrounds" intro="Your favorites, bucket list, visits and ratings in one place." />
      <ProfileView />
    </>
  );
}
