import { describe, expect, it } from "vitest";
import {
  analyzeMuralInput,
  buildArtworkHash,
  defaultMuralInput,
  hashString,
} from "./engine";

describe("mural engine determinism", () => {
  const base = defaultMuralInput({
    placeId: "place_tea_stall",
    styleSeed: "indiranagar-demo:place_tea_stall",
    epochSeed: "indiranagar-tea-epoch-2",
    tags: ["tea", "rain", "family", "tea", "friendship"],
    layerWeights: { NOW: 2, BEFORE_CHANGE: 2, CHILDHOOD_CAMPUS: 1 },
    relationCount: 5,
    archiveSize: 5,
    preservationScore: 0.45,
    previousArtworkHash: "demo:artwork:tea:1",
  });

  it("hashes identical strings stably", () => {
    expect(hashString("memory-streets")).toBe(hashString("memory-streets"));
  });

  it("produces the same artwork hash for identical inputs", () => {
    const a = analyzeMuralInput(base, ["mem_a", "mem_b"], "Epoch 2");
    const b = analyzeMuralInput(base, ["mem_a", "mem_b"], "Epoch 2");
    expect(a.artworkHash).toBe(b.artworkHash);
    expect(a.motifs).toEqual(b.motifs);
  });

  it("changes hash when archive tags change", () => {
    const a = buildArtworkHash(base, analyzeMuralInput(base, [], "E").motifs);
    const altered = {
      ...base,
      tags: [...base.tags, "bus", "road"],
    };
    const b = buildArtworkHash(
      altered,
      analyzeMuralInput(altered, [], "E").motifs,
    );
    expect(a).not.toBe(b);
  });
});
