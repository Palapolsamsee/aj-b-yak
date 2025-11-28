# aj-b-yak

Nuxt 3 application for visualizing air quality data with maps, charts, and a sensor/device directory. It uses Tailwind CSS for styling and integrates Google Maps and Leaflet/ECharts components.

## Features

- Air quality map with colored markers (Google Maps)
- Device table and current AQI summary
- Heatmap and chart visualizations (Leaflet/ECharts)
- Configurable color ranges via API
- Nuxt 3 + Vite + Tailwind CSS setup

## Requirements

- Node.js 18+ (recommended 18.x or 20.x)
- One package manager: npm or bun
- API endpoints and keys configured via `.env` (see below)

## Quick Start

Install dependencies and start the dev server on port 2500.

```bash
# npm
npm install
npm run dev   # http://localhost:2500

# or with bun
bun install
bun run dev   # http://localhost:2500
```

Build and preview production locally:

```bash
# build
npm run build    # or: bun run build

# preview
npm run preview  # or: bun run preview
```

## Environment Variables

Create a `.env` file in the project root. The app reads values via `runtimeConfig` in `nuxt.config.ts`. Prefer the `NUXT_PUBLIC_*` keys because they can be injected at runtime (Cloud Run/VM) and are automatically exposed to the browser.

```env
# Private (server-side)
AIRQUALITY_API_BASE=https://your-api/airquality    # optional: used only if you wire Nuxt's proxy route
AIRQUALITY_PROXY_ALLOW_INSECURE=false              # set true only when the upstream uses a self-signed cert
NUXT_FIREBASE_APIKEY=
NUXT_FIREBASE_AUTHDOMAIN=
NUXT_FIREBASE_PROJECTID=
NUXT_FIREBASE_STORAGEBUCKET=
NUXT_FIREBASE_MESSAGINGSENDERID=
NUXT_FIREBASE_APPID=

# Public (exposed to client) — set these in Cloud Run/VM env
NUXT_PUBLIC_API_URL=                 
NUXT_PUBLIC_BASE_API_ARI=            # base air API (used directly by the client)
NUXT_PUBLIC_WEAK_API_ARI=            # one-week AQI endpoint
NUXT_PUBLIC_YEAR_API_ARI=            # one-year AQI endpoint
NUXT_PUBLIC_YAKKAW_API=              # sensors/devices listing endpoint
NUXT_PUBLIC_API_URL_COLORRANGE=      # color range endpoint
NUXT_PUBLIC_NEWS_API=                # news feed endpoint
NUXT_PUBLIC_GOOGLEMAP=               # Google Maps JavaScript API key

# Legacy names that still work (avoid using in new deploys)
NUXT_API_URL=
BASE_API_ARI=
WEAK_API_ARI=
YEAR_API_ARI=
YAKKAW_API=
NEWS_API=
GOOGLEMAP=
```

Notes

- By default the browser calls `BASE_API_ARI` directly, so the upstream must allow CORS for your deployment origin (or serve everything from the same domain/IP).
- If you want to run requests through the Nuxt proxy (e.g., to avoid CORS headache), set `AIRQUALITY_API_BASE` and point your components to `/api/proxy/airquality`, or customize `nuxt.config.ts` to expose a public proxy base.
- Dev proxy maps `/api` to `http://localhost:8080` (see `nitro.devProxy` in `nuxt.config.ts`) for the admin/dashboard service.
- `composables/useApiBase.ts` expects `YAKKAW_API`, `BASE_API_ARI`, `WEAK_API_ARI`, `YEAR_API_ARI`, `NEWS_API`, and `GOOGLEMAP` to be defined.

## Scripts

- `dev` — Run the dev server on `http://localhost:2500`
- `build` — Build for production
- `preview` — Preview the production build
- `generate` — Generate static site

## Tech Stack

- Nuxt 3, Vue 3, Vite
- Tailwind CSS
- Leaflet, Google Maps, ECharts/Chart.js

## Project Structure

- `pages/` — Routed views (home, map, heatmap, devices, etc.)
- `components/` — UI components (AirQualityMap, CurrentAirQuality, DeviceTable, etc.)
- `composables/` — Helpers for runtime config and API bases
- `utils/` — Color range utilities and helpers
- `assets/` / `public/` — Styles and static assets
- `nuxt.config.ts` — Nuxt configuration, modules and dev proxy

## Development Notes

- If any page imports `axios`, install it: `npm i axios` (or switch to `fetch`).
- The router base in `router/index.js` is only needed for specific deployments (e.g., subpath hosting). Remove or adjust if not required.
- Tailwind configuration lives in `tailwind.config.js` and styles in `assets/css/main.css`.

## Deployment

Consult the official Nuxt deployment guide: https://nuxt.com/docs/getting-started/deployment

Common options

- Static hosting: `npm run generate`
- Node server (SSR): build with `npm run build` and start via your chosen process manager

### Cloud Run / VM notes

- `.dockerignore` excludes `.env` files, so secrets in your local `.env` are **not** baked into the container. Set environment variables on the service instead (or pass `--env-file` when running the image yourself).
- Example Cloud Run deploy with envs:

  ```bash
  gcloud run deploy aj-b-yak \
    --source . \
    --region <REGION> \
    --set-env-vars NUXT_PUBLIC_API_URL=https://your-api \
    --set-env-vars NUXT_PUBLIC_YAKKAW_API=https://your-api/devices \
    --set-env-vars NUXT_PUBLIC_API_URL_COLORRANGE=https://your-api/color-ranges
  ```

- On a VM, export the same `NUXT_PUBLIC_*` vars before starting the server:

  ```bash
  npm run build
  NUXT_PUBLIC_API_URL=https://your-api \
  NUXT_PUBLIC_YAKKAW_API=https://your-api/devices \
  NUXT_PUBLIC_API_URL_COLORRANGE=https://your-api/color-ranges \
  node .output/server/index.mjs
  ```

- Debug runtime config in a running container at `/api/runtime-config` (returns only public values).
- The browser now calls same-origin proxies `/api/color-ranges` and `/api/news`, which fetch upstream URLs from your env vars to avoid CORS issues.

## License

ISC (see `package.json`).
