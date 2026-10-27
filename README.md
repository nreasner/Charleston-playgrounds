# Charleston Playgrounds

charlestonplaygrounds.com — every playground in the Lowcountry, rated by parents. Built with Next.js; every page has its own address and is pre-rendered so Google can index it.

## Where things live

| To change… | Edit |
|---|---|
| Playgrounds (descriptions, ratings, tips, restaurants) | `lib/data/playgrounds.ts` |
| Beaches (sections, parking, with/without pass) | `lib/data/beaches.ts` |
| Activities (hours, prices, Pack schedule) | `lib/data/activities.ts` |
| Libraries | `lib/data/libraries.ts` |
| Passes | `lib/data/passes.ts` |
| Calendar events | `lib/data/events.ts` |
| Blog posts | `lib/data/posts.ts` |
| Instagram posts on Community | `lib/data/community.ts` → `instagramPosts` |

Push to `main` and Vercel redeploys automatically.

## Settings (Vercel → Project → Settings → Environment Variables)

| Name | What it does |
|---|---|
| `VITE_GOOGLE_PLACES_KEY` (already set) or `NEXT_PUBLIC_GOOGLE_PLACES_KEY` | Real photos from Google Maps |
| `NEXT_PUBLIC_SUPABASE_URL` | Turns on accounts, saved lists across devices, community ratings, contact form inbox |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same — the public "anon" key from Supabase → Project Settings → API |

Without Supabase the site still works: favorites and ratings save in each visitor's browser.

## One-time Supabase setup
1. supabase.com → New project (free).
2. SQL Editor → New query → paste `supabase/schema.sql` → Run.
3. Project Settings → API → copy the URL and anon key into the two Vercel variables above, then redeploy.
4. Authentication → URL Configuration → set Site URL to `https://www.charlestonplaygrounds.com`.

Contact-form messages appear in Supabase → Table Editor → `submissions`.
