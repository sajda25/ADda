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

## Current phase

| Phase | Status |
| --- | --- |
| 1 Scaffold | ✅ |
| 2 Data + seed | ✅ 10 places, 41+ memories, 12 relations, 4 epochs |
| 3 Map + storybook | ✅ Leaflet map, discovery modes, story reader, qualified reads |
| 4 Memory Echoes | ✅ Seeded relations + UI + `/api/relations` |
| 5 Generative mural | ✅ Deterministic canvas engine + cause panel + Vitest |
| 6 Publishing | ✅ Modal + `/api/memories/publish` (DB-only until chain wired) |
| 7 Monad integration | ⏳ Contracts written; Foundry/Privy/wagmi not yet deployed or wired |
| 8 Treasury | ⏳ Contract stub only |
| 9 Demo polish | 🟡 `/demo` seed status + docs present |
| 10 Deployment | ⏳ Not deployed |

### Incomplete / honest gaps

- No verified Monad Testnet transaction yet (Foundry CLI not installed on this machine; contract addresses empty).
- Privy / wagmi wallet UX not wired.
- Playwright e2e smoke tests not added.
- Preservation funding UI not implemented (by design until chain is live).

## Environment

See [.env.example](./.env.example). Never put deployer private keys in `NEXT_PUBLIC_*` variables.

## Product rules (non-negotiable)

- No Memory Duels or winner-takes-all ranking
- Funding never buys story visibility
- Personal story content off-chain by default
- No speculative token / NFT marketplace
- Quiet and rarely-read stories remain accessible

## License

Private / hackathon prototype — rights reserved by the authors.
