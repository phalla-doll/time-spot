import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TimeSpot - World Clock & Time Zone Converter',
    short_name: 'TimeSpot',
    description: 'Track time across multiple time zones with TimeSpot. A beautiful world clock app featuring real-time updates, weather information, and support for cities worldwide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}