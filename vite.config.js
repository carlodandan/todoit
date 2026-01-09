import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';
import Sitemap from 'vite-plugin-sitemap'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [
          '**/*.{js,jsx,css,html,ico,png,jpg,jpeg,webp,svg,woff,woff2,ttf,eot,xml,txt}'
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      // Use injectManifest strategy instead of generateSW
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        name: 'TODOitApp',
        short_name: 'TODOitApp',
        start_url: '/',
        display: 'standalone',
        description: 'Web application for setting your TODO with push notifications',
        lang: 'en',
        dir: 'auto',
        theme_color: '#42b883',
        background_color: '#ffffff',
        orientation: 'any',
        iarc_rating_id: '662ee7fd-d1d4-4183-ba42-9c5501f1ed6e',
        icons: [
          {
            src: '/icons/todoapp_512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/todoapp_square.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/todoapp_192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: '/web/landingpage.png',
            sizes: '1600x805',
            type: 'image/png',
            form_factor: 'wide',
            description: 'A screenshot of the home page - web'
          },
          {
            src: '/mobile/landingpage.png',
            sizes: '360x755',
            type: 'image/png',
            form_factor: 'narrow',
            description: 'A screenshot of the home page - mobile'
          }
        ],
        related_applications: [],
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Privacy Policy',
            url: '/privacy',
            description: 'URL for Privacy Policy',
            icons: [{
              src: '/icons/todoapp_96x96.png',
              sizes: '96x96'
            }]
          },
          {
            name: 'License Agreement',
            url: '/license',
            description: 'URL for License Agreement',
            icons: [{
              src: '/icons/todoapp_96x96.png',
              sizes: '96x96'
            }]
          },
          {
            name: 'Support',
            url: '/support',
            description: 'URL for Support',
            icons: [{
              src: '/icons/todoapp_96x96.png',
              sizes: '96x96'
            }]
          },
          {
            name: 'Terms of Use',
            url: '/terms',
            description: 'URL for Terms of Use',
            icons: [{
              src: '/icons/todoapp_96x96.png',
              sizes: '96x96'
            }]
          }
        ],
        categories: [
          'lifestyle',
          'personalization',
          'productivity',
          'utilities'
        ]
      }
    }),
    Sitemap({ hostname: 'https://todoit.pages.dev/' }),
    tailwindcss(),
  ],
})