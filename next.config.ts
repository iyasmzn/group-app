import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline.html"
  },
  buildExcludes: [
    "app-build-manifest.json", // ⛔ exclude file ini
  ]
})(nextConfig);