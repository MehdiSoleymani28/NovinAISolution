import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure DATABASE_URL is available at build time for Prisma
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:" + path.join(process.cwd(), "db", "custom.db"),
  },
};

export default nextConfig;
