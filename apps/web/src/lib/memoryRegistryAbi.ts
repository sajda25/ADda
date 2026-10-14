/** Minimal ABI for MemoryRegistry.registerMemory */
export const memoryRegistryAbi = [
  {
    type: "function",
    name: "registerMemory",
    stateMutability: "nonpayable",
    inputs: [
      { name: "memoryId", type: "bytes32" },
      { name: "contentHash", type: "bytes32" },
      { name: "placeId", type: "bytes32" },
      { name: "layerId", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;
