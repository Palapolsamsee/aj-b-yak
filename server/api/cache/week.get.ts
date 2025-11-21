import { defineEventHandler } from "h3";
import { useRuntimeConfig } from "#imports";
import { redisEnabled, redisGetBuffer, redisSetBuffer } from "@/server/utils/redis";

const CACHE_KEY = "air:week:v1";
const TTL_SECONDS = 60 * 20; // ~20 minutes

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const baseAir =
    (config.public as any)?.baseAirApi ??
    (config.public as any)?.baseair ??
    process.env.BASE_API_ARI ??
    null;

  if (!baseAir) {
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

  const url = `${baseAir.replace(/\/$/, "")}/week`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`week upstream error ${res.status}`);
  }
  const json = await res.json();

  if (redisEnabled()) {
    await redisSetBuffer(CACHE_KEY, Buffer.from(JSON.stringify(json)), TTL_SECONDS);
  }

  return json;
});
