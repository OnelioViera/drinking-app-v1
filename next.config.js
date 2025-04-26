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
  // Exclude test files from the build
  experimental: {
    excludeFiles: ['**/__tests__/**/*']
  }
};

module.exports = nextConfig; 