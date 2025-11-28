import { defineEventHandler, useRuntimeConfig } from "#imports";

/**
 * Debug helper to verify what runtimeConfig is resolved at runtime.
 * Only returns public-facing values; safe to keep enabled.
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const pub = config.public as Record<string, unknown>;

  return {
    public: {
      apiUrl: pub.apiUrl,
      baseApiAri: pub.baseApiAri,
      baseAirApi: pub.baseAirApi,
      aqiWeekApi: pub.aqiWeekApi,
      yearApiAri: pub.yearApiAri,
      yakkawApi: pub.yakkawApi ?? pub.YAKKAW_API,
      apiUrlColorrange:
        pub.apiUrlColorrange ?? pub.colorange ?? pub.COLOUR ?? pub.colour,
      newsApi: pub.newsApi,
      googlemap: pub.googlemap ?? pub.GOOGLEMAPAPI,
    },
    private: {
      colorange: (config as any).colorange,
    },
  };
});
