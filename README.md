# MEMORY STREETS

**Every place has more than one story.**

MEMORY STREETS turns neighborhoods into living storybooks. People discover, share, and preserve place-based memories on an interactive map — without competing for visibility, and without a pay-to-promote feed.

This repository is an independent monorepo (`memory-streets`). It is not part of any other project.

## Why not Instagram?

| Social media | MEMORY STREETS |
| --- | --- |
| Centers profiles & followers | Centers **places** and their storybooks |
| Feed of posts | Multiple experiences at the same spot |
| Engagement as status | Reads order discovery — not archive eligibility |
| Opaque ranking | Explainable mural + transparent provenance |

## Tech stack

- **Web:** Next.js (App Router), React, TypeScript (strict), Tailwind CSS
- **Fonts:** Fraunces (display), DM Sans (UI) via `next/font`
- **Map:** Leaflet + React Leaflet + OSM (Phase 3)
- **Data:** PostgreSQL + Prisma (Phase 2)
- **Chain:** Monad Testnet, Foundry, viem/wagmi, Privy (Phase 7)
- **Workspace:** pnpm monorepo

## Repository layout

```
memory-streets/
  apps/web/          Next.js application
  packages/shared/   Shared types, constants, validators
  contracts/         Foundry / Solidity (Phase 7+)
  docs/              Pitch, demo script, architecture, privacy
```

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL (from Phase 2)
- Foundry (from Phase 7)

## Installation

```bash
pnpm install
cp .env.example apps/web/.env.local
```

## Local development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

Requires PostgreSQL. Example local URL (see `.env.example`):

```bash
cp .env.example apps/web/.env.local
# edit DATABASE_URL
pnpm db:migrate
pnpm seed
```

### Useful commands

```bash
pnpm db:generate   # prisma generate
pnpm db:migrate    # prisma migrate dev
pnpm db:push       # prisma db push (dev only)
pnpm seed          # idempotent demo district seed (~40 memories)
```

Verify seed: `GET /api/seed` and `GET /api/places`.

## License

Private / hackathon prototype — rights reserved by the authors.
