import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM + filesystem bindings; keep it out of the server bundle.
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async redirects() {
    return [
      // Education was removed from the platform.
      { source: "/education", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
