import { resolve } from "node:path";

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
      baseair: process.env.NUXT_API_URL,
      baseAirApi: publicAirqualityBase,
      oneyear: process.env.YEAR_API_ARI,
      // Devices API base (match env name exactly for clarity)
      YAKKAW_API: process.env.YAKKAW_API ?? process.env.NUXT_PUBLIC_YAKKAW_API,
      GOOGLEMAPAPI: process.env.GOOGLEMAP,
      COLOUR: process.env.NUXT_API_URL_COLORRANGE,
      newsApi: process.env.NEWS_API,
    },
  },
  css: ["@/assets/css/main.css", "leaflet/dist/leaflet.css"],
  modules: ["@nuxtjs/leaflet", "@nuxtjs/tailwindcss", "nuxt-echarts"],
  devtools: { enabled: true },

  nitro: {
    alias: {
      // Force crossws to resolve from the root node_modules so import protection doesn't block the nested nitropack copy.
      crossws: resolve("./node_modules/crossws"),
      "crossws/adapters/node": resolve(
        "./node_modules/crossws/dist/adapters/node.mjs"
      ),
    },
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
