# UUON Pstudio

A browser-based 3D parametric design studio — generate AI 3D models from text prompts, explore sacred-geometry parametric forms in real time, and export everything as production-ready assets.

Built with React, Three.js (via React Three Fiber), and an Express/Node backend.

## Features

- **Parametric Explorer** — real-time 3D curve and surface generation driven by adjustable mathematical parameters, rendered live in WebGL
- **Generate 3D** — text-to-3D model generation powered by [Tripo3D](https://studio.tripo3d.ai/?via=phi1)
- **AI Images** — AI-assisted image generation portal
- **3D Models gallery** — a curated library of sacred-geometry and symbolic 3D models (Platonic solids, mandalas, sacred symbols), browsable and exportable
- **Texture gallery** — stylized pixel-art textures (8-bit/12-bit/16-bit tiers) for the symbol set, ready to apply to 3D models in external tools
- **Export pipeline** — export generated geometry as GLB with embedded metadata

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Vite |
| 3D rendering | Three.js, React Three Fiber, React Three Drei |
| UI | Tailwind CSS, Radix UI primitives |
| Backend | Express (Node.js) |
| Database | PostgreSQL (Neon), Drizzle ORM |
| 3D generation | Tripo3D API |

## Getting started

### Prerequisites
- Node.js 18+
- A [Tripo3D](https://studio.tripo3d.ai/?via=phi1) API key
- A PostgreSQL connection string (e.g. from [Neon](https://neon.tech))

### Setup

```bash
git clone https://github.com/UUON-Foundation/3dPstudio.git
cd 3dPstudio
npm install
```

Create a `.env` file in the project root:

```
TRIPO_API_KEY=your_tripo3d_key_here
DATABASE_URL=your_postgres_connection_string_here
```

Local macOS note: if the dev server fails to bind with an `ENOTSUP` error on `0.0.0.0`, add this to your `.env`:

```
HOST=127.0.0.1
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5000` (or whichever port you set via `PORT`).

### Production build

```bash
npm run build
npm start
```

## Deployment

This project deploys cleanly to [Railway](https://railway.com/):

1. Connect this repo (Railway auto-detects the build via Railpack)
2. Set `TRIPO_API_KEY` and `DATABASE_URL` under the service's **Variables** tab
3. Leave `PORT` unset — Railway injects it automatically and the app reads it directly
4. Generate a public domain under **Settings → Networking**

## Project structure

```
client/
  index.html          # Vite entry point
  src/
    components/        # React components (3D scene, portals, UI)
    lib/                # Geometry/math utilities, state stores
    pages/
  public/
    models/             # Curated 3D model library (.glb)
    textures/            # Sacred-symbol texture sets
server/
  index.ts             # Express entry point
  routes.ts             # API routes
  storage.ts             # Data access layer
shared/
  schema.ts            # Shared DB schema (Drizzle)
```

## License

MIT — see [LICENSE](./LICENSE) for details.

## Acknowledgments

3D generation powered by [Tripo3D](https://studio.tripo3d.ai/?via=phi1). Built and deployed using [Replit](https://replit.com/refer/phi1) and [Railway](https://railway.com/).
