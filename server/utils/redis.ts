import Redis from "ioredis";

let client: Redis | null = null;

const buildRedis = () => {
  const url =
    process.env.REDIS_URL ??
    process.env.NUXT_REDIS_URL ??
    process.env.UPSTASH_REDIS_REST_URL;

  if (!url) return null;

  const redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableAutoPipelining: true,
  });

  redis.on("error", (err) => {
    console.error("[redis] connection error", err);
  });

  return redis;
};

export const getRedis = () => {
  if (client) return client;
  client = buildRedis();
  return client;
};

export const redisEnabled = () => Boolean(getRedis());

export const redisGetBuffer = async (key: string) => {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const data = await redis.getBuffer(key);
    return data ?? null;
  } catch (err) {
    console.warn("[redis] get failed", err);
    return null;
  }
};

export const redisSetBuffer = async (
  key: string,
  value: Buffer,
  ttlSeconds?: number
) => {
  const redis = getRedis();
  if (!redis) return;
  try {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.set(key, value, "EX", ttlSeconds);
    } else {
      await redis.set(key, value);
    }
  } catch (err) {
    console.warn("[redis] set failed", err);
  }
};
