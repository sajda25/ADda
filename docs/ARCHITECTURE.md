# Architecture — ADda

## Overview

ADda is a pnpm monorepo:

| Path | Role |
| --- | --- |
| `apps/web` | Next.js App Router UI + API route handlers |
| `packages/shared` | Shared types, constants, validators |
| `contracts` | Foundry contracts (Phase 7+) |

## Product principles that shape the architecture

1. **Place-first** — the primary entity is a Place Storybook, not a user feed.
2. **Noncompetitive archive** — no duels; reads order discovery only.
3. **Off-chain story text** — on-chain holds commitments and epoch records.
4. **Explainable mural** — deterministic canvas engine; every change traces to inputs.
5. **Wallet only when needed** — explore without connecting.

## Data flow (target)

```
Browser → Next.js UI
        → Route handlers → PostgreSQL (Prisma read model)
        → wagmi/viem → Monad Testnet (registrations, mural epochs, optional treasury)
```

Event sync (Phase 7): `lib/sync/pullEvents.ts` pulls chain events into the read model.

## Phase status

| Phase | Status |
| --- | --- |
| 1 Scaffold | Complete |
| 2 Data + seed | Pending |
| 3 Map + storybook | Pending |
| 4 Memory Echoes | Pending |
| 5 Generative mural | Pending |
| 6 Publishing | Pending |
| 7 Monad | Pending |
| 8 Treasury (optional) | Pending |
| 9 Demo polish | Pending |
| 10 Deploy | Pending |

## Design system

Warm paper & ink. Tokens live in `apps/web/src/app/globals.css`. Display font: Fraunces. UI font: DM Sans.
