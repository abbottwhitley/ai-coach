/** @type {import('next').NextConfig} */
import withPwa from "next-pwa";

const nextConfig = withPwa({
  dest: "public",
  swSrc: "/public/custom-service-worker.js",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest.json$/, /app-build-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
})({
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});

export default nextConfig;