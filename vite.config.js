import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'EasyMarket - Offline Shopping List',
        short_name: 'EasyMarket',
        start_url: '.',
        display: 'standalone',
        theme_color: '#1d4ed8',
        background_color: '#ffffff',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Increase the limit to 5 MiB (5 * 1024 * 1024 bytes)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ]
})
