import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM + filesystem bindings; keep it out of the server bundle.
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async redirects() {
    return [
      // Removed pages redirect to the homepage.
      { source: "/education", destination: "/", permanent: true },
      { source: "/markets", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
