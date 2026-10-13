import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep AGENTS.md hand-maintained; next dev would otherwise append to it.
  agentRules: false,
  turbopack: { root: process.cwd() },
  // Photos are pre-optimized by scripts/process-photos.mjs and served from
  // /public, so the Next image optimizer is not used.
  images: { unoptimized: true },
  async redirects() {
    return [
      // Page on the previous Canva site.
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/portfolio/:path*", destination: "/work", permanent: true },
      { source: "/book", destination: "/contact", permanent: true },
      { source: "/booking", destination: "/contact", permanent: true },
      { source: "/work/concerts", destination: "/work/music", permanent: true },
      // Sports left the portfolio in October 2026.
      { source: "/work/sports", destination: "/work", permanent: false },
      { source: "/work/gator-gallop-2026", destination: "/work/gator-gallop", permanent: true },
      { source: "/work/its-all-a-blur-tour", destination: "/work/drake-j-cole-its-all-a-blur-tour", permanent: true },
      // Hidden for now; its photos and data are kept.
      { source: "/work/gator-jam", destination: "/work/music", permanent: false },
      // Project renamed when the Cicerones work split into two projects.
      { source: "/work/headshots", destination: "/work/florida-cicerones-general-body-headshots", permanent: true },
      { source: "/work/florida-cicerones", destination: "/work/florida-cicerones-recruitment-portraits", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/photos/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
