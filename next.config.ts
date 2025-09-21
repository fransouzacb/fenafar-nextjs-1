import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Ignorar scripts de desenvolvimento
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/dev-scripts/**',
        '**/scripts/**',
        '**/node_modules/**',
      ],
    };
    return config;
  },
};

export default nextConfig;
