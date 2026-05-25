import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure DATABASE_URL is available at build time for Prisma
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./db/custom.db",
  },
};

export default nextConfig;
