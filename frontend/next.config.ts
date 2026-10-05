import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Include multipart overhead above the 500 MB application upload limit.
    proxyClientMaxBodySize: "501mb",
    proxyTimeout: 600_000,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
      {
        source: "/snapshots/:path*",
        destination: "http://127.0.0.1:8000/snapshots/:path*",
      },
      {
        source: "/recordings/:path*",
        destination: "http://127.0.0.1:8000/recordings/:path*",
      },
      {
        source: "/ws/:path*",
        destination: "http://127.0.0.1:8000/ws/:path*",
      },
    ];
  },
};

export default nextConfig;
