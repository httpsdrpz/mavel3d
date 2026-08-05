import path from "path";

import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "picsum.photos",
    port: "",
    pathname: "/**",
    search: "",
  },
];

// Allow next/image to load product images from Supabase Storage once
// NEXT_PUBLIC_SUPABASE_URL is set (see .env.local / supabase/schema.sql).
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHost,
    port: "",
    pathname: "/storage/v1/object/public/**",
    search: "",
  });
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
