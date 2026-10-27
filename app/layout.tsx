import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Footer, Header, Tabs } from "@/components/Chrome";
import { AuthModal } from "@/components/Auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Charleston Playgrounds — Every Playground Rated & Reviewed", template: "%s | Charleston Playgrounds" },
  description:
    "Every playground in Charleston, SC rated by parents for shade, fencing, bugs and nearby food — plus beaches, activities, passes, library storytimes and a family events calendar.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US" },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛝</text></svg>",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2d6a4f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <Tabs />
          <main className="wrap page">{children}</main>
          <Footer />
          <AuthModal />
        </StoreProvider>
      </body>
    </html>
  );
}
