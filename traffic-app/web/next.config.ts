import type { NextConfig } from "next";

const flask = process.env.FLASK_URL || "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  async rewrites() {
    return [
      {
        source: "/static/:path*",
        destination: `${flask}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
