import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ konfigurasi image agar bisa load dari Cloudinary, Supabase, dll
  images: {
    domains: ["res.cloudinary.com"], // cara lama
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // contoh tambahan kalau pakai Supabase Storage:
      // {
      //   protocol: "https",
      //   hostname: "your-project.supabase.co",
      //   pathname: "/storage/v1/object/public/**",
      // },
    ],
  },

};

export default withPWA({
  disable: process.env.NODE_ENV === "development",
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