import { useRuntimeConfig } from "#imports";
import {
  createError,
  defineEventHandler,
  getMethod,
  getRequestHeaders,
  getQuery,
  readRawBody,
} from "h3";
import { joinURL, withQuery } from "ufo";
import { Agent } from "undici";
import { createHash } from "node:crypto";
import {
  redisEnabled,
  redisGetBuffer,
  redisSetBuffer,
} from "@/server/utils/redis";

const insecureHttpsAgent = new Agent({
  connect: { rejectUnauthorized: false },
});

const safeHeaders = (headers: Record<string, string | string[] | undefined>) => {
  // Drop hop-by-hop headers
  const forbidden = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
  ]);
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value) continue;
    if (forbidden.has(key.toLowerCase())) continue;
    out[key] = Array.isArray(value) ? value.join(",") : value;
  }
  return out;
};

const buildCacheKey = (relativePath: string, query: Record<string, any>) => {
  const sortedQuery = Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(",") : v}`)
    .join("&");
  const raw = `${relativePath || "root"}?${sortedQuery}`;
  return `airquality:${createHash("sha256").update(raw).digest("hex")}`;
};

const pickTtl = (relativePath: string) => {
  const lower = relativePath.toLowerCase();
  if (lower.includes("one_year_series")) return 60 * 60; // 1h
  if (lower.includes("week")) return 60 * 20; // ~20m
  return 60 * 3; // default 3m
};

export default defineEventHandler(async (event) => {
  const { airqualityProxyTarget, airqualityProxyAllowInsecure } =
    useRuntimeConfig();

  if (!airqualityProxyTarget) {
    throw createError({
      statusCode: 500,
      statusMessage: "airqualityProxyTarget is not configured",
    });
  }

  const upstreamBase = airqualityProxyTarget.replace(/\/$/, "");
  const slugParam = event.context.params?.path;
  const pathSegments = Array.isArray(slugParam)
    ? slugParam
    : slugParam
      ? [slugParam]
      : [];
  const relativePath = pathSegments.filter(Boolean).join("/");
  const query = getQuery(event);

  const targetUrl = withQuery(
    relativePath ? joinURL(upstreamBase, relativePath) : upstreamBase,
    query
  );

  const method = getMethod(event).toUpperCase();
  const cacheable = method === "GET" && redisEnabled();

  const fetchOptions =
    airqualityProxyAllowInsecure && targetUrl.startsWith("https://")
      ? { dispatcher: insecureHttpsAgent }
      : undefined;

  let cacheKey: string | null = null;
  if (cacheable) {
    cacheKey = buildCacheKey(relativePath, query);
    const cached = await redisGetBuffer(cacheKey);
    if (cached) {
      event.node.res.setHeader("Content-Type", "application/json");
      return cached;
    }
  }

  const headers = safeHeaders(getRequestHeaders(event));
  const body = method === "GET" ? undefined : await readRawBody(event);

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: body as any,
    ...fetchOptions,
  });

  const buf = Buffer.from(await response.arrayBuffer());
  const contentType =
    response.headers.get("content-type") ?? "application/json; charset=utf-8";

  if (cacheable && cacheKey) {
    await redisSetBuffer(cacheKey, buf, pickTtl(relativePath));
  }

  event.node.res.statusCode = response.status;
  event.node.res.setHeader("Content-Type", contentType);
  return buf;
});
