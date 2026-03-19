# NUUN Creative Lab — Game v1

Interactive lab scene and marketing website for NUUN Creative. Built with Next.js 14+, Framer Motion, and Tailwind CSS. Deployed on Cloudflare Pages.

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL including protocol, e.g. `https://nuun.dev` |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). Analytics are disabled if unset. |
| `NEXT_PUBLIC_GHL_BOOKING_URL` | No | GoHighLevel scheduling form URL. All "Join the Revolution" CTAs fall back to `/contact` if unset. |

---

## Deploying to Cloudflare Pages

### First-time setup

1. Push the repo to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo.
4. Set the build configuration:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
5. Add environment variables under **Settings → Environment Variables** (use the table above).
6. Click **Save and Deploy**.

Cloudflare will build and deploy on every push to `main`.

### Manual build (local preview)

```bash
npm run pages:build
# Preview locally with wrangler:
npx wrangler pages dev .vercel/output/static
```

### Notes

- `@cloudflare/next-on-pages` adapts the Next.js build for the Cloudflare edge runtime. It is listed as a devDependency.
- `wrangler.toml` at the project root configures the Pages project name (`nuun-lab`).
- The Next.js App Router is fully supported. Server Components, route handlers, and middleware all run on the Cloudflare edge.

---

## Route map

| Route | Description |
|---|---|
| `/` | Interactive lab scene (the game) |
| `/manifesto` | Full editorial manifesto |
| `/concepts` | Concept gallery overview |
| `/concepts/showroom` | The Showroom concept page |
| `/concepts/studio-world` | Studio World concept page |
| `/concepts/system-made-intuitive` | System Made Intuitive concept page |
| `/concepts/playground` | The Playground concept page |
| `/concepts/product-universe` | Product Universe concept page |
| `/concepts/conversion-journey` | Conversion Journey concept page |
| `/contact` | Contact / booking page |
| `/privacy` | Privacy policy |

---

## Analytics

Analytics are handled through `src/lib/analytics.ts`. All events are fired via `LabEvents.*` named helpers — no direct `gtag()` calls in components.

In dev mode, events are logged to the console. In production, they fire `window.gtag('event', ...)` when `NEXT_PUBLIC_GA_ID` is set.

Key events:
- `hotspot_click` — user clicks an interactive hotspot
- `modal_open` / `modal_close` — panel or cassette/robot modal opens or closes
- `cta_click` — any "Join the Revolution" CTA fired
- `concept_click` — user clicks a concept tile in the gallery panel
- `cassette_play` / `cassette_pause` — audio player interactions
- `robot_prompt` — user sends a prompt to the robot modal

---

## What still needs to be done before launch

See the Content Refinement Checklist below.

---

## Pre-launch checklist

### Assets — blocked until created
- [ ] `/public/images/og-default.jpg` — 1200×630 OG image; referenced by all page metadata for social sharing
- [ ] `/public/images/logo.png` — referenced by JSON-LD org schema (`src/lib/schema.ts`)
- [ ] `/public/audio/*.mp3` — 5 tracks referenced in `src/data/playlist.ts`; cassette player degrades gracefully if missing

### Wiring — flip when ready
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://nuun.dev`) in Cloudflare env vars — fallback is `nuuncreative.com`
- [ ] Set `NEXT_PUBLIC_GA_ID` once GA4 property is created
- [ ] Set `NEXT_PUBLIC_GHL_BOOKING_URL` once GHL scheduling form is live; all CTAs fall back to `/contact` until then
- [ ] Replace the GHL embed placeholder `div` in `/contact` with actual widget embed code

### Content — final review
- [ ] `/manifesto` — confirm 4-section copy is final
- [ ] Robot modal — review 5 prompt responses for brand voice
- [ ] Cassette playlist — confirm track titles in `src/data/playlist.ts`
- [ ] Privacy policy — confirm "Last updated: March 2026" date

### Pre-launch QA
- [ ] `npm run build` passes with no TypeScript or lint errors
- [ ] `npm run pages:build` passes (Cloudflare edge compatibility check)
- [ ] All 11 routes return 200: `/`, `/manifesto`, `/concepts`, `/concepts/showroom`, `/concepts/studio-world`, `/concepts/system-made-intuitive`, `/concepts/playground`, `/concepts/product-universe`, `/concepts/conversion-journey`, `/contact`, `/privacy`
- [ ] Sitemap at `/sitemap.xml` lists all routes
- [ ] OG image renders correctly when URL is shared on Slack or Twitter
- [ ] Hero "Start a Project →" link is visible and clickable on mobile
- [ ] Mobile scene panning works on a real device
- [ ] Cassette audio plays on iOS Safari (autoplay policy — user must interact first)
