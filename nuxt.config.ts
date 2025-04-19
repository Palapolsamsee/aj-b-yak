// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css','leaflet/dist/leaflet.css',],
  modules: ['@nuxtjs/leaflet', '@nuxtjs/tailwindcss', 'nuxt-echarts'],
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend URL
        changeOrigin: true,
        prependPath: true,
        secure: false, // Disable SSL verification for local development
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
            ? process.env.CORS_ORIGIN_PROD 
            : process.env.CORS_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
          'Access-Control-Max-Age': '86400'
        }
      }
    }
  }
})