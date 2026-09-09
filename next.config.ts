import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "softstar.s3.amazonaws.com",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default nextConfig;
