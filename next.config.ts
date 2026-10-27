import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
      throw new Error("Falta configurar API_BASE_URL");
    }

    return [
      {
        source: "/api/backend/:path*",
        destination: `${baseUrl.replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
