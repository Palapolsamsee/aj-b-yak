export default defineNuxtConfig({
    runtimeConfig: {
      //private for test
    yakkaw_api:process.env.YAKKAW_API,
    apiUrl: process.env.NUXT_API_URL,
    baseair:process.env.BASE_API_ARI,
    oneyear:process.env.YEAR_API_ARI,
    colorange: process.env.NUXT_API_URL_COLORRANGE,

    //firebase test
    firebaseApiKey: process.env.NUXT_FIREBASE_APIKEY,
    firebaseAuthDomain: process.env.NUXT_FIREBASE_AUTHDOMAIN,
    firebaseProjectId: process.env.NUXT_FIREBASE_PROJECTID,
    firebaseStorageBucket: process.env.NUXT_FIREBASE_STORAGEBUCKET,
    firebaseMessagingSenderId: process.env.NUXT_FIREBASE_MESSAGINGSENDERID,
    firebaseAppId: process.env.NUXT_FIREBASE_APPID,

    
    //public for deploy
    public: {
      GOOGLEMAPAPI:process.env.GOOGLEMAP
    },
  },
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
