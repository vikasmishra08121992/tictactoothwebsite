import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 defaults this to [75] and requires anything else to be declared,
     * so the optimizer cannot be driven to arbitrary qualities by a crafted
     * URL. The photography is the product on this site — the painted murals
     * carry thin saturated lines that q75 visibly smears — so large photos ask
     * for PHOTO_QUALITY (see lib/images.ts) and everything small stays at 75.
     */
    qualities: [75, 88],
  },
};

export default nextConfig;
