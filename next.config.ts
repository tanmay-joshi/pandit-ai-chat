import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'googleusercontent.com',      // Other Google hosted images
      'googleapis.com'              // Google APIs
    ]
  }
};

export default nextConfig;
