import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
          manifest: {
            name: 'GrooveEstrella: Music Recommender',
            short_name: 'GrooveEstrella',
            description: 'An app that provides music recommendation and other features too',
            theme_color: '#D40000',
            background_color: '#D40000',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: 'pwa-icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'pwa-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          },
        }),
        react(),
        tailwindcss(),
      ],
  server: {
    host: true, // Allows access from network devices
    // port: 5173, // (Optional) Change if needed
    // strictPort: true, // Ensures the port doesn’t change if 5173 is busy
  },
  
})
