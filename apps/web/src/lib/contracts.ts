/**
 * Contract addresses and ABI placeholders.
 * Populate after Foundry deploy (Phase 7). Empty strings mean “not deployed”.
 */

export const contractAddresses = {
  memoryRegistry: process.env.NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS ?? "",
  streetMuralEpoch: process.env.NEXT_PUBLIC_STREET_MURAL_EPOCH_ADDRESS ?? "",
  neighborhoodTreasury:
    process.env.NEXT_PUBLIC_NEIGHBORHOOD_TREASURY_ADDRESS ?? "",
} as const;

export function isContractConfigured(
  key: keyof typeof contractAddresses,
): boolean {
  const value = contractAddresses[key];
  return Boolean(value && value.startsWith("0x") && value.length === 42);
}
