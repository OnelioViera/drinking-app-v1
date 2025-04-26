/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore test files during build
  webpack: (config) => {
    // Add rule to ignore test files
    config.module.rules.push({
      test: /\.(test|spec)\.(ts|tsx)$/,
      loader: 'ignore-loader'
    });
    return config;
  },
  // Ignore test directories
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Configure Turbopack
  experimental: {
    turbo: {
      rules: {
        // Exclude test files from the build
        '**/__tests__/**/*': ['ignore']
      }
    }
  }
};

module.exports = nextConfig; 