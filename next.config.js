/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during `next build` (CI/Netlify)
  eslint: { ignoreDuringBuilds: true },

  // Skip TypeScript type checking during `next build`
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
