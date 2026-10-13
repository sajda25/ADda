/**
 * Monad Testnet chain helpers.
 * Full wagmi/viem wiring lands in Phase 7.
 */

import {
  MONAD_CHAIN_ID,
  MONAD_EXPLORER_DEFAULT,
  MONAD_RPC_DEFAULT,
} from "@memory-streets/shared";

export const monadChain = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? MONAD_CHAIN_ID),
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_MONAD_RPC ?? MONAD_RPC_DEFAULT],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: process.env.NEXT_PUBLIC_MONAD_EXPLORER ?? MONAD_EXPLORER_DEFAULT,
    },
  },
} as const;

export function explorerTxUrl(txHash: string): string {
  const base =
    process.env.NEXT_PUBLIC_MONAD_EXPLORER ?? MONAD_EXPLORER_DEFAULT;
  return `${base.replace(/\/$/, "")}/tx/${txHash}`;
}
