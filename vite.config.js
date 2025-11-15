import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // All files VitePWA should copy & cache offline
      includeAssets: [
  'favicon.ico',
  'apple-touch-icon.png',
  'icons/*.png',
  'src/assets/logo.png'  // <-- make sure path matches import
],


      manifest: {
        name: 'EasyMarket - Offline Shopping List',
        short_name: 'EasyMarket',
        start_url: '.',
        display: 'standalone',
        theme_color: '#1d4ed8',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        // Allow large CSS/JS files to be cached
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ]
})
