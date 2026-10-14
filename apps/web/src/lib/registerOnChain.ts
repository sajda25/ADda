import { createHash } from "node:crypto";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  MONAD_CHAIN_ID,
  MONAD_EXPLORER_DEFAULT,
  MONAD_RPC_DEFAULT,
} from "@adda/shared";
import { memoryRegistryAbi } from "@/lib/memoryRegistryAbi";
import { contractAddresses, isContractConfigured } from "@/lib/contracts";

function toBytes32FromString(value: string): Hex {
  const hex = createHash("sha256").update(value).digest("hex");
  return `0x${hex}` as Hex;
}

function toBytes32FromContentHash(contentHash: string): Hex {
  const clean = contentHash.replace(/^0x/, "").toLowerCase();
  if (/^[0-9a-f]{64}$/.test(clean)) return `0x${clean}` as Hex;
  return toBytes32FromString(contentHash);
}

function getPrivateKey(): Hex | null {
  const raw = process.env.DEPLOYER_PRIVATE_KEY ?? process.env.PRIVATE_KEY;
  if (!raw) return null;
  const key = raw.startsWith("0x") ? raw : `0x${raw}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) return null;
  return key as Hex;
}

export type OnChainRegisterResult =
  | { ok: true; txHash: Hex; explorerUrl: string }
  | { ok: false; reason: string };

/**
 * Registers a memory commitment on Monad Testnet via the deployer wallet.
 * Story text stays off-chain; only hashes go on-chain.
 */
export async function registerMemoryOnChain(input: {
  memoryId: string;
  contentHash: string;
  placeId: string;
  layer: string;
}): Promise<OnChainRegisterResult> {
  if (!isContractConfigured("memoryRegistry")) {
    return { ok: false, reason: "MemoryRegistry address not configured" };
  }

  const privateKey = getPrivateKey();
  if (!privateKey) {
    return { ok: false, reason: "DEPLOYER_PRIVATE_KEY not configured" };
  }

  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? MONAD_CHAIN_ID);
  const rpc = process.env.NEXT_PUBLIC_MONAD_RPC ?? MONAD_RPC_DEFAULT;
  const explorer =
    process.env.NEXT_PUBLIC_MONAD_EXPLORER ?? MONAD_EXPLORER_DEFAULT;

  const account = privateKeyToAccount(privateKey);
  const chain = {
    id: chainId,
    name: "Monad Testnet",
    nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
    rpcUrls: { default: { http: [rpc] } },
  } as const;

  const wallet = createWalletClient({
    account,
    chain,
    transport: http(rpc),
  });
  const publicClient = createPublicClient({
    chain,
    transport: http(rpc),
  });

  const hash = await wallet.writeContract({
    address: contractAddresses.memoryRegistry as Hex,
    abi: memoryRegistryAbi,
    functionName: "registerMemory",
    args: [
      toBytes32FromString(input.memoryId),
      toBytes32FromContentHash(input.contentHash),
      toBytes32FromString(input.placeId),
      toBytes32FromString(input.layer),
    ],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return {
    ok: true,
    txHash: hash,
    explorerUrl: `${explorer.replace(/\/$/, "")}/tx/${hash}`,
  };
}
