import { resolve } from "node:path";

const pickEnv = (...keys: string[]) =>
  keys
    .map((key) => process.env[key])
    .find((value) => typeof value === "string" && value.trim().length > 0);

const upstreamAirqualityBase =
  pickEnv("AIRQUALITY_API_BASE", "BASE_API_ARI", "NUXT_API_URL") ??
  "http://localhost:8080/api/airquality";

const runtimeDefaults = {
  apiUrl: pickEnv("NUXT_PUBLIC_API_URL", "NUXT_API_URL"),
  baseApiAri: pickEnv("NUXT_PUBLIC_BASE_API_ARI", "BASE_API_ARI"),
  aqiWeekApi: pickEnv("NUXT_PUBLIC_WEAK_API_ARI", "WEAK_API_ARI"),
  yearApiAri: pickEnv("NUXT_PUBLIC_YEAR_API_ARI", "YEAR_API_ARI"),
  yakkawApi: pickEnv("NUXT_PUBLIC_YAKKAW_API", "YAKKAW_API"),
  googlemap: pickEnv("NUXT_PUBLIC_GOOGLEMAP", "GOOGLEMAP"),
  apiUrlColorrange: pickEnv(
    "NUXT_PUBLIC_API_URL_COLORRANGE",
    "NUXT_PUBLIC_COLORANGE",
    "NUXT_PUBLIC_COLOUR",
    "NUXT_API_URL_COLORRANGE"
  ),
  newsApi: pickEnv("NUXT_PUBLIC_NEWS_API", "NEWS_API"),
};

const baseAirApi =
  runtimeDefaults.baseApiAri ??
  runtimeDefaults.apiUrl ??
  upstreamAirqualityBase;

const colorangeUpstream = runtimeDefaults.apiUrlColorrange;
const newsApiUpstream = runtimeDefaults.newsApi;

const allowInsecureAirqualityProxy = ["true", "1", "yes"].includes(
  (process.env.AIRQUALITY_PROXY_ALLOW_INSECURE ?? "").toLowerCase()
);

export default defineNuxtConfig({
  runtimeConfig: {
    //private for test

    // expose color range URL on both private/public; runtime env `NUXT_PUBLIC_API_URL_COLORRANGE` can override
    colorange: colorangeUpstream,
    newsApiUpstream,
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
      apiUrl: runtimeDefaults.apiUrl,
      baseApiAri: runtimeDefaults.baseApiAri,
      baseair: baseAirApi,
      baseAirApi,
      aqiWeekApi: runtimeDefaults.aqiWeekApi,
      oneyear: runtimeDefaults.yearApiAri ?? baseAirApi,
      yearApiAri: runtimeDefaults.yearApiAri,
      // Devices API base (camelCase so `NUXT_PUBLIC_YAKKAW_API` overrides correctly)
      yakkawApi: runtimeDefaults.yakkawApi,
      // Google maps key
      googlemap: runtimeDefaults.googlemap,
      // Color ranges (allow multiple names)
      apiUrlColorrange: "/api/color-ranges",
      colorange: "/api/color-ranges",
      COLOUR: "/api/color-ranges",
      // News feed
      newsApi: "/api/news",
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
    Proxy: {
      "/api": {
        target: "https://yakkaw-administration.up.railway.app", //dont forgot this
        changeOrigin: true,
        prependPath: true,
        secure: false,
        ws: true,
        headers: {
          "Access-Control-Allow-Origin": "*,https://yakkaw-administration.up.railway.app,https://yakkaw-administration.up.railway.app*",
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
