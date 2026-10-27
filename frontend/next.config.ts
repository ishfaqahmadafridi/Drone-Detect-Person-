import type { NextConfig } from "next";
import deployment from "./src/constants/deployment.json";

const backendOrigin = (process.env.BACKEND_ORIGIN ||
  `http://${deployment.backendHost}:${deployment.backendPort}`).replace(/\/$/, "");

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Include multipart overhead above the 500 MB application upload limit.
    proxyClientMaxBodySize: "501mb",
    proxyTimeout: 600_000,
  },
  async rewrites() {
    return deployment.proxyPrefixes.map(prefix => ({
      source: `/${prefix}/:path*`, destination: `${backendOrigin}/${prefix}/:path*`,
    }));
  },
};

export default nextConfig;
