export default defineNuxtConfig({
  css: ['@/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  modules: ['@nuxtjs/leaflet', '@nuxtjs/tailwindcss', 'nuxt-echarts'],
  devtools: { enabled: true },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        prependPath: true,
        secure: false,
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
          'Access-Control-Max-Age': '86400'
        }
      }
    }
  },

  vite: {
    ssr: {
      noExternal: [
        'destr',
        'nitropack',
        'cookie-es',
        'unenv',
        'crossws'  // เพิ่มตรงนี้
      ]
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  compatibilityDate: '2025-05-28'
})
