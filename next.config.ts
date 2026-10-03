import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Roomie case study is a standalone static page in public/roomie/.
  async rewrites() {
    return [{ source: "/roomie", destination: "/roomie/index.html" }];
  },
};

export default nextConfig;
