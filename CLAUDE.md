# OpenMuscle Website — AI Developer Guide

## Quick Start

```bash
cd openmuscle-website
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Stack

- **Astro 6** — static site generator (all pages are `.astro` files)
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin
- **No framework** — plain Astro components, no React/Vue/Svelte
- **Hosting** — Azure Static Web Apps (free tier), auto-deploys from `main` branch
- **Domain** — `openmuscle.org`, DNS hosted on Azure DNS

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro        # Shared HTML shell: nav, footer, <head>, mobile menu
├── pages/
│   ├── index.astro             # Home — hero, finger prediction charts, repo cards
│   ├── technology.astro        # PMG explanation, sensor comparisons, data pipeline
│   ├── repositories.astro      # All GitHub repos with live stats
│   ├── get-involved.astro      # Community links, contribution guide
│   └── about.astro             # Origin story, timeline with images, tech stack, licenses
├── components/
│   ├── SensorHeatmap.astro     # 60-sensor pressure heatmap visualization
│   ├── PredictionChart.astro   # Finger prediction actual vs predicted chart
│   └── ModelComparison.astro   # ML model comparison table
└── styles/
    └── global.css              # Brand color tokens, button/card/grid styles

public/
├── logos/                      # PNG logos (black/white, horizontal, 1x1 icon)
├── images/
│   ├── backgrounds/            # Transparent bg images for sections (5-12% opacity)
│   └── timeline/               # About page timeline milestone photos
├── data/                       # Inference JSON for finger prediction animations
├── favicon-32.png, favicon.ico, apple-touch-icon.png, icon-192.png
```

## Brand Color Palette

All colors are defined as Tailwind theme tokens in `src/styles/global.css`:

| Token               | Hex       | Usage                           |
|----------------------|-----------|---------------------------------|
| `orange-primary`     | `#FFBFA3` | Accents, borders, button bg     |
| `orange-bold`        | `#FF9F63` | CTAs, emphasis, hover states    |
| `orange-light`       | `#FFE0CC` | Light backgrounds, overlays     |
| `orange-pale`        | `#FFE8DD` | Very subtle fills               |
| `blue-primary`       | `#6FBEE6` | Links, highlights, dotted lines |
| `blue-bright`        | `#70D6FF` | Interactive elements, glows     |
| `blue-light`         | `#BFE8FF` | Card backgrounds (30-40% opacity) |
| `blue-pale`          | `#C2ECFF` | Subtle fills                    |
| `bg-warm`            | `#FEF9F5` | Main page background            |
| `bg-cool`            | `#F3FEFE` | Alternate section background    |
| `text-base`          | `#2C2C2C` | Body text                       |
| `text-light`         | `#FFFFFF` | Text on dark backgrounds        |
| `navy`               | `#0f1729` | Dark CTA section background     |

Usage in Tailwind classes: `text-orange-bold`, `bg-blue-light/30`, `border-orange-primary`, etc.

## Design Patterns

### Background Images
Sections use transparent background images for depth. Pattern:
```html
<section class="relative overflow-hidden">
  <div class="absolute inset-0 bg-cover bg-center opacity-[0.06]"
       style="background-image: url('/images/backgrounds/hero-render.png');"></div>
  <div class="relative ...">  <!-- MUST be relative so content is clickable above bg -->
    ...content...
  </div>
</section>
```
- Light backgrounds: 5-6% opacity
- Dark (navy) backgrounds: 10-12% opacity

### Blueprint Grid
Engineering-sketch aesthetic applied via CSS classes:
- `blueprint-grid` — subtle 40px grid
- `blueprint-grid-dense` — layered 80px + 20px grid (used on hero)

### Buttons
- `.btn-primary` — orange bg, hover adds blue dotted border + glow
- `.btn-secondary` — transparent with blue border, hover fills blue

### Cards
- `.card` — semi-transparent blue bg, blue border, hover turns orange

### Dotted Lines
- `.dotted-line-h` — horizontal blue dotted divider
- `.dotted-line-v` — vertical blue dotted divider
- `.solid-line-h` — horizontal orange solid divider

## GitHub API Integration

`index.astro` and `repositories.astro` fetch live stats from GitHub at **build time**:
```typescript
const res = await fetch('https://api.github.com/repos/Open-Muscle/OpenMuscle-FlexGrid');
const repo = await res.json();
// repo.stargazers_count, repo.forks_count, repo.language, repo.updated_at
```
Stats update on every deploy (push to main triggers Azure rebuild).

## Finger Prediction Animation

The hero section replays real ML inference data from `public/data/flexgrid64_holdout_predictions.json`.
- 4 canvas elements (Index, Middle, Ring, Pinky fingers)
- Blue line = actual LASK5 ground truth, orange line = ML predicted
- Scrolling window animation with Play/Pause button
- All client-side JavaScript in `<script>` tag at bottom of `index.astro`

## Deployment

Pushes to `main` on `github.com/Open-Muscle/openmuscle-website` auto-deploy via GitHub Actions → Azure Static Web Apps.

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Workflow file**: `.github/workflows/azure-static-web-apps-*.yml`

## DNS (Azure DNS Zone: openmuscle.org)

- **A record** `@` → ALIAS to Azure Static Web App
- **CNAME** `www` → `yellow-ground-0495f3710.4.azurestaticapps.net`
- **MX** → `openmuscle-org.mail.protection.outlook.com` (Microsoft 365 email)
- **TXT** → SPF, DMARC, domain verification records for M365
- **CNAME** → `autodiscover`, `sip`, `lyncdiscover` etc. for M365 services
- **SRV** → Skype/Teams federation records

Do NOT modify MX, TXT, SRV, or autodiscover records — they keep email working.

## Common Tasks

### Add a new page
1. Create `src/pages/my-page.astro`
2. Wrap content in `<BaseLayout title="My Page">...</BaseLayout>`
3. Add nav link in `BaseLayout.astro` (desktop + mobile menu sections)

### Add a timeline entry (About page)
Edit the `timeline` array in `src/pages/about.astro`. Each entry has:
`{ year, title, desc, color: "orange"|"blue", image: "/images/timeline/filename.png" }`

### Update logos
Replace files in `public/logos/`. Variants needed:
- `logo-horizontal-black.png` — navbar, hero
- `logo-horizontal-white.png` — dark sections
- `logo-black.png` / `logo-white.png` — large stacked logo
- `icon-black.png` / `icon-white.png` — 1:1 monogram

### Add a background image
1. Put image in `public/images/backgrounds/`
2. Add to section with absolute positioning (see Design Patterns above)
3. Keep opacity 5-12% so text remains readable

### Update featured repos on home page
Edit the `repoSlugs` array at the top of `index.astro` and the `repoMeta` object for descriptions/tags.
