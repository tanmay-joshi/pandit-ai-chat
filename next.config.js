/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'googleusercontent.com',
      'storage.googleapis.com',
      'drive.google.com'
    ],
  },
};

module.exports = nextConfig; 