import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Emits a minimal .next/standalone server (only the files actually needed
  // at runtime) — keeps the production Docker image small.
  output: "standalone",
  images: {
    // NFT artwork is served from the Starsoft/MKS challenge API's S3 bucket.
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
