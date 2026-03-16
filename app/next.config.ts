import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/content-strategy",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
