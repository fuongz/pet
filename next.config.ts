import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://*.supabase.co/**'), new URL('https://*.googleusercontent.com/**')],
  },
}

export default nextConfig
