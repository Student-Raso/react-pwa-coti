import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: 'prompt',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
  manifest: {
    name: 'React-vite-app',
    short_name: 'react-vite-app',
    description: 'I am a simple vite app',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any', // or 'favicon' depending on your preference
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any', // or 'favicon' depending on your preference
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
})

