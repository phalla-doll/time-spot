# Time Spot

A Next.js application for exploring and showcasing time-based spots (events, slots, or moments). Built with the Next.js App Router and Tailwind CSS.

## Features
- Real-time world clock with 12h/24h toggle
- Favorite cities with quick reordering (persisted in localStorage)
- Timezone search with live local time and offset preview
- Weather snapshot via geolocation (Open‑Meteo, no API key required)
- System theme support and theme switcher (light/dark)
- Contact dialog that stores submissions to Notion (optional)

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / PostCSS
- **UI**: shadcn/ui
- **Icons**: lucide-react
- **Time**: luxon
- **Forms**: react-hook-form
- **Storage**: browser `localStorage`
- **Package Manager**: npm (lockfile included)

## Getting Started

### Prerequisites
- Node.js 18+ (or the version recommended by Next.js)
- npm 9+

### Installation
```bash
npm install
```

### Development
Start the local dev server:
```bash
npm run dev
```
Then open `http://localhost:3000`.

## Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Create a production build
- `npm run start`: Start the production server (after `build`)
- `npm run lint`: Run the linter (Biome/ESLint per project config)

## Project Structure
```
src/
  app/
    layout.tsx        # Root layout
    page.tsx          # Home page
    api/
      notion/route.ts # POST endpoint to store contact submissions in Notion
  globals.css         # Global styles
public/               # Static assets
```

## Environment & Integrations
- Weather uses `open-meteo.com` directly from the browser and attempts to read the user's location via `navigator.geolocation`.
  - If permission is denied/unavailable, it falls back to a default location (New York) gracefully.

### Notion (optional)
The contact dialog posts to `/api/notion`. To enable it, set these environment variables in `.env.local` at the project root:
```
NOTION_API_KEY=your-secret-integration-token
NOTION_DATABASE_ID=your-database-id
```
Notes:
- Create a Notion internal integration and share access to the target database.
- Adjust property names in `src/app/api/notion/route.ts` to match your Notion database schema if needed.

## Formatting & Linting
- Configured via `biome.json` (and Next.js defaults). Run:
```bash
npm run lint
```

## Usage Notes
- Time format preference is saved under `TIME_FORMAT` in `localStorage`.
- Favorite cities are saved under `FAVORITE_CITIES` in `localStorage` (up to 4). Selecting a city reorders the list to put it first.
- The timezone search lists `Intl.supportedValuesOf("timeZone")` when available, with current local time and offset for each match.
- Theme switcher toggles light/dark and respects system preference.

## Deployment
- The quickest way is Vercel. After pushing to `main`, import the repo in Vercel and deploy.
- Alternatively, build and run anywhere that supports Node.js:
```bash
npm run build
npm run start
```

## Contributing
1. Create a new branch from `main`
2. Make changes and add tests if applicable
3. Run lint/build locally
4. Open a Pull Request

## License
Apache-2.0. See `LICENSE`.
