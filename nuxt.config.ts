const upstreamAirqualityBase =
  process.env.AIRQUALITY_API_BASE ??
  process.env.BASE_API_ARI ??
  "http://localhost:8080/api/airquality";

const publicAirqualityBase =
  process.env.BASE_API_ARI ??
  process.env.NUXT_API_URL ??
  upstreamAirqualityBase;

const allowInsecureAirqualityProxy =
  (process.env.AIRQUALITY_PROXY_ALLOW_INSECURE ?? "").toLowerCase() === "true";

export default defineNuxtConfig({
  runtimeConfig: {
    //private for test

    colorange: process.env.NUXT_API_URL_COLORRANGE,
    airqualityProxyTarget: upstreamAirqualityBase,
    airqualityProxyAllowInsecure: allowInsecureAirqualityProxy,

    //firebase test
    firebaseApiKey: process.env.NUXT_FIREBASE_APIKEY,
    firebaseAuthDomain: process.env.NUXT_FIREBASE_AUTHDOMAIN,
    firebaseProjectId: process.env.NUXT_FIREBASE_PROJECTID,
    firebaseStorageBucket: process.env.NUXT_FIREBASE_STORAGEBUCKET,
    firebaseMessagingSenderId: process.env.NUXT_FIREBASE_MESSAGINGSENDERID,
    firebaseAppId: process.env.NUXT_FIREBASE_APPID,

    //public for deploy
    public: {
      apiUrl: process.env.NUXT_API_URL,
      aqiweek: process.env.WEAK_API_ARI,
      baseair: publicAirqualityBase,
      baseAirApi: publicAirqualityBase,
      oneyear: process.env.YEAR_API_ARI,
      yakkaw_api: process.env.YAKKAW_API,
      GOOGLEMAPAPI: process.env.GOOGLEMAP,
      COLOUR: process.env.NUXT_API_URL_COLORRANGE,
    },
  },
  css: ["@/assets/css/main.css", "leaflet/dist/leaflet.css"],
  modules: ["@nuxtjs/leaflet", "@nuxtjs/tailwindcss", "nuxt-echarts"],
  devtools: { enabled: true },

  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8080", //dont forgot this
        changeOrigin: true,
        prependPath: true,
        secure: false,
        ws: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Max-Age": "86400",
        },
      },
    },
  },

  vite: {
    server: {
      allowedHosts: ["unreined-pseudomonastical-bethel.ngrok-free.dev"],
    },
    ssr: {
      noExternal: [
        "destr",
        "nitropack",
        "cookie-es",
        "unenv",
        "crossws", // เพิ่มตรงนี้
      ],
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2025-05-28",
});
