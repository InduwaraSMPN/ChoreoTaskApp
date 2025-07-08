/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Choreo deployment
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Base path configuration (if needed for subdirectory deployment)
  // basePath: '',
  
  // Asset prefix for CDN or subdirectory deployment
  // assetPrefix: '',
  
  // Trailing slash configuration
  trailingSlash: true,
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/choreo-apis',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Task Management',
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG || 'false'
  },
  
  // Note: headers, redirects, and rewrites are not supported with output: 'export'
  // These features are handled by Choreo's deployment infrastructure instead
};

module.exports = nextConfig;
