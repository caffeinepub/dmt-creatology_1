/**
 * Global fallback images used when a listing has no image URL.
 * Each category has a dedicated banner image.
 */

export const FALLBACK_IMAGES = {
  event: "/assets/generated/default-event.dim_800x450.jpg",
  hotel: "/assets/generated/default-hotel.dim_800x450.jpg",
  vendor: "/assets/generated/default-vendor.dim_800x450.jpg",
  artist: "/assets/generated/default-artist.dim_800x450.jpg",
  // Generic fallbacks for other categories use the event banner
  venue: "/assets/generated/default-event.dim_800x450.jpg",
  food: "/assets/generated/default-vendor.dim_800x450.jpg",
  transport: "/assets/generated/default-hotel.dim_800x450.jpg",
  staff: "/assets/generated/default-vendor.dim_800x450.jpg",
} as const;

/**
 * Returns the image src with a fallback applied.
 * Use this in <img src={resolveImage(url, "event")} />
 */
export function resolveImage(
  url: string | undefined | null,
  category: keyof typeof FALLBACK_IMAGES,
): string {
  if (!url || url.trim() === "") {
    return FALLBACK_IMAGES[category];
  }
  return url;
}
