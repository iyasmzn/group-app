// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Group App',
    short_name: 'GroupApp',
    description: 'Aplikasi manajemen grup.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/vercel.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/vercel.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
