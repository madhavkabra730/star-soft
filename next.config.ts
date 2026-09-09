import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Emits a minimal .next/standalone server (only the files actually needed
  // at runtime) — keeps the production Docker image small.
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src")],
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default nextConfig;
