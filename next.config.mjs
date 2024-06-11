/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Advierte en lugar de fallar el build
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Advierte en lugar de fallar el build
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  