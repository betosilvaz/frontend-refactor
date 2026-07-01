import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = (env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
  const escapedApiOrigin = apiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const apiPattern = new RegExp(`^${escapedApiOrigin}/api/.*`, 'i')

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['192x192.png', '512x512.png'],
        devOptions: {
          enabled: true,
        },
        manifest: {
          id: '/',
          name: 'Green Roof Atlas',
          short_name: 'GRA',
          description: 'Um atlas de telhados verdes para a cidade do Recife',
          lang: 'pt-BR',
          dir: 'ltr',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          theme_color: '#2ecc71',
          background_color: '#2ecc71',
          categories: ['maps', 'navigation', 'utilities'],
          icons: [
            {
              src: '/192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Buscar telhados',
              short_name: 'Buscar',
              url: '/search',
              description: 'Buscar telhados verdes cadastrados'
            },
            {
              name: 'Entrar',
              short_name: 'Entrar',
              url: '/login',
              description: 'Acessar a conta'
            },
            {
              name: 'Sobre',
              short_name: 'Sobre',
              url: '/about',
              description: 'Sobre o projeto'
            }
          ]
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/[a-c]\.basemaps\.cartocdn\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'carto-tiles',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'esri-tiles',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: apiPattern,
              method: 'GET',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: { statuses: [200] },
              },
            },
          ],
        },
      })
    ],
    server: {
      port: 5173,
      strictPort: false,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@config': path.resolve(__dirname, './src/config'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@providers': path.resolve(__dirname, './src/providers'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@routes': path.resolve(__dirname, './src/routes'),
      }
    }
  }
})
