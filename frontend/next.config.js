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
  
  // Experimental features
  experimental: {
    // Enable app directory (Next.js 13+ App Router)
    appDir: true
  },
  
  // Webpack configuration for additional optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configurations can be added here
    return config;
  },
  
  // Headers configuration for security and CORS
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // Redirects configuration
  async redirects() {
    return [
      // Redirect root to dashboard for authenticated users
      // Note: This will be handled by the app logic instead
    ];
  },
  
  // Rewrites configuration for API proxying in development
  async rewrites() {
    // In production, Choreo handles the API routing via connections
    // In development, you might want to proxy to local backend
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/choreo-apis/:path*',
          destination: 'http://localhost:3001/api/:path*'
        }
      ];
    }
    return [];
  }
};

module.exports = nextConfig;
