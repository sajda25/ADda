# ADda contracts (Monad Testnet)

## Deploy

1. Copy `.env.example` → `.env` and set `PRIVATE_KEY` (funded Monad Testnet wallet).
2. From this folder:

```bash
forge script script/Deploy.s.sol:Deploy --rpc-url monad_testnet --broadcast
```

3. Copy logged addresses into `apps/web/.env.local` and Vercel:

- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`
- `NEXT_PUBLIC_STREET_MURAL_EPOCH_ADDRESS`
- `NEXT_PUBLIC_NEIGHBORHOOD_TREASURY_ADDRESS`
- `DEPLOYER_PRIVATE_KEY` (server-only, same key used to register demo publishes)
