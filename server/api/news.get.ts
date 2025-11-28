import { defineEventHandler, useRuntimeConfig, createError } from "#imports";
import { $fetch } from "ofetch";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig() as any;
  const upstream =
    config.newsApiUpstream ||
    config.newsApi ||
    config.public?.newsApiUpstream ||
    config.public?.newsApi;

  if (!upstream) {
    throw createError({
      statusCode: 500,
      statusMessage: "News upstream not configured",
    });
  }

  return $fetch(upstream, {
    headers: { Accept: "application/json" },
  });
});
