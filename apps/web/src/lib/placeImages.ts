/**
 * Place covers — real aesthetic Unsplash photos (not cartoons).
 */

import { aestheticCoverForPlace } from "@/lib/storyImages";

/** Prefer aesthetic Unsplash cover for place thumbnails. */
export function imageForPlace(
  placeId: string,
  _tags: string[] = [],
): { imageUrl: string | null; imageAlt: string } {
  const imageUrl = aestheticCoverForPlace(placeId);
  return {
    imageUrl,
    imageAlt: "Aesthetic photograph related to this place",
  };
}

export function exteriorImageForPlace(placeId: string): string | null {
  return aestheticCoverForPlace(placeId);
}
