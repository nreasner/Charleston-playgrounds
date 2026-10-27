/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Google key was saved in Vercel as VITE_GOOGLE_PLACES_KEY for the old site.
  // Accept either name so nothing needs to change in Vercel.
  env: {
    NEXT_PUBLIC_GOOGLE_PLACES_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || process.env.VITE_GOOGLE_PLACES_KEY || "",
  },
  async redirects() {
    return [{ source: "/playgrounds", destination: "/", permanent: true }];
  },
};
export default nextConfig;
