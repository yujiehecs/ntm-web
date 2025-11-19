# NTM Patient Resource Hub

A modern web platform providing organized access to NTM community knowledge through curated forum discussions and an interactive medical glossary.

**Live Site**: https://yujiehecs.github.io/ntm-web

## Features

### Topics (40 Topics, 959 Discussions)
- **Forum Discussions** - 959 manually-curated threads from connect.ntminfo.org
- **40 Medical Topics** - Organized into 8 categories (Treatment, Health, Airway Clearance, Equipment, Testing, Safety, Daily Living, Support)
- **Time-Series Charts** - Track discussion trends over time
- **Smart Filtering** - Search, sort, and filter by time range
- **Direct Links** - One-click access to original forum threads

### Glossary (80 Medical Terms)
- **Patient-Friendly Definitions** - Clear explanations of NTM medical terminology
- **16 Categories** - Core disease, antibiotics, diagnostic tests, imaging findings, symptoms, equipment, treatments, and more
- **Search & Filter** - Find terms quickly by name or category
- **Related Terms** - Discover connected concepts
- **Expert-Written** - Medically accurate, easy-to-understand content

## Technology Stack

- **Next.js 16** - React framework with static site generation
- **TypeScript** - Type-safe codebase
- **Tailwind CSS v4** - Modern utility-first styling
- **Recharts** - Interactive data visualizations
- **Heroicons** - Consistent UI icons

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start
```

## Data Files

- `public/data/manual_tags_production.json` - Forum discussions (959 threads, 40 topics)
- `public/data/glossary.json` - Medical glossary (80 terms, 16 categories, 368 relationships)

## Project Structure

```
ntm-web/
├── src/
│   ├── app/                        # Next.js app router
│   │   ├── page.tsx               # Home page with tabs
│   │   ├── topic/[topicName]/     # Dynamic topic pages
│   │   └── glossary/[term]/       # Dynamic glossary pages
│   ├── components/
│   │   ├── pages/                 # Page components (Dashboard, GlossaryView, etc.)
│   │   ├── charts/                # Recharts wrappers
│   │   ├── layout/                # Header, footer
│   │   └── ui/                    # Reusable UI components
│   └── lib/
│       ├── constants.ts           # Topic taxonomy
│       ├── types/                 # TypeScript interfaces
│       └── data/                  # Data processing
└── public/
    └── data/                      # Static JSON data files
```

## Deployment

The site is deployed to GitHub Pages with static export:

```bash
# Build static site
npm run build

# Deploy to GitHub Pages
git add -A
git commit -m "Update site"
git push origin main
```

GitHub Actions automatically deploys changes to https://yujiehecs.github.io/ntm-web

## License

Built for the NTM patient community. Data sourced from NTM Connect forum with proper attribution.

---

**For the NTM community** | Topics + Glossary in one place
