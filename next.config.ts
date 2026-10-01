import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps review screenshots free of the dev overlay badge.
  devIndicators: false,
};

export default nextConfig;
