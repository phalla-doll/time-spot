# Time Spot

A Next.js application for exploring and showcasing time-based spots (events, slots, or moments). Built with the Next.js App Router and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / PostCSS
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
  globals.css         # Global styles
public/               # Static assets
```

## Environment Variables
If/when needed, create a `.env.local` file at the project root. Example:
```
# Example
# NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```
Values prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Formatting & Linting
- Configured via `biome.json` (and Next.js defaults). Run:
```bash
npm run lint
```

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
