# OpenMuscle Website

The official website for [OpenMuscle](https://openmuscle.org) — open-source prosthetic sensor technology, open for all humanity.

[![Azure Static Web Apps](https://img.shields.io/badge/Hosted%20on-Azure%20Static%20Web%20Apps-0078D4?logo=microsoftazure)](https://openmuscle.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About OpenMuscle

OpenMuscle builds affordable, open-source **pressure myography** sensors that predict finger movements using machine learning. Instead of expensive EMG, we use simple pressure sensors to detect muscle topology changes — and the whole device costs about **~$45 in components**.

- **Hardware**: 60-sensor FlexGrid (15x4 flexible PCB) + ESP32-S3
- **ML**: Random Forest Regressors trained on labeled LASK5 data
- **Licenses**: MIT (software), CERN-OHL-S v2.0 (hardware), Creative Commons (docs)

Learn more at [openmuscle.org](https://openmuscle.org) or explore the [OpenMuscle Hub](https://github.com/Open-Muscle/OpenMuscle-Hub).

---

## Quick Start

```bash
git clone https://github.com/Open-Muscle/openmuscle-website.git
cd openmuscle-website
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | [Astro 6](https://astro.build)      |
| Styling    | [Tailwind CSS 4](https://tailwindcss.com) |
| Hosting    | Azure Static Web Apps (free tier)   |
| CI/CD      | GitHub Actions (auto-deploy on push to `main`) |
| Domain     | `openmuscle.org` via Azure DNS      |

No frontend framework (React, Vue, etc.) — just plain Astro components with client-side JavaScript for animations.

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # Shared shell: nav, footer, <head>, mobile menu
├── pages/
│   ├── index.astro               # Home — hero, finger prediction charts, repo cards
│   ├── technology.astro          # PMG explanation, sensor comparisons, data pipeline
│   ├── repositories.astro        # All GitHub repos with live stats
│   ├── get-involved.astro        # Community links, contribution guide
│   └── about.astro               # Origin story, photo timeline, tech stack, licenses
├── components/
│   ├── SensorHeatmap.astro       # 60-sensor pressure heatmap visualization
│   ├── PredictionChart.astro     # Finger prediction actual vs predicted chart
│   └── ModelComparison.astro     # ML model comparison table
└── styles/
    └── global.css                # Brand tokens, button/card/grid styles

public/
├── logos/                        # PNG logos (black/white, horizontal, 1x1 icon)
├── images/
│   ├── backgrounds/              # Transparent section backgrounds (5-12% opacity)
│   └── timeline/                 # About page milestone photos
├── data/                         # Real ML inference data for hero animation
└── favicon-32.png, apple-touch-icon.png, icon-192.png
```

## Brand Color Palette

All colors are defined as Tailwind theme tokens in `src/styles/global.css`:

| Token               | Hex       | Usage                           |
|----------------------|-----------|---------------------------------|
| `orange-primary`     | `#FFBFA3` | Accents, borders, button bg     |
| `orange-bold`        | `#FF9F63` | CTAs, emphasis, hover states    |
| `orange-light`       | `#FFE0CC` | Light backgrounds, overlays     |
| `blue-primary`       | `#6FBEE6` | Links, highlights, dotted lines |
| `blue-bright`        | `#70D6FF` | Interactive elements, glows     |
| `blue-light`         | `#BFE8FF` | Card backgrounds                |
| `bg-warm`            | `#FEF9F5` | Main page background            |
| `bg-cool`            | `#F3FEFE` | Alternate section background    |
| `text-base`          | `#2C2C2C` | Body text                       |
| `navy`               | `#0f1729` | Dark CTA section background     |

## Key Features

### Live GitHub Stats
Repo cards on the home and repositories pages fetch stars, forks, language, and last-updated from the GitHub API **at build time**. Stats refresh on every deploy.

### Real ML Inference Animation
The hero section replays actual finger prediction data — 4 canvases showing Index, Middle, Ring, and Pinky fingers with actual (blue) vs predicted (orange) traces from real FlexGrid sensor data.

### Engineering Blueprint Aesthetic
Subtle grid backgrounds (`blueprint-grid`, `blueprint-grid-dense`) give the site a technical drawing feel. Solid orange lines represent strength/hardware, dotted blue lines represent openness/data flow.

## Contributing

### Add a new page
1. Create `src/pages/my-page.astro`
2. Wrap content in `<BaseLayout title="My Page">...</BaseLayout>`
3. Add nav link in `BaseLayout.astro` (both desktop and mobile menu sections)

### Add a timeline entry
Edit the `timeline` array in `src/pages/about.astro`:
```js
{ year: "2026", title: "Title", desc: "Description", color: "orange", image: "/images/timeline/photo.png" }
```

### Update logos
Replace files in `public/logos/`. Required variants:
- `logo-horizontal-black.png` / `logo-horizontal-white.png` — navbar, hero
- `logo-black.png` / `logo-white.png` — large stacked logo (footer)
- `icon-black.png` / `icon-white.png` — 1:1 monogram (favicon source)

### Update featured repos
Edit `repoSlugs` and `repoMeta` at the top of `src/pages/index.astro`.

## Deployment

Every push to `main` triggers a GitHub Actions workflow that builds and deploys to Azure Static Web Apps automatically.

- **Build command**: `npm run build`
- **Output directory**: `dist`

## Related Repositories

| Repository | Description |
|-----------|-------------|
| [OpenMuscle-Hub](https://github.com/Open-Muscle/OpenMuscle-Hub) | Central hub linking all OpenMuscle repos |
| [OpenMuscle-FlexGrid](https://github.com/Open-Muscle/OpenMuscle-FlexGrid) | 60-sensor flexible PCB forearm band |
| [OpenMuscle-LASK5](https://github.com/Open-Muscle/OpenMuscle-LASK5) | Label Acquiring System for ML training data |
| [OpenMuscle-Software](https://github.com/Open-Muscle/OpenMuscle-Software) | Python ML pipeline and data collection tools |

## License

MIT — see [LICENSE](LICENSE) for details.
