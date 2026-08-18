import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
  // Phones on the same wifi hit the dev server by LAN address, not localhost.
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;
