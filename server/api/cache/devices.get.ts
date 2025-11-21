import { defineEventHandler } from "h3";
import { useRuntimeConfig } from "#imports";
import { redisEnabled, redisGetBuffer, redisSetBuffer } from "@/server/utils/redis";

const CACHE_KEY = "device:list";
const TTL_SECONDS = 60 * 10; // 10 minutes

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const upstream =
    (config.public as any)?.yakkaw_api ??
    (config as any)?.yakkaw_api ??
    process.env.YAKKAW_API ??
    "/api/devices";

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

  const res = await fetch(upstream, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`devices upstream error ${res.status}`);
  }
  const json = await res.json();

  if (redisEnabled()) {
    await redisSetBuffer(CACHE_KEY, Buffer.from(JSON.stringify(json)), TTL_SECONDS);
  }

  return json;
});
