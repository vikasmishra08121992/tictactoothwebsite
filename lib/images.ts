/**
 * Quality asked of the image optimizer for the clinic photography.
 *
 * Must be present in `images.qualities` in next.config.ts — Next 16 returns
 * 400 for a quality outside that allowlist rather than silently clamping.
 *
 * 88 rather than the default 75 because the rooms are decorated with painted
 * murals: fine saturated linework on pale grounds is the worst case for JPEG
 * and WebP chroma handling, and it is what a parent looks at first.
 */
export const PHOTO_QUALITY = 88;
