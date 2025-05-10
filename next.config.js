/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Setting the app directory as the source directory
  // since we're using the App Router
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
