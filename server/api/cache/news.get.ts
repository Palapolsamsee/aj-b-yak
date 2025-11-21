import { defineEventHandler } from "h3";
import { useRuntimeConfig } from "#imports";
import { redisEnabled, redisGetBuffer, redisSetBuffer } from "@/server/utils/redis";

const CACHE_KEY = "news:list:v1";
const TTL_SECONDS = 60 * 45; // 45 minutes

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const upstream =
    (config.public as any)?.newsApi ??
    (config as any)?.newsApi ??
    process.env.NEWS_API ??
    null;

  if (!upstream) {
    return [];
  }

  if (redisEnabled()) {
    const cached = await redisGetBuffer(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached.toString("utf-8"));
      } catch {
        // ignore parse errors
      }
    }
  }

  const res = await fetch(upstream, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`news upstream error ${res.status}`);
  }
  const json = await res.json();

  if (redisEnabled()) {
    await redisSetBuffer(CACHE_KEY, Buffer.from(JSON.stringify(json)), TTL_SECONDS);
  }

  return json;
});
