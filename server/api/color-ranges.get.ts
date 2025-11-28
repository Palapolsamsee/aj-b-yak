import { defineEventHandler, useRuntimeConfig, createError } from "#imports";
import { $fetch } from "ofetch";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig() as any;
  const upstream =
    config.colorange ||
    config.apiUrlColorrange ||
    config.public?.apiUrlColorrange ||
    config.public?.colorange;

  if (!upstream) {
    throw createError({
      statusCode: 500,
      statusMessage: "Color range upstream not configured",
    });
  }

  return $fetch(upstream, {
    headers: { Accept: "application/json" },
  });
});
