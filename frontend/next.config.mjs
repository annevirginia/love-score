/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
